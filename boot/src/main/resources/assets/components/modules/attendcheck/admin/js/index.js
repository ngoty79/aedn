var AttendCheckIndexController = function (selector) {
    this.init(selector);
};

$.extend(AttendCheckIndexController.prototype, {
    $container: null,
    currModuleAttendCheck: undefined,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tabAttendanceCheckSetting         = me.$container.find('#tab-attendance-check-setting');
        me.$tabAttendanceStatistics           = me.$container.find('#tab-attendance-statistics');
        me.$tabRegularAttendanceAanking       = me.$container.find('#tab-regular-attendance-ranking');
        me.$tabTop1Ranking                    = me.$container.find('#tab-top1-ranking');

        me.initEventHandlers();
        me.getModuleAttendCheck();
    },


    initEventHandlers: function() {
        var me = this;

        me.$tabAttendanceCheckSetting.on('click', function(e){
            e.preventDefault();

        });

        me.$tabAttendanceStatistics.on('click', function(e){
            e.preventDefault();
        });

        me.$tabRegularAttendanceAanking.on('click', function(e){
            e.preventDefault();

        });

        me.$tabTop1Ranking.on('click', function(e){
            e.preventDefault();
        });
    },

    getModuleAttendCheck: function(){
        var me = this;
        $.ajax({
            url: '/admin/attendcheck/getModuleAttendCheck.json',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    me.currModuleAttendCheck = data.data;
                    attendCheckSettingController.buildInfoAttendCheck(me.currModuleAttendCheck);
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            }
        });
    },

    updateModuleAttendCheck: function(moduleAttendCheck, controller, showMessage){
        var me = controller;

        $.ajax({
            url: '/admin/attendcheck/update',
            type: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(moduleAttendCheck),
            success: function(data) {
                if (data.success) {
                    if(showMessage) {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.alert.modify.success'));
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
    }

});

var attendCheckIndexController = new AttendCheckIndexController('#container-admin-attend-check');


