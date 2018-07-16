var ShopMallProductController = function (selector) {
    this.init(selector);
};

$.extend(ShopMallProductController.prototype, {
    $container: null,
    shopMallData: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tabMallMnt                      = me.$container.find('#tab-mall-link');
        me.$tabProductMnt                   = me.$container.find('#tab-product-link');
        me.$tabProductPostsMnt              = me.$container.find('#tab-productposts-link');

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function () {
        var me = this;

    },

    initEventHandlers: function () {
        var me = this;

        me.$tabProductMnt.on('click', function (e) {
            if(shopMallController.getMallNo() == 0) {
                mugrunApp.alertMessage('상점을 먼저 등록하시기 바랍니다.');
                e.preventDefault();
                e.stopImmediatePropagation();
                me.$tabMallMnt.focus();
            }
        });
    },

    refreshMallNoAll: function(mallNo) {
        var me = this;
        categoryTreeController.refreshMallNo(mallNo);
        shopProductEditorController.refreshMallNo(mallNo);
        shopProductController.refreshMallNo(mallNo);
    }

});

var shopMallController = new ShopMallController('#container-mallproduct-mall');
var categoryTreeController = new CategoryTreeController('#container-mallproduct-categoryTree');
var shopProductEditorController = new ShopProductEditorController('#modal-mallproduct-productEditor');
var shopProductOptionsController = new ShopProductOptionsController('#container-productEditor-productOptions');
var shopProductController = new ShopProductController('#container-mallproduct-product');
var shopProductPostsController = new ShopProductPostsController('#container-mallproduct-productposts');
var shopBankAccountController = new ShopBankAccountController('#container-mallproduct-bank-account');
var pointSettingsController = new PointSettingsController('#container-point-settings-mall');

var shopMallProductController = new ShopMallProductController('#container-shop-mallproduct');
