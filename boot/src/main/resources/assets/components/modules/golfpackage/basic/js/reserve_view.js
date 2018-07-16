$( document ).ready(function() {

    var ReservationViewController = function (selector) {
        this.init(selector);
    };

    $.extend(ReservationViewController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$btnCancel               = me.$container.find('#btn-reserveView-cancel');
            me.$btnOk                   = me.$container.find('#btn-reserveView-ok');
            me.$btnPrint                = me.$container.find('#btn-reserveView-print');

            me.activeTab        = me.$container.find('#hdn-list-activeTab').val();
            me.page             = me.$container.find('#hdn-list-page').val();
            me.reserveNo        = me.$container.find('#hdn-list-reserveNo').val();

            me.initUi();
            me.initEventHandlers();
        },

        initUi: function () {
            var me = this;

        },

        initEventHandlers: function () {
            var me = this;

            me.$btnOk.on('click', function(){
                siteApp.redirectPage('', 'POST', {method:'reserve_list',activeTab: me.activeTab, page: me.page});
            });

            me.$btnCancel.on('click', function(){
                siteApp.confirmDialog(
                    '예약 취소 시 재 예약이 불가능할 수 있습니다. 취소하시겠습니까?',
                    me.cancelReservation);
            });

            me.$btnPrint.on('click', function(){
                $('div.page-header:first').addClass('hide');
                $('div.page-footer').addClass('hide');
                $('div#container-reserveView-actions').addClass('hide');

                window.print();

                $('div.page-header:first').removeClass('hide');
                $('div.page-footer').removeClass('hide');
                $('div#container-reserveView-actions').removeClass('hide');
            });
        },

        cancelReservation: function() {
            var me = reservationViewController;

            $.ajax({
                url: '/site/view/golfpackage/cancelReservation.json',
                type: 'POST',
                dataType: 'json',
                data: {
                    reserveNo: me.reserveNo
                },
                success: function(response) {
                    if(response.success) {
                        siteApp.redirectPage('', 'POST', {method:'reserve_list',activeTab: me.activeTab, page: me.page});
                    }
                },
                beforeSend: function() {
                    me.$btnCancel.prop('disabled', true);
                    me.$btnOk.prop('disabled', true);
                },
                complete: function () {
                    me.$btnCancel.prop('disabled', false);
                    me.$btnOk.prop('disabled', false);
                }
            });
        }


    });

    var reservationViewController = new ReservationViewController('#container-reservation-view');

});