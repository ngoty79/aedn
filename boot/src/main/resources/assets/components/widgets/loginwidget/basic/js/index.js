$(document).ready(function() {

    var LoginWidgetController = function (selector) {
        this.init(selector);
    };

    $.extend(LoginWidgetController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$logoutForm = me.$container.find('#form-loginWidget-logout');
            me.$logoutBtn = me.$container.find('#btn-loginWidget-logout');
            me.initUi();
            me.initEventHandlers();
        },

        initUi: function () {
            var me = this;

        },

        initEventHandlers: function () {
            var me = this;

            me.$logoutBtn.click(function(e) {
                e.preventDefault();
                me.$logoutForm[0].submit();
            });
        }

    });

    var loginWidgetController = new LoginWidgetController('.container-widget-login');

});