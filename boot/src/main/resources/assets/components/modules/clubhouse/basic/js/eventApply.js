$( document ).ready(function(){
    var EventApplyController = function (selector) {
        this.init(selector);
    };

    $.extend(EventApplyController.prototype, {
        $container: null,
        MAX_COMMENT_LENGTH: 200,
        init: function (selector) {
            var me = this;
            me.$container = $(selector);
            me.eventNo = me.$container.find(':hidden[name=eventNo]').val();
            me.$applyType = me.$container.find(':hidden[name=applyType]');
            me.$lblPolicy = me.$container.find('#lbl-clubhouse-policy');
            me.$lblAgreement = me.$container.find('#lbl-clubhouse-agreement');
            me.$chkPolicy = me.$container.find('input[name=policyYn]');
            me.$chkAgreement = me.$container.find('input[name=attendAgreementYn]');
            me.$btnApply = me.$container.find('#btn-clubhouse-apply');
            me.$btnStandby = me.$container.find('#btn-clubhouse-standby');
            me.$form = me.$container.find('#form-clubhouse-apply');

            me.preventInput = false;
            me.initEventHandlers();

        },
        initEventHandlers: function() {
            var me = this;
            me.$btnApply.click(function(){
                me.applyEvent('1');
            });

            me.$btnStandby.click(function(){
                me.applyEvent('2');
            });

            me.$chkPolicy.change(function(){
                if(me.$chkPolicy.is(':checked')){
                    me.$lblPolicy.hide();
                }else{
                    me.$lblPolicy.show();
                }
            });

            me.$chkAgreement.change(function(){
                if(me.$chkAgreement.is(':checked')){
                    me.$lblAgreement.hide();
                }else{
                    me.$lblAgreement.show();
                }
            });

            me.$form.find('input[name="phone1"], input[name="phone2"], input[name="phone3"]').keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                        // Allow: Ctrl+A, Command+A
                    (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                        // Allow: home, end, left, right, down, up
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });

            me.$form.ajaxForm({
                success: function(result, statusText, xhr, $form){
                    if(result.success == true){

                        var message = siteApp.getMessage('component.module.clubhouse.apply_standby_done');
                        if(me.applyType == '1'){
                            message = siteApp.getMessage('component.module.clubhouse.apply_done');
                        }
                        siteApp.alertMessage(message, function(){
                            window.location.href = '?scene=eventDetail&eventNo=' + me.eventNo;
                        });
                    }else{
                        var errorMessage = "";
                        if(result.error_code == "1"){
                            errorMessage = siteApp.getMessage('component.module.clubhouse.apply.error');
                        }else if(result.error_code == "2"){
                            errorMessage = siteApp.getMessage('component.module.clubhouse.apply.duplicate');
                        }else if(result.error_code == "3"){
                            errorMessage = siteApp.getMessage('component.module.clubhouse.apply.event_close');
                        }else if(result.error_code == "4"){
                            errorMessage = siteApp.getMessage('component.module.clubhouse.apply.attend_wait');
                        }
                        siteApp.alertMessage(errorMessage, function(){
                            window.location.href = '?scene=eventDetail&eventNo=' + me.eventNo;
                        });
                    }
                }
            });

            me.$form.formValidation({
                framework: 'bootstrap',
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    userNickName: {
                        row: '.col-md-8',
                        validators: {
                            notEmpty: {
                                message: siteApp.getMessage('component.module.clubhouse.require.golfHandy')
                            }
                        }
                    },
                    golfHandy: {
                        row: '.col-md-8',
                        validators: {
                            notEmpty: {
                                message: siteApp.getMessage('component.module.clubhouse.require.golfHandy')
                            }
                        }
                    },
                    carpoolYn: {
                        row: '.col-md-8',
                        validators: {
                            notEmpty: {
                                message: siteApp.getMessage('component.module.clubhouse.require.carpoolYn')
                            }
                        }
                    },
                    phoneNo: {
                        row: '.col-md-9',
                        excluded: false,
                        validators: {
                            notEmpty: {
                                message: siteApp.getMessage('component.module.clubhouse.require.phoneNo')
                            }
                        }
                    },
                    departLocation: {
                        row: '.col-md-9',
                        excluded: false,
                        validators: {
                            notEmpty: {
                                message: siteApp.getMessage('component.module.clubhouse.require.departLocation')
                            }
                        }
                    }
                }
            }).on('keyup', 'input[name="phone1"], input[name="phone2"], input[name="phone3"]', function(e) {
                var phone1 = me.$form.find('[name="phone1"]').val(),
                    phone2 = me.$form.find('[name="phone2"]').val(),
                    phone3 = me.$form.find('[name="phone3"]').val();

                // Set the dob field value
                me.$form.find('[name="phoneNo"]').val(phone1 === '' || phone2 === '' || phone3 === '' ? '' : [phone1, phone2, phone3].join('-'));

                // Revalidate it
                me.$form.formValidation('revalidateField', 'phoneNo');
            }).on('keyup', 'input[name="address1"], input[name="address2"]', function(e) {
                var address1 = me.$form.find('[name="address1"]').val(),
                    address2 = me.$form.find('[name="address2"]').val();

                // Set the dob field value
                me.$form.find('[name="departLocation"]').val(address1 === '' || address2 === '' ? '' : [address1, address2].join('-'));

                // Revalidate it
                me.$form.formValidation('revalidateField', 'departLocation');
            });

        },
        applyEvent: function(type){
            var me = this,
                flag = true;

            if(!me.$chkPolicy.is(":checked")){
                me.$lblPolicy.show();
                flag=false;
            }else{
                me.$lblPolicy.hide();
            }

            if(me.$chkAgreement.length>0 && !me.$chkAgreement.is(":checked")){
                me.$lblAgreement.show();
                flag=false;
            }else{
                me.$lblAgreement.hide();
            }

            if(!flag){
                return;
            }

            me.$applyType.val(type);
            me.applyType = type;
            var formValidation = me.$form.data('formValidation');
            formValidation.validate();
            if(formValidation.isValid()){
                me.$btnApply.prop('disabled', true);
                me.$btnStandby.prop('disabled', true);
                me.$form.submit();
            }
        }
    });

    new EventApplyController('.container-clubhouse-wrapper');
});