var CustomerController = function (selector) {
    this.init(selector);
};

$.extend(CustomerController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$fromSearch                  = me.$container.find('#form-customer-search');
        me.$cboTown                  = me.$fromSearch.find('select[name="townNo"]');
        me.$cboLoanStatus            = me.$fromSearch.find('select[name="loanStatus"]');
        me.$cboUser                  = me.$fromSearch.find('select[name="staffUserNo"]');
        me.$cboSearchType            = me.$fromSearch.find('select[name="searchType"]');
        me.$textSearch               = me.$fromSearch.find('.text-search');
        me.$btnSearch                = me.$fromSearch.find('.btn-search');

        me.$btnAdd                  = me.$container.find('.btn-add');
        me.$btnDelete               = me.$container.find('.btn-delete');
        me.$tableCustomer           = me.$container.find('.table-customer-list');

        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;

        me.$tableCustomer.bootstrapTable({
            url: '/admin/customer/list.json',
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
                params['loanStatus'] = me.$cboLoanStatus.val();
                params['searchType'] = me.$cboSearchType.val();
                return params;
            },
            columns: [
                {
                    field: 'townNo',
                    title: 'Chọn',
                    width: '6%',
                    align: 'center',
                    cellStyle: function(value, row, index) {
                        return {
                            classes: 'inbox-small-cells'
                        }
                    },
                    formatter: function(value,object){
                        return '<input type="checkbox" data-no="' + object.customerNo + '">';
                    }
                }, {
                    field: 'staffUserName',
                    title: 'NV phụ trách',
                    sortable: true,
                    align: 'center'
                },{
                    field: 'customerCode',
                    title: 'Mã Khách Hàng',
                    sortable: true,
                    align: 'center'
                },{
                    field: 'name',
                    title: 'Tên khách hàng',
                    sortable: true,
                    align: 'left'
                }, {
                    field: 'contractCode',
                    title: 'Mã HĐ',
                    align: 'left',
                    formatter: function(value,object){
                        if(value != null && value != ''){
                            return value.replace(/,/g , "<br>");
                        }
                        return '';
                    }
                }, {
                    field: 'currentDebtFmt',
                    title: 'Dư nợ',
                    align: 'center',
                    width: '10%',
                    formatter: function(value,object){
                        return value;
                    }
                },{
                    field: 'delayAmountFmt',
                    title: 'Số kỳ chưa thu',
                    align: 'center',
                    width: '10%',
                    formatter: function(value,object){
                        if(object.delayDays != null && object.delayDays != '' && object.delayDays>0){
                            var val = mugrunApp.formatNumber(object.delayAmount);
                            return '<span data-toggle="tooltip" title="' + value+ '" class="bold red">' + object.delayDays + ' kỳ</span>';
                        }
                        return '-';
                    }
                },{
                    field: 'regDate',
                    title: 'Ngày Tạo',
                    align: 'center',
                    sortable: true,
                    width: '10%',
                    formatter: function(value,object){
                        return mugrunApp.formatDate(value, 'DD/MM/YYYY');
                    }
                },{
                    field: 'regUserName',
                    title: 'Người Tạo',
                    align: 'center',
                    sortable: true,
                    width: '10%'
                }, {
                    field: '',
                    title: 'Sửa',
                    align: 'center',
                    width: 50,
                    formatter: function(value,object){
                        var strAction = ' <a href="javascript:;" data-no="' + object.customerNo + '"  class="customer-edit" data-toggle="tooltip" title="Chỉnh Sửa" href="#"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
                        return strAction;
                    }
                }, {
                    field: '',
                    title: 'C.Tiết',
                    align: 'center',
                    width: 50,
                    formatter: function(value,object){
                        var strAction = ' <a href="/admin/customer/index?action=detail&customerNo=' + object.customerNo + '" class="customer-detail" data-toggle="tooltip" title="Chi tiết" href="#"><i class="fa fa-windows" aria-hidden="true"></i></a>';
                        return strAction;
                    }
                }
            ],
            onDblClickRow: function(row, $element, field){
                window.popupCustomerLoanController.open(row.customerNo);
            },
            onPostBody: function(){
                setTimeout(function(){
                    $('[data-toggle="tooltip"]').tooltip();
                }, 500);
            }
        });

        me.$tableCustomer.on('click', 'a.customer-edit', function(){
            var row = me.$tableCustomer.bootstrapTable('getRowByUniqueId', $(this).data("no"));
            window.popupCustomerController.editCustomer(row, function(){
                me.$tableCustomer.bootstrapTable("refresh");
                $('[data-toggle="tooltip"]').tooltip();
            });
        });
    },
    refreshList: function(){
        var me = this;
        me.$tableCustomer.bootstrapTable("refresh");
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
        me.$cboLoanStatus.change(function(){
            me.refreshList();
        });

        me.$cboUser.change(function(){
            me.refreshList();
        });

        me.$btnSearch.on('click', function (e) {
            e.preventDefault();
            me.refreshList();
        });


        me.$btnDelete.on('click', function(e) {
            e.preventDefault();
            me.deleteCustomer(e);

        });

        me.$btnAdd.on('click', function(e) {
            e.preventDefault();
            window.popupCustomerController.openCreatePopup(function(){
                me.$tableCustomer.bootstrapTable("refresh");
                $('[data-toggle="tooltip"]').tooltip();
            });
        });

    },
    deleteCustomer: function(e){
        var me = this;
        var customerNoList = [];
        me.$tableCustomer.find('input[type="checkbox"]:checked').each(function(i, item){
            customerNoList.push($(item).data('no'));
        });

        if(customerNoList.length > 0) {
            mugrunApp.showWarningDeleteDialog(function(customerNoList) {
                $.ajax({
                    url: '/admin/customer/deleteSelected.json',
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(customerNoList),
                    success: function(response) {
                        if (response.success) {
                            me.refreshList();
                        } else{
                            var errorMessage = "Không thể xóa khách hàng <b>" + response.data + " </b>vì đã có hợp đồng vay."
                            mugrunApp.alertMessage(errorMessage);
                        }
                    },
                    beforeSend: function() {
                        me.$btnDelete.prop('disabled', true);
                        mugrunApp.mask(mugrunApp.getMessage('common.loading'));
                    },
                    complete: function () {
                        me.$btnDelete.prop('disabled', false);
                        mugrunApp.unmask();
                    }
                });
            }, customerNoList);
        }else{
            var title = "Message";
            var message = "Vui long chọn dữ liệu cần xóa.";
            var type = BootstrapDialog.TYPE_PRIMARY;
            var buttonLabel = mugrunApp.getMessage('common.close');
            var buttonClass = 'btn blue';
            mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
        }

    }

});

$(document).ready(function(){
    new CustomerController('#container-customer');
});