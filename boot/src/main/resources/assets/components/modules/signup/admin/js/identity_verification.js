
var IdentityVerificationAdmin = function (selector) {
    this.init(selector);
};

$.extend(IdentityVerificationAdmin.prototype, {
    $container: null,
    commonCodesPK: [],

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.initEventHandlers();

    },

    initEventHandlers: function() {
        var me = this;

        me.$container.on('click', '#save-indentity', function (e) {
            e.preventDefault();

            var signup = me.buildNewSignup();
            signupAdminModuleController.updateModuleSignup(signup, identityVerificationAdmin, true);
        });

        me.$container.on('click', '#cancel-indentity', function (e) {
            e.preventDefault();

            me.updateSelectMethodVerfication(signupAdminModuleController.currModuleSignup);
        });
    },

    initVerification: function(moduleSignup){
        var me = this;
        me.$container.find('select[name=mobileVerifyService]').append('<option value="' + moduleSignup.mobileVerifyService + '"> ' + moduleSignup.mobileVerifyServiceCompName + '</option>');
        me.$container.find('select[name=ipinVerifyService]').append('<option value="' + moduleSignup.ipinVerifyService + '"> ' + moduleSignup.ipinVerifyServiceCompName + '</option>');

        me.getCommonCodeCertType(moduleSignup);
    },

    getCommonCodeCertType: function(moduleSignup){
        var me = this;
        $.ajax({
            url: '/admin/signup/verification/certType',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    var commonCodes = data.data;
                    for(var i = 0; i < commonCodes.length; i++){
                        var commonCode = commonCodes[i];
                        me.$container.find('#form-select-verification-method .form-group').append('<label class="select-method-verification"> ' +
                                '<input type="checkbox" name="verification" id="verificationMethod' + commonCode.commonCode + '"> '+ commonCode.commonCodeName +
                        ' </label>');
                        me.commonCodesPK.push(commonCode.commonCode);
                    }

                    me.updateSelectMethodVerfication(moduleSignup);

                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            }
        });
    },

    updateSelectMethodVerfication: function(moduleSignup){
        var me = this;

        me.$container.find('input[name=verification]').prop("checked", false);

        if(moduleSignup.certType != ''){
            var certTypes = moduleSignup.certType.split(',');
            for(var i = 0; i < certTypes.length; i++){
                var certType = certTypes[i];
                var ele = me.$container.find('#verificationMethod' + certType);
                $(ele).prop("checked", true);
            }
        }
    },

    buildNewSignup: function(){
        var me = this;
        var certTypes = me.commonCodesPK;
        var sigup = signupAdminModuleController.currModuleSignup;
        var newcertType = [];
        if(certTypes.length > 0) {
            for(var i = 0; i < certTypes.length; i++) {
                var certType = certTypes[i];
                var ele = me.$container.find('#verificationMethod' + certType);
                if($(ele).prop("checked")) {
                    newcertType.push(certType)
                };
            }
            sigup.certType = newcertType.join(',');
        }
        return sigup;
    }
});

var identityVerificationAdmin = new IdentityVerificationAdmin('#container-identity-verification');

