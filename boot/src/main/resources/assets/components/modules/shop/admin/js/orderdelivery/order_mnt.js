var OrderManagementController = function (selector) {
    this.init(selector);
};

$.extend(OrderManagementController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tableOrderList = me.$container.find('#table-order-list');

        me.initEventHandlers();
        me.initBootstrapTable();
    },

    initEventHandlers: function() {
        var me = this;

        var $dateStart = me.$container.find('input[name="startDate"]');
        var $dateEnd = me.$container.find('input[name="endDate"]');
        $dateStart.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });
        $dateEnd.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });

        var currentDate = new Date();
        var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        $dateStart.datepicker( "setDate", firstDay);
        $dateStart.on('changeDate', function(e) {
            $dateEnd.datepicker('setStartDate', e.date);
        });

        var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        $dateEnd.datepicker( "setDate", lastDay);
        $dateEnd.datepicker( "setStartDate", firstDay);


        me.$tableOrderList.on('click', '.btn-edit', function(e){
            e.preventDefault();
            var orderNo = $(this).data('orderNo');
            var order = me.$tableOrderList.bootstrapTable('getRowByUniqueId', orderNo);
            shopOrderDeliveryController.openModalOrderDetail(order);
        });

        me.$container.on('change', 'input[name=startDate], input[name=endDate], ' +
        'select[name=filterOrderStatus], select[name=searchType]', function(e){
            e.preventDefault();
            if(shopOrderDeliveryController.isFieldNotEmpty(me.$container, 'endDate') == true) {
                me.loadOrderList();
            }
        });

        me.$container.find('input[name=searchText]').keydown(function (e) {
            setTimeout(function () {
                shopOrderDeliveryController.checkInputSearch(me.$container, 'input[name=searchText]', '.search-clear');
                if(shopOrderDeliveryController.isFieldNotEmpty(me.$container, 'endDate') == true) {
                    me.loadOrderList();
                }
            }, 1);
        });

        me.$container.on('click', '.action-click-icon', function (e) {
            e.preventDefault();
            me.loadOrderList();
        });

        me.$container.on('click', '.search-clear', function(e){
            e.preventDefault();
            me.$container.find('input[name=searchText]').val("");
            me.$container.find('.search-clear').addClass('hide');
        });

        me.$container.on('click', '#update-status-order-list', function(e){
            e.preventDefault();
            var changeOrderStatus = me.$container.find('select[name=changeOrderStatus]').val();
            if(changeOrderStatus != '') {
                me.updateOrderStatus();
            }else{
                siteAdminApp.alertMessage(siteAdminApp.getMessage('shop.order.mnt.no.select.status'));
            }
        });

        me.$container.on('click', '#btn-download-order-mnt', function(e){
            e.preventDefault();
            var url = '/admin/shop/ordermgmt/download/list' + me.getOptionSearch();
            window.open(url, '_blank');
        });
    },

    initBootstrapTable : function() {
        var me = this;

        var url = '/admin/shop/ordermgmt/listOrders.json' + me.getOptionSearch();

        me.$tableOrderList.bootstrapTable({
            url: url,
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
            columns: [
                {
                    checkbox: true,
                    width: '3%'
                },
                {
                    field: 'orderNo',
                    title: '주문번호',
                    width: '5%',
                    align: 'center'
                },
                {
                    field: 'firstCategoryName',
                    title: '카테고리',
                    width: '10%'
                },
                {
                    field: 'firstProductName',
                    title: '상품명',
                    width: '15%'
                },
                {
                    field: 'totalItemsInCart',
                    title: '수량',
                    align: 'center',
                    width: '5%',
                    formatter: function(value){
                        return mugrunApp.formatNumber(value);
                    }
                },
                {
                    field: 'paymentAmount',
                    title: '총주문금액',
                    align: 'center',
                    width: '7%',
                    formatter: function(value){
                        return mugrunApp.formatNumber(value);
                    }
                },
                {
                    field: 'ordererName',
                    title: '주문자',
                    width: '9%'
                },
                {
                    field: 'regDate',
                    title: '주문일',
                    width: '8%',
                    formatter: function(value,object){
                        return mugrunApp.formatDate(object.regDate, 'YYYY-MM-DD');
                    }
                },
                {
                    field: 'modDatePayment',
                    title: '결제일',
                    width: '8%',
                    formatter: function(value,object){
                        if(object.paymentStatus == 2){
                            return mugrunApp.formatDate(object.modDatePayment, 'YYYY-MM-DD');
                        } else {
                            return '';
                        }
                    }
                },
                {
                    field: 'paymentType',
                    title: '결제수단',
                    width: '10%',
                    formatter: function(value, object){
                        if(value == 1) {
                            return siteAdminApp.getMessage('shop.order.payment.type.pay1');
                        }
                        if(value == 2) {
                            return siteAdminApp.getMessage('shop.order.payment.type.pay2');
                        }
                        if(value == 3) {
                            return siteAdminApp.getMessage('shop.order.payment.type.pay3');
                        }
                        if(value == 4) {
                            return siteAdminApp.getMessage('shop.order.payment.type.pay4');
                        }

                        return value;
                    }
                },
                {
                    field: 'paymentStatus',
                    title: '결제상태',
                    width: '5%',
                    formatter: function(value, object){
                        var paymentStatus  = object.paymentStatus;
                        if(paymentStatus == 1) {
                            return siteAdminApp.getMessage('shop.order.payment.status.npaid');
                        }
                        if (paymentStatus == 2) {
                            return siteAdminApp.getMessage('shop.order.payment.status.paid');
                        }

                        return paymentStatus;
                    }
                },
                {
                    field: 'status',
                    title: '상태',
                    width: '10%',
                    formatter: function(value, object){
                        return shopOrderDeliveryController.getTextStatusOrder(object);
                    }
                },
                {
                    field: 'edit',
                    align: 'center',
                    width: '5%',
                    formatter: function(value,object){
                        return '<a class="" href="javascript:void(0)">' +
                            '<i class="inline glyphicon glyphicon-pencil btn-edit" data-order-no="'+object.orderNo+'"></i>' +
                            '</a>';
                    }
                }
            ]
        });

        setTimeout(function(){
            me.loadOrderList();
        }, 500);

    },

    loadOrderList: function(){
        var me = this;

        var url = '/admin/shop/ordermgmt/listOrders.json' + me.getOptionSearch();
        me.$tableOrderList.bootstrapTable('refresh', {url: url});

    },

    getOptionSearch: function(){
        var me = this;

        var filterOrderStatus = me.$container.find('select[name=filterOrderStatus]').val();
        var startDate = me.$container.find('input[name="startDate"]').val();
        var endDate = me.$container.find('input[name="endDate"]').val();
        var searchType = me.$container.find('select[name=searchType]').val();
        var searchText = me.$container.find('input[name="searchText"]').val();
        var url = '?mallNo=' + shopOrderDeliveryController.shopMallNo
            + '&filterOrderStatus=' + filterOrderStatus + '&startDate=' +
            startDate + '&endDate=' + endDate + '&searchType=' + searchType + '&searchText=' + searchText;

        return url;
    },

    updateOrderStatus: function(){
        var me = this;

        var changeOrderStatus = me.$container.find('select[name=changeOrderStatus]').val();
        var selections = me.$tableOrderList.bootstrapTable('getSelections');
        if(selections.length>0) {
            var ids = [];
            for (var i = 0; i < selections.length; i++) {
                ids.push(selections[i].orderNo);
            }

            $.ajax({
                url: '/admin/shop/ordermgmt/updateOrdersStatus.json',
                type: 'GET',
                dataType: 'json',
                data: {
                    orderNos: ids.join(','),
                    changeOrderStatus: changeOrderStatus
                },
                success: function (data) {
                    if (data.success) {
                        me.loadOrderList();
                        deliveryManagementController.loadPendingOrdersList();
                        deliveryManagementController.loadShippingOrdersList();
                        returnRefundController.loadRRRequestOrdersList();
                        returnRefundController.loadRRefundOrdersList();
                        siteAdminApp.alertMessage(siteAdminApp.getMessage('common.save.done'));
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function () {
                    me.$container.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    me.$container.unmask();
                }
            });
        }else{
            siteAdminApp.alertMessage(siteAdminApp.getMessage('shop.order.mnt.no.select.data'));
        }
    }

});

var orderManagementController = new OrderManagementController('#container-order-delivery-order');

//prevent hit enter (Don't user keyCode => because it's doesn't work on old version IE)
$(function() {
    $("#form-search-order-action").submit(function() { return false; });
});


