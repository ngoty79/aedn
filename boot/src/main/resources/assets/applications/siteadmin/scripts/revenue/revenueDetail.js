var RevenueDetailController = function (selector) {
    this.init(selector);
};

$.extend(RevenueDetailController.prototype, {
    $container: null,
    tplOption: '<option value="${userNo}">${name}</option>',
    URL: '/admin/revenue/list.json',
    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.tmplRevenueDetail = $('#tmplRevenueDetail');
        
        me.revenueYn                 = me.$container.data('revenueYn') == true;
        me.$tableRevenueDetail       = me.$container.find('.table-revenue-detail');

        me.$textSearch              = me.$container.find('.text-search');
        me.$startDate               = me.$container.find('#start-date');
        me.$endDate                 = me.$container.find('#end-date');
        me.$btnSearch               = me.$container.find('.btn-search');
        me.$revenueType             = me.$container.find('#revenueType');
        me.$name                    = me.$container.find('input[name="name"]');
        me.$btnAdd                  = me.$container.find('.btn-add');
        me.$btnDelete               = me.$container.find('.btn-delete');
        
        me.$modalRevenueDetail      = $('#modal-revenue-detail');
        me.$modalApprove            = $('#modal-approve-salary');
        me.$form                    = me.$modalRevenueDetail.find('form');
        me.$btnSave                 = me.$modalRevenueDetail.find('#btn-save-revenue-detail');

        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;

        me.$tableRevenueDetail.bootstrapTable({
            url: me.URL,
            smartDisplay: false,
            showHeader:true,
            pageSize: 20,
            pagination: true,
            uniqueId: 'revenueDetailNo',
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
                    field: 'revenueDetailNo',
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
                            return '<input type="checkbox" data-no="' + object.revenueDetailNo + '">';
                        }else{
                            return '<input disabled="true" type="checkbox" data-no="' + object.revenueDetailNo + '">';
                        }

                    }
                },{
                    field: 'name',
                    title: 'Các Khoản Thu',
                    sortable: true,
                    align: 'left'
                },{
                    field: 'date',
                    title: 'Ngày tháng',
                    sortable: true,
                    align: 'center',
                    formatter: function(value, row){
                        return mugrunApp.formatDate(value, 'DD/MM/YYYY');
                    }

                }, {
                    field: 'amountFormat',
                    title: 'Số Tiền',
                    align: 'right'
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
                    align: 'center',
                    visible: me.revenueYn,
                    formatter: function(value, row){

                        if(row.status != 'A'){
                            var strAction = ' <a href="javascript: void(0);" data-no="' + row.revenueDetailNo + '" class="approve-revenue" data-toggle="tooltip" title="Duyệt Lương"><i class="fa fa-play-circle" aria-hidden="true"></i></a>';
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
                            var strAction = ' <a href="javascript: void(0);" data-no="' + row.revenueDetailNo + '" class="edit-revenue" data-toggle="tooltip" title="Chỉnh sửa bảng lương"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
                            return strAction;
                        }

                    }
                }
            ]
        });

        me.$tableRevenueDetail.on('click', 'a.edit-revenue', function(){
            var row = me.$tableRevenueDetail.bootstrapTable('getRowByUniqueId', $(this).data("no"));
            me.editRevenueDetailModal(row);
        });

        me.$tableRevenueDetail.on('click', 'a.approve-revenue', function(){
            var row = me.$tableRevenueDetail.bootstrapTable('getRowByUniqueId', $(this).data("no"));
            me.approve(row);
        });


        me.$revenueType.change(function(e){
            var title = me.$revenueType.find('option:selected').text();
            if(me.$revenueType.val() == '04'){
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




        mugrunApp.inputNumberOnly(
            me.$form.find('.currency')
        );
        mugrunApp.inputCurrency(
            me.$form.find('.currency')
        );
        me.$modalRevenueDetail.on("shown.bs.modal", function(){
            var formValidation = me.$form.data('formValidation');
            formValidation.resetForm();
        });
        me.$btnSave.click(function(){
            me.addOrEditRevenueDetail();
        });


    },
    refreshList: function(url){
        var me = this;
        if(url == undefined){
            me.$tableRevenueDetail.bootstrapTable("refresh");
        }else{
            me.$tableRevenueDetail.bootstrapTable("refresh", {url: url});
        }

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

            var revenueDetailNoList = [];
            me.$tableRevenueDetail.find('input[type="checkbox"]:checked').each(function(i, item){
                revenueDetailNoList.push($(item).data('no'));
            });

            if(revenueDetailNoList.length > 0) {
                mugrunApp.showWarningDeleteDialog(function(revenueDetailNoList) {
                    $.ajax({
                        url: '/admin/revenue/deleteRevenueDetail.json',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify(revenueDetailNoList),
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
                }, revenueDetailNoList);
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
            me.showCreateRevenueDetailModal();
        });
    },
    showCreateRevenueDetailModal: function() {
        var me = this;
        me.$form.find('input,textarea').val('');
        me.$revenueType.trigger('change');
        me.$modalRevenueDetail.modal('show');
    },
    editRevenueDetailModal: function(row){
        var me = this;
        me.$form.find('input:hidden[name="revenueDetailNo"]').val(row.revenueDetailNo);
        me.$revenueType.val(row.revenueType);
        me.$form.find('input[name="name"]').val(row.name);
        me.$form.find('textarea[name="notice"]').val(row.notice);
        me.$form.find('input[name="date"]').val(mugrunApp.formatDate(row.date, 'DD/MM/YYYY'));
        me.$form.find('input[name="amount"]').val(mugrunApp.formatCurrency(row.amount));
        me.$form.find('[name="date"]').datepicker('setDate', mugrunApp.formatDate(row.date, 'DD/MM/YYYY'));
        me.$modalRevenueDetail.modal('show');
    },
    addOrEditRevenueDetail: function(){
        var me = this;
        var formValidation = me.$form.data('formValidation');
        formValidation.validate();
        if(formValidation.isValid()){
            me.$form.find('input.currency').each(function(){
                $(this).val($(this).val().replaceAll(",", ""));
            });

            $.ajax({
                url: '/admin/revenue/addOrEditRevenueDetail.json',
                type: 'POST',
                dataType: 'json',
                data: me.$form.serialize(),
                success: function(data) {
                    if (data.success) {
                        me.$modalRevenueDetail.modal('hide');
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
        mugrunApp.showCommonConfirmDialog('Bạn có muốn DUYỆT khoản thu này không?', function(){
            $.ajax({
                url: '/admin/revenue/approve.json',
                type: 'POST',
                dataType: 'json',
                data: {
                    revenueDetailNo: row.revenueDetailNo
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
    new RevenueDetailController('#container-revenue');
});