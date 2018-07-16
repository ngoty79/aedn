$(document).ready(function () {

    //input number only
    /*$("input[numberYn='yes']").each(function (index) {
        $(this).blur(function (event) {
            var orderCount = 0;
            if($(this).val()=='' || +$(this).val() <= 0){
                $(this).val(1);
            }
            try{
                orderCount = parseInt( $(this).val() );
            }
            catch(err){
                orderCount = 1;
            }
            var cartProductNo = $(this).attr('id').split('_')[1];
            updateProduct(cartProductNo,orderCount, null);
        });
    });*/



    // increase more product
    $("img[id^='btnAdd_']").click(function(){
        var cartProductNo = $(this).attr('id').split('_')[1];
        var txtCount = $('#ordercount_'+cartProductNo)  ;
        txtCount.attr('disabled', true);
        var nextCount = 0;
        try{
            nextCount = parseInt( txtCount.val() ) + 1;
        }
        catch(err){
            nextCount = 1;
        }
        txtCount.val(nextCount);
        updateProduct(cartProductNo,nextCount, txtCount);

    });

    // decrease more product
    $("img[id^='btnSub_']").click(function(){
        var cartProductNo = $(this).attr('id').split('_')[1];
        var txtCount = $('#ordercount_'+cartProductNo)  ;

        var nextCount = 0;
        try{
            nextCount = parseInt( txtCount.val() ) - 1;
        }
        catch(err){
            nextCount = 1;
        }
        if(nextCount>=1){
            txtCount.val(nextCount);
            txtCount.attr('disabled', true);
            updateProduct(cartProductNo,nextCount, txtCount);
        }
    });

    $("#btnSelectAll").click(function(){
        $("input[id^='chk_']").each(function () {
            if ($(this).is(':unchecked')) {
                $(this).prop('checked',true);
            }
        });
    });

    $("#btnUnselectAll").click(function(){
        $("input[id^='chk_']").each(function () {
            if ($(this).is(':checked')) {
                $(this).prop('checked',false);
            }
        });
    });

    $("#btnDeleteCart").click(function(){
        var valid = false;
        var ids = [];
        $("input[id^='chk_']").each(function (index) {

            if ($(this).is(':checked')) {
                valid = true;
                var cartProductNo = $(this).attr('id').split('_')[1];
                ids.push(cartProductNo);
            }
        });
        if(!valid){
            siteApp.alertMessage('삭제할 상품을 선택하여 주세요.', function(){
            });
            return;
        }
        else {
            siteApp.confirmDialog("선택한 상품을 삭제하시겠습니까?", function() {
                $.post(
                    "/site/module/shop/deleteCartProduct.json",
                    {
                        ids: ids.join(',')
                    },
                    function (data, status) {
                        if (data.success == true) {
                            location.reload();
                        } else {

                        }
                    },
                    "json"
                );
            });
        }
    });

    $("#btnEmptyCart").click(function(){
        var hasProduct = false;
        $(".productSelected").each(function() {
            hasProduct = true;
        });
        if (hasProduct) {
            siteApp.confirmDialog("모든 상품을 삭제하시겠습니까?", function () {
                $.post(
                    "/site/module/shop/emptyCart.json",
                    {},
                    function (data, status) {
                        if (data.success == true) {
                            location.reload();
                        } else {

                        }
                    },
                    "json"
                );
            });
        }
    });

    function updateProduct(cartProductNo, nextCount, txtCount) {
        $.ajax({
            type:"POST",
            url:"/site/module/shop/updateCartProduct.json",
            data:{
                orderCount: nextCount,
                cartProductNo: cartProductNo
            },
            dataType:'json',
            success: function (data) {
                if (txtCount != null) {
                    txtCount.attr('disabled', false);
                }
                if (data.success == true) {
                    //txtCount.val(nextCount);
                    location.reload();
                } else {

                }
            }
        });
    }
});

function checkSelectedProducts(){
    var selected = false;
    $(".productSelected").each(function() {
        if ($(this).is(':checked')) {
            selected = true;
        }
    });
    if (!selected) {
        siteApp.alertMessage("구매할 상품을 선택하여 주세요.", function() {
        });
        return false;
    } else {

        var ids = [];
        $("input[id^='chk_']").each(function (index) {

            if ($(this).is(':checked')) {
                var cartProductNo = $(this).attr('id').split('_')[1];
                ids.push(cartProductNo);
            }
        });

        $.post(
            "/site/module/shop/saveSelectedCartProduct.json",
            {
                ids: ids.join(',')
            },
            function (data, status) {
                if (data.success == true) {
                    window.location.href='/site/shop?scene=checkout';
                    return true;
                } else {
                    return false;
                }
            },
            "json"
        );
    }
}