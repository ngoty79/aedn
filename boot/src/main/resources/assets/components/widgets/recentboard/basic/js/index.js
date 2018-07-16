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

            me.$container.on('click', 'a[name="link-recentboard-content"]', function(){
                siteApp.redirectPage('site/board', 'GET', {scene:'read',contentNo: $(this).data('no'), moduleNo: $(this).data('moduleno')});
            });
        }

    });

    var skinARecentBoardController = new SkinARecentBoardController('#container-recentBoardWidget-skinA');

});