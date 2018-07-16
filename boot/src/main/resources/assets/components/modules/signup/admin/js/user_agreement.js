var UserAgreementAdmin = function (selector) {
        this.init(selector);
    };

$.extend(UserAgreementAdmin.prototype, {
    $container: null,
    oEditors: [],

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.tableProvisions = me.$container.find('#table-provisions');
        me.initBootstrapTable();
        me.initEventHandlers();
        me.getListProvision();
    },

    initModuleSignupInfo: function(signup){
        var me = this;
        var ele = me.$container.find('input[name=provisionAgreeYn]');
        if(signup['provisionAgreeYn']) {
            me.check(ele);
        } else {
            me.unCheck(ele);
        }
    },

    initEventHandlers: function(){
        var me = this;

        me.$container.on('click', '#save-agreement', function (e) {
            e.preventDefault();
            var listPro = me.tableProvisions.bootstrapTable('getData');
            var result = me.buildListProvision(listPro);
            if(result.length > 0) {
                me.updateListProvision(result);
            }
            var moduleSignupUpdated = me.updateAgreementYn(signupAdminModuleController.currModuleSignup);
            signupAdminModuleController.updateModuleSignup(moduleSignupUpdated, userAgreementAdmin, false);
        });

        me.$container.on('click', '#cancel-agreement', function (e) {
            e.preventDefault();
            me.getListProvision();
            me.initModuleSignupInfo(signupAdminModuleController.currModuleSignup);
        });

        me.$container.on('click', '#add-agreement', function (e) {
            e.preventDefault();
            me.addProvision();
        });

        me.tableProvisions.on('click', '.delete-agreement', function (e) {
            e.preventDefault();
            var provisionNo = $(e.currentTarget).attr('data-value');
            var title = mugrunApp.getMessage('common.btn.delete');
            var message = siteAdminApp.getMessage('signup.delete.provision.message');
            var type = BootstrapDialog.TYPE_WARNING;
            var textCancelLabel = mugrunApp.getMessage('common.btn.cancel');
            var textOKLabel = mugrunApp.getMessage('common.btn.ok');
            var buttonOKClass = 'green';
            var buttonCancelClass = 'btn-outline green';
            var callbackFunc = me.deleteProvision;
            var paramsForCallbackFunc = provisionNo;
            mugrunApp.showConfirmDialog(title, message, type, textOKLabel, textCancelLabel , buttonCancelClass, buttonOKClass, undefined, undefined,  callbackFunc, paramsForCallbackFunc);
        });

    },

    initSmartEditorProvisions: function(list) {
        var me = this;

        for(var i = 0; i < list.length; i++) {
            var provision = list[i];
            if(provision) {
                nhn.husky.EZCreator.createInIFrame({
                    oAppRef: me.oEditors,
                    elPlaceHolder: 'provisionContent' + provision.provisionNo,
                    sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
                    fCreator: "createSEditor2",
                    htParams: {
                        bUseToolbar: true,
                        fOnBeforeUnload: true
                    },
                    fOnAppLoad : function(){
                        me.loadDataToSmartEditor(me.currProvisionList);
                    }
                });
            }
        }
    },

    loadDataToSmartEditor: function(list){
        var me = this;
        for(var i = 0; i < list.length; i++) {
            var provision = list[i];
            var editor = me.oEditors.getById['provisionContent' + provision.provisionNo];
            if (editor && typeof editor.setIR == 'function') {
                editor.setIR(provision.provisionContent);
            }
        }
    },

    initBootstrapTable: function(){
        var me = this;

        me.tableProvisions.bootstrapTable({
            height: '500',
            classes: 'table',
            smartDisplay: false,
            showHeader : false,
            pagination : false,
            columns: [
                {
                    field: 'provisionNo',
                    title: 'Provision No',
                    formatter: function(value,object){
                        var tmpCheckbox = '';
                        if(object.baseAgreementYn){
                            tmpCheckbox = '<label class="control-label"> <input type="checkbox" checked name="baseAgreementYn" id="baseAgreementYn' + value + '"> 필수항목으로 설정 </label> ';
                        } else {
                            tmpCheckbox = '<label class="control-label"> <input type="checkbox" name="baseAgreementYn" id="baseAgreementYn' + value + '"> 필수항목으로 설정 </label> ';
                        }
                        return '<form class="form">' +
                                    '<div class="form-body"> ' +
                                        '<div class="form-group"> ' +
                                            '<label class="control-label">제목: </label> ' +
                                            '<input type="text" class="input-provision-name" id="provisionName' + value + '" value="' + object.provisionName + '"/>'
                                             + tmpCheckbox +
                                            '<button type="button" class="btn btn-sm btn-circle btn-outline green pull-right delete-agreement" data-value="' + object.provisionNo + '"><i class="glyphicon glyphicon-remove"></i> 삭제</button> ' +
                                        '</div>' +
                                        '<div class="form-group"> ' +
                                            '<textarea id="provisionContent' + value + '" name="provisionContent' + value + '" style="width:100%; height:250px;" class="inbox-editor inbox-wysihtml5 form-control" rows="10"></textarea>' +
                                        '</div>'
                                    '</div> ' +
                                '</form>';
                    }
                }
            ]
        });
    },

    getListProvision : function(){
        var me = this;

        $.ajax({
            url: '/admin/signup/listProvision.json',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    var list = data.data;

                    me.tableProvisions.bootstrapTable("load" , list);

                    me.currProvisionList = list;
                    me.initSmartEditorProvisions(list);

                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                me.$container.unmask();
            }
        });
    },

    deleteProvision: function(provisionNo){
        var me = userAgreementAdmin;

        $.ajax({
            url: '/admin/signup/provision/delete',
            type: 'GET',
            dataType: 'json',
            data: {
                provisionNo: provisionNo
            },
            success: function(data) {
                if (data.success) {
                    me.getListProvision();
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                me.$container.unmask();
            }
        });
    },

    addProvision: function(){
        var me = this;

        $.ajax({
            url: '/admin/signup/provision/add',
            type: 'GET',
            success: function(data) {
                if (data.success) {
                    me.getListProvision();
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                me.$container.unmask();
            }
        });
    },
    updateListProvision : function(list){
        var me = this;

        $.ajax({
            url: '/admin/signup/listProvision/update',
            type: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(list),
            success: function(data) {
                if (data.success) {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.alert.dialog.message.saved'));
                    me.getListProvision();
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                me.$container.unmask();
            }
        });
    },

    buildListProvision: function(list){
        var me = this;
        var result = [];
        for(var i = 0; i < list.length; i ++){
            var pro = list[i];
            pro.provisionName = me.tableProvisions.find('#provisionName' + pro.provisionNo)[0].value;
            if(me.tableProvisions.find('#baseAgreementYn' + pro.provisionNo)[0].checked) {
                pro.baseAgreementYn = 1;
            } else {
                pro.baseAgreementYn = 0;
            }
            pro.provisionContent = me.oEditors.getById['provisionContent' + pro.provisionNo].getIR();
            result.push(pro);
        }
        return result;
    },

    updateAgreementYn: function(moduleSignup){
        var me = this;
        var provisionAgreeYn = me.$container.find('input[name=provisionAgreeYn]');
        if(me.isCheck(provisionAgreeYn)) {
            moduleSignup['provisionAgreeYn'] = 1 ;
        } else {
            moduleSignup['provisionAgreeYn'] = 0 ;
        }
        return moduleSignup;
    },

    unCheck: function(cb) {
        if($(cb).parent().hasClass('checked')) {
            $(cb).prop("checked", false);
            $(cb).parent().removeClass('checked');
        }
    },
    check: function(cb) {
        if(!$(cb).parent().hasClass('checked')) {
            $(cb).click();
        }
    },

    isCheck: function(cb){
        if($(cb).parent().hasClass('checked')) {
            return true;
        }
        return false;
    }

});

var userAgreementAdmin = new UserAgreementAdmin('#container-user-agreement');

