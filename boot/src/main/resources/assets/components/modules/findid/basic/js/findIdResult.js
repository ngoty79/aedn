$( document ).ready(function() {

    var FindIdResultController = function (selector) {
        this.init(selector);
    };

    $.extend(FindIdResultController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);

            //values init
            me.findIdMethod = me.$container.find('input#hdn-findId-findIdMethod').val();
            me.verificationMIemail = me.$container.find('input#hdn-findId-verificationMIemail').val();
            me.verificationMIphone = me.$container.find('input#hdn-findId-verificationMIphone').val();
            me.verificationId = me.$container.find('input#hdn-findId-verificationId').val();
            me.userEn = me.$container.find('input#hdn-findId-userEn').val();
            me.smsCertInfo = me.$container.find('input#hdn-findId-smsCertInfo').val();
            me.smsCertInfoCallUrl = me.$container.find('input#hdn-findId-smsCertInfo-callUrl').val();
            me.smsCertInfoCertCompCd = me.$container.find('input#hdn-findId-smsCertInfo-certCompCd').val();
            me.smsCertInfoSEncData = me.$container.find('input#hdn-findId-smsCertInfo-sEncData').val();
            me.iPINEncDataCallUrl = me.$container.find('input#hdn-findId-iPINEncData-callUrl').val();
            me.iPINEncDataCertCompCd = me.$container.find('input#hdn-findId-iPINEncData-certCompCd').val();
            me.iPINEncDataSEncData = me.$container.find('input#hdn-findId-iPINEncData-sEncData').val();
            me.tempUserId = me.$container.find('input#hdn-findId-tempUserId').val();
            me.tempUserPhone = me.$container.find('input#hdn-findId-tempUserPhone').val();
            me.tempUserMail = me.$container.find('input#hdn-findId-tempUserMail').val();


            //controls


            me.initUi();
            me.initEventHandlers();
        },

        initUi: function () {
            var me = this;

            var params = {};
            params['userEn'] = me.userEn;
            params['tempUserId'] = me.tempUserId;
            params['tempUserPhone'] = me.tempUserPhone;
            params['tempUserMail'] = me.tempUserMail;
            params['isVerificationMIemail'] = me.findIdMethod.indexOf(me.verificationMIemail) != -1 ? true : false;
            params['isVerificationMIphone'] = me.findIdMethod.indexOf(me.verificationMIphone) != -1 ? true : false;
            params['isVerificationId'] = me.findIdMethod.indexOf(me.verificationId) != -1 ? true : false;

            me.$container.find('#pt-tab1-tab1').empty().append(
                $.tmpl(me.$container.find('#tmpl-findId-checkIDResult').html(), params)
            );

        },

        initEventHandlers: function () {
            var me = this;
            me.$btnCertification = me.$container.find('a#btn-findId-certification');
            if (me.$btnCertification.length > 0) {
                me.$btnCertification.on('click', function (e) {
                    e.preventDefault();

                    if (me.$container.find("#pt-module-findid-phone").attr("checked") == "checked") {
                        var paramForm = {
                            "m": "checkplusSerivce",
                            "EncodeData": me.smsCertInfoSEncData,
                            "param_r1": "/site/findid?scene=findFullId",
                            "param_r2": "",
                            "param_r3": ""
                        };
                        commonController.fnSmsCertPopup(me.smsCertInfoCallUrl, me.smsCertInfoCertCompCd, paramForm);
                    }

                    if (me.$container.find("#pt-module-findid-ipin").attr("checked") == "checked") {
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
            }

            $('.pt-modal-a').magnificPopup({
                type: 'inline',
                preloader: false,
                focus: 'input',
                modal: true
            });

            me.$container.find('.pt-modal-btn > .pt-modal-close').on('click', function (e) {
                e.preventDefault();
                me.emptyPopup();
                $.magnificPopup.close();
            });


            me.$container.find('.pt-modal-a').on('click', function (e) {
                e.preventDefault();
                me.sendAuthenticationNumber(this);
            });

            me.$container.find('.pt-modal-btn > .pt-btn-primary').on('click', function (e) {
                e.preventDefault();
                me.compareAuthenticationNumber(this);
            });

        },

        emptyPopup: function () {
            $('#pt-module-IDPW-auth-num').val('');
            $('#pt-module-IDPW-auth-num').removeClass('error');
            $('#find-id-authen-popup-message').html('')
        },

        sendAuthenticationNumber: function (item) {
            var me = this;

            var type = $(item).attr('authenType');
            $('#find-id-authen-popup-message').html($("input[name=sending-code]").val());
            $("#pt-bt-btnConfirm-authen-number").attr("disabled", "disabled");

            var userEn = $('input[name=userNoEnHidden]').val();
            var authenType;
            if (type = 'email') {
                $('input[name=userNoEnHidden]').attr("verifyType", 1);
                authenType = 1;
            } else { //verify id by SMS
                $('input[name=userNoEnHidden]').attr("verifyType", 2);
                authenType = 2;
            }
            $.ajax({
                type: "GET",
                url: "/site/view/findid/sendAuthenticationNumber",
                data: {
                    type: authenType,
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

        compareAuthenticationNumber: function (item) {
            var me = this;

            var code = $('#pt-module-IDPW-auth-num').val();
            if ($.trim(code) != '') {
                var $hdnUserNoEn = $('input[name=userNoEnHidden]');
                var userEn = $hdnUserNoEn.val();
                var type = $hdnUserNoEn.attr("verifyType");
                $.ajax({
                    type: "POST",
                    url: "/site/view/findid/compareAuthenticationNumber",
                    data: {
                        type: type,
                        userEn: userEn,
                        code: code
                    },
                    dataType: 'json',
                    timeout: 90000,
                    success: function (response) {
                        var result = response.data;
                        if (result.result == "0") {
                            $('#find-id-authen-popup-message').html($("input[name=code-expire]").val());
                        }
                        if (result.result == "2") {
                            $('#find-id-authen-popup-message').html($("input[name=code-isvalid]").val());
                        }
                        if (result.result == "1") {
                            var url = $('input[name=userNoEnHidden]').attr('nextUrl');
                            url += "&memberType=" + $("input[type=hidden][name=memberType]").val();
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

    var findIdResultController = new FindIdResultController('#container-findId-findIdResult');

});