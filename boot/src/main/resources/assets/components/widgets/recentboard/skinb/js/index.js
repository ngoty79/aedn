$(document).ready(function() {

    var SkinBRecentBoardController = function (selector) {
        this.init(selector);
    };

    $.extend(SkinBRecentBoardController.prototype, {
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

    var skinBRecentBoardController = new SkinBRecentBoardController('#container-recentBoardWidget-skinB');

});