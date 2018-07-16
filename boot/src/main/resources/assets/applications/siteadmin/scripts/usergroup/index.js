var UserGroupIndexController = function (selector) {
    this.init(selector);
};

$.extend(UserGroupIndexController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.$pageGroupList            = me.$container.find('#page-usergroup-grouplist');
        me.$pageUserGroupMnt         = me.$container.find('#page-usergroup-management');
        me.$pageAddGroupUser         = me.$container.find('#page-usergroup-add-groupuser');

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;

    },

    initEventHandlers: function() {
        var me = this;
    },

    moveToUserGroupMntPage: function() {
        var me = this;

        userGroupManagementController.reloadGrid();
        if(!me.$pageAddGroupUser.hasClass('hide')) me.$pageAddGroupUser.addClass('hide');
        if(me.$pageGroupList.hasClass('hide')) me.$pageGroupList.removeClass('hide');
        if(me.$pageUserGroupMnt.hasClass('hide')) me.$pageUserGroupMnt.removeClass('hide');

    },

    moveToAddGroupUserPage: function(userGroupNo) {
        var me = this;
        addGroupUserController.userGroupNo = userGroupNo;
        addGroupUserController.reloadGrid();

        if(!me.$pageGroupList.hasClass('hide')) me.$pageGroupList.addClass('hide');
        if(!me.$pageUserGroupMnt.hasClass('hide')) me.$pageUserGroupMnt.addClass('hide');
        if(me.$pageAddGroupUser.hasClass('hide')) me.$pageAddGroupUser.removeClass('hide');

    }

});

var userGroupManagementController = new UserGroupManagementController('#container-usergroup-management');
var addGroupUserController = new AddGroupUserController('#container-usergroup-add-groupuser');
var groupListController = new GroupListController('#container-usergroup-grouplist');
var userGroupIndexController = new UserGroupIndexController('#container-admin-usergroup');


