$(document).ready(function () {
    $(".optionAction").on("click", function() {
        var $button = $(this);
        var oldValue = $button.parent().find(".sp-input").text();
        var newVal;
        if ($button.text() == "+") {
            newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 1) {
                newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 1;
            }

        }
        var actualPrice =  $button.parent().parent().parent().find(".actualPrice").text();
        var totalPrice =  newVal*actualPrice;
        totalPrice=totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        totalPrice+="원";
        $button.parent().parent().parent().find(".price").text(totalPrice);
        $button.parent().find(".sp-input").text(newVal);
        updateTotalPayment($("#productQuantity").val());

    });

    /*$("#productOption").change(function(){
        $(".info_option").css("border-bottom","1px solid #e5e5e5");
        var value = $(this).val();
        $("#option"+value).show();
        updateTotalPayment($("#productQuantity").val());
    });*/

    $(".multiplication").click(function(){
        var actualPrice =   $(this).parent().parent().find(".actualPrice").text();
        //actualPrice = 1*actualPrice;
        actualPrice = Math.round(actualPrice);

        actualPrice=actualPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(this).parent().parent().parent().parent().parent().addClass('hide');
        $(this).parent().parent().find(".sp-input").text("1");
        $(this).parent().parent().find(".price").text(actualPrice+"원");
        updateTotalPayment($("#productQuantity").val());

        if($("div[id^='option']:not(.hide)").length == 0 && _product.optionType == 3){
            $('.info_totalPayment').addClass('hide');
        }
    });


});

function updateTotalPayment(quantity) {
    var totalProdOptionPayment = calculateProdOptionPayment();
    totalProdOptionPayment = Math.round(totalProdOptionPayment);
    var deliveryFee        = 0;
    if(_product.deliveryFeeType == 2 && _product.basicDeliveryFee != 0
        && (_product.deliveryCollectYn == 1 || $('#selDeliveryType').val() == 1)){
        deliveryFee = _product.basicDeliveryFee;
    }

    if(_product.optionType == 3){
        var totalCount = calculateProdOptionCount();
        var total = deliveryFee + totalProdOptionPayment;
        total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(".totalPayment").empty();
        $(".totalPayment").append("<strong>" + total + "원</strong>(" + totalCount + "개)");
    } else {
        var totalQuantity = $(".salePrice").text() * quantity;
        totalQuantity = Math.round(totalQuantity);
        var totalPayment = totalProdOptionPayment + totalQuantity + deliveryFee;
        totalPayment = totalPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(".totalPayment").empty();
        $(".totalPayment").append("<strong>" + totalPayment + "원</strong>(" + quantity + "개)");
    }
}
function calculateProdOptionPayment(){
    var totalPayment = 0;
    $("div[id^='option']").each(function(){
        if($(this).is(":visible")){
            var actualPrice = $(this).find(".actualPrice").text();
            var quantity = $(this).find(".sp-input").text();
            totalPayment +=actualPrice*quantity;

        }
    });
    return totalPayment;
}

function calculateProdOptionCount(){
    var totalCount = 0;
    $("div[id^='option']").each(function(){
        if($(this).is(":visible")){
            var quantity = $(this).find(".sp-input").text();
            totalCount += parseInt(quantity);

        }
    });
    return totalCount;
}
