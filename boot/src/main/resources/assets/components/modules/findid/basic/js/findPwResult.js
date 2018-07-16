$( document ).ready(function() {
    var FindPwResultController = function (selector) {
        this.init(selector);
    };

    $.extend(FindPwResultController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);

            //values
            me.findIdMethod = me.$container.find('input#hdn-findId-findIdMethod').val();
            me.findPwMethod = me.$container.find('input#hdn-findId-findPwMethod').val();
            me.verificationMIemail = me.$container.find('input#hdn-findId-verificationMIemail').val();
            me.verificationMIphone = me.$container.find('input#hdn-findId-verificationMIphone').val();
            me.verificationId = me.$container.find('input#hdn-findId-verificationId').val();
            me.userEn = me.$container.find('input#hdn-findId-userEn').val();
            me.smsCertInfoCallUrl = me.$container.find('input#hdn-findId-smsCertInfo-callUrl').val();
            me.smsCertInfoCertCompCd = me.$container.find('input#hdn-findId-smsCertInfo-certCompCd').val();
            me.smsCertInfoSEncData = me.$container.find('input#hdn-findId-smsCertInfo-sEncData').val();
            me.iPINEncDataCallUrl = me.$container.find('input#hdn-findId-iPINEncData-callUrl').val();
            me.iPINEncDataCertCompCd = me.$container.find('input#hdn-findId-iPINEncData-certCompCd').val();
            me.iPINEncDataSEncData = me.$container.find('input#hdn-findId-iPINEncData-sEncData').val();
            me.tempUserMail = me.$container.find('input#hdn-findId-tempUserMail').val();
            me.tempUserPhone = me.$container.find('input#hdn-findId-tempUserPhone').val();
            me.iVerificationMethodPhone = me.$container.find('input#hdn-findId-iVerificationMethodPhone').val();
            me.iVerificationMethodIpin = me.$container.find('input#hdn-findId-iVerificationMethodIpin').val();

            //controls
            me.sectionFindIdAuthenticationInfo = me.$container.find('#section-findId-authenticationInfo');

            me.initUi();
            me.initEventHandlers();
        },

        initUi: function () {
            var me = this;

            if ($.trim(me.userEn) == "") {
                me.$container.find('#section-findId-dontRememberPw').empty().append(
                    $.tmpl(me.$container.find('#tmpl-findId-dontRememberPw').html(), params)
                );
            } else {
                var params = {};
                params['userEn'] = me.userEn;
                params['tempUserMail'] = me.tempUserMail;
                params['tempUserPhone'] = me.tempUserPhone;
                params['isVerificationMIemail'] = me.findIdMethod.indexOf(me.verificationMIemail) != -1 ? true : false;
                params['isVerificationMIphone'] = me.findIdMethod.indexOf(me.verificationMIphone) != -1 ? true : false;
                params['isVerificationId'] = me.findIdMethod.indexOf(me.verificationId) != -1 ? true : false;
                params['isIVerificationMethodPhone'] = me.findPwMethod.indexOf(me.iVerificationMethodPhone) != -1 ? true : false;
                params['isIVerificationMethodIpin'] = me.findPwMethod.indexOf(me.iVerificationMethodIpin) != -1 ? true : false;
                me.$container.find('#section-findId-authenticationInfo').empty().append(
                    $.tmpl(me.$container.find('#tmpl-findId-authenticationInfo').html(), params)
                );
                me.buildEventForm();
            }

        },

        initEventHandlers: function () {
            var me = this;

            me.$container.find(".pt-modal-btn > .pt-modal-close").on('click', function (e) {
                me.emptyPopup();
                $.magnificPopup.close();
            });

        },

        buildEventForm: function () {
            var me = this;

            me.$container.find('.pt-modal-a').magnificPopup({
                type: 'inline',
                preloader: false,
                focus: 'input',
                modal: true
            });

            me.$container.find('.pt-modal-a').on('click', function (e) {
                e.preventDefault();
                me.sendAuthenticationNumber();
            });

            me.$container.find('.pt-modal-btn > .pt-btn-primary').on('click', function (e) {
                e.preventDefault();
                me.compareAuthenticationNumber();
            });

            me.$container.find('#btn-findId-certification').on('click', function (e) {
                e.preventDefault();
                if ($("#pt-module-findid-phone").attr("checked") == "checked") {
                    var paramForm = {
                        "m": "checkplusSerivce",
                        "EncodeData": me.smsCertInfoSEncData,
                        "param_r1": "/site/findid?scene=findFullId",
                        "param_r2": "",
                        "param_r3": ""
                    };
                    commonController.fnSmsCertPopup(me.smsCertInfoCallUrl, me.smsCertInfoCertCompCd, paramForm);
                }
                if ($("#pt-module-findid-ipin").attr("checked") == "checked") {
                    var paramForm = {
                        "m": "checkplusSerivce",
                        "EncodeData": me.iPINEncDataSEncData,
                        "param_r1": "/site/findid?scene=findFullId",
                        "param_r2": "",
                        "param_r3": ""
                    };
                    commonController.fnIPinCertPopup(me.iPINEncDataCallUrl, me.iPINEncDataCertCompCd, paramForm);
                }

            });

        },

        emptyPopup: function () {
            var me = this;

            me.$container.find('#pt-module-IDPW-auth-num').val('');
            me.$container.find('#pt-module-IDPW-auth-num').removeClass('error');
            me.$container.find('#find-id-authen-popup-message').html('')
        },

        sendAuthenticationNumber: function () {
            var me = this;

            me.$container.find('#find-id-authen-popup-message').html(me.$container.find("input[name=sending-code]").val());
            me.$container.find("#pt-bt-btnConfirm-authen-number").attr("disabled", "disabled");

            var userEn = me.$container.find('#hdn-findId-userNoEnHidden').val();
            var type;
            if (type = 'email') {
                me.$container.find('#hdn-findId-userNoEnHidden').attr("verifyType", 3);
                type = 3;
            } else {   //verify password by SMS
                me.$container.find('#hdn-findId-userNoEnHidden').attr("verifyType", 4);
                type = 4;
            }
            $.ajax({
                type: "GET",
                url: "/site/view/findid/sendAuthenticationNumber",
                data: {
                    type: type,
                    userEn: userEn
                },
                dataType: 'json',
                success: function (response) {
                    var data = response.data;
                    if (data.success == true) {
                        $('#find-id-authen-popup-message').html($("input[name=code-send]").val());
                        $('#pt-bt-btnConfirm-authen-number').removeAttr('disabled');
                    } else {
                        $('#find-id-authen-popup-message').html($("input[name=sent-faile]").val());
                    }
                },
                failure: function () {
                    alert("something is wrong")
                }
            });
        },

        compareAuthenticationNumber: function () {
            var me = this;

            var code = $('#pt-module-IDPW-auth-num').val();
            if (code != '') {
                var userEn = $('#hdn-findId-userNoEnHidden').val();
                var type = $('#hdn-findId-userNoEnHidden').attr("verifyType");
                $.ajax({
                    type: "POST",
                    url: "/site/view/findid/compareAuthenticationNumber",
                    data: {
                        type: type,
                        userEn: userEn,
                        code: code
                    },
                    dataType: 'json',
                    success: function (response) {
                        var result = response.data;
                        if (result.result == "0") {
                            $('#find-id-authen-popup-message').html($("input[name=code-expire]").val());
                        }
                        if (result.result == "2") {
                            $('#find-id-authen-popup-message').html($("input[name=code-isvalid]").val());
                        }
                        if (result.result == "1") {
                            var url = $('#hdn-findId-userNoEnHidden').attr('nextUrl');
                            url += "&a=" + $('#hdn-findId-userNoEnHidden').attr('value');
                            url += "&memberType=" + $("#hdn-findId-memberType").val();
                            window.location = url;
                        }
                    },
                    failure: function () {
                        alert("something is wrong")
                    }
                });

            } else {
                $('#find-id-authen-popup-message').html($("input[name=no-input-code]").val());
                $('#pt-module-IDPW-auth-num').addClass('error');
                $('#pt-module-IDPW-auth-num').focus();
            }
        }


    });

    var findPwResultController = new FindPwResultController('#container-findId-findPwResult');

});