var EstimateController = function (selector) {
    this.init(selector);
};

$.extend(EstimateController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tmplEstimateCost        = $('#tmplEstimateCost');
        me.$tmplEstimateRevenue     = $('#tmplEstimateRevenue');
        me.$startDate               = me.$container.find('#start-date');
        me.$endDate                 = me.$container.find('#end-date');
        me.$btnSearch               = me.$container.find('#btn-search');
        me.$tableEstimateCost       = me.$container.find('#table-estimate-cost');
        me.$tableEstimateRevenue    = me.$container.find('#table-estimate-revenue');

        me.initUi();
    },
    initUi : function(){
        var me = this;

        me.$startDate.datepicker({
            language: "vi",
            format: "dd/mm/yyyy",
            todayHighlight: true,
            keepEmptyValues: true,
            startDate: new Date(),
        }).on('changeDate', function(e) {
            me.$endDate.datepicker('setStartDate', e.date);
        });
        me.$endDate.datepicker({
            language: "vi",
            format: "dd/mm/yyyy",
            todayHighlight: true,
            keepEmptyValues: true,
            startDate: new Date(),
        }).on('changeDate', function(e) {
            me.$startDate.datepicker('setEndDate', e.date);
        });

        me.$btnSearch.click(function(){
            me.search();
        });
    },
    search: function(){
        var me = this;
        $.ajax({
            url: '/admin/estimate/cost.json',
            type: 'GET',
            dataType: 'json',
            data: {
                startDate: me.$startDate.val(),
                endDate: me.$endDate.val()
            },
            success: function(data) {
                me.$tableEstimateCost.find('tbody').empty()
                    .append($.tmpl(me.$tmplEstimateCost.html(), data));
                me.$tableEstimateRevenue.find('tbody').empty()
                    .append($.tmpl(me.$tmplEstimateRevenue.html(), data));

            },
            beforeSend: function() {
                mugrunApp.mask();
            },
            complete: function () {
                mugrunApp.unmask();
            },
            error: function() {
                mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
            }
        });
    }


});

$(document).ready(function(){
    new EstimateController('#container-report-estimate');
});