var WaitingApproveController = function (selector) {
    this.init(selector);
};

$.extend(WaitingApproveController.prototype, {
    $container: null,
    tmplButton: '<div class="btn-group btn-group-circle">' +
                '<button type="button" data-loan-no="${loanNo}" class="btn btn-outline green btn-sm approve-loan">Duyệt</button>' +
                '<button type="button" data-loan-no="${loanNo}" class="btn btn-outline red btn-sm deny-loan">Từ Chối</button>' +
                '</div>',
    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.approve = me.$container.data("approveYn");
        me.finish =  me.$container.data("approveYn");
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
                params['townNo'] = me.$cboTown.val();
                params['staffUserNo'] = me.$cboUser.val();
                params['status'] ="N";
                return params;
            },
            columns: [
                {
                    field: 'customerNo',
                    title: 'Chi Tiết',
                    sortable: true,
                    align: 'center',
                    width: '8%',
                    formatter: function(value,object){
                        return '<button type="button" data-customer-no="' + value + '" class="btn btn-outline btn-circle green btn-sm btn-customer-loan">xem</button>';
                    }
                },{
                    field: 'staffUserName',
                    title: 'NV phụ trách',
                    sortable: true,
                    align: 'center',
                    formatter: function(value,object){
                        return '<span class="">' + value + '</span>';
                    }
                },{
                    field: 'customerCode',
                    title: 'Mã KH',
                    sortable: true,
                    align: 'center'
                },{
                    field: 'contractCode',
                    title: 'Mã HĐ',
                    sortable: true,
                    align: 'left'
                }, {
                    field: 'customerName',
                    title: 'Tên KH',
                    sortable: true,
                    align: 'left'
                },{
                    field: 'loanAmountFormat',
                    align: 'right',
                    title: 'Số tiền vay'
                },{
                    field: 'loanInterest',
                    align: 'right',
                    title: 'Lãi suất',
                    formatter: function(value,object){
                        return value + " %";
                    }
                },{
                    field: 'loanPeriod',
                    title: 'Thời Hạn Vay',
                    align: 'center',
                    formatter: function(value,object){
                        return object.loanPeriod + ' Tháng';
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
                    field: 'townName',
                    title: 'Khu vực',
                    sortable: true,
                    align: 'center'
                }, {
                    field: 'loanNo',
                    title: 'Duyệt',
                    align: 'center',
                    visible: me.approve,
                    formatter: function(value,object){
                        var strAction = $('<div></div>');
                        if(object.status == 'N'){
                            strAction.append($.tmpl(me.tmplButton, {loanNo: value}));
                        }
                        return strAction.html();
                    }
                }
            ]
        });

        me.$tableLoan.on('click', '.approve-loan', function(){
            var loanNo = $(this).data("loanNo");
            me.approveLoan(loanNo);
        });
        me.$tableLoan.on('click', '.btn-customer-loan', function(){
            var customerNo = $(this).data("customerNo");
            window.popupCustomerLoanController.open(customerNo);
        });
        me.$tableLoan.on('click', '.deny-loan', function(){
            var loanNo = $(this).data("loanNo");
            me.denyLoan(loanNo);
        });

    },
    refreshList: function(){
        var me = this;
        me.$tableLoan.bootstrapTable("refresh");
        $('[data-toggle="tooltip"]').tooltip()
    },
    initEventHandlers:function() {
        var me = this;
        me.$cboTown.change(function(){
            me.refreshList();
        });
        me.$cboUser.change(function(){
            me.refreshList();
        });
    },
    approveLoan: function(loanNo){
        var me = this;
        window.popupApproveLoanController.open(loanNo, function(){
            me.refreshList();
        });
    },
    denyLoan: function(loanNo){
        var me = this;
        window.popupApproveLoanController.denyLoan(loanNo, function(){
            me.refreshList();
        });
    }

});

$(document).ready(function(){
    new WaitingApproveController('#container-loan');
});