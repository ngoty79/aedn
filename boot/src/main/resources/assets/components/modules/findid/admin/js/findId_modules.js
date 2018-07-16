var FindIdModuleController = function (selector) {
    this.init(selector);
};

$.extend(FindIdModuleController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.containerTable           = me.$container.find('#table-list-module');
        me.tableListAction          = me.$container.find('#table-list-action');
        me.$modalAddModuleFindid    = me.$container.find('#model-findId-addModule');
        me.$formAddModule           = me.$container.find('#form-findId-addModule');

        me.initTable();
        me.loadDataTable(true);
        me.initEventHandlers();
        me.checkInputSearch();

    },

    initTable : function(){
        var me = this;
        me.containerTable.bootstrapTable({
            height: 598,
            showHeader : false,
            pagination : true,
            pageSize: 15,
            columns: [
                {
                    cellStyle: function(value, row, index) {
                        return {
                            classes: 'checkbox-item'
                        }
                    },
                    formatter: function(value,object){
                        return '<input type="checkbox" class="checkbox-item" data-value="' + object.moduleNo + '">';
                    }
                }
                , {
                    field: 'moduleTitle',
                    title: 'Module Title',
                    formatter: function(value,object){
                        return '<i class="fa fa-user"></i> <span>'+ object.moduleTitle + '</span>';
                    }
                }, {
                    field: 'moduleNo',
                    title: 'Module No',
                    formatter: function(value,object){
                        return ' <div class="dataNo hide">' + object.moduleNo + '</div>';
                    }
                }
            ]
        });
    },

    loadDataTable: function(loadFirstItem) {
        var me = this;

        var field = me.$container.find('select[name="optSearch"]').val();
        var keyword = me.$container.find('input[name="textSearch"]').val();
        $.ajax({
            url: '/admin/findid/loadModules.json',
            type: 'GET',
            dataType: 'json',
            data: {
                field: field,
                keyword : keyword
            },
            success: function(response) {
                if (response.success) {
                    var data = response.data;

                    var dataTb = me.formatDataTable(data);
                    me.containerTable.bootstrapTable("load" , dataTb);

                    if (loadFirstItem && data.length > 0) {
                        var firstItemNo = data[0].moduleNo;
                        me.loadFirstItem(firstItemNo);
                    }

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
    loadFirstItem : function(firstItemNo){
        var me = this;
        me.containerTable.find('tbody tr td input:first-child')[0].click();
        me.loadDetailModul(firstItemNo);
    },
    formatDataTable : function(items){
        var data = [];
        for(var i = 0; i < items.length; i++){
            var item = items[i];
            var temp = {};
            temp.moduleNo = item.moduleNo;
            temp.moduleTitle = item.moduleTitle + ' (' + item.moduleNo + ') ';
            data.push(temp);
        }
        return data;
    },
    initEventHandlers:function() {
        var me = this;

        me.tableListAction.find('#text-search').keydown(function(event) {
            setTimeout(function() {me.checkInputSearch();},1);
        });

        me.tableListAction.on('click', '#search-clear', function(){
            me.tableListAction.find('#text-search').val("");
            me.loadDataTable(true);
            me.tableListAction.find('#search-clear').addClass('hide');
        });

        me.$container.on('click', 'table#table-list-module > tbody > tr', function (e) {
            if(e.target.type != 'checkbox') {
                me.$container.find('input.checkbox-item:checked').click();
                jQuery(e.currentTarget).find('input').click();
                var dataNo = $(this).find('div.dataNo').text();
                //me.currentNo = dataNo;
                me.loadDetailModul(dataNo);
            }
        });

        me.$container.on('click', 'i#btn-search', function (e) {
            e.preventDefault();
            me.loadDataTable(true);
        });

        me.$container.on('click', 'button#btn-delete', function (e) {
            e.preventDefault();

            var allItem = me.$container.find('input.checkbox-item:checked');
            var allNo = [];
            $.each(allItem, function(i, item){
                allNo.push($(item).attr('data-value'));
            });
            if(allNo.length > 0) {
                var title = siteAdminApp.getMessage('admin.delete.user.title');
                var message = siteAdminApp.getMessage('admin.delete.user.message');
                var type = BootstrapDialog.TYPE_WARNING;
                var textCancelLabel = mugrunApp.getMessage('common.btn.cancel');
                var textOKLabel = mugrunApp.getMessage('common.btn.ok');
                var buttonOKClass = 'btn-outline green';
                var buttonCancelClass = 'green';
                var callbackFunc = me.deleteItem;
                var paramsForCallbackFunc = allNo;
                mugrunApp.showConfirmDialog(title, message, type, textCancelLabel, textOKLabel, buttonOKClass, buttonCancelClass, callbackFunc, paramsForCallbackFunc);
            } else {
                mugrunApp.alertMessage(siteAdminApp.getMessage('user.delete.select.user'));
            }
        });

        me.$container.on('click', 'button#btn-add', function (e) {
            e.preventDefault();
            me.$formAddModule[0].reset();
            if(me.$formAddModule.data('formValidation')) {
                me.$formAddModule.data('formValidation').destroy();
            }
            me.initFormValidation();
            me.$modalAddModuleFindid.modal({backdrop: 'static', show: true});
        });

        me.$container.on('click', 'button#btn-select-all', function (e) {
            e.preventDefault();
            var itemNotCheck = me.$container.find('input.checkbox-item:not(:checked)');
            if(itemNotCheck.length == 0) {
                me.$container.find('input.checkbox-item').click();
            } else {
                itemNotCheck.click();
            }
        });

        me.$modalAddModuleFindid.on('click', 'button.btn-dialog-save', function (e) {
            e.preventDefault();
            me.addModule();
        });
    },
    checkInputSearch : function(){
        var me = this;
        if(me.tableListAction.find('#text-search').val() != ""){
            me.tableListAction.find('#search-clear').removeClass('hide');
        } else {
            if(!me.tableListAction.find('#search-clear').hasClass('hide')) {
                me.tableListAction.find('#search-clear').addClass('hide');
            }
        }
    },
    deleteItem : function(listNo){
        var me = findIdModuleController;

        $.ajax({
            url: '/admin/findid/deleteModules.json',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                listNo: JSON.stringify(listNo)
            },
            success: function(data) {
                if (data.success) {
                    mugrunApp.alertMessage(siteAdminApp.getMessage('user.delete.success'));
                    // load again
                    me.loadDataTable(true);
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

    initFormValidation: function() {
        var me = this;

        me.$formAddModule.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'moduleTitle': {
                    row: '.controls',
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            max: 256,
                            message: siteAdminApp.getMessage('common.validation.field.maxlength', {maxLength: 256})
                        }
                    }
                },
                moduleDesc: {
                    row: '.controls',
                    validators: {
                        stringLength: {
                            max: 1024,
                            message: siteAdminApp.getMessage('common.validation.field.maxlength', {maxLength: 1024})
                        }
                    }
                }
            }
        });
    },
    addModule: function(){
        var me = this;

        var formValidation = me.$formAddModule.data('formValidation');

        formValidation.validate();
        if (!formValidation.isValid()) {
            return;
        } else{
            var data = {};
            data['moduleTitle'] = me.$formAddModule.find('input[name=moduleTitle]').val();
            data['moduleDesc'] = me.$formAddModule.find('textarea[name=moduleDesc]').val();

            $.ajax({
                url: '/admin/findid/addModule.json',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(data) {
                    if (data.success) {
                        me.$modalAddModuleFindid.modal('hide');
                        me.loadDataTable(true);
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    me.$modalAddModuleFindid.find('#btn_addModule-save').prop('disabled', true);
                    me.$container.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    me.$modalAddModuleFindid.find('#btn_addModule-save').prop('disabled', false);
                    me.$container.unmask();
                }
            });
        }
    },

    loadDetailModul: function(moduleNo) {
        findIdController.loadData(moduleNo);
        findPasswordController.loadData(moduleNo);
    }
});