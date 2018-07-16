var ShopOrderDeliveryController = function (selector) {
    this.init(selector);
};

$.extend(ShopOrderDeliveryController.prototype, {
    $container: null,
    $commonField: [],

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$modalOrderDetail  = me.$container.find('#modal-order-detail');
        me.$formOrderStatus   = me.$modalOrderDetail.find('#form-order-status');
        me.$formDeliveryInfo  = me.$modalOrderDetail.find('#form-delivery-info');
        me.$formReturnInfo    = me.$modalOrderDetail.find('#form-return-info');
        me.shopMallNo         = $('input[name="mallNo"]').val();

        me.initUi();
        me.initEventHandlers();
    },

    initFormValidation: function(){
        var me = this;

        me.$formOrderStatus.formValidation({
            framework: 'bootstrap',
            icon: {
                //valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'orderStatus': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                        }
                    }
                }
            }
        })
        .on('change', '[name=orderStatus]', function(e){
            var status = $(this).val();
            me.checkOrderStatus(status);
        })
        // Showing only one message each time
        .on('err.validator.fv', function(e, data) {
            // $(e.target)    --> The field element
            // data.fv        --> The FormValidation instance
            // data.field     --> The field name
            // data.element   --> The field element
            // data.validator --> The current validator name

            data.element
                .data('fv.messages')
                // Hide all the messages
                .find('.help-block[data-fv-for="' + data.field + '"]').hide()
                // Show only message associated with current validator
                .filter('[data-fv-validator="' + data.validator + '"]').show();
        });

        me.$formDeliveryInfo.formValidation({
            framework: 'bootstrap',
            icon: {
                //valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'deliveryInvoiceNo': {
                    enabled: false,
                    row: '.controls',
                    validators: {
                        notEmpty: {
                        }
                    }
                }
            }
        })
        // Showing only one message each time
        .on('err.validator.fv', function(e, data) {
            // $(e.target)    --> The field element
            // data.fv        --> The FormValidation instance
            // data.field     --> The field name
            // data.element   --> The field element
            // data.validator --> The current validator name

            data.element
                .data('fv.messages')
                // Hide all the messages
                .find('.help-block[data-fv-for="' + data.field + '"]').hide()
                // Show only message associated with current validator
                .filter('[data-fv-validator="' + data.validator + '"]').show();
        });

        me.$formReturnInfo.formValidation({
            framework: 'bootstrap',
            icon: {
                //valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'refundAmount': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: '환불금액을 입력하여 주세요'
                        },
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'refundResult': {
                    row: '.controls',
                    validators: {
                        stringLength: {
                            max: 100,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 100})
                        }
                    }
                }
            }
        })
            // Showing only one message each time
            .on('err.validator.fv', function(e, data) {
                // $(e.target)    --> The field element
                // data.fv        --> The FormValidation instance
                // data.field     --> The field name
                // data.element   --> The field element
                // data.validator --> The current validator name

                data.element
                    .data('fv.messages')
                    // Hide all the messages
                    .find('.help-block[data-fv-for="' + data.field + '"]').hide()
                    // Show only message associated with current validator
                    .filter('[data-fv-validator="' + data.validator + '"]').show();
            });
    },

    initUi: function() {
        var me = this;

        me.$commonField = [
            {
                field: 'orderNo',
                title: '주문번호',
                width: '10%',
                align: 'center'
            },
            {
                field: 'firstCategoryName',
                title: '카테고리',
                width: '15%'
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
                width: '10%',
                formatter: function(value){
                    return mugrunApp.formatNumber(value);
                }
            },
            {
                field: 'paymentAmount',
                title: '총주문금액',
                align: 'center',
                width: '10%',
                formatter: function(value){
                    return mugrunApp.formatNumber(value);
                }
            },
            {
                field: 'ordererName',
                title: '주문자',
                width: '10%'
            },
            {
                field: 'orderDate',
                title: '주문일자',
                width: '10%',
                formatter: function(value,object){
                    return mugrunApp.formatDate(value, 'YYYY-MM-DD');
                }
            },
            {
                field: 'status',
                title: '상태',
                width: '15%',
                formatter: function(value, object){
                    return me.getTextStatusOrder(object);
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
        ];

    },

    initEventHandlers: function() {
        var me = this;

        me.$modalOrderDetail.on('hidden.bs.modal', function () {
            me.$modalOrderDetail.modal('hide');
            me.$formOrderStatus[0].reset();
            if(me.$formOrderStatus.data('formValidation')) {
                me.$formOrderStatus.data('formValidation').destroy();
            }
            me.$formDeliveryInfo[0].reset();
            if(me.$formDeliveryInfo.data('formValidation')) {
                me.$formDeliveryInfo.data('formValidation').destroy();
            }
            me.$formReturnInfo[0].reset();
            if(me.$formReturnInfo.data('formValidation')) {
                me.$formReturnInfo.data('formValidation').destroy();
            }
        });

        me.$modalOrderDetail.on('click', '.btn-dialog-save', function (e) {
            e.preventDefault();
            var formOrderStatus = me.$formOrderStatus.data('formValidation');
            var formDeliveryInfo = me.$formDeliveryInfo.data('formValidation');
            var formReturnInfo   = me.$formReturnInfo.data('formValidation');

            formOrderStatus.validate();
            formDeliveryInfo.validate();
            formReturnInfo.validate();
            if (!formOrderStatus.isValid() || !formDeliveryInfo.isValid() || !formReturnInfo.isValid()) {
                return;
            } else{
                var order = me.getOrderDetail();
                me.updateOrder(order);
            }
        });

    },

    openModalOrderDetail: function(order){
        var me = this;

        me.initFormValidation();

        me.buildOrderDetail(order);

    },

    buildOrderDetail: function(order){
        var me = this;

        $.ajax({
            url: '/admin/shop/ordermgmt/productDetail.json',
            type: 'GET',
            dataType: 'json',
            data: {
                orderNo: order.orderNo
            },
            success: function (data) {
                if (data.success) {
                    var products = data.data;

                    me.$modalOrderDetail.find('.lbl-order-no').text('주문번호: ' + order.orderNo);
                    me.$modalOrderDetail.find('input[name=orderNo]').val(order.orderNo);

                    var orderStatus = me.getOrderStatusCode(order);
                    me.$modalOrderDetail.find('select[name=orderStatus]').val(orderStatus);

                    me.checkOrderStatus(orderStatus);

                    //customer info
                    me.$modalOrderDetail.find('.lbl-orderer-id').text('ID: ' + me.checkNullReturnBlank(order.regUserId));

                    me.$modalOrderDetail.find('.lbl-orderer-name').text('성명: ' + me.checkNullReturnBlank(order.ordererName));

                    me.$modalOrderDetail.find('.lbl-orderer-phone').text('전화번호: ' + me.checkNullReturnBlank(order.ordererPhoneNo));

                    me.$modalOrderDetail.find('.lbl-orderer-email').text('이메일: ' + me.checkNullReturnBlank(order.ordererEmail));

                    // product info
                    if(products.length > 0) {
                        me.$modalOrderDetail.find('#form-product-info .form-body .product-infor-container').empty().append(
                            $.tmpl(me.$container.find('#tmpl-product-info').html(), {products: products})
                        );
                    }

                    if(order.orderAmount == null) {
                        order.orderAmount = 0;
                    } else {
                        order.orderAmount = mugrunApp.formatNumber(order.orderAmount);
                    }
                    me.$modalOrderDetail.find('.lbl-order-amount').text('상품금액: ' + order.orderAmount + '원');

                    if(order.deliveryAmount == null || order.deliveryAmount == 0) {
                        me.$modalOrderDetail.find('.lbl-delivery-fee').text('무료');
                    } else {
                        var text = '배송비: ';
                        text+="유료  ";
                        text+=mugrunApp.formatNumber(order.deliveryAmount);
                        text+="원";
                        text+=" / ";
                        if(order.deliveryCollectYn == 1){
                            text+="주문시 결제(선결제)";
                        } else{
                            text+="착불";
                        }
                        me.$modalOrderDetail.find('.lbl-delivery-fee').text(text);
                    }

                    if(order.paymentAmount == null) {
                        order.paymentAmount = 0;
                    } else {
                        order.paymentAmount = mugrunApp.formatNumber(order.paymentAmount);
                    }
                    me.$modalOrderDetail.find('.lbl-total-payment').text('총결제금액: ' + order.paymentAmount + '원');

                    //payment info
                    me.$modalOrderDetail.find('.lbl-payment-type').text(me.getPaymentMethod(order.paymentAmount, order.pointAmount, order.paymentType));

                    if(order.paymentType == 2){
                        me.$modalOrderDetail.find('.lbl-bank-info').text('입금계좌정보: ' + me.checkNullReturnBlank(order.bankName) + ' / ' + me.checkNullReturnBlank(order.accountNo));
                        me.$modalOrderDetail.find('.lbl-bank-info').closest('.form-group').removeClass('hide');

                        me.$modalOrderDetail.find('.lbl-refund-info').text('환불계좌정보: ' + me.checkNullReturnBlank(order.refundBankName)
                        +' / '+ me.checkNullReturnBlank(order.refundAccountNo)+' / '+me.checkNullReturnBlank(order.refundOwnerName));
                        me.$modalOrderDetail.find('.lbl-refund-info').closest('.form-group').removeClass('hide');
                    } else {
                        me.$modalOrderDetail.find('.lbl-bank-info').closest('.form-group').addClass('hide');
                        me.$modalOrderDetail.find('.lbl-refund-info').closest('.form-group').addClass('hide');
                    }

                    if(order.paymentType == 1){
                        me.$modalOrderDetail.find('.lbl-card-name').text('결제카드: ' + me.checkNullReturnBlank(order.cardName));
                        me.$modalOrderDetail.find('.lbl-card-name').closest('.form-group').removeClass('hide');
                    } else {
                        me.$modalOrderDetail.find('.lbl-card-name').closest('.form-group').addClass('hide');
                    }
                    if(order.paymentType == 1){
                        if(order.monthCount == null || order.monthCount == 0) {
                            me.$modalOrderDetail.find('.lbl-month-count').text('할부: 일시불');
                        } else {
                            me.$modalOrderDetail.find('.lbl-month-count').text('할부: ' + order.monthCount + '개월');
                        }
                        me.$modalOrderDetail.find('.lbl-month-count').closest('.form-group').removeClass('hide');
                    } else {
                        me.$modalOrderDetail.find('.lbl-month-count').closest('.form-group').addClass('hide');
                    }

                    //delivery info
                    me.$modalOrderDetail.find('.lbl-receiver-name').text('받는사람: ' + me.checkNullReturnBlank(order.receiverName));

                    me.$modalOrderDetail.find('.lbl-receiver-phone').text('전화번호: ' + me.checkNullReturnBlank(order.receiverPhoneNo));

                    me.$modalOrderDetail.find('.lbl-receiver-address1').text('주소: ' + me.checkNullReturnBlank(order.receiverAddress1)
                    + ' ' + me.checkNullReturnBlank(order.receiverAddress2));

                    me.$modalOrderDetail.find('.lbl-order-message').text('메시지: ' + me.checkNullReturnBlank(order.orderMessage));

                    me.$modalOrderDetail.find('input[name=deliveryInvoiceNo]').val(order.deliveryInvoiceNo);


                    // refund reason info
                    me.$modalOrderDetail.find('.lbl-return-reason').text(order.returnReason);
                    me.$modalOrderDetail.find('input[name=refundAmount]').val(order.refundAmount);
                    me.$modalOrderDetail.find('input[name=refundResult]').val(order.refundResult);

                    me.$modalOrderDetail.modal({backdrop: 'static', show: true});
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

    },

    getOrderDetail: function(){
        var me = this;
        var order = {};
        order.orderNo = me.$modalOrderDetail.find('input[name=orderNo]').val();
        order.orderStatus = me.$modalOrderDetail.find('select[name=orderStatus]').val();
        order.deliveryInvoiceNo = me.$modalOrderDetail.find('input[name=deliveryInvoiceNo]').val();
        order.refundAmount = me.$modalOrderDetail.find('input[name=refundAmount]').val();
        order.refundResult = me.$modalOrderDetail.find('input[name=refundResult]').val();
        return order;
    },

    getOrderStatusCode: function(order){
        var paymentStatus  = order.paymentStatus;
        var orderStatus  = order.orderStatus;
        var deliveryStatus  = order.deliveryStatus;
        var returnStatus  = order.returnStatus;

        var defaultStatusCbxValue = '';

        if (orderStatus == 1 && paymentStatus == 1) {
            defaultStatusCbxValue = 'p:1';
        }
        if (orderStatus == 1 && paymentStatus == 2) {
            defaultStatusCbxValue = 'p:2';
        }

        if (orderStatus == 2) {
            defaultStatusCbxValue = 'o:2';
        }

        if (orderStatus == 3) {
            defaultStatusCbxValue = 'o:3';
        }

        if (deliveryStatus == 1) {
            defaultStatusCbxValue = 'd:1';
        }

        if (deliveryStatus == 2) {
            defaultStatusCbxValue = 'd:2';
        }

        if (deliveryStatus == 3) {
            defaultStatusCbxValue = 'd:3';
        }

        if (returnStatus == 1) {
            defaultStatusCbxValue = 'r:1';
        }

        if (orderStatus==2 && returnStatus == 2) {
            defaultStatusCbxValue = 'r:2';
        }

        return defaultStatusCbxValue;
    },

    updateOrder: function(order){
        var me = this;

        $.ajax({
            url: '/admin/shop/ordermgmt/updateOrder.json',
            type: 'GET',
            dataType: 'json',
            data: {
                orderNo: order.orderNo,
                deliveryInvoiceNo: order.deliveryInvoiceNo,
                orderStatus: order.orderStatus,
                refundAmount: order.refundAmount,
                refundResult: order.refundResult
            },
            success: function (data) {
                if (data.success) {

                    orderManagementController.loadOrderList();
                    deliveryManagementController.loadPendingOrdersList();
                    deliveryManagementController.loadShippingOrdersList();
                    returnRefundController.loadRRRequestOrdersList();
                    returnRefundController.loadRRefundOrdersList();

                    me.$modalOrderDetail.modal('hide');
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

    },

    getTextStatusOrder: function(object){

        var paymentStatus  = object.paymentStatus;
        var orderStatus  = object.orderStatus;
        var deliveryStatus  = object.deliveryStatus;
        var returnStatus  = object.returnStatus;

        var status = '';

        if (orderStatus == 1 && paymentStatus == 1) {
            status = siteAdminApp.getMessage('shop.order.status.orderCheckedNPaid');
        }
        if (orderStatus == 1 && paymentStatus == 2) {
            status = siteAdminApp.getMessage('shop.order.status.orderCheckedPaid');
        }

        if (orderStatus == 2) {
            status = siteAdminApp.getMessage('shop.order.status.orderCancelled');
        }

        if (orderStatus == 3) {
            status =  siteAdminApp.getMessage('shop.order.status.completed');
        }

        if (deliveryStatus == 1) {
            status = siteAdminApp.getMessage('shop.order.status.deliveryPending');
        }

        if (deliveryStatus == 2) {
            status =  siteAdminApp.getMessage('shop.order.status.shipping');
        }

        if (deliveryStatus == 3) {
            status = siteAdminApp.getMessage('shop.order.status.delivered');
        }

        if (returnStatus == 1) {
            status = siteAdminApp.getMessage('shop.order.status.refundRequest');
        }

        if (orderStatus == 2 && returnStatus == 2) {
            status = siteAdminApp.getMessage('shop.order.status.refund');
        }

        return status;
    },

    isFieldNotEmpty: function($container, fieldName){
        var endDate = $container.find('input[name=' +fieldName +']').val();
        if(endDate != '') {
            return true;
        }
        return false;
    },

    checkInputSearch : function(container, inputTextSearch, iconClear){

        if(container.find(inputTextSearch).val() != ""){
            container.find(iconClear).removeClass('hide');
        } else {
            if(!container.find(iconClear).hasClass('hide')) {
                container.find(iconClear).addClass('hide');
            }
        }
    },

    checkNullReturnBlank: function(object){
        if(object == null){
            return ''
        } else {
            return object;
        }
    },

    checkOrderStatus: function(status){
        var me = this;

        if (status == 'd:2') {
            me.$formDeliveryInfo.find('input[name=deliveryInvoiceNo]').removeAttr('disabled');
            me.$formDeliveryInfo.formValidation('enableFieldValidators', 'deliveryInvoiceNo', true);
            me.$formDeliveryInfo.formValidation('revalidateField', 'deliveryInvoiceNo');

        } else {
            me.$formDeliveryInfo.formValidation('enableFieldValidators', 'deliveryInvoiceNo', false);
            me.$formDeliveryInfo.formValidation('revalidateField', 'deliveryInvoiceNo');
            me.$formDeliveryInfo.find('input[name=deliveryInvoiceNo]').attr('disabled','disabled');
        }
        if(status == 'r:1' || status == 'r:2'){
            me.$modalOrderDetail.find('#form-return-info').removeClass('hide');
        } else{
            me.$modalOrderDetail.find('#form-return-info').addClass('hide');
        }
    },

    getPaymentMethod: function(paymentAmount, pointAmount, paymentType){
        var text = "";
        if(paymentAmount == 0){
            text = "결제수단: 포인트 " + mugrunApp.formatNumber(pointAmount);
        } else {
            var paymentTypeText = "";
            if(paymentType == 1){
                paymentTypeText = "카드";
            } else if(paymentType == 2){
                paymentTypeText = "무통장입금";
            } else if(paymentType == 3){
                paymentTypeText = "에스크로";
            } else if(paymentType == 4){
                paymentTypeText = "포인트";
            }

            if(pointAmount > 0){
                text = "결제수단: 포인트 " + mugrunApp.formatNumber(pointAmount)
                + ", " + paymentTypeText + " " + mugrunApp.formatNumber(paymentAmount) + "원";
            }  else {
                text = "결제수단: " + paymentTypeText;
            }
        }
        return text;
    }

});

var shopOrderDeliveryController = new ShopOrderDeliveryController('#container-shop-order-delivery');


