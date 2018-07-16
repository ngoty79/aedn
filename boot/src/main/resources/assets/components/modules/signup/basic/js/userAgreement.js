$( document ).ready(function() {
    var UserAgreementController = function (selector) {
        this.init(selector);
    };

    $.extend(UserAgreementController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$allCheckbox = me.$container.find("#pt-module-registrationNamo-agree-all");
            me.$inputCheckboxAgree = me.$container.find("input[id^='chk_']");
            me.$messageCheckbox = me.$container.find("[id^=div_]");
            me.$messageCheckbox = me.$container.find("[id^=div_]");
            me.$inputCheckbox = me.$container.find("input[type='checkbox']");
            me.$btnNext = me.$container.find("#pt-btn-next");
            me.$baseAgreementYn = me.$container.find("input[baseAgreementYn='1']");
            me.nextScene = me.$container.find('input#agreement-next-scene').val();

            me.initEventHandlers();

        },

        initEventHandlers: function () {
            var me = this;
            me.$allCheckbox.click(function () {
                if ($(this).is(':checked')) {
                    me.$inputCheckboxAgree.each(function (index) {
                        $(this).prop('checked', true);
                    });
                    me.$messageCheckbox.hide();
                } else {
                    me.$inputCheckboxAgree.each(function (index) {
                        $(this).prop('checked', false);
                    });
                }
            });

            me.$inputCheckboxAgree.click(function (index) {
                var checkAll = true;
                me.$inputCheckboxAgree.each(function (index) {
                    if (!$(this).is(':checked')) {
                        checkAll = false;
                    }
                });

                me.$allCheckbox.attr('checked', checkAll);
            });
            //lost focus disappear #1304
            me.$inputCheckbox.change(function () {
                var provisionNo = $(this).attr('id').split('_')[1];
                var divMsgId = '#div_' + provisionNo;
                var isChecked = $(this).is(':checked');

                if (isChecked) {
                    $(divMsgId).hide();
                }

            });

            //click next button
            me.$btnNext.click(function () {
                var valid = true;
                me.$baseAgreementYn.each(function (index) {
                    var provisionNo = $(this).attr('id').split('_')[1];
                    var divMsgId = '#div_' + provisionNo;
                    if (!$(this).is(':checked')) {
                        valid = false;
                        $(this).focus();
                        $(divMsgId).show();
                    }
                    else {
                        $(divMsgId).hide();
                    }

                });

                if (valid) {
                    var nextUrl = '?scene=' + me.nextScene;
                    signupController.addStepInfoVerification(me.nextScene, function () {
                        window.location = nextUrl;
                    });

                }
            });
        }

    });

    var userAgreementController = new UserAgreementController('#user-agreement-container');
})

