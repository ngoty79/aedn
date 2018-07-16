$( document ).ready(function(){
    var EventDetailController = function (selector) {
        this.init(selector);
    };

    $.extend(EventDetailController.prototype, {
        $container: null,
        COOKIE_PREFIX_VIEW_NAME: 'eventViewName_',
        MAX_COMMENT_LENGTH: 200,
        init: function (selector) {
            var me = this;
            me.$container = $(selector);
            me.eventNo = me.$container.find(':hidden[name=eventNo]').val();
            me.userNo = me.$container.find(':hidden[name=userNo]').val();
            me.userId = me.$container.find(':hidden[name=userId]').val();
            me.userNickName = me.$container.find(':hidden[name=userNickName]').val();
            me.page = me.$container.find(':hidden[name=page]').val();
            me.cookieKey = me.COOKIE_PREFIX_VIEW_NAME + me.eventNo;
            me.$btnList = me.$container.find('#btn-clubhouse-list');
            me.$btnApply = me.$container.find('#btn-clubhouse-apply');
            me.$btnApplyStandby = me.$container.find('#btn-clubhouse-apply-standby');
            me.$containerComment = me.$container.find('#container-clubhouse-detail-comment');
            me.$formComment = me.$container.find('#form-clubhouse-comment');
            me.$btnAddComment = me.$container.find('#btn-clubhouse-addComment');
            me.$txtDownCount = me.$container.find('#txt-clubhouse-downcount');
            me.$txtComment = me.$container.find('#txt-clubhouse-comment');
            me.$commentCount = me.$container.find('#txt-clubhouse-commentCount');
            me.$replyTemplate= $('#tmpl-input-comment');
            me.preventInput = false;
            me.initEventHandlers();
            me.loadComments();
        },
        initEventHandlers: function() {
            var me = this;
            //create cookie for handle view count
            if($.cookie(me.cookieKey) == null || $.cookie(me.cookieKey) == ''){
                $.cookie(me.cookieKey, me.eventNo, { expires: 7 });
            }

            me.$btnList.click(function(e){
                e.preventDefault();
                var pageNo = $(this).data('page');
                siteApp.redirectPage($(location).attr('pathname'), 'POST', {page: pageNo});
            });

            me.$btnApply.click(function(){
                var applyUrl = $(this).data().url;
                me.checkApplyEvent(applyUrl, '1');
            });
            me.$btnApplyStandby.click(function(){
                var applyUrl = $(this).data().url;
                me.checkApplyEvent(applyUrl, '2');
            });

            me.$btnAddComment.click(function(){
                me.addComment();
            });

            me.$txtComment.keyup(function() {
                var length = $(this).val().length;
                me.$txtDownCount.text(length + "/200자");
                if(length > me.MAX_COMMENT_LENGTH){
                    me.preventInput = true;
                }
                if(me.preventInput){
                    me.$txtComment.addClass('error');
                }else{
                    me.$txtComment.removeClass('error');
                }
            });

            me.$containerComment.on('click', 'button[name=deleteComment]', function(){
                var commentNo = $(this).data().commentNo;
                me.deleteComment(commentNo, $(this));
            });

            me.$containerComment.on('click', 'button[name=replyComment]', function(){
                var commentNo = $(this).data().commentNo;
                me.replyComment(commentNo, $(this));
            });

            me.$containerComment.on('click', 'button[name=modifyComment]', function(){
                var commentNo = $(this).data().commentNo;
                me.modifyComment(commentNo, $(this));
            });

            me.$containerComment.on('click', 'button[name=addReplyComment]', function(){
                me.addReplyComment($(this));
            });

        },
        loadComments: function(){
            var me = this;
            me.$containerComment.load('/site/clubhouse/loadEventCommentList?eventNo=' + me.eventNo, function(){

            });
        },
        checkApplyEvent: function(applyUrl, applyType){
            var me = this;
            $.ajax({
                type: "GET",
                url: '/site/clubhouse/canApplyEvent.json',
                data: {
                    eventNo: me.eventNo,
                    applyType: applyType
                },
                dataType: 'json',
                success: function (result) {
                    if(result.canApply == true){
                        window.location.href = applyUrl;
                    }else{
                        var errorMessage = "";
                        if(result.error_code == "1"){
                            errorMessage = siteApp.getMessage('component.module.clubhouse.apply.error');
                        }else if(result.error_code == "2"){
                            errorMessage = siteApp.getMessage('component.module.clubhouse.apply.duplicate');
                        }else if(result.error_code == "3"){
                            errorMessage = siteApp.getMessage('component.module.clubhouse.apply.event_close');
                        }else if(result.error_code == "4"){
                            errorMessage = siteApp.getMessage('component.module.clubhouse.apply.attend_wait');
                        }
                        siteApp.alertMessage(errorMessage, function(){
                            window.location.href = '?scene=eventDetail&eventNo=' + me.eventNo + '&page=' + me.page;
                        });
                    }
                }
            });
        },
        increaseCommentCount: function( value ){
            var me = this;
            var cnt = parseInt(me.$commentCount.text().replace("(", "").replace(")", ""));
            cnt = cnt + value;
            me.$commentCount.text("(" + cnt + ")");
        },
        addComment: function(){
            var me = this;
            if($.trim(me.$txtComment.val()).length == 0 || me.$txtComment.val().length>me.MAX_COMMENT_LENGTH){
                me.$txtComment.addClass('error');
                return;
            }else{
                me.$txtComment.removeClass('error');
                me.$btnAddComment.prop('disabled', true);
                $.ajax({
                    type: "POST",
                    url: '/site/clubhouse/addEventComment.json',
                    data: {
                        eventNo: me.eventNo,
                        comment: me.$txtComment.val()
                    },
                    dataType: 'json',
                    success: function (data) {
                        me.increaseCommentCount(1);
                        me.$txtComment.val('');
                        me.$txtComment.keyup();
                        me.loadComments();
                        me.$btnAddComment.prop('disabled', false);
                    }
                });
            }
        },
        deleteComment: function(commentNo, $btn){
            var me = this;
            $btn.prop('disabled', true);
            $.ajax({
                type: "POST",
                url: '/site/clubhouse/deleteComment.json',
                data: {
                    commentNo: commentNo
                },
                dataType: 'json',
                success: function (data) {
                    if($btn.data().parent == '1'){
                        me.increaseCommentCount(-1);
                    }
                    me.loadComments();
                }
            });
        },
        modifyComment: function(commentNo, $btn){
            var me = this;
            var $containerComment = $('#container-reply-comment-' + commentNo);
            if($containerComment.length>0) {
                if ($containerComment.attr('data-type') == 'edit') {
                    $containerComment.attr('data-type', '');
                    $containerComment.empty();
                } else {
                    $containerComment.attr('data-type', 'edit');
                    $containerComment.empty();

                    $.ajax({
                        type: "GET",
                        url: '/site/clubhouse/getComment.json',
                        data: {
                            commentNo: commentNo
                        },
                        dataType: 'json',
                        success: function (data) {
                            me.$containerReplyComment = $containerComment;
                            var tmplData = {
                                userId: me.userId,
                                isReply: false,
                                userNickName: me.userNickName,
                                commentNo: commentNo,
                                data: data.comment,
                                datetime: moment().format('YYYY-MM-DD hh:mm')
                            }
                            var $reply = $.tmpl(me.$replyTemplate.html(), tmplData);
                            me.$containerReplyComment.append($reply);
                            var $textarea = $reply.find('textarea');
                            $textarea.focus();
                            me.initInputCommentEvent($containerComment);

                        }
                    });
                }
            }

        },
        replyComment: function(commentNo, $btn){
            var me = this;
            var $containerComment = $('#container-reply-comment-' + commentNo);
            if($containerComment.length>0){
                if($containerComment.attr('data-type') == 'reply'){
                    $containerComment.attr('data-type', '');
                    $containerComment.empty();
                }else{
                    $containerComment.attr('data-type', 'reply');
                    $containerComment.empty();
                    me.$containerReplyComment = $containerComment;
                    var tmplData = {
                        userId: me.userId,
                        isReply: true,
                        userNickName: me.userNickName,
                        parentCommentNo: commentNo,
                        datetime: moment().format('YYYY-MM-DD hh:mm')
                    }
                    var $reply = $.tmpl(me.$replyTemplate.html(), tmplData);
                    me.$containerReplyComment.append($reply);
                    $reply.find('textarea').focus();
                    me.initInputCommentEvent($containerComment);
                }

            }
        },
        initInputCommentEvent: function($containerComment){
            var me = this;
            $containerComment.find('textarea').keyup(function() {
                var length = $(this).val().length;
                $containerComment.find('.text-downcount').text(length + "/200자");
            });
            $('.container-reply-comment').each(function(){
                if($(this).attr('id') != $containerComment.attr('id')){
                    $(this).empty();
                }
            });
        },
        addReplyComment: function($btn){
            var me = this,
                $con = $btn.closest('.reply.input'),
                $textarea = $con.find('textarea'),
                commentNo = $con.find(':hidden[name=commentNo]').val(),
                parentCommentNo = $con.find(':hidden[name=parentCommentNo]').val(),
                value = $textarea.val();
            if($.trim(value) == '' || value.length>200){
                $textarea.addClass('error');
                return;
            }else{
                $textarea.removeClass('error');
                $btn.prop('disabled', true);
                $.ajax({
                    type: "POST",
                    url: '/site/clubhouse/addEventComment.json',
                    data: {
                        eventNo: me.eventNo,
                        commentNo: commentNo,
                        parentCommentNo: parentCommentNo,
                        comment: value
                    },
                    dataType: 'json',
                    success: function (data) {
                        me.increaseCommentCount(1);
                        me.loadComments();
                    }
                });
            }

        },
        showApplyPeriodMsg: function(message){
            BootstrapDialog.show({
                title: siteApp.getMessage('component.module.msg'),
                message: message,
                buttons: [{
                    label: siteApp.getMessage('component.module.confirm'),
                    action: function( dialog ) {
                        dialog.close();
                    }
                }]
            });
        }
    });

    window.detailController = new EventDetailController('.container-clubhouse-wrapper');
});