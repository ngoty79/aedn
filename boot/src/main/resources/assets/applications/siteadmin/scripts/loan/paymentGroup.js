var PaymentGroupController = function (selector) {
    this.selector = selector;
};

$.extend(PaymentGroupController.prototype, {
    $container: null,

    init: function (data) {
        var me = this;

        me.$container = $(me.selector);
        me.$tmplGroup = $('#tmpl-group-setting');
        me.$cboUser                  = me.$container.find('select[name="staffUserNo"]');
        me.$customerCode               = me.$container.find('#customerCode');
        me.$paymentGroup               = me.$container.find('#paymentGroup');
        me.$btnAdd               = me.$container.find('#btn-add-to-group');
        me.$chkAllRest               = me.$container.find('#all-rest-customer');
        me.$containerPaymentGroup               = me.$container.find('.container-payment-group');
        me.$btnPrint               = me.$container.find('.btn-print');
        me.$btnApprove               = me.$container.find('.btn-approve');
        me.data = data;
        me.groupConfig = {};
        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;
        me.initSelect2(me.data.loanList)

    },
    initSelect2: function(dataList){
        var me = this;
        me.$customerCode.select2({
            placeholder: 'Nhập Mã Khách Hàng',
            data: dataList,
            width: '100%'
        });
        me.$customerCode.select2('val', null);
    },
    initEventHandlers:function() {
        var me = this;
        mugrunApp.inputNumberOnly(me.$paymentGroup);
        me.$chkAllRest.change(function(){
            me.$customerCode.select2("enable",!$(this).is(':checked'));
        });
        me.$cboUser.change(function(){
            me.changeStaff();
        });
        me.$btnAdd.click(function(){
            me.addLoanToGroup();
        });

        me.$btnPrint.click(function(){
            $('#container-print').print({
                title: "Danh sách nộp tiền"
            });
        });

        me.$btnApprove.click(function(){
            me.approvePayment();
        });
    },
    changeStaff: function(){
        var me = this;
        for (var index in me.groupConfig) {
            if (me.groupConfig.hasOwnProperty(index)) {
                var $table = me.groupConfig[index];
                $table.bootstrapTable('removeAll');
            }
        }
        $.ajax({
            url: '/admin/payment/list.json',
            type: 'GET',
            dataType: 'json',
            data: {
                pageNumber: 1,
                pageSize: 500,
                staffUserNo: me.$cboUser.val()
            },
            success: function(data) {
                me.data.loanList = data.rows;
                me.$customerCode.html('').select2({data: data.rows});
            },
            beforeSend: function() {
                mugrunApp.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                mugrunApp.unmask();
            }
        });
    },
    removeData: function(selectedData){
        var me = this,
            dataList = [];

        $.each(me.data.loanList, function(index, record){
            var flag = true;
            for(var i=0; i < selectedData.length; i++){
                if(selectedData[i].loanNo == record.loanNo){
                    flag = false;
                    break;
                }
            }
            if(flag){
                dataList.push(record);
            }
        });

        me.data.loanList = dataList;
        me.$customerCode.html('');
        me.$customerCode.select2('destroy');
        me.initSelect2(dataList);
    },
    addData: function(record){
        var me = this;
        me.data.loanList.push(record);
        me.$customerCode.html('');
        me.$customerCode.select2('destroy');
        me.initSelect2(me.data.loanList);
    },
    addLoanToGroup: function(){
        var me = this,
            selectedData = me.$customerCode.select2('data');
        if(me.$chkAllRest.is(':checked')){
            selectedData = me.data.loanList;
        }
        var groupNo = me.$paymentGroup.val();
        if(selectedData.length>0 && groupNo != ''){
            if(me.groupConfig[groupNo] == null){
                var groupName= "Nộp " + groupNo + " kỳ.";
                var $groupTemplate = $.tmpl(me.$tmplGroup.html(), {
                    groupNo: groupNo,
                    groupName: groupName
                });

                me.$containerPaymentGroup.append($groupTemplate);
                me.groupConfig[groupNo] = $('#' + groupNo).find('table.table-payment-group');
                me.initTableGroupData(me.groupConfig[groupNo], selectedData, groupNo);
            }else{
                me.groupConfig[groupNo].bootstrapTable('append', selectedData);
            }
            me.removeData(selectedData);
        }

    },

    initTableGroupData: function($table, selectedData, groupNo){
        var me = this;
        $table.groupNo = groupNo;
        $table.bootstrapTable({
            smartDisplay: false,
            showHeader:true,
            pagination: false,
            uniqueId: 'loanNo',
            data: selectedData,
            columns: [
                {
                    field: 'order',
                    title: 'STT',
                    width: 15,
                    align: 'center',
                    formatter: function(value,object, index, field){
                        return '<span class="">' + (index + 1) + '</span>';
                    }
                },{
                    field: 'staffUserName',
                    title: 'NV phụ trách',
                    sortable: true,
                    align: 'left',
                    width: '15%',
                    formatter: function(value,object){
                        return '<span class="">' + value + '</span>';
                    }
                },{
                    field: 'customerCode',
                    title: 'Mã KH',
                    width: '8%',
                    sortable: true,
                    align: 'left'
                },{
                    field: 'customerName',
                    title: 'Tên KH',
                    sortable: true,
                    width: '20%',
                    align: 'left'
                },{
                    field: 'loanAmountFormat',
                    align: 'right',
                    width: '10%',
                    title: 'Số tiền vay'
                },{
                    field: 'loanPeriod',
                    title: 'Hạn vay',
                    align: 'center',
                    width: '8%',
                    formatter: function(value,object){
                        var str = object.loanPeriod + ' Tháng';
                        return str;
                    }
                },{
                    field: 'payBySessionFormat',
                    title: 'Tiền Thu/kỳ',
                    align: 'right',
                    width: '15%',
                    formatter: function(value,object){
                        return '<span class="bold blue">' + value + '</span>';
                    }
                },{
                    field: 'session',
                    title: 'Số kỳ thu',
                    align: 'center',
                    width: '8%',
                    formatter: function(value,object){
                        if(object.alreadyPaidSession < object.totalPaySessions){
                            var str = '<input type="number" readonly class="quanlity hide" data-loan-no="' + object.loanNo + '" style="width: 38px;" value="' + groupNo + '" />';
                            str += '<span>' + groupNo + '</span>'
                            return str;
                        }
                    }
                },{
                    field: 'payBySession',
                    title: 'Tổng',
                    align: 'right',
                    with: '15%',
                    formatter: function(value,object){
                        var session = parseInt(groupNo);
                        return mugrunApp.formatNumber(session * value);
                    }
                },{
                    field: 'loanNo',
                    title: 'Xóa',
                    width: 65,
                    align: 'center',
                    class: 'no-print',
                    formatter: function(value, object){
                        var strAction = ' <a class="btn-remove-loan" data-loan-no="' + value + '"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                        return strAction;
                    }
                }
            ],
            onPostBody: function(){
                setTimeout(function(){
                    me.calculateTotalAmount();
                }, 500);
            }
        });

        $table.on('click', '.btn-remove-loan', function(){
            var loanNo = $(this).data('loanNo');
            var record = $table.bootstrapTable('getRowByUniqueId', loanNo);
            $table.bootstrapTable('removeByUniqueId', loanNo);
            me.addData(record);
        });

    },
    calculateTotalAmount: function(){
        var me = this,
            amount = 0;

        for (var index in me.groupConfig) {
            if (me.groupConfig.hasOwnProperty(index)) {
                var $table = me.groupConfig[index];
                var rows = $table.bootstrapTable('getData');
                var session = parseInt($table.groupNo);
                $.each(rows, function(idx, row){
                    amount += session * row.payBySession;
                });

            }
        }
        $('#total-group-amount').text('Tổng: ' + mugrunApp.formatNumber(amount) + ' VNĐ.');
    },
    approvePayment: function(){
        var me = this,
            data = [];
        for (var index in me.groupConfig) {
            if (me.groupConfig.hasOwnProperty(index)) {
                var $table = me.groupConfig[index];
                $table.find('input.quanlity').each(function(){
                    var val = $(this).val();
                    if($.trim(val) != '' && val != '0'){
                        data.push({
                            loanNo: $(this).data("loanNo"),
                            delayDays: val
                        });
                    }
                });
            }
        }


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
                            mugrunApp.alertMessage('Nộp tiền hoàn thành. Đã chuyển qua danh sách đợi khớp quỹ.');
                            me.$cboUser.trigger('change');
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

    }


});

var paymentGroupController = new PaymentGroupController('#container-payment-group');

