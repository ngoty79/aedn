var ApplicantInfoController = function (selector) {
    this.init(selector);
};

$.extend(ApplicantInfoController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tabParticipate          = me.$container.find('#tab_applicantInfo_participate');
        me.$tabAwaiter              = me.$container.find('#tab_applicantInfo_awaiter');

        me.eventNo = 0;

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;

    },

    initEventHandlers: function() {
        var me = this;
        me.$tabParticipate.on('click', function(e){
            e.preventDefault();
            applicantParticipateController.loadData(me.eventNo);
        });
        me.$tabAwaiter.on('click', function(e){
            e.preventDefault();
            applicantAwaiterController.loadData(me.eventNo);
        });
    },

    openApplicantInfo: function(eventNo) {
        var me = this;
        me.eventNo = eventNo;
        me.$container.modal({backdrop: 'static', show: true});
        //if(me.$tabParticipate.parent().hasClass('active')) {
        //    applicantParticipateController.loadData(eventNo);
        //}else{
        //    applicantAwaiterController.loadData(eventNo);
        //}
        if(me.$tabAwaiter.parent().hasClass('active')){
            me.$tabParticipate.click();
        }else{
            applicantParticipateController.loadData(eventNo);
        }

        me.$container.unbind('hidden.bs.modal').on('hidden.bs.modal', function () {
            clubhouseEventMntController.loadListEvent();
        });
    }
});

var applicantParticipateController = new ApplicantParticipateController('#container-applicant-participate');
var applicantAwaiterController = new ApplicantAwaiterController('#container-applicant-awaiter');

