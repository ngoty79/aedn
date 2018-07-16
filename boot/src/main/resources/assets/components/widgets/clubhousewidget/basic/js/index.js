$(document).ready(function() {

    var ClubhouseWidgetController = function (selector) {
        this.init(selector);
    };

    $.extend(ClubhouseWidgetController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$eventContent            = me.$container.find("#content-clubhouse-eventContent");

            me.initUi();
            me.initEventHandlers();
        },

        initUi: function () {
            var me = this;
            if(me.$eventContent.length > 0) {
                var $firstImg = me.$eventContent.find('img').first();
                if($firstImg.length > 0) {
                    me.$container.find("img#img-clubhouse-firstImg").attr('src', $firstImg.attr('src'));
                    me.$eventContent.empty();
                }
            }
        },

        initEventHandlers: function () {
            var me = this;

        }

    });

    var clubhouseWidgetController = new ClubhouseWidgetController('#container-clubhouseWidget');

});