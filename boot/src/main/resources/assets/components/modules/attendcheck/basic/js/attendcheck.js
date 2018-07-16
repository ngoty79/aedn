$( document ).ready(function(){
    var AttendCheckController = function (selector) {
        this.init(selector);
    };

    $.extend(AttendCheckController.prototype, {
        $container: null,
        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$frmAttendcheck              = me.$container.find('#frm-attendcheck');
            me.$frmFilter                   = me.$container.find('#frm-attendcheck-filter');
            me.$txtAttendChk                = me.$container.find('#attend_chk');
            me.$btnAttend                   = me.$container.find('#btn-attend');
            me.$sltDate                     = me.$container.find('#slt-attendcheck-date');
            me.$txtDate                     = me.$container.find('#txt-attendcheck-date');

            me.userNo = me.$container.find('#user-no').val();

            me.initUi();
            me.initEventHandlers();
        },
        initUi: function() {
            var me = this;

            var msg = me.$container.find('#hdn-attendcheck-msg').val();
            if($.trim(msg) != '') {
                siteApp.alertMessage(msg);
            }

            var currentDate = new Date();
            var currentDateStr = $.datepicker.formatDate('yy-mm-dd', currentDate);
            me.$txtDate.text(currentDateStr);

            var viewdays = me.$container.find('#hdn-attendcheck-viewdays').val();
            if($.trim(viewdays) != '') {
                me.$sltDate.empty().append('<option value="'+currentDateStr+'">오늘</option>');
                var num = Number(viewdays) + 1;
                for(var i=1; i<num; i++) {
                    var d = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i);
                    var dateStr = $.datepicker.formatDate('yy-mm-dd', d);
                    me.$sltDate.append('<option value="'+dateStr+'">'+dateStr+'</option>');
                }
            }

            me.$sltDate.val(me.$container.find('#hdn-attendcheck-attendDate').val());
        },
        initEventHandlers: function() {
            var me = this;

            me.$btnAttend.on('click', function (e) {
                e.preventDefault();
                if(me.userNo == ''){
                    siteApp.alertMessage('로그인이 필요합니다.');
                } else if($.trim(me.$txtAttendChk.val()) != '') {
                    me.$frmAttendcheck.submit();
                }
            });

            me.$sltDate.change(function(e) {
                e.preventDefault();
                me.$frmFilter.submit();
            });
        }
    });

    new AttendCheckController('.container-attendcheck-wrapper');
});