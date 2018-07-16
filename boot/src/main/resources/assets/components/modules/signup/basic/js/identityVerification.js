$( document ).ready(function() {
    var IdentityVerificationController = function (selector) {
        this.init(selector);
    };

    $.extend(IdentityVerificationController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);

            me.smsCertInfoCallUrl = me.$container.find('input#hdn-identity-smsCertInfo-callUrl').val();
            me.smsCertInfoCertCompCd = me.$container.find('input#hdn-identity-smsCertInfo-certCompCd').val();
            me.smsCertInfoSEncData = me.$container.find('input#hdn-identity-smsCertInfo-sEncData').val();
            me.iPINEncDataCallUrl = me.$container.find('input#hdn-identity-iPINEncData-callUrl').val();
            me.iPINEncDataCertCompCd = me.$container.find('input#hdn-identity-iPINEncData-certCompCd').val();
            me.iPINEncDataSEncData = me.$container.find('input#hdn-identity-iPINEncData-sEncData').val();

            me.initEventHandlers();

        },

        initEventHandlers: function () {
            var me = this;

            me.$container.on('click', '#fn-sms-cert-popup', function (e) {
                var paramForm = {
                    "m": "checkplusSerivce",
                    "EncodeData": me.smsCertInfoSEncData,
                    "param_r1": "/signup?scene=memberInfo",
                    "param_r2": "",
                    "param_r3": ""
                };
                certificationService.fnSmsCertPopup(me.smsCertInfoCallUrl, me.smsCertInfoCertCompCd, paramForm);
            });

            me.$container.on('click', '#fn-ipin-cert-popup', function (e) {
                var paramForm = {
                    "m": "checkplusSerivce",
                    "EncodeData": me.iPINEncDataSEncData,
                    "param_r1": "/signup?scene=memberInfo",
                    "param_r2": "",
                    "param_r3": ""
                };
                certificationService.fnIPinCertPopup(me.iPINEncDataCallUrl, me.iPINEncDataCertCompCd, paramForm);
            });


        }

    });

    var identityVerificationController = new IdentityVerificationController('#identity-verification-container');
})

