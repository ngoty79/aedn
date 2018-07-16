$( document ).ready(function() {

    var CalendarController = function (selector) {
        this.init(selector);
    };

    $.extend(CalendarController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);

            me.$calendar                 = me.$container.find('#container-calendar');
            me.$modalScheduleDetail      = me.$container.find('#modal-calendar-scheduleDetail');


            me.initUi();
            me.initEventHandlers();
        },

        initUi: function () {
            var me = this;

        },

        initEventHandlers: function () {
            var me = this;

            me.$calendar.fullCalendar({
                header: {
                    left: '',
                    center: 'prev title next',
                    right: ''
                },
                views: {
                    month: {
                        titleFormat: 'YYYY.MM'
                    }
                },
                eventClick:  function(event, jsEvent, view) {
                    me.openScheduleDetail(event);
                    return false;
                },
                events: function (start, end, timezone, callback) {
                    me.$calendar.find('button.fc-prev-button').addClass('fc-state-disabled');
                    me.$calendar.find('button.fc-next-button').addClass('fc-state-disabled');
                    me.getScheduleOfMonth(start, end, timezone, callback);
                },
                eventRender: function(event, element, view) {
                    var content = '';
                    if(event.categoryColor != null && event.categoryColor != '') {
                        return '<a class="fc-day-grid-event fc-h-event fc-event fc-start fc-end" href="//" style="color:white;border:0px;background-color: ' + event.categoryColor + ';"><div class="fc-content"> <span class="fc-title"> '+event.title+'</span>';
                    }
                    return '<a class="fc-day-grid-event fc-h-event fc-event fc-start fc-end" href="//"><div class="fc-content"> <span class="fc-title"> '+event.title+'</span>';
                },
                eventAfterAllRender:function(view){
                    setTimeout(function(){
                        me.$calendar.find('button.fc-prev-button').removeClass('fc-state-disabled');
                        me.$calendar.find('button.fc-next-button').removeClass('fc-state-disabled');
                    }, 300);
                }
            });
        },

        getScheduleOfMonth: function (start, end, timezone, callback) {
            var me = this;

            if(this.eventsDone && this.eventsDone[start + end])
                return;
            var moment = me.$calendar.fullCalendar('getDate');
            $.ajax({
                url: '/site/view/calendar/getScheduleOfMonth.json',
                method: 'GET',
                dataType: 'json',
                data: {
                    date: moment._d
                },
                success: function(response) {
                    if (!this.eventsDone) {
                        this.eventsDone = {};
                    }
                    this.eventsDone[start + end] = true;
                    callback(me.buildCalendarEvents(response.data));
                },
                beforeSend: function() {
                },
                complete: function() {
                }
            });
        },

        buildCalendarEvents: function(data) {
            var me = this;
            var events = [];
            $(data).each(function() {
                var item = {};
                item ["title"] = this.categoryName;
                item ["start"] = this.startDate;
                item ["categoryName"] = this.categoryName;
                item ["categoryColor"] = this.categoryColor;
                item ["scheduleName"] = this.scheduleName;
                item ["startDate"] = this.startDate;
                item ["endDate"] = this.endDate;
                item ["linkUrl"] = this.linkUrl;
                item ["scheduleContent"] = this.scheduleContent;
                //item ["categoryImageByte"] = this.categoryImageByte;
                events.push(item);
            });
            return events;
        },

        openScheduleDetail: function(data) {
            var me = this;
            me.$modalScheduleDetail.find('#modalTitle').text(data.categoryName);
            me.$modalScheduleDetail.find('.txt-schedule-name').text(data.scheduleName);
            me.$modalScheduleDetail.find('.txt-schedule-period').text(mugrunApp.formatDate(data.startDate, 'YYYY.MM.DD')+' ~ '+mugrunApp.formatDate(data.endDate, 'YYYY.MM.DD'));
            var link = $.trim(data.linkUrl);
            if(link != '') {
                if(!(link.indexOf('http://') === 0 || link.indexOf('https://') === 0)) {
                    link = 'http://' + link;
                }
                me.$modalScheduleDetail.find('.txt-schedule-link').attr('href',link);
                me.$modalScheduleDetail.find('.txt-schedule-link').removeClass('hide');
            }else{
                me.$modalScheduleDetail.find('.txt-schedule-link').attr('href','');
                me.$modalScheduleDetail.find('.txt-schedule-link').addClass('hide');
            }
            me.$modalScheduleDetail.find('.txt-schedule-content').html(data.scheduleContent);
            me.$modalScheduleDetail.modal({backdrop: 'static', show: true});
        }


    });

    var calendarController = new CalendarController('#page-container-calendar');

});