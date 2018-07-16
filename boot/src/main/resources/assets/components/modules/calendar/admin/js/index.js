var CalendarIndexController = function (selector) {
    this.init(selector);
};

$.extend(CalendarIndexController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tabCategory         = me.$container.find('#tab_calendar_categoryManagement');
        me.$tabSchedule         = me.$container.find('#tab_calendar_scheduleManagement');


        me.initUi();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;



    },

    initEventHandlers: function() {
        var me = this;

        me.$tabCategory.on('click', function(e){
            e.preventDefault();

        });

        me.$tabSchedule.on('click', function(e){
            e.preventDefault();
            calendarScheduleMntController.loadData();
        });
    }

});

var calendarCategoryMntController = new CalendarCategoryMntController('#container-calendar-categoryManagement');
var calendarScheduleMntController = new CalendarScheduleMntController('#container-calendar-scheduleManagement');
var calendarIndexController = new CalendarIndexController('#container-admin-calendar');


