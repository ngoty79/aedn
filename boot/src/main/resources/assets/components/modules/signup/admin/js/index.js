var SignupAdminModuleController = function (selector) {
    this.init(selector);
};

$.extend(SignupAdminModuleController.prototype, {
    $container: null,
    currModuleSignup: undefined,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.getCurrModuleSignup();
        me.initEventHandlers();
    },

    initEventHandlers: function(){
        var me = this;

        me.$container.on('click', '#join-complete', function (e) {
            e.preventDefault();
            joinCompleteAdmin.initSmartEditor();
        });

        me.$container.on('click', '#user-agreement', function (e) {
            e.preventDefault();
            userAgreementAdmin.getListProvision();
        });
    },

    getCurrModuleSignup: function(){
        var me = this;

        $.ajax({
            url: '/admin/signup/getCurrModuleSignup.json',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    var moduleSignup = data.data;
                    me.currModuleSignup = moduleSignup;
                    userAgreementAdmin.initModuleSignupInfo(moduleSignup);
                    identityVerificationAdmin.initVerification(moduleSignup);
                    memberInfoAdmin.initMemberInfoFromSignup(moduleSignup);
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            }
        });
    },

    updateModuleSignup: function(moduleSignup, controller, showMessage){
        var me = controller;

        $.ajax({
            url: '/admin/signup/update',
            type: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(moduleSignup),
            success: function(data) {
                if (data.success) {
                    if(showMessage) {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.alert.dialog.message.saved'));
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

var signupAdminModuleController = new SignupAdminModuleController('#container-signupIndex');

