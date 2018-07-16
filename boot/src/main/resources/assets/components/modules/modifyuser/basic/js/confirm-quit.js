$(document).ready(function () {

    //click next button
    $("#btnOK").click(function(){
        var $option = $('input[name="unsubscribe-option"]:checked');
        window.location.href = $option.attr('nextUrl');
    });

});