$( document ).ready(function() {

    var ReservationController = function (selector) {
        this.init(selector);
    };

    $.extend(ReservationController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$btnSelectOtherOption            = me.$container.find('#btn-apply-moveToView');
            me.$chbAgreement                    = me.$container.find('#chb-apply-agreement');
            me.$btnReserve                      = me.$container.find('#btn-apply-reserve');
            me.$btnCancel                       = me.$container.find('#btn-apply-cancel');
            me.$inputPeopleCount                = me.$container.find('#input-apply-peopleCount');
            me.$phone1                          = me.$container.find('input#phone1');
            me.$phone2                          = me.$container.find('input#phone2');
            me.$phone3                          = me.$container.find('input#phone3');
            me.$totalPrice                      = me.$container.find('span#span-apply-totalPrice');

            me.page                             = me.$container.find('input#hdn-view-page').val();
            me.productNo                        = me.$container.find('input#hdn-view-productNo').val();
            me.optionNo                         = me.$container.find('input#hdn-view-optionNo').val();
            me.optionPrice                      = me.$container.find('input#hdn-view-optionPrice').val();

            me.initUi();
            me.initEventHandlers();
        },

        initUi: function () {
            var me = this;

        },

        initEventHandlers: function () {
            var me = this;

            me.$btnSelectOtherOption.on('click', function(){
                siteApp.redirectPage('', 'POST', {method:'view',no: me.productNo, page: me.page});
            });

            me.$inputPeopleCount.on('change', function(){

                var peopleCount  = Number($(this).val());
                var bookableCount = me.$inputPeopleCount.attr('max');

                var formatMessage = '수는 1 와 max 사이에 있어야합니다.';
                var message = formatMessage.replace('max', bookableCount);
                me.$container.find('.error-msg.range-people-count').text(message);

                if(Number(peopleCount) < 1 || Number(peopleCount) > Number(bookableCount)) {
                    //siteApp.alertMessage('최대 예약가능 인원이 초과되었습니다.');
                    me.$container.find('.error-msg.range-people-count').removeClass('hide');
                } else {
                    var totalPrice = Number($(this).val()) * Number(me.optionPrice);
                    var totalPriceStr = accounting.formatMoney(totalPrice, "", 0);
                    me.$totalPrice.text(totalPriceStr);
                    me.$container.find('.error-msg.range-people-count').addClass('hide');
                }
            });

            me.$btnCancel.on('click', function(){
                siteApp.redirectPage('', 'POST', {method:'view',no: me.productNo, page: me.page});
            });

            me.$btnReserve.on('click', function(){
                var peopleCount = me.$inputPeopleCount.val();
                var bookableCount = me.$inputPeopleCount.attr('max');
                if(Number(peopleCount) < 1 || Number(peopleCount) > Number(bookableCount)) {
                    //siteApp.alertMessage('최대 예약가능 인원이 초과되었습니다.');
                }else if(!me.$chbAgreement[0].checked) {
                    siteApp.alertMessage('주의사항 및 취소,환불규정에 동의하셔야 합니다.');
                }else {
                    mugrunApp.showCommonConfirmDialog(
                        '해당 정보로 예약하시겠습니까?',
                        me.processReservation,
                        null);
                }
            });

            me.$phone1.keypress(function(e) {
                siteApp.onlyNumber(e);
            });
            me.$phone2.keypress(function(e) {
                siteApp.onlyNumber(e);
            });
            me.$phone3.keypress(function(e) {
                siteApp.onlyNumber(e);
            });
        },

        processReservation: function() {
            var me = reservationController;

            var data = {};
            data['productNo'] =  me.productNo;
            data['optionNo'] =  me.optionNo;
            data['phoneNo'] =  me.$phone1.val()+'-'+me.$phone2.val()+'-'+me.$phone3.val();
            data['peopleCount'] =  me.$inputPeopleCount.val();
            data['optionPrice'] =  me.optionPrice;
            data['paymentAmount'] =  Number(me.$inputPeopleCount.val()) * Number(me.optionPrice);
            $.ajax({
                url: '/site/view/golfpackage/reserve.json',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(response) {
                    if(response.success) {
                        var params = {method:'view',no: me.productNo, page: me.page};
                        siteApp.alertMessage('예약신청 되었습니다.', me.redirectToViewPage, params);

                    }else if('1' == response.status){
                        siteApp.alertMessage('최대 예약가능 인원이 초과되었습니다.');
                    }
                    /*else if('2' == response.status){
                        siteApp.alertMessage('이미 예약이 완료되었습니다.');
                    }*/
                },
                beforeSend: function() {
                    me.$btnReserve.prop('disabled', true);
                },
                complete: function () {
                    me.$btnReserve.prop('disabled', false);
                }
            });
        },

        redirectToViewPage: function(params){
            siteApp.redirectPage('', 'POST', params);
        }

    });

    var reservationController = new ReservationController('#container-golfpackage-apply');

});