var SalaryMasterController = function (selector) {
    this.init(selector);
};

$.extend(SalaryMasterController.prototype, {
    $container: null,
    tplOption: '<option value="${userNo}">${name}</option>',
    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tabSalaryManage         = me.$container.find('#tab_salary_management');
        me.$modalSalaryMst         = me.$container.find('#modal-create-salary-mst');
        me.$formCreateSalaryMst     = me.$modalSalaryMst.find('form');
        me.$btnSaveSalaryMst     = me.$modalSalaryMst.find('#btn-save-salary-mst');

        me.$textSearch              = me.$tabSalaryManage.find('.text-search');
        me.$btnSearch               = me.$tabSalaryManage.find('.btn-search');
        me.$btnAdd                  = me.$tabSalaryManage.find('.btn-add');
        me.$btnDelete               = me.$tabSalaryManage.find('.btn-delete');
        me.$tableSalaryManage       = me.$tabSalaryManage.find('.table-salary-manage');

        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;

        me.$tableSalaryManage.bootstrapTable({
            url: '/admin/cost/salary/list.json',
            smartDisplay: false,
            showHeader:true,
            pageSize: 20,
            pagination: true,
            uniqueId: 'salaryMasterNo',
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            queryParams: function(params) {
                params['searchText'] = $.trim(me.$textSearch.val());
                return params;
            },
            columns: [
                {
                    field: 'salaryMasterNo',
                    title: 'Chọn',
                    width: '10%',
                    align: 'center',
                    cellStyle: function(value, row, index) {
                        return {
                            classes: 'inbox-small-cells'
                        }
                    },
                    formatter: function(value,object){
                        return '<input type="checkbox" data-no="' + object.salaryMasterNo + '">';
                    }
                },{
                    field: 'userName',
                    title: 'Nhân Viên',
                    sortable: true,
                    width: '40%',
                    align: 'left'
                }, {
                    field: 'salaryFormat',
                    title: 'Lương cơ bản',
                    align: 'center'
                }, {
                    field: 'allowanceFormat',
                    title: 'Phụ cấp',
                    align: 'center'
                }, {
                    field: '',
                    title: 'Chỉnh sửa',
                    align: 'center',
                    formatter: function(value, row){
                        var strAction = ' <a href="javascript: void(0);" data-no="' + row.salaryMasterNo + '" class="edit-salary-mst" data-toggle="tooltip" title="Chỉnh sửa bảng lương"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
                        return strAction;
                    }
                }
            ]
        });

        me.$tableSalaryManage.on('click', 'a.edit-salary-mst', function(){
            var row = me.$tableSalaryManage.bootstrapTable('getRowByUniqueId', $(this).data("no"));
            me.editSalaryMstModal(row);
        });

        me.$formCreateSalaryMst.formValidation({
            framework: 'bootstrap',
            icon: {
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'userNo': {
                    row: '.col-md-4',
                    validators: {
                        notEmpty: {}
                    }
                },
                'salary': {
                    row: '.col-md-4',
                    validators: {
                        notEmpty: {}
                    }
                }
            }
        });
        mugrunApp.inputNumberOnly(
            me.$formCreateSalaryMst.find('.currency')
        );
        mugrunApp.inputCurrency(
            me.$formCreateSalaryMst.find('.currency')
        );
        me.$modalSalaryMst.on("shown.bs.modal", function(){
            var formValidation = me.$formCreateSalaryMst.data('formValidation');
            formValidation.resetForm();
        });
        me.$btnSaveSalaryMst.click(function(){
            me.addOrEditSalaryMst();
        });

    },
    refreshList: function(){
        var me = this;
        me.$tableSalaryManage.bootstrapTable("refresh");
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

            var salaryMstNoList = [];
            me.$tabSalaryManage.find('input[type="checkbox"]:checked').each(function(i, item){
                salaryMstNoList.push($(item).data('no'));
            });

            if(salaryMstNoList.length > 0) {
                mugrunApp.showWarningDeleteDialog(function(salaryMstNoList) {
                    $.ajax({
                        url: '/admin/cost/salary/deleteSalaryMst.json',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify(salaryMstNoList),
                        success: function(response) {
                            if (response.success) {
                                me.refreshList();
                            } else{
                                mugrunApp.alertMessage(response.messages);
                            }
                        }
                    });
                }, salaryMstNoList);
            }else{
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = "Vui long chọn dữ liệu cần xóa.";
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
            }
        });

        me.$btnAdd.on('click', function(e) {
            e.preventDefault();
            me.showCreateSalaryMstModal();
        });
    },
    showCreateSalaryMstModal: function() {
        var me = this;
        mugrunApp.mask();
        $.ajax({
            url: '/admin/cost/salary/getAvailableUsers.json',
            type: 'GET',
            dataType: 'json',
            success: function(users) {
                var $cboUser = me.$formCreateSalaryMst.find('select[name="userNo"]').empty();
                $cboUser.append('<option value="">Chọn Nhân Viên</option>');
                $cboUser.append($.tmpl(me.tplOption, users));
                me.$modalSalaryMst.find('input:hidden[name="salaryMasterNo"]').val('');
                me.$modalSalaryMst.find('input:text').val('');
                mugrunApp.unmask();
                me.$modalSalaryMst.modal('show');
            }
        });
    },
    editSalaryMstModal: function(row){
        var me = this;
        me.$modalSalaryMst.find('input:hidden[name="salaryMasterNo"]').val(row.salaryMasterNo);
        me.$modalSalaryMst.find('input[name="salary"]').val(mugrunApp.formatCurrency(row.salary));
        me.$modalSalaryMst.find('input[name="allowance"]').val(mugrunApp.formatCurrency(row.allowance));
        var $cboUser = me.$formCreateSalaryMst.find('select[name="userNo"]').empty();
        $cboUser.append($.tmpl(me.tplOption, {
            userNo: row.userNo,
            name: row.userName
        }));
        $cboUser.val(row.userNo);

        me.$modalSalaryMst.modal('show');
    },
    addOrEditSalaryMst: function(){
        var me = this;
        var formValidation = me.$formCreateSalaryMst.data('formValidation');
        formValidation.validate();
        if(formValidation.isValid()){
            me.$formCreateSalaryMst.find('input.currency').each(function(){
                $(this).val($(this).val().replaceAll(",", ""));
            });

            $.ajax({
                url: '/admin/cost/salary/addOrEditSalaryMst.json',
                type: 'POST',
                dataType: 'json',
                data: me.$formCreateSalaryMst.serialize(),
                success: function(data) {
                    if (data.success) {
                        me.$modalSalaryMst.modal('hide');
                        me.refreshList();
                        mugrunApp.alertMessage('Dữ liệu đã được cập nhật.');
                    } else {
                        mugrunApp.alertMessage(data.data);
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    mugrunApp.unmask();
                }
            });
        }

    }

});

$(document).ready(function(){
    new SalaryMasterController('#container-salary');
});