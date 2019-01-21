var LoanController = function (selector) {
    this.init(selector);
};

$.extend(LoanController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.approve = me.$container.find('#container-userIndex-contents').data("approveYn");
        me.finish =  me.$container.find('#container-userIndex-contents').data("approveYn");
        me.$cboTown                  = me.$container.find('select[name="townNo"]');
        me.$cboUser                  = me.$container.find('select[name="staffUserNo"]');
        me.$cboDelayType                  = me.$container.find('select[name="delayType"]');
        me.$cboStatus                  = me.$container.find('select[name="status"]');
        me.$cboLoanPayType                  = me.$container.find('select[name="loanPayType"]');
        me.$btnAdd                  = me.$container.find('.btn-add');
        me.$textSearch              = me.$container.find('.text-search');
        me.$btnSearch              = me.$container.find('.btn-search');
        me.$btnDelete               = me.$container.find('.btn-delete');

        me.$tableLoan           = me.$container.find('.table-loan-list');
        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;

        me.$tableLoan.bootstrapTable({
            url: '/admin/loan/list.json',
            smartDisplay: false,
            showHeader:true,
            pageSize: 20,
            pagination: true,
            uniqueId: 'customerNo',
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            checkboxHeader: false,
            queryParams: function(params) {
                params['searchText'] = $.trim(me.$textSearch.val());
                params['townNo'] = me.$cboTown.val();
                params['staffUserNo'] = me.$cboUser.val();
                params['delayType'] = me.$cboDelayType.val();
                params['status'] = me.$cboStatus.val();
                params['loanPayType'] = me.$cboLoanPayType.val();
                return params;
            },
            columns: [
                {
                    field: 'staffUserName',
                    title: 'NV phụ trách',
                    sortable: false,
                    align: 'center',
                    formatter: function(value,object){
                        return '<span class="">' + value + '</span>';
                    }
                },{
                    field: 'customerCode',
                    title: 'Mã KH',
                    sortable: false,
                    align: 'center'
                },{
                    field: 'customerName',
                    title: 'Tên KH',
                    sortable: false,
                    align: 'left'
                },{
                    field: 'loanAmount',
                    align: 'right',
                    title: 'Số tiền vay',
                    formatter: function(value, row){
                        return value? numeral(value).format("0,0") : '-';
                    }
                },{
                    field: 'loanPeriod',
                    title: 'Hạn vay',
                    align: 'center',
                    formatter: function(value,object){
                        var str = object.loanPeriod + ' Tháng';
                        return str;
                    }
                },{
                    field: 'startDate',
                    title: 'Thời Gian Vay',
                    align: 'center',
                    formatter: function(value,object){
                        var str = mugrunApp.formatDate(object.startDate, 'DD/MM/YYYY') + ' ~ ' + mugrunApp.formatDate(object.endDate, 'DD/MM/YYYY');
                        return str;
                    }
                },{
                    field: 'currentDebt',
                    title: 'Dư nợ',
                    align: 'right',
                    formatter: function(value,object){
                        if(object.status == 'F'){
                            return "-";
                        }else{
                            return value? numeral(value).format("0,0") : '-';
                        }
                    }
                },{
                    field: 'delayAmountFormat',
                    title: 'Kỳ chưa thu',
                    align: 'center',
                    formatter: function(value,object){
                        if(object.delayDays != null && object.delayDays != '' && object.delayDays>0){
                            var val = mugrunApp.formatNumber(object.delayAmount);
                            return '<span data-toggle="tooltip" title="' + value+ '" class="bold red">' + object.delayDays + ' kỳ</span>';
                        }
                        return '';
                    }
                }, {
                    field: 'status',
                    title: 'Trại Thái',
                    sortable: false,
                    align: 'center',
                    formatter: function(value,object){
                        if(value == 'F'){
                            return "Đã tất toán";
                        }else{
                            if(object.alreadyPaidSession < object.totalPaySessions){
                                return mugrunApp.getLoanStatus(value);
                            }else{
                                return 'Đã thu đủ'
                            }
                        }
                    }
                }, {
                    field: 'loanNo1',
                    title: 'Duyệt',
                    width: 50,
                    align: 'center',
                    visible: me.approve,
                    formatter: function(value,object){
                        var strAction = '';
                        if(object.status == 'N'){
                            strAction += ' <a class="btn btn-sm btn-circle btn-outline green approve-loan" data-loan-no="' + object.loanNo + '"  href="javascript:;">Duyệt</a> ';
                        }
                        return strAction;
                    }
                }, {
                    field: 'loanNo2',
                    title: 'Trình Tất toán',
                    width: 65,
                    align: 'center',
                    visible: true,
                    formatter: function(value,object){
                        var strAction = '';
                        if(object.status == 'A'){
                            strAction += ' <button type="button" class="btn btn-sm btn-circle btn-outline green stop-loan" data-loan-no="' + object.loanNo + '"  data-toggle="tooltip" title="Tất toán HĐ vay" href="#">Trình Tất Toán</button> ';
                        }
                        return strAction;
                    }
                }, {
                    field: 'loanNo3',
                    title: 'Chi tiết',
                    width: '5%',
                    align: 'center',
                    formatter: function(value,object){
                        var strAction = '';
                        if(object.status != 'N') {
                            strAction = ' <a class="loan-detail" data-loan-status="' + object.status + '"  data-loan-no="' + object.loanNo + '" data-toggle="tooltip" title="Lịch Trả" href="#"><i class="fa fa-windows" aria-hidden="true"></i></a>';
                        }
                        return strAction;
                    }
                }
            ],
            onDblClickRow: function(row, $element, field){

            },
            onPostBody: function(){
                setTimeout(function(){
                    $('[data-toggle="tooltip"]').tooltip();
                }, 500);
            }
        });

        me.$tableLoan.on('click', 'a.loan-detail', function(){
            var loanNo = $(this).data("loanNo");
            var loanStatus = $(this).data("loanStatus");
            me.openLoanDetailPopup(loanNo, loanStatus);
        });
        me.$tableLoan.on('click', 'a.approve-loan', function(){
            var loanNo = $(this).data("loanNo");
            me.approveLoan(loanNo);
        });
        me.$tableLoan.on('click', 'button.stop-loan', function(){
            var loanNo = $(this).data("loanNo");
            window.popupStopLoanController.open(loanNo, function(){
                me.refreshList();
            });
        });

    },
    refreshList: function(){
        var me = this;
        me.$tableLoan.bootstrapTable("refresh");
        $('[data-toggle="tooltip"]').tooltip()
    },
    initEventHandlers:function() {
        var me = this;

        me.$textSearch.keydown(function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                event.preventDefault();
                me.refreshList();
            }
        });
        me.$cboTown.change(function(){
            me.refreshList();
        });
        me.$cboUser.change(function(){
            me.refreshList();
        });
        me.$cboDelayType.change(function(){
            me.refreshList();
        });
        me.$cboStatus.change(function(){
            me.refreshList();
        });
        me.$cboLoanPayType.change(function(){
            me.refreshList();
        });
        me.$btnSearch.on('click', function (e) {
            e.preventDefault();
            me.refreshList();
        });

    },
    openLoanDetailPopup: function(loanNo, loanStatus){
        var me = this;
        if(loanNo != null && loanNo != ''){
            window.popupLoanDetailController.open(loanNo, loanStatus, function(){
                me.refreshList();
            });
        }
    },
    approveLoan: function(loanNo){
        var me = this;
        window.popupApproveLoanController.open(loanNo, function(){
            me.refreshList();
        });

    }

});

$(document).ready(function(){
    new LoanController('#container-loan');
});