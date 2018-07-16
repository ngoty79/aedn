var AddGroupUserController = function (selector) {
    this.init(selector);
};

$.extend(AddGroupUserController.prototype, {
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
        me.$btnAdd                  = me.$tbListHeader.find('.btn-add');
        me.$btnBack                 = me.$tbListHeader.find('.btn-back');
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

        me.$btnBack.on('click', function(e) {
            e.preventDefault();
            userGroupIndexController.moveToUserGroupMntPage();
        });

        me.$btnAdd.on('click', function(e) {
            e.preventDefault();
            var listUserNo = [];
            me.$tbListContent.find('input[type="checkbox"]:checked').each(function(i, item){
                listUserNo.push($(item).data('no'));
            });

            if(listUserNo.length > 0) {
                me.addUsersToGroup(listUserNo);
            }else{
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = siteAdminApp.getMessage('user.group.no.selection');
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,'Vui lòng chọn NV cần thêm vào nhóm.',type,buttonLabel, buttonClass);
            }
        });
    },

    initTable: function() {
        var me = this;

        me.$tbListContent.bootstrapTable({
            url: '/admin/usergroup/loadUsers.json',
            cache: false,
            smartDisplay: false,
            showHeader : true,
            pagination : true,
            paginationHAlign: 'center',
            pageSize: 15,
            uniqueId: "userNo",
            queryParamsType: '',
            queryParams: function(params) {
                params['field'] = $.trim(me.$optSearch.val());
                params['keyword'] = $.trim(me.$textSearch.val());
                return params;
            },
            columns: [
                {
                    field: 'userNo',
                    title: 'Chọn',
                    width: '7%',
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
                    title: 'Tên đăng nhập',
                    sortable: true,
                    width: '30%',
                    align: 'left',
                    formatter: function(value,object){
                        return object.id;
                    }
                }, {
                    field: 'name',
                    sortable: true,
                    title: 'Họ tên',
                    width: '30%',
                    align: 'left',
                    formatter: function(value,object){
                        return object.name;
                    }
                }, {
                    field: 'userGroupName',
                    sortable: true,
                    title: 'Nhóm hiện tại',
                    width: '33%',
                    align: 'left',
                    formatter: function(value,object){
                        return object.userGroupName;
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
    },

    addUsersToGroup: function(listUserNo) {
        var me = this;

        $.when(me.checkUsersAssigned(listUserNo, me.userGroupNo)).done(function(response){
            if (response.success) {
                me.executeAddUsersToGroup(listUserNo);
            } else if(response.data){
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = siteAdminApp.getMessage('user.group.exist.user.assigned.to.other.group');
                var type = BootstrapDialog.TYPE_PRIMARY;
                var textCancelLabel = mugrunApp.getMessage('common.btn.no');
                var textOKLabel = mugrunApp.getMessage('common.btn.yes');
                var buttonOKClass = 'green';
                var buttonCancelClass = 'btn-outline green';
                var callbackFunc = me.executeAddUsersToGroup;
                var paramsForCallbackFunc = listUserNo;
                mugrunApp.showConfirmDialog('Thông Báo', 'Bạn có muốn thêm NV chọn vào nhóm không?', type, textOKLabel, textCancelLabel , buttonCancelClass, buttonOKClass, undefined, undefined,  callbackFunc, paramsForCallbackFunc);
            } else{
                mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
            }
        });
    },

    executeAddUsersToGroup: function(listUserNo) {
        var me = addGroupUserController;

        $.ajax({
            url: '/admin/usergroup/addUsersToGroup.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                listUserNo: JSON.stringify(listUserNo),
                userGroupNo: me.userGroupNo
            },
            success: function(response) {
                if (response.success) {
                    me.$tbListContent.bootstrapTable("refresh");

                    userGroupManagementController.getTotalCountUserOfGroup(me.userGroupNo);

                    mugrunApp.alertMessage("Đã thêm nhân viên được chọn vào nhóm.");
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

    checkUsersAssigned: function(listUserNo, userGroupNo) {
        var me = this;
        return $.ajax({
            url: '/admin/usergroup/checkUsersAssigned.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                listUserNo: JSON.stringify(listUserNo),
                userGroupNo: userGroupNo
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
    }

});