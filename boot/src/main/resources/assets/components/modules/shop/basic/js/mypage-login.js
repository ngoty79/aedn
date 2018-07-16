$(document).ready(function () {
    var $id = $('#id'),
        $psw = $('#psw'),
        $guest = $('#guest'),
        $orderNum = $('#order_num');

    $('#form-shop-login').on('submit', function(event) {
        if( $.trim($id.val()).length<1 ){
            siteApp.alertMessage(msgNoID, function(){
                $id.focus();
                $id.val('');
            });
            event.preventDefault();
            return;
        }
        if( $.trim($psw.val()).length<1 ){
            siteApp.alertMessage(msgNoID, function(){
                $psw.focus();
                $psw.val('');
            });
            event.preventDefault();
            return;
        }
    });

    $("#btnLoginQuest").click(function () {
        if( $.trim($guest.val()).length<1 ){
            siteApp.alertMessage('주문자를 입력하여 주세요.', function(){
                $guest.focus();
                $guest.val('');
            });
            return;
        }
        if( $.trim($orderNum.val()).length<1 ){
            siteApp.alertMessage('주문번호를 입력하여 주세요.', function(){
                $orderNum.focus();
                $orderNum.val('');
            });
            return;
        }

        $.post(
            "/site/module/shop/login-nonmember.json",
            {
                orderName: $.trim($guest.val()),
                orderNo: $.trim($orderNum.val())
            },
            function (data) {
                if (data.success == true) {
                    window.location = $("#btnLoginQuest").attr('nexturl');
                } else {
                    siteApp.alertMessage('주문내역이 존재하지 않습니다. 다시 시도해 주세요.', function(){
                        $guest.val('');
                        $orderNum.val('');
                        $guest.focus();
                    });
                }
            },
            "json"
        );
    });
});