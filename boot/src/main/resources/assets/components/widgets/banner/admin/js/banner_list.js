/**
 * Created by Hai Nguyen on 8/17/2016.
 */
var BannerListController = function (selector) {
    this.init(selector);
};

$.extend(BannerListController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;
        me.$container = $(selector);
        me.tableBannerListAction           = me.$container.find('#table-list-action');
        me.tableBannerList                 = me.$container.find('#table-banner-list');
        me.$modalAddBanner             = me.$container.find('#modal-add-banner');
        me.$modalEditBanner            = me.$container.find('#modal-edit-banner');
        me.$formAddBanner              = me.$container.find('#form-add-banner');
        me.$formEditBanner             = me.$container.find('#form-edit-banner');
        me.initBootstrapTable();
        me.initEventHandlers();
        me.loadBannerList(true);
    },

    initBootstrapTable : function() {
        var me = this;
        me.tableBannerList.bootstrapTable({
            height: 598,
            smartDisplay: false,
            pageSize: 15,
            showHeader: false,
            pagination: true,
            paginationHAlign: 'center',
            uniqueId: 'widgetNo',
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
                        return '<input type="checkbox" class="checkbox-item" data-value="' + object.widgetNo + '">';
                    }
                },
                {
                    field: 'moduleNameNo',
                    title: 'Name',
                    formatter: function (value, object) {
                        return '<i class="fa fa-file"></i> <span>' + object.widgetTitle + ' (' + object.widgetNo + ') ' + '</span>';
                    }
                },
                {
                    field: 'widgetNo',
                    title: 'Widget No',
                    formatter: function (value, object) {
                        return ' <div class="widgetNo">' + object.widgetNo + '</div>';
                    }
                },
                {
                    field: 'widgetTitle',
                    title: 'WidgetTitle',
                    formatter: function (value, object) {
                        return ' <div class="widgetTitle">' + object.widgetTitle + '</div>';
                    }
                }
            ]
        });
    },

    initFormAGPValidation: function (){
        var me = this;

        me.$formAddBanner.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'widgetTitle': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                        },
                        remote: {
                            url: '/admin/banner/checkWidgetTitle.json',
                            type: "POST",
                            data: function(validator, $field, value) {
                                return {
                                    widgetTitle: value
                                }
                            },
                            message: siteAdminApp.getMessage("banner.dup.banner.title.message")
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

        me.$formEditBanner.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'widgetTitle': {
                    enabled: false,
                    row: '.controls',
                    validators: {
                        notEmpty: {

                        },
                        remote: {
                            url: '/admin/banner/checkWidgetTitle.json',
                            type: "POST",
                            data: function(validator, $field, value) {
                                return {
                                    widgetTitle: value
                                }
                            },
                            message: siteAdminApp.getMessage("banner.dup.banner.title.message")
                        }
                    }
                }
            }
        })
            // only validate when change id
            .on('change', '[name="widgetTitle"]', function(e) {
                me.$formEditBanner.formValidation('enableFieldValidators', 'widgetTitle', false);

                var widgetTitle = me.$formEditBanner.find(':text[name="widgetTitle"]').val();

                if(widgetTitle !== me.editWidgetTitle){
                    me.$formEditBanner.formValidation('enableFieldValidators', 'widgetTitle', true);
                    me.$formEditBanner.formValidation('validateField', 'widgetTitle')
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

        me.tableBannerList.on('click', 'tbody > tr', function (e) {
            if (e.target.type != 'checkbox') {
                me.tableBannerList.find('input.checkbox-item:checked').click();
                jQuery(e.currentTarget).find('input').click();
                var widgetNo = $(this).find('div.widgetNo').text();
                me.currWidgetNo = widgetNo;
                bannerController.getBannerDetail(widgetNo);
            }
        });

        me.tableBannerListAction.on('click', 'button#btn-select-all', function (e) {
            e.preventDefault();
            var itemNotCheck = me.tableBannerList.find('input.checkbox-item:not(:checked)');
            if (itemNotCheck.length == 0) {
                me.tableBannerList.find('input.checkbox-item').click();
            } else {
                itemNotCheck.click();
            }
        });

        me.tableBannerListAction.on('click', 'button#btn-delete', function (e) {
            e.preventDefault();
            var allItem = me.tableBannerList.find('input.checkbox-item:checked');
            var allBannerNo = [];
            $.each(allItem, function(i, item){
                allBannerNo.push($(item).attr('data-value'));
            });
            if(allBannerNo.length > 0) {
                var message = siteAdminApp.getMessage('banner.confirm.message.delete.selected');
                var callbackFunc = bannerController.deleteBanner;
                var paramsForCallbackFunc = allBannerNo;
                mugrunApp.showCommonConfirmDialog(message, callbackFunc, paramsForCallbackFunc);
            } else {
                var message = mugrunApp.getMessage('common.delete.no.selection');
                mugrunApp.showCommonAlertDialog(message);
            }
        });

        me.tableBannerListAction.on('click', 'button#btn-add', function (e) {
            e.preventDefault();
            me.$formAddBanner[0].reset();
            if (me.$formAddBanner.data('formValidation')) {
                me.$formAddBanner.data('formValidation').destroy();
            }
            me.initFormAGPValidation();
            me.$modalAddBanner.modal({backdrop: 'static', show: true});
        });

        me.tableBannerList.on('dblclick', 'tbody > tr', function (e) {
            e.preventDefault();
            if (e.target.type != 'checkbox') {
                var widgetTitle = $(this).find('div.widgetTitle').text();
                var widgetNo = $(this).find('div.widgetNo').text();
                me.editBannerNo = widgetNo;
                me.editWidgetTitle = widgetTitle;
                bannerController.getBannerEditing(widgetNo);
                me.$formEditBanner[0].reset();
                if (me.$formEditBanner.data('formValidation')) {
                    me.$formEditBanner.data('formValidation').destroy();
                }
                me.initFormEGPValidation();
                me.$formEditBanner.find('input[name=widgetTitle]').val(me.editWidgetTitle);
                me.$formEditBanner.find('input[name=widgetNo]').val(me.editBannerNo);
                me.$modalEditBanner.modal({backdrop: 'static', show: true});
            }
        });

        me.$modalAddBanner.on('click', '#btn-add-banner', function(e){
            e.preventDefault();
            var formValidation = me.$formAddBanner.data('formValidation');

            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else {
                me.$modalAddBanner.modal('hide');
                var data = {};
                data.widgetTitle = me.$formAddBanner.find('input[name=widgetTitle]').val();
                bannerController.saveBanner(data, true);
            }
        });

        me.$modalEditBanner.on('click', '#btn-edit-banner', function(e){
            e.preventDefault();
            var formValidation = me.$formEditBanner.data('formValidation');

            formValidation.validate();
            // check case user click save button too fast
            // form is validating or not finish yet so they must click second click to save
            // sleep process 1s and validate again to continue
            if(formValidation.isValid() == null){
                setTimeout(function(){
                    console.log('form is validating');
                    formValidation.validate();
                    me.processEditBanner(formValidation);
                }, 1000);
            } else {
                me.processEditBanner(formValidation);
            }

        });
    },

    processEditBanner: function(formValidation){
        var me = this;
        if (!formValidation.isValid()) {
            return;
        } else {
            me.$modalEditBanner.modal('hide');
            var data = bannerController.$bannerEditing;
            data.widgetTitle = me.$formEditBanner.find('input[name=widgetTitle]').val();
            data.widgetNo = me.$formEditBanner.find('input[name=widgetNo]').val();
            bannerController.saveBanner(data, false);
        }
    },

    loadBannerList: function(loadFirstBanner) {
        var me = this;

        var url = '/admin/banner/list.json';
        me.tableBannerList.bootstrapTable('refresh', {url: url});

        if (loadFirstBanner) {
            me.getFirstBannerOfList();
        }
    },

    getFirstBannerOfList: function() {
        var me = this;

        var url = '/admin/banner/list/first.json';
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
                    var banner = data.data;
                    if(banner != null){
                        me.currWidgetNo = banner.widgetNo;
                        bannerController.getBannerDetail(banner.widgetNo);
                        if(me.tableBannerList.find('input.checkbox-item[data-value=' + banner.widgetNo + ']').length > 0){
                            me.tableBannerList.find('input.checkbox-item[data-value=' + banner.widgetNo + ']')[0].click()
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

var bannerListController = new BannerListController('#container-banner-list');