
var MemberJoinStepAdmin = function (selector) {
    this.init(selector);
};

$.extend(MemberJoinStepAdmin.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.initEventHandlers();
        me.getMemberJoinStep();
    },

    initEventHandlers: function(){
        var me = this;

        me.$container.on('click', '#save-join-step', function (e) {
            e.preventDefault();
            var memberJoinStepData = me.getMemberJoinStepData();
            me.saveMemberJoinStep(memberJoinStepData);

        });

        me.$container.on('click', '#cancel-join-step', function (e) {
            e.preventDefault();
            me.loadMemberJoinStepData(me.currMemberJoinStepData);
        });

    },

    getMemberJoinStep: function(){
        var me = this;

        $.ajax({
            url: '/admin/signup/getMemberJoinStep.json',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    var memberJoinStepData = data.data;

                    me.currMemberJoinStepData = memberJoinStepData;

                    me.loadMemberJoinStepData(memberJoinStepData);

                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                me.$container.unmask();
            }
        });
    },

    saveMemberJoinStep: function(memberJoinStep){
        var me = this;

        $.ajax({
            url: '/admin/signup/modifyMemberJoinStep.json',
            type: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(memberJoinStep),
            success: function(data) {
                if (data.success) {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.alert.dialog.message.saved'));
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                me.$container.unmask();
            }
        });
    },

    loadMemberJoinStepData: function(memberJoinStepData){
        var me = this;

        me.updateCheckboxByField(memberJoinStepData, 'userAgreement');
        me.updateCheckboxByField(memberJoinStepData, 'identityVerification');
        me.updateCheckboxByField(memberJoinStepData, 'enterMemberInfo');
        me.updateCheckboxByField(memberJoinStepData, 'joinComplete');
    },

    updateCheckboxByField: function(memberJoinStepData, field) {
        var me = this;
        var ele = me.$container.find('input[name=' + field + ']');
        if(memberJoinStepData[field]) {
            me.check(ele);
        } else {
            me.unCheck(ele);
        }
    },

    getMemberJoinStepData: function(){
        var me = this;
        var memberJoinStepData = {};

        var userAgreement = me.$container.find('input[name=userAgreement]');
        memberJoinStepData['userAgreement'] = me.isCheck(userAgreement) ? 1 : 0;

        var identityVerification = me.$container.find('input[name=identityVerification]');
        memberJoinStepData['identityVerification'] = me.isCheck(identityVerification) ? 1 : 0;

        var enterMemberInfo = me.$container.find('input[name=enterMemberInfo]');
        memberJoinStepData['enterMemberInfo'] = me.isCheck(enterMemberInfo) ? 1 : 0;

        var joinComplete = me.$container.find('input[name=joinComplete]');
        memberJoinStepData['joinComplete'] = me.isCheck(joinComplete) ? 1 : 0;

        return memberJoinStepData;
    },

    unCheck: function(cb) {
        if($(cb).parent().hasClass('checked')) {
            $(cb).prop("checked", false);
            $(cb).parent().removeClass('checked');
        }
    },
    check: function(cb) {
        if(!$(cb).parent().hasClass('checked')) {
            $(cb).click();
        }
    },

    isCheck: function(cb){
        if($(cb).parent().hasClass('checked')) {
            return true;
        }
        return false;
    }
});

var memberJoinStepAdmin = new MemberJoinStepAdmin('#container-member-join-step');

