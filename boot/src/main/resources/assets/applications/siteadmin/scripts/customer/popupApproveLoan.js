var PopupApproveLoanController = function (selector) {
    this.init(selector);
};

$.extend(PopupApproveLoanController.prototype, {
    $container: null,
    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.$modal               = me.$container

        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;

    },
    initEventHandlers:function() {
        var me = this;
        me.$modal.find('#btn-approve-loan').click(function(){
            me.approveLoan(me.$modal.loanNo);
        });

    },
    open: function(loanNo, callbackFn) {
        var me = this;
        me.callbackFn = callbackFn;
        me.$modal.loanNo = loanNo;
        me.reloadDetail();

    },
    reloadDetail: function(){
        var me = this;
        mugrunApp.mask();
        me.$modal.find('div.modal-body').load('/admin/loan/getLoanInfo.html?status=A&loanNo='+me.$modal.loanNo, function(){
            mugrunApp.unmask();
            me.initPopupEvent(me.$modal.find('div.modal-body'));
            me.$modal.modal({show: true, backdrop: 'static'});

        });
    },
    initPopupEvent: function($modalBody){
        var me = this;
        $modalBody.find('.btn-loan-detail').click(function(){
            window.popupPaymentDetailController.open(me.$modal.loanNo, null, function(){
                me.reloadDetail();
            });
        });
    },
    getSubmitData: function(loanNo){
        var me = this;
        return {
            loanNo: loanNo
        }
    },
    approveLoan: function(loanNo){
        var me = this;
        mugrunApp.showCommonConfirmDialog('Bạn có muốn DUYỆT hợp đồng tín dụng này không?', function(){
            $.ajax({
                url: '/admin/loan/approve.json',
                type: 'GET',
                dataType: 'json',
                data: me.getSubmitData(loanNo),
                success: function(data) {
                    if (data.success) {
                        me.$modal.modal('hide');
                        if(me.callbackFn != null){
                            me.callbackFn();
                        }
                        mugrunApp.alertMessage('Hợp đồng đã được duyệt.');
                    } else {
                        mugrunApp.alertMessage(data.data);
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask();
                },
                error: function() {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                },
                complete: function () {
                    mugrunApp.unmask();
                }
            });
        });
    },
    denyLoan: function(loanNo, callbackFn){
        var me = this;
        mugrunApp.showCommonConfirmDialog('Bạn có muốn TỪ CHỐI hợp đồng tín dụng này không?', function(){
            $.ajax({
                url: '/admin/loan/deny.json',
                type: 'GET',
                dataType: 'json',
                data: me.getSubmitData(loanNo),
                success: function(data) {
                    if (data.success) {
                        me.$modal.modal('hide');
                        if(callbackFn != null){
                            callbackFn();
                        }
                        mugrunApp.alertMessage('Hợp đồng đã được từ chối.');
                    } else {
                        mugrunApp.alertMessage(data.data);
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask();
                },
                error: function() {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                },
                complete: function () {
                    mugrunApp.unmask();
                }
            });
        });
    }
});

$(document).ready(function(){
    window.popupApproveLoanController = new PopupApproveLoanController('#modal-approve-loan');
});