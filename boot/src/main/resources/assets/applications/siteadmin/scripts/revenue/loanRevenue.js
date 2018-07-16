var LoanRevenueController = function (selector) {
    this.init(selector);
};

$.extend(LoanRevenueController.prototype, {
    $container: null,
    tplOption: '<option value="${userNo}">${name}</option>',
    URL: '/admin/loanrevenue/list.json',
    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.tmplRevenueDetail = $('#tmplRevenueDetail');
        me.$tableLoanRevenue                 = me.$container.find('.table-loan-revenue');
        me.revenueYn                 = me.$container.data('revenueYn') == true;
        me.$startDate               = me.$container.find('#start-date');
        me.$endDate                 = me.$container.find('#end-date');
        me.$cboUser                 = me.$container.find('select[name="staffUserNo"]');
        me.$btnSearch               = me.$container.find('.btn-search');
        me.$btnSelectAll       = me.$container.find('.btn-select-all');
        me.$btnApprovePayment       = me.$container.find('.btn-approve-payment');

        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;

        me.$tableLoanRevenue.bootstrapTable({
            url: me.URL,
            smartDisplay: false,
            showHeader:true,
            pageSize: 20,
            pagination: true,
            uniqueId: 'paymentNo',
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            queryParams: function(params) {
                params['startDate'] = $.trim(me.$startDate.val());
                params['endDate'] = $.trim(me.$endDate.val());
                params['staffUserNo'] = me.$cboUser.val();
                return params;
            },
            columns: [
                {
                    field: 'revenueDetailNo',
                    title: 'Chọn',
                    width: '5%',
                    align: 'center',
                    cellStyle: function(value, row, index) {
                        return {
                            classes: 'inbox-small-cells'
                        }
                    },
                    formatter: function(value,object){
                        var checkbox = '<input type="checkbox" data-no="' + object.paymentNo + '">';
                        return checkbox;
                    }
                },{
                    field: 'regDate',
                    title: 'Ngày Thu',
                    align: 'right',
                    formatter: function(value, row){
                        return mugrunApp.formatDate(value, 'DD/MM/YYYY');
                    }
                },{
                    field: 'staffUserName',
                    title: 'NV phụ trách',
                    sortable: true,
                    align: 'center'
                },{
                    field: 'customerCode',
                    title: 'Mã KH',
                    sortable: true,
                    align: 'center'
                },{
                    field: 'customerName',
                    title: 'Tên KH',
                    sortable: true,
                    align: 'left'
                },{
                    field: 'loanAmount',
                    align: 'right',
                    title: 'Số tiền vay',
                    formatter: function(value,object){
                        return mugrunApp.formatNumber(value);
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
                    field: 'amount',
                    align: 'right',
                    title: 'Số tiền thu',
                    formatter: function(value,object){
                        return mugrunApp.formatNumber(value);
                    }
                },{
                    field: 'detailNoList',
                    title: 'Số kỳ thu',
                    align: 'center',
                    formatter: function(value,object){
                        return value.split(',').length;
                    }
                },{
                    field: 'paymentNo',
                    title: '',
                    align: 'right',
                    visible: me.revenueYn,
                    formatter: function(value, row){
                        var strAction = ' <button type="button" class="btn btn-sm btn-circle btn-outline red reject" data-payment-no="' + row.paymentNo + '"  href="#">Từ chối</button> ';
                        return strAction;
                    }
                },{
                    field: 'loanNo',
                    title: 'Chi Tiết',
                    width: 65,
                    align: 'center',
                    formatter: function(value,object){
                        var strAction = ' <a class="loan-detail" data-loan-status="' + object.status + '"  data-loan-no="' + value + '" data-toggle="tooltip" title="Lịch Trả" href="#"><i class="fa fa-calendar" aria-hidden="true"></i></a>';
                        return strAction;
                    }
                }
            ],
            onPostBody: function(){
                setTimeout(function(){
                    $('#amount').text("0 VNĐ")
                    me.$tableLoanRevenue.find('input[type="checkbox"]').change(function(e){
                        me.changeRevenue();
                    });
                }, 500);
            }
        });

        me.$tableLoanRevenue.on('click', 'button.reject', function(){
            var paymentNo = $(this).data("paymentNo");
            me.reject(paymentNo);
        });
        me.$tableLoanRevenue.on('click', 'a.loan-detail', function(){
            var loanNo = $(this).data("loanNo");
            me.openLoanDetailPopup(loanNo, 'WW');
        });


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

        me.$btnApprovePayment.click(function(){
            me.approvePayment();
        });
        me.$btnSelectAll.click(function(){
            me.selectAll();
        });
    },
    changeRevenue: function(){
        var me = this;
        var totalAmount = 0;
        me.$tableLoanRevenue.find('input[type="checkbox"]:checked:not(:disabled)').each(function(i, item){
            var row = me.$tableLoanRevenue.bootstrapTable('getRowByUniqueId', $(this).data("no"));
            totalAmount += row.amount;
        });
        $('#amount').text(mugrunApp.formatNumber(totalAmount) + " VNĐ");

    },
    refreshList: function(url){
        var me = this;
        if(url == undefined){
            me.$tableLoanRevenue.bootstrapTable("refresh");
        }else{
            me.$tableLoanRevenue.bootstrapTable("refresh", {url: url});
        }
    },
    initEventHandlers:function() {
        var me = this;
        me.$btnSearch.on('click', function (e) {
            e.preventDefault();
            me.refreshList();
        });

        me.$cboUser.change(function(){
            me.refreshList();
        });
    },
    selectAll: function(){
        var me = this;
        me.$tableLoanRevenue.find('input[type="checkbox"]:not(:disabled)').prop('checked', true);
        me.changeRevenue();
    },
    reject: function(paymentNo){
        var me = this;
        mugrunApp.showCommonConfirmDialog('Bạn có muốn Từ chối khoản thu này không?', function(){
            $.ajax({
                url: '/admin/loanrevenue/reject.json',
                type: 'POST',
                dataType: 'json',
                data: {
                    paymentNo: paymentNo
                },
                success: function(data) {
                    if (data.success) {
                        me.refreshList();
                    } else {
                        mugrunApp.alertMessage(data.messages);
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask();
                },
                complete: function () {
                    mugrunApp.unmask();
                }
            });
        });
    },
    approvePayment: function(){
        var me = this;
        var paymentNoList = [];
        me.$tableLoanRevenue.find('input[type="checkbox"]:checked:not(:disabled)').each(function(i, item){
            paymentNoList.push($(item).data('no'));
        });

        if(paymentNoList.length > 0) {
            mugrunApp.showCommonConfirmDialog('Bạn có muốn DUYỆT khoản thu này không?', function(){
                $.ajax({
                    url: '/admin/loanrevenue/approve.json',
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(paymentNoList),
                    success: function(data) {
                        if (data.success) {
                            me.refreshList();
                        } else {
                            mugrunApp.alertMessage(data.messages);
                        }
                    },
                    beforeSend: function() {
                        mugrunApp.mask();
                    },
                    complete: function () {
                        mugrunApp.unmask();
                    }
                });
            });


        }else{
            mugrunApp.alertMessage("Vui lòng chọn khoản thu tín dụng cần duyệt.");
        }
    },
    openLoanDetailPopup: function(loanNo, loanStatus){
        var me = this;
        if(loanNo != null && loanNo != ''){
            window.popupPaymentDetailController.open(loanNo, loanStatus, function(){
                me.refreshList();
            });
        }
    }


});

$(document).ready(function(){
    new LoanRevenueController('#container-loan-revenue');
});