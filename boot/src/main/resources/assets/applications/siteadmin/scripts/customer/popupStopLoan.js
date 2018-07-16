var PopupStopLoanController = function (selector) {
    this.init(selector);
};

$.extend(PopupStopLoanController.prototype, {
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
        me.$modal.find('#btn-request-finish').click(function(){
            me.requestFinishLoan(me.$modal.loanNo);
        });
        me.$modal.find('#btn-approve-finish').click(function(){
            me.approveFinish(me.$modal.loanNo);
        });
        me.$modal.find('#btn-reject-finish').click(function(){
            me.rejectRequest(me.$modal.loanNo);
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
        me.$modal.find('div.modal-body').load('/admin/loan/getLoanInfo.html?status=finish&loanNo='+me.$modal.loanNo, function(){
            var status = me.$modal.find('[name="status"]').val();
            if(status == 'R'){
                $('#btn-approve-finish').show();
                $('#btn-reject-finish').show();
                $('#btn-request-finish').hide();
            }else{
                $('#btn-approve-finish').hide();
                $('#btn-reject-finish').hide();
                $('#btn-request-finish').show();
            }
            mugrunApp.unmask();

            me.initPopupEvent(me.$modal.find('div.modal-body'));
            me.$modal.modal({show: true, backdrop: 'static'});

        });
    },
    initPopupEvent: function($modalBody){
        var me = this;
        $modalBody.find('.fa-question-circle').click(function(){
            if($('.help-message-finish').is(':visible')){
                $('.help-message-finish').hide();
            }else{
                $('.help-message-finish').show();
            }

        });

        $modalBody.find('.btn-loan-detail').click(function(){
            window.popupPaymentDetailController.open(me.$modal.loanNo, null, function(){
                me.reloadDetail();
            });
        });
        var $returnAmount = $modalBody.find('input[name="finishReturnAmount"]'),
            $remainProfit = $modalBody.find('input[name="remainProfit"]'),
            $discount = $modalBody.find('input[name="discount"]');

        mugrunApp.inputNumberOnly(
            $returnAmount
        );
        mugrunApp.inputCurrency(
            $returnAmount
        );
        mugrunApp.inputNumberOnly(
            $remainProfit
        );
        mugrunApp.inputCurrency(
            $remainProfit
        );
        mugrunApp.inputNumberOnly(
            $discount
        );
        mugrunApp.inputCurrency(
            $discount
        );

        $returnAmount.val(mugrunApp.formatCurrency($returnAmount.val()));
        $remainProfit.val(mugrunApp.formatCurrency($remainProfit.val()));
        $discount.val(mugrunApp.formatCurrency($discount.val()));

    },
    getSubmitData: function(loanNo){
        var me = this;
        var $returnAmount = me.$modal.find('input[name="finishReturnAmount"]'),
            $remainProfit = me.$modal.find('input[name="remainProfit"]'),
            $discount = me.$modal.find('input[name="discount"]'),
            $finishedNote = me.$modal.find('textarea[name="finishedNote"]');
        $returnAmount.val($returnAmount.val().replaceAll(",", ""));
        $remainProfit.val($remainProfit.val().replaceAll(",", ""));
        $discount.val($discount.val().replaceAll(",", ""));
        debugger;
        return {
            loanNo: loanNo,
            finishReturnAmount: $returnAmount.val(),
            discountAmount:$discount.val(),
            extraAmount: parseInt($remainProfit.val()==''? 0 : $remainProfit.val()) - parseInt($discount.val()==''? 0 : $discount.val()),
            finishedNote: $finishedNote.val()
        }
    },
    requestFinishLoan: function(loanNo){
        var me = this;
        mugrunApp.showCommonConfirmDialog('Bạn có muốn tất toán hợp đồng tín dụng này không?', function(){
            $.ajax({
                url: '/admin/loan/requestFinish.json',
                type: 'GET',
                dataType: 'json',
                data: me.getSubmitData(loanNo),
                success: function(data) {
                    if (data.success) {
                        me.$modal.modal('hide');
                        if(me.callbackFn != null){
                            me.callbackFn();
                        }
                        mugrunApp.alertMessage('Hợp đồng đã được tất toán.');
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
    approveFinish: function(loanNo){
        var me = this;
        mugrunApp.showCommonConfirmDialog('Bạn có muốn tất toán hợp đồng tín dụng này không?', function(){
            $.ajax({
                url: '/admin/loan/approveFinish.json',
                type: 'GET',
                dataType: 'json',
                data: me.getSubmitData(loanNo),
                success: function(data) {
                    if (data.success) {
                        me.$modal.modal('hide');
                        if(me.callbackFn != null){
                            me.callbackFn();
                        }
                        mugrunApp.alertMessage('Hợp đồng đã được tất toán.');
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
    rejectRequest: function(loanNo){
        var me = this;
        mugrunApp.showCommonConfirmDialog('Xác nhận: từ chối?', function(){
            $.ajax({
                url: '/admin/loan/rejectRequest.json',
                type: 'GET',
                dataType: 'json',
                data: me.getSubmitData(loanNo),
                success: function(data) {
                    if (data.success) {
                        me.$modal.modal('hide');
                        if(me.callbackFn != null){
                            me.callbackFn();
                        }
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
    window.popupStopLoanController = new PopupStopLoanController('#modal-stop-loan');
});