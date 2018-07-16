$(document).ready(function() {

    var GolfLessonWidgetController = function (selector) {
        this.init(selector);
    };

    $.extend(GolfLessonWidgetController.prototype, {
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

            me.$container.find("a[name=link-golflessonwidget]").each(function( index ) {
                $(this).on('click', function (e) {
                    e.preventDefault();
                    var href = $(this).data('url');
                    siteApp.redirectPage(href, 'POST', {dataNo: $(this).data('no'), settingType: $(this).data('settingtype')});
                });
            });
        }

    });

    var golfLessonWidgetController = new GolfLessonWidgetController('#container-golflessonwidget');

});