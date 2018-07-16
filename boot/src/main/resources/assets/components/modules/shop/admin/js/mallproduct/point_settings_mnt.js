var PointSettingsController = function (selector) {
    this.init(selector);
};

$.extend(PointSettingsController.prototype, {
    $container: null,
    shopMallNo: $('input[name="mallNo"]').val(),
    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$form                    = me.$container.find('#form-point-settings-mall');
        me.$btnSave                 = me.$container.find('#btn-save');
        me.$btnCancel               = me.$container.find('#btn-cancel');

        me.initFormValidation();
        me.initEventHandlers();
    },


    initFormValidation: function() {
        var me = this;

        me.$form.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'pointUseAmount': {
                    row: '.input-size-medium',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        },
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'pointUsePercent': {
                    row: '.input-size-small',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        },
                        between: {
                            min: 1,
                            max: 100,
                            message: mugrunApp.getMessage('common.validation.field.number.between', {min: 1, max : 100})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'pointSavePercent': {
                    row: '.input-size-small',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        },
                        between: {
                            min: 1,
                            max: 100,
                            message: mugrunApp.getMessage('common.validation.field.number.between', {min: 1, max : 100})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                }
            }
        })// Showing only one message each time
            .on('err.validator.fv', function(e, data) {
                // $(e.target)    --> The field element
                // data.fv        --> The FormValidation instance
                // data.field     --> The field name
                // data.element   --> The field element
                // data.validator --> The current validator name

                data.element
                    .data('fv.messages')
                    // Hide all the messages
                    .find('.help-block[data-fv-for="' + data.field + '"]').hide()
                    // Show only message associated with current validator
                    .filter('[data-fv-validator="' + data.validator + '"]').show();
            });
    },

    initEventHandlers: function() {
        var me = this;

        me.$btnSave.on('click', function (e) {
            e.preventDefault();
            var formValidation = me.$form.data('formValidation');
            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else{
                me.submitForm();
            }
        });

        me.$btnCancel.on('click', function (e) {
            e.preventDefault();
            me.resetShopMallData();
        });


        me.$form.on('change', 'input[name="pointUseLimitYn"]',function(e){
            e.preventDefault();
            if(this.value == 1){
                me.$form.find('input[name=pointUseAmount]').removeAttr('disabled');
                me.$form.find('input[name=pointUsePercent]').removeAttr('disabled');
                me.$form.formValidation('enableFieldValidators', 'pointUseAmount', true);
                me.$form.formValidation('enableFieldValidators', 'pointUsePercent', true);
            } else if(this.value == 0){
                me.$form.find('input[name=pointUseAmount]').val('');
                me.$form.find('input[name=pointUsePercent]').val('');
                me.$form.formValidation('enableFieldValidators', 'pointUseAmount', false);
                me.$form.formValidation('enableFieldValidators', 'pointUsePercent', false);
                me.$form.formValidation('revalidateField', 'pointUseAmount');
                me.$form.formValidation('revalidateField', 'pointUsePercent');
                me.$form.find('input[name=pointUseAmount]').attr('disabled', true);
                me.$form.find('input[name=pointUsePercent]').attr('disabled', true);
            }
        });

        me.$form.on('change', 'input[name="pointSaveYn"]',function(e){
            e.preventDefault();
            if(this.value == 1){
                me.$form.find('input[name=pointSavePercent]').removeAttr('disabled');
                me.$form.formValidation('enableFieldValidators', 'pointSavePercent', true);
            } else if(this.value == 0){
                me.$form.find('input[name=pointSavePercent]').val('');
                me.$form.formValidation('enableFieldValidators', 'pointSavePercent', false);
                me.$form.formValidation('revalidateField', 'pointSavePercent');
                me.$form.find('input[name=pointSavePercent]').attr('disabled', true);
            }
        });

        me.bindFieldOnlyNumber('pointUseAmount');
        me.bindFieldOnlyNumber('pointUsePercent');
        me.bindFieldOnlyNumber('pointSavePercent');

    },

    submitForm: function() {
        var me = this;
        var oldMallNo = me.getMallNo();
        var data = {};

        data['companyName']				=	shopMallProductController.shopMallData.companyName;
        data['businessNo']				=	shopMallProductController.shopMallData.businessNo;
        data['ceoName']					=	shopMallProductController.shopMallData.ceoName;
        data['saleRegisterNo']			=	shopMallProductController.shopMallData.saleRegisterNo;
        data['businessCategory']		=	shopMallProductController.shopMallData.businessCategory;
        data['businessItem']			=	shopMallProductController.shopMallData.businessItem;
        data['zipcode']					=	shopMallProductController.shopMallData.zipcode;
        data['address']					=	shopMallProductController.shopMallData.address;
        data['subAddress']				=	shopMallProductController.shopMallData.subAddress;
        data['phoneNo']					=	shopMallProductController.shopMallData.phoneNo;
        data['faxNo']					=	shopMallProductController.shopMallData.faxNo;
        data['companyEmail']			=	shopMallProductController.shopMallData.companyEmail;
        data['consultPhoneNo']			=	shopMallProductController.shopMallData.consultPhoneNo;
        data['consultFaxNo']			=	shopMallProductController.shopMallData.consultFaxNo;
        data['consultEmail']			=	shopMallProductController.shopMallData.consultEmail;
        data['workStartTime']			=	shopMallProductController.shopMallData.workStartTime;
        data['workEndTime']				=	shopMallProductController.shopMallData.workEndTime;
        data['guideContent']			=	shopMallProductController.shopMallData.guideContent;
        data['deliveryCompanyName']		=	shopMallProductController.shopMallData.deliveryCompanyName;
        data['deliveryCompanyUrl']		=	shopMallProductController.shopMallData.deliveryCompanyUrl;
        data['basicDeliveryFee']		=	shopMallProductController.shopMallData.basicDeliveryFee;
        data['basicPaymentAmount']		=	shopMallProductController.shopMallData.basicPaymentAmount;

        me.$form.serializeArray().map(function(item) {
            var value = item.value;
            if (data[item.name]) {
                if (typeof(data[item.name]) === "string" ) {
                    data[item.name] = [data[item.name]];
                }
                data[item.name].push(value);
            } else {
                data[item.name] = value;
            }
        });

        $.ajax({
            url: '/admin/shop/mall/submit.json',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(response) {
                if(response.success) {
                    shopMallProductController.shopMallData = response.data;
                    me.shopMallNo = response.data.mallNo;
                    mugrunApp.alertMessage('저장되었습니다.');
                    if(oldMallNo == 0) {
                        shopMallProductController.refreshMallNoAll(me.shopMallNo);
                        categoryTreeController.load(me.shopMallNo);
                        shopProductController.reloadProductList();
                    }
                }else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$btnSave.prop('disabled', true);
            },
            complete: function () {
                me.$btnSave.prop('disabled', false);
            }
        });
    },

    bindFieldOnlyNumber: function(fieldName) {
        var me = this;
        me.$form.find('input[name="'+fieldName+'"]').keypress(function(e) {
            mugrunApp.onlyNumber(e);
        });
    },

    getMallNo: function() {
        var me = this;
        if($.trim(me.shopMallNo) != '' && me.shopMallNo > 0) {
            return me.shopMallNo;
        }
        return 0;
    },

    resetShopMallData: function(){
        var me = this;
        // reset all radio button
        me.$form.find('input[name="pointPaymentYn"]').closest('span').removeClass('checked');
        me.$form.find('input[name="pointPaymentYn"]').attr('checked', false);

        me.$form.find('input[name="pointUseLimitYn"]').closest('span').removeClass('checked');
        me.$form.find('input[name="pointUseLimitYn"]').attr('checked', false);

        me.$form.find('input[name="pointSaveYn"]').closest('span').removeClass('checked');
        me.$form.find('input[name="pointSaveYn"]').attr('checked', false);


        if(shopMallProductController.shopMallData.pointPaymentYn == 1){
            me.$form.find('input[name="pointPaymentYn"]')[0].click();
        } else if(shopMallProductController.shopMallData.pointPaymentYn == 0){
            me.$form.find('input[name="pointPaymentYn"]')[1].click();
        }

        if(shopMallProductController.shopMallData.pointUseLimitYn == 1){
            me.$form.find('input[name="pointUseLimitYn"]')[0].click();
        } else if(shopMallProductController.shopMallData.pointUseLimitYn == 0){
            me.$form.find('input[name="pointUseLimitYn"]')[1].click();
        }

        if(shopMallProductController.shopMallData.pointSaveYn == 1){
            me.$form.find('input[name="pointSaveYn"]')[0].click();
        } else if(shopMallProductController.shopMallData.pointSaveYn == 0){
            me.$form.find('input[name="pointSaveYn"]')[1].click();
        }

        me.$form.find('input[name="pointUseAmount"]').val(shopMallProductController.shopMallData.pointUseAmount);
        me.$form.find('input[name="pointUsePercent"]').val(shopMallProductController.shopMallData.pointUsePercent);
        me.$form.find('input[name="pointSavePercent"]').val(shopMallProductController.shopMallData.pointSavePercent);


    }

});

