var PopupCreditController = function (selector) {
    this.init(selector);
};

$.extend(PopupCreditController.prototype, {
    $container: null,
    tmplTownOption: '<option value="${townNo}" >${name}</option>',
    tmplUserOption: '<option value="${userNo}" >${name}</option>',
    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.$modalCredit               = me.$container
        me.$formCredit = me.$modalCredit.find('form');
        me.$btnSave = me.$modalCredit.find('#btn-save-credit');

        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;
        me.$btnSave.click(function(){
            me.addOrUpdateCredit();
        });
    },
    initEventHandlers:function() {
        var me = this;
        mugrunApp.inputNumberOnly(
            me.$modalCredit.find('input[name="socialId"], input[name="phone"]')
        );

    },
    initPopupEvent: function($modalBody){
        var me = this,
            $loanPeriod = $modalBody.find('select[name="loanPeriod"]'),
            $startDate = $modalBody.find('input[name="startDate"]'),
            $endDate = $modalBody.find('input[name="endDate"]');
        debugger;
        $startDate.datepicker({
            language: "vi",
            format: "dd/mm/yyyy",
            todayHighlight: true,
            keepEmptyValues: true
        }).on('changeDate', function(e) {
            //$endDate.datepicker('setStartDate', $startDate.val());
            var formValidation = me.$modalCredit.find('form').data('formValidation');
            formValidation.revalidateField($startDate);
            changePeriod();

        });

        var changePeriod = function(){
            if($startDate.val() != '' && $loanPeriod.val()!=''){
                var startDate = moment($startDate.val(), "DD/MM/YYYY");
                var days = ($loanPeriod.val() * 30) -1;
                var endDate = startDate.add(days, 'days');
                $endDate.val(endDate.format('DD/MM/YYYY'));
                var days = me.getTotalDays($startDate.val(), $endDate.val());
                me.$container.find('#label-loan-days').text(days + ' ngày.');
                me.doCreditData();
                var formValidation = me.$modalCredit.find('form').data('formValidation');
                formValidation.revalidateField($endDate);
            }


        }

        $loanPeriod.change(changePeriod);


        mugrunApp.inputNumberOnly(
            $modalBody.find('input[name="loanAmount"]')
        );
        mugrunApp.inputCurrency(
            $modalBody.find('input[name="loanAmount"]')
        );
        $modalBody.find('input[name="loanInterest"]').keyup(function(){
            delay(function(){
                var val = $modalBody.find('input[name="loanInterest"]').val();
                var format_val = parseFloat(val).toFixed(2);
                if(format_val == "NaN") format_val = 0.0;
                $modalBody.find('input[name="loanInterest"]').val(format_val);
                me.doCreditData();
            }, 1000 );
        });
        $modalBody.find('input[name="loanAmount"]').keyup(function(){
            // skip for arrow keys
            if(event.which >= 37 && event.which <= 40) return;
            delay(function(){
                var val = $modalBody.find('input[name="loanAmount"]').val().replace(new RegExp(",", 'g'), "");
                me.$container.find('#label-read-currency').text(DocTienBangChu(val));
                me.doCreditData();
            }, 500 );
        });

        $modalBody.find('select[name="loanPayType"]').change(function(){
            me.doCreditData();
        });

        $modalBody.find('form').formValidation({
            framework: 'bootstrap',
            icon: {
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'staffUserNo': {
                    row: '.col-md-3',
                    validators: {
                        notEmpty: {}
                    }
                }
                ,'dutyStaffNo': {
                    row: '.col-md-3',
                    validators: {
                        notEmpty: {}
                    }
                },
                'loanPeriod': {
                    row: '.col-md-3',
                    validators: {
                        notEmpty: {}
                    }
                },
                'startDate': {
                    row: '.col-md-5',
                    validators: {
                        notEmpty: {}
                    }
                },
                'endDate': {
                    row: '.col-md-5',
                    validators: {
                        notEmpty: {}
                    }
                },
                'loanAmount': {
                    row: '.col-md-3',
                    validators: {
                        notEmpty: {}
                    }
                },
                'loanType': {
                    row: '.col-md-2',
                    validators: {
                        notEmpty: {}
                    }
                },
                'loanPayType': {
                    row: '.col-md-2',
                    validators: {
                        notEmpty: {}
                    }
                },
                'loanInterest': {
                    row: '.col-md-2',
                    validators: {
                        notEmpty: {}
                    }
                }
            }
        });
        $modalBody.find('form').find('input,select').keydown(function(event){
            if(event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });
    },
    calculateTotalDay: function(){
        var me = this,
            $startDate = me.$modalCredit.find('input[name="startDate"]'),
            $endDate = me.$modalCredit.find('input[name="endDate"]');
        var days = me.getTotalDays($startDate.val(), $endDate.val());
        me.$container.find('#label-loan-days').text(days + ' ngày.');
    },
    getTotalDays: function(startDate, endDate){
        var me = this;
        var fromDate = moment(startDate, "DD/MM/YYYY").toDate();
        var toDate = moment(endDate, "DD/MM/YYYY").toDate();
        var oneDay = 24*60*60*1000;
        var diffDays = Math.round(Math.abs((fromDate.getTime() - toDate.getTime())/(oneDay)));
        return diffDays + 1;
    },
    doCreditData: function(){
        var me = this,
            $startDate = me.$modalCredit.find('input[name="startDate"]'),
            $endDate = me.$modalCredit.find('input[name="endDate"]'),
            $loanAmount = me.$modalCredit.find('input[name="loanAmount"]'),
            $loanType = me.$modalCredit.find('select[name="loanType"]'),
            $loanPayType = me.$modalCredit.find('select[name="loanPayType"]'),
            $loanInterest = me.$modalCredit.find('input[name="loanInterest"]');

        var $containerInfo = me.$modalCredit.find('#container-credit-info');
        var $tmplSumInfo = $('#tmpl-sum-info').html();

        if($startDate.val() != '' && $endDate.val() != ''
            && $loanAmount.val() != '' && $loanPayType.val() != '' && $loanInterest.val() != '' ){
            var days = me.getTotalDays($startDate.val(), $endDate.val());
            var totalPaySession = 0;
            var dayOfSession = 1;
            if($loanPayType.val() == "1"){
                totalPaySession = days;
                dayOfSession = 1;
            } else if($loanPayType.val() == "2"){
                dayOfSession = 7;
                totalPaySession = Math.ceil(days/dayOfSession);
            }

            var loanAmount = parseInt($loanAmount.val().replaceAll(',', ''));
            var loanInterest = parseFloat($loanInterest.val());

            var profitByMonth = loanAmount * (loanInterest/100);
            var profitByDay = profitByMonth/30;

            var payByDay = (loanAmount / days) + profitByMonth/30;
            var payBySession = payByDay * dayOfSession;
            var profitBySession = profitByDay * dayOfSession;
            var totalPayAmount = payByDay * days;

            $containerInfo.empty().append($.tmpl($tmplSumInfo, {
                totalPaySession: totalPaySession,
                totalPayAmount: mugrunApp.roundAndFormatNumber(totalPayAmount),
                profitBySession: mugrunApp.roundAndFormatNumber(profitBySession),
                payBySession: mugrunApp.roundAndFormatNumber(payBySession)
            }));

        }
    },
    open: function(customerNo, callbackFn) {
        var me = this;
        me.callbackFn = callbackFn;
        mugrunApp.mask();
        me.$modalCredit.find('div.modal-body').load('/admin/customer/loadCreditData.html?customerNo='+customerNo, function(){
            mugrunApp.unmask();
            me.initPopupEvent(me.$modalCredit.find('div.modal-body'));
            me.$modalCredit.modal({show: true, backdrop: 'static'});
        });
    },
    edit: function(loanNo, callbackFn){
        var me = this;
        me.callbackFn = callbackFn;
        mugrunApp.mask();
        me.$modalCredit.find('div.modal-body').load('/admin/customer/loadCreditData.html?loanNo='+loanNo, function(){
            mugrunApp.unmask();
            me.initPopupEvent(me.$modalCredit.find('div.modal-body'));
            var $loanPeriod = me.$modalCredit.find('select[name="loanPeriod"]');
            $loanPeriod.val($loanPeriod.data('loanPeriod'));
            me.doCreditData();
            me.calculateTotalDay();
            me.$modalCredit.modal({show: true, backdrop: 'static'});
        });
    },
    addOrUpdateCredit: function(){
        var me = this;
        var formValidation = me.$modalCredit.find('form').data('formValidation');
        formValidation.validate();
        var $loanAmount = me.$modalCredit.find('form').find('input[name="loanAmount"]');
        $loanAmount.val($loanAmount.val().replaceAll(",", ""));
        if(formValidation.isValid()){
            $.ajax({
                url: '/admin/loan/addOrEdit.json',
                type: 'POST',
                dataType: 'json',
                data: me.$modalCredit.find('form').serialize(),
                success: function(data) {
                    if (data.success) {
                        me.$modalCredit.modal('hide');
                        if(me.callbackFn != null){
                            me.callbackFn();
                        }
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

    }

});

$(document).ready(function(){
    window.popupCreditController = new PopupCreditController('#modal-create-credit');
});