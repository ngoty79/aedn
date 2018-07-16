$(document).ready(function () {
    var $password = $('#pt-mod-password'),
        $errorMsg = $('#formset-message');

    $password.focus();

    var checkPassword = function(){
        var password = $password.val() ;
        if(password.length<1){
            siteApp.alertMessage( msg.pwdMsg, function(){
                $password.focus();
            });

            return;
        }

        //check user password, if it is correct, redirect to select page
        $.ajax({
            type: "POST",
            url: '/site/view/modifyuser/checkPassword.json',
            data:{
                password:password
            },
            dataType: 'json',
            success: function (res) {
                if (res.success == true) {
                    $errorMsg.hide();
                    window.location = $("#btnNext").attr('nexturl');
                } else {
                    $errorMsg.show();
                    $password.focus();
                    $password.val('');
                    return;
                }
            },
            failure: function () {}
        });
    };
    //click next button
    $("#btnNext").click(checkPassword);

    $("input[type='password']").on("keypress", function (e) {
        $errorMsg.hide();
        if (e.which == 13) {
            checkPassword();
        }
    });


});