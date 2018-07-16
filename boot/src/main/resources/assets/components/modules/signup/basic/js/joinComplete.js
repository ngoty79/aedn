$( document ).ready(function() {
    var JoinCompleteController = function (selector) {
        this.init(selector);
    };

    $.extend(JoinCompleteController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);

        }

    });

    var joinCompleteController = new JoinCompleteController('#join-complete-container');
})

