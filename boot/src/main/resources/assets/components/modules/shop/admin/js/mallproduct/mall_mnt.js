var ShopMallController = function (selector) {
    this.init(selector);
};

$.extend(ShopMallController.prototype, {
    $container: null,
    oEditors: [],
    shopMallNo: $('input[name="mallNo"]').val(),

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$form                    = me.$container.find('#form-mallproduct-mall');
        me.$btnSave                 = me.$container.find('#btn-save');
        me.$hdnGuideContent         = me.$container.find('#hdn-shopmall-guideContent');

        me.initUi();
        me.initFormValidation();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;

        me.getSmartEditor("txt-shopmall-guideContent", me.$hdnGuideContent.html());
        me.$hdnGuideContent.empty();
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
                'companyName': {
                    row: '.form-group',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        }
                    }
                },
                'ceoName': {
                    row: '.form-group',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        }
                    }
                },
                'consultEmail': {
                    row: '.form-group',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        }
                    }
                },
                'deliveryCompanyUrl': {
                    row: '.form-group',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        }
                    }
                },
                'saleRegisterNo': {
                    row: '.form-group',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        }
                    }
                },
                'businessNo': {
                    row: '.form-group',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        }
                    }
                },
                'businessItem': {
                    row: '.form-group',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        }
                    }
                },
                /*'businessNoValidator': {
                    row: '.form-group',
                    excluded: false,
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        }
                    }
                },*/
                'consultPhoneNoValidator': {
                    row: '.controls',
                    excluded: false,
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        }
                    }
                },
                'consultFaxNoValidator': {
                    row: '.controls',
                    excluded: false,
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        }
                    }
                },
                'workStartTime1': {
                    row: '.form-group',
                    validators: {
                        lessThan: {
                            value: 23,
                            message: mugrunApp.getMessage('common.validation.field.lessThanEqual', {value:23})
                        },
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value:0})
                        }
                    }
                },
                'workStartTime2': {
                    row: '.controls',
                    validators: {
                        lessThan: {
                            value: 59,
                            message: mugrunApp.getMessage('common.validation.field.lessThanEqual', {value:59})
                        },
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value:0})
                        }
                    }
                },
                'workEndTime1': {
                    row: '.controls',
                    validators: {
                        lessThan: {
                            value: 23,
                            message: mugrunApp.getMessage('common.validation.field.lessThanEqual', {value:23})
                        },
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value:0})
                        }
                    }
                },
                'workEndTime2': {
                    row: '.controls',
                    validators: {
                        lessThan: {
                            value: 59,
                            message: mugrunApp.getMessage('common.validation.field.lessThanEqual', {value:59})
                        },
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value:0})
                        }
                    }
                },
                'consultPhoneNo1': {
                    row: '.input-size-small',
                    validators: {
                        stringLength: {
                            max: 3,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 3})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'consultPhoneNo2': {
                    row: '.input-size-small',
                    validators: {
                        stringLength: {
                            max: 4,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 4})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'consultPhoneNo3': {
                    row: '.input-size-medium',
                    validators: {
                        stringLength: {
                            max: 4,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 4})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'consultFaxNo1': {
                    row: '.input-size-small',
                    validators: {
                        stringLength: {
                            max: 3,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 3})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'consultFaxNo2': {
                    row: '.input-size-small',
                    validators: {
                        stringLength: {
                            max: 4,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 4})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'consultFaxNo3': {
                    row: '.input-size-medium',
                    validators: {
                        stringLength: {
                            max: 4,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 4})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'phoneNo1': {
                    row: '.input-size-small',
                    validators: {
                        stringLength: {
                            max: 3,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 3})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'phoneNo2': {
                    row: '.input-size-small',
                    validators: {
                        stringLength: {
                            max: 4,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 4})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'phoneNo3': {
                    row: '.input-size-small',
                    validators: {
                        stringLength: {
                            max: 4,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 4})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'faxNo1': {
                    row: '.input-size-small',
                    validators: {
                        stringLength: {
                            max: 3,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 3})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'faxNo2': {
                    row: '.input-size-small',
                    validators: {
                        stringLength: {
                            max: 4,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 4})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'faxNo3': {
                    row: '.input-size-small',
                    validators: {
                        stringLength: {
                            max: 4,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 4})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'basicDeliveryFee': {
                    row: '.controls',
                    validators: {
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'basicPaymentAmount': {
                    row: '.controls',
                    validators: {
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                }
                /*'businessNo1': {
                    row: '.controls',
                    validators: {
                        stringLength: {
                            max: 3,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 3})
                        }
                    }
                },
                'businessNo2': {
                    row: '.controls',
                    validators: {
                        stringLength: {
                            max: 2,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 2})
                        }
                    }
                },
                'businessNo3': {
                    row: '.controls',
                    validators: {
                        stringLength: {
                            max: 5,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 5})
                        }
                    }
                }*/
            }
        });
    },

    initEventHandlers: function() {
        var me = this;

        me.$form.on('click', 'button#btn-search-address', function (e) {
            e.preventDefault();
            var zipcode = me.$form.find("input[name=zipcode]");
            var subAddress = me.$form.find("input[name=subAddress]");
            new daum.Postcode({
                oncomplete: function(data) {
                    zipcode.val(data.zonecode);
                    subAddress.val(data.roadAddress);
                },
                width : '100%',
                height : '100%'
            }).open();
        });

        me.$btnSave.on('click', function (e) {
            e.preventDefault();
            /*me.validateGroupFields('businessNo', 3);*/
            me.validateGroupFields('consultPhoneNo', 3);
            me.validateGroupFields('consultFaxNo', 3);
            var formValidation = me.$form.data('formValidation');
            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else{
                me.submitForm();
            }
        });

        /*me.onChangeGroupFieldValidation('businessNo', 3);*/
        me.onChangeGroupFieldValidation('consultPhoneNo', 3);
        me.onChangeGroupFieldValidation('consultFaxNo', 3);

        me.bindFieldOnlyNumber('phoneNo1');
        me.bindFieldOnlyNumber('phoneNo2');
        me.bindFieldOnlyNumber('phoneNo3');

        me.bindFieldOnlyNumber('faxNo1');
        me.bindFieldOnlyNumber('faxNo2');
        me.bindFieldOnlyNumber('faxNo3');

        me.bindFieldOnlyNumber('consultPhoneNo1');
        me.bindFieldOnlyNumber('consultPhoneNo2');
        me.bindFieldOnlyNumber('consultPhoneNo3');

        me.bindFieldOnlyNumber('consultFaxNo1');
        me.bindFieldOnlyNumber('consultFaxNo2');
        me.bindFieldOnlyNumber('consultFaxNo3');

        me.bindFieldOnlyNumber('workStartTime1');
        me.bindFieldOnlyNumber('workStartTime2');

        me.bindFieldOnlyNumber('workEndTime1');
        me.bindFieldOnlyNumber('workEndTime2');

        me.bindFieldOnlyNumber('basicDeliveryFee');
        me.bindFieldOnlyNumber('basicPaymentAmount');

    },

    getSmartEditor: function(elementId, content) {
        var me = this;
        if(me.oEditors.length == 0 || $(me.oEditors.getById[elementId]).length == 0) {
            nhn.husky.EZCreator.createInIFrame({
                oAppRef: me.oEditors,
                elPlaceHolder: elementId,
                sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2",
                htParams : {
                    bUseToolbar : true
                },
                fOnAppLoad : function(){
                    me.oEditors.getById[elementId].setIR(content);
                }
            });
        }else{
            me.oEditors.getById[elementId].setIR(content);
        }
    },

    submitForm: function() {
        var me = this;
        var oldMallNo = me.getMallNo();
        var data = {};
        /*data['businessNo']          = me.joinValueFields('businessNo', 3, '-');*/
        data['zipcode']             = me.$form.find('input[name=zipcode]').val();
        data['phoneNo']             = me.joinValueFields('phoneNo', 3, '-');
        data['faxNo']               = me.joinValueFields('faxNo', 3, '-');
        data['consultPhoneNo']      = me.joinValueFields('consultPhoneNo', 3, '-');
        data['consultFaxNo']        = me.joinValueFields('consultFaxNo', 3, '-');
        data['workStartTime']       = me.joinValueFields('workStartTime', 2, ':', 2);
        data['workEndTime']         = me.joinValueFields('workEndTime', 2, ':', 2);
        data['guideContent']        = me.oEditors.getById["txt-shopmall-guideContent"].getIR();
        data['pointPaymentYn']      = shopMallProductController.shopMallData.pointPaymentYn;
        data['pointUseLimitYn']     = shopMallProductController.shopMallData.pointUseLimitYn;
        data['pointUseAmount']      = shopMallProductController.shopMallData.pointUseAmount;
        data['pointUsePercent']     = shopMallProductController.shopMallData.pointUsePercent;
        data['pointSaveYn']         = shopMallProductController.shopMallData.pointSaveYn;
        data['pointSavePercent']    = shopMallProductController.shopMallData.pointSavePercent;

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

    joinValueFields: function(fieldName, fieldNum, joinChar, pad) {
        var me = this;
        var values = [];
        for(var i=1; i<fieldNum+1; i++) {
            if(pad) {
                values.push(Number($.trim(me.$form.find('input[name="'+fieldName+i+'"]').val())).pad(pad));
            }else{
                values.push($.trim(me.$form.find('input[name="'+fieldName+i+'"]').val()));
            }
        }
        return values.join(joinChar);
    },

    validateGroupFields: function(fieldName, fieldNum) {
        var me = this;
        var rs = true;
        for(var i=1; i<fieldNum+1; i++) {
            if($.trim(me.$form.find('input[name="'+fieldName+i+'"]').val()) == ''){
                rs = false;
                break;
            }
        }
        if(rs){
            me.$form.find('input[name="'+fieldName+'Validator"]').val(true);
        }else{
            me.$form.find('input[name="'+fieldName+'Validator"]').val('');
        }
        me.$form.formValidation('revalidateField', fieldName+'Validator');
    },

    onChangeGroupFieldValidation: function(fieldName, fieldNum) {
        var me = this;
        for(var i=1; i<fieldNum+1; i++) {
            me.$form.find('input[name="'+fieldName+i+'"]')
                .unbind('change')
                .change(function(e) {
                    me.validateGroupFields(fieldName, fieldNum) ;
                });
        }
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
    }

});

