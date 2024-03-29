var PlanController = function (selector) {
    this.init(selector);
};

$.extend(PlanController.prototype, {
    $container: null,
    tplOption: '<option value="${userNo}">${name}</option>',
    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$table       = me.$container.find('.table-plan');
        
        me.$btnSearch           = me.$container.find('#btn-search');
        me.$btnPrint            = me.$container.find('#btn-print');
        me.$btnExcel            = me.$container.find('#btn-excel');
        me.$startDate           = me.$container.find('#start-date');
        me.$endDate             = me.$container.find('#end-date');
        me.$staffUserNo         = me.$container.find('select[name="staffUserNo"]');

        me.initEventHandlers();
        me.initUi();
    },
    initUi : function(){
        var me = this;
        me.$table.bootstrapTable({
            url: '/admin/plan/pagination.json',
            smartDisplay: false,
            showHeader:true,
            pagination: false,
            uniqueId: 'costDetailNo',
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            queryParams: function(params) {
                params['userNo'] = me.$staffUserNo.val();
                params['startDate'] = $.trim(me.$startDate.val());
                params['endDate'] = $.trim(me.$endDate.val());
                return params;
            },
            columns: [
                {
                    field: 'staffUserName',
                    title: 'NV phụ trách',
                    sortable: false,
                    align: 'center',
                    width: '12%',
                    formatter: function(value,object){
                        return '<span class="">' + value + '</span>';
                    }
                },{
                    field: 'contractCode',
                    title: 'Mã Hợp Đồng',
                    sortable: false,
                    align: 'center',
                    width: '10%',
                    formatter: function(value,object){
                        return '<span class="">' + value + '</span>';
                    }
                },{
                    field: 'customerCode',
                    title: 'Mã KH',
                    class: 'no-print',
                    sortable: false,
                    width: '10%',
                    align: 'center'
                },{
                    field: 'customerName',
                    title: 'Tên KH',
                    sortable: false,
                    width: '10%',
                    align: 'center'
                },{
                    field: 'loanAmount',
                    align: 'right',
                    width: '10%',
                    title: 'Số tiền vay',
                    formatter: function(value, row){
                        return value? numeral(value).format("0,0") : '-';
                    }
                },{
                    field: 'currentDebt',
                    align: 'right',
                    width: '10%',
                    title: 'Dư Nợ',
                    formatter: function(value, row){
                        return value? numeral(value).format("0,0") : '-';
                    }
                },{
                    field: 'startDate',
                    title: 'Ngày Vay',
                    align: 'center',
                    width: '10%',
                    formatter: function(value,object){
                        var str = mugrunApp.formatDate(object.startDate, 'DD/MM/YYYY');
                        return str;
                    }
                },{
                    field: 'endDate',
                    title: 'Ngày ĐH',
                    align: 'center',
                    width: '10%',
                    formatter: function(value,object){
                        var str = mugrunApp.formatDate(object.endDate, 'DD/MM/YYYY');
                        return str;
                    }
                },{
                    field: 'delayDays',
                    title: 'Trễ Hạn',
                    align: 'center',
                    width: '7%'
                },{
                    field: 'estimateDays',
                    title: 'Ngày Dự Thu',
                    align: 'center',
                    width: '7%'
                },{
                    field: 'total',
                    title: 'Tổng',
                    align: 'center',
                    width: '10%',
                    formatter: function(value, rec){
                        var total = rec.delayDays? rec.delayDays : 0;
                        total = total + (rec.estimateDays? rec.estimateDays : 0);
                        return total;
                    }
                }
            ]
        });



    },
    refreshList: function(){
        var me = this;
        me.$table.bootstrapTable("refresh");
    },
    initEventHandlers:function() {
        var me = this;

        me.$btnExcel.click(function(){
            var downloadUrl = '/admin/plan/download?';
            downloadUrl += 'userNo=' + me.$staffUserNo.val();
            downloadUrl += '&startDate=' + $.trim(me.$startDate.val());
            downloadUrl += '&endDate=' + $.trim(me.$endDate.val());
            window.location.href = downloadUrl;
        });

        me.$btnSearch.click(function(){
            me.$table.bootstrapTable("refresh");
        });

        me.$btnPrint.click(function(){
            me.$table.print({
                title: 'Danh Sach Thu No',
                noPrintSelector: '.no-print',
                timeout: 10000
            });
        });

        me.$startDate.datepicker({
            language: "vi",
            format: "dd/mm/yyyy",
            todayHighlight: true,
            startDate: new Date(),
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

        me.$startDate.datepicker('setDate', new Date());
        me.$endDate.datepicker('setDate', new Date());
    }
});

$(document).ready(function(){
    new PlanController('#container-plan');
});