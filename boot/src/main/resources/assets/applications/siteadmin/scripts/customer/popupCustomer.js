var PopupCustomerController = function (selector) {
    this.init(selector);
};

$.extend(PopupCustomerController.prototype, {
    $container: null,
    tmplTownOption: '<option value="${townNo}" >${name}</option>',
    tmplUserOption: '<option value="${userNo}" >${name}</option>',
    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.$modalCustomer               = me.$container
        me.$formCustomer = me.$modalCustomer.find('form');
        me.$cboTown                  = me.$formCustomer.find('select[name="townNo"]');
        me.$cboUser                  = me.$formCustomer.find('select[name="staffUserNo"]');
        me.$btnSave = me.$modalCustomer.find('#btn-save-customer');

        me.initUi();
        me.initEventHandlers();
    },
    initUi : function(){
        var me = this;
        me.$formCustomer.formValidation({
            framework: 'bootstrap',
            icon: {
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'name': {
                    row: '.col-md-5',
                    validators: {
                        notEmpty: {}
                    }
                },
                'staffUserNo': {
                    row: '.col-md-5',
                    validators: {
                        notEmpty: {}
                    }
                },
                'townNo': {
                    row: '.col-md-3',
                    validators: {
                        notEmpty: {}
                    }
                },
                'socialId': {
                    row: '.col-md-3',
                    validators: {
                        notEmpty: {}
                    }
                },
                'sex': {
                    row: '.col-md-4',
                    validators: {
                        notEmpty: {}
                    }
                },
                'address': {
                    row: '.col-md-9',
                    validators: {
                        notEmpty: {}
                    }
                }
            }
        });

        me.$modalCustomer.find('input.input-date').inputmask({});

        me.$modalCustomer.on("shown.bs.modal", function(){
            var formValidation = me.$formCustomer.data('formValidation');
            formValidation.resetForm();
        });

        me.$btnSave.click(function(){
            me.addOrUpdateCustomer();
        });

        $.ajax({
            url: '/admin/customer/getPopupData.json',
            type: 'GET',
            dataType: 'json',
            data: me.$formCustomer.serialize(),
            success: function(result) {
                me.townList = result.townList;
                me.userList = result.userList;
                me.$cboTown.append($.tmpl(me.tmplTownOption, me.townList));
                me.$cboUser.append($.tmpl(me.tmplUserOption, me.userList));

            }
        });


    },
    initEventHandlers:function() {
        var me = this;
        mugrunApp.inputNumberOnly(
            me.$modalCustomer.find('input[name="socialId"], input[name="phone"]')
        );

    },
    openCreatePopup: function(callbackFn) {
        var me = this;
        me.callbackFn = callbackFn;
        me.$modalCustomer.find('input:hidden[name="customerNo"]').val('');
        me.$formCustomer.find('input:text, select[name="townNo"], select[name="staffUserNo"]').val('');
        if(me.userList == null){
            $.ajax({
                url: '/admin/customer/getPopupData.json',
                type: 'GET',
                dataType: 'json',
                data: me.$formCustomer.serialize(),
                success: function(result) {
                    me.townList = result.townList;
                    me.userList = result.userList;
                    me.$cboTown.append($.tmpl(me.tmplTownOption, me.townList));
                    me.$cboUser.append($.tmpl(me.tmplUserOption, me.userList));
                    me.$modalCustomer.modal({show: true, backdrop: 'static'});
                }
            });

        }else{
            me.$modalCustomer.modal({show: true, backdrop: 'static'});
        }


    },
    editCustomer: function(customer, callbackFn){
        var me = this;
        me.callbackFn = callbackFn;
        me.$modalCustomer.find('input:hidden[name="customerNo"]').val(customer.customerNo);
        me.$formCustomer.find('input:text, select[name="townNo"], select[name="staffUserNo"]').each(function(index, input){
            if($(input).attr('name') == 'issueDate'){
                var dateFormat = mugrunApp.formatDate(customer['issueDate'], 'DD/MM/YYYY');
                $(input).val(dateFormat);
            }else{
                $(input).val(customer[$(input).attr('name')]);
            }

        });
        me.$formCustomer.find('input:radio[value="' + customer.sex + '"]').attr('checked', true).closest('span').addClass('checked').trigger('click');
        me.$modalCustomer.modal({show: true, backdrop: 'static'});
    },
    addOrUpdateCustomer: function(){
        var me = this;

        var formValidation = me.$formCustomer.data('formValidation');
        formValidation.validate();
        if(formValidation.isValid()){
            var $birthday = me.$formCustomer.find('input[name="birthday"]');
            if ($birthday.val() != '' && !$birthday.inputmask("isComplete")){
                $birthday.closest('div').addClass('has-error');
                $('#date-invalide-msg').show();
                return ;
            }else{
                $birthday.closest('div').removeClass('has-error');
                $('#date-invalide-msg').hide();
            }
            var $issueDate = me.$formCustomer.find('input[name="issueDate"]');
            if (!$issueDate.inputmask("isComplete")){
                $issueDate.closest('div').addClass('has-error');
                $('#date-issue-invalide-msg').show();
                return ;
            }else{
                $issueDate.closest('div').removeClass('has-error');
                $('#date-issue-invalide-msg').hide();
            }

            $.ajax({
                url: '/admin/customer/addOrEdit.json',
                type: 'POST',
                dataType: 'json',
                data: me.$formCustomer.serialize(),
                success: function(data) {
                    if (data.success) {
                        me.$modalCustomer.modal('hide');
                        me.callbackFn();
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    me.$btnSave.prop('disabled', true);
                    mugrunApp.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    me.$btnSave.prop('disabled', false);
                    mugrunApp.unmask();
                }
            });
        }

    }

});

$(document).ready(function(){
    window.popupCustomerController = new PopupCustomerController('#modal-create-customer');
});