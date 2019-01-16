var MoenyFlowController = function (selector) {
    this.init(selector);
};

$.extend(MoenyFlowController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tmplCboStatus           = $('#tmpl-cbo-status');
        me.$cash                    = me.$container.find('input[name="cash"]');
        me.$startDate               = me.$container.find('#start-date');
        me.$endDate                 = me.$container.find('#end-date');
        me.$btnSearch                 = me.$container.find('#btn-search');

        me.$tableMoneyFlow           = me.$container.find('.table-money-flow');
        me.initUi();
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

        me.$cash.val(mugrunApp.formatNumber(me.$cash.val()));

        me.$btnSearch.click(function(){
            me.refreshList();
        });

        me.$tableMoneyFlow.bootstrapTable({
            url: '/admin/moneyflow/list.json',
            smartDisplay: false,
            showHeader:true,
            pageSize: 30,
            pagination: true,
            uniqueId: 'customerNo',
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            checkboxHeader: false,
            queryParams: function(params) {
                params['startDate'] = $.trim(me.$startDate.val());
                params['endDate'] = $.trim(me.$endDate.val());
                return params;
            },
            columns: [
                {
                    field: 'title',
                    title: 'Tiêu đề',
                    align: 'left',
                    width: '20%'
                },{
                    field: 'type',
                    title: 'Phân Loại',
                    align: 'left',
                    width: '15%',
                    formatter: function(value, row){
                        return me.getType(value);
                    }
                },{
                    field: 'regUserName',
                    title: 'N.sự duyệt',
                    align: 'center',
                    width: '10%'
                },{
                    field: 'amount',
                    title: 'Số tiền',
                    align: 'right',
                    width: '10%',
                    formatter: function(value, row){
                        return value? numeral(value).format("0,0") : '-';
                    }
                },{
                    field: 'remainCash',
                    title: 'Dư Số',
                    align: 'right',
                    width: '10%',
                    formatter: function(value, row){
                        return value? numeral(value).format("0,0") : '-';
                    }
                },{
                    field: 'regDate',
                    title: 'Ngày Tháng',
                    align: 'center',
                    width: '10%',
                    formatter: function(value, row){
                        return mugrunApp.formatDate(value, 'DD/MM/YYYY HH:mm');
                    }
                }, {
                    field: 'notice',
                    title: 'Ghi chú',
                    sortable: true,
                    align: 'left',
                    formatter: function(value, row){
                        if(value != null && value != ''){
                            return '<div style="white-space: pre;">' + value + '</div>';
                        }else{
                            return '';
                        }

                    }
                }
            ],
            onDblClickRow: function(row, $element, field){

            },
            onPostBody: function(){

            }
        });

    },
    refreshList: function(){
        var me = this;
        me.$tableMoneyFlow.bootstrapTable("refresh");
    },
    getType: function(type){
        var str = "";
        switch(type) {
            case "1":
                str = "Giải Ngân HĐ vay";
                break;
            case "2":
                str = "Tiên lương";
                break;
            case "3":
                str = "Chi phí khác";
                break;
            case "4":
                str = "Thu từ khách hàng";
                break;
            case "5":
                str = "";
                break;
            case "6":
                str = "Tiền thu tất toán HĐ";
                break;
            case "7":
                str = "Khoản thu khác";
                break;
            case "8":
                str = "Tăng Nguồn vốn";
                break;
            case "9":
                str = "Giảm Nguồn vốn";
                break;

            default:
                str = "";
        }
        return str;
    }


});

$(document).ready(function(){
    new MoenyFlowController('#container-money-flow');
});