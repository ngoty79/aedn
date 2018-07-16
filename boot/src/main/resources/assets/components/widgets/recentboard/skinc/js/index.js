$(document).ready(function() {

    var SkinCRecentBoardController = function (selector) {
        this.init(selector);
    };

    $.extend(SkinCRecentBoardController.prototype, {
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

    var skinCRecentBoardController = new SkinCRecentBoardController('#container-recentBoardWidget-skinC');

});