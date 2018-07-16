var FindPasswordController = function (selector) {
    this.init(selector);
};

$.extend(FindPasswordController.prototype, {
    $container: null,
    moduleNo: 0,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$form                    = me.$container.find('#form-findPassword-detail');
        me.$btnSave                 = me.$form.find('button.btn-findid-save');
        me.$btnCancel               = me.$form.find('button.btn-findid-cancel');
        me.$btnFindPwMailEditor     = me.$form.find('button.btn-findPw-verificationMailEditor');
        me.$btnFindPwSMSEditor      = me.$form.find('button.btn-findPw-verificationSMSEditor');
        //Checkboxs
        me.$chbMethodFindByIdentity          = me.$form.find("[name='methodFindByIdentity']");
        me.$chbMethodFindByMemberInfo        = me.$form.find("[name='methodFindByMemberInfo']");
        me.$chbMethodIdentityIPIN            = me.$form.find("[name='methodIdentityIPIN']");
        me.$chbMethodIdentityMobile          = me.$form.find("[name='methodIdentityMobile']");
        me.$chbMethodMemberEmail             = me.$form.find("[name='methodMemberEmail']");
        me.$chbMethodMemberPhone             = me.$form.find("[name='methodMemberPhone']");
        me.$chbProcessConcealById            = me.$form.find("[name='processConcealById']");
        me.$chbProcessConcealByMemberInfo    = me.$form.find("[name='processConcealByMemberInfo']");
        me.$chbProcessConceal                = me.$form.find("[name='processConceal']");
        me.$chbProcessConcealMemberEmail     = me.$form.find("[name='processConcealMemberEmail']");
        me.$chbProcessConcealMemberPhone     = me.$form.find("[name='processConcealMemberPhone']");

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;

    },

    initEventHandlers: function() {
        var me = this;

        me.handleCheckboxEventFindId();

        me.$btnSave.on('click', function (e) {
            e.preventDefault();
            if(me.$chbMethodMemberPhone.is(':checked')
                || me.$chbMethodMemberEmail.is(':checked')
                || me.$chbMethodIdentityMobile.is(':checked')
                || me.$chbMethodIdentityIPIN.is(':checked')) {
                me.submitFindIdConfig();
            }else{
                mugrunApp.alertMessage('비밀번호찾기 방법을 1개 이상 선택하시기 바랍니다.');
            }
        });

        me.$btnCancel.on('click', function (e) {
            e.preventDefault();
            me.loadData(me.moduleNo);
        });

        me.$btnFindPwMailEditor.on('click', function (e) {
            e.preventDefault();
            findIdIndexController.openFindPwVerificationMailEditorDialog();
        });

        me.$btnFindPwSMSEditor.on('click', function (e) {
            e.preventDefault();
            findIdIndexController.openVerificationSMSEditorDialog();
        });
    },

    loadData: function(moduleNo) {
        var me = this;
        me.moduleNo = moduleNo;

        $.ajax({
            url: '/admin/findid/loadConfigFindPw.json',
            method: 'GET',
            dataType: 'json',
            data: {
                moduleNo: moduleNo
            },
            success: function(response) {
                if(response.data) {
                    me.setDataConfig(response.data);
                }
            },
            beforeSend: function() {
                me.$btnSave.prop('disabled', true);
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                me.$btnSave.prop('disabled', false);
                me.$container.unmask();
            }
        });
    },

    submitFindIdConfig: function() {
        var me = this;

        var data = {};
        data['moduleNo'] = me.moduleNo;
        data['methodFindByIdentity']        = mugrunApp.getCheckboxVal(me.$chbMethodFindByIdentity);
        data['methodFindByMemberInfo']      = mugrunApp.getCheckboxVal(me.$chbMethodFindByMemberInfo);
        data['methodIdentityIPIN']          = mugrunApp.getCheckboxVal(me.$chbMethodIdentityIPIN);
        data['methodIdentityMobile']        = mugrunApp.getCheckboxVal(me.$chbMethodIdentityMobile);
        data['methodMemberEmail']           = mugrunApp.getCheckboxVal(me.$chbMethodMemberEmail);
        data['methodMemberPhone']           = mugrunApp.getCheckboxVal(me.$chbMethodMemberPhone);
        data['processConcealById']          = mugrunApp.getCheckboxVal(me.$chbProcessConcealById);
        data['processConcealByMemberInfo']  = mugrunApp.getCheckboxVal(me.$chbProcessConcealByMemberInfo);
        data['processConceal']              = mugrunApp.getCheckboxVal(me.$chbProcessConceal);
        data['processConcealMemberEmail']   = mugrunApp.getCheckboxVal(me.$chbProcessConcealMemberEmail);
        data['processConcealMemberPhone']   = mugrunApp.getCheckboxVal(me.$chbProcessConcealMemberPhone);

        $.ajax({
            url: '/admin/findid/updateFindPwMethod.json',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data) {
                if (data.success) {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.alert.dialog.message.saved'));
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$btnSave.prop('disabled', true);
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                me.$btnSave.prop('disabled', false);
                me.$container.unmask();
            }
        });
    },

    setDataConfig: function(data) {
        var me = this;
        //Reset old value
        me.resetAll();
        //Set new data
        mugrunApp.setCheckboxVal(me.$chbMethodMemberPhone, data.methodMemberPhone);
        mugrunApp.setCheckboxVal(me.$chbMethodMemberEmail, data.methodMemberEmail);
        if(data.methodMemberPhone || data.methodMemberEmail) {
            mugrunApp.setCheckboxVal(me.$chbMethodFindByMemberInfo, true);
        }
        mugrunApp.setCheckboxVal(me.$chbMethodIdentityMobile, data.methodIdentityMobile);
        mugrunApp.setCheckboxVal(me.$chbMethodIdentityIPIN, data.methodIdentityIPIN);
        if(data.methodIdentityMobile || data.methodIdentityMobile) {
            mugrunApp.setCheckboxVal(me.$chbMethodFindByIdentity, true);
        }
        //mugrunApp.setCheckboxVal(me.$chbProcessConceal, data.processConceal);
        if(data.processConceal) {
            mugrunApp.setCheckboxVal(me.$chbProcessConcealMemberEmail, data.processConcealMemberEmail);
            mugrunApp.setCheckboxVal(me.$chbProcessConcealMemberPhone, data.processConcealMemberPhone);
            if(data.processConcealMemberEmail || data.processConcealMemberPhone) {
                mugrunApp.setCheckboxVal(me.$chbProcessConcealByMemberInfo, true);
            }

            mugrunApp.setCheckboxVal(me.$chbProcessConcealById, data.processConcealById);
            if(data.processConcealMemberEmail || data.processConcealMemberPhone || data.processConcealById) {
                mugrunApp.setCheckboxVal(me.$chbProcessConceal, true);
            }
        }
    },

    resetAll: function() {
        var me = this;
        mugrunApp.setCheckboxVal(me.$chbMethodFindByIdentity, false);
        mugrunApp.setCheckboxVal(me.$chbMethodFindByMemberInfo, false);
        mugrunApp.setCheckboxVal(me.$chbMethodIdentityIPIN, false);
        mugrunApp.setCheckboxVal(me.$chbMethodIdentityMobile, false);
        mugrunApp.setCheckboxVal(me.$chbMethodMemberEmail, false);
        mugrunApp.setCheckboxVal(me.$chbMethodMemberPhone, false);
        mugrunApp.setCheckboxVal(me.$chbProcessConcealById, false);
        mugrunApp.setCheckboxVal(me.$chbProcessConcealByMemberInfo, false);
        mugrunApp.setCheckboxVal(me.$chbProcessConceal, false);
        mugrunApp.setCheckboxVal(me.$chbProcessConcealMemberEmail, false);
        mugrunApp.setCheckboxVal(me.$chbProcessConcealMemberPhone, false);
    },

    handleCheckboxEventFindId: function() {
        var me = this;

        mugrunApp.handleCheckboxGroupEvent(me.$chbMethodFindByMemberInfo, [me.$chbMethodMemberPhone, me.$chbMethodMemberEmail]);
        mugrunApp.handleCheckboxGroupEvent(me.$chbMethodFindByIdentity, [me.$chbMethodIdentityMobile, me.$chbMethodIdentityIPIN]);
        mugrunApp.handleCheckboxGroupEvent(me.$chbProcessConceal, [me.$chbProcessConcealByMemberInfo, me.$chbProcessConcealById, me.$chbProcessConcealMemberEmail, me.$chbProcessConcealMemberPhone]);
        mugrunApp.handleCheckboxGroupEvent(me.$chbProcessConcealByMemberInfo, [me.$chbProcessConcealMemberEmail, me.$chbProcessConcealMemberPhone]);
    }
});