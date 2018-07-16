$(document).ready(function() {

    var GolfPackageWidgetController = function (selector) {
        this.init(selector);
    };

    $.extend(GolfPackageWidgetController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);

            me.initUi();
            me.initEventHandlers();
        },

        initUi: function () {
            var me = this;

        },

        initEventHandlers: function () {
            var me = this;
        }

    });

    var golfPackageWidgetController = new GolfPackageWidgetController('#container-golfpackagewidget');

});