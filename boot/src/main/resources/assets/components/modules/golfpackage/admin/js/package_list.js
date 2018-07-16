var PackageListController = function (selector) {
    this.init(selector);
};

$.extend(PackageListController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;
        me.$container = $(selector);
        me.tablePackageListAction           = me.$container.find('#table-list-action');
        me.tablePackageList                 = me.$container.find('#table-package-list');
        me.$modalAddGolfPackage             = me.$container.find('#modal-add-golf-package');
        me.$modalEditGolfPackage            = me.$container.find('#modal-edit-golf-package');
        me.$formAddGolfPackage              = me.$container.find('#form-add-golf-package');
        me.$formEditGolfPackage             = me.$container.find('#form-edit-golf-package');
        me.initBootstrapTable();
        me.initEventHandlers();
        me.loadPackageList(true);
    },

    initBootstrapTable : function() {
        var me = this;
        me.tablePackageList.bootstrapTable({
            height: 598,
            smartDisplay: false,
            pageSize: 15,
            showHeader: false,
            pagination: true,
            paginationHAlign: 'center',
            uniqueId: 'packageNo',
            sidePagination: 'server',
            queryParamsType: '',
            queryParams: function(params) {
                return params;
            },
            columns: [
                {
                    cellStyle: function (value, row, index) {
                        return {
                            classes: 'checkbox-item'
                        }
                    },
                    formatter: function (value, object) {
                        return '<input type="checkbox" class="checkbox-item" data-value="' + object.packageNo + '">';
                    }
                },
                {
                    field: 'moduleNameNo',
                    title: 'Name',
                    formatter: function (value, object) {
                        return '<i class="fa fa-file"></i> <span>' + object.packageName + ' (' + object.packageNo + ') ' + '</span>';
                    }
                },
                {
                    field: 'packageNo',
                    title: 'Package No',
                    formatter: function (value, object) {
                        return ' <div class="packageNo">' + object.packageNo + '</div>';
                    }
                },
                {
                    field: 'packageName',
                    title: 'Package Name',
                    formatter: function (value, object) {
                        return ' <div class="packageName">' + object.packageName + '</div>';
                    }
                }
            ]
        });
    },

    initFormAGPValidation: function (){
        var me = this;

        me.$formAddGolfPackage.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'packageName': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: siteAdminApp.getMessage('golf.package.no.input.package.name.message')
                        },
                        remote: {
                            url: '/admin/golfpackage/checkPackageName.json',
                            type: "POST",
                            data: function(validator, $field, value) {
                                return {
                                    packageName: value
                                }
                            },
                            message: siteAdminApp.getMessage("golf.package.dup.package.name.message")
                        }
                    }
                }
            }
        })
        // Showing only one message each time
        .on('err.validator.fv', function(e, data) {
            // $(e.target)    --> The field element
            // data.fv        --> The FormValidation instance
            // data.field     --> The field name
            // data.element   --> The field element
            // data.validator --> The current validator name

            data.element
                .data('fv.messages')
                // Hide all the messages
                .find('.help-block[data-fv-for="' + data.field + '"]').hide()
                // Show only message associated with current validator
                .filter('[data-fv-validator="' + data.validator + '"]').show();
        });
    },

    initFormEGPValidation: function (){
        var me = this;

        me.$formEditGolfPackage.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'packageName': {
                    enabled: false,
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: siteAdminApp.getMessage('golf.package.no.input.package.name.message')
                        },
                        remote: {
                            url: '/admin/golfpackage/checkPackageName.json',
                            type: "POST",
                            data: function(validator, $field, value) {
                                return {
                                    packageName: value
                                }
                            },
                            message: siteAdminApp.getMessage("golf.package.dup.package.name.message")
                        }
                    }
                }
            }
        })
        // only validate when change id
        .on('change', '[name="packageName"]', function(e) {
            me.$formEditGolfPackage.formValidation('enableFieldValidators', 'packageName', false);

            var packageName = me.$formEditGolfPackage.find(':text[name="packageName"]').val();

            if(packageName !== me.editPackageName){
                me.$formEditGolfPackage.formValidation('enableFieldValidators', 'packageName', true);
                me.$formEditGolfPackage.formValidation('validateField', 'packageName')
            }
        })
        // Showing only one message each time
        .on('err.validator.fv', function(e, data) {
            // $(e.target)    --> The field element
            // data.fv        --> The FormValidation instance
            // data.field     --> The field name
            // data.element   --> The field element
            // data.validator --> The current validator name

            data.element
                .data('fv.messages')
                // Hide all the messages
                .find('.help-block[data-fv-for="' + data.field + '"]').hide()
                // Show only message associated with current validator
                .filter('[data-fv-validator="' + data.validator + '"]').show();
        });
    },

    initEventHandlers: function() {
        var me = this;

        me.tablePackageList.on('click', 'tbody > tr', function (e) {
            if (e.target.type != 'checkbox') {
                me.tablePackageList.find('input.checkbox-item:checked').click();
                jQuery(e.currentTarget).find('input').click();
                var packageNo = $(this).find('div.packageNo').text();
                me.currPackageNo = packageNo;
                golfPackageController.getGolfPackageDetail(packageNo);
            }
        });

        me.tablePackageListAction.on('click', 'button#btn-select-all', function (e) {
            e.preventDefault();
            var itemNotCheck = me.tablePackageList.find('input.checkbox-item:not(:checked)');
            if (itemNotCheck.length == 0) {
                me.tablePackageList.find('input.checkbox-item').click();
            } else {
                itemNotCheck.click();
            }
        });

        me.tablePackageListAction.on('click', 'button#btn-delete', function (e) {
            e.preventDefault();
            var allItem = me.tablePackageList.find('input.checkbox-item:checked');
            var allPackageNo = [];
            $.each(allItem, function(i, item){
                allPackageNo.push($(item).attr('data-value'));
            });
            if(allPackageNo.length > 0) {
                var message = siteAdminApp.getMessage('golf.package.delete.message');
                var callbackFunc = golfPackageController.deleteGolfPackage;
                var paramsForCallbackFunc = allPackageNo;
                mugrunApp.showCommonConfirmDialog(message, callbackFunc, paramsForCallbackFunc);
            } else {
                var message = mugrunApp.getMessage('common.delete.no.selection');
                mugrunApp.showCommonAlertDialog(message);
            }
        });

        me.tablePackageListAction.on('click', 'button#btn-add', function (e) {
            e.preventDefault();
            me.$formAddGolfPackage[0].reset();
            if (me.$formAddGolfPackage.data('formValidation')) {
                me.$formAddGolfPackage.data('formValidation').destroy();
            }
            me.initFormAGPValidation();
            me.$modalAddGolfPackage.modal({backdrop: 'static', show: true});
        });

        me.tablePackageList.on('dblclick', 'tbody > tr', function (e) {
            e.preventDefault();
            if (e.target.type != 'checkbox') {
                var packageName = $(this).find('div.packageName').text();
                var packageNo = $(this).find('div.packageNo').text();
                me.editPackageNo = packageNo;
                me.editPackageName = packageName;
                golfPackageController.getGolfPackageEditing(packageNo);
                me.$formEditGolfPackage[0].reset();
                if (me.$formEditGolfPackage.data('formValidation')) {
                    me.$formEditGolfPackage.data('formValidation').destroy();
                }
                me.initFormEGPValidation();
                me.$formEditGolfPackage.find('input[name=packageName]').val(me.editPackageName);
                me.$formEditGolfPackage.find('input[name=packageNo]').val(me.editPackageNo);
                me.$modalEditGolfPackage.modal({backdrop: 'static', show: true});
            }
        });

        me.$modalAddGolfPackage.on('click', '#btn-add-golf-package', function(e){
            e.preventDefault();
            var formValidation = me.$formAddGolfPackage.data('formValidation');

            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else {
                me.$modalAddGolfPackage.modal('hide');
                var data = {};
                data.packageName = me.$formAddGolfPackage.find('input[name=packageName]').val();
                golfPackageController.saveGolfPackage(data, true);
            }
        });

        me.$modalEditGolfPackage.on('click', '#btn-edit-golf-package', function(e){
            e.preventDefault();
            var formValidation = me.$formEditGolfPackage.data('formValidation');

            formValidation.validate();
            // check case user click save button too fast
            // form is validating or not finish yet so they must click second click to save
            // sleep process 1s and validate again to continue
            if(formValidation.isValid() == null){
                setTimeout(function(){
                    console.log('form is validating');
                    formValidation.validate();
                    me.processEditGolfPackage(formValidation);
                }, 1000);
            } else {
                me.processEditGolfPackage(formValidation);
            }

        });
    },

    processEditGolfPackage: function(formValidation){
        var me = this;
        if (!formValidation.isValid()) {
            return;
        } else {
            me.$modalEditGolfPackage.modal('hide');
            var data = golfPackageController.$golfPackageEditing;
            data.packageName = me.$formEditGolfPackage.find('input[name=packageName]').val();
            data.packageNo = me.$formEditGolfPackage.find('input[name=packageNo]').val();
            golfPackageController.saveGolfPackage(data, false);
        }
    },

    loadPackageList: function(loadFirstPackage) {
        var me = this;

        var url = '/admin/golfpackage/list.json';
        me.tablePackageList.bootstrapTable('refresh', {url: url});

        if (loadFirstPackage) {
            me.getFirstPackageOfList();
        }
    },

    getFirstPackageOfList: function() {
        var me = this;

        var url = '/admin/golfpackage/list/first.json';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            data: {
                pageNumber:1,
                pageSize:15
            },
            success: function(data) {
                if (data.success) {
                    var golfpackage = data.data;
                    if(golfpackage != null){
                        me.currPackageNo = golfpackage.packageNo;
                        golfPackageController.getGolfPackageDetail(golfpackage.packageNo);
                        if(me.tablePackageList.find('input.checkbox-item[data-value=' + golfpackage.packageNo + ']').length > 0){
                            me.tablePackageList.find('input.checkbox-item[data-value=' + golfpackage.packageNo + ']')[0].click()
                        }
                    }
                } else {
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
    }
});

var packageListController = new PackageListController('#container-package-list');