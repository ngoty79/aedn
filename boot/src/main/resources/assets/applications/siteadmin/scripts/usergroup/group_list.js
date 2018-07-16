var GroupListController = function (selector) {
    this.init(selector);
};

$.extend(GroupListController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.$tbListHeader            = me.$container.find('.table-list-header');
        me.$btnAdd                  = me.$tbListHeader.find('.btn-add');
        me.$tbListContent           = me.$container.find('.table-list-content');

        me.$modalAddGroup           = me.$container.find('#model-groupList-addGroup');
        me.$formAddGroup            = me.$modalAddGroup.find("#form-groupList-addGroup");
        me.$errorResponse           = me.$formAddGroup.find(".error-response");

        me.rowSelected = 0;

        me.initUi();
        me.initEventHandlers();
        me.loadDataTable();
    },

    initUi : function(){
        var me = this;

        me.initTable();
    },

    initEventHandlers:function() {
        var me = this;

        me.$btnAdd.on('click', function (e) {
            e.preventDefault();
            me.openUserGroupEditorDialog(0, '');
        });

        me.$modalAddGroup.on('click', 'button.btn-dialog-save', function (e) {
            e.preventDefault();
            me.submitSaveGroup();
        });

        me.$tbListContent.on('click', '.btn-usergroup-edit', function (e) {
            e.preventDefault();
            me.openUserGroupEditorDialog($(this).data('usergroupno'), $(this).data('usergroupname'));
        });

        me.$tbListContent.on('click', '.btn-usergroup-delete', function (e) {
            e.preventDefault();
            mugrunApp.showWarningDeleteDialog(me.deleteUserGroup, $(this).data('usergroupno'), 'Bạn có muốn xóa nhóm không?', 'Thông Báo');
        });
    },

    loadDataTable: function() {
        var me = this;

        $.ajax({
            url: '/admin/usergroup/loadUserGroups.json',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    var data = response.data;
                    me.$tbListContent.bootstrapTable("load" , data);
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

    initTable: function() {
        var me = this;

        me.$tbListContent.bootstrapTable({
            height: 598,
            showHeader : false,
            pagination : false,
            pageSize: 15,
            uniqueId: "userGroupNo",
            columns: [
                {
                    field: 'userGroupName',
                    title: '',
                    formatter: function(value,object){
                        return '<i class="fa fa-user"></i> <span>'+ object.userGroupName + '</span>';
                    }
                }, {
                    field: 'userGroupNo',
                    title: 'edit',
                    width: '5px',
                    halign: 'right',
                    valign: 'center',
                    align: 'right',
                    formatter: function(value,object){
                        return '<div class="pull-right">' +
                            '<i class="glyphicon glyphicon-pencil btn-usergroup-edit hide" data-userGroupNo="'+object.userGroupNo+'" data-usergroupname="'+object.userGroupName+'"></i></div>';
                    }
                }, {
                    field: 'userGroupNo',
                    title: 'delete',
                    width: '5px',
                    halign: 'right',
                    valign: 'center',
                    align: 'right',
                    formatter: function(value,object){
                        if(!object.defaultYn) {
                            return '<div class="pull-right"><i class="glyphicon glyphicon-folder-close  btn-usergroup-delete hide" data-userGroupNo="' + object.userGroupNo + '"></i></div>';
                        }
                        return '';
                    }
                }
            ],
            rowAttributes: function(row, index) {
                return {
                    defaultYn: row.defaultYn,
                    userGroupNo: row.userGroupNo
                };
            },
            onClickRow: function(row, element) {
                me.callClickRow(row.userGroupNo);
            },
            onPostBody: function() {
                if(me.rowSelected) {
                    me.callClickRow(me.rowSelected);
                }else{
                    me.callClickRow();
                }
            }
        });
    },

    initFormValidation: function() {
        var me = this;

        me.$formAddGroup.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'userGroupName': {
                    row: '.controls',
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            max: 256,
                            message: siteAdminApp.getMessage('common.validation.field.maxlength', {maxLength: 256})
                        }
                    }
                }
            }
        });
    },

    submitSaveGroup: function() {
        var me = this;

        var formValidation = me.$formAddGroup.data('formValidation');

        formValidation.validate();
        if (!formValidation.isValid()) {
            return;
        } else{
            var data = {};
            data['userGroupName'] = $.trim(me.$formAddGroup.find('input[name=userGroupName]').val());
            var userGroupNo = me.$formAddGroup.find('input[name=userGroupNo]').val();
            data['userGroupNo'] = userGroupNo;

            $.ajax({
                url: '/admin/usergroup/saveUserGroup.json',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(response) {
                    var data = response.data;
                    me.$errorResponse.html('');
                    if (response.success) {
                        if(!userGroupNo || userGroupNo == 0){
                            //add new
                            me.rowSelected = response.data.userGroupNo;
                        }
                        me.loadDataTable(true);
                        me.$modalAddGroup.modal('hide');
                    } else if(data.message) {
                        me.$errorResponse.html(data.message);
                    } else{
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    me.$modalAddGroup.find('button.btn-dialog-save').prop('disabled', true);
                },
                complete: function () {
                    me.$modalAddGroup.find('button.btn-dialog-save').prop('disabled', false);
                }
            });
        }
    },

    openUserGroupEditorDialog: function(userGroupNo, userGroupName) {
        var me = this;

        me.$formAddGroup[0].reset();
        me.$errorResponse.html('');
        me.$formAddGroup.find('input[name=userGroupNo]').val(userGroupNo);
        me.$formAddGroup.find('input[name=userGroupName]').val(userGroupName);
        if(me.$formAddGroup.data('formValidation')) {
            me.$formAddGroup.data('formValidation').destroy();
        }
        me.initFormValidation();
        me.$modalAddGroup.modal('show');
    },

    deleteUserGroup: function(userGroupNo) {
        var me = groupListController;
        $.ajax({
            url: '/admin/usergroup/deleteUserGroup.json',
            dataType: 'json',
            data: {
                userGroupNo: userGroupNo
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    me.rowSelected = 0;
                    me.loadDataTable(true);
                } else{
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

    showDetail: function(userGroupNo) {
        var me = this;
        userGroupManagementController.loadData(userGroupNo);
    },

    callClickRow: function(rowId) {
        var me = this, row;
        me.rowSelected = rowId;

        if(rowId) {
            me.$tbListContent.find('tbody > tr').each(function(i, item){
                if($(item).data('uniqueid') == rowId) {
                    row = item;
                    return;
                }
            });
        }else{
            //default
            row = me.$tbListContent.find('tbody > tr').first();
            me.rowSelected = $(row).data('uniqueid');
        }

        if($(row).length > 0 && $(row).data('uniqueid')) {
            var $oldRow = me.$tbListContent.find('tbody > tr.row-selected');
            $oldRow.removeClass('row-selected');
            $oldRow.find('.btn-usergroup-delete').addClass('hide');
            $oldRow.find('.btn-usergroup-edit').addClass('hide');

            $(row).find('.btn-usergroup-delete').removeClass('hide');
            $(row).find('.btn-usergroup-edit').removeClass('hide');
            $(row).addClass('row-selected');
            me.showDetail($(row).data('uniqueid'));
        }
    }

});