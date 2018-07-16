$( document ).ready(function() {
    var PasswordChangeController = function (selector) {
        this.init(selector);
    };

    $.extend(PasswordChangeController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);

            //values init
            me.userEn = me.$container.find('input#hdn-findId-userEn').val();
            me.memberType = me.$container.find('input#hdn-findId-memberType').val();

            //controls
            me.$formFindUserChangePassword = me.$container.find('#form-finduser-change-password');

            me.initUi();
            me.initEventHandlers();
        },

        initUi: function () {
            var me = this;

        },

        initEventHandlers: function () {
            var me = this;

            me.$formFindUserChangePassword.formValidation({
                framework: 'bootstrap',
                icon: {
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    'password': {
                        row: '.controls',
                        validators: {
                            notEmpty: {
                                message: siteApp.getMessage("module.validation.password.required")
                            },
                            regexp: {
                                message: siteApp.getMessage('module.account.pass_rule'),
                                regexp: /^(?=.*[a-z])(?=.*[!@#$%^&*()_+])(?=.*\d)[a-z\d!@#$%^&*()_+]{8,}$/i
                            }
                        }
                    },
                    'password_re': {
                        row: '.controls',
                        validators: {
                            notEmpty: {
                                message: siteApp.getMessage("module.validation.password.required")
                            },
                            identical: {
                                message: siteApp.getMessage('module.account.pass_confirm'),
                                field: "password"
                            }
                        }
                    }
                }
            });

            me.$formFindUserChangePassword.find('#btn-change-password').on('click', function (e) {
                e.preventDefault();

                var formValidation = me.$formFindUserChangePassword.data('formValidation');
                formValidation.validate();
                if (!formValidation.isValid()) {
                    return;
                } else {
                    me.changePassword();
                }
            });
        },

        changePassword: function () {
            var me = this;

            var params = {
                userEn: $("input[type=hidden][name=userNoEn]").val()
            };
            params.password = $("#pt-module-findid-pw-re").val();
            $.ajax({
                type: "POST",
                url: '/site/view/findid/changePassword',
                data: params,
                dataType: 'json',
                success: function (response) {
                    var data = response;
                    if (data.success == true) {
                        var nextUrl = me.$formFindUserChangePassword.attr("nextUrl");
                        nextUrl += "&a=" + $('#hdn-findId-userEn').attr('value');
                        nextUrl += "&memberType=" + $("input[type=hidden][name=memberType]").val();
                        window.location = nextUrl;
                    } else {
                        if (data.errorCode == "1") {
                            alert(siteApp.getMessage("module.findid.same_old_pwd"));
                        }
                    }
                },
                failure: function () {

                }
            });

        }

    });

    var passwordChangeController = new PasswordChangeController('#container-findId-passwordChange');

});