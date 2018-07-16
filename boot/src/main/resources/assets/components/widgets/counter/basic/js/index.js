$(document).ready(function() {

    var CounterWidgetController = function (selector) {
        this.init(selector);
    };

    $.extend(CounterWidgetController.prototype, {
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

    var counterWidgetController = new CounterWidgetController('.container-widget-counter');

});