
var CommonController = function (selector) {
    this.init(selector);
};

$.extend(CommonController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function () {
        var me = this;


    },

    initEventHandlers: function () {
        var me = this;


    },

    fnDoSubmit: function (val, noVal) {
        window.location = '/findid?scene=findFullId';
    },

    fnSmsCertPopup: function (callUrl, certCompCd, paramForm) {
        var me = this;

        if (certCompCd == null || certCompCd == '') {
            alert('본인인증 계약정보가 존재하지 않습니다.');
        } else {
            window.name = "Parent_window";
            var target = 'popupCert';
            var frm = me.makeForm(callUrl, 'post', 'form_sms_cert', 'form_sms_cert', target, paramForm);
            var win_set = 'width=450, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no';
            var mauth_window = window.open('', target, win_set);
            $(frm).submit();
            if (mauth_window == null) {
                var msgBlocked = " ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는 \n"
                    + " 화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다. \n\n"
                    + "※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.";
                alert(msgBlocked);
                return;
            }
        }
    },

    fnIPinCertPopup: function (callUrl, certCompCd, paramForm) {
        var me = this;
        if (certCompCd == null || certCompCd == '') {
            alert('I-Pin 본인인증 계약정보가 존재하지 않습니다.');
        } else {
            window.name = "Parent_window";
            var target = 'popupCert';
            var frm = me.makeForm(callUrl, 'post', 'form_ipin_cert', 'form_ipin_cert', target, paramForm);
            var win_set = 'width=450, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no';
            var mauth_window = window.open('', target, win_set);
            $(frm).submit();
            if (mauth_window == null) {
                var msgBlocked = " ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는 \n"
                    + " 화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다. \n\n"
                    + "※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.";
                alert(msgBlocked);
                return;
            }
        }
    },

    makeForm: function (action, method, id, name, target, parameters) {
        var me = this;

        if ($('#' + id).length > 0) {
            return $('#' + id);
        } else if ($("form[name='" + name + "']").length) {
            return $("form[name='" + name + "']");
        } else {
            var $form = $('<form>', {
                'action': action,
                'method': method,
                'id': id,
                'name': name,
                'target': target
            }).append($('<input>', {
                'name': '_csrf',
                'value': $("meta[name='_csrf']").attr("content"),
                'type': 'hidden'
            })).appendTo('body');

            if (parameters) {
                $.each(parameters, function (name, value) {
                    $('<input />').attr('type', 'hidden')
                        .attr('name', name)
                        .attr('value', value)
                        .appendTo($form);
                });
            }

            return $form;
        }
    },

    onlyNumber: function (event) {
        var theEvent = event || window.event;
        var key = theEvent.keyCode || theEvent.which;
        var rs = /\d/.test(String.fromCharCode(key));
        if (!rs) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault)
                theEvent.preventDefault();
        }
    }

});

var commonController = new CommonController('.page-container');
