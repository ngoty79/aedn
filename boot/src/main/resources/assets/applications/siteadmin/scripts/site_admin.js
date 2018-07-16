var SiteAdminApp = function() {
    //private
    var messages = {};

    // contructor
    var contructor = function() {
        this.setMessages();
        this.initValidatorMessage();
    };
    $.extend(contructor.prototype, {
        initValidatorMessage: function() {
            var me = this;
        },
        setMessages: function() {
            messages = site_admin_messages;
        },
        getMessage: function(key, params) {
            var messageCompiler = _.template(messages[key] || "");
            return messageCompiler(params || {});
        },
        alertMessage: function(message, okFn, params){
            BootstrapDialog.show({
                title: siteAdminApp.getMessage('common.title'),
                closable: false,
                message: message,
                buttons: [{
                    cssClass: 'btn btn-outline green',
                    label: siteAdminApp.getMessage('common.ok'),
                    action: function( dialog2 ) {
                        dialog2.close();
                        if(okFn){
                            okFn(params);
                        }
                    }
                }]
            });
        },
        showConfirmDialog: function(message, okFn){
            BootstrapDialog.show({
                title: siteAdminApp.getMessage('common.title'),
                message: message,
                buttons: [{
                    label: siteAdminApp.getMessage('common.ok'),
                    closable: false,
                    cssClass: 'btn green',
                    action: function(dialog) {
                        okFn();
                        dialog.close();
                    }
                }, {
                    label: siteAdminApp.getMessage('common.close'),
                    cssClass: 'btn btn-outline green',
                    action: function(dialog) {
                        dialog.close();
                    }
                }]
            });
        }
    });
    return contructor;
}();

var siteAdminApp = new SiteAdminApp();
