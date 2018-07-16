var TownController = function (selector) {
    this.init(selector);
};

$.extend(TownController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tableTown           = me.$container.find('.table-town-list');
        me.$btnAdd                  = me.$container.find('.btn-add');
        me.$textSearch              = me.$container.find('.text-search');
        me.$btnSearch              = me.$container.find('.btn-search');
        me.$btnClear                = me.$container.find('.search-clear');
        me.$btnDelete               = me.$container.find('.btn-delete');
        me.$modalCreate               = $('#modal-create-town');
        me.$formCreate = me.$modalCreate.find('form');
        me.$btnSave = me.$modalCreate.find('#btn-save-town');
        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;
        me.$tableTown.bootstrapTable({
            url: '/admin/town/list.json',
            smartDisplay: false,
            showHeader:true,
            pageSize: 20,
            pagination: true,
            uniqueId: 'townNo',
            sidePagination: 'server',
            queryParamsType: '',
            paginationHAlign: 'center',
            queryParams: function(params) {
                params['searchText'] = $.trim(me.$textSearch.val());
                return params;
            },
            columns: [
                {
                    field: 'townNo',
                    title: 'Chọn',
                    width: '10%',
                    align: 'center',
                    cellStyle: function(value, row, index) {
                        return {
                            classes: 'inbox-small-cells'
                        }
                    },
                    formatter: function(value,object){
                        return '<input type="checkbox" data-no="' + object.townNo + '">';
                    }
                },{
                    field: 'name',
                    title: 'Khu Vực',
                    sortable: true,
                    width: '40%',
                    align: 'left'
                }, {
                    field: 'districtName',
                    title: 'Huyện/Tỉnh',
                    align: 'center',
                    formatter: function(value,object){
                        return value + ' - ' + object.provinceName;
                    }
                }
            ],
            onDblClickRow: function(row, $element, field){
                me.editTown(row);
            }
        });

        me.$formCreate.formValidation({
            framework: 'bootstrap',
            icon: {
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'name': {
                    row: '.col-md-7',
                    validators: {
                        notEmpty: {

                        }
                    }
                }
            }
        });

        me.$modalCreate.on("shown.bs.modal", function(){
            var formValidation = me.$formCreate.data('formValidation');
            formValidation.resetForm();
        });

        me.$btnSave.click(function(){
            me.addOrEditTown();
        });



    },
    refreshList: function(){
        var me = this;
        me.$tableTown.bootstrapTable("refresh");
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

        me.$btnClear.on('click', function (e) {
            e.preventDefault();
            me.$textSearch.val("");
            me.$btnClear.addClass('hide');
        });

        me.$btnSearch.on('click', function (e) {
            e.preventDefault();
            me.refreshList();
        });


        me.$btnDelete.on('click', function(e) {
            e.preventDefault();

            var townNoList = [];
            me.$tableTown.find('input[type="checkbox"]:checked').each(function(i, item){
                townNoList.push($(item).data('no'));
            });

            if(townNoList.length > 0) {
                mugrunApp.showWarningDeleteDialog(function(townNoList) {
                    $.ajax({
                        url: '/admin/town/deleteSelected.json',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify(townNoList),
                        success: function(response) {
                            if (response.success) {
                                me.refreshList();
                            } else{
                                mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                            }
                        }
                    });
                }, townNoList);
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
            me.showCreateModal();
        });
    },
    showCreateModal: function() {
        var me = this;
        me.$modalCreate.find('input:hidden[name="townNo"]').val('');
        me.$formCreate.find('input[name="name"]').val('');
        me.$modalCreate.modal('show');
    },
    editTown: function(row){
        var me = this;
        me.$modalCreate.find('input:hidden[name="townNo"]').val(row.townNo);
        me.$modalCreate.find('input[name="name"]').val(row.name);
        me.$modalCreate.modal('show');
    },
    addOrEditTown: function(){
        var me = this;
        var formValidation = me.$formCreate.data('formValidation');
        formValidation.validate();
        if(formValidation.isValid()){
            $.ajax({
                url: '/admin/town/addOrEdit.json',
                type: 'POST',
                dataType: 'json',
                data: me.$formCreate.serialize(),
                success: function(data) {
                    if (data.success) {
                        me.$modalCreate.modal('hide');
                        me.refreshList();
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
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
    new TownController('#container-town');
});