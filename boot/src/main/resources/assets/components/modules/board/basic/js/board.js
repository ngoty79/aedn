// done the include
var BoardModule = {};
var THEME_PATH = '/assets/components/modules/board/css';
BoardModule.comments = {};
var $CODE = siteApp.getMessage;
$( document ).ready(function(){


    $.boardcomment = function (e, o) {
        var me = this;
        this.tmplReply = $.template('tmplReply', '<div style="padding-left: 40px;"></div>');

        this.writeCommentTmpl = $.template('writeCommentTmpl', '<div class="reply_write"><textarea cols="" rows="2" placeholder="댓글을 남겨주세요." class="pt-form-control pt-form-textarea pt-form-box-sizing"></textarea><span class="button h_large right_float"><button type="button">입력</button></span></div>');

        this.tmpl = $.template('commentTmpl', '<li class="pt-board-reply-item reply_view" id="cm_${contentNo}_${commentNo}">' +
            '<div style="height: 30px;">' +
                '<div class="pt-board-reply-info" style="display:inline-block;float: left;">' +
                    '<span class="pt-board-reply-writer" style="color: #5f7c2a;">${regUserName}</span>'+
                    '<span class="pt-board-reply-date">${strRegDateLong}</span>'+
                '</div>' +
                '<div class="" style="display:inline-block;float:right;">'+
                    '{{if canDelete == true}}<a href="#" class="pt-btn pt-btn-mini delete">삭제</a> {{/if}}' +
                    '{{if step < 5 && readOnly == false}}<a href="javascript: void(0);" class="pt-btn pt-btn-mini right_float reply_comment">' + $CODE("module.bord.writeComment") + '</a> {{/if}}' +
                '</div>'+
            '</div>'+
            '<div class="pt-board-reply-txt">{{html content}}</div>'+

            '</li>');

        /*this.dummyTmpl = $.template('dummyCommentTmpl',
         '<div class="reply_view" id="cm_${contentNo}_${commentNo}">' +
         '<p class="small_profile"><img src="${userProfileImage}" width="35" height="35" alt="' + $CODE("board.noPhoto") + '" /></p>' +
         '<dl>' +
         '<dd>${content}' +
         '</dl>' +
         '</div>');*/

        this.dummyTmpl = $.template('dummyCommentTmpl', '<li class="pt-board-reply-item reply_view" id="cm_${contentNo}_${commentNo}">' +
            '<div class="pt-board-reply-txt">${content}</div>'+
            '</li>');

        this.defaultThemePath = o.defaultThemePath;
        this.els = e;
        this.id = $(e).attr("id");
        this.siteId = $(e).find("input[name=siteId]").val();
        this.contentId = $(e).find("input[name=contentId]").val();
        this.moduleNo = $(e).find("input[name=moduleNo]").val();
        this._componentId = $(e).find("input[name=componentId]").val();
        this.displayUserName = $(e).find("input[name=displayUserName]").val();
        this.submitBnt = $(e).find("input[type=button]");
        this.textarea = $(e).find("textarea");
        this.replyContainer = $(e).find("ul.reply_container");
        this.markLine = $(e).find("div.markLine");
        this.commentView = $('#commentView_' + this.contentId + ' span');
        this.userId = $(e).find("input.userId");
        this.pass = $(e).find("input.pass");
        this.isLogin = $(e).find("input[name=isLogin]");
        this.sns_type = false;
        //cache comment object
        this.commentItems = {};
        this.extraParams = {};
        this.currentCommentObj;
        //reset input value field
        if (this.textarea.size() > 0) {
            this.textarea.val('');
            this.textarea.limit(200);
        }
        //bind event
        this.submitBnt.click(function (e) {
            me.postComment();
        });

        this.replyContainer.on('click', "button[name='addBComment']", function() {

            me.postComment( $(this).closest('div.divWriteComment') );
        }).on('keypress', "textarea", function(e) {
            if(e.which == 13) {
                console.log('ddddd');
                me.postComment( $(this).closest('div.divWriteComment') );
            }
        });

        //checking if current view is SNS view
        if($('#sns_list_wrap').size()>0){
            this.sns_type = true;
        }

        //call ajax to load comments
        this.loadComments();
        //cache comment instance
        BoardModule.comments[this.id] = this;
    };
    var $bc = $.boardcomment;
    $bc.fn = $bc.prototype = {
        version: '1.0'
    };
    $bc.fn.extend = $.extend;


    var renderComment = function(data, me) {

        var results = data['result'];
        if (results && results.length > 0) {
            //append to comment list
            $.each(results, function (index, rs) {
                me.applyDefaultValue(rs);
                console.log(rs)
                var els = me.processContent(rs, me.replyContainer);
                var obj = me.cacheComment(rs, els);
                me.bindCommentEvent(obj);
            });

        }
    };


    $bc.fn.extend({
        loadComments: function () {
            var me = this;
            $.get("/site/module/board/list-comment.json", {
                    moduleNo: me.moduleNo,
                    contentNo: me.contentId
                },
                function (data) {
                    if (data && data.success == 'true') {

                        renderComment(data, me);
                    }
                }, 'Json');
        },

        postComment: function ( dom ) {

            var me = this;
            var val = this.textarea.val();
            //copy extra params
            var params = {};

            if(dom!=null){
                params = $.extend(params,me.extraParams);
                val = dom.find('textarea').val();
            }

            if (val != '') {
                if (me.userId && me.pass) {
                    if (me.userId.val() == '') {
                        siteApp.alertMessage("사용자 이름을 입력하세요.");
                        me.userId.focus();
                        return;
                    }

                    if (me.pass.val() == '') {
                        siteApp.alertMessage("비밀번호를 입력하세요.");
                        me.pass.focus();
                        return;
                    }
                }

                // add defaults params
                params = $.extend(params, {
                    moduleNo: me.moduleNo,
                    contentNo: me.contentId,
                    componentId: me._componentId,
                    content: val,
                    userId: me.userId.val(),
                    pass: me.pass.val()
                });

                $.ajax({
                    type:"POST",
                    url:"/site/module/board/add-comment.json",
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    data:params,
                    dataType:'json',
                    success: function (data) {

                        if (data && data['success'] == 'true' && data['result'] != null) {
                            if(dom != null){
                                dom.remove();
                            }
                            var rs = data['result'];

                            me.applyDefaultValue(rs);
                            var comment = $.tmpl('commentTmpl', rs);
                            var step = rs['step'];
                            if (step > 0) {
                                comment = comment.addClass('reply_re');
                                comment.find('.pt-board-reply-info').prepend('<i class="fa fa-reply"></i>');
                                for (var i = 2; i <= step; i++) {
                                    comment = comment.wrap($.tmpl('tmplReply')).parent();
                                }
                            }
                            if (me.currentCommentObj != null) {
                                comment.insertAfter(me.currentCommentObj.els);
                            } else {
                                me.replyContainer.prepend(comment);
                            }
                            //cache comment items
                            var obj = me.cacheComment(rs, comment);
                            me.bindCommentEvent(obj);
                            //reset Value
                            me.textarea.val('');
                            me.extraParams = {};
                            me.currentCommentObj = null;
                            me.updateCommentView();
                        }
                    }
                });

            }
        },
        updateCommentView: function () {
            var me = this;
            $.get("/site/module/board/comment-count.json", {
                    contentNo: me.contentId
                },
                function (data) {
                    if (data && data['success'] == 'true') {
                        me.commentView.html(data['result'] < 0? 0: data['result']);
                        //Pinetree.page.syncContentHeight();
                    }
                }, 'Json');
        },
        deleteComment: function (obj, pass) {
            var me = this;
            $.get("/site/module/board/delete-comment.json", {
                    commentNo: obj.commentNo,
                    moduleNo: me.moduleNo,
                    contentNo: obj.contentNo,
                    pass: pass
                },
                function (data) {
                    me.replyContainer.empty();

                    //document.location.reload();
                    renderComment(data, me);
                    me.updateCommentView();
                }, 'Json');
        },

        cacheComment: function (rs, els) {
            var me = this;
            var obj = {
                els: els,
                siteId: rs['siteId'],
                contentNo: rs['contentNo'],
                commentNo: rs['commentNo'],
                step: rs['step'],
                commentOrder: rs['commentOrder']
            };
            me.commentItems['cm_' + rs['contentNo'] + '_' + rs['commentNo']] = obj;
            return obj;
        },
        /**
         * bind event for new comment item (delete, add comment)
         * @param els
         */
        bindCommentEvent: function (obj) {
            var me = this;
            //bind delete button
            var imageBnt = obj.els.find('a.delete');
            if (imageBnt) {
                imageBnt.click(function (e) {
                    siteApp.confirmDialog($CODE("module.board.confirmDelete"), function(){
                        console.log(me.isLogin, me.isLogin.val());
                        if (me.isLogin.val() && me.isLogin.val() != '') {
                            me.deleteComment(obj);
                        } else {
                            BoardModule.checkPassword(obj.commentNo, function (pass) {
                                me.deleteComment(obj, pass);
                            }, '', '/site/module/board/check-comment-password.json');
                        }
                    });
                });
            }

            //bind reply comment link
            var replyBnt = obj.els.find('a.reply_comment');
            if (replyBnt) {
                replyBnt.click(function () {
                    me.extraParams = {}
                    me.currentCommentObj = obj;
                    me.extraParams = {
                        parentCommentNo: obj.commentNo,
                        parentCommentOrder: obj.commentOrder
                    };

                    if( $('#parentCommentNo_' + obj.commentNo).size()>0 ){
                        return;
                    }

                    var constWidth = 620;
                    if(me.sns_type){
                        constWidth = 540;
                    }
                    //build comment area
                    var leftPadding = obj.step*40+10;
                    var textareaWidth = constWidth - obj.step*40;
                    var writeCommentStr = '<div class="divWriteComment" style="padding-top: 4px; padding-left: '+ leftPadding + 'px;">';
                    writeCommentStr += '<textarea name="txtCommemt" style="width: ' + textareaWidth + 'px; height: 44px;" placeholder="답글을 남겨주세요" class="pt-form-control pt-form-textarea pt-form-box-sizing"></textarea>';
                    writeCommentStr += '<div class="right_float"><span class="button"><button type="button" id="parentCommentNo_' + obj.commentNo + '" name="addBComment">&nbsp;입력&nbsp;</button></span>';
                    writeCommentStr += '&nbsp;&nbsp;<span class="button"><button type="button" onclick="javascript: $(this).closest(\'div.divWriteComment\').remove();"> 취소</button></span>';
                    writeCommentStr += '</div></div>';

                    $('div.divWriteComment').remove();
                    $(writeCommentStr).insertAfter(me.currentCommentObj.els);
                    //Pinetree.page.syncContentHeight();
                });
            }
        },

        processContent: function (rs, container) {
            var step = rs['step'];
            //create comment content
            var comment = null;
            if (rs['dummyComment']) {
                comment = $.tmpl('dummyCommentTmpl', rs);
            } else {
                comment = $.tmpl('commentTmpl', rs);
            }
            if (step > 0) {
                comment = comment.addClass('reply_re');
                comment.find('.pt-board-reply-info').prepend('<i class="fa fa-reply"></i>');
                for (var i = 2; i <= step; i++) {
                    comment = comment.wrap($.tmpl('tmplReply')).parent();
                }
            }
            comment.appendTo(container);
            return comment;
        },

        applyDefaultValue: function (rs) {
            var me = this;

            rs['defaultThemePath'] = me.defaultThemePath;
            var defaultAvatarUrl = me.defaultThemePath + '/images/profile_noimage.jpg';

            //change view user name as read config
            if(me.displayUserName == "Name") {
                rs['regUserName'] = rs['regUserName'];
            } else if(me.displayUserName == "Nickname") {
                rs['regUserName'] = rs['regUserNickname'];
            } else if(me.displayUserName == "ID") {
                rs['regUserName'] = rs['regUserId'];
            } else {
                rs['regUserName'] = rs['email'];
            }

            if (rs['regUserName'] == null || rs['regUserName'] == "") {
                rs['userProfileImage'] = defaultAvatarUrl;
                rs['regUserName'] = $CODE("board.defaultUserName");
            }

            if (me.textarea.size() == 0) {
                rs['readOnly'] = true;
            } else {
                rs['readOnly'] = false;
            }

            if (rs['userProfileImage'] == null || rs['userProfileImage'] == "") {
                rs['userProfileImage'] = defaultAvatarUrl;
            }

            rs['isLogin'] = me.isLogin.val();
        },

        show: function () {
            this.textarea.focus();
        }
    });

    $.fn.boardcomment = function (o) {
        return this.each(function () {
            return new $.boardcomment(this, o);
        });
    };

});
//for upload file
$( document ).ready(function(){
    $('input#thumbnailImage').change(function () {
        $('input[name=thumbnailUploadUrl]').val($('input#thumbnailImage').val());
    });
});
$( document ).ready(function(){
    $.uploadfile = function (e, o) {

        this.els = e;
        this.tmpl = $.template('newFile', '<span class="sns_file_add_name write_file_add_name" id="${id}"><input type="hidden" name="attachFiles"/><img src="/assets/components/modules/board/basic/images/ico_file.gif" width="9" height="9" alt="' + $CODE("board.attachments") + '" /> ${name} (${size} KB) <span class="status" style="display:inline-block;"> (0%) </span> <img class="delete" src="/assets/components/modules/board/basic/images/btn_delete.gif" width="12" height="12" alt="' + $CODE("board.delete") + '" /> </span>');
        this.form = $(e);
        this.content = $(e).find("textarea[name=content]");
        this.contentSummary = $(e).find("input[name=contentSummary]");
        this.thumbnailUrl = $(e).find("input[name=thumbnailUrl]");
        this.title = $(e).find("input[name=title]");
        this.categories = $(e).find('select[name^=subjectNo]');
        this.userId = $(e).find("input[name=userId]");
        this.password = $(e).find("input[name=password]");
        this.submitBnt = $(e).find("input[type=submit]");
        this.uploadFile = $(e).find("#" + o.uploadfileId);
        this.fileContainer = $(e).find("#" + o.fileContainer);
        this.limitFileCnt = $(e).find("input[name=limitFileCnt]").val();
        this.confirmDeleteMsg = $(e).find("input[name=confirmDeleteMsg]").val();
        this.limitFileSize = $(e).find("input[name=useAttachSizeCheck]").val();
        this.uploadedFiles = $(e).find(".file_uploaded");
        this.limitFileCnt = this.limitFileCnt - this.uploadedFiles.size();
        this.noticeCheck = $(e).find("input[name=useNotice]");
        this.secretCheck = $(e).find("input[name=useSecret]");
        this.fromDate = $(e).find("input[name=fromDate]");
        this.toDate = $(e).find("input[name=toDate]");
        this.scheduleStartDate = $(e).find("input[name=scheduleStartDate]");
        this.scheduleEndDate = $(e).find("input[name=scheduleEndDate]");
        this.modCreatedDateCheck = $(e).find("input[name=modCreatedDateCheck]");
        this.modCreatedDate = $(e).find("input[name=modCreatedDate]");
        this.tag = $(e).find("input[name=tag]");
        this.capcha = $(e).find("input[name=capcha]");
        this.capchaImage = $(e).find("img[id=imgCaptcha]");
        this.refreshCapcha = $(e).find("button.refreshCapcha");
        this.captchaError = $(e).find("p.captchaError");
        this.uploadFlash = $(e).find("div.attflash");
        this.uploadInfo = $(e).find("div.attinfo");
        this.files = {};
        this.fileCnt = 0;
        if (this.limitFileSize == undefined) {
            this.limitFileSize = 0;
        } else {
            this.limitFileSize = this.limitFileSize + ' MB';
        }
        this.initForm();
        this.initSmartEditor();
        this.bindUploadedFile();
        this.totalFileCnt = this.limitFileCnt;
        this.fileErrorCnt = {};
        var submitBnt = this.submitBnt;
        this.form.submit(function() {
            //prevent from multiple times click, unbind click event
            submitBnt.attr('disabled', 'true');
        });
        this.badWordList = [];
        this.badWordMessage = "";
    };
    var $ul = $.uploadfile;
    $ul.fn = $ul.prototype = {
        version: '1.0'
    };
    $ul.fn.extend = $.extend;
    var _formData = {};
    _formData[$('#module-board-csrf').attr('name')] = $('#module-board-csrf').val();

    $ul.fn.extend({
        initUploadFile: function () {
            var me = this;
            this.uploadFile.uploadify({
                container: me,
                auto: false,
                swf: '/assets/vendors/uploadify/3.1.1/uploadify.swf',
                uploader: '/site/module/board/add-file.json',
                buttonText: $CODE("module.board.btnUpload"),
                height: 16,
                width: 80,
                removeCompleted: false,
                formData: _formData,
                uploadLimit: 0,
                fileSizeLimit: me.limitFileSize,
                onSelect: me.select,
                overrideEvents: ['onSelect', 'onSelectError'],
                onUploadSuccess: me.onUploadSuccess,
                onCancel: me.cancel,
                onQueueComplete: me.afterComplete,
                onSelectError: function(file, errorCode, errorMsg){
                    var settings = this.settings;

                    switch(errorCode) {
                        case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                            if (settings.queueSizeLimit > errorMsg) {
                                this.queueData.errorMsg = '\n최대 파일 업로드 갯수 1개를 초과할 수 없습니다.';
                            } else {
                                this.queueData.errorMsg = '\n최대 파일 업로드 갯수 1개를 초과할 수 없습니다.';
                            }
                            break;
                        case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                            this.queueData.errorMsg = '\n최대 파일 업로드 크기'  + settings.fileSizeLimit + '를 초과할 수 없습니다 .';
                            break;
                        case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                            this.queueData.errorMsg += '\nThe file "' + file.name + '" is empty.';
                            break;
                    }
                    if (errorCode != SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
                        delete this.queueData.files[file.id];
                    }
                }
            });
        },
        initSmartEditor: function() {
            var me = this;
            me.oEditors = [];
            nhn.husky.EZCreator.createInIFrame({
                oAppRef: me.oEditors,
                elPlaceHolder: 'module-board-write-content',
                sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2",
                htParams : {
                    bUseToolbar : true,
                    fOnBeforeUnload: true
                },
                fOnAppLoad : function(){
                    me.oEditors.getById["module-board-write-content"].setIR( $('#module-board-write-content').val() );
                }
            });
        },
        initForm: function () {
            var me = this;
            if(!FlashDetect.installed){
                me.uploadFlash.hide();
                me.uploadInfo.show();
            }else{
                me.uploadInfo.hide();
                me.uploadFlash.show();
            }
            me.uploadParent = this.uploadFile.parent();
            me.initUploadFile();
            this.refreshCapcha.bind('click', function(){
                me.capchaImage.attr('src', '/captcha/captcha.do?dummy=' + (new Date()).getTime());
            });
            //bind submit button

            this.form.ajaxForm({
                beforeSerialize: function($form, options) {
                    var fileList = [];
                    me.form.find('input:hidden[name=attachFiles]').each(function(index, el){
                        var fileInfo = JSON.parse($(el).val());
                        fileList.push(fileInfo);
                    });
                    if(fileList.length>0){
                        me.form.find('input:hidden[name=attaches]').val(JSON.stringify(fileList));
                    }
                },
                beforeSubmit: function(formData, jqForm, options) {

                },
                success: function(result, statusText, xhr, $form){
                    if(result.success == true){
                        window.location.href = result.returnUrl;
                    }else if(result.not_permission == true){
                        siteApp.alertMessage('권한이 없습니다.');
                    } else if(result.forbid_word && result.forbid_alert_msg){
                        siteApp.alertMessage(result.forbid_alert_msg);
                    } else if(result.forbid_word){
                        siteApp.alertMessage('내용에 금지어 ' + result.forbid_word + '가 포함되어 글쓰기를 할 수 없습니다.');
                    }else{
                        siteApp.alertMessage('Unexpected exception happened in server.');
                    }
                    $('#module_board_wrap .pt-board-footer .pt-btn.pt-btn-primary').removeAttr('disabled');
                }
            });
            this.submitBnt.bind('click', function () {
                var contentArea = me.form.find('#NamoEditor div.nce_content') ;
                if (me.title && me.title.val() == '') {
                    me.title.css({'border': '1px solid red'});
                    me.title.focus();
                    return false;
                } else {
                    me.title.css({'border': '1px solid'});
                }

                var hasCategoryError = false;
                me.categories.each(function (idx, category) {
                    if($(category).val() == '') {
                        siteApp.alertMessage('주제분류를 선택하시기 바랍니다.');
                        $(category).css({'border': '1px solid red'});
                        hasCategoryError = true;
                        return false;
                    }else{
                        $(category).css({'border': '1px solid'});
                    }
                });
                if(hasCategoryError) {
                    return false;
                }
                if (me.oEditors.getById["module-board-write-content"].getRawContents() == '<p><br></p>') {
                    contentArea.css({'border': '1px solid red'});
                    me.content.focus();
                    return false;
                }else{
                    me.content.val(me.oEditors.getById["module-board-write-content"].getRawContents());
                    me.contentSummary.val(me.content.val().replace(/<[^>]*>/g, "").substring(0, 400));
                    contentArea.css({'border': '0px solid'});
                }

                if (me.noticeCheck.is(':checked')) {
                    if (me.fromDate && me.fromDate.val() == '') {
                        me.fromDate.css({'border': '1px solid red'});
                        me.fromDate.focus();
                        return false;
                    } else {
                        me.fromDate.css({'border': '1px solid'});
                    }

                    if (me.toDate && me.toDate.val() == '') {
                        me.toDate.css({'border': '1px solid red'});
                        me.toDate.focus();
                        return false;
                    } else {
                        me.toDate.css({'border': '1px solid'});
                    }
                }
                if (me.userId.size() > 0 && me.userId.val() == '') {
                    me.userId.css({'border': '1px solid red'});
                    me.userId.focus();
                    return false;
                } else {
                    me.userId.css({'border': '1px solid'});
                }
                //check password field
                if ((me.userId.size() > 0 || me.secretCheck.is(':checked')) && me.password.val() == '') {
                    me.password.css({'border': '1px solid red'});
                    me.password.focus();
                    return false;
                } else {
                    me.password.css({'border': '1px solid'});
                }

                //upload file to server

                if (me.fileCnt > 0) {
                    me.checkFileName(function(){
                        if(me.sizeOfMap(me.fileErrorCnt) > 0) {
                            //alert("파일 업로드가 허용되지 않는 파일유형입니다.");
                        } else {
                            //check captcha
                            if(me.capcha.length > 0) {
                                if (me.capcha.val() == '') {
                                    me.capcha.css({'border': '1px solid red'});
                                    me.capcha.focus();
                                } else {
                                    me.validateCaptcha(function(){
                                        showFileUploadingMask();
                                        me.uploadFile.uploadify('upload', '*');
                                    });
                                }
                            } else {
                                showFileUploadingMask();
                                me.uploadFile.uploadify('upload', '*');
                            }
                        }
                    });
                }  else {
                    if(me.capcha.length > 0) {
                        me.validateCaptcha(function(){
                            me.form.submit();
                        });
                    } else {
                        return true;
                    }

                }
                //prevent submit the form
                return false;
            });
            // init form
            this.noticeCheck.change(function () {
                if ($(this).is(':checked')) {
                    me.fromDate.removeAttr('disabled');
                    me.toDate.removeAttr('disabled');
                } else {
                    me.fromDate.attr('disabled', 'disabled');
                    me.toDate.attr('disabled', 'disabled');
                }
            });
            this.fromDate.datepicker({
                language : 'ko',
                dateFormat: 'yy-mm-dd',
                showOn: "button",
                buttonImage: "/assets/components/modules/board/basic/images/date.gif",
                onSelect: function (selectedDate) {
                    me.toDate.datepicker("option", "minDate", selectedDate);
                }
            });
            this.toDate.datepicker({
                language : 'ko',
                dateFormat: 'yy-mm-dd',
                showOn: "button",
                buttonImage: "/assets/components/modules/board/basic/images/date.gif",
                onSelect: function (selectedDate) {
                    me.fromDate.datepicker("option", "maxDate", selectedDate);
                }
            });

            this.scheduleStartDate.datepicker({
                language : 'ko',
                dateFormat: 'yy-mm-dd',
                showOn: "button",
                buttonImage: "/assets/components/modules/board/basic/images/date.gif",
                onSelect: function (selectedDate) {
                    me.scheduleEndDate.datepicker("option", "minDate", selectedDate);
                }
            });
            this.scheduleEndDate.datepicker({
                language : 'ko',
                dateFormat: 'yy-mm-dd',
                showOn: "button",
                buttonImage: "/assets/components/modules/board/basic/images/date.gif",
                onSelect: function (selectedDate) {
                    me.scheduleStartDate.datepicker("option", "maxDate", selectedDate);
                }
            });

            this.modCreatedDate.datepicker({
                language : 'ko',
                dateFormat: 'yy-mm-dd',
                showOn: "button",
                buttonImage: "/assets/components/modules/board/basic/images/date.gif"
            });

            this.modCreatedDateCheck.change(function () {
                if ($(this).is(':checked')) {
                    me.modCreatedDate.datepicker('enable');
                } else {
                    me.modCreatedDate.datepicker('disable');
                }
            });

            this.tag.tagit({
                allowSpaces: true
            });

            me.content.val($.trim(me.content.val()));
            me.title.val($.trim(me.title.val()));
            //try {
            //    if (CrossEditor) {
            //        me.crossEditor = CrossEditor;
            //        me.crossEditor.SetValue(me.content.val());
            //    }
            //} catch (e) {
            //}

            $.ajax({
                url: '/site/module/board/getBadWordList.json',
                Type: 'GET',
                data: {
                    moduleNo: me.form.find('input[name=moduleNo]').val()
                },
                success: function (data) {
                    me.badWordList = data.data['badWordList'];
                    me.badWordMessage = data.data['badWordMessage'];
                },
                dataType: 'json'
            });
        },
        validateCaptcha: function(callback){
            var me = this;
            $.get("/site/module/board/validateCaptcha.json", {
                    captcha: me.capcha.val()
                },
                function (data) {
                    if (data && data['success'] == 'true') {
                        me.capcha.css({'border': '1px solid'});
                        me.captchaError.css("display","none");
                        if(callback) {
                            callback();
                        }
                    } else {
                        me.capcha.css({'border': '1px solid red'});
                        me.capcha.val('');
                        me.captchaError.css("display","inline");
                        me.refreshCapcha.click();
                    }
                }, 'Json');
        },
        bindUploadedFile: function () {
            var me = this;
            if (this.uploadedFiles.size() > 0) {
                $.each(this.uploadedFiles, function (i, item) {
                    var fileNo = $(item).attr('id');
                    if (fileNo != '') {
                        $(item).find('img.delete').click(function () {
                            if (confirm(me.confirmDeleteMsg)) {
                                $.get("/site/module/board/board-delete-file.json", {
                                        fileNo: fileNo
                                    },
                                    function (data) {
                                        if (data && data['success'] == 'true') {
                                            $(item).remove();
                                            me.limitFileCnt++;
                                        }
                                    }, 'Json');
                            }
                        });
                    }
                });
            }
        },
        select: function (file) {
            var me = this, container;
            if (me.settings) {
                container = me.settings.container;
            }
            if (container.limitFileCnt <= 0) {
                siteApp.alertMessage('최대 파일 업로드 갯수 '+ container.totalFileCnt +'개를 초과할 수 없습니다.');
                container.uploadFile.uploadify('cancel', file.id);
                return;
            }
            //increase file count
            if (!container.files[file.name]) {
                container.fileCnt++;
                container.limitFileCnt--;
            }

            var fileInfo = $.tmpl('newFile', {id: file.id, name: file.name, size: Math.round(file.size / 1024)});
            fileInfo.find('img.delete').click(function () {
                var item = $(this).parent();
                container.uploadFile.uploadify('cancel', item.attr('id'));
                item.remove();
            });
            container.fileContainer.append(fileInfo);
            container.files[file.name] = {
                file: file,
                status: fileInfo.find('span.status'),
                attachFile: fileInfo.find('input[name=attachFiles]')
            };

            var val = $(window).scrollTop();
            //Pinetree.page.syncContentHeight();
            $(window).scrollTop(val);

        },
        onUploadSuccess: function (file, data) {
            hideFileUploadingMask();
            var me = this, container;
            if (me.settings) {
                container = me.settings.container;
            }
            var rs = $.parseJSON(data);
            if (rs['success'] == 'true') {
                if (container.files[file.name]) {
                    container.files[file.name].status.html('(100%)');
                    container.files[file.name].attachFile.val(JSON.stringify(rs['result']));
                    delete container.files[file.name];
                    container.fileCnt--;
                }
            }

            if (container.fileCnt <= 0) {
                //submit form
                container.form.submit();
            }
        },

        checkFileName: function(callback){
            var me = this;
            var fileName = [];
            $.each( me.files, function( key, value ) {
                fileName.push(key);
            });
            $.when(
                //$.ajax({
                //    url:"/app/resourcemgr/resource/checkFileResources.html",
                //    type: 'POST',
                //    data: {
                //        fileNames: fileName.join(',')
                //    }, dataType: 'json'
                //}),
                $.ajax({
                    url: "/site/module/board/checkFileUploadBanned.json",
                    type: 'POST',
                    data: {
                        moduleNo: me.form.find('input[name=moduleNo]').val(),
                        fileNames: fileName.join(',')
                    }, dataType: 'json'
                })
            )
                .done(function(data1, data2) {
                    if (data1['success'] == true) {
                        $.each(me.files, function (key, value) {
                            if (data1[key] == false) {
                                me.fileErrorCnt[key] = true;
                                me.files[key].status.html('<span style="color: red">Error</span>');
                            }
                        });
                        if (data1['exist_forbid_file_extension'] == true) {
                            siteApp.alertMessage('첨부파일에 업로드 금지 파일형식 '+ data1['forbid_file_extension'] +' 이 포함되어 글쓰기를 할 수 없습니다.');
                        }
                    }
                    if (callback) {
                        callback();
                    }
                });
        },
        cancel: function (file) {
            var me = this, container;
            if (me.settings) {
                container = me.settings.container;
            }
            if (container.files[file.name]) {
                delete container.files[file.name];
                container.fileCnt--;
                container.limitFileCnt++;
                delete container.fileErrorCnt[file.name];
            }
        },
        sizeOfMap: function(map){
            return $.map(map, function(n, i) { return i; }).length;
        },
        checkContentBadWords: function () {
            var me = this,
                caughtList = [];
            $.each(me.badWordList, function (idx, word) {
                if(me.content.val().toLowerCase().indexOf(word.toLowerCase()) >= 0 || me.title.val().toLowerCase().indexOf(word.toLowerCase()) >= 0) {
                    caughtList.push(word);
                }
            });
            if(caughtList.length > 0) {
                siteApp.alertMessage(me.badWordMessage.replace('#badWords#', caughtList.join(', ')));
                return false;
            }
            return true;
        }
    });

    $.fn.uploadfile = function (o) {
        return this.each(function () {
            return new $.uploadfile(this, o);
        });
    };
});

$.extend(BoardModule, {
    changeOptionView: function (val, index, link) {
        /*$.get(link,{
         recordPerPage: val,
         pageIndex: index
         },
         function(data){
         $("body").html(data);
         BoardModule.bindAll();
         });*/
        document.location.href = link + '&pageIndex=' + index + '&recordPerPage=' + val;
    },
    write: function (link) {
        alert('');
        /*$.get("/site/module/board/board-view.html",{
         siteId: 'default',
         snapshotId: 1,
         pageId: 1326,
         cmd: 'write'
         },
         function(data){
         $("body").html(data);
         BoardModule.bindAll();
         });*/
        document.location.href = link;
    },

    bindPagination: function () {
        $('div.pagination a').click(function () {
            var pageIndex = $(this).attr('pageIndex');
            var recordPerPage = $(this).attr('recordPerPage');
            if (pageIndex != '' && recordPerPage != '') {
                //parse link
                $.get("/site/module/board/board-view.json", {
                        siteId: 'default',
                        snapshotId: 1,
                        pageId: 1326,
                        recordPerPage: recordPerPage,
                        pageIndex: pageIndex,
                        cmd: 'view'
                    },
                    function (data) {
                        $("body").html(data);
                        BoardModule.bindAll();
                    });
            }
            //prevent link click
            return false;
        })
    },
    bindComment: function () {
        $(".board_comment").boardcomment({defaultThemePath: '/component/module/board/skins/basic', commentView: 'commentView'});
    },
    bindUploadFile: function () {
        $("#board_write_form").uploadfile({
            uploadfileId: 'board_file_upload',
            fileContainer: 'board_file_add_name'
        });

    },
    showComment: function (id) {
        var instance = BoardModule.comments[id];
        if (instance) {
            instance.show();
        }
        return true;
    },
    bindRecommend: function () {
        var parent = $('div.blog_popular');
        $.each(parent, function (i, item) {
            var contentNo = $(item).find('input[name=contentNo]').val();
            var currUserNo = $(item).find('input[name=currUserNo]').val();
            var recView = $('.recommendView span');

            if (contentNo){
                //first checking
                var rcCookie = $.cookie('SiteEditor.board.recommendation');
                //$.cookie('SiteEditor.board.recommendation', '{}', {expires: 1000, path: '/'});
                var rcCookieValue = contentNo + "_" + currUserNo;
                if(rcCookie !== rcCookieValue){
                    //init
                    var rcObject = $(item).find('.recommendLink');
                    rcObject.click(function () {
                        siteApp.alertMessage($CODE('module.board.recommendAlert'));
                        $.get("/site/module/board/board-recommend.json", {
                                contentNo: contentNo
                            },
                            function (data) {
                                if (data['success'] == 'true') {
                                    //update recommend view
                                    recView.html(data['result']);
                                    //save to cookie
                                    $.cookie('SiteEditor.board.recommendation', rcCookieValue, {expires: 1000, path: '/'});
                                    rcObject.unbind('click');
                                }
                            }, 'Json');
                    });
                }
            }
        });

    },
    checkPassword: function (contentNo, link, returnURL, urlCheck) {
        var url = '/site/module/board/check-password.json';
        if (arguments.length == 4) {
            url = urlCheck;
        }
        var ajaxCheck = function () {
            var val = $('div#checkpass').find('input[name=password]').val();
            if (val != '') {
                $('span.password-error-msg').addClass('hide');
                $.get(url, {
                        password: val,
                        contentNo: contentNo
                    },
                    function (data) {
                        if (data['success'] == 'true') {
                            //redirect to link
                            if (typeof link == 'function') {
                                link(val);
                                $("div#checkpass").dialog("destroy");
                            } else {
                                read_url = link.replace(/&amp;/g, '&') + "&password=" + val + "&returnURL=";
                                if(returnURL != null){
                                    read_url += encodeURIComponent(returnURL);
                                }
                                document.location.href = read_url;

                            }
                        } else {
                            siteApp.alertMessage(data['message']);
                        }
                    }, 'json');
            } else {
                $('span.password-error-msg').removeClass('hide');
            }
        };
        var dialog = $('div#checkpass').dialog({
            height: 180,
            width: 300,
            zIndex: 10005,
            modal: false,
            buttons: [
                {text: '취소', class: 'pt-btn pt-btn-small pt-btn-sub', click: function () {
                    $(this).dialog("destroy");
                }},
                {text: '확인', class: 'pt-btn pt-btn-small pt-btn-primary', click: ajaxCheck}
            ],
            close: function () {
                $(this).dialog("destroy");
            }
        });
        dialog.find('input[name=password]').val('');
        dialog.find('input[name=password]').unbind();
        dialog.find('input[name=password]').keydown(function (e) {
            /*if (e.which == 13 && $(this).val() != "") {
                ajaxCheck();
            }*/
            setTimeout(function(){
                var val = $('div#checkpass').find('input[name=password]').val();
                if (val != '') {
                    $('span.password-error-msg').addClass('hide');
                } else {
                    $('span.password-error-msg').removeClass('hide');
                }
            }, 1);
        });

    },
    bindAll: function () {
        BoardModule.bindComment();
        BoardModule.bindRecommend();
        BoardModule.bindUploadFile();
        //BoardModule.bindPagination();
    }
});

//bind comment event
$(document).ready(function () {
    BoardModule.bindAll();
    $("input[name='albumThumbnailType']").change(function (){
        if($('#useEditorThumbnail').is(':checked')){
            $('#thumbnailImage').attr('disabled', true);
            $('#thumnailUrl').attr('disabled', true);
        } else {
            $('#thumnailUrl').removeAttr('disabled');
            $('#thumbnailImage').removeAttr('disabled');
        }
    })
});


var progress = function progress() {
    var progressbar = $( "#progressbar" );
    var val = progressbar.progressbar( "value" ) || 0;

    if(val==100){
        return;
    }
    if(val>98){
        val = 0;
    }
    progressbar.progressbar( "value", val + 1 );

    if( val < 100 ){
        setTimeout( progress, 20);
    }
}

var showFileUploadingMask = function(text) {
    if($('#___loading_dialog').length ==0 ) {
        var $wrapper = $('<div id="___loading_dialog"><p><div class="loading-image"></div><div class="message" style="margin-top: 20px;"><div id="progressbar"></div></div></p></div>');

        $wrapper.appendTo('body');

        $( "#progressbar" ).progressbar({
            value: 0
        });

        $wrapper.dialog({
            title: 'Uploading...',
            draggable:false,
            resizable:false,
            dialogClass: "file-upload",
            modal: true,
            width: 320,
            minHeight: 100
        });

        setTimeout( progress, 50);
    }
}

var hideFileUploadingMask = function() {
    if($('#___loading_dialog').length > 0 ) {
        $( "#progressbar" ).progressbar("value", 100);
        setTimeout( function(){
            $('#___loading_dialog').dialog("close").remove();
        }, 500);

    }
}




