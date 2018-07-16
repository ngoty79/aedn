var UserPointIndexController = function (selector) {
    this.init(selector);
};

$.extend(UserPointIndexController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.tableUserPointList           = me.$container.find('#table-user-point-list');
        me.containerUserPointSearch     = me.$container.find('#user-point-search');
        me.containerUserPointActions    = me.$container.find('#user-point-actions');
        me.$modalUserAddPoint           = me.$container.find('#modal-user-add-point');
        me.$formUserAddPoint            = me.$modalUserAddPoint.find('#form-user-add-point');

        me.initBootstrapTable();
        me.loadUserPointList();
        me.checkInputSearchPoint();
        me.initEventHandlers();
    },

    initEventHandlers: function() {
        var me = this;

        me.containerUserPointSearch.find('#text-search-user-point').keydown(function (event) {
            setTimeout(function () {
                me.checkInputSearchPoint();
                var fieldSearchUser = me.containerUserPointSearch.find('select[name="fieldSearchUser"]').val();
                var textSearchUser = me.containerUserPointSearch.find('input[name="textSearchUser"]').val();
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13') {
                    if (textSearchUser != '') {
                        me.loadUserPointList(fieldSearchUser, textSearchUser);
                    } else {
                        me.loadUserPointList();
                    }
                }
            }, 1);
        });

        me.containerUserPointSearch.on('click', '#search-clear-user-point', function(e){
            e.preventDefault();
            me.containerUserPointSearch.find('#text-search-user-point').val("");
            //me.loadUserPointList();
            me.containerUserPointSearch.find('#search-clear-user-point').addClass('hide');
        });

        me.containerUserPointSearch.on('click', 'i.pointer-click-icon', function (e) {
            e.preventDefault();
            var fieldSearchUser = me.containerUserPointSearch.find('select[name="fieldSearchUser"]').val();
            var textSearchUser = me.containerUserPointSearch.find('input[name="textSearchUser"]').val();
            if(textSearchUser != ''){
                me.loadUserPointList(fieldSearchUser, textSearchUser);
            } else {
                me.loadUserPointList();
            }
        });

        me.containerUserPointActions.on('click', '#btn-select-all-point', function (e) {
            e.preventDefault();
            var itemNotCheck = me.tableUserPointList.find('input.checkbox-item:not(:checked)');
            if(itemNotCheck.length == 0) {
                me.tableUserPointList.find('input.checkbox-item').click();
            } else {
                itemNotCheck.click();
            }
        });

        me.containerUserPointActions.on('click', '#btn-delete-selected-point', function (e) {
            e.preventDefault();
            var allItem = me.tableUserPointList.find('input.checkbox-item:checked');
            var allPointNo = [];
            $.each(allItem, function(i, item){
                allPointNo.push($(item).attr('data-value'));
            });
            if(allPointNo.length > 0) {
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = siteAdminApp.getMessage('user.point.delete.message');
                var type = BootstrapDialog.TYPE_PRIMARY;
                var textCancelLabel = mugrunApp.getMessage('common.btn.no');
                var textOKLabel = mugrunApp.getMessage('common.btn.yes');
                var buttonOKClass = 'green';
                var buttonCancelClass = 'btn-outline green';
                var callbackFunc = me.deleteUserPoint;
                var paramsForCallbackFunc = allPointNo;
                mugrunApp.showConfirmDialog(title, message, type, textOKLabel, textCancelLabel , buttonCancelClass, buttonOKClass, undefined, undefined,  callbackFunc, paramsForCallbackFunc);
            } else {
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = siteAdminApp.getMessage('user.point.no.select.message');
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
            }
        });

        me.containerUserPointActions.on('click', '#btn-add-user-point', function (e) {
            e.preventDefault();
            var checkbox = me.tableUserPointList.find('input.checkbox-item:checked');
            if(checkbox.length > 0) {
                me.$formUserAddPoint[0].reset();
                if (me.$formUserAddPoint.data('formValidation')) {
                    me.$formUserAddPoint.data('formValidation').destroy();
                }
                me.initFormUAPValidation();
                // get first select user point
                var ele = $(checkbox[0]);
                me.$modalUserAddPoint.find('input[name=userNo]').val(ele.attr('data-user-no'));
                me.$modalUserAddPoint.find('input[name=userID]').val(ele.attr('data-user-id'));
                me.$modalUserAddPoint.modal({backdrop: 'static', show: true});
            } else {
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = siteAdminApp.getMessage('user.point.add.point.no.select.message');
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
            }
        });

        me.$modalUserAddPoint.on('click', '#btn-add-point-save', function(e){
            e.preventDefault();
            var formValidation = me.$formUserAddPoint.data('formValidation');

            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else {
                var userPointData = me.buildUserPointModal();
                me.createUserPoint(userPointData);
            }
        });

        /*me.tableUserPointList.on('click', 'tbody > tr', function (e) {
            if(e.target.type != 'checkbox') {
                me.tableUserPointList.find('input.checkbox-item:checked').click();
                jQuery(e.currentTarget).find('input').click();
            }
        });*/

        me.tableUserPointList.on('click', '.select-user-id', function (e) {
            var userId = $(e.currentTarget).text();
            me.loadUserPointList('searchId', userId, userId);
        });
    },

    initBootstrapTable : function() {
        var me = this;
        me.tableUserPointList.bootstrapTable({
            url: '/admin/userpoint/list.json',
            smartDisplay: false,
            pageSize: 15,
            pagination: true,
            uniqueId: 'pointNo',
            classes: 'table',
            paginationHAlign: 'center',
            sidePagination: 'server',
            queryParamsType: '',
            queryParams: function(params) {
                return params;
            },
            columns: [
                {
                    cellStyle: function (value, row, index) {
                        return {
                            classes: 'checkbox-item'
                        }
                    },
                    title: '선택',
                    align: 'center',
                    width: '5%',
                    formatter: function (value, object) {
                        return '<input type="checkbox" class="checkbox-item" data-user-no="'+ object.userNo+'"' +
                            ' data-user-id="'+ object.userID +'" data-value="' + object.pointNo + '">';
                    }
                },
                {
                    field: 'userID',
                    sortable: true,
                    width: '10%',
                    title: '아이디',
                    formatter: function (value, object) {
                        return '<a class="select-user-id" href="javascript:void(0)">' + value +'</a>';
                    }
                },
                {
                    field: 'userName',
                    sortable: true,
                    width: '15%',
                    title: '이름'
                },
                {
                    field: 'userNickname',
                    sortable: true,
                    width: '15%',
                    title: '닉네임'
                },
                {
                    field: 'regDateStr',
                    sortable: true,
                    width: '20%',
                    title: '일시',
                    formatter: function(value){
                        if(value != null) {
                            return value;
                        } else {
                            return '';
                        }
                    }
                },
                {
                    field: 'pointName',
                    sortable: true,
                    width: '15%',
                    title: '포인트 내용',
                    formatter: function(value){
                        if(value != null) {
                            return value;
                        } else {
                            return '';
                        }
                    }
                },
                {
                    field: 'pointValue',
                    sortable: true,
                    width: '10%',
                    title: '부여 포인트',
                    formatter: function(value){
                        if(value != null) {
                            return mugrunApp.formatNumber(value);
                        } else {
                            return 0;
                        }
                    }
                },
                {
                    field: 'usePointValue',
                    sortable: true,
                    width: '10%',
                    title: '사용 포인트',
                    formatter: function(value){
                        if(value != null) {
                            return mugrunApp.formatNumber(value);
                        } else {
                            return 0;
                        }
                    }
                }
            ]
        });
    },

    initFormUAPValidation: function (){
        var me = this;

        me.$formUserAddPoint.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'userID': {
                    row: '.controls',
                    validators: {
                        notEmpty: {}
                    }
                },
                'pointName': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: siteAdminApp.getMessage('user.point.no.input.point.name.message')
                        },
                        stringLength: {
                            max: 256,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 256})
                        }
                    }
                },
                pointValue: {
                    row: '.controls',
                    validators: {
                        notEmpty: {},
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                }
            }
        })
        // Showing only one message each time
        .on('err.validator.fv', function(e, data) {
            // $(e.target)    --> The field element
            // data.fv        --> The FormValidation instance
            // data.field     --> The field name
            // data.element   --> The field element
            // data.validator --> The current validator name

            data.element
                .data('fv.messages')
                // Hide all the messages
                .find('.help-block[data-fv-for="' + data.field + '"]').hide()
                // Show only message associated with current validator
                .filter('[data-fv-validator="' + data.validator + '"]').show();
        });
    },

    loadUserPointList: function(field, keyword, selectUserId) {
        var me = this;

        var url = '/admin/userpoint/list.json?field=' + field + '&keyword=' + keyword;
        me.tableUserPointList.bootstrapTable('refresh', {url: url});

        var data = {};
        if(field && keyword) {
            data.field = field;
            data.keyword  =  keyword;
        }

        $.ajax({
            url: '/admin/userpoint/calculate.json',
            type: 'GET',
            dataType: 'json',
            data : data,
            success: function(data) {
                if (data.success) {
                    var result = data.data;

                    var lengthPoint = 0;
                    var sumPoint = 0;
                    if(result.length > 0){
                        lengthPoint = result[0];
                    }
                    if(result.length > 1){
                        sumPoint = result[1];
                    }

                    me.calculatePointCount(lengthPoint, sumPoint, selectUserId);

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

    deleteUserPoint : function(pointNos){
        var me = userPointIndexController;

        $.ajax({
            url: '/admin/userpoint/delete',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                pointNos: pointNos.join(',')
            },
            success: function(data) {
                if (data.success) {
                    var title = mugrunApp.getMessage('common.alert.dialog.title');
                    var message = mugrunApp.getMessage('common.alert.dialog.message.deleted');
                    var type = BootstrapDialog.TYPE_PRIMARY;
                    var buttonLabel = mugrunApp.getMessage('common.close');
                    var buttonClass = 'btn blue';
                    mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
                    // load again
                    me.loadUserPointList();
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

    createUserPoint : function(userPointData){
        var me = this;
        $.ajax({
            method: 'POST',
            url: "/admin/userpoint/create",
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(userPointData),
            success: function(data) {
                if (data.success) {
                    me.$modalUserAddPoint.modal('hide');
                    var title = mugrunApp.getMessage('common.alert.dialog.title');
                    var message = siteAdminApp.getMessage('user.point.message.saved');
                    var type = BootstrapDialog.TYPE_PRIMARY;
                    var buttonLabel = mugrunApp.getMessage('common.close');
                    var buttonClass = 'btn blue';
                    mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);

                    // load again
                    me.loadUserPointList();
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

    buildUserPointModal: function() {
        var me = this;
        var userPoint = {};
        var userNo = me.$modalUserAddPoint.find('input[name=userNo]').val();
        var pointName = me.$modalUserAddPoint.find('input[name=pointName]').val();
        var pointValue = me.$modalUserAddPoint.find('input[name=pointValue]').val();
        userPoint.userNo = userNo;
        userPoint.pointName = pointName;
        userPoint.pointValue = pointValue;

        return userPoint;
    },

    calculatePointCount : function(lengthPoint, sumPoint, selectUserId){
        var me = this;
        me.containerUserPointSearch.find('#point-count').text(mugrunApp.formatNumber(lengthPoint));

        me.containerUserPointSearch.find('#point-sum').text(mugrunApp.formatNumber(sumPoint));

        if(selectUserId != undefined) {
            me.containerUserPointSearch.find('#point-user-id').text('(' +  selectUserId + siteAdminApp.getMessage('user.point.label.point'));
            me.containerUserPointSearch.find('#label-point-sum').text(siteAdminApp.getMessage('user.point.label.sum.point'));
            me.containerUserPointSearch.find('select[name="fieldSearchUser"]').val('searchId');
            me.containerUserPointSearch.find('input[name="textSearchUser"]').val(selectUserId);
        } else {
            me.containerUserPointSearch.find('#point-user-id').text('');
            me.containerUserPointSearch.find('#label-point-sum').text('(' + siteAdminApp.getMessage('user.point.label.sum.point'));
        }
    },

    checkInputSearchPoint : function(){
        var me = this;
        me.checkInputSearch(me.containerUserPointSearch, '#text-search-user-point', '#search-clear-user-point');
    },

    checkInputSearch : function(container, inputTextSearch, iconClear){

        if(container.find(inputTextSearch).val() != ""){
            container.find(iconClear).removeClass('hide');
        } else {
            if(!container.find(iconClear).hasClass('hide')) {
                container.find(iconClear).addClass('hide');
            }
        }
    }

});

var userPointIndexController = new UserPointIndexController('#container-userPointIndex');