$( document ).ready(function(){
    var UserLoginController = function (selector) {
        this.init(selector);
    };

    $.extend(UserLoginController.prototype, {
        $container: null,
        $loginForm: null,
        USER_ID_COOKIE: '_mugrun_module_userlogin_id',
        SAVE_ID_COOKIE: '_mugrun_module_userlogin_saveid',
        STAY_LOGIN_COOKIE: '_mugrun_cookie_stay_on',
        STAY_LOGIN_COOKIE_STATUS: '_mugrun_cookie_stay_on_status',

        init: function (selector) {
            var me = this;
            me.$container = $(selector);
            me.$btnLogin = me.$container.find('#module-login-btn');
            me.$loginSuccess = me.$container.find('input[name=loginSuccess]');
            me.$msgError = me.$container.find('#module-login-errorMsg');
            me.$emptyMsg = me.$container.find('#module-login-emptyMsg');
            me.$userId = me.$container.find('#pt-module-login-id');
            me.$password = me.$container.find('#pt-module-login-pw');
            me.$saveId = me.$container.find('#module-login-save-id');
            me.$stayLogin = me.$container.find('#module-login-stay-login');
            me.checkRememberMe();
            me.initEventHandlers();

        },
        checkRememberMe: function(){
            var me = this;

            if($.cookie(me.SAVE_ID_COOKIE) == 'true'){
                me.$userId.val($.cookie(me.USER_ID_COOKIE));
                me.$saveId.prop('checked', true);
                me.$password.focus();
            }else{
                me.$userId.focus();
            }
        },
        initEventHandlers: function() {
            var me = this;

            me.$container.find('input').on("click keypress", function (e) {
                me.$msgError.hide();
                me.$emptyMsg.hide();
                if (e.which == 13) {
                    e.preventDefault();
                    me.login();
                }
            });
            me.$btnLogin.click(function(){
                me.login();
            });
        },
        login: function(){
            var me = this;
            var userId = $.trim(me.$userId.val()),
                password = $.trim(me.$password.val());

            if (userId.length < 1) {
                me.$emptyMsg.text( siteApp.getMessage('module.login.input_id')).show();
                me.$userId.focus();
                return;
            }

            if (password.length < 1) {
                me.$emptyMsg.text( siteApp.getMessage('module.login.input_pwd') ).show();
                me.$password.focus();
                return;
            }

            if (me.$saveId.is(':checked')) {
                $.cookie(me.USER_ID_COOKIE, userId, {expires: 7, path: "/"});
                $.cookie(me.SAVE_ID_COOKIE, 'true', {expires: 7, path: "/"});
            } else {
                $.cookie(me.USER_ID_COOKIE, null, {expires: 7, path: "/"});
                $.cookie(me.SAVE_ID_COOKIE, 'false', {expires: 7, path: "/"});
            }

            $('#userloginNamo-wrapper').submit();


        }
    });

    new UserLoginController('.pt-module-userloginNamo-skin-basic');
});
