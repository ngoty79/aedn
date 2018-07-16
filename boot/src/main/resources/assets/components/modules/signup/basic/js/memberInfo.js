$( document ).ready(function() {
    var $userForm = $('#userForm'),
        $userUpdateForm = $('#form-update-user-info'),
        userNo = $(':hidden[name=userNo]').val();


    $userForm.on("keypress", function (e) {
        if ( e.which == 13 ) // Enter key = keycode 13
        {
            e.preventDefault();
        }
    });

    $("#searchZipcodeAdress").click(function (e) {
        e.preventDefault();
        new daum.Postcode({
            oncomplete: function(data) {
                $('input[name=zipcode]').val(data.zonecode);
                $('input[name=subAddress]').val(data.roadAddress);
                $userForm.formValidation('revalidateField', 'zipcode');
                $userForm.formValidation('revalidateField', 'subAddress');
            },
            width : '100%',
            height : '100%'
        }).open();

    });

    //combobox list email domain change
    $("select[name^=email3]").on("change", function() {
        var _val = $(this).val();
        var _field = $('input[name=emailRegion]');
        if(_val != ''){
            _field.val(_val);
            $userForm.formValidation('revalidateField', 'emailRegion');
        }
    });

    //build datepicker

    var checkCaptcha = function(callbackFn){
        $.ajax({
            type: "GET",
            url: '/site/view/signup/checkCaptcha.json',
            dataType: 'json',
            data: {
                jcaptcha : $('#jcaptcha').val()
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (res) {
                if (res.valid == true) {
                    $("#capchaMsg").hide();
                    callbackFn();
                } else {
                    $("#jcaptcha").val('');
                    $("#jcaptcha").addClass('error');
                    $("#jcaptcha").focus();
                    $("#capchaMsg").show();

                    $("#captchaImg").attr("src", "/captcha/captcha.do?dummy=" + (new Date().getTime()));
                    return;
                }
            },
            failure: function () {}
        });
    } ;

    var addOrUpdateUserInfo = function(){
        var formValidation = $userForm.data('formValidation');

        formValidation.validate();
        if (!formValidation.isValid()) {
            return;
        } else{
            if($('#jcaptcha').length>0){
                checkCaptcha(addUserInfo);
            } else {
                addUserInfo();
            }
        }
    }

    $('#addUserInfo').click(addOrUpdateUserInfo);

    $('#btn-modifyuser-update').click(addOrUpdateUserInfo);


    var addUserInfo = function(){
        buildUserInfo();
        var userData = $userUpdateForm.serializeObject();
        var $containerUserAddInfo = $('#container-add-info');
        if (additionalList.length > 0) {
            var newAddInfo = buildUserAddtionalInfo(additionalList, $containerUserAddInfo);
            userData.myAddInfo = newAddInfo;
        }
        if(userNo == ''){
            $('#addUserInfo').prop('disabled', true);
        }else{
            $('#btn-modifyuser-update').prop('disabled', true);
        }
        $.ajax({
            type: "POST",
            url: $userUpdateForm.attr('action'),
            data: JSON.stringify(userData),
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (resp) {
                if (resp.success == true) {
                    //create verification passing
                    if(userNo == ''){
                        var nextScene = $('#memeber-info-next-scene').val();
                        if(nextScene != '') {
                            var nextUrl = '?scene=' + nextScene;
                            if(nextScene == 'joinComplete'){
                                signupController.addStepInfoVerification('joinComplete', function () {
                                    window.location = nextUrl + '&userNo=' + resp.data;
                                });
                            } else {
                                window.location = nextUrl;
                            }
                        }
                    }else{
                        $('#btn-modifyuser-update').prop('disabled', false);
                        if($('#jcaptcha').length>0){
                            $('#jcaptcha').val('');
                            $('#btn-user-info-captcha').trigger('click');
                        }

                        siteApp.alertMessage(siteApp.getMessage("common.save.done"));
                    }
                }else{
                    siteApp.alertMessage(siteApp.getMessage("common.server.exception"));
                }
            }
        });
    };

    var buildUserInfo = function(){
        $userUpdateForm.find(':hidden[name="password"]').val($userForm.find('input[name="password"]').val());
        buildUserCommonInfo($userUpdateForm, $userForm);
    };

    var buildUserCommonInfo = function(formUpdate, formSource){
        if(userNo != ''){
            formUpdate.find(':hidden[name="userNo"]').val(formSource.find(':hidden[name="userNo"]').val());
        }

        formUpdate.find(':hidden[name="id"]').val(formSource.find(':text[name="id"]').val());
        formUpdate.find(':hidden[name="name"]').val(formSource.find(':text[name="name"]').val());
        formUpdate.find(':hidden[name="nickname"]').val(formSource.find(':text[name="nickname"]').val());
        var emailName = formSource.find(':text[name="emailName"]').val();
        var emailRegion = formSource.find(':text[name="emailRegion"]').val();
        formUpdate.find(':hidden[name="email"]').val(emailName + '@' + emailRegion);

        var tel1 = formSource.find('select[name="tel1"]').val();
        var tel2 = formSource.find('input[name="tel2"]').val();
        var tel3 = formSource.find('input[name="tel3"]').val();
        formUpdate.find(':hidden[name="tel"]').val(tel1 + '-' + tel2 + '-' + tel3);

        var yearBirthday = formSource.find('input[name="yearBirthday"]').val();
        var monthBirthday = formSource.find('input[name="monthBirthday"]').val();
        var dayBirthday = formSource.find('input[name="dayBirthday"]').val();
        formUpdate.find(':hidden[name="birthday"]').val(yearBirthday + '-' + monthBirthday + '-' + dayBirthday);

        formUpdate.find(':hidden[name="sex"]').val(formSource.find('input[name="sex"]:checked').val());

        var receiveTypes = [];
        var receiveEmail = formSource.find('input#chk_mail').is(':checked');
        if(receiveEmail) {
            receiveTypes.push('E');
        }
        var receiveSMS = formSource.find('input#chk_sms').is(':checked');
        if(receiveSMS) {
            receiveTypes.push('sms');
        }
        formUpdate.find(':hidden[name="receiveTypes"]').val(receiveTypes.join(','));

        formUpdate.find(':hidden[name="zipcode"]').val(formSource.find('input[name="zipcode"]').val());
        formUpdate.find(':hidden[name="address"]').val(formSource.find(':text[name="address"]').val());
        formUpdate.find(':hidden[name="subAddress"]').val(formSource.find(':text[name="subAddress"]').val());
    };

    var buildUserAddtionalInfo = function(userAddInfo, containerUserAddInfo){
        var result = [];
        for(var i = 0; i < userAddInfo.length; i++){
            var item = userAddInfo[i];
            if(item.itemType == 'text'){
                item.itemValue = containerUserAddInfo.find('input[name="' + item.itemType + item.itemNo + '"]').val()
            } else {
                item.itemValue = containerUserAddInfo.find('input[name="' + item.itemType + item.itemNo + '"]').text();
            }
            result.push(item);
        }
        return result;
    };

    initFormAdditionValidation = function() {
        var idValidator = {
            notEmpty: {
                message: siteApp.getMessage('common.validation.field.required')
            },
            stringLength: {
                max: 15,
                min: 6,
                message: siteApp.getMessage("component.module.regNamo.msg.userIdComplex")
            },
            regexp: {
                message: siteApp.getMessage("component.module.regNamo.msg.userIdComplex"),
                //regexp: /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9\.\_]+$/
                regexp: /^[a-zA-Z0-9]+$/
            },
            remote: {
                url: '/site/view/signup/checkUserID.json',
                type: "POST",
                data: function(validator, $field, value) {
                    return {
                        userId: value
                    }
                },
                delay: 500,
                message: siteApp.getMessage("component.module.regNamo.msg.invalidUserId")
            }
        };
        var passwordValidator = {
            notEmpty: {
                message: siteApp.getMessage('login.validation.password.required')
            },
            regexp: {
                message: siteApp.getMessage('msg.account.pass_rule'),
                regexp: /^[a-z\d!@#$%^&*()_+?=.]{4,15}$/i
            }
        };

        if(userNo != ''){
            idValidator = {};
            passwordValidator = {
                regexp: {
                    message: siteApp.getMessage('msg.account.pass_rule'),
                    regexp: /^[a-z\d!@#$%^&*()_+?=.]{4,15}$/i
                }
            };
        }

        var basicField = {
            name: {
                row: '.pt-col8',
                validators: {
                    notEmpty: {}
                }
            },
            'id': {
                row: '.pt-col8',
                validators: idValidator
            },
            'nickname': {
                row: '.pt-col8',
                validators: {
                    notEmpty: {
                        message: siteApp.getMessage('common.validation.field.required')
                    },
                    remote: {
                        url: '/site/view/signup/checkUserNickName.json?userNo=' + userNo,
                        type: "POST",
                        data: function(validator, $field, value) {
                            return {
                                userId: value
                            }
                        },
                        delay: 500,
                        message: siteApp.getMessage("component.module.regNamo.msg.invalidUserNickname")
                    }
                }
            },
            'password': {
                row: '.pt-col8',
                validators: passwordValidator
            },
            repassword:{
                row: '.pt-col8',
                validators: {
                    identical: {
                        message: siteApp.getMessage('msg.account.pass_confirm'),
                        field: "password"
                    }
                }
            },
            emailName: {
                row: '.email-name-message',
                validators: {
                    notEmpty: {}
                }
            },
            emailRegion: {
                row: '.email-region-message',
                validators: {
                    notEmpty: {}
                }
            },
            tel1: {
                row: '.tel1-message',
                validators: {
                    notEmpty: {},
                    stringLength: {
                        max: 4,
                        message: siteApp.getMessage('common.validation.field.allow.length', {value: 4})
                    },
                    greaterThan: {
                        value: 0,
                        message: siteApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                    },
                    integer: {
                        message: siteApp.getMessage('common.validation.field.integer')
                    }
                }
            },
            tel2: {
                row: '.tel2-message',
                validators: {
                    notEmpty: {},
                    stringLength: {
                        max: 4,
                        message: siteApp.getMessage('common.validation.field.allow.length', {value: 4})
                    },
                    greaterThan: {
                        value: 0,
                        message: siteApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                    },
                    integer: {
                        message: siteApp.getMessage('common.validation.field.integer')
                    }
                }
            },
            tel3: {
                row: '.tel3-message',
                validators: {
                    notEmpty: {},
                    stringLength: {
                        max: 4,
                        message: siteApp.getMessage('common.validation.field.allow.length', {value: 4})
                    },
                    greaterThan: {
                        value: 0,
                        message: siteApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                    },
                    integer: {
                        message: siteApp.getMessage('common.validation.field.integer')
                    }
                }
            },
            yearBirthday: {
                row: '.year-birthday-message',
                validators: {
                    notEmpty: {},
                    stringLength: {
                        max: 4,
                        min: 4,
                        message: siteApp.getMessage('common.validation.field.allow.length', {value: 4})
                    },
                    lessThan: {
                        value: new Date().getFullYear(),
                        message: siteApp.getMessage('common.validation.field.lessThanEqual', {value: new Date().getFullYear()}),
                        inclusive: true
                    },
                    integer: {
                        message: siteApp.getMessage('common.validation.field.integer')
                    }
                }
            },
            monthBirthday: {
                row: '.month-birthday-message',
                validators: {
                    notEmpty: {},
                    stringLength: {
                        max: 2,
                        min: 2,
                        message: siteApp.getMessage('common.validation.field.allow.length', {value: 2})
                    },
                    between: {
                        min: 1,
                        max: 12,
                        message: siteApp.getMessage('common.validation.field.number.between', {min: 1, max : 12})
                    },
                    integer: {
                        message: siteApp.getMessage('common.validation.field.integer')
                    }
                }
            },
            dayBirthday: {
                row: '.day-birthday-message',
                validators: {
                    notEmpty: {},
                    stringLength: {
                        max: 2,
                        min: 2,
                        message: siteApp.getMessage('common.validation.field.allow.length', {value: 2})
                    },
                    between: {
                        min: 1,
                        max: 'maxDayBirthday',
                        message: siteApp.getMessage('common.validation.field.number.between', {min: '%s', max : '%s'})
                    },
                    integer: {
                        message: siteApp.getMessage('common.validation.field.integer')
                    }
                }
            },
            maxDayBirthday: {
                row: '.pt-col8'
            },
            sex: {
                row: '.pt-col8',
                validators: {
                    notEmpty: {}
                }
            },
            zipcode: {
                row: '.pt-formset-multi.pt-formset-zipcode-input',
                validators: {
                    notEmpty: {}
                }
            },
            subAddress: {
                row: '.sub-address-message',
                validators: {
                    notEmpty: {}
                }
            },
            address: {
                row: '.address-message',
                validators: {
                    notEmpty: {}
                }
            },
            'receiveType[]': {
                row: '.pt-col8',
                validators: {
                    notEmpty: {
                    }
                }
            },
            'jcaptcha': {
                row: '.pt-formset-ctrlrow',
                validators: {
                    notEmpty: {
                    }
                }
            }
        };

        var addField = {};
        for(var i = 0; i < additionalList.length; i++){
            var item = additionalList[i];
            var name = item.itemType + item.itemNo;
            addField[name] = {};
            addField[name].row = '.pt-col8';
            if(item.requiredYn == 1 && item.itemType == 'text'){
                addField[name].validators = {};
                addField[name].validators.notEmpty = {};
            }
        };

        var allFields = $.extend({}, basicField, addField);

        $userForm.formValidation({
            framework: 'bootstrap',
            icon: {
                //valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: allFields
        })
        // Revalidate the dayBirthday field when changing the yearBirthday and monthBirthday
        .on('keyup', '[name="yearBirthday"], [name="monthBirthday"], [name="dayBirthday"]', function(e) {
            var maxDayBirthday = lastDayOfMonth($userForm);
            $userForm.find('input[name=maxDayBirthday]').val(maxDayBirthday);
            $userForm.formValidation('revalidateField', 'dayBirthday');
        })
        // Showing only one message each time
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
    };

    initFormAdditionValidation();

    var lastDayOfMonth = function(formUser) {
        var fv = formUser.data('formValidation');
        fv.validate();
        if(fv && fv.isValidField('yearBirthday') && fv.isValidField('monthBirthday')){
            var yearBirthday = fv.getFieldElements('yearBirthday').val();
            var monthBirthday = fv.getFieldElements('monthBirthday').val();
            return new Date( (new Date(yearBirthday, monthBirthday,1))-1 ).getDate();
        }
        return 31;
    };
})

