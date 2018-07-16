$(document).ready(function () {

    //click next button
    $("#btnOK").click(function(){
        $.ajax({
            type: "POST",
            url: '/site/view/modifyuser/quitMemberShip.json',
            dataType: 'json',
            success: function (result) {
                if (result.success == true) {
                    $('#form-modifyuser-logout').submit();
                } else {
                    if(result.error == '1'){
                        siteApp.alertMessage(siteApp.getMessage('module.modifyuser.admin.quit.error'));
                    }else{
                        siteApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }

                }
            },
            failure: function () {

            }
        });

    });


});