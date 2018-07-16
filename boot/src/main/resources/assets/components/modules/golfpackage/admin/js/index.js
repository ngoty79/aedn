var GolfPackageController = function (selector) {
    this.init(selector);
};

$.extend(GolfPackageController.prototype, {
    $container: null,
    $golfPackageEditing: null,
    $currGolfPackageDetail: null,

    init: function (selector) {
        var me = this;
        me.$container = $(selector);

    },

    getGolfPackageDetail: function(packageNo) {
        var me = this;

        $.ajax({
            url: '/admin/golfpackage/detail.json',
            type: 'GET',
            dataType: 'json',
            data: {
                packageNo: packageNo
            },
            success: function(data) {
                if (data.success) {
                    me.$currGolfPackageDetail = data.data;
                    packageSettingsController.loadPackageSettingsInfo(me.$currGolfPackageDetail);
                    productManagementController.loadFirstCategoryList();
                    productManagementController.loadProductList();
                    reservationManagementController.loadFirstCategoryList();
                    reservationManagementController.loadReservationList();
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

    getGolfPackageEditing: function(packageNo) {
        var me = this;

        $.ajax({
            url: '/admin/golfpackage/detail.json',
            type: 'GET',
            dataType: 'json',
            data: {
                packageNo: packageNo
            },
            success: function(data) {
                if (data.success) {
                    me.$golfPackageEditing = data.data;
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

    deleteGolfPackage : function(packageNos){
        var me = golfPackageController;

        $.ajax({
            url: '/admin/golfpackage/delete.json',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                packageNos: packageNos.join(',')
            },
            success: function(data) {
                if (data.success) {
                    var message = mugrunApp.getMessage('common.alert.dialog.message.deleted');
                    mugrunApp.showCommonAlertDialog(message);
                    // load again
                    packageListController.loadPackageList(true);
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

    saveGolfPackage : function(golfPackage, loadFirstPackage){
        var me = golfPackageController;

        $.ajax({
            url: '/admin/golfpackage/save.json',
            type: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(golfPackage),
            success: function(data) {
                if (data.success) {
                    var message = mugrunApp.getMessage('common.alert.dialog.message.saved');
                    mugrunApp.showCommonAlertDialog(message);
                    // load again
                    packageListController.loadPackageList(loadFirstPackage);
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

var golfPackageController = new GolfPackageController('#container-admin-golf-package');