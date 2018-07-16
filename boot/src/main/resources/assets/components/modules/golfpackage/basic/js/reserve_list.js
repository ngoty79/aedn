$( document ).ready(function() {

    var ListReservationController = function (selector) {
        this.init(selector);
    };

    $.extend(ListReservationController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$tabReserveList              = me.$container.find('#tab-reserveList');
            me.$activeTab                   = me.$container.find('input#hdn-list-activeTab');
            me.$page                        = me.$container.find('input#hdn-list-page');

            me.activeTab        = me.$container.find('#hdn-list-activeTab').val();

            me.initUi();
            me.initEventHandlers();
        },

        initUi: function () {
            var me = this;

        },

        initEventHandlers: function () {
            var me = this;

            me.$container.on('click', 'a.page', function(){
                siteApp.redirectPage('', 'POST', {method:'reserve_list',activeTab: me.$activeTab.val(), page: $(this).data('page')});
            });

            me.$container.on('click', 'a.page-golfpackage-prev', function(){
                if($(this).data('prev') != $(this).data('page')) {
                    siteApp.redirectPage('', 'POST', {method:'reserve_list',activeTab: me.$activeTab.val(), page: $(this).data('prev')});
                }
            });

            me.$container.on('click', 'a.page-golfpackage-next', function(){
                if($(this).data('next') != $(this).data('page')) {
                    siteApp.redirectPage('', 'POST', {method:'reserve_list',activeTab: me.$activeTab.val(), page: $(this).data('next')});
                }
            });

            me.$tabReserveList.on('click', 'a', function(){
                var packageNo = $(this).data('no');
                var $ul = me.$container.find('ul#pagination_'+packageNo);
                me.$activeTab.val(packageNo);
                if($ul.length > 0 && $ul.find('li.active').length > 0) {
                    me.$page.val($ul.find('li.active').data('page'));
                }
            });

            me.$container.on('click', 'a.link-reserveList-productName', function(){
                siteApp.redirectPage('', 'POST', {method:'reserve_view',activeTab: me.$activeTab.val(), page: me.$page.val(), reserveNo: $(this).data('no')});
            });
        }


    });

    var listReservationController = new ListReservationController('#container-reservation-list');

});