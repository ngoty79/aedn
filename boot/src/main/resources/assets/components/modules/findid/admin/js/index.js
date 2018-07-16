var FindIdIndexController = function (selector) {
    this.init(selector);
};

$.extend(FindIdIndexController.prototype, {
    $container: null,
    MAIL_TEMPLATE_FIND_ID: "FINDID",
    MAIL_TEMPLATE_FIND_PASSWORD: "FINDPASS",
    MAIL_TEMPLATE_SMS: "SMS",
    oEditors: [],

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$modelVerificationSMSEditor               = me.$container.find('#modal-findId-verificationSMSEditor');
        me.$modelFindIdVerificationMailEditor        = me.$container.find('#modal-findId-verificationMailEditor');
        me.$modelFindPwVerificationMailEditor        = me.$container.find('#modal-findPw-verificationMailEditor');
        me.$formVerificationSMS                      = me.$modelVerificationSMSEditor.find('#form-findId-verificationSMS');
        me.$formFindIdVerificationEmail              = me.$modelFindIdVerificationMailEditor.find('#form-findId-verificationMail');
        me.$formFindPwVerificationEmail              = me.$modelFindPwVerificationMailEditor.find('#form-findPw-verificationMail');
    },

    initUi: function() {
        var me = this;

        nhn.husky.EZCreator.createInIFrame({
            oAppRef: me.oEditors,
            elPlaceHolder: 'txt-findId-mailTemplateContent',
            sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
            fCreator: "createSEditor2",
            htParams : {
                bUseToolbar : true
            },
            fOnAppLoad : function(){
                //me.loadDataForm();
            }
        });

        nhn.husky.EZCreator.createInIFrame({
            oAppRef: me.oEditors,
            elPlaceHolder: 'txt-findPw-mailTemplateContent',
            sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
            fCreator: "createSEditor2",
            htParams : {
                bUseToolbar : true
            },
            fOnAppLoad : function(){
                //me.loadDataForm();
            }
        });
    },

    initEventHandlers: function() {
        var me = this;

        me.$modelVerificationSMSEditor.find('button.btn-dialog-save').click(function(e) {
            e.preventDefault();
            me.submitForm(me.$modelVerificationSMSEditor, me.$formVerificationSMS, me.MAIL_TEMPLATE_SMS);
        });

        me.$modelFindIdVerificationMailEditor.find('button.btn-dialog-save').click(function(e) {
            e.preventDefault();
            me.submitForm(me.$modelFindIdVerificationMailEditor, me.$formFindIdVerificationEmail, me.MAIL_TEMPLATE_FIND_ID);
        });

        me.$modelFindPwVerificationMailEditor.find('button.btn-dialog-save').click(function(e) {
            e.preventDefault();
            me.submitForm(me.$modelFindPwVerificationMailEditor, me.$formFindPwVerificationEmail, me.MAIL_TEMPLATE_FIND_PASSWORD);
        });
    },

    openVerificationSMSEditorDialog: function() {
        var me = this;
        if(me.$formVerificationSMS.data('formValidation')) {
            me.$formVerificationSMS.data('formValidation').destroy();
        }
        me.initValidationSMSTemplateForm(me.$formVerificationSMS);
        me.loadDataMailTemplate(me.MAIL_TEMPLATE_SMS);
        me.$modelVerificationSMSEditor.modal({backdrop: 'static', show: true});
    },

    openFindIdVerificationMailEditorDialog: function() {
        var me = this;
        if(me.$formFindIdVerificationEmail.data('formValidation')) {
            me.$formFindIdVerificationEmail.data('formValidation').destroy();
        }
        me.initValidationIdPwTemplateForm(me.$formFindIdVerificationEmail);
        me.loadDataMailTemplate(me.MAIL_TEMPLATE_FIND_ID);
        me.$modelFindIdVerificationMailEditor.modal({backdrop: 'static', show: true});
    },

    openFindPwVerificationMailEditorDialog: function() {
        var me = this;
        if(me.$formFindPwVerificationEmail.data('formValidation')) {
            me.$formFindPwVerificationEmail.data('formValidation').destroy();
        }
        me.initValidationIdPwTemplateForm(me.$formFindPwVerificationEmail);
        me.loadDataMailTemplate(me.MAIL_TEMPLATE_FIND_PASSWORD);
        me.$modelFindPwVerificationMailEditor.modal({backdrop: 'static', show: true});
    },

    loadDataMailTemplate: function(templateType) {
        var me = this;

        $.ajax({
            url: '/admin/mail/signup/loadMailTemplate.json',
            method: 'POST',
            dataType: 'json',
            data: {
                templateType: templateType
            },
            success: function(response) {
                me.setDataForm(templateType, response.data);
            },
            beforeSend: function() {
                //me.$btnSave.prop('disabled', true);
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                //me.$btnSave.prop('disabled', false);
                me.$container.unmask();
            }
        });
    },

    setDataForm: function(templateType, data) {
        var me = this;

        if(me.MAIL_TEMPLATE_FIND_ID == templateType) {
            me.$formFindIdVerificationEmail.find("input[name=templateNo]").val(data.templateNo);
            me.$formFindIdVerificationEmail.find("input[name=senderMail]").val(data.senderEmail);
            me.$formFindIdVerificationEmail.find("input[name=mailSubject]").val(data.templateTitle);
            if(me.oEditors.length > 0 && $(me.oEditors.getById["txt-findId-mailTemplateContent"]).length > 0) {
                me.oEditors.getById["txt-findId-mailTemplateContent"].setIR(data.templateContent);
            }
        }else if(me.MAIL_TEMPLATE_FIND_PASSWORD == templateType) {
            me.$formFindPwVerificationEmail.find("input[name=templateNo]").val(data.templateNo);
            me.$formFindPwVerificationEmail.find("input[name=senderMail]").val(data.senderEmail);
            me.$formFindPwVerificationEmail.find("input[name=mailSubject]").val(data.templateTitle);
            if(me.oEditors.length > 0 && $(me.oEditors.getById["txt-findPw-mailTemplateContent"]).length > 0) {
                me.oEditors.getById["txt-findPw-mailTemplateContent"].setIR(data.templateContent);
            }
        }else if(me.MAIL_TEMPLATE_SMS == templateType) {
            me.$formVerificationSMS.find("input[name=templateNo]").val(data.templateNo);
            me.$formVerificationSMS.find("input[name=senderPhone]").val(data.senderEmail);
            me.$formVerificationSMS.find("#txt-mailTemplate-smsContent").val(data.templateContent);
        }
    },

    submitForm: function(model, form, templateType) {
        var me = this;

        var formValidation = $(form).data('formValidation');
        formValidation.validate();
        if (!formValidation.isValid()) {
            return;
        }

        var data = me.getDataSubmitForm(form, templateType);

        $.ajax({
            url: '/admin/mail/signup/submitMailTemplate.json',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
                    $(model).modal('hide');
                    mugrunApp.showConfirmDialog1();
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                //me.$btnSave.prop('disabled', true);
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                //me.$btnSave.prop('disabled', false);
                me.$container.unmask();
            }
        });
    },

    getDataSubmitForm: function(form, templateType) {
        var me = this;
        var data = {};

        if(me.MAIL_TEMPLATE_FIND_ID == templateType) {
            data['templateNo'] = $(form).find('input[name=templateNo]').val();
            data['senderEmail'] = $(form).find('input[name=senderMail]').val();
            data['templateTitle'] = $(form).find('input[name=mailSubject]').val();
            data['templateType'] = me.MAIL_TEMPLATE_FIND_ID;
            data['templateContent'] = me.oEditors.getById["txt-findId-mailTemplateContent"].getIR();
        }else if(me.MAIL_TEMPLATE_FIND_PASSWORD == templateType) {
            data['templateNo'] = $(form).find('input[name=templateNo]').val();
            data['senderEmail'] = $(form).find('input[name=senderMail]').val();
            data['templateTitle'] = $(form).find('input[name=mailSubject]').val();
            data['templateType'] = me.MAIL_TEMPLATE_FIND_PASSWORD;
            data['templateContent'] = me.oEditors.getById["txt-findPw-mailTemplateContent"].getIR();
        }else if(me.MAIL_TEMPLATE_SMS == templateType) {
            data['templateNo'] = $(form).find('input[name=templateNo]').val();
            data['senderEmail'] = $(form).find('input[name=senderPhone]').val();
            data['templateType'] = me.MAIL_TEMPLATE_SMS;
            data['templateContent'] = $(form).find('#txt-mailTemplate-smsContent').val();
        }

        return data;
    },

    initValidationIdPwTemplateForm: function(form) {
        var me = this;

        $(form).formValidation({
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
                }
            }
        });
    },

    initValidationSMSTemplateForm: function(form) {
        var me = this;

        $(form).formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'senderPhone': {
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
    }


});

var findIdModuleController = new FindIdModuleController('#container-findId-modules');
var findIdController = new FindIdController('#container-findId-tabId');
var findPasswordController = new FindPasswordController('#container-findId-tabPassword');
var findIdIndexController = new FindIdIndexController('#container-admin-findid');

$(document).ready(function() {
    findIdIndexController.initUi();
    findIdIndexController.initEventHandlers();
});
