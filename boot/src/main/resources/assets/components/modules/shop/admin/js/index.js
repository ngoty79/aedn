var ShopController = function (selector) {
    this.init(selector);
};

$.extend(ShopController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tabMallProductMnt               = me.$container.find('#tab_mallProduct_link');

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;

    },

    initEventHandlers: function() {
        var me = this;

        me.$container.on('click', '#tab_orderDelivery_link', function(e){
            e.preventDefault();
            dashboardController.setHeightForScroller();
        });
    }

});

var shopController = new ShopController('#container-admin-shop');


