var PlanController = function (selector) {
    this.init(selector);
};

$.extend(PlanController.prototype, {
    $container: null,
    tplOption: '<option value="${userNo}">${name}</option>',
    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.costYn                 = me.$container.data('costYn') == true;
        me.$tableCostDetail       = me.$container.find('.table-plan');
        
        me.$startDate           = me.$container.find('#start-date');
        me.$endDate             = me.$container.find('#end-date');
        me.$staffUserNo         = me.$container.find('select[name="staffUserNo"]');

        //me.initUi();
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
                params['userNo'] = me.$staffUserNo.val();
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
                    field: 'name',
                    title: 'Loại Chi Phí',
                    sortable: true,
                    align: 'left'
                },{
                    field: 'date',
                    title: 'Ngày lập',
                    sortable: true,
                    align: 'right',
                    formatter: function(value, row){
                        return mugrunApp.formatDate(value, 'DD/MM/YYYY');
                    }

                },{
                    field: 'approveDate',
                    title: 'Ngày duyệt',
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
        me.$form.find('[name="date"]').datepicker('setDate', mugrunApp.formatDate(row.date, 'DD/MM/YYYY'));
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
    new PlanController('#container-plan');
});