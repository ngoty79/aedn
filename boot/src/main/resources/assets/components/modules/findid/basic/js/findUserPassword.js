$( document ).ready(function() {
    var FindUserPasswordController = function (selector) {
        this.init(selector);
    };

    $.extend(FindUserPasswordController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);

            //values
            me.findPwMethod = me.$container.find('input#hdn-findId-findPwMethod').val();
            me.findMethodPhone = me.$container.find('input#hdn-findId-findMethodPhone').val();
            me.findMethodEmail = me.$container.find('input#hdn-findId-findMethodEmail').val();
            me.iVerificationMethodPhone = me.$container.find('input#hdn-findId-iVerificationMethodPhone').val();
            me.iVerificationMethodIpin = me.$container.find('input#hdn-findId-iVerificationMethodIpin').val();
            me.smsCertInfo_callUrl = me.$container.find('input#hdn-findId-smsCertInfo-callUrl').val();
            me.smsCertInfo_certCompCd = me.$container.find('input#hdn-findId-smsCertInfo-certCompCd').val();
            me.smsCertInfo_sEncData = me.$container.find('input#hdn-findId-smsCertInfo-sEncData').val();
            me.memberType = me.$container.find('input#hdn-findId-memberType').val();

            //controls
            me.$sectionMemberInfoEditor = me.$container.find('#section-findId-memberInfoEditor');
            me.$btnFindUserId = me.$container.find('a#btn-findUserId');
            me.$btnFindUserPassword = me.$container.find('a#btn-findUserPassword');
            me.$btnFindIdDisplayInfo = me.$container.find('#btn-findId-displayInfo');
            me.$btnFindIdCertification = me.$container.find('#btn-findId-certification');

            me.initUi();
            me.initEventHandlers();
        },

        initFormValidation: function() {
            var me = this;
            var $form = me.$container.find('#findUser-namo-form-find-password');
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
                        'id': {
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
                        'email_account': {
                            row: '.show-error-mail-message',
                            validators: {
                                notEmpty: {
                                }
                            }
                        },
                        'email_domain': {
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

            if (me.findPwMethod.indexOf(me.iVerificationMethodPhone) != -1 || me.findPwMethod.indexOf(me.iVerificationMethodIpin) != -1) {
                var params = {};
                params['isIVerificationMethodPhone'] = me.findPwMethod.indexOf(me.iVerificationMethodPhone) != -1 ? true : false;
                params['isIVerificationMethodIpin'] = me.findPwMethod.indexOf(me.iVerificationMethodIpin) != -1 ? true : false;
                me.$container.find('#section-findId-identityVerificationEditor').empty().append(
                    $.tmpl(me.$container.find('#tmpl-findId-identityVerificationEditor').html(), params)
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
                if (me.findPwMethod.indexOf(me.findMethodEmail) != -1 || me.findPwMethod.indexOf(me.findMethodPhone) != -1) {
                    var params = {};
                    params['isFindMethodPhone'] = me.findPwMethod.indexOf(me.findMethodPhone) != -1 ? true : false;
                    params['isFindMethodEmail'] = me.findPwMethod.indexOf(me.findMethodEmail) != -1 ? true : false;
                    me.$container.find('#section-findId-memberInfoEditor').empty().append(
                        $.tmpl(me.$container.find('#tmpl-findId-memberInfoEditor').html(), params)
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
                    "param_r1": "/site/findid?scene=passwordChange",
                    "param_r2": "",
                    "param_r3": ""
                };
                commonController.fnSmsCertPopup(me.smsCertInfo_callUrl, me.smsCertInfo_certCompCd, paramForm);
            });

        },

        buildEventForm: function () {
            var me = this;

            $('#pt-module-findid-email-select').change(function () {
                var text = $(this).val();
                if (text == "0") {
                    //$('#pt-module-findid-email-domain').prop('disabled', false);
                    $('#pt-module-findid-email-domain').val('');
                } else {
                    //$('#pt-module-findid-email-domain').prop('disabled', true);
                    $('#pt-module-findid-email-domain').val(text);
                }
                // current it disabled => can't revalidate
                // comment disable above code
                var form = me.$container.find('#findUser-namo-form-find-password');
                form.formValidation('revalidateField', 'email_domain');
            });

            var el = $('#pt-findidNamo-findPwTab-finduser-phone');
            if (el.length) {
                $('#pt-findidNamo-findPwTab-finduser-email').hide();
                if ($("#pt-module-findid-email").is(":checked")) {
                    $('#pt-findidNamo-findPwTab-finduser-email').show();
                    $('#pt-findidNamo-findPwTab-finduser-phone').hide();
                    if ($("#pt-module-findid-email-select").val() != "0") {
                        $("#pt-module-findid-email-domain").val($("#pt-module-findid-email-select").val());
                        $("#pt-module-findid-email-domain").prop("disable", true)
                    }
                }
            } else {
                $('input[type=radio][name=info]').attr('checked', true);
            }
            $('#pt-module-findid-phone').click(function () {
                $('#pt-findidNamo-findPwTab-finduser-phone').show();
                $('#pt-findidNamo-findPwTab-finduser-email').hide();
            });
            $('#pt-module-findid-email').click(function () {
                $('#pt-findidNamo-findPwTab-finduser-email').show();
                $('#pt-findidNamo-findPwTab-finduser-phone').hide();
            })


            $("input[inputFormat=number]").each(function (index) {
                $(this).keydown(function (event) {
                    var text = $(this).val();
                    var n = text.length;
                    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
                            // Allow: Ctrl+A
                        (event.keyCode == 65 && event.ctrlKey === true) ||
                            // Allow: home, end, left, right
                        (event.keyCode >= 35 && event.keyCode <= 39)) {
                        // let it happen, don't do anything
                        return;
                    }
                    else {
                        // Ensure that it is a number and stop the keypress
                        if (n >= 4) return false;
                        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                            event.preventDefault();
                        }
                    }
                });
            });

            $("input[type=text]").on("keypress", function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    me.findUserPw();
                }
            });

            var $btnSearchPw = me.$sectionMemberInfoEditor.find("#bt-search-password");
            if ($btnSearchPw.length > 0) {
                $btnSearchPw.on('click', function (e) {
                    e.preventDefault();
                    me.findUserPw();
                });
            }
        },

        findUserPw: function () {
            var me = this;

            var form = me.$container.find('#findUser-namo-form-find-password');
            var formValidation = form.data('formValidation');

            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else {
                var params = {
                    userName: $.trim($("input[name=name]:visible").val()),
                    userId: $.trim($("input[name=id]:visible").val())
                };
                if ($("#pt-findidNamo-findPwTab-finduser-phone").length == 0 || $("#pt-findidNamo-findPwTab-finduser-phone").is(':hidden')) {
                    params.email = $.trim($("input[name=email_account]").val()) + "@" + $.trim($("input[name=email_domain]").val());
                } else {
                    params.userPhone = $("select[name=phone1]").val() + '-' + $("input[name=phone2]").val() + '-' + $("input[name=phone3]").val();
                }
                $.ajax({
                    type: "POST",
                    url: '/site/view/findid/findPw',
                    data: params,
                    dataType: 'json',
                    success: function (response) {
                        var data = response.data;
                        var nextUrl = $("#bt-search-password").attr('nextUrl');
                        nextUrl = nextUrl + "&a=" + data.userNoEn;
                        nextUrl += "&memberType=" + me.memberType;
                        window.location = nextUrl;
                    },
                    failure: function () {

                    }
                });
            }
        }

    });

    var findUserPasswordController = new FindUserPasswordController('#container-findId-findUserPassword');

});