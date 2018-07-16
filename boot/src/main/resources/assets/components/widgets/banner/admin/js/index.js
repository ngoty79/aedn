/**
 * Created by Hai Nguyen on 8/17/2016.
 */
var BannerController = function (selector) {
    this.init(selector);
};

$.extend(BannerController.prototype, {
    $container: null,
    $bannerEditing: null,
    $currBannerDetail: null,

    init: function (selector) {
        var me = this;
        me.$container = $(selector);

    },

    getBannerDetail: function(widgetNo) {
        var me = this;

        $.ajax({
            url: '/admin/banner/detail.json',
            type: 'GET',
            dataType: 'json',
            data: {
                widgetNo: widgetNo
            },
            success: function(data) {
                if (data.success) {
                    me.$currBannerDetail = data.data;
                    bannerConfigController.loadBannerConfigList();
                    bannerConfigController.buildBannerDetail(me.$currBannerDetail);
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

    getBannerEditing: function(widgetNo) {
        var me = this;

        $.ajax({
            url: '/admin/banner/detail.json',
            type: 'GET',
            dataType: 'json',
            data: {
                widgetNo: widgetNo
            },
            success: function(data) {
                if (data.success) {
                    me.$bannerEditing = data.data;
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

    deleteBanner : function(widgetNos){
        var me = bannerController;

        $.ajax({
            url: '/admin/banner/delete.json',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                widgetNos: widgetNos.join(',')
            },
            success: function(data) {
                if (data.success) {
                    var message = mugrunApp.getMessage('common.alert.dialog.message.deleted');
                    mugrunApp.showCommonAlertDialog(message);
                    // load again
                    bannerListController.loadBannerList(true);
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

    saveBanner : function(banner, loadFirstBanner){
        var me = bannerController;

        $.ajax({
            url: '/admin/banner/save.json',
            type: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(banner),
            success: function(data) {
                if (data.success) {
                    var message = mugrunApp.getMessage('common.alert.dialog.message.saved');
                    mugrunApp.showCommonAlertDialog(message);
                    // load again
                    bannerListController.loadBannerList(loadFirstBanner);
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

var bannerController = new BannerController('#container-admin-banner');