var DeliveryManagementController = function (selector) {
    this.init(selector);
};

$.extend(DeliveryManagementController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$containerPendingList = me.$container.find('.container-pending-list');
        me.$containerShippingList = me.$container.find('.container-shipping-list');
        me.$tablePendingList = me.$containerPendingList.find('#table-pending-list');
        me.$tableShippingList = me.$containerShippingList.find('#table-shipping-list');

        me.initEventHandlers();
        me.initBootstrapTable();
    },

    initEventHandlers: function() {
        var me = this;

        var $dateStartPending = me.$containerPendingList.find('input[name="startDate"]');
        var $dateEndPending = me.$containerPendingList.find('input[name="endDate"]');
        $dateStartPending.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });
        $dateEndPending.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });

        var $dateStartShipping = me.$containerShippingList.find('input[name="startDate"]');
        var $dateEndShipping = me.$containerShippingList.find('input[name="endDate"]');
        $dateStartShipping.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });
        $dateEndShipping.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });

        var currentDate = new Date();
        var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        $dateStartPending.datepicker( "setDate", firstDay);
        $dateStartShipping.datepicker( "setDate", firstDay);
        $dateStartPending.on('changeDate', function(e) {
            $dateEndPending.datepicker('setStartDate', e.date);
        });
        $dateStartShipping.on('changeDate', function(e) {
            $dateEndShipping.datepicker('setStartDate', e.date);
        });

        var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        $dateEndPending.datepicker( "setDate", lastDay);
        $dateEndShipping.datepicker( "setDate", lastDay);
        $dateEndPending.datepicker( "setStartDate", firstDay);
        $dateEndShipping.datepicker( "setStartDate", firstDay);

        me.$tablePendingList.on('click', '.btn-edit', function(e){
            e.preventDefault();
            var orderNo = $(this).data('orderNo');
            var order = me.$tablePendingList.bootstrapTable('getRowByUniqueId', orderNo);
            shopOrderDeliveryController.openModalOrderDetail(order);
        });

        me.$tableShippingList.on('click', '.btn-edit', function(e){
            e.preventDefault();
            var orderNo = $(this).data('orderNo');
            var order = me.$tableShippingList.bootstrapTable('getRowByUniqueId', orderNo);
            shopOrderDeliveryController.openModalOrderDetail(order);
        });

        me.$containerPendingList.on('change', 'input[name=startDate], input[name=endDate],select[name=searchType]', function(e){
            e.preventDefault();
            if(shopOrderDeliveryController.isFieldNotEmpty(me.$containerPendingList, 'endDate') == true) {
                me.loadPendingOrdersList();
            }
        });

        me.$containerPendingList.find('input[name=searchText]').keydown(function (e) {
            setTimeout(function () {
                shopOrderDeliveryController.checkInputSearch(me.$containerPendingList, 'input[name=searchText]', '.search-clear');
                if(shopOrderDeliveryController.isFieldNotEmpty(me.$containerPendingList, 'endDate') == true) {
                    me.loadPendingOrdersList();
                }
            }, 1);
        });

        me.$containerPendingList.on('click', '.action-click-icon', function (e) {
            e.preventDefault();
            me.loadPendingOrdersList();
        });

        me.$containerPendingList.on('click', '.search-clear', function(e){
            e.preventDefault();
            me.$containerPendingList.find('input[name=searchText]').val("");
            me.$containerPendingList.find('.search-clear').addClass('hide');
        });

        me.$containerShippingList.on('change', 'input[name=startDate], input[name=endDate],select[name=searchType]', function(e){
            e.preventDefault();
            if(shopOrderDeliveryController.isFieldNotEmpty(me.$containerShippingList, 'endDate') == true) {
                me.loadShippingOrdersList();
            }
        });

        me.$containerShippingList.find('input[name=searchText]').keydown(function (e) {
            setTimeout(function () {
                shopOrderDeliveryController.checkInputSearch(me.$containerShippingList, 'input[name=searchText]', '.search-clear');
                if(shopOrderDeliveryController.isFieldNotEmpty(me.$containerShippingList, 'endDate') == true) {
                    me.loadShippingOrdersList();
                }
            }, 1);
        });

        me.$containerShippingList.on('click', '.action-click-icon', function (e) {
            e.preventDefault();
            me.loadShippingOrdersList();
        });

        me.$containerShippingList.on('click', '.search-clear', function(e){
            e.preventDefault();
            me.$containerShippingList.find('input[name=searchText]').val("");
            me.$containerShippingList.find('.search-clear').addClass('hide');
        });

    },

    initBootstrapTable : function() {
        var me = this;

        var urlPending = me.getURLPendingOrdersList();

        me.$tablePendingList.bootstrapTable({
            url: urlPending,
            smartDisplay: false,
            pageSize: 15,
            pagination: true,
            uniqueId: 'orderNo',
            checkAll: true,
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            queryParams: function(params) {
                return params;
            },
            columns: shopOrderDeliveryController.$commonField
        });

        var urlShipping = me.getURLShippingOrdersList();

        me.$tableShippingList.bootstrapTable({
            url: urlShipping,
            smartDisplay: false,
            pageSize: 15,
            pagination: true,
            uniqueId: 'orderNo',
            checkAll: true,
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            queryParams: function(params) {
                return params;
            },
            columns: shopOrderDeliveryController.$commonField
        });

        setTimeout(function(){
            me.loadPendingOrdersList();
            me.loadShippingOrdersList();
        }, 500);
    },


    getURLPendingOrdersList: function(){
        var me = this;

        var filterOrderStatus = 'd:1';
        var startDate = me.$containerPendingList.find('input[name="startDate"]').val();
        var endDate = me.$containerPendingList.find('input[name="endDate"]').val();
        var searchType = me.$containerPendingList.find('select[name=searchType]').val();
        var searchText = me.$containerPendingList.find('input[name="searchText"]').val();
        var url = '/admin/shop/ordermgmt/listOrders.json?mallNo=' + shopOrderDeliveryController.shopMallNo
            + '&filterOrderStatus=' + filterOrderStatus + '&startDate=' +
            startDate + '&endDate=' + endDate + '&searchType=' + searchType + '&searchText=' + searchText;

        return url;
    },

    getURLShippingOrdersList: function(){
        var me = this;

        var filterOrderStatus = 'd:2';
        var startDate = me.$containerShippingList.find('input[name="startDate"]').val();
        var endDate = me.$containerShippingList.find('input[name="endDate"]').val();
        var searchType = me.$containerShippingList.find('select[name=searchType]').val();
        var searchText = me.$containerShippingList.find('input[name="searchText"]').val();
        var url = '/admin/shop/ordermgmt/listOrders.json?mallNo=' + shopOrderDeliveryController.shopMallNo
            + '&filterOrderStatus=' + filterOrderStatus + '&startDate=' +
            startDate + '&endDate=' + endDate + '&searchType=' + searchType + '&searchText=' + searchText;

        return url;
    },

    loadPendingOrdersList: function(){
        var me = this;

        var url = me.getURLPendingOrdersList();
        me.$tablePendingList.bootstrapTable('refresh', {url: url});

    },

    loadShippingOrdersList: function(){
        var me = this;

        var url = me.getURLShippingOrdersList();
        me.$tableShippingList.bootstrapTable('refresh', {url: url});

    }

});

var deliveryManagementController = new DeliveryManagementController('#container-order-delivery-delivery');

$(function() {
    $("#form-search-processing-status").submit(function() { return false; });
    $("#form-search-sales-status").submit(function() { return false; });
});


