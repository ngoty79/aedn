$(document).ready(function () {
    var reviewPageSize = 10, faqPageSize = 10;
    var currentReviews = [], currentFaqs = [];
    var tabmapkeys = ["#tabDetail","#tabDelivery","#tabReview","#tabQna"];
    var tabmap = {
        "#tabDetail": {
            on: _skinPath+'/images/common/view_tab_detail_on.gif',
            off: _skinPath+'/images/common/view_tab_detail.gif'
        },

        "#tabDelivery": {
            on: _skinPath+'/images/common/view_tab_guide_on.gif',
            off: _skinPath+'/images/common/view_tab_guide.gif'
        },

        "#tabReview": {
            on: _skinPath+'/images/common/view_tab_review_on.gif',
            off: _skinPath+'/images/common/view_tab_review.gif'
        },

        "#tabQna": {
            on: _skinPath+'/images/common/view_tab_qna_on.gif',
            off: _skinPath+'/images/common/view_tab_qna.gif'
        }
    };

    if (!Date.prototype.toISOString) {
        Date.prototype.toISOString = function() {
            function pad(n) { return n < 10 ? '0' + n : n }
            return this.getUTCFullYear() + '-'
                + pad(this.getUTCMonth() + 1) + '-'
                + pad(this.getUTCDate()) + ' '
                + pad(this.getUTCHours()) + ':'
                + pad(this.getUTCMinutes()) + ':'
                + pad(this.getUTCSeconds());
        };
    }


    $(function() {
        var $btnBuyNow = $("#buyNow");
        /*
         * product preview dialog
         */
        var $previewDialog = $("#preview-dialog-modal"),
            $previewForm = $previewDialog.find('#form-shop-preview'),
            $btnAddPreview = $previewDialog.find('#btn-add-preview');
        var validator = $previewForm.validate({
            errorClass: 'validation-error',
            errorElement: 'p',
            rules: {
                star: {required: true},
                title: {required: true},
                content: {required: true}
            },
            messages: {
                star: {required: '평점을 선택하여 주세요.'},
                title: {required: '제목을 입력하여 주세요.'},
                content: {required: '내용을 입력하여 주세요.'}
            },
            errorPlacement: function (error, element) {
                if(element.attr("type") == "radio") {
                    error.insertAfter(element.siblings(":last"));
                } else {
                    error.insertAfter(element);
                }
            }
        });



        $previewForm.ajaxForm({
            beforeSerialize: function($form, options) {
                $btnAddPreview.prop('disabled', true);
            },
            beforeSubmit: function(formData, jqForm, options) {
                var img = $previewForm.find('input[name=image_upload]')[0].files;
                if(img.length > 0){
                    var filename = img[0].name;
                    if(!filename.match(/\.(jpg|jpeg|png|gif|bmp)$/)){
                        $btnAddPreview.prop('disabled', false);
                        $('#preview-image-upload-error').removeClass('hide');
                        return false;
                    }
                }
                $('#preview-image-upload-error').addClass('hide');
                return true;
            },
            success: function(result, statusText, xhr, $form){
                if(result.success == true){
                    var url = '?scene=detail&productNo=' + _product.productNo + "&tabno=3";
                    window.location.href = url;
                }else{
                    siteApp.alertMessage('권한이 없습니다.');
                }

            }
        });

        $('input[name=image_upload]').change(function(){
            $('#preview-image-upload-error').addClass('hide');
            var img = $previewForm.find('input[name=image_upload]')[0].files;
            if(img.length > 0){
                var filename = img[0].name;
                if(!filename.match(/\.(jpg|jpeg|png|gif|bmp)$/)){
                    $btnAddPreview.prop('disabled', false);
                    $('#preview-image-upload-error').removeClass('hide');
                }
            }
        });

        $('#write-preview').click(function() {
            $('#preview-dialog-modal #postingNo').val('0');
            $('#preview-dialog-modal #title').val('');
            $('#preview-dialog-modal #preview-content').val('');
            $("#preview-dialog-modal input:radio").attr("checked", false);
            $('#preview-dialog-modal input[type="file"]').val("");
            $('#image-upload-holder').hide();

            $("#preview-dialog-modal").css("top", ($(document).scrollTop()) + "px");
            $("#preview-dialog-modal").show();
        });
        $("#preview-dialog-modal a.closeBtn, #close-preview-dialog").click(function() {
            validator.resetForm();
            $("#preview-dialog-modal").hide();
        });

        /*
         * product Q&A dialog
         */
        var $faqDialog = $("#faq-dialog-modal"),
            $formAddFaq = $faqDialog.find('#form-shop-faq'),
            $btnAddFaq = $faqDialog.find('#btn-add-faq');
        $formAddFaq.validate({
            errorClass: 'validation-error',
            errorElement: 'p',
            rules: {
                writer: {required: true},
                email1: {required: true},
                email2: {required: true},
                phone1: {required: true, number: true},
                phone2: {required: true, number: true},
                phone3: {required: true, number: true},
                subject: {required: true},
                content: {required: true},
                password: {required: {
                    depends: function(element) { return $("#secretCk").is(":checked"); }
                }}
            },
            groups: {
                email: "email1 email2",
                phoneNo: "phone1 phone2 phone3"
            },
            messages: {
                writer: {required: '작성자를 입력하세요.'},
                email1: {required: '이메일을 입력하세요.'},
                email2: {required: '이메일을 입력하세요.'},
                phone1: {required: '전화번호를 입력하세요.', number: '숫자를 입력하세요.'},
                phone2: {required: '전화번호를 입력하세요.', number: '숫자를 입력하세요.'},
                phone3: {required: '전화번호를 입력하세요.', number: '숫자를 입력하세요.'},
                subject: {required: '제목을 입력하세요.'},
                content: {required: '내용을 입력하세요.'},
                password: {required: '비밀번호를 입력하세요.'}
            },
            errorPlacement: function (error, element) {
                if(element.attr("name") == "email1" || element.attr("name") == "email2") {
                    error.insertAfter("#email2");
                } else if(element.attr("name") == "phone1" || element.attr("name") == "phone2" || element.attr("name") == "phone3") {
                    error.insertAfter("#phone3");
                } else {
                    error.insertAfter(element);
                }
            }
        });

        $formAddFaq.ajaxForm({
            beforeSerialize: function($form, options) {
                $btnAddFaq.prop('disabled', true);
            },
            beforeSubmit: function(formData, jqForm, options) {

            },
            success: function(result, statusText, xhr, $form){
                if(result.success == true){
                    window.location.href = '?scene=detail&productNo=' + _product.productNo + "&tabno=4";
                }else{
                    siteApp.alertMessage('권한이 없습니다.');
                }

            }
        });

        $('#write-faq').click(function() {
            $("#faq-dialog-modal form").get(0).reset();
            $("#faq-dialog-modal").css("top", ($(document).scrollTop()) + "px");
            $("#faq-dialog-modal").show();
        });
        $("#faq-dialog-modal a.closeBtn, #close-faq-dialog").click(function() {
            $("#faq-dialog-modal").hide();
        });

        /*
         * password dialog
         */
        var passwordDialogHtml = $("#password-dialog-modal").html();
        var passwordDialog = $('<div id="password-dialog-modal" style="display:none;left:50%;margin-left:-115px;position:absolute;z-index:10002;background-color:#fff;"></div>').append(passwordDialogHtml);
        $("#password-dialog-modal").remove();
        $(document.body).append(passwordDialog);
        $("#password-dialog-modal a.closeBtn, #close-password-dialog").click(function() {
            $("#password-dialog-modal").hide();
        });

        $('#selDeliveryType').change(function(){
            updateTotalPayment($("#productQuantity").val());
        });

        $('#productOption').change(function(){
            $(".info_option").css("border-bottom","1px solid #e5e5e5");

            if(_product.optionType == '1') {
                $("div[id^='option']").each(function () {
                    $(this).addClass('hide');
                });
            }

            var optionNo = $(this).val();
            if(optionNo != ''){
                $('#option' + optionNo).removeClass('hide');
                updateTotalPayment($("#productQuantity").val());
            }

            $('.info_totalPayment').removeClass('hide');
        });

        /*
         * product quantity process
         */
        //$("#productQuantity").val($product.minBuyCount);
        $("#productQuantity").change(function() {
            var quantity = parseInt(this.value);
            if (isNaN(quantity) || quantity <= 0) {
                if (_product.minBuyCount == 0) {
                    $(this).val('1');
                } else {
                    $(this).val(_product.minBuyCount);
                }
            } else {
                if (quantity > _product.maxBuyCount && _product.maxBuyCount != 0) {
                    $(this).val(_product.maxBuyCount);
                }
                if (quantity < _product.minBuyCount && _product.minBuyCount != 0) {
                    $(this).val(_product.minBuyCount);
                }
            }
            return false;
        });
        $("#increase-quantity").click(function() {
            var quantity = parseInt($("#productQuantity").val());
            if(_product.maxBuyCount > 0 && quantity >= _product.maxBuyCount) return;
            $("#productQuantity").val(quantity + 1);
            $("#productQuantity").trigger('change');
            updateTotalPayment(quantity+1);
        });
        $("#decrease-quantity").click(function() {
            var quantity = parseInt($("#productQuantity").val());
            if(quantity <= _product.minBuyCount) return;
            $("#productQuantity").val(quantity - 1);
            $("#productQuantity").trigger('change');
            updateTotalPayment(quantity-1);
        });

        /*
         * product info tab panel
         */
        $('#tabPanel > div > ul li a').click(function() {
            var _tab = $(this);
            var _tabkey = _tab.attr('tabmapkey');
            //console.log('tabkey:',_tabkey);

            $('.product-info').hide();
            $('#tabPanel > div > ul li a').each(function() {
                $(this).find('img').attr('src', tabmap[$(this).attr('tabmapkey')].off);
            });

            $(_tabkey).show();
            _tab.find('img').attr('src', tabmap[_tabkey].on);

            $('#tabPanel li').removeClass('on');
            _tab.parent().addClass('on');
            //link all tab to #tabpanel.
            _tab.attr("href", "#tabPanel");

            //hide opened review when tab is clicked.
            $('#tabReview tr.line-detail').each(function() {
                var $me = $(this);
                if($me.is(':visible'))
                    $me.hide();
            });
            //hide opened qna when tab is clicked.
            $('#tabQna tr.line-detail').each(function() {
                var $me = $(this);
                if($me.is(':visible'))
                    $me.hide();
            });
        });
        //return to the original tab
        if(_tabno != '') {
            $('#tabPanel a[tabmapkey="' + tabmapkeys[_tabno-1] + '"]').click();
        }

        loadReviewPostings(1);
        loadFaqPostings(1);
        var $formProductDetail = $('#form-shop-detail');
        /*
         * product buynow
         */
        $btnBuyNow.click(function(e){
            //$btnBuyNow.prop("disabled", true);
            e.preventDefault();
            var productQuantity = 0;
            try{
                productQuantity = parseInt( $('#productQuantity').val() );
            }
            catch(err){
                productQuantity = 0;
            }

            if (productQuantity < 1) {
                siteApp.alertMessage('구매수량을 선택하여 주세요.');
                return false;
            }

            //if product has option , must choose option
            if ($("#productOption").length >0) {
                var listOption = [];
                var hasOption = false;
                $("div[id^='option']").each(function () {
                    if ($(this).is(":visible")) {
                        hasOption = true;
                        var option = {};
                        option.optionNo = $(this).find(".optionNo").text();
                        var quantity = $(this).find(".sp-input").text();
                        option.optionCount = quantity;
                        listOption.push(option);
                    }
                });
                var productOption = JSON.stringify(listOption);
                $("#hiddenOption").val(productOption);
                if (!hasOption) {
                    siteApp.alertMessage('옵션을 선택하여 주세요.');
                    return false;
                }
            }

            //set delivery type because selDeliveryType is disable on the detail page.
            $("#deliveryType").val($("#selDeliveryType").val());

            $.ajax({
                url: '/site/module/shop/buyProductNow.json',
                type: 'POST',
                data: $formProductDetail.serialize(),
                success: function(data) {
                    if (data.success == true) {
                        if(data.userNo != null && data.userNo != ''){
                            window.location.href = "?scene=checkout&buynow=true";
                        }else{
                            window.location.href = "?scene=checkout&buynow=true";
                        }

                    } else {
                        siteApp.alertMessage(siteApp.getMessage('module.shop.detail.msg.add_to_cart.error'));
                    }
                },
                dataType: 'json'
            });

        });

        /*
         * product add to cart
         */
        $('#addToCart').click(function() {
            if($('#addToCart').attr("disabled") == "disabled"){
                debugger;
                return;
            }
            var cartProductNo;
            if($(".cartProductNo").length > 0){
                cartProductNo = $(".cartProductNo").val();
            }
            var productQuantity = 0;
            try{
                productQuantity = parseInt( $('#productQuantity').val() );
            }
            catch(err){
                productQuantity = 0;
            }

            if (productQuantity < 1) {
                siteApp.alertMessage('구매수량을 선택하여 주세요.');
                return false;
            }
            //if product has option , must choose option
            var listOption = [];
            if ($("#productOption").length > 0) {
                var hasOption = false;
                $("div[id^='option']").each(function () {
                    if ($(this).is(":visible")) {
                        var option = {};
                        option.optionNo = $(this).find(".optionNo").text();
                        var quantity = $(this).find(".sp-input").text();
                        option.optionCount = quantity;
                        listOption.push(option);
                        hasOption = true;

                    }
                });
                if (!hasOption) {
                    siteApp.alertMessage('옵션을 선택하여 주세요.');
                    return;
                }
            }

            var deliveryType = $("#selDeliveryType").val();
            $('#addToCart').attr("disabled", "disabled");
            $.ajax({
                url: '/site/module/shop/addToCart.json',
                type: 'POST',
                data: { productNo: _product.productNo, listOption : JSON.stringify(listOption), quantity: productQuantity,deliveryType : deliveryType,cartProductNo : cartProductNo },
                success: function(data) {
                    console.log(data);
                    $('#addToCart').removeAttr("disabled");
                    if (data.success == true) {
                        siteApp.confirmDialog('상품이 장바구니에 담겼습니다. 바로 확인하시겠습니까?', function(){
                            window.location = '?scene=mypage';
                            return;
                        });
                    } else {
                        siteApp.alertMessage('서버 에러가 발생했습니다.');
                        return;
                    }
                },
                dataType: 'json'
            });

        });

        /*
         * product preview process
         */
        $(document).on('click', '#tabReview a.preview-title', function() {
            var lineDetail = $(this).parent().parent().parent().next();
            var ishidden = lineDetail.is(':hidden');

            $('#tabReview tr.line-detail').hide();
//            $(this).parent().parent().parent().next().show();

            if(ishidden) {
                lineDetail.show();
            }


        });
        $(document).on('click', 'a.modify-review', function() {
            var postingNo = parseInt($(this).attr('rel'));
            $.ajax({
                url: '/site/module/shop/getProductPost.json',
                type: 'POST',
                data: {
                    postingNo: postingNo
                },
                dataType: 'json',
                success: function(posting) {
                    $('#preview-dialog-modal #postingNo').val(posting.postingNo);
                    $('#preview-dialog-modal #title').val(posting.title);
                    $('#preview-dialog-modal #preview-content').val(posting.content);
                    if (posting.addFile && posting.addFile != '') {
                        $('#image-upload-holder').attr('src', '/common/loadFile?relativePath=' + posting.addFile);
                        $('#image-upload-holder').show();
                    } else {
                        $('#image-upload-holder').hide();
                    }
                    $("input[name=star][value=" + posting.markScore + "]").prop('checked', true);
                    $previewDialog.css("top", ($(document).scrollTop()) + "px");
                    $previewDialog.show();
                }
            });


        });
        $(document).on('click', 'a.delete-review', function() {
            var thiz = this;
            var postingNo = $(this).attr('rel')
            siteApp.confirmDialog('등록한 사용후기가 삭제됩니다. 삭제하시겠습니까?', function(){
                $.ajax({
                    url: '/site/module/shop/deleteProductPosting.json',
                    type: 'POST',
                    data: { postingNo: postingNo },
                    success: function(data) {
                        if (data.success == true) {
                            $('#line-review-' + $(thiz).attr('rel')).next().remove();
                            $('#line-review-' + $(thiz).attr('rel')).remove();
                            var totalReviews = parseInt($('#totalReviews').text());
                            if (!isNaN(totalReviews)) {
                                $('#totalReviews').text(totalReviews - 1);
                            }
                        }
                    },
                    dataType: 'json'
                });
            });
        });

        $(document).on('click', '#reviewPageNavi a', function() {
            if ($(this).attr('rel') == "") return;

            loadReviewPostings(parseInt($(this).attr('rel')));
        });

        /*
         * product Q&A process
         */
        $(document).on('click', '#tabQna a.faq-title', function() {
            var lineDetail = $(this).parent().parent().parent().next();
            var ishidden = lineDetail.is(':hidden');

            $('#tabQna tr.line-detail').hide();

            if (lineDetail.attr('rel') == "secret") {
                var postingNo = $(this).attr('rel');
                $('#secret-posting-no').val(postingNo);
                $('#secret-password').val('');
                $("#password-dialog-modal").css("top", ($('#tabPanel').offset().top) + "px");
                $("#password-dialog-modal").show();
            } else {
                if(ishidden) {
                    lineDetail.show();
                }

            }
        });
        $(document).on('click', 'a.delete-faq', function() {
            var thiz = this;
            var postingNo = $(this).attr('rel')
            siteApp.confirmDialog('등록한 상품문의가 삭제됩니다. 삭제하시겠습니까?', function(){
                $.ajax({
                    url: '/site/module/shop/deleteProductPosting.json',
                    type: 'POST',
                    data: { postingNo: postingNo },
                    success: function(data) {
                        if (data.success == true) {
                            $('#line-faq-' + $(thiz).attr('rel')).next().remove();
                            $('#line-faq-' + $(thiz).attr('rel')).remove();
                            var totalFaqs = parseInt($('#totalFaqs').text());
                            if (!isNaN(totalFaqs)) {
                                $('#totalFaqs').text(totalFaqs - 1);
                            }
                        }
                    },
                    dataType: 'json'
                });
            });
        });

        $(document).on('click', 'a.modify-faq', function() {
            var thiz = this;
            $.ajax({
                url: '/site/module/shop/getProductPosting.json',
                type: 'POST',
                data: {postingNo: $(this).attr('rel') },
                success: function(data) {
                    if (data.success == true) {
                        var posting = data.data;
                        if (posting) {
                            $('#faq-dialog-modal #postingNo').val(posting.postingNo);
                            $('#faq-dialog-modal #subject').val(posting.title);
                            $('#faq-dialog-modal #faq-content').val(posting.content);
                            $('#faq-dialog-modal #writer').val(posting.writerName);
                            var emails = posting.writerEmail.split('@');
                            $('#faq-dialog-modal #email1').val(emails[0]);
                            $('#faq-dialog-modal #email2').val(emails[1]);
                            var phones = posting.writerPhoneNo.split('-');
                            $('#faq-dialog-modal #phone1').val(phones[0]);
                            $('#faq-dialog-modal #phone2').val(phones[1]);
                            $('#faq-dialog-modal #phone3').val(phones[2]);
                            if (posting.secretYn == 1) {
                                $('#secretCk').attr('checked', 'checked');
                                $('#faq-dialog-modal #password').val(posting.secretPassword);
                            } else {
                                $('#secretCk').removeAttr('checked');
                            }
                            $("#faq-dialog-modal").css("top", ($(document).scrollTop()) + "px");
                            $("#faq-dialog-modal").show();
                        }
                    } else {
                        siteApp.alertMessage('접근권한이 없습니다.');
                    }
                },
                dataType: 'json'
            });
        });
        $(document).on('click', '#faqPageNavi a', function() {
            if ($(this).attr('rel') == "") return;

            loadFaqPostings(parseInt($(this).attr('rel')));
        });

        /*
         * check password
         */
        var btnCheckPassword = $('#check-password');
        btnCheckPassword.click(function(event) {
            event.preventDefault();
            var postingNo = $('#secret-posting-no').val(),
                secretPassword = $('#secret-password').val();
            if(secretPassword == ''){
                $('#password-dialog-modal-password-error').show();
                return;
            }else{
                $('#password-dialog-modal-password-error').hide();
            }

            $.ajax({
                url: '/site/module/shop/checkSecretPassword.json',
                type: 'POST',
                data: {postingNo: postingNo, password: secretPassword },
                success: function(data) {
                    $('#password-dialog-modal').hide();
                    if (data.success == true) {
                        var lineDetail = $('#line-faq-' + postingNo).next();
                        var modDate = new Date(data.data.modDate);
                        var answerContent = data.data.answerContent;
                        if (answerContent && answerContent != '') {
                            answerContent = answerContent.replace('\r\n', '<br />');
                        }
                        var isCompleted = false;
                        if (answerContent && answerContent != '') {
                            isCompleted = true;
                        }
                        var isOwner = _userNo == data.data.regUserNo;
                        var html = [];
                        html.push('<td colspan="5" class="boardCon">');
                        html.push('<div class="con_wrap">');
                        html.push('<div class="btn_area">');
                        if (isOwner == true) {
                            html.push('<a class="btnType1 modify-faq" rel="' + data.data.postingNo + '"><span>수정</span></a><a class="btnType1 delete-faq" rel="' + data.data.postingNo + '"><span>삭제</span></a>');
                        }
                        html.push('</div>');
                        html.push('<dl class="qna">');
                        html.push('<dt><strong class="t">[질문]</strong><span class="c">' + data.data.content.replace(/(\r\n|\n\r|\r|\n)/g,"<br>") + '</span></dt>');
                        if (isCompleted == true) {
                            html.push('<dd><strong class="t">[답변]</strong>');
                            html.push('<span class="c">' + answerContent + '<em class="date">' + modDate.toISOString() + '</em></span>');
                            html.push('</dd>');
                        }
                        html.push('</dl>');
                        html.push('</div>');
                        html.push('</td>');
                        lineDetail.html(html.join(''));
                        lineDetail.attr('rel', 'public');
                        lineDetail.show();
                    } else {
                        siteApp.alertMessage('비밀번호가 일치하지 않습니다.');
                    }
                },
                dataType: 'json'
            });
            return false;
        });

        function loadReviewPostings(pageIndex) {
            $.ajax({
                url: '/site/module/shop/getReviewPostings.json',
                type: 'POST',
                data: {productNo: _product.productNo, page: pageIndex, size: reviewPageSize },
                success: function(data) {
                    currentReviews = data.data;
                    var html = [];
                    if(data.data != null) {
                        for (var i = 0; i < data.data.length; i++) {
                            var haveImage = data.data[i].addFile && data.data[i].addFile != '' ? '<img src="'+_skinPath+'/images/common/icon_imgfile.gif" alt="이미지있음" />' : '';
                            var postDate = new Date(data.data[i].regDate);
                            var postDateString = postDate.getFullYear();
                            postDateString += '-' + ((postDate.getMonth() + 1) < 10 ? '0' + (postDate.getMonth() + 1) : (postDate.getMonth() + 1));
                            postDateString += '-' + (postDate.getDate() < 10 ? '0' + postDate.getDate() : postDate.getDate());
                            var isOwner = _userNo == data.data[i].regUserNo;
                            html.push('<tr id="line-review-' + data.data[i].postingNo + '" class="line">');
                            //html.push('<td>' + data.data[i].postingNo + '</td>');
                            html.push('<td>' + (data.totalCount-(pageIndex-1)*reviewPageSize-i) + '</td>');
                            html.push('<td><div class="title"><a class="preview-title">' + data.data[i].title + '</a>' + haveImage + '</div></td>');
                            html.push('<td>' + data.data[i].userName + '</td>');
                            html.push('<td>' + postDateString + '</td>');
                            html.push('<td><img src="'+_skinPath+'/images/common/star' + data.data[i].markScore + '.gif" alt="' + data.data[i].markScore + '점" /></td>');
                            html.push('</tr>');
                            html.push('<tr style="display: none" class="line-detail">');
                            html.push('<td colspan="5" class="boardCon">');
                            html.push('<div class="con_wrap">');
                            html.push('<div class="btn_area">');
                            if (isOwner == true) {
                                html.push('<a class="btnType1 modify-review" rel="' + data.data[i].postingNo + '"><span>수정</span></a><a class="btnType1 delete-review" rel="' + data.data[i].postingNo + '"><span>삭제</span></a>');
                            }
                            html.push('</div>');
                            if(data.data[i].addFile && data.data[i].addFile != '') {
                                html.push('<p style="width: 35%"><img src="' + '/common/loadFile?relativePath=' + data.data[i].addFile + '" alt="" width="100%" /></p>');
                            }
                            var content = data.data[i].content;
                            if (content && content != '') {
                                content = content.replace(/\r\n/gi, '<br />');
                            }
                            if (content && content != '') {
                                content = content.replace(/\n/gi, '<br />');
                            }
                            html.push('<div>' + content + '</div>');
                            html.push('</div>');
                            html.push('</td>');
                            html.push('</tr>');
                        }
                    }

                    $('#tabReview tbody').html(html.join(''));
                    $('#totalReviews').html(data.totalCount);

                    paginatePostings('#reviewPageNavi', pageIndex, reviewPageSize, data.totalCount);


                },
                dataType: 'json'
            });
        }


        function loadFaqPostings(pageIndex) {
            $.ajax({
                url: '/site/module/shop/getFaqPostings.json',
                type: 'POST',
                data: { productNo: _product.productNo, page: pageIndex, size: reviewPageSize },
                success: function(data) {
                    currentFaqs = data.data;
                    var html = [];
                    if(data.data != null) {
                        for (var i = 0; i < data.data.length; i++) {
                            var isSecret = data.data[i].secretYn && data.data[i].secretYn == 1 ? '<img src="'+_skinPath+'/images/common/icon_secret.gif" alt="비밀글" />' : '';
                            var modDate = new Date(data.data[i].modDate);
                            var modDateString = modDate.getFullYear();
                            modDateString += '-' + ((modDate.getMonth() + 1) < 10 ? '0' + (modDate.getMonth() + 1) : (modDate.getMonth() + 1));
                            modDateString += '-' + (modDate.getDate() < 10 ? '0' + modDate.getDate() : modDate.getDate());
                            modDateString += " ";
                            modDateString += (modDate.getHours() < 10 ? '0' + modDate.getHours() : modDate.getHours());
                            modDateString += ":";
                            modDateString += (modDate.getMinutes() < 10 ? '0' + modDate.getMinutes() : modDate.getMinutes());
                            var postDate = new Date(data.data[i].regDate);
                            var postDateString = postDate.getFullYear();
                            postDateString += '-' + ((postDate.getMonth() + 1) < 10 ? '0' + (postDate.getMonth() + 1) : (postDate.getMonth() + 1));
                            postDateString += '-' + (postDate.getDate() < 10 ? '0' + postDate.getDate() : postDate.getDate());
                            var answerContent = data.data[i].answerContent;
                            var content =  data.data[i].content;
                            if (answerContent && answerContent != '') {
                                answerContent = answerContent.replace(/\r\n/gi, '<br />');
                            }
                            if (answerContent && answerContent != '') {
                                answerContent = answerContent.replace(/\n/gi, '<br />');
                            }
                            if (content && content != '') {
                                content = content.replace(/\r\n/gi, '<br />');
                            }
                            if (content && content != '') {
                                content = content.replace(/\n/gi, '<br />');
                            }

                            var isCompleted = false;
                            if (answerContent && answerContent != '') {
                                isCompleted = true;
                            }
                            var isOwner = _userNo == data.data[i].regUserNo;
                            html.push('<tr id="line-faq-' + data.data[i].postingNo + '" class="line">');
                            //html.push('<td>' + data.data[i].postingNo + '</td>');
                            html.push('<td>' + (data.totalCount-(pageIndex-1)*reviewPageSize-i) + '</td>');
                            //html.push('<td><div class="title"><a class="faq-title" href="#tabQna" rel="' + data.data[i].postingNo + '">' + data.data[i].title + '</a>' + isSecret + '</div></td>');
                            html.push('<td><div class="title"><a class="faq-title" rel="' + data.data[i].postingNo + '">' + data.data[i].title + '</a>' + isSecret + '</div></td>');
                            html.push('<td>' + data.data[i].userName + '</td>');
                            html.push('<td>' + postDateString + '</td>');
                            if (isCompleted == true) {
                                html.push('<td><span class="a_complete">답변완료</span></td>');
                            } else {
                                html.push('<td><span class="a_ready">답변대기</span></td>');
                            }
                            html.push('</tr>');
                            if (data.data[i].secretYn == 0) {
                                html.push('<tr style="display: none" class="line-detail" rel="public">');
                                html.push('<td colspan="5" class="boardCon">');
                                html.push('<div class="con_wrap">');
                                html.push('<div class="btn_area">');
                                if (isOwner == true) {
                                    html.push('<a class="btnType1 modify-faq" rel="' + data.data[i].postingNo + '"><span>수정</span></a><a class="btnType1 delete-faq" rel="' + data.data[i].postingNo + '"><span>삭제</span></a>');
                                }
                                html.push('</div>');
                                html.push('<dl class="qna">');
                                html.push('<dt><strong class="t">[질문]</strong><span class="c">' + content + '</span></dt>');
                                if (isCompleted == true) {
                                    html.push('<dd><strong class="t">[답변]</strong>');
                                    html.push('<span class="c">' + answerContent + '<em class="date">' + modDateString + '</em></span>');
                                    html.push('</dd>');
                                }
                                html.push('</dl>');
                                html.push('</div>');
                                html.push('</td>');
                                html.push('</tr>');
                            } else {
                                html.push('<tr style="display: none" class="line-detail" rel="secret"></tr>');
                            }
                        }
                    }

                    $('#tabQna tbody').html(html.join(''));
                    $('#totalFaqs').html(data.totalCount);

                    paginatePostings('#faqPageNavi', pageIndex, faqPageSize, data.totalCount);

                },
                dataType: 'json'
            });
        }

        function paginatePostings(selector, page, limit, totalItems) {
            var html = [];
            page = parseInt(page, 10);
            if (totalItems > limit) {
                var totalPages = Math.floor(totalItems / limit) + (totalItems % limit > 0 ? 1 : 0);
                var startIndex = 0;
                var endIndex = totalPages;
                if (totalPages > 10) {
                    startIndex = page - 5;
                    endIndex = page + 5;
                    if (startIndex < 0) {
                        startIndex = 0;
                        endIndex = startIndex + 10;
                    }
                    if (endIndex > totalPages) {
                        endIndex = totalPages;
                        startIndex = totalPages - 10;
                    }
                }
                html.push('<a class="btn" rel="1"><img src="'+_skinPath+'/images/common/pagenavi_arrow_prev2.gif" alt="1" /></a>');
                if (page == 1) {
                    html.push('<a class="btn" rel="1"><img src="'+_skinPath+'/images/common/pagenavi_arrow_prev1.gif" alt="1" /></a>');
                } else {
                    html.push('<a class="btn" rel="' + (page - 1) + '"><img src="'+_skinPath+'/images/common/pagenavi_arrow_prev1.gif" alt="' + (page + 1) + '" /></a>');
                }

                for (var j=startIndex; j<endIndex; j++) {
                    var k = j+1;
                    if (page == k) {
                        html.push('<strong>' + k + '</strong>');
                    } else {
                        html.push('<a rel="' + k + '">' + k + '</a>');
                    }
                }

                if (page == totalPages) {
                    html.push('<a class="btn" rel="' + totalPages + '"><img src="'+_skinPath+'/images/common/pagenavi_arrow_next1.gif" alt="' + totalPages + '" /></a>');
                } else {
                    html.push('<a class="btn" rel="' + (page + 1) + '"><img src="'+_skinPath+'/images/common/pagenavi_arrow_next1.gif" alt="' + (page + 1) + '" /></a>');
                }
                html.push('<a class="btn" rel="' + totalPages + '"><img src="'+_skinPath+'/images/common/pagenavi_arrow_next2.gif" alt="' + totalPages + '" /></a>');
            }
            $(selector).html(html.join(''));
        }
    });
    updateTotalPayment($("#productQuantity").val());

});