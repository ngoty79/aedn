(function ($) {
    var CommonHeaderController = function (selector) {
        this.init(selector);
    };

    $.extend(CommonHeaderController.prototype, {
        $container: null,
        $logoutBtn: null,
        $logoutForm: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$logoutBtn = me.$container.find('#btn-commonHeader-logout');
            me.$logoutForm = me.$container.find('#form-commonHeader-logout');

            me.initEventHandlers();
        },

        initEventHandlers: function() {
            var me = this;

            me.$logoutBtn.click(function(e) {
                e.preventDefault();
                me.$logoutForm.submit();
            });
        }
    });

    new CommonHeaderController('.page-header-inner');
})(jQuery);