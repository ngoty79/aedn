$( document ).ready(function() {

    var ProfileListController = function (selector) {
        this.init(selector);
    };

    $.extend(ProfileListController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);

            me.initEventHandlers();
        },

        initEventHandlers: function () {
            var me = this;

            me.$container.on('click', '.btn-lecturer-detail', function(e){
                e.preventDefault();

                var settingNo = $(this).data('settingNo');

                siteApp.redirectPage('', 'POST', {method:'pro_vod_list',settingNo: settingNo,
                                                            activeTab: '0', page: 1});
            });
        }

    });

    var profileListController = new ProfileListController('#container-pro-list');

});