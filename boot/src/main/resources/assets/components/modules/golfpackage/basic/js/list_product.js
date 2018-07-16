$( document ).ready(function() {

    var ListProductController = function (selector) {
        this.init(selector);
    };

    $.extend(ListProductController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$pagination              = me.$container.find('ul.pagination');
            me.$gridProducts            = me.$container.find('#grid-list-products');
            me.$tabs                    = me.$container.find('#group-list-tabs');

            me.packageNo                = me.$container.find('input#hdn-list-packageNo').val();
            me.page                     = me.$container.find('input#hdn-list-page').val();
            me.tab                      = me.$container.find('input#hdn-list-tab').val();

            me.initUi();
            me.initEventHandlers();
        },

        initUi: function () {
            var me = this;

        },

        initEventHandlers: function () {
            var me = this;

            me.$tabs.on('click', 'li.tab-category', function(e){
                e.preventDefault();
                if(!$(this).hasClass('active')) {
                    me.submitPageList($(this).data('no'), 1);
                }
            });

            me.$pagination.on('click', 'a.page', function(){
                me.submitPageList(me.tab, $(this).data('page'));
            });

            me.$pagination.on('click', 'a#page-golfpackage-prev', function(){
                if($(this).data('prev') != $(this).data('page')) {
                    me.submitPageList(me.tab, $(this).data('prev'));
                }
            });

            me.$pagination.on('click', 'a#page-golfpackage-next', function(){
                if($(this).data('next') != $(this).data('page')) {
                    me.submitPageList(me.tab, $(this).data('next'));
                }
            });

            me.$container.on('click', 'a.a-list-linkToView', function(){
                siteApp.redirectPage('', 'POST', {method:'view',no: $(this).data('no'),categoryNo: me.tab, page: me.page});
            });
        },

        submitPageList: function(tabNo, page) {
            var me = this;
            siteApp.redirectPage('', 'POST', {method:'list',packageNo: me.packageNo, categoryNo: tabNo, page: page});
        }


    });

    var listProductController = new ListProductController('#container-golfpackage-list');

});