$( document ).ready(function() {
    var FindUserIdController = function (selector) {
        this.init(selector);
    };

    $.extend(FindUserIdController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);

            //values init
            me.findIdMethod = me.$container.find('input#hdn-findId-findIdMethod').val();
            me.findMethodPhone = me.$container.find('input#hdn-findId-findMethodPhone').val();
            me.findMethodEmail = me.$container.find('input#hdn-findId-findMethodEmail').val();
            me.iVerificationMethodPhone = me.$container.find('input#hdn-findId-iVerificationMethodPhone').val();
            me.iVerificationMethodIpin = me.$container.find('input#hdn-findId-iVerificationMethodIpin').val();
            me.smsCertInfo_callUrl = me.$container.find('input#hdn-findId-smsCertInfo-callUrl').val();
            me.smsCertInfo_certCompCd = me.$container.find('input#hdn-findId-smsCertInfo-certCompCd').val();
            me.smsCertInfo_sEncData = me.$container.find('input#hdn-findId-smsCertInfo-sEncData').val();

            //controls
            me.$btnFindUserId = me.$container.find('a#btn-findUserId');
            me.$btnFindUserPassword = me.$container.find('a#btn-findUserPassword');
            me.$btnFindIdDisplayInfo = me.$container.find('#btn-findId-displayInfo');
            me.$btnFindIdCertification = me.$container.find('#btn-findId-certification');

            me.initUi();
            me.initEventHandlers();
        },

        initFormValidation: function() {
            var me = this;
            var $form = me.$container.find('#pt-findUserNamo-form-find-id');
            if ($form.length > 0) {
                $form.formValidation({
                    framework: 'bootstrap',
                    icon: {
                        //valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        'name': {
                            row: '.pt-col8',
                            validators: {
                                notEmpty: {
                                }
                            }
                        },
                        'phone2': {
                            row: '.show-error-phone-message',
                            validators: {
                                notEmpty: {
                                },
                                stringLength: {
                                    max: 4,
                                    min: 4,
                                    message: mugrunApp.getMessage('common.validation.field.allow.length', {value: 4})
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
                        'phone3': {
                            row: '.show-error-phone-message',
                            validators: {
                                notEmpty: {
                                },
                                stringLength: {
                                    max: 4,
                                    min: 4,
                                    message: mugrunApp.getMessage('common.validation.field.allow.length', {value: 4})
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
                        'email1': {
                            row: '.show-error-mail-message',
                            validators: {
                                notEmpty: {
                                }
                            }
                        },
                        'email2': {
                            row: '.show-error-mail-message',
                            validators: {
                                notEmpty: {
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
            }
        },

        initUi: function () {
            var me = this;

            if (me.findIdMethod.indexOf(me.iVerificationMethodPhone) != -1 || me.findIdMethod.indexOf(me.iVerificationMethodIpin) != -1) {
                var params = {};
                params['isIVerificationMethodPhone'] = me.findIdMethod.indexOf(me.iVerificationMethodPhone) != -1 ? true : false;
                params['isIVerificationMethodIpin'] = me.findIdMethod.indexOf(me.iVerificationMethodIpin) != -1 ? true : false;
                me.$container.find('#section-findId-authenMethodSelection').empty().append(
                    $.tmpl(me.$container.find('#tmpl-findId-authenMethodSelection').html(), params)
                );
            }
        },

        initEventHandlers: function () {
            var me = this;

            me.$btnFindUserId.on('click', function (e) {
                e.preventDefault();
                window.location.href = "/site/findid?scene=findUserId";
            });

            me.$btnFindUserPassword.on('click', function (e) {
                e.preventDefault();
                window.location.href = "/site/findid?scene=findUserPassword";
            });

            me.$btnFindIdDisplayInfo.on('click', function (e) {
                e.preventDefault();
                if (me.findIdMethod.indexOf(me.findMethodEmail) != -1 || me.findIdMethod.indexOf(me.findMethodPhone) != -1) {
                    var params = {};
                    params['isFindMethodPhone'] = me.findIdMethod.indexOf(me.findMethodPhone) != -1 ? true : false;
                    params['isFindMethodEmail'] = me.findIdMethod.indexOf(me.findMethodEmail) != -1 ? true : false;
                    me.$container.find('#section-findId-infoInput').empty().append(
                        $.tmpl(me.$container.find('#tmpl-findId-infoInput').html(), params)
                    );
                    me.buildEventForm();
                    me.initFormValidation();
                }
            });

            me.$btnFindIdCertification.on('click', function (e) {
                e.preventDefault();
                var paramForm = {
                    "m": "checkplusSerivce",
                    "EncodeData": me.smsCertInfo_sEncData,
                    "param_r1": "/site/findid?scene=findFullId",
                    "param_r2": "",
                    "param_r3": ""
                };
                commonController.fnSmsCertPopup(me.smsCertInfo_callUrl, me.smsCertInfo_certCompCd, paramForm);
            });

        },

        buildEventForm: function () {
            var me = this;

            var $email3 = me.$container.find('#pt-module-formset-email3-choose');
            if ($email3.length > 0) {
                var $email2 = me.$container.find('#pt-module-formset-email2');
                $email3.change(function () {
                    var text = $(this).val();
                    if (text == "0") {
                        //$email2.prop('disabled', false);
                        $email2.val('');
                    } else {
                        //$email2.prop('disabled', true);
                        $email2.val(text);
                    }
                    // current it disabled => can't revalidate
                    // comment disable above code
                    var form = me.$container.find('#pt-findUserNamo-form-find-id');
                    form.formValidation('revalidateField', 'email2');
                });
            }

            var $FindIdTabFinduserPhone = me.$container.find('#pt-findidNamo-findIdTab-finduser-phone');
            if ($FindIdTabFinduserPhone.length > 0) {
                me.$container.find('#pt-findidNamo-findIdTab-finduser-email').hide();
                if (me.$container.find("#pt-module-findid-email").is(":checked")) {
                    me.$container.find('#pt-findidNamo-findIdTab-finduser-email').show();
                    me.$container.find('#pt-findidNamo-findIdTab-finduser-phone').hide();
                    if (me.$container.find("#pt-module-formset-email3-choose").val() != "0") {
                        me.$container.find("#pt-module-formset-email2").val(me.$container.find("#pt-module-formset-email3-choose").val());
                        me.$container.find("#pt-module-formset-email2").prop("disable", true)
                    }
                }
            } else {
                me.$container.find('input[type=radio][name=info]').attr('checked', true);
            }

            var $phone = me.$container.find('#pt-module-findid-phone');
            if ($phone.length > 0) {
                $phone.click(function () {
                    me.$container.find('#pt-findidNamo-findIdTab-finduser-phone').show();
                    me.$container.find('#pt-findidNamo-findIdTab-finduser-email').hide();
                });
            }

            var $email = me.$container.find('#pt-module-findid-email');
            $email.click(function () {
                me.$container.find('#pt-findidNamo-findIdTab-finduser-email').show();
                me.$container.find('#pt-findidNamo-findIdTab-finduser-phone').hide();
            });

            me.$container.find("input[type=text]").on("keypress", function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    me.findUserID();
                }
            });

            var $btnSearchId = me.$container.find("#btn_search_id");
            if ($btnSearchId.length > 0) {
                $btnSearchId.on('click', function (e) {
                    e.preventDefault();
                    me.findUserID();
                });
            }

        },

        findUserID: function () {
            var me = this;

            var form = me.$container.find('#pt-findUserNamo-form-find-id');
            var formValidation = form.data('formValidation');

            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else {

                var params = {
                    userName: $.trim($("input[name=name]:visible").val())
                };
                if (me.$container.find("#pt-findidNamo-findIdTab-finduser-phone").length == 0 || me.$container.find("#pt-findidNamo-findIdTab-finduser-phone").is(':hidden')) {
                    params.email = $.trim(me.$container.find("input[name=email1]").val()) + "@" + $.trim(me.$container.find("input[name=email2]").val());
                } else {
                    params.userPhone = me.$container.find("select[name=phone1]").val() + '-' + me.$container.find("input[name=phone2]").val() + '-' + me.$container.find("input[name=phone3]").val();
                }
                $.ajax({
                    type: "POST",
                    url: '/site/view/findid/findId',
                    data: params,
                    success: function (response) {
                        var nextUrl = me.$container.find("#btn_search_id").attr('nextUrl');
                        window.location = nextUrl;
                    },
                    failure: function () {

                    }
                });
            }
        }

    });

    var findUserIdController = new FindUserIdController('#container-findId-findUserId');

});