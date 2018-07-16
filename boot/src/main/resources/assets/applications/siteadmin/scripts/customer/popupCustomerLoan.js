var PopupCustomerLoanController = function (selector) {
    this.init(selector);
};

$.extend(PopupCustomerLoanController.prototype, {
    $container: null,
    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$modalCustomerLoan               = me.$container

        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;



    },
    initEventHandlers:function() {
        var me = this;
        me.$modalCustomerLoan.on('click', '#btn-create-loan', function(){
            window.popupCreditController.open(me.customerNo, function(){
                me.reload();
            });
        });
        me.$modalCustomerLoan.on('click', 'button.btn-loan-detail', function(){
            var loanNo = $(this).data('loanNo');
            var status = $(this).data('loanStatus');
            window.popupPaymentDetailController.open(loanNo, '', function(){
                me.reload();
            });
        });

        me.$modalCustomerLoan.on('click', 'button.btn-edit-credit', function(){
            var loanNo = $(this).closest('.container-loan-buttons').data('loanNo');
            me.editLoan(loanNo);
        });
        me.$modalCustomerLoan.on('click', 'button.btn-delete-credit', function(){
            var loanNo = $(this).closest('.container-loan-buttons').data('loanNo');
            me.deleteLoan(loanNo);
        });
        me.$modalCustomerLoan.on('click', 'button.btn-approve', function(){
            var loanNo = $(this).closest('.container-loan-buttons').data('loanNo');
            me.approveLoan(loanNo);
        });
        me.$modalCustomerLoan.on('click', 'button.btn-loan-finished', function(){
            var loanNo = $(this).data('loanNo');
            me.finishLoan(loanNo);
        });

        // PRINT EVENTS
        me.$modalCustomerLoan.on('click', '.btn-print-nhantien', function(){
            var loanNo = $(this).closest('.container-buttons').data('loanNo');
            var url = '/admin/popup/nhantien.html?loanNo=' + loanNo;
            mugrunApp.popupCenter(url, '', 1100, 900);
        });
        me.$modalCustomerLoan.on('click', '.btn-print-bangiao-ts', function(){
            var loanNo = $(this).closest('.container-buttons').data('loanNo');
            var url = '/admin/popup/bangiaots.html?loanNo=' + loanNo;
            mugrunApp.popupCenter(url, '', 1100, 900);
        });
        me.$modalCustomerLoan.on('click', '.btn-print-denghi-muontien', function(){
            var loanNo = $(this).closest('.container-buttons').data('loanNo');
            var url = '/admin/popup/denghimuontien.html?loanNo=' + loanNo;
            mugrunApp.popupCenter(url, '', 1100, 900);
        });
        me.$modalCustomerLoan.on('click', '.btn-print-ghino', function(){
            var loanNo = $(this).closest('.container-buttons').data('loanNo');
            var url = '/admin/popup/giayghino.html?loanNo=' + loanNo;
            mugrunApp.popupCenter(url, '', 1100, 900);
        });
        me.$modalCustomerLoan.on('click', '.btn-print-hanmuc', function(){
            var loanNo = $(this).closest('.container-buttons').data('loanNo');
            var url = '/admin/popup/thoa-thuan-han-muc-muon-tien.html?loanNo=' + loanNo;
            mugrunApp.popupCenter(url, '', 1100, 900);
        });

    },
    open: function(customerNo, callbackFn) {
        var me = this;
        me.customerNo = customerNo;
        mugrunApp.mask(mugrunApp.getMessage('common.loading'));
        me.$modalCustomerLoan.find('.container-loan-list').load("/admin/customer/getLoanListByCustomer.html?customerNo=" + customerNo, function(){
            me.$modalCustomerLoan.modal({backdrop: 'static', show: true});
            mugrunApp.unmask();
        });
    },
    reload: function(){
        var me = this;
        mugrunApp.mask(mugrunApp.getMessage('common.loading'));
        me.$modalCustomerLoan.find('.container-loan-list').load("/admin/customer/getLoanListByCustomer.html?customerNo=" + me.customerNo, function(){
            mugrunApp.unmask();
        });
    },
    approveLoan: function(loanNo){
        var me = this;
        window.popupApproveLoanController.open(loanNo, function(){
            me.reload();
        });
    },
    finishLoan: function(loanNo){
        var me = this;
        window.popupStopLoanController.open(loanNo, function(){
            me.reload();
        });
    },
    editLoan: function(loanNo){
        var me = this;
        window.popupCreditController.edit(loanNo, function(){
            me.reload();
        });
    },
    deleteLoan: function(loanNo){
        var me = this;
        mugrunApp.showCommonConfirmDialog('Bạn có muốn xóa hợp đồng tín dụng này không?', function(){
            $.ajax({
                url: '/admin/loan/delete.json',
                type: 'GET',
                dataType: 'json',
                data: {loanNo: loanNo},
                success: function(data) {
                    if (data.success) {
                        me.reload();
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.delete.done'));
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask();
                },
                complete: function () {
                    mugrunApp.unmask();
                }
            });
        });
    }

});

$(document).ready(function(){
    window.popupCustomerLoanController = new PopupCustomerLoanController('#modal-customer-loan');
});