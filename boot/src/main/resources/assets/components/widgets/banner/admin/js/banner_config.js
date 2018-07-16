/**
 * Created by Hai Nguyen on 8/17/2016.
 */
var BannerConfigController = function (selector) {
    this.init(selector);
};

$.extend(BannerConfigController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;
        me.$container = $(selector);
        me.$tableBannerConfigList       = me.$container.find('#table-banner-config-list');
        me.$formBannerDetail            = me.$container.find('#form-banner-detail');
        me.$modalAddBannerConfig        = me.$container.find('#modal-add-banner-config');
        me.$formAddBannerConfig         = me.$container.find('#form-add-banner-config');

        me.bannerConfigSelected = undefined;
        me.bannerConfigPrev = undefined;
        me.bannerConfigNext = undefined;

        me.initBootstrapTable();
        me.initEventHandlers();
        me.initFormValidation();
    },

    initBootstrapTable : function() {
        var me = this;

        me.$tableBannerConfigList.bootstrapTable({
            cache: false,
            smartDisplay: false,
            showHeader : true,
            uniqueId: "bannerNo",
            pagination : true,
            pageSize: 4,
            columns: [
                {
                    field: 'No',
                    title: '순서',
                    sortable: true,
                    width: '5%',
                    formatter: function(value,object, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'imageTitle',
                    title: '제목',
                    width: '30%',
                    sortable: true,
                    formatter: function(value,object){
                        var preview = '<div class="photo" style="width: 164px; height: 90px;"> ' + '</div>';

                        if(object.bannerImageEnc != null && object.bannerImageEnc != ''){
                            preview = '<div class="photo"> ' +
                                            '<img src="data:image/jpeg;base64, ' + object.bannerImageEnc
                                            + '" alt="' + object.bannerAlt
                                            +'" class="img-responsive banner-image" />' +
                                        '</div>';
                        }

                        var bannerTitle = '';
                        if(object.bannerTitle != null){
                            bannerTitle = object.bannerTitle;
                        }

                        return '<div class="col-xs-6 text-center none-padding">'
                                     + preview +
                                '</div>' +
                                '<div class="col-xs-6 none-padding banner-config-title">' +
                                    bannerTitle +
                                '</div> ';
                    }
                },
                {
                    field: 'linkType',
                    title: '링크 종류',
                    sortable: true,
                    width: '10%',
                    formatter: function(value,object){
                        if(value == null){
                            return '';
                        } else {
                            return value;
                        }
                    }
                },
                {
                    field: 'bannerUrl',
                    title: '링크',
                    sortable: true,
                    width: '20%',
                    formatter: function(value,object){
                        if(value == null){
                            return '<div class="none-padding banner-config-url"></div> ';
                        } else {
                            return '<div class="none-padding banner-config-url">' + value + '</div> ';
                        }
                    }
                },
                {
                    field: 'bannerTarget',
                    title: '링크 타겟',
                    sortable: true,
                    width: '10%',
                    formatter: function(value,object){
                        if(value == null){
                            return '';
                        } else {
                            return value;
                        }
                    }
                },
                {
                    field: 'showStartDateStr',
                    title: '표시 시작 날짜',
                    sortable: true,
                    width: '10%',
                    formatter: function(value,object){
                        if(value != null && value != ''){
                            return value;
                        } else {
                            return '';
                        }
                    }
                },
                {
                    field: 'showEndDateStr',
                    title: '표시 종료 날짜',
                    sortable: true,
                    width: '10%',
                    formatter: function(value,object){
                        if(value != null && value != ''){
                            return value;
                        } else {
                            return '';
                        }
                    }
                },
                {
                    field: 'edit',
                    width: '5%',
                    align: 'center',
                    formatter: function(value,object){
                        return'<div class="col-xs-6 text-center none-padding">' +
                            '<i class="inline glyphicon glyphicon-pencil btn-edit pointer-click-icon" data-banner-no="'+object.bannerNo+'">' +
                            '</i></div>' +
                            '<div class="col-xs-6 text-left none-padding">' +
                            '<i class="inline fa fa-trash btn-delete pointer-click-icon" data-banner-no="' + object.bannerNo +
                            '"></i></div></div>';
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

    initFormValidation: function (){
        var me = this;

        me.$formBannerDetail.formValidation({
            framework: 'bootstrap',
            icon: {
                //valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'exposureTime': {
                    row: '.controls',
                    validators: {
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
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

    initFormDetailValidation: function (){
        var me = this;

        me.$formAddBannerConfig.formValidation({
            framework: 'bootstrap',
            icon: {
                //valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'bannerTitle': {
                    row: '.controls',
                    validators: {
                        notEmpty: {}
                    }
                },
                'bannerImage': {
                    enabled: false,
                    row: '.controls',
                    validators: {
                        notEmpty: {}
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

    initEventHandlers: function() {
        var me = this;

        me.$tableBannerConfigList.on('click', 'tbody > tr', function (e) {
            me.$tableBannerConfigList.find('tbody > tr').removeClass('row-selected');
            $(this).addClass('row-selected');
            var bannerNoSelected = $(this).data('uniqueid');
            var rowSelect = me.$tableBannerConfigList.bootstrapTable('getRowByUniqueId', bannerNoSelected);
            me.bannerConfigSelected = rowSelect;

            var index = $(this).data('index');
            var data = me.$tableBannerConfigList.bootstrapTable('getData');

            var rowPrev = data[index - 1];
            me.bannerConfigPrev = rowPrev;

            var rowNext = data[index + 1];
            me.bannerConfigNext = rowNext;
        });

        me.$container.on('click', '.sort-up', function (e) {
            e.preventDefault();
            if(me.bannerConfigSelected && me.bannerConfigPrev){
                var currSortNo = me.bannerConfigSelected.sortNo;
                var prevSortNo = me.bannerConfigPrev.sortNo;

                me.bannerConfigSelected.sortNo = prevSortNo;
                me.bannerConfigPrev.sortNo = currSortNo;
                me.saveBannerConfig(me.bannerConfigSelected, false);
                me.saveBannerConfig(me.bannerConfigPrev, false);
            }
        });

        me.$container.on('click', '.sort-down', function (e) {
            e.preventDefault();
            if(me.bannerConfigSelected && me.bannerConfigNext){
                var currSortNo = me.bannerConfigSelected.sortNo;
                var nextSortNo = me.bannerConfigNext.sortNo;

                me.bannerConfigSelected.sortNo = nextSortNo;
                me.bannerConfigNext.sortNo = currSortNo;
                me.saveBannerConfig(me.bannerConfigSelected, false);
                me.saveBannerConfig(me.bannerConfigNext, false);
            }
        });

        me.$tableBannerConfigList.on('click', '.btn-delete', function (e) {
            e.preventDefault();
            var bannerNo = $(this).data('bannerNo');
            var allBannerNo = [bannerNo];
            var message = siteAdminApp.getMessage('banner.config.confirm.message.delete.selected');
            var callbackFunc = me.deleteBannerConfig;
            var paramsForCallbackFunc = allBannerNo;
            mugrunApp.showCommonConfirmDialog(message, callbackFunc, paramsForCallbackFunc);
        });

        me.$formBannerDetail.on('click', '.btn-save-banner', function(e){
            e.preventDefault();
            var formValidation = me.$formBannerDetail.data('formValidation');

            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else {
                var data = me.getBannerDetail();
                bannerController.saveBanner(data, false);
            }
        });

        me.$container.on('click', '.btn-add', function (e) {
            e.preventDefault();

            me.initDatePicker();

            var widgetNo = bannerController.$currBannerDetail.widgetNo;
            me.$formAddBannerConfig.find('input[name=widgetNo]').val(widgetNo);

            //if the box is checked when the unchecked event is fired which that would never happen
            me.$formAddBannerConfig.find('.icheckbox_minimal-grey').removeClass('checked');
            me.$formAddBannerConfig.find('input[name=showStartDate]')[0].setAttribute("disabled","disabled");
            me.$formAddBannerConfig.find('input[name=showEndDate]')[0].setAttribute("disabled","disabled");

            me.$formAddBannerConfig.find('select[name=bannerTargetNone]')[0].setAttribute("disabled","disabled");
            me.$formAddBannerConfig.find('select[name=bannerTargetURL]')[0].setAttribute("disabled","disabled");
            me.$formAddBannerConfig.find('input[name=bannerUrl]')[0].setAttribute("disabled","disabled");
            me.$formAddBannerConfig.find('select[name=bannerTargetNone]').removeClass('hide');
            me.$formAddBannerConfig.find('select[name=bannerTargetURL]').addClass('hide');

            me.initFormDetailValidation();

            me.$formAddBannerConfig.formValidation('enableFieldValidators', 'bannerImage', true);

            me.$modalAddBannerConfig.modal({backdrop: 'static', show: true});
        });

        me.$tableBannerConfigList.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            me.initDatePicker();

            var bannerNo = $(this).data('bannerNo');
            var bannerConfig = me.$tableBannerConfigList.bootstrapTable('getRowByUniqueId', bannerNo);
            me.buildBannerConfigDetail(bannerConfig);

            me.initFormDetailValidation();

            me.$modalAddBannerConfig.modal({backdrop: 'static', show: true});
        });

        me.$formAddBannerConfig.find(".fileinput").on("change.bs.fileinput", function(e) {
            e.preventDefault();

            me.$formAddBannerConfig.formValidation('enableFieldValidators', 'bannerImage', true);

            var input = me.$formAddBannerConfig.find('input[name=bannerImage]')[0].files;
            if (input.length > 0) {
                var reader = new FileReader();
                me.$formAddBannerConfig.find('.preview-banner-div').addClass('hide');
                var previewImage = me.$formAddBannerConfig.find('.preview-banner-image');
                reader.onload = function (e) {
                    previewImage.attr('src', e.target.result);
                    me.$formAddBannerConfig.find('.preview-banner-image-div').removeClass('hide');

                    var theImage = new Image();
                    theImage.src = previewImage.attr("src");
                    // Get accurate measurements from that.
                    var imageWidth = theImage.width;
                    var imageHeight = theImage.height;
                    me.$formAddBannerConfig.find('.image-original-width-height').text('Width = '
                    + imageWidth + 'px; Height = '+ imageHeight +'px');
                };

                reader.readAsDataURL(input[0]);
            } else {
                me.$formAddBannerConfig.find('.preview-banner-div').removeClass('hide');
                me.$formAddBannerConfig.find('.preview-banner-image-div').addClass('hide');
            }
        });

        me.$formAddBannerConfig.find('input[name=expiryUseYn]').on('click', function(e){
            e.preventDefault();
            if(me.isCheck(me.$formAddBannerConfig.find('input[name=expiryUseYn]'))){
                me.$formAddBannerConfig.find('input[name=showStartDate]')[0].setAttribute("disabled","disabled");
                me.$formAddBannerConfig.find('input[name=showEndDate]')[0].setAttribute("disabled","disabled");
            } else {
                me.$formAddBannerConfig.find('input[name=showStartDate]')[0].removeAttribute("disabled");
                me.$formAddBannerConfig.find('input[name=showEndDate]')[0].removeAttribute("disabled");
            }
        });

        me.$modalAddBannerConfig.on('hidden.bs.modal', function (e) {
            e.preventDefault();

            me.resetBannerConfigModal();
        });

        me.$modalAddBannerConfig.on('click', '.btn-dialog-save', function (e) {
            e.preventDefault();

            var formValidation = me.$formAddBannerConfig.data('formValidation');

            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else {
                var file = me.$formAddBannerConfig.find('input[name=bannerImage]')[0].files;
                if(file && file.length > 0) {
                    me.uploadBannerImageFile(file[0]);
                } else {
                    var bannerConfig = me.getBannerConfigDetail();
                    me.saveBannerConfig(bannerConfig, true);
                }
            }
        });

        me.$formAddBannerConfig.find('select[name=linkType]').on('change', function(e){
            e.preventDefault();
            var linkType = $(this).val();
            if(linkType == ''){
                me.$formAddBannerConfig.find('select[name=bannerTargetNone]').removeClass('hide');
                me.$formAddBannerConfig.find('select[name=bannerTargetURL]')[0].setAttribute("disabled","disabled");
                me.$formAddBannerConfig.find('select[name=bannerTargetURL]').addClass('hide');
                me.$formAddBannerConfig.find('input[name=bannerUrl]')[0].setAttribute("disabled","disabled");
            } else if(linkType == 'url'){
                me.$formAddBannerConfig.find('select[name=bannerTargetURL]').removeClass('hide');
                me.$formAddBannerConfig.find('select[name=bannerTargetNone]').addClass('hide');
                me.$formAddBannerConfig.find('select[name=bannerTargetURL]')[0].removeAttribute("disabled");
                me.$formAddBannerConfig.find('input[name=bannerUrl]')[0].removeAttribute("disabled");
            }
        });
    },

    initDatePicker: function(){
        var me = this;

        var $showStartDate = me.$formAddBannerConfig.find('input[name="showStartDate"]');
        var $showEndDate = me.$formAddBannerConfig.find('input[name="showEndDate"]');
        $showStartDate.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });

        $showEndDate.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });

        $showStartDate.on('changeDate', function(e) {
            $showEndDate.datepicker('setStartDate', e.date);
        });
    },

    loadBannerConfigList: function() {
        var me = this;

        var data = {}
        var widgetNo = bannerController.$currBannerDetail.widgetNo;
        data.widgetNo = widgetNo;

        $.ajax({
            url: '/admin/banner/config/list.json',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function(data) {
                if (data.success) {
                    var bannerConfigs = data.data;
                    me.$tableBannerConfigList.bootstrapTable('load', bannerConfigs);
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
    },

    deleteBannerConfig : function(bannerNos){
        var me = bannerConfigController;

        $.ajax({
            url: '/admin/banner/config/delete.json',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                bannerNos: bannerNos.join(',')
            },
            success: function(data) {
                if (data.success) {
                    var message = mugrunApp.getMessage('common.alert.dialog.message.deleted');
                    mugrunApp.showCommonAlertDialog(message);
                    // load again
                    me.loadBannerConfigList();
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
    },

    buildBannerDetail: function(banner){
        var me = this;
        var ele = me.$container.find('input[name=autoPlayYn]');
        if(banner.autoPlayYn == true) {
            me.check(ele);
        } else {
            me.unCheck(ele);
        }

        me.$container.find('input[name=exposureTime]').val(banner.exposureTime);
    },

    getBannerDetail: function(){
        var me = this;
        var banner = bannerController.$currBannerDetail;
        var ele = me.$container.find('input[name=autoPlayYn]');
        if(me.isCheck(ele)) {
            banner.autoPlayYn = 1;
        } else {
            banner.autoPlayYn = 0;
        }

        banner.exposureTime = me.$container.find('input[name=exposureTime]').val();
        return banner;
    },

    buildBannerConfigDetail: function(bannerConfig){
        var me = this;

        me.$formAddBannerConfig.find('span.file-banner-name').text(bannerConfig.bannerImageName);

        me.$formAddBannerConfig.find('input[name=bannerTitle]').val(bannerConfig.bannerTitle);
        me.$formAddBannerConfig.find('input[name=bannerAlt]').val(bannerConfig.bannerAlt);
        me.$formAddBannerConfig.find('select[name=linkType]').val(bannerConfig.linkType);
        if(bannerConfig.linkType == ''){
            me.$formAddBannerConfig.find('select[name=bannerTargetNone]').removeClass('hide');
            me.$formAddBannerConfig.find('select[name=bannerTargetNone]')[0].setAttribute("disabled","disabled");
            me.$formAddBannerConfig.find('select[name=bannerTargetURL]')[0].setAttribute("disabled","disabled");
            me.$formAddBannerConfig.find('select[name=bannerTargetURL]').addClass('hide');
            me.$formAddBannerConfig.find('input[name=bannerUrl]')[0].setAttribute("disabled","disabled");
        } else if(bannerConfig.linkType == 'url'){
            me.$formAddBannerConfig.find('select[name=bannerTargetURL]').removeClass('hide');
            me.$formAddBannerConfig.find('select[name=bannerTargetNone]').addClass('hide');
            me.$formAddBannerConfig.find('select[name=bannerTargetURL]')[0].removeAttribute("disabled");
            me.$formAddBannerConfig.find('input[name=bannerUrl]')[0].removeAttribute("disabled");
            me.$formAddBannerConfig.find('select[name=bannerTargetURL]').val(bannerConfig.bannerTarget);
            me.$formAddBannerConfig.find('input[name=bannerUrl]').val(bannerConfig.bannerUrl);
        }
        me.$formAddBannerConfig.find('input[name=showStartDate]').datepicker("setDate", bannerConfig.showStartDateStr);
        me.$formAddBannerConfig.find('input[name=showEndDate]').datepicker("setDate", bannerConfig.showEndDateStr);
        if(bannerConfig.showStartDateStr != null && bannerConfig.showStartDateStr != ''){
            me.$formAddBannerConfig.find('input[name=showEndDate]').datepicker("setStartDate", bannerConfig.showStartDateStr);
        }
        me.$formAddBannerConfig.find('input[name=bannerNo]').val(bannerConfig.bannerNo);
        me.$formAddBannerConfig.find('input[name=widgetNo]').val(bannerConfig.widgetNo);
        me.$formAddBannerConfig.find('input[name=bannerImageName]').val(bannerConfig.bannerImageName);
        me.$formAddBannerConfig.find('input[name=bannerImageNo]').val(bannerConfig.bannerImageFile);
        me.$formAddBannerConfig.find('input[name=sortNo]').val(bannerConfig.sortNo);
        me.$formAddBannerConfig.find('input[name=originalWidth]').val(bannerConfig.originalWidth);
        me.$formAddBannerConfig.find('input[name=originalHeight]').val(bannerConfig.originalHeight);
        me.$formAddBannerConfig.find('.image-original-width-height').text('Width = '
        + bannerConfig.originalWidth + 'px; Height = '+ bannerConfig.originalHeight +'px');

        me.$formAddBannerConfig.find('input[name=menuNo]').val(bannerConfig.menuNo);
        me.$formAddBannerConfig.find('input[name=bannerContent]').val(bannerConfig.bannerContent);
        me.$formAddBannerConfig.find('input[name=regUserNo]').val(bannerConfig.regUserNo);
        me.$formAddBannerConfig.find('input[name=regDate]').val(bannerConfig.regDateStr);
        me.$formAddBannerConfig.find('input[name=modUserNo]').val(bannerConfig.modUserNo);
        me.$formAddBannerConfig.find('input[name=modDate]').val(bannerConfig.modDateStr);


        var ele = me.$formAddBannerConfig.find('input[name=expiryUseYn]');
        if(bannerConfig.expiryUseYn == true) {
            me.check(ele);
            me.$formAddBannerConfig.find('input[name=showStartDate]')[0].removeAttribute("disabled");
            me.$formAddBannerConfig.find('input[name=showEndDate]')[0].removeAttribute("disabled");
        } else {
            me.unCheck(ele);
            me.$formAddBannerConfig.find('input[name=showStartDate]')[0].setAttribute("disabled","disabled");
            me.$formAddBannerConfig.find('input[name=showEndDate]')[0].setAttribute("disabled","disabled");
        }

        if(bannerConfig.bannerImageEnc != null) {
            var $previewImage = me.$formAddBannerConfig.find('.preview-banner-image');
            $previewImage[0].setAttribute("src", "data:image/jpeg;base64, " + bannerConfig.bannerImageEnc);
            $previewImage[0].setAttribute("alt", bannerConfig.bannerAlt);
            me.$formAddBannerConfig.find('.preview-banner-image-div').removeClass('hide');
            me.$formAddBannerConfig.find('.preview-banner-div').addClass('hide');
        }
    },

    getBannerConfigDetail: function(){
        var me = this;
        var bannerConfig = {};

        bannerConfig.bannerTitle =  me.$formAddBannerConfig.find('input[name=bannerTitle]').val();
        bannerConfig.bannerAlt = me.$formAddBannerConfig.find('input[name=bannerAlt]').val();
        bannerConfig.linkType = me.$formAddBannerConfig.find('select[name=linkType]').val();
        if(bannerConfig.linkType == 'url'){
            bannerConfig.bannerTarget = me.$formAddBannerConfig.find('select[name=bannerTargetURL]').val();
            bannerConfig.bannerUrl = me.$formAddBannerConfig.find('input[name=bannerUrl]').val();
        } else {
            bannerConfig.bannerTarget = '';
            bannerConfig.bannerUrl = '';
        }
        bannerConfig.showStartDate = me.$formAddBannerConfig.find('input[name=showStartDate]').val();
        bannerConfig.showEndDate = me.$formAddBannerConfig.find('input[name=showEndDate]').val();
        bannerConfig.regUserNo = me.$formAddBannerConfig.find('input[name=regUserNoModal]').val();
        bannerConfig.regDateStr = me.$formAddBannerConfig.find('input[name=regDateModal]').val();
        bannerConfig.modUserNo = me.$formAddBannerConfig.find('input[name=modUserNoModal]').val();
        bannerConfig.modDateStr = me.$formAddBannerConfig.find('input[name=modDateModal]').val();
        bannerConfig.bannerNo = me.$formAddBannerConfig.find('input[name=bannerNo]').val();
        bannerConfig.widgetNo = me.$formAddBannerConfig.find('input[name=widgetNo]').val();
        bannerConfig.bannerImageName = me.$formAddBannerConfig.find('input[name=bannerImageName]').val();
        bannerConfig.bannerImageFile = me.$formAddBannerConfig.find('input[name=bannerImageNo]').val();
        bannerConfig.sortNo = me.$formAddBannerConfig.find('input[name=sortNo]').val();
        bannerConfig.originalWidth = me.$formAddBannerConfig.find('input[name=originalWidth]').val();
        bannerConfig.originalHeight = me.$formAddBannerConfig.find('input[name=originalHeight]').val();
        bannerConfig.menuNo = me.$formAddBannerConfig.find('input[name=menuNo]').val();
        bannerConfig.bannerContent = me.$formAddBannerConfig.find('input[name=bannerContent]').val();

        var ele = me.$formAddBannerConfig.find('input[name=expiryUseYn]');

        if(me.isCheck(ele)) {
            bannerConfig.expiryUseYn = true;
        } else {
            bannerConfig.expiryUseYn = false;
        }

       return bannerConfig;
    },

    resetBannerConfigModal: function(){
        var me = this;

        me.$formAddBannerConfig[0].reset();
        if(me.$formAddBannerConfig.data('formValidation')) {
            me.$formAddBannerConfig.data('formValidation').destroy();
        }
        var expiryUseYn = me.$container.find('input[name=expiryUseYn]');
        me.unCheck(expiryUseYn);
        me.$formAddBannerConfig.find('input[name=showStartDate]')[0].setAttribute("disabled","disabled");
        me.$formAddBannerConfig.find('input[name=showEndDate]')[0].setAttribute("disabled","disabled");

        //reset file name
        me.$formAddBannerConfig.find('span.file-banner-name').text('');
        // reset review
        me.$formAddBannerConfig.find('.preview-banner-div').removeClass('hide');
        me.$formAddBannerConfig.find('.preview-banner-image-div').addClass('hide');

        // reset data
        me.$formAddBannerConfig.find('input[name=bannerTitle]').val('');
        me.$formAddBannerConfig.find('input[name=bannerAlt]').val('');
        me.$formAddBannerConfig.find('select[name=linkType]').val('');
        me.$formAddBannerConfig.find('select[name=bannerTargetNone]').removeClass('hide');
        me.$formAddBannerConfig.find('select[name=bannerTargetURL]').addClass('hide');
        me.$formAddBannerConfig.find('input[name=showStartDate]').val('');
        me.$formAddBannerConfig.find('input[name=showEndDate]').val('');
        me.$formAddBannerConfig.find('input[name=bannerNo]').val('');
        me.$formAddBannerConfig.find('input[name=widgetNo]').val('');
        me.$formAddBannerConfig.find('input[name=bannerImageName]').val('');
        me.$formAddBannerConfig.find('input[name=bannerImageNo]').val('');
        me.$formAddBannerConfig.find('input[name=sortNo]').val('');
        me.$formAddBannerConfig.find('input[name=originalWidth]').val('');
        me.$formAddBannerConfig.find('input[name=originalHeight]').val('');
        me.$formAddBannerConfig.find('input[name=menuNo]').val('');
        me.$formAddBannerConfig.find('input[name=bannerContent]').val('');
        me.$formAddBannerConfig.find('input[name=regUserNo]').val('');
        me.$formAddBannerConfig.find('input[name=regDate]').val('');
        me.$formAddBannerConfig.find('input[name=modUserNo]').val('');
        me.$formAddBannerConfig.find('input[name=modDate]').val('');

        me.$formAddBannerConfig.find('.image-original-width-height').text('Width = 1px; Height = 1px');

        var $showStartDate = me.$formAddBannerConfig.find('input[name="showStartDate"]');
        var $showEndDate = me.$formAddBannerConfig.find('input[name="showEndDate"]');
        $showStartDate.datepicker('remove');
        $showEndDate.datepicker('remove');

    },

    uploadBannerImageFile: function(file) {
        var me = this;
        var oMyForm = new FormData();
        oMyForm.append('file', file);
        $.ajax({
            dataType: 'json',
            url: "/admin/banner/config/image/upload.json",
            data: oMyForm,
            type: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (result) {
                if (result.success) {
                    var fileNo = result.data;
                    var bannerConfig = me.getBannerConfigDetail();

                    var previewImage = me.$formAddBannerConfig.find('.preview-banner-image');
                    var theImage = new Image();
                    theImage.src = previewImage.attr("src");
                    // Get accurate measurements from that.
                    var imageWidth = theImage.width;
                    var imageHeight = theImage.height;
                    bannerConfig.originalWidth = imageWidth;
                    bannerConfig.originalHeight = imageHeight;

                    bannerConfig.bannerImageFile = fileNo;
                    me.saveBannerConfig(bannerConfig, true);
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            }
        });
    },

    saveBannerConfig : function(bannerConfig, showMessage){
        var me = this;

        $.ajax({
            url: '/admin/banner/config/save.json',
            type: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(bannerConfig),
            success: function(data) {
                if (data.success) {
                    if(showMessage) {
                        me.$modalAddBannerConfig.modal('hide');
                        var title = mugrunApp.getMessage('common.alert.dialog.title');
                        var message = mugrunApp.getMessage('common.alert.dialog.message.saved');
                        var type = BootstrapDialog.TYPE_PRIMARY;
                        var buttonLabel = mugrunApp.getMessage('common.btn.ok');
                        var buttonClass = 'btn blue';
                        mugrunApp.showAlertDialog(title, message, type, buttonLabel, buttonClass);
                    }
                    // load again
                    me.loadBannerConfigList();

                    me.bannerConfigSelected = undefined;
                    me.bannerConfigPrev = undefined;
                    me.bannerConfigNext = undefined;
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
    },

    unCheck: function(cb) {
        if($(cb).parent().hasClass('checked')) {
            $(cb).prop("checked", false);
            $(cb).parent().removeClass('checked');
        }
    },
    check: function(cb) {
        if(!$(cb).parent().hasClass('checked')) {
            $(cb).click();
        }
    },

    isCheck: function(cb){
        if($(cb).parent().hasClass('checked')) {
            return true;
        }
        return false;
    }

});

var bannerConfigController = new BannerConfigController('#container-banner-config');