var CostDetailController = function (selector) {
    this.init(selector);
};

$.extend(CostDetailController.prototype, {
    $container: null,
    tplOption: '<option value="${userNo}">${name}</option>',
    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.tmplCostDetail = $('#tmplCostDetail');
        me.costYn                 = me.$container.data('costYn') == true;
        me.$tableCostDetail                 = me.$container.find('.table-cost-detail');
        
        me.$textSearch                 = me.$container.find('.text-search');
        me.$startDate                 = me.$container.find('#start-date');
        me.$endDate                 = me.$container.find('#end-date');
        me.$costType                 = me.$container.find('#costType');
        me.$btnSearch               = me.$container.find('.btn-search');
        me.$btnAdd                  = me.$container.find('.btn-add');
        me.$btnDelete               = me.$container.find('.btn-delete');
        
        me.$modalCostDetail       = $('#modal-cost-detail');
        me.$modalApprove            = $('#modal-approve-salary');
        me.$form                    = me.$modalCostDetail.find('form');
        me.$name                    = me.$form.find('[name="name"]');
        me.$btnSave                 = me.$modalCostDetail.find('#btn-save-cost-detail');

        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;

        me.$tableCostDetail.bootstrapTable({
            url: '/admin/cost/other/list.json',
            smartDisplay: false,
            showHeader:true,
            pageSize: 20,
            pagination: true,
            uniqueId: 'costDetailNo',
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            queryParams: function(params) {
                params['searchText'] = $.trim(me.$textSearch.val());
                params['startDate'] = $.trim(me.$startDate.val());
                params['endDate'] = $.trim(me.$endDate.val());
                return params;
            },
            columns: [
                {
                    field: 'costDetailNo',
                    title: 'Chọn',
                    width: '6%',
                    align: 'center',
                    cellStyle: function(value, row, index) {
                        return {
                            classes: 'inbox-small-cells'
                        }
                    },
                    formatter: function(value,object){
                        if(object.status != 'A'){
                            return '<input type="checkbox" data-no="' + object.costDetailNo + '">';
                        }else{
                            return '<input disabled="true" type="checkbox" data-no="' + object.costDetailNo + '">';
                        }

                    }
                },{
                    field: 'costTypeName',
                    title: 'Loại Chi Phí',
                    sortable: true,
                    align: 'left',
                    formatter: function(value, row){
                        if(!!value){
                            return row.costType != '13'? value : value + ' (' + row.name + ')';
                        }else{
                            return row.name;
                        }

                    }
                },{
                    field: 'date',
                    title: 'Ngày tháng',
                    sortable: true,
                    align: 'right',
                    formatter: function(value, row){
                        return mugrunApp.formatDate(value, 'DD/MM/YYYY');
                    }

                }, {
                    field: 'amountFormat',
                    title: 'Số Tiền',
                    align: 'center'
                },{
                    field: 'regUserName',
                    title: 'Người Tạo',
                    align: 'center'
                },{
                    field: 'status',
                    title: 'Trạng Thái',
                    align: 'center',
                    formatter: function(value, row){
                        return row.status == 'A'? "Đã Duyệt" : "Đợi Duyệt"
                    }
                }, {
                    field: 'apporve',
                    title: 'Duyệt',
                    visible: me.costYn,
                    align: 'center',
                    formatter: function(value, row){
                        if(row.status != 'A'){
                            var strAction = ' <a href="javascript: void(0);" data-no="' + row.costDetailNo + '" class="approve-cost" data-toggle="tooltip" title="Duyệt Lương"><i class="fa fa-play-circle" aria-hidden="true"></i></a>';
                            return strAction;
                        }else{
                            return '<i class="fa fa-check" aria-hidden="true"></i>';
                        }

                    }
                }, {
                    field: 'edit',
                    title: 'Chỉnh sửa',
                    align: 'center',
                    formatter: function(value, row){
                        if(row.status != 'A'){
                            var strAction = ' <a href="javascript: void(0);" data-no="' + row.costDetailNo + '" class="edit-cost" data-toggle="tooltip" title="Chỉnh sửa bảng lương"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
                            return strAction;
                        }

                    }
                }
            ]
        });

        me.$tableCostDetail.on('click', 'a.edit-cost', function(){
            var row = me.$tableCostDetail.bootstrapTable('getRowByUniqueId', $(this).data("no"));
            me.editCostDetailModal(row);
        });

        me.$tableCostDetail.on('click', 'a.approve-cost', function(){
            var row = me.$tableCostDetail.bootstrapTable('getRowByUniqueId', $(this).data("no"));
            me.approve(row);
        });

        me.$costType.change(function(e){
            var title = me.$costType.find('option:selected').text();
            if(me.$costType.val() == '13'){
                title = '';
            }
            me.$name.val(title);
        });


        me.$form.formValidation({
            framework: 'bootstrap',
            icon: {
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'name': {
                    row: '.col-md-8',
                    validators: {
                        notEmpty: {}
                    }
                },
                'date': {
                    row: '.col-md-5',
                    validators: {
                        notEmpty: {}
                    }
                },
                'amount': {
                    row: '.col-md-5',
                    validators: {
                        notEmpty: {}
                    }
                }
            }
        });

        me.$form.find('[name="date"]').datepicker({
            language: "vi",
            format: "dd/mm/yyyy",
            todayHighlight: true,
            keepEmptyValues: true
        }).on('changeDate', function(e) {
            me.$form.formValidation('revalidateField', 'date');
        });

        mugrunApp.inputNumberOnly(
            me.$form.find('.currency')
        );
        mugrunApp.inputCurrency(
            me.$form.find('.currency')
        );
        me.$modalCostDetail.on("shown.bs.modal", function(){
            var formValidation = me.$form.data('formValidation');
            formValidation.resetForm();
        });
        me.$btnSave.click(function(){
            me.addOrEditCostDetail();
        });


    },
    refreshList: function(){
        var me = this;
        me.$tableCostDetail.bootstrapTable("refresh");
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

        me.$btnSearch.on('click', function (e) {
            e.preventDefault();
            me.refreshList();
        });


        me.$btnDelete.on('click', function(e) {
            e.preventDefault();

            var costDetailNoList = [];
            me.$tableCostDetail.find('input[type="checkbox"]:checked').each(function(i, item){
                costDetailNoList.push($(item).data('no'));
            });

            if(costDetailNoList.length > 0) {
                mugrunApp.showWarningDeleteDialog(function(costDetailNoList) {
                    $.ajax({
                        url: '/admin/cost/other/deleteCostDetail.json',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify(costDetailNoList),
                        success: function(response) {
                            if (response.success) {
                                me.refreshList();
                            } else{
                                mugrunApp.alertMessage(response.messages);
                            }
                        },
                        error: function(){
                            mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                        }
                    });
                }, costDetailNoList);
            }else{
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = "Vui lòng chọn dữ liệu cần xóa.";
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
            }
        });

        me.$btnAdd.on('click', function(e) {
            e.preventDefault();
            me.showCreateCostDetailModal();
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
    },
    showCreateCostDetailModal: function() {
        var me = this;
        me.$form.find('input,textarea').val('');
        me.$costType.trigger('change');
        me.$modalCostDetail.modal('show');
    },
    editCostDetailModal: function(row){
        var me = this;
        me.$form.find('input:hidden[name="costDetailNo"]').val(row.costDetailNo);
        me.$costType.val(row.costType);
        me.$form.find('input[name="name"]').val(row.name);
        me.$form.find('textarea[name="notice"]').val(row.notice);
        me.$form.find('input[name="date"]').val(mugrunApp.formatDate(row.date, 'DD/MM/YYYY'));
        me.$form.find('input[name="amount"]').val(mugrunApp.formatCurrency(row.amount));

        me.$modalCostDetail.modal('show');
    },
    addOrEditCostDetail: function(){
        var me = this;
        var formValidation = me.$form.data('formValidation');
        formValidation.validate();
        if(formValidation.isValid()){
            me.$form.find('input.currency').each(function(){
                $(this).val($(this).val().replaceAll(",", ""));
            });

            $.ajax({
                url: '/admin/cost/other/addOrEditCostDetail.json',
                type: 'POST',
                dataType: 'json',
                data: me.$form.serialize(),
                success: function(data) {
                    if (data.success) {
                        me.$modalCostDetail.modal('hide');
                        me.refreshList();
                        mugrunApp.alertMessage('Dữ liệu đã được cập nhật.');
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
        }
    },
    approve: function(row){
        var me = this;
        mugrunApp.showCommonConfirmDialog('Bạn có muốn DUYỆT chi phí này không?', function(){
            $.ajax({
                url: '/admin/cost/other/approve.json',
                type: 'POST',
                dataType: 'json',
                data: {
                    costDetailNo: row.costDetailNo
                },
                success: function(data) {
                    if (data.success) {
                        me.$modalApprove.modal('hide');
                        me.refreshList();
                        mugrunApp.alertMessage('Chi Phí đã được duyệt.');
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
    }

});

$(document).ready(function(){
    new CostDetailController('#container-cost');
});