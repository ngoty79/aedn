var ShopBankAccountController = function (selector) {
    this.init(selector);
};

$.extend(ShopBankAccountController.prototype, {
    $container: null,
    shopMallNo: $('input#hdn-shopmall-mallNo').val(),

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tbBankAccount               = me.$container.find('.table-bank-account');
        me.$btnDelete                   = me.$container.find('.btn-delete');
        me.$btnAdd                      = me.$container.find('button.btn-add');
        me.$modalAddBank                = me.$container.find('#modal-bank-account');
        me.$formAddBank                 = me.$modalAddBank.find('#form-bank-account');
        me.$btnSaveBank                 = me.$modalAddBank.find('button.btn-dialog-save');
        me.$btnCancelBank               = me.$modalAddBank.find('button.btn-dialog-cancel');

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;

        me.initGrid();
    },

    initFormValidation: function() {
        var me = this;

        me.$formAddBank.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'bankName': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        }
                    }
                },
                'accountNo': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                }
            }
        });
    },

    initEventHandlers: function() {
        var me = this;

        me.$modalAddBank.on('hidden.bs.modal', function () {
            me.$formAddBank[0].reset();
            if(me.$formAddBank.data('formValidation')) {
                me.$formAddBank.data('formValidation').destroy();
            }
        });

        me.$btnCancelBank.click(function(e) {
            mugrunApp.alertMessage(mugrunApp.getMessage('common.alert.dialog.message.click.canceled'));
        });

        me.$btnSaveBank.click(function(e) {
            e.preventDefault();
            var formValidation = me.$formAddBank.data('formValidation');
            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else{
                me.submitBankAccount();
            }
        });

        me.$btnAdd.click(function(e) {
            e.preventDefault();

            me.initFormValidation();

            me.$modalAddBank.find('.modal-title').text('계좌번호 추가');
            me.$formAddBank.find('input[name=bankNo]').val(0);

            me.$modalAddBank.modal({backdrop: 'static', show: true});
        });

        me.$btnDelete.click(function(e) {
            e.preventDefault();
            var listNo = [];
            me.$tbBankAccount.find('input[type="checkbox"]:checked').each(function(i, item){
                listNo.push($(item).closest('tr').data('uniqueid'));
            });

            if(listNo.length > 0) {
                mugrunApp.showWarningDeleteDialog(me.deleteMultiData, listNo.join(","), '계좌정보를 삭제하히겠습니까?');
            }else{
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = '삭제할 계좌정보를 선택하세요.';
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
            }
        });

        me.$tbBankAccount.on("click", 'a.btn-edit', function(e) {
            e.preventDefault();
            me.initFormValidation();
            me.openBankEditor($(this).data('no'));
        });

    },

    initGrid: function() {
        var me = this;

        me.$tbBankAccount.bootstrapTable({
            url: '/admin/shop/bank/load.json',
            cache: false,
            smartDisplay: false,
            showHeader : true,
            pagination : true,
            paginationHAlign: 'center',
            pageSize: 15,
            uniqueId: "bankNo",
            queryParamsType: '',
            sidePagination: 'server',
            totalRows: 100,
            queryParams: function(params) {
                params['mallNo'] = me.shopMallNo;
                return params;
            },
            columns: [
                {
                    checkbox: true,
                    align: 'center'
                }, {
                    field: 'bankName',
                    title: '은행명',
                    formatter: function(value,object){
                        return object.bankName;
                    }
                }, {
                    field: 'accountNo',
                    title: '계좌번호',
                    formatter: function(value,object){
                        return object.accountNo;
                    }
                }, {
                    field: 'edit',
                    title: '수정',
                    formatter: function(value,object){
                        return '<a class="btn-edit" data-no="'+object.bankNo+'"><i class="inline glyphicon glyphicon-pencil"></i></a>';
                    }
                }
            ],
            rowAttributes: function(row, index) {

            },
            onClickRow: function(row, element) {

            },
            onPostBody: function() {

            }
        });
    },

    reloadGrid: function() {
        var me = this;
        me.$tbBankAccount.bootstrapTable("refresh");
    },

    deleteMultiData: function(listNo) {
        var me = shopBankAccountController;

        $.ajax({
            url: '/admin/shop/bank/deleteMultiBank.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                listNo: listNo
            },
            success: function(response) {
                if (response.success) {
                    me.reloadGrid();
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.alert.dialog.message.deleted'));
                } else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                me.$container.unmask();
            }
        });
    },

    openBankEditor: function(bankNo) {
        var me = this;

        return $.ajax({
            url: '/admin/shop/bank/getBankInfo.json',
            dataType: 'json',
            data: {
                bankNo: bankNo
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    var data = response.data;
                    me.$modalAddBank.find('.modal-title').text('계좌번호 수정');
                    me.$modalAddBank.find('input[name=bankName]').val(data.bankName);
                    me.$modalAddBank.find('input[name=accountNo]').val(data.accountNo);
                    me.$modalAddBank.find('input[name=bankNo]').val(data.bankNo);
                    me.$modalAddBank.modal({backdrop: 'static', show: true});
                }else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                me.$container.unmask();
            }
        });
    },

    submitBankAccount: function() {
        var me = this;
        var bankNo = me.$formAddBank.find('input[name=bankNo]').val();

        var data = {};
        data['mallNo'] = me.shopMallNo;
        data['bankNo'] = bankNo;
        data["bankName"] = me.$formAddBank.find('input[name="bankName"]').val();
        data["accountNo"] = me.$formAddBank.find('input[name="accountNo"]').val();
        $.ajax({
            url: '/admin/shop/bank/addBank.json',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (response) {
                if (response.success) {
                    me.$modalAddBank.modal('hide');
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.alert.dialog.message.click.saved'));
                    me.reloadGrid();
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function () {
                me.$btnSaveBank.prop('disabled', true);
            },
            complete: function () {
                me.$btnSaveBank.prop('disabled', false);
            }
        });
    }
});

