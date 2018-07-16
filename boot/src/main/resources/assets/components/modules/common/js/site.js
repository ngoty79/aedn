var SiteApp = function() {
    //private
    var messages = {};

    // contructor
    var contructor = function() {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        var lang = $("meta[name='lang']").attr("content");
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });
        $.ajaxSetup({ cache: false });
        moment.locale(lang)
        this.initValidatorMessage();
    };
    $.extend(contructor.prototype, {
        initValidatorMessage: function() {
            var me = this;
        },
        getMessage: function(key, params) {
            var messageCompiler = _.template(client_messages[key] || "");
            return messageCompiler(params || {});
        },
        redirectPage: function(action, method, parameters) {
            var $form = $('<form>', {
                'action': action,
                'method': method,
                'target': '_top'
            }).append($('<input>', {
                'name': '_csrf',
                'value': $("meta[name='_csrf']").attr("content"),
                'type': 'hidden'
            })).appendTo('body');

            if(parameters){
                $.each(parameters, function (name, value) {
                    $('<input />').attr('type', 'hidden')
                        .attr('name', name)
                        .attr('value', value)
                        .appendTo($form);
                });
            }

            $form.submit();
        },
        showAlertDialog: function(title,message,type,buttonLabel, buttonClass) {
            return BootstrapDialog.show({
                title: title,
                message: message,
                type: type, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: true, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttons: [{
                    label: buttonLabel,
                    cssClass: buttonClass,
                    action: function(dialogRef){
                        dialogRef.close();
                    }
                }]
            });
        },
        alertMessage: function(message, callback, params) {
            var me = this;
            BootstrapDialog.show({
                title: me.getMessage('component.module.msg'),
                closable: false,
                message: message,
                onshow: function(dialogRef){
                    dialogRef.$modal.on('keypress', function(e){
                        if(e.which == 13) {
                            dialogRef.close();
                            if(callback != undefined){
                                callback(params);
                            }
                        }
                    });
                },
                buttons: [{
                    label: me.getMessage('common.btn.ok'),
                    cssClass: 'btn btn-popup-ok',
                    action: function( dialog ) {
                        dialog.close();
                        if(callback != undefined){
                            callback(params);
                        }
                    }
                }]
            });
        },
        confirmDialog: function(message, callback, paramsForCallback){
            var me = this;
            BootstrapDialog.show({
                title: me.getMessage('component.module.msg'),
                closable: false,
                message: message,
                buttons: [{
                    label: me.getMessage('common.btn.ok'),
                    cssClass: 'btn btn-popup-ok',
                    action: function( dialog ) {
                        dialog.close();
                        if(callback != undefined){
                            if(paramsForCallback) {
                                callback(paramsForCallback);
                            } else {
                                callback();
                            }
                        }
                    }
                },{
                    label: me.getMessage('common.btn.cancel'),
                    cssClass: 'btn btn-popup-cancel',
                    action: function( dialog ) {
                        dialog.close();
                    }
                }]
            });
        },
        onlyNumber: function (event) {
            var theEvent = event || window.event;
            var key = theEvent.keyCode || theEvent.which;
            var rs = /\d/.test(String.fromCharCode(key));
            if (!rs) {
                theEvent.returnValue = false;
                if (theEvent.preventDefault)
                    theEvent.preventDefault();
                event.preventDefault();//chrome
            }
        }
    });
    return contructor;
}();

var siteApp = new SiteApp();


$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
}
