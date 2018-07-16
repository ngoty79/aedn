var PaymentController = function (selector) {
    this.init(selector);
};

$.extend(PaymentController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tmplCboStatus           = $('#tmpl-cbo-status');
        me.$cboUser                  = me.$container.find('select[name="staffUserNo"]');
        me.$customerCode               = me.$container.find('#customerCode');
        me.$btnSearch               = me.$container.find('#btn-search');
        me.$btnApprove               = me.$container.find('.btn-approve');
        me.$tableLoan           = me.$container.find('.table-payment-list');
        me.$btnPrint               = me.$container.find('.btn-print');
        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;

        me.$tableLoan.bootstrapTable({
            url: '/admin/payment/list.json',
            smartDisplay: false,
            showHeader:true,
            pageSize: 50,
            pagination: true,
            uniqueId: 'loanNo',
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            checkboxHeader: false,
            queryParams: function(params) {
                params['staffUserNo'] = me.$cboUser.val();
                params['customerCode'] = me.$customerCode.val();
                return params;
            },
            columns: [
                {
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
                    field: 'customerName',
                    title: 'Tên KH',
                    sortable: true,
                    align: 'left'
                },{
                    field: 'loanAmountFormat',
                    align: 'right',
                    title: 'Số tiền vay'
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
                    class: 'no-print',
                    align: 'center',
                    formatter: function(value,object){
                        var str = mugrunApp.formatDate(object.startDate, 'DD/MM/YYYY') + ' ~ ' + mugrunApp.formatDate(object.endDate, 'DD/MM/YYYY');
                        return str;
                    }
                },{
                    field: 'alreadyPaidSession',
                    title: 'Kỳ đã thu',
                    align: 'center'
                },{
                    field: 'currentDebtFormat',
                    title: 'Dư nợ',
                    align: 'right'
                },{
                    field: 'delayAmountFormat',
                    title: 'Kỳ chưa thu',
                    align: 'center',
                    formatter: function(value,object){
                        if(object.delayDays != null && object.delayDays != '' && object.delayDays>0){
                            return '<span data-toggle="tooltip" title="' + value+ '" class="bold red">' + object.delayDays + ' kỳ</span>';
                        }
                        return '';
                    }
                },{
                    field: 'payBySessionFormat',
                    title: 'Tiền Thu/kỳ',
                    align: 'right',
                    sortable: true,
                    formatter: function(value,object){
                        return '<span class="bold blue">' + value + '</span>';
                    }
                },{
                    field: 'session',
                    title: 'Số kỳ thu',
                    class: 'no-print',
                    align: 'center',
                    sortable: true,
                    formatter: function(value,object){
                        if(object.alreadyPaidSession < object.totalPaySessions){
                            return '<input type="number" class="quanlity" data-loan-no="' + object.loanNo + '" style="width: 45px;" value="" />';
                        }else{
                            return "Thu đủ";
                        }

                    }
                },{
                    field: 'status',
                    title: 'Tồng',
                    align: 'right',
                    width: 120,
                    formatter: function(value,object){
                        return '<span id="loanNo_' + object.loanNo + '">-</span>'
                    }
                },{
                    field: 'loanNo',
                    title: 'Lịch Trả',
                    width: 65,
                    class: 'no-print',
                    align: 'center',
                    formatter: function(value,object){
                        var strAction = '';
                        if(object.status == 'A' || object.status == 'F') {
                            var strAction = ' <a class="loan-detail" data-loan-status="' + object.status + '"  data-loan-no="' + value + '" data-toggle="tooltip" title="Lịch Trả" href="#"><i class="fa fa-calendar" aria-hidden="true"></i></a>';
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

        setTimeout(function(){
            me.$container.on('change', '.select-status', function(){
                me.changeStatus($(this));
            });
        }, 1000);

        me.$tableLoan.on('change', 'input.quanlity', function(){
            var loanNo = $(this).data("loanNo"),
                val = $(this).val();
            var row = me.$tableLoan.bootstrapTable('getRowByUniqueId', loanNo);
            var session = (parseInt(val) == 'NaN' || parseInt(val)<=0)? 0 : parseInt(val);
            $(this).val(session);
            var amount = mugrunApp.formatNumber(session * row.payBySession);
            $('#loanNo_' + loanNo).text(amount);
        });

        me.$tableLoan.on('click', 'a.loan-detail', function(){
            var loanNo = $(this).data("loanNo");
            var loanStatus = $(this).data("loanStatus");
            me.openLoanDetailPopup(loanNo, loanStatus);
        });

    },
    changeStatus: function($select){
        var me = this;
        var loanDetailNo = $select.data().loanDetailNo;
        $.ajax({
            url: '/admin/loan/changeLoanDetailStatus.json',
            type: 'GET',
            dataType: 'json',
            data: {
                loanDetailNo: loanDetailNo,
                status: $select.val()
            },
            success: function(data) {
                if(data.success == true){
                    me.refreshList();
                }
            },
            beforeSend: function() {
                mugrunApp.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                mugrunApp.unmask();
            }
        });
    },
    refreshList: function(){
        var me = this;
        me.$tableLoan.bootstrapTable("refresh");
        $('[data-toggle="tooltip"]').tooltip()
    },
    initEventHandlers:function() {
        var me = this;
        me.$cboUser.change(function(){
            me.refreshList();
        });

        me.$btnSearch.click(function(){
            me.refreshList();
        });

        me.$btnApprove.click(function(){
            me.approvePayment();
        });
        me.$btnPrint.click(function(){
            me.$tableLoan.print({
                title: "Danh sách nộp tiền"
            });
        });


        me.$container.find('form').find('select,input').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                event.preventDefault();
                me.refreshList();
            }
        });

    },
    approvePayment: function(){
        var me = this,
            data = [];

        me.$tableLoan.find('input.quanlity').each(function(){
            var val = $(this).val();
            if($.trim(val) != '' && val != '0'){
                data.push({
                    loanNo: $(this).data("loanNo"),
                    delayDays: val
                });
            }
        });
        if(data.length>0){
            mugrunApp.showCommonConfirmDialog('Bạn có đồng ý Duyệt nộp tiền vay đã chọn không?', function(){
                $.ajax({
                    url: '/admin/payment/approve.json',
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(data),
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
            mugrunApp.alertMessage('Xin nhập số kỳ thu.');
        }

    },
    openLoanDetailPopup: function(loanNo, loanStatus){
        var me = this;
        if(loanNo != null && loanNo != ''){
            window.popupPaymentDetailController.open(loanNo, '', function(){
                me.refreshList();
            });
        }
    }


});

$(document).ready(function(){
    new PaymentController('#container-payment-single');
});