$(document).ready(function() {

    var SkinARecentBoardController = function (selector) {
        this.init(selector);
    };

    $.extend(SkinARecentBoardController.prototype, {
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

    var skinARecentBoardController = new SkinARecentBoardController('#container-recentBoardWidget-skinA');

});