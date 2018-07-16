var CLHConstants = {
    APPLY_STATUS_APPLY: '10',//신청
    APPLY_STATUS_COMPLETE: '20',//입금완료
    APPLY_STATUS_CANCEL: '30'//신청취소
};

var ClubhouseIndexController = function (selector) {
    this.init(selector);
};

$.extend(ClubhouseIndexController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tabCategory         = me.$container.find('#tab_clubhouse_categoryMnt');
        me.$tabFacility         = me.$container.find('#tab_clubhouse_facilityMnt');
        me.$tabEvent            = me.$container.find('#tab_clubhouse_eventMnt');

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
            clubhouseCategoryMntController.loadData();
        });

        me.$tabFacility.on('click', function(e){
            e.preventDefault();
            clubhouseFacilityMntController.loadFacilities();
        });

        me.$tabEvent.on('click', function(e){
            e.preventDefault();
            clubhouseEventMntController.loadData();
        });
    },

    openApplicantInfo: function(eventNo) {
        applicantInfoController.openApplicantInfo(eventNo);
    }

});

var clubhouseCategoryMntController = new ClubhouseCategoryMntController('#container-clubhouse-categoryMnt');
var clubhouseFacilityMntController = new ClubhouseFacilityMntController('#container-clubhouse-facilityMnt');
var clubhouseEventMntController = new ClubhouseEventMntController('#container-clubhouse-eventMnt');
var applicantInfoController = new ApplicantInfoController('#modal-attendanceApplicant-info');
var clubhouseIndexController = new ClubhouseIndexController('#container-admin-clubhouse');


