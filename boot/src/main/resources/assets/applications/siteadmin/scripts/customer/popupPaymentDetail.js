var PopupPaymentDetailController = function (selector) {
    this.init(selector);
};

$.extend(PopupPaymentDetailController.prototype, {
    $container: null,
    init: function (selector) {
        var me = this;
        me.$container = $(selector);
        me.$modalLoanDetail               = me.$container;
        me.$cboStatus                  = me.$container.find('select[name="status"]');
        me.initEventHandlers();

    },
    initUI : function(){
        var me = this;
        me.$table = me.$modalLoanDetail.find('#table-loan-detail-list');
        me.$table.bootstrapTable({
            url: '/admin/loan/getLoanDetailList.json',
            smartDisplay: false,
            showHeader:true,
            pageSize: 180,
            pagination: true,
            height: 500,
            uniqueId: 'loanDetailNo',
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            checkboxHeader: false,
            queryParams: function(params) {
                params.loanNo = me.loanNo;
                params['status'] = me.$cboStatus.val();
                return params;
            },
            columns: [
                {
                    field: 'no',
                    title: 'STT',
                    width: '10%',
                    align: 'center'
                }, {
                    field: 'startDate',
                    title: 'Thời Gian',
                    align: 'center',
                    formatter: function(value,object){
                        return mugrunApp.formatDate(value, 'DD/MM/YYYY') + ' ~ ' + mugrunApp.formatDate(object.endDate, 'DD/MM/YYYY');
                    }
                }, {
                    field: 'totalDays',
                    title: 'Số ngày',
                    width: '14%',
                    align: 'center',
                    formatter: function(value,object){
                        return value + ' ngày';
                    }
                }, {
                    field: 'amountFormat',
                    title: 'Tiền trả hàng kỳ',
                    align: 'center'
                }, {
                    field: 'status',
                    title: 'Trang Thái',
                    align: 'center',
                    formatter: function(value,object){
                        return mugrunApp.getLoanPaymentStatus(value);
                    }
                }, {
                    field: 'confirmDate',
                    title: 'Ngày Khớp Quỹ',
                    align: 'center',
                    formatter: function(value,object){
                        if(object.status == 'P'){
                            if(value != null){
                                return mugrunApp.formatDate(value, 'DD/MM/YYYY');
                            }else{
                                return 'Chưa khớp quỹ';
                            }
                        }
                    }
                }
            ],
            onDblClickRow: function(row, $element, field){

            },
            onPostBody: function(){

            }
        });

        me.$table.bootstrapTable('refresh');
    },
    initEventHandlers:function() {
        var me = this;
        me.$cboStatus.change(function(){
            me.refreshList();
        });

    },
    refreshList: function(){
        var me = this;
        me.$table.bootstrapTable("refresh");
    },
    open: function(loanNo, status, callbackFn) {
        var me = this;
        me.callbackFn = callbackFn;
        me.$cboStatus.val(status);
        me.loanNo = loanNo;
        me.initUI();

        me.$modalLoanDetail.modal({show: true, backdrop: 'static'});
    }

});

$(document).ready(function(){
    window.popupPaymentDetailController = new PopupPaymentDetailController('#modal-payment-detail');
});