$(document).ready(function () {
    var $userId = $('#userId');
    var $password = $('#password');
    var $from = $('#form-checkout-login');
    $userId.focus();

    $from.find('input').on("click keypress", function (e) {
        $('#module-login-errorMsg').hide();
        if (e.which == 13) {
            loginFunction(e);
        }
    });

    $("#btnLogin").click(function(ev){
        loginFunction(ev);
    });

    var loginFunction = function (ev) {
        if(ev != null){
            ev.preventDefault();
        }

        if( $.trim($userId.val()).length<1 ){
            siteApp.alertMessage(msgNoID, function(){
                $userId.focus();
                $userId.val('');
            });
            return;
        }

        if( $.trim($password.val()).length<1 ){
            siteApp.alertMessage(msgNoPwd, function(){
                $password.focus();
                $password.val('');
            });
            return;
        }
        $from.submit();
    };


});