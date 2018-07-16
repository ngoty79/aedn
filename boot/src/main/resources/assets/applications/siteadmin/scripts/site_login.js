(function ($) {
    var LoginController = function (selector) {
        this.init(selector);
    };

    $.extend(LoginController.prototype, {
        $container: null,
        $loginForm: null,

        init: function (selector) {
            var me = this;
            me.$container = $(selector);
            me.$loginForm = me.$container.find('form.login-form');

            me.initUi();
            me.initFormValidation();
            me.initEventHandlers();
        },

        initUi: function() {
            $.backstretch([
                    "/assets/templates/admin/pages/media/bg/8.jpg"
                ], {
                    fade: 1000,
                    duration: 5000
                }
            );
        },

        initFormValidation: function() {
            var me = this;

            me.$loginForm.formValidation({
                framework: 'bootstrap',
                icon: {
                    //valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    'userId': {
                        row: '.form-group',
                        validators: {
                            notEmpty: {

                            }
                        }
                    },
                    'password': {
                        row: '.form-group',
                        validators: {
                            notEmpty: {

                            }
                        }
                    }
                }
            });
        },

        initEventHandlers: function() {
            var me = this;

            me.$loginForm.find('#btn-loginPage-login').click(function(e) {
                e.preventDefault();

                var formValidation = me.$loginForm.data('formValidation');

                formValidation.validate();
                if (!formValidation.isValid()) {
                    return;
                }

                formValidation.defaultSubmit();
            });

            me.$loginForm.find('input').keypress(function(e) {
                if (e.which == 13) {
                    var formValidation = me.$loginForm.data('formValidation');

                    formValidation.validate();
                    if (!formValidation.isValid()) {
                        return;
                    }

                    formValidation.defaultSubmit();
                }
            });
        }
    });

    new LoginController('#login-wrapper');
})(jQuery);