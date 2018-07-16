//bind comment event
$(document).ready(function () {
    $("div.order_info2 .ck_same input").change(function(val){
        if($(this).is(":checked")){
            //copy
            var cusName = $("div.order_info1 input[name=cusName]").val();
            if(cusName != ''){
                $("div.order_info2 input[name=delCusName]").val(cusName);
            }

            var cusPhone1 = $("div.order_info1 input[name=cusPhone1]").val();
            if(cusPhone1 != ''){
                $("div.order_info2 input[name=delCusPhone1]").val(cusPhone1);
                $("div.order_info2 input[name=delCusMobile1]").val(cusPhone1);
            }

            var cusPhone2 = $("div.order_info1 input[name=cusPhone2]").val();
            if(cusPhone2 != ''){
                $("div.order_info2 input[name=delCusPhone2]").val(cusPhone2);
                $("div.order_info2 input[name=delCusMobile2]").val(cusPhone2);
            }

            var cusPhone3 = $("div.order_info1 input[name=cusPhone3]").val();
            if(cusPhone3 != ''){
                $("div.order_info2 input[name=delCusPhone3]").val(cusPhone3);
                $("div.order_info2 input[name=delCusMobile3]").val(cusPhone2);
            }
            //email
            var cusEmail1 = $("div.order_info1 input[name=cusEmail1]").val();
            if(cusEmail1 != ''){
                $("div.order_info2 input[name=delCusEmail1]").val(cusEmail1);
            }

            var cusEmail2 = $("div.order_info1 input[name=cusEmail2]").val();
            if(cusEmail2 != ''){
                $("div.order_info2 input[name=delCusEmail2]").val(cusEmail2);
            }

            var zipcode = $("div.order_info1 input[name=zipcode]").val();
            if(zipcode != ''){
                $("div.order_info2 input[name=delCusPostal]").val(zipcode);
            }

            var subAddress = $("div.order_info1 input[name=subAddress]").val();
            if(subAddress != ''){
                $("div.order_info2 input[name=delCusAddr1]").val(subAddress);
            }

            var address = $("div.order_info1 input[name=address]").val();
            if(address != ''){
                $("div.order_info2 input[name=delCusAddr2]").val(address);
            }
        }
    });

    if($("input[name=delCusOrdMsg]")[0]){
        $("input[name=delCusOrdMsg]").limit(50);
    }

    $('input[name=pointUse]').focus(function(){
        var pointUse = $('input[name=pointUse]').val();
        if(pointUse == 0){
            $('input[name=pointUse]').val('');
        }
    });

    $('input[name=pointUse]').blur(function(){
        var pointUse = $('input[name=pointUse]').val();
        var amount = $('.total-order-price').text() - pointUse;
        if(isNaN(pointUse) || pointUse == '' || pointUse < 0){
            $('input[name=pointUse]').val(0);
            $('input[name=pointUse]').focusin();
            $('input[name=pointUse]').focusout();
        } else if(amount < 0){
            $('.point-payment').addClass('hide');
            $('.normal-payment').removeClass('hide');
        } else {
            var realPaymentAmount = $('.payment-price').text() - pointUse;
            $('.point-use-value').text(' - ' + pointUse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $('.real-payment-amount').text(realPaymentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            if (realPaymentAmount <= 0) {
                $('.point-payment').removeClass('hide');
                $('.normal-payment').addClass('hide');
            } else {
                $('.point-payment').addClass('hide');
                $('.normal-payment').removeClass('hide');
            }
        }
    });

    $('#orderForm').validate({
        rules: {
            pointUse: {
                max: function() {
                    var max = parseInt($('.total-order-price').text());
                    var usablePoint = parseInt($('.usable-point').text());
                    if(max >= usablePoint){
                        return usablePoint;
                    } else {
                        return max;
                    }
                }
            }
        },
        errorPlacement: function(error, element) {
            if(element.attr("name") == "pointUse"){
                var max = parseInt($('.total-order-price').text());
                var usablePoint = parseInt($('.usable-point').text());
                if(max >= usablePoint){
                    $('.point-use-msg').text('사용가능한 포인트가 초과되었습니다.');
                } else {
                    var pointUse = $('input[name=pointUse]').val();
                    if(pointUse > max){
                        $('.point-use-msg').text('주문금액을 초과했습니다.');
                    } else {
                        $('.point-use-msg').text('사용가능한 포인트가 초과되었습니다.');
                    }
                }
                $('.point-use-msg').removeClass('hide');
            }
        },
        highlight: function(element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            if($(element).attr("name") == 'pay'){
                $(element).parents("div.pay_choice").addClass("error");
            } else if($(element).attr("name") == 'agree') {
                $(element).parent("div").addClass("error");
            }
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            if($(element).attr("name") == 'pay'){
                $(element).parents("div.pay_choice").removeClass("error");
            } else if($(element).attr("name") == 'agree') {
                $(element).parent("div").removeClass("error");
            } else if($(element).attr("name") == "pointUse"){
                $('.point-use-msg').addClass('hide');
                $('.point-use-value').text(' - ' + $('input[name=pointUse]').val().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                var realPaymentAmount = $('.payment-price').text() - $('input[name=pointUse]').val();
                $('.real-payment-amount').text(realPaymentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                if(realPaymentAmount <= 0){
                    $('.point-payment').removeClass('hide');
                    $('.normal-payment').addClass('hide');
                } else {
                    $('.point-payment').addClass('hide');
                    $('.normal-payment').removeClass('hide');
                }
            }
        },
        onkeyup: false,
        errorElement: "em",
        submitHandler: function(form, event) {
            var realPaymentAmount = parseInt($('.payment-price').text() - $('input[name=pointUse]').val());
            //결제 방식에 따른 분기
            var payType = $("form#orderForm input[type=radio][name=pay]:checked").val();
            
            if(payType == 1 && realPaymentAmount < 1000) {
            	alert("신용카드는 1,000원이상부터 결제가 가능합니다.");
                return false;
            }
            
            if(payType == 1) {//신용카드
            	goPay();
            } else if(payType == 2) {//무통장입금
            	doPayment(form.id);
            }

            return false;
        }
    });

    /*$(".info_option").css("border-bottom","1px solid #e5e5e5");
    var value = $("#productOption").val();
    $("#option"+value).show();
    updateTotalPayment($("#productQuantity").val());*/
});
function doPayment(formId) {
    var formObj = $('#' + formId);
    //siteApp.alertMessage('formObj=' + formObj.serialize());
    $('#btn-shop-checkout').prop('disabled', true);
    $.ajax({
        type: 'POST',
        url: '/site/module/shop/order.json',
        dataType: 'json',
        data: formObj.serialize(),
        success: function (responseData, responseStatus, responseXml) {
            if (responseData.success) {
                //move to the order complete page.
                window.location.href="?scene=checkout-complete&orderNo=" + responseData.orderNo;
            } else {
                if (responseData.msg)
                    siteApp.alertMessage(responseData.msg);
                else
                    siteApp.alertMessage('결제 실패가 발생하였습니다. 관리자에게 문의 하시기 바랍니다.');
            }
        },
        error: function () {
            siteApp.alertMessage('결제 에러가 발생하였습니다. 관리자에게 문의 하시기 바랍니다.');
        }
    });
}
function cancelCheckout() {
    siteApp.confirmDialog('구매를 취소하시겠습니까?', function(){
        document.location.href = "?scene=mypage";
    });
}

function addAddress(_address) {
    var form = $("div.order_form");
    if (_address.split(';').length >= 2) {
        var zipcode = _address.split(';')[0];
        var address = _address.split(';')[1];
        var zip1 = zipcode.substring(0, 3);
        var zip2 = zipcode.substring(3, 6);
        $("div.order_info2 input[name=delCusPostal1]", form).val(zip1);
        $("div.order_info2 input[name=delCusPostal2]", form).val(zip2);
        $("div.order_info2 input[name=delCusAddr1]", form).val(address);
    }
}


