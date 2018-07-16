var CustomerDetailController = function (selector) {
    this.init(selector);
};

$.extend(CustomerDetailController.prototype, {
    $container: null,
    tmplTownOption: '<option value="${townNo}" >${name}</option>',
    tmplUserOption: '<option value="${userNo}" >${name}</option>',
    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.$formCustomer = me.$container.find('form');
        me.$containerLoanList = me.$container.find('#container-customer-credits');
        me.customerNo                  = me.$formCustomer.find(':hidden[name="customerNo"]').val();
        me.$cboTown                  = me.$formCustomer.find('select[name="townNo"]');
        me.$cboUser                  = me.$formCustomer.find('select[name="staffUserNo"]');
        me.$btnSave = me.$container.find('#btn-save-town');
        me.$btnAddCredit = me.$container.find('#btn-add-credit');

        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;
        me.loadLoanList();
        me.$formCustomer.formValidation({
            framework: 'bootstrap',
            icon: {
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'name': {
                    row: '.col-md-2',
                    validators: {
                        notEmpty: {}
                    }
                },
                'staffUserNo': {
                    row: '.col-md-2',
                    validators: {
                        notEmpty: {}
                    }
                },
                'townNo': {
                    row: '.col-md-2',
                    validators: {
                        notEmpty: {}
                    }
                },
                'socialId': {
                    row: '.col-md-2',
                    validators: {
                        notEmpty: {}
                    }
                },
                'sex': {
                    row: '.col-md-4',
                    validators: {
                        notEmpty: {}
                    }
                },
                'address': {
                    row: '.col-md-9',
                    validators: {
                        notEmpty: {}
                    }
                }
            }
        });
        me.$formCustomer.find('input.input-date').inputmask({});

        me.$btnSave.click(function(){
            me.addOrUpdateCustomer();
        });

        me.$btnAddCredit.click(function(){
            window.popupCreditController.open(me.customerNo, function(){
                me.loadLoanList();
            });
        });


    },
    loadLoanList: function(){
        var me = this;
        me.$containerLoanList.load("/admin/customer/getLoanListByCustomer.html?customerNo=" + me.customerNo, function(){

        });
    },
    initEventHandlers:function() {
        var me = this;
        mugrunApp.inputNumberOnly(
            me.$formCustomer.find('input[name="socialId"], input[name="phone"]')
        );
        me.$containerLoanList.on('click', 'button.btn-approve', function(){
            var loanNo = $(this).closest('.container-loan-buttons').data('loanNo');
            me.approveLoan(loanNo);
        });
        me.$containerLoanList.on('click', 'button.btn-edit-credit', function(){
            var loanNo = $(this).closest('.container-loan-buttons').data('loanNo');
            me.editLoan(loanNo);
        });
        me.$containerLoanList.on('click', 'button.btn-delete-credit', function(){
            var loanNo = $(this).closest('.container-loan-buttons').data('loanNo');
            me.deleteLoan(loanNo);
        });
        me.$containerLoanList.on('click', 'button.btn-loan-detail', function(){
            var loanNo = $(this).data('loanNo');
            window.popupPaymentDetailController.open(loanNo, '', function(){
                me.loadLoanList();
            });
        });

        me.$containerLoanList.on('click', 'button.btn-loan-finished', function(){
            var loanNo = $(this).data('loanNo');
            me.finishLoan(loanNo);
        });


        // print events
        me.$containerLoanList.on('click', '.btn-print-nhantien', function(){
            var loanNo = $(this).closest('.container-buttons').data('loanNo');
            var url = '/admin/popup/nhantien.html?loanNo=' + loanNo;
            mugrunApp.popupCenter(url, '', 1100, 900);
        });
        me.$containerLoanList.on('click', '.btn-print-bangiao-ts', function(){
            var loanNo = $(this).closest('.container-buttons').data('loanNo');
            var url = '/admin/popup/bangiaots.html?loanNo=' + loanNo;
            mugrunApp.popupCenter(url, '', 1100, 900);
        });
        me.$containerLoanList.on('click', '.btn-print-denghi-muontien', function(){
            var loanNo = $(this).closest('.container-buttons').data('loanNo');
            var url = '/admin/popup/denghimuontien.html?loanNo=' + loanNo;
            mugrunApp.popupCenter(url, '', 1100, 900);
        });
        me.$containerLoanList.on('click', '.btn-print-ghino', function(){
            var loanNo = $(this).closest('.container-buttons').data('loanNo');
            var url = '/admin/popup/giayghino.html?loanNo=' + loanNo;
            mugrunApp.popupCenter(url, '', 1100, 900);
        });
        me.$containerLoanList.on('click', '.btn-print-hanmuc', function(){
            var loanNo = $(this).closest('.container-buttons').data('loanNo');
            var url = '/admin/popup/thoa-thuan-han-muc-muon-tien.html?loanNo=' + loanNo;
            mugrunApp.popupCenter(url, '', 1100, 900);
        });

    },
    addOrUpdateCustomer: function(){
        var me = this;

        var formValidation = me.$formCustomer.data('formValidation');
        formValidation.validate();
        if(formValidation.isValid()){
            var $birthday = me.$formCustomer.find('input[name="birthday"]');
            if (!$birthday.inputmask("isComplete")){
                $birthday.closest('div').addClass('has-error');
                $('#date-invalide-msg').show();
                return ;
            }else{
                $birthday.closest('div').removeClass('has-error');
                $('#date-invalide-msg').hide();
            }
            var $issueDate = me.$formCustomer.find('input[name="issueDate"]');
            if (!$issueDate.inputmask("isComplete")){
                $issueDate.closest('div').addClass('has-error');
                $('#date-issue-invalide-msg').show();
                return ;
            }else{
                $issueDate.closest('div').removeClass('has-error');
                $('#date-issue-invalide-msg').hide();
            }

            $.ajax({
                url: '/admin/customer/addOrEdit.json',
                type: 'POST',
                dataType: 'json',
                data: me.$formCustomer.serialize(),
                success: function(data) {
                    if (data.success) {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.update.done'));
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    me.$btnSave.prop('disabled', true);
                    mugrunApp.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    me.$btnSave.prop('disabled', false);
                    mugrunApp.unmask();
                }
            });
        }
    },
    editLoan: function(loanNo){
        var me = this;
        window.popupCreditController.edit(loanNo, function(){
            me.loadLoanList();
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
                        me.loadLoanList();
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
    },
    finishLoan: function(loanNo){
        var me = this;
        window.popupStopLoanController.open(loanNo, function(){
            me.loadLoanList();
        });
    },
    approveLoan: function(loanNo){
        var me = this;
        window.popupApproveLoanController.open(loanNo, function(){
            me.loadLoanList();
        });
    }

});

$(document).ready(function(){
    window.customerDetailController = new CustomerDetailController('#container-customer-detail');
});