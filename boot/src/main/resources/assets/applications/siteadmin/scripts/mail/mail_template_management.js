(function($) {
    var MAIL_TEMPLATE_SIGNUP = "SIGNUP";
    var MAIL_TEMPLATE_SIGNUP_CLOSE = "SIGNUPCLOSE";
    var MAIL_TEMPLATE_FIND_ID = "FINDID";
    var MAIL_TEMPLATE_FIND_PASSWORD = "FINDPASS";
    var MAIL_TEMPLATE_SMS = "SMS";

    var MailTemplateManagementController = function (selector) {
        this.init(selector);
    };

    $.extend(MailTemplateManagementController.prototype, {
        $container: null,
        oEditors: [],

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$form                    = me.$container.find("#form-mailSignup");
            me.$btnSave                 = me.$form.find("#btn-mailSignup-save");
            me.$btnCancel               = me.$form.find("#btn-mailSignup-cancel");
            me.templateType             = me.$form.find('input[name=templateType]').val();
            if($.trim(me.templateType) != '') {
                me.templateType = $.trim(me.templateType).toUpperCase();
            }

            me.initUi();
            me.initFormValidation();
            me.initEventHandlers();

        },

        initUi: function() {
            var me = this;

        },

        initSmartEditor: function() {
            var me = this;

            nhn.husky.EZCreator.createInIFrame({
                oAppRef: me.oEditors,
                elPlaceHolder: 'txt-mailTemplate-mailContent',
                sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2",
                htParams : {
                    bUseToolbar : true
                },
                fOnAppLoad : function(){
                    me.loadDataForm();
                }
            });
        },

        initEventHandlers: function() {
            var me = this;

            me.$btnSave.click(function(e) {
                e.preventDefault();
                me.submitForm();
            });

            me.$btnCancel.click(function(e) {
                e.preventDefault();
                me.loadDataForm();

                var formValidation = me.$form.data('formValidation');
                var validator = formValidation.validate();
                validator.resetForm();//remove error class on name elements and clear history
            });

            if(MAIL_TEMPLATE_SMS == me.templateType) {
                me.loadDataForm();
            }else {
                me.initSmartEditor();
            }

        },

        loadDataForm: function() {
            var me = this;

            $.ajax({
                url: '/admin/mail/signup/loadMailTemplate.json',
                method: 'POST',
                dataType: 'json',
                data: {
                    templateType: me.templateType
                },
                success: function(response) {
                    me.setDataForm(response.data);

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
        },

        setDataForm: function(data) {
            var me = this;
            var templateType = data.templateType;
            if($.trim(templateType) != '') {
                templateType = $.trim(templateType).toUpperCase();
            }

            if(MAIL_TEMPLATE_SIGNUP == templateType || MAIL_TEMPLATE_FIND_ID == templateType || MAIL_TEMPLATE_FIND_PASSWORD == templateType) {
                me.$form.find("input[name=templateNo]").val(data.templateNo);
                me.$form.find("input[name=senderMail]").val(data.senderEmail);
                me.$form.find("input[name=mailSubject]").val(data.templateTitle);
                if(me.oEditors.length > 0 && $(me.oEditors.getById["txt-mailTemplate-mailContent"]).length > 0) {
                    me.oEditors.getById["txt-mailTemplate-mailContent"].setIR(data.templateContent);
                }
            }else if(MAIL_TEMPLATE_SIGNUP_CLOSE == templateType) {
                me.$form.find("input[name=templateNo]").val(data.templateNo);
                if(data.emailAutoYn == '0') {
                    $("#ckbDoNotSend").parent().addClass('checked');
                }else{
                    $("#ckbAutoSend").parent().addClass('checked');
                }
                me.$form.find("input[name=senderMail]").val(data.senderEmail);
                me.$form.find("input[name=mailSubject]").val(data.templateTitle);
                if(me.oEditors.length > 0 && $(me.oEditors.getById["txt-mailTemplate-mailContent"]).length > 0) {
                    me.oEditors.getById["txt-mailTemplate-mailContent"].setIR(data.templateContent);
                }
            }else if(MAIL_TEMPLATE_SMS == templateType) {
                me.$form.find("input[name=templateNo]").val(data.templateNo);
                me.$form.find("input[name=senderMail]").val(data.senderEmail);
                me.$form.find("#txt-mailTemplate-smsContent").val(data.templateContent);
            }
        },

        initFormValidation: function() {
            var me = this;

            me.$form.formValidation({
                framework: 'bootstrap',
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    'senderMail': {
                        row: '.controls',
                        validators: {
                            notEmpty: {
                            }
                        }
                    },
                    'mailSubject': {
                        row: '.controls',
                        validators: {
                            notEmpty: {
                            }
                        }
                    },
                    'smsContent': {
                        row: '.controls',
                        validators: {
                            notEmpty: {
                            }
                        }
                    }
                }
            });
        },

        submitForm: function() {
            var me = this;

            var formValidation = me.$form.data('formValidation');
            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            }

            var data = me.getDataSubmitForm(me.templateType);

            $.ajax({
                url: '/admin/mail/signup/submitMailTemplate.json',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(data) {
                    if (data.success) {
                        mugrunApp.showConfirmDialog1();
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
        },

        getDataSubmitForm: function(templateType) {
            var me = this;
            var data = {};

            if(MAIL_TEMPLATE_SIGNUP == templateType || MAIL_TEMPLATE_FIND_ID == templateType || MAIL_TEMPLATE_FIND_PASSWORD == templateType) {
                data['templateNo'] = me.$form.find('input[name=templateNo]').val();
                data['senderEmail'] = me.$form.find('input[name=senderMail]').val();
                data['templateTitle'] = me.$form.find('input[name=mailSubject]').val();
                data['templateType'] = me.$form.find('input[name=templateType]').val();
                data['templateContent'] = me.oEditors.getById["txt-mailTemplate-mailContent"].getIR();
            }else if(MAIL_TEMPLATE_SIGNUP_CLOSE == templateType) {
                data['templateNo'] = me.$form.find('input[name=templateNo]').val();
                var emailAutoYn = 1;
                me.$form.find('input[name=emailAutoYn]').each(function( index ) {
                    if($(this).parent().hasClass('checked')) {
                        emailAutoYn = $(this).data('value');
                        return;
                    }
                });
                data['emailAutoYn'] = emailAutoYn;
                data['senderEmail'] = me.$form.find('input[name=senderMail]').val();
                data['templateTitle'] = me.$form.find('input[name=mailSubject]').val();
                data['templateType'] = me.$form.find('input[name=templateType]').val();
                data['templateContent'] = me.oEditors.getById["txt-mailTemplate-mailContent"].getIR();
            }else if(MAIL_TEMPLATE_SMS == templateType) {
                data['templateNo'] = me.$form.find('input[name=templateNo]').val();
                data['senderEmail'] = me.$form.find('input[name=senderMail]').val();
                data['templateType'] = me.$form.find('input[name=templateType]').val();
                data['templateContent'] = me.$form.find('#txt-mailTemplate-smsContent').val();
            }

            return data;
        },

    });

    new MailTemplateManagementController('#container-mailTemplate-index');

})(jQuery);