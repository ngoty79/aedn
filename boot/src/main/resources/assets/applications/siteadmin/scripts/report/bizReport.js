var BizReportController = function (selector) {
    this.init(selector);
};

$.extend(BizReportController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$modal                   = $('#modal-detail');
        me.$table                   = $('#table-detail');
        me.$startDate               = me.$container.find('#start-date');
        me.$endDate                 = me.$container.find('#end-date');
        me.$selectRevenue              = me.$modal.find('#select-revenue');
        me.$selectCost              = me.$modal.find('#select-cost');
        me.$btnSearch               = me.$container.find('#btn-search');
        me.$btnDownload               = me.$container.find('#btn-download-excel');
        me.$selectViewType          = me.$container.find('select[name="viewType"]');

        me.initUi();
        me.search();
    },
    initUi : function(){
        var me = this;
        me.$startDate.datepicker({
            language: "vi",
            format: "dd/mm/yyyy",
            todayHighlight: true,
            keepEmptyValues: true
        }).on('changeDate', function(e) {
            me.$endDate.datepicker('setStartDate', e.date);
        });
        me.$endDate.datepicker({
            language: "vi",
            format: "dd/mm/yyyy",
            todayHighlight: true,
            keepEmptyValues: true
        }).on('changeDate', function(e) {
            me.$startDate.datepicker('setEndDate', e.date);
        });

        me.$table.bootstrapTable({
            url: '',
            smartDisplay: false,
            showHeader:true,
            pageSize: 30,
            pagination: true,
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            queryParams: function(params) {
                params['commonCode'] = me.commonCode;
                params['startApproveDate'] = me.startDate;
                params['endApproveDate'] = me.endDate;
                return params;
            },
            columns: [
                {
                    field: 'name',
                    title: 'Title'
                }, {
                    field: 'amount',
                    title: 'Số Tiền',
                    align: 'right',
                    formatter: function(value, row){
                        return numeral(value).format('0,0');
                    }
                },{
                    field: 'date',
                    title: 'Ngày lập',
                    sortable: true,
                    align: 'center',
                    formatter: function(value, row){
                        return mugrunApp.formatDate(value, 'DD/MM/YYYY');
                    }

                },{
                    field: 'approveDate',
                    title: 'Ngày duyệt',
                    align: 'center',
                    formatter: function(value, row){
                        return mugrunApp.formatDate(value, 'DD/MM/YYYY');
                    }
                },{
                    field: 'approveUserName',
                    title: 'Người duyệt',
                    align: 'center'
                }
            ]
        });

        me.$btnSearch.click(function(){
            me.search();
        });

        me.$btnDownload.click(function(){
            window.location.href = '/admin/bizreport/download?month=' + me.$selectViewType.val();
        });
    },
    search: function(){
        var me = this;
        $('#container-report-view').load('/admin/bizreport/get.html?month=' + me.$selectViewType.val(), function(){
            $('[data-toggle="tooltip"]').tooltip();

            $('[data-toggle="tooltip"]').click(function(e){
                var data = $(this).closest('td').data();
                me.showDetail(data);
            });
        });
    },
    showDetail: function(data){
        var me = this;
        me.commonCode = data.commonCode;
        me.year = data.monthYear.split('-')[0];
        me.month = parseInt(data.monthYear.split('-')[1]);

        me.startDate = moment().year(me.year).month(me.month - 1).date(1).format('DD/MM/YYYY');
        me.endDate = moment().year(me.year).month(me.month - 1).date(1).endOf('month').format('DD/MM/YYYY');

        var url = '/admin/revenue/list.json';
        if(data.type != 'revenue'){
            url = '/admin/cost/other/list.json';
            me.$selectRevenue.hide();
            me.$selectCost.show();
            me.$selectCost.val(me.commonCode);
        }else{
            me.$selectRevenue.show();
            me.$selectCost.hide();
            me.$selectRevenue.val(me.commonCode);
        }

        me.$startDate.datepicker('setDate',  me.startDate);
        me.$endDate.datepicker('setDate',  me.endDate);
        me.$table.bootstrapTable('refresh', {url: url});

        me.$modal.modal('show');
    }


});

$(document).ready(function(){
    new BizReportController('#container-biz-report');
});