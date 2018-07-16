var ReturnRefundController = function (selector) {
    this.init(selector);
};

$.extend(ReturnRefundController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$containerRRRequestList = me.$container.find('.container-return-refund-request-list');
        me.$containerRRefundList = me.$container.find('.container-return-refund-list');
        me.$tableRRRequestList = me.$containerRRRequestList.find('#table-return-refund-request-list');
        me.$tableRRefundList = me.$containerRRefundList.find('#table-return-refund-list');

        me.initEventHandlers();
        me.initBootstrapTable();
    },

    initEventHandlers: function() {
        var me = this;

        var $dateStartRRRequest = me.$containerRRRequestList.find('input[name="startDate"]');
        var $dateEndRRRequest = me.$containerRRRequestList.find('input[name="endDate"]');
        $dateStartRRRequest.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });
        $dateEndRRRequest.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });

        var $dateStartRRefund = me.$containerRRefundList.find('input[name="startDate"]');
        var $dateEndRRefund = me.$containerRRefundList.find('input[name="endDate"]');
        $dateStartRRefund.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });
        $dateEndRRefund.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });

        var currentDate = new Date();
        var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        $dateStartRRRequest.datepicker( "setDate", firstDay);
        $dateStartRRefund.datepicker( "setDate", firstDay);
        $dateStartRRRequest.on('changeDate', function(e) {
            $dateEndRRRequest.datepicker('setStartDate', e.date);
        });
        $dateStartRRefund.on('changeDate', function(e) {
            $dateEndRRefund.datepicker('setStartDate', e.date);
        });

        var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        $dateEndRRRequest.datepicker( "setDate", lastDay);
        $dateEndRRefund.datepicker( "setDate", lastDay);
        $dateEndRRRequest.datepicker( "setStartDate", firstDay);
        $dateEndRRefund.datepicker( "setStartDate", firstDay);

        me.$tableRRRequestList.on('click', '.btn-edit', function(e){
            e.preventDefault();
            var orderNo = $(this).data('orderNo');
            var order = me.$tableRRRequestList.bootstrapTable('getRowByUniqueId', orderNo);
            shopOrderDeliveryController.openModalOrderDetail(order);
        });

        me.$tableRRefundList.on('click', '.btn-edit', function(e){
            e.preventDefault();
            var orderNo = $(this).data('orderNo');
            var order = me.$tableRRefundList.bootstrapTable('getRowByUniqueId', orderNo);
            shopOrderDeliveryController.openModalOrderDetail(order);
        });

        me.$containerRRRequestList.on('change', 'input[name=startDate], input[name=endDate],select[name=searchType]', function(e){
            e.preventDefault();
            if(shopOrderDeliveryController.isFieldNotEmpty(me.$containerRRRequestList, 'endDate') == true) {
                me.loadRRRequestOrdersList();
            }
        });

        me.$containerRRRequestList.find('input[name=searchText]').keydown(function (e) {
            setTimeout(function () {
                shopOrderDeliveryController.checkInputSearch(me.$containerRRRequestList, 'input[name=searchText]', '.search-clear');
                if(shopOrderDeliveryController.isFieldNotEmpty(me.$containerRRRequestList, 'endDate') == true) {
                    me.loadRRRequestOrdersList();
                }
            }, 1);
        });

        me.$containerRRRequestList.on('click', '.action-click-icon', function (e) {
            e.preventDefault();
            me.loadRRRequestOrdersList();
        });

        me.$containerRRRequestList.on('click', '.search-clear', function(e){
            e.preventDefault();
            me.$containerRRRequestList.find('input[name=searchText]').val("");
            me.$containerRRRequestList.find('.search-clear').addClass('hide');
        });

        me.$containerRRefundList.on('change', 'input[name=startDate], input[name=endDate],select[name=searchType]', function(e){
            e.preventDefault();
            if(shopOrderDeliveryController.isFieldNotEmpty(me.$containerRRefundList, 'endDate') == true) {
                me.loadRRefundOrdersList();
            }
        });

        me.$containerRRefundList.find('input[name=searchText]').keydown(function (e) {
            setTimeout(function () {
                shopOrderDeliveryController.checkInputSearch(me.$containerRRefundList, 'input[name=searchText]', '.search-clear');
                if(shopOrderDeliveryController.isFieldNotEmpty(me.$containerRRefundList, 'endDate') == true) {
                    me.loadRRefundOrdersList();
                }
            }, 1);
        });

        me.$containerRRefundList.on('click', '.action-click-icon', function (e) {
            e.preventDefault();
            me.loadRRefundOrdersList();
        });

        me.$containerRRefundList.on('click', '.search-clear', function(e){
            e.preventDefault();
            me.$containerRRefundList.find('input[name=searchText]').val("");
            me.$containerRRefundList.find('.search-clear').addClass('hide');
        });
    },

    initBootstrapTable : function() {
        var me = this;

        var urlRRRequest = me.getURLRRRequestOrdersList();

        me.$tableRRRequestList.bootstrapTable({
            url: urlRRRequest,
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

        var urlRRefund = me.getURLRRefundOrdersList();

        me.$tableRRefundList.bootstrapTable({
            url: urlRRefund,
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
            me.loadRRRequestOrdersList();
            me.loadRRefundOrdersList();
        }, 500);
    },

    getURLRRRequestOrdersList: function(){
        var me = this;

        var filterOrderStatus = 'r:1';
        var startDate = me.$containerRRRequestList.find('input[name="startDate"]').val();
        var endDate = me.$containerRRRequestList.find('input[name="endDate"]').val();
        var searchType = me.$containerRRRequestList.find('select[name=searchType]').val();
        var searchText = me.$containerRRRequestList.find('input[name="searchText"]').val();
        var url = '/admin/shop/ordermgmt/listOrders.json?mallNo=' + shopOrderDeliveryController.shopMallNo
            + '&filterOrderStatus=' + filterOrderStatus + '&startDate=' +
            startDate + '&endDate=' + endDate + '&searchType=' + searchType + '&searchText=' + searchText;

        return url;
    },

    getURLRRefundOrdersList: function(){
        var me = this;

        var filterOrderStatus = 'r:2';
        var startDate = me.$containerRRefundList.find('input[name="startDate"]').val();
        var endDate = me.$containerRRefundList.find('input[name="endDate"]').val();
        var searchType = me.$containerRRefundList.find('select[name=searchType]').val();
        var searchText = me.$containerRRefundList.find('input[name="searchText"]').val();
        var url = '/admin/shop/ordermgmt/listOrders.json?mallNo=' + shopOrderDeliveryController.shopMallNo
            + '&filterOrderStatus=' + filterOrderStatus + '&startDate=' +
            startDate + '&endDate=' + endDate + '&searchType=' + searchType + '&searchText=' + searchText;

        return url;
    },

    loadRRRequestOrdersList: function(){
        var me = this;

        var url = me.getURLRRRequestOrdersList();
        me.$tableRRRequestList.bootstrapTable('refresh', {url: url});

    },

    loadRRefundOrdersList: function(){
        var me = this;

        var url = me.getURLRRefundOrdersList();
        me.$tableRRefundList.bootstrapTable('refresh', {url: url});

    }

});

var returnRefundController = new ReturnRefundController('#container-order-delivery-return-refund');


$(function() {
    $("#form-search-refund-request").submit(function() { return false; });
    $("#form-search-refund-complete").submit(function() { return false; });
});



