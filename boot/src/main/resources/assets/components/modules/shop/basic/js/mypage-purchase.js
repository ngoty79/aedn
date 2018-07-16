$(document).ready(function () {
    var $orderDetailModal = $('#modal-shop-orderDetail');

    var $returnRefundModal = $('#modal-shop-return-refund');


    // decrease more product
    $("a[id^='cancelOrder_']").click(function(){
        var orderNo = $(this).attr('id').split('_')[1];

        siteApp.confirmDialog(ask_cancel, function() {
            $.post(
                "/site/module/shop/cancelPurchase.json",
                {
                    orderNo: orderNo
                },
                function (data, status) {
                    if (data.success == true) {
                        siteApp.alertMessage(cancel_sucess, function(){
                            location.reload();
                        });
                    }
                },
                "json"
            );
        });
    });

    $("a[id^='requestRefund_']").click(function(){
        var orderNo = $(this).attr('id').split('_')[1];

        $returnRefundModal.find('input[name=orderNo]').val(orderNo);
        $returnRefundModal.modal({backdrop: 'static', show: true});

        /*siteApp.confirmDialog('제품의 불량이 아닌 단순 변심의 경우 교환/환불이 되지 않을 수 있습니다. 신청하시겠습니까?', function() {

        });*/
    });

    $('#returnForm').validate({
        errorPlacement: function(error, element) {
            if(element.attr("name") == "returnReason"){
                $('#returnForm .error-msg').removeClass('hide');
            }
        },
        highlight: function(element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            if($(element).attr("name") == 'returnReason'){
                $('#returnForm .error-msg').removeClass("error");
            }
        },
        onkeyup: false,
        errorElement: "em",
        submitHandler: function(form, event) {
            var orderNo = $returnRefundModal.find('input[name=orderNo]').val();
            var returnReason = $returnRefundModal.find('textarea[name=returnReason]').val();

            $.post(
                "/site/module/shop/requestRefund.json",
                {
                    orderNo: orderNo,
                    returnReason: returnReason
                },
                function (data, status) {
                    if (data.success == true) {
                        location.reload();
                    }
                },
                "json"
            );
        }
    });

    $("a[id^='completeSale_']").click(function () {
        var orderNo = $(this).attr('id').split('_')[1];

        $.post(
            "/site/module/shop/completeSale.json",
            {
                orderNo: orderNo
            },
            function (data, status) {
                if (data.success == true) {
                    location.reload();
                }
            },
            "json"
        );
    });

    $('.order-detail').click(function(e) {
        e.preventDefault();

        var url = '/site/module/shop/orderDetail.html?orderNo=' + $(this).data('orderno');
        $orderDetailModal.find('#modalBody').load(url, function() {
            $orderDetailModal.modal({backdrop: 'static', show: true});
        })
    });
});

function gotoDetailProduct(productNo){
    var hasProduct = false;
    $.ajax({
        type: 'POST',
        async: false,
        url: "/site/module/shop/checkProductDeleted.json",
        data: { productNo: productNo},
        complete: function(responseTxt, statusTxt, xhr) {
            var exist = (JSON.parse(responseTxt.responseText)).data;
            if(!exist){
                alert("해당 제품은 판매 중지 등의 사유로 인하여 페이지 정보가 제공되지 않습니다.");
            }
            else{
                hasProduct = true;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("예상하지 못한 오류가 발생했습니다. 시스템 관리자에게 문의하시기 바랍니다.");
        },
        dataType: 'json'
    });
    return hasProduct;
}