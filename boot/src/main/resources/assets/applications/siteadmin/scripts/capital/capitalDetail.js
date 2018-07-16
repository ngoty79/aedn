var CapitalDetailController = function (selector) {
    this.init(selector);
};

$.extend(CapitalDetailController.prototype, {
    $container: null,
    tplOption: '<option value="${userNo}">${name}</option>',
    URL: '/admin/capital/list.json?',
    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.tmplCapitalDetail = $('#tmplCapitalDetail');
        
        me.capitalYn                 = me.$container.data('capitalYn') == true;
        me.capitalType                 = me.$container.data('capitalType');
        me.$tableCapitalDetail                 = me.$container.find('.table-capital-detail');

        me.$textSearch                 = me.$container.find('.text-search');
        me.$startDate                 = me.$container.find('#start-date');
        me.$endDate                 = me.$container.find('#end-date');
        me.$btnSearch               = me.$container.find('.btn-search');
        me.$btnAdd                  = me.$container.find('.btn-add');
        me.$btnDelete               = me.$container.find('.btn-delete');
        
        me.$modalCapitalDetail       = $('#modal-capital-detail');
        me.$modalApprove            = $('#modal-approve-salary');
        me.$form                    = me.$modalCapitalDetail.find('form');
        me.$btnSave                 = me.$modalCapitalDetail.find('#btn-save-capital-detail');

        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;

        me.$tableCapitalDetail.bootstrapTable({
            url: me.URL,
            smartDisplay: false,
            showHeader:true,
            pageSize: 20,
            pagination: true,
            uniqueId: 'capitalDetailNo',
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            queryParams: function(params) {
                params['capitalType'] = me.capitalType;
                params['searchText'] = $.trim(me.$textSearch.val());
                params['startDate'] = $.trim(me.$startDate.val());
                params['endDate'] = $.trim(me.$endDate.val());
                return params;
            },
            columns: [
                {
                    field: 'capitalDetailNo',
                    title: 'Chọn',
                    width: '6%',
                    align: 'center',
                    cellStyle: function(value, row, index) {
                        return {
                            classes: 'inbox-small-cells'
                        }
                    },
                    formatter: function(value,object){
                        if(object.status == 'W'){
                            return '<input type="checkbox" data-no="' + object.capitalDetailNo + '">';
                        }else{
                            return '';
                        }

                    }
                },{
                    field: 'title',
                    title: 'Nguồn vốn',
                    sortable: true,
                    align: 'left'
                },{
                    field: 'startDate',
                    title: 'Ngày tháng',
                    sortable: true,
                    align: 'center',
                    formatter: function(value, row){
                        var str = '';
                        if(row.startDate != null && row.startDate !=''){
                            str = mugrunApp.formatDate(value, 'DD/MM/YYYY');
                        }
                        if(row.endDate != null && row.endDate !=''){
                            str += " ~ " + mugrunApp.formatDate(row.endDate, 'DD/MM/YYYY');
                        }
                        return str;
                    }

                }, {
                    field: 'amount',
                    title: 'Số Tiền',
                    align: 'right',
                    formatter: function(value, row){
                        return mugrunApp.formatNumber(value);
                    }
                },{
                    field: 'regUserName',
                    title: 'Người Tạo',
                    align: 'center'
                },{
                    field: 'status',
                    title: 'Trạng Thái',
                    align: 'center',
                    formatter: function(value, row){
                        if(value == 'A'){
                            return "Đã duyệt (bởi: " + row.approveUserName + ")";
                        }else if(value == 'W'){
                            return "Mới"
                        }else if(value == 'F'){
                            return "Đã tất toán (bởi: " + row.finishUserName + ")";
                        }
                    }
                }, {
                    field: 'apporve',
                    title: 'Duyệt',
                    align: 'center',
                    visible: me.capitalYn,
                    formatter: function(value, row){
                        if(row.status == 'W'){
                            var strAction = ' <a href="javascript: void(0);" data-no="' + row.capitalDetailNo + '" class="approve-capital" data-toggle="tooltip" title="Duyệt Lương"><i class="fa fa-play-circle" aria-hidden="true"></i></a>';
                            return strAction;
                        }else{
                            return ''
                        }

                    }
                }, {
                    field: 'edit',
                    title: 'Chỉnh sửa',
                    align: 'center',
                    formatter: function(value, row){
                        if(row.status == 'W'){
                            var strAction = ' <a href="javascript: void(0);" data-no="' + row.capitalDetailNo + '" class="edit-capital" data-toggle="tooltip" title="Chỉnh sửa bảng lương"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
                            return strAction;
                        }

                    }
                }
            ]
        });

        me.$tableCapitalDetail.on('click', 'a.edit-capital', function(){
            var row = me.$tableCapitalDetail.bootstrapTable('getRowByUniqueId', $(this).data("no"));
            me.editCapitalDetailModal(row);
        });


        me.$tableCapitalDetail.on('click', 'a.approve-capital', function(){
            var row = me.$tableCapitalDetail.bootstrapTable('getRowByUniqueId', $(this).data("no"));
            me.approve(row);
        });

        me.$tableCapitalDetail.on('click', 'button.finish-capital', function(){
            var row = me.$tableCapitalDetail.bootstrapTable('getRowByUniqueId', $(this).data("no"));
            me.finish(row);
        });



        me.$form.formValidation({
            framework: 'bootstrap',
            icon: {
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'title': {
                    row: '.col-md-9',
                    validators: {
                        notEmpty: {}
                    }
                },
                'amount': {
                    row: '.col-md-4',
                    validators: {
                        notEmpty: {}
                    }
                }
            }
        });

        me.$form.find('[name="startDate"]').datepicker({
            language: "vi",
            format: "dd/mm/yyyy",
            todayHighlight: true,
            keepEmptyValues: true
        }).on('changeDate', function(e) {
            me.$form.find('[name="endDate"]').datepicker('setStartDate', e.date);
            me.$form.formValidation('revalidateField', 'startDate');
        });
        me.$form.find('[name="endDate"]').datepicker({
            language: "vi",
            format: "dd/mm/yyyy",
            todayHighlight: true,
            keepEmptyValues: true
        }).on('changeDate', function(e) {
            me.$form.find('[name="startDate"]').datepicker('setEndDate', e.date);
            me.$form.formValidation('revalidateField', 'endDate');
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
        me.$modalCapitalDetail.on("shown.bs.modal", function(){
            var formValidation = me.$form.data('formValidation');
            formValidation.resetForm();
        });
        me.$btnSave.click(function(){
            me.addOrEditCapitalDetail();
        });


    },
    refreshList: function(url){
        var me = this;
        if(url == undefined){
            me.$tableCapitalDetail.bootstrapTable("refresh");
        }else{
            me.$tableCapitalDetail.bootstrapTable("refresh", {url: url});
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

            var capitalDetailNoList = [];
            me.$tableCapitalDetail.find('input[type="checkbox"]:checked').each(function(i, item){
                capitalDetailNoList.push($(item).data('no'));
            });

            if(capitalDetailNoList.length > 0) {
                mugrunApp.showWarningDeleteDialog(function(capitalDetailNoList) {
                    $.ajax({
                        url: '/admin/capital/deleteCapitalDetail.json',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify(capitalDetailNoList),
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
                }, capitalDetailNoList);
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
            me.showCreateCapitalDetailModal();
        });
    },
    showCreateCapitalDetailModal: function() {
        var me = this;
        me.$form.find('input,textarea').val('');
        me.$form.find('input:hidden[name="capitalType"]').val(me.capitalType);
        me.$modalCapitalDetail.modal('show');
    },
    editCapitalDetailModal: function(row){
        var me = this;
        me.$form.find('input:hidden[name="capitalType"]').val(me.capitalType);
        me.$form.find('input:hidden[name="capitalDetailNo"]').val(row.capitalDetailNo);
        me.$form.find('input[name="title"]').val(row.title);
        me.$form.find('textarea[name="notice"]').val(row.notice);
        me.$form.find('input[name="startDate"]').val(mugrunApp.formatDate(row.startDate, 'DD/MM/YYYY'));
        me.$form.find('input[name="endDate"]').val(mugrunApp.formatDate(row.endDate, 'DD/MM/YYYY'));
        me.$form.find('input[name="amount"]').val(mugrunApp.formatCurrency(row.amount));
        me.$modalCapitalDetail.modal('show');
    },
    addOrEditCapitalDetail: function(){
        var me = this;
        var formValidation = me.$form.data('formValidation');
        formValidation.validate();
        if(formValidation.isValid()){
            me.$form.find('input.currency').each(function(){
                $(this).val($(this).val().replaceAll(",", ""));
            });

            $.ajax({
                url: '/admin/capital/addOrEditCapitalDetail.json',
                type: 'POST',
                dataType: 'json',
                data: me.$form.serialize(),
                success: function(data) {
                    if (data.success) {
                        me.$modalCapitalDetail.modal('hide');
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
                url: '/admin/capital/approve.json',
                type: 'POST',
                dataType: 'json',
                data: {
                    capitalDetailNo: row.capitalDetailNo
                },
                success: function(data) {
                    if (data.success) {
                        me.$modalApprove.modal('hide');
                        me.refreshList();
                        mugrunApp.alertMessage('Đã duyệt.');
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
    finish: function(row){
        var me = this;
        mugrunApp.showCommonConfirmDialog('Bạn có muốn tất toán nguồn vốn này không?', function(){
            $.ajax({
                url: '/admin/capital/finish.json',
                type: 'POST',
                dataType: 'json',
                data: {
                    capitalDetailNo: row.capitalDetailNo
                },
                success: function(data) {
                    if (data.success) {
                        me.$modalApprove.modal('hide');
                        me.refreshList();
                        mugrunApp.alertMessage('Đã tất toán');
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
    new CapitalDetailController('#container-capital');
});