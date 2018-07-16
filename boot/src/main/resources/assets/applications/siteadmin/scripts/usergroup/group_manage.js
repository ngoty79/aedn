var UserGroupManagementController = function (selector) {
    this.init(selector);
};

$.extend(UserGroupManagementController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.$tbListHeader            = me.$container.find('.table-list-header');
        me.$optSearch               = me.$tbListHeader.find('.select-option-search');
        me.$textSearch              = me.$tbListHeader.find('.text-search');
        me.$btnClear                = me.$tbListHeader.find('.search-clear');
        me.$btnSearch               = me.$tbListHeader.find('.btn-search');
        me.$btnSelectAll            = me.$tbListHeader.find('.btn-select-all');
        me.$btnDelete               = me.$tbListHeader.find('.btn-delete');
        me.$btnAdd                  = me.$tbListHeader.find('.btn-add');
        me.$tbListContent           = me.$container.find('.table-list-content');

        me.userGroupNo = 0;

        me.initUi();
        me.initEventHandlers();
    },

    initUi : function(){
        var me = this;

        me.initTable();
    },

    initEventHandlers:function() {
        var me = this;

        me.$textSearch.keydown(function(event) {
            setTimeout(function() {
                if(me.$textSearch.val() != ""){
                    me.$btnClear.removeClass('hide');
                } else if(!me.$btnClear.hasClass('hide')) {
                    me.$btnClear.addClass('hide');
                }
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13') {
                    event.preventDefault();
                    me.$tbListContent.bootstrapTable("refresh");
                }
            },1);
        });

        me.$btnClear.on('click', function (e) {
            e.preventDefault();
            me.$textSearch.val("");
            me.$btnClear.addClass('hide');
        });

        me.$btnSearch.on('click', function (e) {
            e.preventDefault();
            me.$tbListContent.bootstrapTable("refresh");
        });

        me.$btnSelectAll.on('click', function (e) {
            e.preventDefault();
            var $checkboxUnchecked = me.$tbListContent.find('input[type="checkbox"]:not(:checked)');
            if($checkboxUnchecked.length > 0) {
                $checkboxUnchecked.each(function(i, item){
                    $(item).click();
                });
            }else{
                me.$tbListContent.find('input[type="checkbox"]').each(function(i, item){
                    $(item).click();
                });
            }
        });

        me.$tbListContent.on('click', 'i.btn-usergroupusers-deletelink', function(e) {
            e.preventDefault();
            mugrunApp.showWarningDeleteDialog(me.deleteUserGroupLink, $(this).data('userno'));
        });

        me.$btnDelete.on('click', function(e) {
            e.preventDefault();

            var listUserNo = [];
            me.$tbListContent.find('input[type="checkbox"]:checked').each(function(i, item){
                listUserNo.push($(item).data('no'));
            });

            if(listUserNo.length > 0) {
                mugrunApp.showWarningDeleteDialog(me.deleteMultiUserGroupLink, listUserNo);
            }else{
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = siteAdminApp.getMessage('user.delete.no.selection');
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
            }
        });

        me.$btnAdd.on('click', function(e) {
            e.preventDefault();
            if(me.userGroupNo) {
                userGroupIndexController.moveToAddGroupUserPage(me.userGroupNo);
            }
        });
    },

    initTable: function() {
        var me = this;

        me.$tbListContent.bootstrapTable({
            url: '/admin/usergroup/loadUsersOfGroup.json',
            cache: false,
            smartDisplay: false,
            showHeader : true,
            pagination : true,
            paginationHAlign: 'center',
            pageSize: 15,
            uniqueId: "userNo",
            queryParamsType: '',
            queryParams: function(params) {
                params['userGroupNo'] = me.userGroupNo;
                params['field'] = $.trim(me.$optSearch.val());
                params['keyword'] = $.trim(me.$textSearch.val());
                return params;
            },
            columns: [
                {
                    field: 'userNo',
                    title: 'Chọn',
                    width: '10%',
                    align: 'center',
                    cellStyle: function(value, row, index) {
                        return {
                            classes: 'inbox-small-cells'
                        }
                    },
                    formatter: function(value,object){
                        return '<input type="checkbox" data-no="' + object.userNo + '">';
                    }
                }, {
                    field: 'id',
                    title: 'ID đăng nhập',
                    sortable: true,
                    width: '40%',
                    align: 'left',
                    formatter: function(value,object){
                        return object.id;
                    }
                }, {
                    field: 'name',
                    title: 'Họ tên',
                    sortable: true,
                    width: '40%',
                    align: 'left',
                    formatter: function(value,object){
                        return object.name;
                    }
                }, {
                    field: 'userNo',
                    title: 'Xóa khỏi nhóm',
                    align: 'center',
                    cellStyle: function(value, row, index) {
                        return {
                            classes: 'inbox-small-cells'
                        }
                    },
                    formatter: function(value,object){
                        return '<i class="glyphicon glyphicon-remove btn-usergroupusers-deletelink" data-userNo="'+object.userNo+'"></i>';
                    }
                }
            ],
            rowAttributes: function(row, index) {

            },
            onClickRow: function(row, element) {

            },
            onPostBody: function() {

            }
        });
    },

    loadData: function(userGroupNo) {
        var me = this;
        me.userGroupNo = userGroupNo;
        me.$tbListContent.bootstrapTable("refresh");
        me.getTotalCountUserOfGroup(me.userGroupNo);
    },

    deleteUserGroupLink: function(userNo) {
        var me = userGroupManagementController;
        $.ajax({
            url: '/admin/usergroup/deleteUserGroupLink.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                userNo: userNo,
                userGroupNo: me.userGroupNo
            },
            success: function(response) {
                if (response.success) {
                    me.$tbListContent.bootstrapTable("refresh");

                    // reload total
                    me.getTotalCountUserOfGroup(me.userGroupNo);
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

    deleteMultiUserGroupLink: function(listUserNo) {
        var me = userGroupManagementController;

        $.ajax({
            url: '/admin/usergroup/deleteMultiUserGroupLink.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                listUserNo: JSON.stringify(listUserNo),
                userGroupNo: me.userGroupNo
            },
            success: function(response) {
                if (response.success) {
                    me.$tbListContent.bootstrapTable("refresh");

                    // reload total
                    me.getTotalCountUserOfGroup(me.userGroupNo);
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

    reloadGrid: function() {
        var me = this;
        me.$tbListContent.bootstrapTable("refresh");
    },

    getTotalCountUserOfGroup: function(userGroupNo) {
        var me = this;

        $.ajax({
            url: '/admin/usergroup/getTotal.json',
            type: 'GET',
            dataType: 'json',
            data: {
                userGroupNo: userGroupNo
            },
            success: function(data) {
                if (data.success) {
                    var totalCount = data.data;
                    var text = '(회원수: ' + mugrunApp.formatNumber(totalCount) + '명)';
                    me.$tbListHeader.find('#total-count-user-group').text(text);
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
    }

});