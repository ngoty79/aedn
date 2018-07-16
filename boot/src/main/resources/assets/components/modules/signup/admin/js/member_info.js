var MemberInfoAdmin = function (selector) {
    this.init(selector);
};

$.extend(MemberInfoAdmin.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.initEventHandlers();

    },

    initEventHandlers: function() {
        var me = this;

        me.$container.on('click', '#save-member-info', function (e) {
            e.preventDefault();

            var signup = me.buildNewSignup();
            signupAdminModuleController.updateModuleSignup(signup, memberInfoAdmin, true);
        });

        me.$container.on('click', '#cancel-member-info', function (e) {
            e.preventDefault();

            me.initMemberInfoFromSignup(signupAdminModuleController.currModuleSignup);
        });
    },

    initMemberInfoFromSignup: function(signup) {
        var me = this;
        var ele = me.$container.find('input[name=captchaYn]');
        if(signup.captchaYn) {
            me.check(ele);
        } else {
            me.unCheck(ele);
        }
    },

    buildNewSignup: function(){
        var me = this;
        var sigup = signupAdminModuleController.currModuleSignup;
        var ele = me.$container.find('input[name=captchaYn]');
        if(me.isCheck(ele)) {
            sigup.captchaYn = 1;
        } else {
            sigup.captchaYn = 0;
        }
        return sigup;
    },

    unCheck: function(cb) {
        if($(cb).parent().hasClass('checked')) {
            $(cb).prop("checked", false);
            $(cb).parent().removeClass('checked');
        }
    },
    check: function(cb) {
        if(!$(cb).parent().hasClass('checked')) {
            $(cb).click();
        }
    },

    isCheck: function(cb){
        if($(cb).parent().hasClass('checked')) {
            return true;
        }
        return false;
    }
});

var memberInfoAdmin = new MemberInfoAdmin('#container-member-info');

