$(document).ready(function () {
    // decrease more product
    $("#postingType").change(function(){
        window.location = $("#postingType").attr('action') +'&postingType=' + $('#postingType').val();
    });

    $("a[id^='btnDelete']").click(function(){
        var postingNo = $(this).attr('id').split('_')[1];

        siteApp.confirmDialog(ask_delete, function() {
            $.post(
                "/site/module/shop/deletePost.json",
                {
                    postingNo: postingNo
                },
                function (data, status) {
                    if (data.success == true) {
                        location.reload();
                    }
                },
                "json"
            );
        });
    });
});

function displayInfos(postingNo){
    if($("#post"+postingNo).is(':visible')){
        $("#post"+postingNo).hide();
    }
    else{
        $('tr[id^="post"]').each(function() {
            $(this).hide();
        });
        $("#post"+postingNo).show();
    }
}