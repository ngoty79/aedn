
var SignupController = function (selector) {
    this.init(selector);
};

$.extend(SignupController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);

    },

    addStepInfoVerification: function (currentScene, callbackFun) {
        $.ajax({
            type: "GET",
            url: "/site/view/signup/addStepInfoVerification.json",
            data: {
                currentScene: currentScene
            },
            dataType: 'json',
            success: function (data) {
                if (callbackFun && typeof(callbackFun) == "function") {
                    callbackFun();
                }
            },
            failure: function () {

            }
        });
    }

});

var signupController = new SignupController('.pt-module-registrationNamo-skin-basic');

