var PermissionController = function (selector) {
    this.selector = selector;
};

$.extend(PermissionController.prototype, {
    $container: null,

    init: function (data) {
        var me = this;

        me.$container = $(this.selector);
        me.$cboGroup = me.$container.find('select[name="userGroupNo"]');
        me.$wrap = me.$container.find('#container-wrap');
        me.$tmplPermission = $('#tmpl-permission');
        me.gorups = data.groups;
        me.groupMap = {};
        for(var i=0; i < me.gorups.length; i++){
            me.groupMap[me.gorups[i].userGroupNo] = me.gorups[i];
        }
        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;
        me.loadSetting();
    },
    initEventHandlers: function(){
        var me =this;
        me.$cboGroup.change(function(){
            me.changeGroup();
        });
        me.$container.on('click', '.btn-save', function(){
            me.updatePermission();
        });

    },
    loadSetting: function(){
        var me = this;
        if(me.$cboGroup.val() != ''){
            var userGroupNo = parseInt(me.$cboGroup.val());
            me.userGroupNo = userGroupNo;
            me.$wrap.empty().append($.tmpl(me.$tmplPermission.html(), me.groupMap[userGroupNo]));

            if($.trim(me.groupMap[userGroupNo].menus) != ''){
                var menus = me.groupMap[userGroupNo].menus.split(',');
                for(var i=0; i < menus.length; i++){
                    me.$wrap.find('#menu-permission').find('input:checkbox[name="' + menus[i] + '"]').prop('checked', true);
                }
            }

            me.$wrap.find('input:checkbox').uniform();
        }


    },
    changeGroup: function(){
        var me = this;
        me.loadSetting();
    },
    updatePermission: function(){
        var me = this;
        mugrunApp.showCommonConfirmDialog('Bạn có muốn cập nhật quyền cho nhóm không?', function(){
            var data = {
                userGroupNo: me.userGroupNo
            };
            var menuList = [];
            me.$wrap.find('#approve-permission').find('input:checkbox').each(function(index, el){
                data[$(el).attr('name')] = $(el).is(':checked');
            });
            me.$wrap.find('#menu-permission').find('input:checkbox:checked').each(function(index, el){
                menuList.push($(el).attr('name'));
            });
            data.menus = menuList.join(',');
            $.ajax({
                url: '/admin/permission/update.json',
                type: 'GET',
                dataType: 'json',
                data: data,
                success: function(data) {
                    if (data.success) {
                        me.groupMap[me.userGroupNo] = data.data;
                        mugrunApp.alertMessage('Phân quyền cho đã được cập nhật');
                    }else{
                        mugrunApp.alertMessage(data.messages);
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask();
                },
                complete: function () {
                    mugrunApp.unmask();
                },
                error: function() {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            });
        });

    }

});
