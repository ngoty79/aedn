var SalaryDetailController = function (selector) {
    this.init(selector);
};

$.extend(SalaryDetailController.prototype, {
    $container: null,
    tplOption: '<option value="${userNo}">${name}</option>',
    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.tmplSalaryDetail = $('#tmplSalaryDetail');
        me.costYn                 = me.$container.data('costYn') == true;

        //tab salary of staff
        me.$tabStaffSalary          = me.$container.find('#tab_salary_cost');
        me.$tableSalaryDetail                 = me.$tabStaffSalary.find('.table-salary-detail');
        me.$textSearch                 = me.$tabStaffSalary.find('.text-search');
        me.$btnSearch               = me.$tabStaffSalary.find('.btn-search');
        me.$btnAdd                  = me.$tabStaffSalary.find('.btn-add');
        me.$btnDelete               = me.$tabStaffSalary.find('.btn-delete');
        me.$modalSalaryDetail       = $('#modal-create-salary-detail');
        me.$modalApprove            = $('#modal-approve-salary');
        me.$form                    = me.$modalSalaryDetail.find('form');
        me.$btnSave                 = me.$modalSalaryDetail.find('#btn-save-salary-detail');

        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;

        me.$tableSalaryDetail.bootstrapTable({
            url: '/admin/cost/salary/detail-list.json',
            smartDisplay: false,
            showHeader:true,
            pageSize: 20,
            pagination: true,
            uniqueId: 'salaryDetailNo',
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            queryParams: function(params) {
                params['searchText'] = $.trim(me.$textSearch.val());
                return params;
            },
            columns: [
                {
                    field: 'salaryDetailNo',
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
                            return '<input type="checkbox" data-no="' + object.salaryDetailNo + '">';
                        }else{
                            return '<input disabled="true" type="checkbox" data-no="' + object.salaryDetailNo + '">';
                        }

                    }
                },{
                    field: 'userName',
                    title: 'Nhân Viên',
                    sortable: true,
                    align: 'left'
                },{
                    field: 'month',
                    title: 'Tháng',
                    sortable: true,
                    align: 'center',
                    formatter: function(value, row){
                        return row.month + "/" + row.year;
                    }

                }, {
                    field: 'salaryFormat',
                    title: 'Lương cơ bản',
                    align: 'center'
                },{
                    field: 'allowanceFormat',
                    title: 'Phụ cấp',
                    align: 'right'
                },{
                    field: 'extraCostFormat',
                    title: 'Phụ cấp Doanh Thu',
                    align: 'right'
                },{
                    field: 'totalFormat',
                    title: 'Tồng Lương',
                    align: 'right'
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
                            var strAction = ' <a href="javascript: void(0);" data-no="' + row.salaryDetailNo + '" class="approve-salary" data-toggle="tooltip" title="Duyệt Lương"><i class="fa fa-play-circle" aria-hidden="true"></i></a>';
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
                            var strAction = ' <a href="javascript: void(0);" data-no="' + row.salaryDetailNo + '" class="edit-salary" data-toggle="tooltip" title="Chỉnh sửa bảng lương"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
                            return strAction;
                        }

                    }
                }
            ]
        });

        me.$tableSalaryDetail.on('click', 'a.edit-salary', function(){
            var row = me.$tableSalaryDetail.bootstrapTable('getRowByUniqueId', $(this).data("no"));
            me.editSalaryDetailModal(row);
        });

        me.$tableSalaryDetail.on('click', 'a.approve-salary', function(){
            var row = me.$tableSalaryDetail.bootstrapTable('getRowByUniqueId', $(this).data("no"));
            me.showApproveModal(row);
        });



        me.$form.formValidation({
            framework: 'bootstrap',
            icon: {
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'userNo': {
                    row: '.col-md-3',
                    validators: {
                        notEmpty: {}
                    }
                },
                'monthYear': {
                    excluded: false,
                    row: '.form-group',
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
        })
        .on('change', 'select[name="month"], select[name="year"]', function(e) {
            var month = me.$form.find('[name="month"]').val(),
                year = me.$form.find('[name="year"]').val();
                me.$form.find('[name="monthYear"]').val(month === '' || year === ''? '' : [year, month].join('-'));
                me.$form.formValidation('revalidateField', 'monthYear');
                me.loadContractInfo();
        });

        mugrunApp.inputNumberOnly(
            me.$form.find('.currency')
        );
        mugrunApp.inputCurrency(
            me.$form.find('.currency')
        );
        me.$modalSalaryDetail.on("shown.bs.modal", function(){
            var formValidation = me.$form.data('formValidation');
            formValidation.resetForm();
        });
        me.$btnSave.click(function(){
            me.addOrEditSalaryDetail();
        });

        me.$modalApprove.find("#btn-approve-salary").click(function(){
            me.approve();
        });


    },
    refreshList: function(){
        var me = this;
        me.$tableSalaryDetail.bootstrapTable("refresh");
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

            var salaryDetailNoList = [];
            me.$tableSalaryDetail.find('input[type="checkbox"]:checked').each(function(i, item){
                salaryDetailNoList.push($(item).data('no'));
            });

            if(salaryDetailNoList.length > 0) {
                mugrunApp.showWarningDeleteDialog(function(salaryDetailNoList) {
                    $.ajax({
                        url: '/admin/cost/salary/deleteSalaryDetail.json',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify(salaryDetailNoList),
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
                }, salaryDetailNoList);
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
            me.showCreateSalaryDetailModal();
        });
        me.$form.find('select[name="userNo"]').change(function(){
            me.changeUser();
            me.loadContractInfo();
        });
    },
    loadContractInfo: function(){
        var me = this,
            $cboUser = me.$form.find('select[name="userNo"]'),
            $month = me.$form.find('select[name="month"]'),
            $year = me.$form.find('select[name="year"]');

        if($cboUser.val() != '' && $month.val() != '' && $year.val() != ''){
            $.ajax({
                url: '/admin/cost/salary/getCountOfStaff.json',
                type: 'GET',
                data:{
                    userNo: $cboUser.val(),
                    month: $month.val(),
                    year: $year.val()
                },
                dataType: 'json',
                success: function(response) {
                    if(response.success == true){
                        var newCount = 0,
                            oldCount = 0;
                        if(response.data["new"] != null){
                            newCount = response.data["new"];
                        }
                        if(response.data["old"] != null){
                            oldCount = response.data["old"];
                        }

                        $('#new-loan-count').text(newCount);
                        $('#renew-loan-count').text(oldCount);

                    }
                }
            });
        }

    },
    resetForm: function(){
        var me = this;
        me.$form.find('input:hidden[name="salaryDetailNo"]').val('');
        me.$form.find('input:text').val('');
        $('#new-loan-count').text(0);
        $('#renew-loan-count').text(0);

        var month = me.$form.find('[name="month"]').val(),
            year = me.$form.find('[name="year"]').val();
        me.$form.find('[name="monthYear"]').val(month === '' || year === ''? '' : [year, month].join('-'));
        me.$form.formValidation('revalidateField', 'monthYear');

        var formValidation = me.$form.data('formValidation');
        formValidation.resetForm();
    },
    changeUser: function(){
        var me = this;
        var $cbo = me.$form.find('select[name="userNo"]');
        if($cbo.val() == ''){
            me.resetForm();
        }else{
            $.ajax({
                url: '/admin/cost/salary/getUserInfo.json',
                type: 'GET',
                data:{
                    userNo: $cbo.val()
                },
                dataType: 'json',
                success: function(response) {
                    me.fillForm(response);
                }
            });
        }
    },
    fillForm: function(user){
        var me = this;
        me.$form.find('input:text').each(function(index, el){
            $(el).val( user[$(el).attr('name')] );
        });
    },
    showCreateSalaryDetailModal: function() {
        var me = this;
        mugrunApp.mask();
        $.ajax({
            url: '/admin/cost/salary/getAllUserOfSalaryMaster.json',
            type: 'GET',
            dataType: 'json',
            success: function(users) {
                var $cboUser = me.$form.find('select[name="userNo"]').empty();
                $cboUser.append('<option value="">Chọn Nhân Viên</option>');
                $cboUser.append($.tmpl(me.tplOption, users));

                me.resetForm();
                mugrunApp.unmask();
                me.$modalSalaryDetail.modal('show');
            }
        });
    },
    showApproveModal: function(row){
        var me = this;
        me.$modalApprove.find('#form-content').empty().append($.tmpl(
            me.tmplSalaryDetail.html(), row
        ));
        me.$modalApprove.modal('show');
    },
    editSalaryDetailModal: function(row){
        var me = this;
        me.$modalSalaryDetail.find('input:hidden[name="salaryDetailNo"]').val(row.salaryDetailNo);
        me.$modalSalaryDetail.find('select[name="month"]').val(row.month);
        me.$modalSalaryDetail.find('select[name="year"]').val(row.year);
        me.$modalSalaryDetail.find('input[name="salary"]').val(mugrunApp.formatCurrency(row.salary));
        me.$modalSalaryDetail.find('input[name="allowance"]').val(mugrunApp.formatCurrency(row.allowance));
        me.$modalSalaryDetail.find('input[name="extraCost"]').val(mugrunApp.formatCurrency(row.extraCost));
        var $cboUser = me.$form.find('select[name="userNo"]').empty();
        $cboUser.append($.tmpl(me.tplOption, {
            userNo: row.userNo,
            name: row.userName
        }));
        $cboUser.val(row.userNo);
        me.$form.find('[name="monthYear"]').val(row.month + "-" + row.year);
        $.ajax({
            url: '/admin/cost/salary/getCountOfStaff.json',
            type: 'GET',
            data:{
                userNo: row.userNo,
                month: row.month,
                year: row.year
            },
            dataType: 'json',
            success: function(response) {
                if(response.success == true){
                    var newCount = 0,
                        oldCount = 0;
                    if(response.data["new"] != null){
                        newCount = response.data["new"];
                    }
                    if(response.data["old"] != null){
                        oldCount = response.data["old"];
                    }

                    $('#new-loan-count').text(newCount);
                    $('#renew-loan-count').text(oldCount);

                }
            }
        });


        me.$modalSalaryDetail.modal('show');
    },
    addOrEditSalaryDetail: function(){
        var me = this;
        var formValidation = me.$form.data('formValidation');
        formValidation.validate();
        if(formValidation.isValid()){
            me.$form.find('input.currency').each(function(){
                $(this).val($(this).val().replaceAll(",", ""));
            });

            $.ajax({
                url: '/admin/cost/salary/addOrEditSalaryDetail.json',
                type: 'POST',
                dataType: 'json',
                data: me.$form.serialize(),
                success: function(data) {
                    if (data.success) {
                        me.$modalSalaryDetail.modal('hide');
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
    approve: function(){
        var me = this;
        mugrunApp.showCommonConfirmDialog('Bạn có muốn DUYỆT bảng lương này không?', function(){
            $.ajax({
                url: '/admin/cost/salary/approve.json',
                type: 'POST',
                dataType: 'json',
                data: me.$modalApprove.find('form').serialize(),
                success: function(data) {
                    if (data.success) {
                        me.$modalApprove.modal('hide');
                        me.refreshList();
                        mugrunApp.alertMessage('Đã duyệt lương.');
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
    new SalaryDetailController('#container-salary');
});