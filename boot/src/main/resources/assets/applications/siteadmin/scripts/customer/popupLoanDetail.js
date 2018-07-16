var PopupLoanDetailController = function (selector) {
    this.init(selector);
};

$.extend(PopupLoanDetailController.prototype, {
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

    },
    open: function(loanNo, status, callbackFn) {
        var me = this;
        me.callbackFn = callbackFn;
        me.$modal.loanNo = loanNo;
        me.$modal.status = status;
        me.reloadDetail();

    },
    reloadDetail: function(){
        var me = this;
        mugrunApp.mask();
        me.$modal.find('div.modal-body').load('/admin/loan/getLoanInfo.html?status=view&loanNo='+me.$modal.loanNo, function(){
            mugrunApp.unmask();
            me.initPopupEvent(me.$modal.find('div.modal-body'));
            me.$modal.modal({show: true, backdrop: 'static'});

        });
    },
    initPopupEvent: function($modalBody){
        var me = this;
        $modalBody.find('.btn-loan-detail').click(function(){
            window.popupPaymentDetailController.open(me.$modal.loanNo, me.$modal.status, function(){
                me.reloadDetail();
                if(me.callbackFn != null){
                    me.callbackFn();
                }
            });
        });
    }
});

$(document).ready(function(){
    window.popupLoanDetailController = new PopupLoanDetailController('#modal-loan-detail');
});