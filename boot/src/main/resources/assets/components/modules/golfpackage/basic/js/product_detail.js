$( document ).ready(function() {

    var ProductController = function (selector) {
        this.init(selector);
    };

    $.extend(ProductController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$listOptions                     = me.$container.find('table#list-view-productOptions');
            me.$btnGoToReserve                  = me.$container.find('a#btn-view-goToReserve');

            me.userNo                           = me.$container.find('input#hdn-view-userNo').val();
            me.packageNo                        = me.$container.find('input#hdn-view-packageNo').val();
            me.page                             = me.$container.find('input#hdn-view-page').val();
            me.productNo                        = me.$container.find('input#hdn-view-productNo').val();
            me.categoryNo                       = me.$container.find('#hdn-view-categoryNo').val();

            me.initUi();
            me.initEventHandlers();
        },

        initUi: function () {
            var me = this;

        },

        initEventHandlers: function () {
            var me = this;

            me.$container.on('click', '.group-golfpackage-images .thumnail-group img', function(){
                me.$container.find('.img-golfpackage-big img').attr('src', $(this).attr('src'));
            });

            me.$container.on('click', 'a#btn-view-backToList', function(){
                siteApp.redirectPage('', 'POST', {method:'list',packageNo: me.packageNo, categoryNo: me.categoryNo, page: me.page});
            });

            me.$listOptions.on('change', 'input.chb-view-option', function(){
                if(this.checked){
                    me.$listOptions.find('input.chb-view-option').prop('checked', false);
                    $(this).prop('checked', true);
                }
            });

            me.$btnGoToReserve.on('click', function(){
                if(me.userNo) {
                    var $optionChecked = me.$listOptions.find('input.chb-view-option[type="checkbox"]:checked');
                    if($optionChecked.length > 0) {
                        var data = {};
                        data['optionNo'] =  $optionChecked.data('no');
                        data['productNo'] =  me.productNo;
                        $.ajax({
                            url: '/site/view/golfpackage/checkUserReservation.json',
                            type: 'POST',
                            dataType: 'json',
                            data: JSON.stringify(data),
                            contentType: "application/json",
                            success: function(response) {
                                if(response.success) {
                                    siteApp.redirectPage('', 'POST', {method:'apply',productNo: me.productNo, optionNo: $optionChecked.data('no')});
                                }else if('1' == response.status){
                                    var params = {method:'apply',productNo: me.productNo, optionNo: $optionChecked.data('no')};

                                    siteApp.confirmDialog(
                                        '이미 예약신청이 되었습니다. 추가 예약 신청하시겠습니까?',
                                        me.redirectReservationPage,
                                        params);
                                } else if('3' == response.status){
                                    var params = {method:'view',no: me.productNo, categoryNo: me.categoryNo, page: me.page};
                                    siteApp.alertMessage(
                                        '선택한 일정은 출발일 경과로 예약이 불가능합니다.',
                                        me.refreshProductDetailPage, params);
                                } else if('4' == response.status){
                                    var params = {method:'view',no: me.productNo, categoryNo: me.categoryNo, page: me.page};
                                    siteApp.alertMessage(
                                        '예약신청이 마감되었습니다.',
                                        me.refreshProductDetailPage, params);
                                }
                            },
                            beforeSend: function() {
                                me.$btnGoToReserve.prop('disabled', true);
                            },
                            complete: function () {
                                me.$btnGoToReserve.prop('disabled', false);
                            }
                        });
                    }else{
                        siteApp.alertMessage('예약하실 일정을 선택하여 주세요.');
                    }
                }else{
                    siteApp.confirmDialog(
                        '로그인 후 이용가능합니다. 로그인 하시겠습니까?',
                        me.redirectLoginPage
                        );
                }
            });
        },

        redirectLoginPage: function() {
            window.location.href = '/login';
        },

        redirectReservationPage: function(params){
            siteApp.redirectPage('', 'POST', params);
        },

        refreshProductDetailPage: function(params){
            siteApp.redirectPage('', 'POST', params);
        }

    });

    var productController = new ProductController('#container-golfpackage-view');

});




jQuery("document").ready(function($){
    
    var navCon = $('.nav-container');
    var goToReserve = $('.btn-reservation');
    
    $(window).scroll(function () {
        if ($(this).scrollTop() > 1050) {
            navCon.addClass("f-nav");
            goToReserve.addClass("f-btn");
        } else {
            navCon.removeClass("f-nav");
            goToReserve.removeClass("f-btn");
        }
    });

});

