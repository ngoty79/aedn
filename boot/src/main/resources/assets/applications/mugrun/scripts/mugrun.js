var MugrunApp = function() {
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
        $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
            switch (jqxhr.status) {
                case 401:
                case 403:
                    break;
                default:
                    break;
            }
        });
        $.ajaxSetup({ cache: false });
        moment.locale(lang);
        this.setMessages();
        this.initValidatorMessage();
    };
    $.extend(contructor.prototype, {
        initValidatorMessage: function() {
            var me = this;
        },
        setMessages: function() {
            messages = client_messages;
        },
        getMessage: function(key, params) {
            var messageCompiler = _.template(messages[key] || "");
            return messageCompiler(params || {});
        },
        isEmpty: function(string) {
            return !this.isNotEmpty(string);
        },
        isNotEmpty: function(string) {
            return string !== null && string !== undefined && string !== "";
        },
        getFileSize: function (size) {
            var string;
            if (size >= 1000 * 1000 * 1000 * 1000 / 10) {
                size = size / (1000 * 1000 * 1000 * 1000 / 10);
                string = "TB";
            } else if (size >= 1000 * 1000 * 1000 / 10) {
                size = size / (1000 * 1000 * 1000 / 10);
                string = "GB";
            } else if (size >= 1000 * 1000 / 10) {
                size = size / (1000 * 1000 / 10);
                string = "MB";
            } else if (size >= 1000 / 10) {
                size = size / (1000 / 10);
                string = "KB";
            } else {
                size = size * 10;
                string = "B";
            }
            return (Math.round(size) / 10) + " " + string;
        },
        getFileSizeFromString: function(string) {
            var multiplyBy = 1,
                strSize = string.toUpperCase(),
                size = parseInt(strSize);

            if (_.endsWith(strSize, 'GB')) {
                multiplyBy = 1000000000;
            } else if (_.endsWith(strSize, 'MB')) {
                multiplyBy = 1000000;
            } else if (_.endsWith(strSize, 'KB')) {
                multiplyBy = 1000;
            } else if (_.endsWith(strSize, 'B')) {
                multiplyBy = 1;
            }

            return size*multiplyBy;
        },
        getDateFormat: function() {
            return 'YYYY-M-D';
        },
        showConfirmDialog: function(title,message,type, textCancelLabel, textOKLabel, buttonOKClass, buttonCancelClass , callbackFunctionOk, paramsForCallbackFuncOk, callbackFuncCancel, paramsForCallbackFuncCancel) {
            BootstrapDialog.show({
                title: title,
                message: message,
                type : type,
                closable: true, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttons: [{
                    label: textCancelLabel,
                    cssClass: buttonCancelClass,
                    action: function(dialogRef){
                        dialogRef.close();
                        if(typeof callbackFuncCancel === "function"){
                            callbackFuncCancel(paramsForCallbackFuncCancel);
                        }
                        else{
                            if(callbackFuncCancel) {
                                var fn = eval(callbackFuncCancel);
                                fn(paramsForCallbackFuncCancel);
                            }
                        }
                    }
                }, {
                    label: textOKLabel,
                    cssClass: buttonOKClass,
                    action: function(dialogRef){
                        dialogRef.close();
                        if(typeof callbackFunctionOk === "function"){
                            callbackFunctionOk(paramsForCallbackFuncOk);
                        }
                        else{
                            if(callbackFunctionOk) {
                                var fn = eval(callbackFunctionOk);
                                fn(paramsForCallbackFuncOk);
                            }
                        }
                    }
                }]
            });
        },
        showConfirmDialog1: function(context) {
            var me = this;

            var title = this.getMessage('common.dialog.confirm.default.title');
            var type = BootstrapDialog.TYPE_PRIMARY;
            var buttonLabel = this.getMessage('common.btn.confirm');
            var message = this.getMessage('common.dialog.confirm.default.message.changed');
            if(context) {
                if(!me.isEmptyString(context['title'])) title = context['title'];
                if(!me.isEmptyString(context['type'])) type = context['type'];
                if(!me.isEmptyString(context['buttonLabel'])) buttonLabel =  context['buttonLabel'];
                if(!me.isEmptyString(context['message'])) message = context['message'];
            }

            return BootstrapDialog.show({
                title: title,
                message: message,
                type: type,
                closable: true,
                draggable: true,
                buttons: [{
                    label: buttonLabel,
                    action: function(dialogRef){
                        dialogRef.close();
                    }
                }]
            });
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

        showCommonAlertDialog: function(message) {
            return BootstrapDialog.show({
                title: this.getMessage('common.alert.dialog.title'),
                message: message,
                closable: true, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttons: [{
                    label: this.getMessage('common.close'),
                    cssClass: 'btn blue',
                    action: function(dialogRef){
                        dialogRef.close();
                    }
                }]
            });
        },

        showCommonConfirmDialog: function(message, callbackFunctionOk, paramsForCallbackFuncOk, callbackFuncCancel, paramsForCallbackFuncCancel) {
            BootstrapDialog.show({
                title: "Xác Nhận",
                message: message,
                type : BootstrapDialog.TYPE_PRIMARY,
                closable: true, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttons: [{
                    label: 'Đồng ý',
                    cssClass: 'green',
                    action: function(dialogRef){
                        dialogRef.close();
                        if(typeof callbackFunctionOk === "function"){
                            callbackFunctionOk(paramsForCallbackFuncOk);
                        }
                        else{
                            if(callbackFunctionOk) {
                                var fn = eval(callbackFunctionOk);
                                fn(paramsForCallbackFuncOk);
                            }
                        }
                    }
                },
                {
                    label: 'Hủy',
                    cssClass: 'btn-outline green',
                    action: function(dialogRef){
                        dialogRef.close();
                        if(typeof callbackFuncCancel === "function"){
                            callbackFuncCancel(paramsForCallbackFuncCancel);
                        }
                        else{
                            if(callbackFuncCancel) {
                                var fn = eval(callbackFuncCancel);
                                fn(paramsForCallbackFuncCancel);
                            }
                        }
                    }
                }]
            });
        },

        alertMessage: function(message) {
            return BootstrapDialog.show({
                title: "Thông Báo",
                message: message,
                closable: true, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttons: [{
                    label: this.getMessage('common.btn.ok'),
                    cssClass: 'btn blue',
                    action: function(dialogRef){
                        dialogRef.close();
                    }
                }]
            });
        },
        mask: function() {
            $("body").addClass("loading-mask");
            $("body").append('<div class="before"> <div class="progress"> <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"> </div> </div> </div>');
        },
        unmask: function() {
            $("body").removeClass("loading-mask");
            $("body .before").empty();
        },
        showWarningDeleteDialog: function(callbackFunc, paramsForCallbackFunc, message, titleMsg) {
            var me = this;
            var title = "Thông Báo";
            var msg = "Bạn có muốn xóa dữ liệu đã chọn không?";
            if(message){
                msg = message;
            }
            if(titleMsg) {
                title = titleMsg
            }
            var type = BootstrapDialog.TYPE_WARNING;
            var textCancelLabel = mugrunApp.getMessage('common.btn.cancel');
            var textOKLabel = mugrunApp.getMessage('common.btn.ok');
            var buttonOKClass = 'green';
            var buttonCancelClass = 'btn-outline green';
            me.showConfirmDialog(title, msg, type, textOKLabel, textCancelLabel , buttonCancelClass, buttonOKClass, undefined, undefined,  callbackFunc, paramsForCallbackFunc);
        },

        formatDate: function(milliseconds, format) {
            return moment(milliseconds).format(format);
        },

        formatDateByCurrentLocale: function(milliseconds) {
            return moment(milliseconds).format(this.getMessage('common.date.format'));
        },
        getLoanStatus: function(status) {
            var str = "";
            switch(status){
                case "N":
                    str = "Mới";
                    break;
                case "A":
                    str = "Đang vay";
                    break;
                case "C":
                    str = "Từ Chối";
                    break;
                case "R":
                    str = "Đang Trình Tất Toán";
                    break;
                case "F":
                    str = "Đã Tất Toán";
                    break;
                default:
                    break;
            }
            return str;
        },
        getLoanPaymentStatus: function(status) {
            var str = "";
            switch(status){
                case "N":
                    str = "Chưa thu";
                    break;
                case "P":
                    str = "Đã Thu";
                    break;
                case "D":
                    str = "Quá hạn";
                    break;
                default:
                    break;
            }
            return str;
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
        serializeFormJSON: function(form) {
            var o = {};
            var a = $(form).serializeArray();
            $.each(a, function () {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        },
        refreshImageOnChange: function(inputCtl, img) {
            var me = this;
            var input = $(inputCtl)[0];
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    $(img).attr('src', event.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        },
        getDaysOfWeekInitialArr: function() {
            return ['mon','tue','wed','thu','fri','sat','sun'];
        },
        getDayInWeekShortNameCalendar: function(date) {
            return ['sun','mon','tue','wed','thu','fri','sat'][date.getDay()];
        },
        getDaysOfWeekNameArr: function() {
            return ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
        },
        leftPadNumber: function(number, targetLength) {
            var output = number + '';
            while (output.length < targetLength) {
                output = '0' + output;
            }
            return output;
        },
        isEmptyString: function(str) {
            return typeof str == 'string' && !str.trim() || typeof str == 'undefined' || str === null;
        },
        wrapText: function(text, limit, breakLineChar, isShortText) {
            var me = this;
            if (text.length > limit) {
                // find the last space within limit
                var edge = text.slice(0, limit).lastIndexOf(' ');
                if (edge > 0) {
                    var line = text.slice(0, edge);
                    var remainder = text.slice(edge + 1);
                    if(isShortText) {
                        return line+"...";
                    }
                    return line + breakLineChar + me.wrapText(remainder, limit);
                }
            }
            return text;
        },
        cutStringTooltip: function(str, length) {
            if(str.length > length) {
                var str = $.trim(str.substring(0, length));
                if (str.lastIndexOf(' ') > 0) {
                    return str.substring(0, str.lastIndexOf(' ')) + "...";
                }
            }
            return str;
        },
        formatNumber: function(number){
            var str = '' + number;
            return str.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        },
        /*For bootstrap checkbox*/
        setCheckboxVal: function(cb, val) {
            $(cb).val(val);
            if(val) {
                $(cb).prop("checked", true);
                if(!$(cb).parent().hasClass('checked')) {
                    $(cb).parent().addClass('checked')
                }
            }else{
                $(cb).prop("checked", false);
                $(cb).parent().removeClass('checked')
            }
        },
        /*For bootstrap checkbox*/
        getCheckboxVal: function(cb) {
            if($(cb).parent().hasClass('checked') && !$(cb).prop('disabled')) {
                return true;
            }
            return false;
        },
        handleCheckboxGroupEvent: function(parent, subs) {
            var me = this;
            //parent
            $(parent).change(function() {
                if(this.checked) {
                    $(subs).each(function() {
                        $(this).prop('disabled', false);
                        me.setCheckboxVal(this, true);
                    });
                }else{
                    $(subs).each(function() {
                        $(this).prop('disabled', true);
                        me.setCheckboxVal(this, false);
                    });
                }
            });

            //childs
            $(subs).each(function() {
                $(this).change(function() {
                    if(this.checked) {
                        me.setCheckboxVal(parent, true);
                    }else{
                        var hasChecked = false;
                        $(subs).each(function() {
                            if($(this)[0].checked){
                                hasChecked = true;
                            }
                        });
                        if(!hasChecked) {
                            me.setCheckboxVal(parent, false);
                            $(subs).each(function() {
                                $(this).prop('disabled', true);
                            });
                        }
                    }
                });
            });
        },
        onlyNumber: function (event) {
            var theEvent = event || window.event;
            var key = theEvent.keyCode || theEvent.which;
            var rs = /[\d|\b]/.test(String.fromCharCode(key));
            if (!rs) {
                theEvent.returnValue = false;
                if (theEvent.preventDefault)
                    theEvent.preventDefault();
                event.preventDefault();//chrome
            }
        },
        inputNumberOnly: function($input){
            $input.keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                        // Allow: Ctrl/cmd+A
                    (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                        // Allow: Ctrl/cmd+C
                    (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
                        // Allow: Ctrl/cmd+X
                    (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
                        // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
        },
        inputCurrency: function($input){
            $input.keyup(function (e) {
                // skip for arrow keys
                if(event.which >= 37 && event.which <= 40) return;
                delayA(function(){
                    // format number
                    $input.val(function(index, value) {
                        value = (value + '').replaceAll(",", "").replace(/^0+/, '');
                        return value
                            .replace(/\D/g, "")
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            ;
                    });
                }, 200 );

            });
        },
        formatCurrency: function(val){
            if(val == null) return '';
            val = (val + '').replaceAll(",", "").replace(/^0+/, '');
            return val
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                ;
        },
        round: function(num){
            //return Math.round((num)/1000)*1000;
            return Math.round(num);
        },
        roundAndFormatNumber: function(num){
            num = this.round(num);
            return this.formatNumber(num);
        },
        popupCenter: function(url, title, w, h){

            var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;
            var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

            // Puts focus on the newWindow
            if (window.focus) {
                newWindow.focus();
            }
        }
    });
    return contructor;
}();

var mugrunApp = new MugrunApp();

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

/**
 * Padding zero left for number
 * (9).pad();  //returns "09"
 * (7).pad(3);  //returns "007"
 */
if (!Number.prototype.pad) {
    Number.prototype.pad = function (size) {
        var s = String(this);
        while (s.length < (size || 2)) {
            s = "0" + s;
        }
        return s;
    }
}