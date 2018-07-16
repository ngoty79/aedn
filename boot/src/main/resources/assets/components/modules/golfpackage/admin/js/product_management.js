var ProductManagementController = function (selector) {
    this.init(selector);
};

$.extend(ProductManagementController.prototype, {
    $container: null,
    oEditors: [],

    init: function (selector) {
        var me = this;
        me.$container = $(selector);
        me.$tableProductList              = me.$container.find('#table-product-list');
        me.$tableActionProductList        = me.$container.find('#table-action-product-list');
        me.$modalAddProduct               = me.$container.find('#modal-add-product');

        me.selectFirstCategory            = me.$tableActionProductList.find('.select-first-category');
        me.tmplSelectFirstCategory        = me.$container.find('#tmpl-select-first-category');
        me.selectSecondCategory           = me.$tableActionProductList.find('.select-second-category');
        me.tmplSelectSecondCategory       = me.$container.find('#tmpl-select-second-category');
        me.selectStatusProduct            = me.$tableActionProductList.find('.select-status-product-list');

        me.selectFirstCategoryModal       = me.$modalAddProduct.find('.select-first-category');
        me.tmplSelectFirstCategoryModal   = me.$container.find('#tmpl-select-first-category-modal');
        me.selectSecondCategoryModal      = me.$modalAddProduct.find('.select-second-category');
        me.tmplSelectSecondCategoryModal  = me.$container.find('#tmpl-select-second-category-modal');
        me.$tableProductOptionList        = me.$modalAddProduct.find('#table-product-option-list');
        me.$formAddProduct                = me.$modalAddProduct.find('#form-add-product');

        me.listOptionDeleted = [];

        me.initEventHandlers();
        me.initBootstrapTable();
        me.checkInputSearchProduct();
    },

    initEventHandlers: function(){
        var me = this;

        me.$tableActionProductList.on('change', '.select-first-category', function(e){
            e.preventDefault();
            var categoryNo = me.selectFirstCategory.val();
            if(categoryNo != ''){
                var packageNo = golfPackageController.$currGolfPackageDetail.packageNo;
                me.loadSecondCategoryList(packageNo, categoryNo, me.secondCategoryProductList);
            } else {
                me.selectSecondCategory.val('');
                me.selectSecondCategory.empty().append(
                    $.tmpl(me.tmplSelectSecondCategory.html(), {categories : []})
                );
            }
            me.loadProductList();
        });

        me.$modalAddProduct.on('change', '.select-first-category', function(e){
            e.preventDefault();
            var categoryNo = me.selectFirstCategoryModal.val();
            if(categoryNo != ''){
                var packageNo = golfPackageController.$currGolfPackageDetail.packageNo;
                me.loadSecondCategoryList(packageNo, categoryNo, me.secondCategoryCreateProduct);
            } else {
                me.selectSecondCategoryModal.val('');
                me.selectSecondCategoryModal.empty().append(
                    $.tmpl(me.tmplSelectSecondCategoryModal.html(), {categories : []})
                );
            }
        });

        me.$tableActionProductList.on('change', '.select-second-category, .select-status-product-list', function(e){
            e.preventDefault();
            me.loadProductList();
        });

        me.$tableActionProductList.find('#text-search-product').keydown(function (event) {
            setTimeout(function () {
                me.checkInputSearchProduct();
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13') {
                    me.loadProductList();
                }
            }, 1);
        });

        me.$tableActionProductList.on('click', '.search-clear', function(e){
            e.preventDefault();
            me.$container.find('#text-search-product').val("");
            // me.loadProductList();
            me.$tableActionProductList.find('.search-clear').addClass('hide');
        });

        me.$tableActionProductList.on('click', '#btn-search-product', function (e) {
            e.preventDefault();
            me.loadProductList();
        });

        me.$tableProductList.on('click', 'tbody > tr', function (e) {
            if (e.target.type != 'checkbox' && e.target.className.indexOf('btn-edit') == -1
                && e.target.className.indexOf('btn-delete') == -1 ) {
                me.$tableProductList.find('input.checkbox-item:checked').click();
                jQuery(e.currentTarget).find('input').click();
            }
        });

        me.$tableActionProductList.on('click', '.btn-select-all', function (e) {
            e.preventDefault();
            var itemNotCheck = me.$tableProductList.find('input.checkbox-item:not(:checked)');
            if (itemNotCheck.length == 0) {
                me.$tableProductList.find('input.checkbox-item').click();
            } else {
                itemNotCheck.click();
            }
        });

        me.$tableActionProductList.on('click', '.btn-delete-selected', function (e) {
            e.preventDefault();
            var allItem = me.$tableProductList.find('input.checkbox-item:checked');
            var allProductNo = [];
            $.each(allItem, function(i, item){
                allProductNo.push($(item).attr('data-value'));
            });
            if(allProductNo.length > 0) {
                var message = mugrunApp.getMessage('common.dialog.confirm.default.message.delete');
                var callbackFunc = me.deleteGolfProduct;
                var paramsForCallbackFunc = allProductNo;
                mugrunApp.showCommonConfirmDialog(message, callbackFunc, paramsForCallbackFunc);
            } else {
                var message = mugrunApp.getMessage('common.delete.no.selection');
                mugrunApp.showCommonAlertDialog(message);
            }
        });

        me.$tableProductList.on('click', '.btn-delete', function (e) {
            e.preventDefault();
            var productNo = $(this).data('productNo');
            var allProductNo = [productNo];
            var message = mugrunApp.getMessage('common.dialog.confirm.default.message.delete');
            var callbackFunc = me.deleteGolfProduct;
            var paramsForCallbackFunc = allProductNo;
            mugrunApp.showCommonConfirmDialog(message, callbackFunc, paramsForCallbackFunc);
        });

        me.$tableActionProductList.on('click', '.btn-add', function (e) {
            e.preventDefault();
            // init formvalidation first because destroy it when cancel modal
            me.initFormValidation();

            // change title modal
            me.$modalAddProduct.find('#label-add-product-title').text('상품등록');

            // alway at least 1 product option
            me.insertFirstRowTableOption();

            // update current package no
            var packageNo = golfPackageController.$currGolfPackageDetail.packageNo;
            me.$formAddProduct.find('input[name=packageNo]').val(packageNo);

            me.$modalAddProduct.modal({backdrop: 'static', show: true});

            me.getSmartEditor('editor-product-content', '');
            me.getSmartEditor('editor-product-agreement', '');
        });

        me.$tableProductList.on('click', '.btn-edit', function (e) {
            e.preventDefault();
            // init formvalidation first because destroy it when cancel modal
            me.initFormValidation();

            // change title modal
            me.$modalAddProduct.find('#label-add-product-title').text('상품수정');
            //binding data
            var productNo = $(this).data('productNo');
            //var product = me.$tableProductList.bootstrapTable('getRowByUniqueId', productNo);

            $.when(me.loadProductDetail(productNo)).done(function(rs){
                if (rs.success) {
                    var product = rs.data;

                    me.buildDataProductModal(product);
                    if(product.golfPackageProductOption.length == 0) {
                        me.insertFirstRowTableOption();
                    } else {
                        me.buildDataProductOption(product.golfPackageProductOption);
                    }

                    if(product.siteFiles.length > 0){
                        me.buildImagesFileModal(product.siteFiles);
                    }

                    me.$modalAddProduct.modal({backdrop: 'static', show: true});
                } else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            });

        });

        me.$tableProductOptionList.on('click', '.btn-add-product-option', function (e) {
            e.preventDefault();
            /*var index = me.$tableProductOptionList.bootstrapTable('getData').length;
            var date = new Date();
            var currentDate = moment(date).format('YYYY-MM-DD');
            me.$tableProductOptionList.bootstrapTable('insertRow', {index: index, row: {
                departDateStr: '',
                arriveDateStr: '',
                targetPeopleCount: '',
                minPeopleCount: '',
                trafficInfo: '',
                optionPrice: '',
                optionStatus: 10
            }});
             */
            var $row = me.$modalAddProduct.find('#template-row-product-option').clone();
            $row.find('.btn-remove-product-option').removeClass('hide');
            $row.find('.btn-add-product-option').addClass('hide');
            var option = {
                departDateStr: '',
                departTime: '',
                arriveDateStr: '',
                arriveTime: '',
                targetPeopleCount: '',
                minPeopleCount: '',
                trafficInfo: '',
                optionPrice: '',
                optionStatus: 10
            };
            $row = me.buildDataRowOption($row, option);
            me.insertRowTableProductOption($row);

        });

        me.$tableProductOptionList.on('click', '.btn-remove-product-option', function (e) {
            e.preventDefault();
            /*var index = $(this).data('value');
            var data = me.$tableProductOptionList.bootstrapTable('getData');
            data.splice(index, 1);
            me.$tableProductOptionList.bootstrapTable('load', data);*/
            var $row = $(this).closest('tr');
            var optionNo       = $row.find('input[name="optionNo"]').val();
            var $optionPrice   = $row.find('input[name="optionPrice"]');
            var $departDate    = $row.find('input[name="departDate"]');
            var $arriveDate    = $row.find('input[name="arriveDate"]');
            var $targetPeopleCount = $row.find('input[name="targetPeopleCount"]');
            var $minPeopleCount    = $row.find('input[name="minPeopleCount"]');
            var $departMinutes = $row.find('input[name="departMinutes"]');
            var $arriveMinutes    = $row.find('input[name="arriveMinutes"]');

            $row.remove();

            if(optionNo && optionNo > 0) {
                me.listOptionDeleted.push(optionNo);
            }

            // Remove field
            me.$formAddProduct.formValidation('removeField', $optionPrice);
            me.$formAddProduct.formValidation('removeField', $departDate);
            me.$formAddProduct.formValidation('removeField', $arriveDate);
            me.$formAddProduct.formValidation('removeField', $targetPeopleCount);
            me.$formAddProduct.formValidation('removeField', $minPeopleCount);
            me.$formAddProduct.formValidation('removeField', $departMinutes);
            me.$formAddProduct.formValidation('removeField', $arriveMinutes);
        });

        me.$modalAddProduct.on('click', '.btn-dialog-save', function (e) {
            e.preventDefault();
            var formValidation = me.$formAddProduct.data('formValidation');

            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else{
                var file1 = me.$formAddProduct.find('input#product-image-0')[0].files[0];
                var file2 = me.$formAddProduct.find('input#product-image-1')[0].files[0];
                var file3 = me.$formAddProduct.find('input#product-image-2')[0].files[0];
                var file4 = me.$formAddProduct.find('input#product-image-3')[0].files[0];
                var files = [file1, file2, file3, file4];
                me.uploadProductImageFile(files);
            }
        });

        me.$modalAddProduct.on('click', '.btn-dialog-cancel', function (e) {
            e.preventDefault();
            var message = mugrunApp.getMessage('common.dialog.confirm.default.message.cancel');
            var callbackFunc = me.closeCreateProductModal;
            var paramsForCallbackFunc = undefined;
            mugrunApp.showCommonConfirmDialog(message, callbackFunc, paramsForCallbackFunc);
        });

        me.$modalAddProduct.on('hidden.bs.modal', function () {
            me.closeCreateProductModal();
        });
    },

    initBootstrapTable : function() {
        var me = this;

        me.$tableProductList.bootstrapTable({
            cache: false,
            smartDisplay: false,
            showHeader : true,
            pagination : true,
            paginationHAlign: 'center',
            pageSize: 15,
            uniqueId: "productNo",
            sidePagination: 'server',
            queryParamsType: '',
            queryParams: function(params) {
                return params;
            },
            columns: [
                {
                    field: 'productNo',
                    title: '선택',
                    width: '5%',
                    align: 'center',
                    cellStyle: function (value, row, index) {
                        return {
                            classes: 'checkbox-item'
                        }
                    },
                    formatter: function (value, object) {
                        return '<input type="checkbox" class="checkbox-item" data-value="' + object.productNo + '">';
                    }
                }, {
                    field: 'categoryType',
                    title: '구분',
                    sortable: true,
                    width: '15%',
                    align: 'center',
                    formatter: function(value,object){
                        var data = '[' + object.firstCategoryName + '] ';
                        if(object.secondCategoryName != null){
                            data += object.secondCategoryName;
                        }
                        return data ;
                    }
                }, {
                    field: 'productName',
                    title: '상품명',
                    sortable: true,
                    width: '15%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.productName;
                    }
                }, {
                    field: 'productPrice',
                    title: '금액',
                    sortable: true,
                    width: '15%',
                    align: 'center',
                    formatter: function(value,object){
                        return mugrunApp.formatNumber(value) + '원';
                    }
                }, {
                    field: 'productStatusName',
                    title: '상태',
                    sortable: true,
                    width: '10%',
                    align: 'center'
                }, {
                    field: 'edit',
                    title: '관리',
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 text-center none-padding">&nbsp;</div>' +
                            '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center none-padding">' +
                            '<i class="inline glyphicon glyphicon-pencil btn-edit " data-product-no="'+object.productNo+'"></i></div>' +
                            '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-left none-padding">' +
                            '<i class="inline fa fa-trash btn-delete " data-product-no="' + object.productNo + '"></i></div></div>';
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

        me.$tableProductOptionList.bootstrapTable({
            cache: false,
            classes: 'table',
            smartDisplay: true,
            showHeader : true,
            uniqueId: "optionNo",
            columns: [
                {
                    field: 'optionNo'
                },
                {
                    field: 'departDateTime',
                    title: '출발일자/시간',
                    width: '20%',
                    align: 'center',
                    formatter: function(value,object){
                        //depart Date
                        var $input = '<div class="input-date-time input-append font-green input-append-date controls">' +
                            '<input type="text" name="departDate" class="form-control" value="' + object.departDateStr +'" />' +
                            '<i class="date-picker fa fa-calendar"></i></div>';

                        // depart time (hour and minute)
                        var hour = '';
                        var minute = '';

                        if(object.departTime != null && object.departTime != '') {
                            var times = object.departTime.split(':');

                            if (times[0]) {
                                hour = times[0];
                            }
                            if (times[1]) {
                                minute = times[1];
                            }
                        }

                        var $select = '<select class="form-control select-time-hour" data-container="body" name="departTime" data-live-search="true" ' +
                            'data-value="' + object.optionNo + '">' +
                            '<option value="">시간</option>';
                        for(var i=0; i<25; i++) {
                            $select += '<option value="'+i.pad(2)+'">'+i.pad(2)+'</option>';
                        }
                        $select += '</select>';
                        $($select).find('option[value="' + hour + '"]').attr('selected', 'selected');

                        var $hourMinutes = '<div class="input-hour-minute input-append font-green input-append-time controls">' + $select +
                            '<input type="text" name="departMinutes" class="form-control input-time-minute" value="' + minute +'" />' +
                            '</div>';

                        // return both
                        return $input + $hourMinutes;
                    }
                },
                {
                    field: 'arriveDateTime',
                    title: '도착일자/시간',
                    width: '20%',
                    align: 'center',
                    formatter: function(value,object){
                        // arrive Date
                        var $input = '<div class="input-date-time input-append font-green input-append-date controls">' +
                            '<input type="text" name="arriveDate" class="form-control" placeholder="분입력" value="' + object.arriveDateStr +'" />' +
                            '<i class="date-picker fa fa-calendar"></i></div>';

                        // arrive time
                        var hour = '';
                        var minute = '';

                        if(object.arriveTime != null && object.arriveTime != '') {
                            var times = object.departTime.split(':');

                            if (times[0]) {
                                hour = times[0];
                            }
                            if (times[1]) {
                                minute = times[1];
                            }
                        }

                        var $select = '<select class="form-control select-time-hour" data-container="body" name="arriveTime" data-live-search="true" ' +
                            'data-value="' + object.optionNo + '">' +
                            '<option value="">시간</option>';
                        for(var i=0; i<25; i++) {
                            $select += '<option value="'+i.pad(2)+'">'+i.pad(2)+'</option>';
                        }
                        $select += '</select>';
                        $($select).find('option[value="' + hour + '"]').attr('selected', 'selected');


                        var $hourMinutes = '<div class="input-hour-minute input-append font-green input-append-time controls">' + $select +
                            '<input type="text" name="arriveMinutes" placeholder="분입력" class="form-control input-time-minute" value="' + minute +'" />' +
                            '</div>';

                        // return both
                        return $input + $hourMinutes;
                    }
                },
                {
                    field: 'targetPeopleCount',
                    title: '예정인원',
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return '<div class="controls"><input class="form-control" name="targetPeopleCount" value="' + value + '" /></div>';
                    }
                }, {
                    field: 'minPeopleCount',
                    title: '최소인원',
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return '<div class="controls"><input class="form-control" name="minPeopleCount" value="' + value + '" /></div>';
                    }
                }, {
                    field: 'trafficInfo',
                    title: '교통',
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return '<input class="form-control" name="trafficInfo" value="' + value + '" />';
                    }
                },
                {
                    field: 'optionPrice',
                    title: '가격',
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return '<div class="controls"><input class="form-control" name="optionPrice" value="' + value + '" /></div>';
                    }
                },
                {
                    field: 'optionStatus',
                    title: '진행상태',
                    width: '15%',
                    align: 'center',
                    formatter: function(value,object){
                        var $select = $([
                            '<select class="form-control" name="optionStatus" data-container="body" data-live-search="true" data-value="' + object.optionNo + '">',
                            '<option value="10"> 예약접수</option>',
                            '<option value="20"> 예약가능</option>',
                            '<option value="30"> 예약마감</option>',
                            '<option value="40"> 취소</option>',
                            '</select>'
                        ].join(''));
                        $select.find('option[value="' + object.optionStatus + '"]').attr('selected', 'selected');
                        return $('<div/>').append($select).html();
                    }
                },
                {
                    field: 'action',
                    align: 'center',
                    width: '5%',
                    formatter: function(value,object, index){
                        if(index == 0) {
                            return '<a class="btn-add-product-option" href="javascript:void(0)">' +
                                '<i class="glyphicon glyphicon-plus-sign"></i>' +
                                '</a>';
                        } else {
                            return '<a class="btn-remove-product-option" href="javascript:void(0)" data-value="'+ index +'">' +
                                '<i class="fa fa-minus-circle"></i>' +
                                '</a>'
                        }
                    }
                }
            ],
            rowAttributes: function(row, index) {

            },
            onClickRow: function(row, element) {

            },
            onPostBody: function() {
                var $departDate = me.$tableProductOptionList.find('input[name="departDate"]');
                var $arriveDate = me.$tableProductOptionList.find('input[name="arriveDate"]');
                $departDate.datepicker({
                    language : 'ko',
                    format: 'yyyy-mm-dd',
                    autoclose: true
                });
                $arriveDate.datepicker({
                    language : 'ko',
                    format: 'yyyy-mm-dd',
                    autoclose: true
                });
            }
        });

    },

    initFormValidation: function(){
        var me = this;

        me.$formAddProduct.formValidation({
            framework: 'bootstrap',
            icon: {
                //valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'firstCategoryNo': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: siteAdminApp.getMessage('golf.package.product.select.first.category.message')
                        }
                    }
                },
                'productName': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: siteAdminApp.getMessage('golf.package.product.name.message')
                        }
                    }
                },
                /*
                'productDesc': {
                    row: '.controls',
                    validators: {
                        stringLength: {
                            max: 30,
                            message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 30})
                        }
                    }
                },
                */
                'productPrice': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: siteAdminApp.getMessage('golf.package.product.price.message')
                        },
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'departDate': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                        }
                    }
                },
                'arriveDate': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                        }
                    }
                },
                'departMinutes': {
                    row: '.controls',
                    validators: {
                        stringLength: {
                            max: 2,
                            min: 2,
                            message: mugrunApp.getMessage('common.validation.field.allow.length', {value: 2})
                        },
                        between: {
                            min: 0,
                            max: 59,
                            message: mugrunApp.getMessage('common.validation.field.number.between', {min: 0, max : 59})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'arriveMinutes': {
                    row: '.controls',
                    validators: {
                        stringLength: {
                            max: 2,
                            min: 2,
                            message: mugrunApp.getMessage('common.validation.field.allow.length', {value: 2})
                        },
                        between: {
                            min: 0,
                            max: 59,
                            message: mugrunApp.getMessage('common.validation.field.number.between', {min: 0, max : 59})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'targetPeopleCount': {
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
                },
                'minPeopleCount': {
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
                },
                'optionPrice': {
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

    checkInputSearchProduct : function(){
        var me = this;
        me.checkInputSearch(me.$container, '#text-search-product', '.search-clear');
    },

    checkInputSearch : function(container, inputTextSearch, iconClear){

        if(container.find(inputTextSearch).val() != ""){
            container.find(iconClear).removeClass('hide');
        } else {
            if(!container.find(iconClear).hasClass('hide')) {
                container.find(iconClear).addClass('hide');
            }
        }
    },

    loadFirstCategoryList: function() {
        var me = this;
        var packageNo = golfPackageController.$currGolfPackageDetail.packageNo;

        $.ajax({
            url: '/admin/golfpackage/category/first/list.json',
            type: 'GET',
            dataType: 'json',
            data: {
                packageNo: packageNo
            },
            success: function(data) {
                if (data.success) {
                    var categories = data.data;
                    me.selectFirstCategory.empty().append(
                        $.tmpl(me.tmplSelectFirstCategory.html(), {categories: categories})
                    );

                    me.selectFirstCategoryModal.empty().append(
                        $.tmpl(me.tmplSelectFirstCategoryModal.html(), {categories: categories})
                    );
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

    loadSecondCategoryList: function(packageNo, parentCategoryNo, callback, param) {
        var me = this;

        $.ajax({
            url: '/admin/golfpackage/category/second/list.json',
            type: 'GET',
            dataType: 'json',
            data: {
                packageNo: packageNo,
                parentCategoryNo: parentCategoryNo
            },
            success: function(data) {
                if (data.success) {
                    var categories = data.data;
                    if(callback && typeof callback === "function"){
                        callback(categories, param);
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
    },

    loadProductList: function() {
        var me = this;

        var packageNo = golfPackageController.$currGolfPackageDetail.packageNo;

        var firstCategoryNo = me.selectFirstCategory.val();
        if(firstCategoryNo == ''){
            firstCategoryNo = 0;
        }

        var secondCategoryNo = me.selectSecondCategory.val();
        if(secondCategoryNo == ''){
            secondCategoryNo = 0;
        }

        var productStatus = me.selectStatusProduct.val();
        if(productStatus == ''){
            productStatus = 0;
        }

        var textSearch = me.$container.find('input[name=textSearch]').val();
        var fieldSearch = me.$container.find('select[name=fieldSearch]').val();

        var url = '/admin/golfpackage/product/list.json?packageNo=' + packageNo
            + '&firstCategoryNo=' + firstCategoryNo + '&secondCategoryNo=' + secondCategoryNo
            + '&productStatus=' + productStatus + '&textSearch=' + textSearch
            + '&fieldSearch=' + fieldSearch;
        me.$tableProductList.bootstrapTable('refresh', {url: url});

    },

    deleteGolfProduct : function(productNos){
        var me = productManagementController;

        $.ajax({
            url: '/admin/golfpackage/product/delete.json',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                productNos: productNos.join(',')
            },
            success: function(data) {
                if (data.success) {
                    var message = mugrunApp.getMessage('common.alert.dialog.message.deleted');
                    mugrunApp.showCommonAlertDialog(message);
                    // load again
                    me.loadProductList();
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

    closeCreateProductModal : function(){
        var me = productManagementController;

        me.$modalAddProduct.modal('hide');
        me.$formAddProduct[0].reset();
        if(me.$formAddProduct.data('formValidation')) {
            me.$formAddProduct.data('formValidation').destroy();
        }

        me.$tableProductOptionList.find('tbody tr').remove();

        var specialPriceYn = me.$formAddProduct.find('input[name=specialPriceYn]');
        me.unCheck(specialPriceYn);

        var noticeYn = me.$formAddProduct.find('input[name=noticeYn]');
        me.unCheck(noticeYn);

        var basicAgreementYn = me.$formAddProduct.find('input[name=basicAgreementYn]');
        me.unCheck(basicAgreementYn);

        me.$formAddProduct.find('input[name=productNoModal]').val(0);
        me.$formAddProduct.find('input[name=useYnModal]').val(1);
        me.$formAddProduct.find('input[name=regUserNoModal]').val(0);
        me.$formAddProduct.find('input[name=regDateModal]').val('');
        me.$formAddProduct.find('input[name=modUserNoModal]').val(0);
        me.$formAddProduct.find('input[name=modDateModal]').val('');
        me.$formAddProduct.find('input[name=packageNo]').val(0);

        me.$formAddProduct.find('.clear-fileinput').click();

        me.$formAddProduct.find('input[name=imageFiles]').val('0,0,0,0');
    },

    generateTimes: function() {
        var options = '<option value="">시간</option>';
        for(var i=0; i<25; i++) {
            options += '<option value="'+i.pad(2)+'">'+i.pad(2)+'</option>';
        }
        return options;
    },

    secondCategoryProductList: function(categories){
        var me = productManagementController;
        me.selectSecondCategory.empty().append(
            $.tmpl(me.tmplSelectSecondCategory.html(), {categories : categories})
        );
    },

    secondCategoryCreateProduct: function(categories, secondCategoryNo){
        var me = productManagementController;
        me.selectSecondCategoryModal.empty().append(
            $.tmpl(me.tmplSelectSecondCategoryModal.html(), {categories : categories})
        );
        if(secondCategoryNo) {
            me.selectSecondCategoryModal.val(secondCategoryNo);
        }
    },

    insertRowTableProductOption: function($row){
        var me = this;
        var $departDate = $row.find('input[name="departDate"]');
        var $arriveDate = $row.find('input[name="arriveDate"]');
        $departDate.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });
        $arriveDate.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });

        var startDate = $row.find('input[name="departDate"]').val();
        if(startDate && startDate != '') {
            $row.find('input[name="arriveDate"]').datepicker('setStartDate', startDate);
        }

        $departDate.on('changeDate', function(e) {
            // Revalidate the date field
            me.$formAddProduct.formValidation('revalidateField', 'departDate');

            $row.find('input[name="arriveDate"]').datepicker('setStartDate', e.date);
        });

        $arriveDate.on('changeDate', function(e) {
            // Revalidate the date field
            me.$formAddProduct.formValidation('revalidateField', 'arriveDate');

        });

        var timeOptions = me.generateTimes();
        if($row.find('select[name="departTime"]').val() == null
                || $row.find('select[name="departTime"]').val() == '') {
            $row.find('select[name="departTime"]').html(timeOptions);
        }
        if($row.find('select[name="arriveTime"]').val() == null
                || $row.find('select[name="arriveTime"]').val() == '') {
            $row.find('select[name="arriveTime"]').html(timeOptions);
        }

        if($row.find('select[name="departTime"]').val() != ''){
            $row.find('input[name="departMinutes"]')[0].removeAttribute('disabled');
        }
        $row.find('select[name="departTime"]').on('change', function(e){
            e.preventDefault();
            var data = $(this).val();
            if(data != ''){
                $row.find('input[name="departMinutes"]')[0].removeAttribute('disabled');
            } else {
                $row.find('input[name="departMinutes"]')[0].setAttribute('disabled', 'disabled');
                $row.find('input[name="departMinutes"]').val('');
            }
        });

        if($row.find('select[name="arriveTime"]').val() != ''){
            $row.find('input[name="arriveMinutes"]')[0].removeAttribute('disabled');
        }
        $row.find('select[name="arriveTime"]').on('change', function(e){
            e.preventDefault();
            var data = $(this).val();
            if(data != ''){
                $row.find('input[name="arriveMinutes"]')[0].removeAttribute('disabled');
            } else {
                $row.find('input[name="arriveMinutes"]')[0].setAttribute('disabled', 'disabled');
                $row.find('input[name="arriveMinutes"]').val('');
            }
        });

        me.$tableProductOptionList.append($row);
        // Add new field
        var $optionPrice   = $row.find('input[name="optionPrice"]');
        var $departDate    = $row.find('input[name="departDate"]');
        var $arriveDate    = $row.find('input[name="arriveDate"]');
        var $targetPeopleCount = $row.find('input[name="targetPeopleCount"]');
        var $minPeopleCount    = $row.find('input[name="minPeopleCount"]');
        var $departMinutes = $row.find('input[name="departMinutes"]');
        var $arriveMinutes    = $row.find('input[name="arriveMinutes"]');
        me.$formAddProduct.formValidation('addField', $optionPrice);
        me.$formAddProduct.formValidation('addField', $departDate);
        me.$formAddProduct.formValidation('addField', $arriveDate);
        me.$formAddProduct.formValidation('addField', $targetPeopleCount);
        me.$formAddProduct.formValidation('addField', $minPeopleCount);
        me.$formAddProduct.formValidation('addField', $departMinutes);
        me.$formAddProduct.formValidation('addField', $arriveMinutes);
    },

    buildDataProductModal: function(data){
        var me = this;
        me.$formAddProduct.find('input[name=packageNo]').val(data.packageNo);
        me.$formAddProduct.find('input[name=productNoModal]').val(data.productNo);
        me.$formAddProduct.find('input[name=useYnModal]').val(data.useYn);

        me.$formAddProduct.find('input[name=regUserNoModal]').val(data.regUserNo);
        me.$formAddProduct.find('input[name=regDateModal]').val(data.regDateStr);
        me.$formAddProduct.find('input[name=modUserNoModal]').val(data.modUserNo);
        me.$formAddProduct.find('input[name=modDateModal]').val(data.modDateStr);

        if(data.imageFiles != null && data.imageFiles != '') {
            me.$formAddProduct.find('input[name=imageFiles]').val(data.imageFiles);
        }
        me.$formAddProduct.find('select[name=firstCategoryNo]').val(data.firstCategoryNo);


        if(data.secondCategoryNo != '' && data.secondCategoryNo > 0){
            me.loadSecondCategoryList(data.packageNo, data.firstCategoryNo, me.secondCategoryCreateProduct, data.secondCategoryNo);
        } else {
            me.loadSecondCategoryList(data.packageNo, data.firstCategoryNo, me.secondCategoryCreateProduct);
        }
        //me.$formAddProduct.find('select[name=secondCategoryNo]').val(data.secondCategoryNo);

        me.$formAddProduct.find('input[name=productName]').val(data.productName);
        me.$formAddProduct.find('textarea[name=productDesc]').val(data.productDesc);
        me.$formAddProduct.find('input[name=productPrice]').val(data.productPrice);


        var ele1 = me.$formAddProduct.find('input[name=specialPriceYn]');
        if(data.specialPriceYn == 1) {
            me.check(ele1);
        } else {
            me.unCheck(ele1);
        }

        var ele2 = me.$formAddProduct.find('input[name=noticeYn]');
        if(data.noticeYn == 1) {
            me.check(ele2);
        } else {
            me.unCheck(ele2);
        }

        var ele3 = me.$formAddProduct.find('input[name=basicAgreementYn]');
        if(data.basicAgreementYn == 1) {
            me.check(ele3);
        } else {
            me.unCheck(ele3);
        }

        me.$formAddProduct.find('select[name=productStatus]').val(data.productStatus);

        me.getSmartEditor('editor-product-content', data.productContent);
        me.getSmartEditor('editor-product-agreement', data.productAgreement);
    },

    buildImagesFileModal: function(data) {
        var me = this;
        for(var i = 0; i < data.length; i++){
            var image = data[i];
            if(image != null) {
                me.$formAddProduct.find('span.file-image-name-' + i).text(image.originalFileName);
            }
        }
    },

    getDataProductModal: function(){
        var me = this;
        var data = {};
        data.packageNo = me.$formAddProduct.find('input[name=packageNo]').val();
        data.productNo = me.$formAddProduct.find('input[name=productNoModal]').val();
        data.useYn     = me.$formAddProduct.find('input[name=useYnModal]').val();
        data.regUserNo = me.$formAddProduct.find('input[name=regUserNoModal]').val();
        data.regDateStr = me.$formAddProduct.find('input[name=regDateModal]').val();
        data.modUserNo = me.$formAddProduct.find('input[name=modUserNoModal]').val();
        data.modDateStr = me.$formAddProduct.find('input[name=modDateModal]').val();
        data.firstCategoryNo = me.$formAddProduct.find('select[name=firstCategoryNo]').val();
        data.secondCategoryNo = me.$formAddProduct.find('select[name=secondCategoryNo]').val();
        data.productName = me.$formAddProduct.find('input[name=productName]').val();
        data.productDesc = me.$formAddProduct.find('textarea[name=productDesc]').val();
        data.productPrice = me.$formAddProduct.find('input[name=productPrice]').val();

        var ele1 = me.$formAddProduct.find('input[name=specialPriceYn]');
        data.specialPriceYn = me.isCheck(ele1) ? 1 : 0;

        var ele2 = me.$formAddProduct.find('input[name=noticeYn]');
        data.noticeYn = me.isCheck(ele2) ? 1 : 0;

        var ele3 = me.$formAddProduct.find('input[name=basicAgreementYn]');
        data.basicAgreementYn = me.isCheck(ele3) ? 1 : 0;

        data.productStatus = me.$formAddProduct.find('select[name=productStatus]').val();
        data.productContent =  me.oEditors.getById['editor-product-content'].getIR();
        data.productAgreement = me.oEditors.getById['editor-product-agreement'].getIR();
        return data;
    },

    buildDataProductOption: function(options){
        var me = this;

        for(var i = 0; i < options.length; i++){
            var option = options[i];
            var $row = me.$modalAddProduct.find('#template-row-product-option').clone();
            if(i==0) {
                $row.find('.btn-add-product-option').removeClass('hide');
                $row.find('.btn-remove-product-option').addClass('hide');
            } else {
                $row.find('.btn-remove-product-option').removeClass('hide');
                $row.find('.btn-add-product-option').addClass('hide');
            }
            $row = me.buildDataRowOption($row, option);
            me.insertRowTableProductOption($row);
        }
    },

    getDataProductOption: function(){
        var me = this;

        var options = [];
        me.$tableProductOptionList.find('tbody tr').each(function () {
            var $row = $(this);
            if(!$row.hasClass('no-records-found')) {
                var option = {};
                option.optionNo = $row.find('input[name="optionNo"]').val();
                option.productNo = $row.find('input[name="productNoRow"]').val();
                option.regUserNo = $row.find('input[name="regUserNoRow"]').val();
                option.regDateStr   = $row.find('input[name="regDateRow"]').val();
                option.useYn    = $row.find('input[name="useYnRow"]').val();
                option.departDate = $row.find('input[name="departDate"]').val();
                var hourDepart = $row.find('select[name="departTime"]').val();
                var minuteDepart = $row.find('input[name="departMinutes"]').val();
                option.departTime = hourDepart + ':' + minuteDepart;
                if(hourDepart == '' && minuteDepart == ''){
                    option.departTime = '';
                } else if(hourDepart != '' && minuteDepart == ''){
                    option.departTime = hourDepart;
                }
                option.arriveDate = $row.find('input[name="arriveDate"]').val();
                var hourArrive = $row.find('select[name="arriveTime"]').val();
                var minuteArrive = $row.find('input[name="arriveMinutes"]').val();
                option.arriveTime = hourArrive + ':' + minuteArrive;
                if(hourArrive == '' && minuteArrive == ''){
                    option.arriveTime = '';
                } else if(hourArrive != '' && minuteArrive == ''){
                    option.arriveTime = hourArrive;
                }
                option.targetPeopleCount = $row.find('input[name="targetPeopleCount"]').val();
                option.minPeopleCount = $row.find('input[name="minPeopleCount"]').val();
                option.trafficInfo = $row.find('input[name="trafficInfo"]').val();
                option.optionPrice = $row.find('input[name="optionPrice"]').val();
                option.optionStatus = $row.find('select[name="optionStatus"]').val();

                options.push(option);
            }
        });

        // get delete list
        for(var i = 0; i < me.listOptionDeleted.length; i++){
            var item = me.listOptionDeleted[i];
            var data = {};
            data.optionNo = item;
            data.deleted = true;
            options.push(data);
        }

        return options;
    },

    buildDataRowOption: function($row, option){
        var me = this;

        var timeOptions = me.generateTimes();
        $row.find('select[name="departTime"]').html(timeOptions);
        $row.find('select[name="arriveTime"]').html(timeOptions);

        $row.find('input[name="optionNo"]').val(option.optionNo);
        $row.find('input[name="productNoRow"]').val(option.productNo);
        $row.find('input[name="useYnRow"]').val(option.useYn);
        $row.find('input[name="regUserNoRow"]').val(option.regUserNo);
        $row.find('input[name="regDateRow"]').val(option.regDateStr);
        $row.find('input[name="departDate"]').val(option.departDateStr);
        var hourDepart = '';
        var minuteDepart = '';
        if(option.departTime != null && option.departTime != '') {
            var arrDepartTimes = option.departTime.split(':');
            if(arrDepartTimes[0]) {
                hourDepart = arrDepartTimes[0];
            }
            if(arrDepartTimes[1]) {
                minuteDepart = arrDepartTimes[1];
            }
        }
        $row.find('select[name="departTime"]').val(hourDepart);
        $row.find('input[name="departMinutes"]').val(minuteDepart);


        $row.find('input[name="arriveDate"]').val(option.arriveDateStr);
        var hourArrive = '';
        var minuteArrive = '';
        if(option.arriveTime != null && option.arriveTime != '') {
            var arrArriveTimes = option.arriveTime.split(':');
            if(arrArriveTimes[0]) {
                hourArrive = arrArriveTimes[0];
            }
            if(arrArriveTimes[1]) {
                minuteArrive = arrArriveTimes[1];
            }
        }
        $row.find('select[name="arriveTime"]').val(hourArrive);
        $row.find('input[name="arriveMinutes"]').val(minuteArrive);

        $row.find('input[name="targetPeopleCount"]').val(option.targetPeopleCount);
        $row.find('input[name="minPeopleCount"]').val(option.minPeopleCount);
        $row.find('input[name="trafficInfo"]').val(option.trafficInfo);
        $row.find('input[name="optionPrice"]').val(option.optionPrice);
        $row.find('select[name="optionStatus"]').val(option.optionStatus);

        return $row;
    },

    insertFirstRowTableOption: function() {
        var me = this;
        var $row = me.$modalAddProduct.find('#template-row-product-option').clone();
        $row.find('.btn-add-product-option').removeClass('hide');
        $row.find('.btn-remove-product-option').addClass('hide');
        me.insertRowTableProductOption($row);
    },

    saveGolfPackageProduct : function(product){
        var me = this;

        $.ajax({
            url: '/admin/golfpackage/product/save.json',
            type: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(product),
            success: function(data) {
                if (data.success) {
                    me.$modalAddProduct.modal('hide');
                    me.closeCreateProductModal();
                    var title = mugrunApp.getMessage('common.alert.dialog.title');
                    var message = mugrunApp.getMessage('common.alert.dialog.message.saved');
                    var type = BootstrapDialog.TYPE_PRIMARY;
                    var buttonLabel = mugrunApp.getMessage('common.btn.ok');
                    var buttonClass = 'btn blue';
                    mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
                    // load again
                    me.loadProductList();
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

    uploadProductImageFile: function(files){
        var me = this;
        var oMyForm = new FormData();
        var posInsert = [];
        var oldImageFiles = me.$formAddProduct.find('input[name=imageFiles]').val();
        oMyForm.append('oldImageFiles', oldImageFiles);
        for(var i = 0; i < files.length; i++){
            var item = files[i];
            if(item){
                oMyForm.append('file' + i, item);
                posInsert.push(i);
            }
        }
        oMyForm.append('posInsert', posInsert);
        $.ajax({
            dataType : 'json',
            url : "/admin/golfpackage/product/image/upload.json",
            data : oMyForm,
            type : "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType:false,
            success : function(result) {
                if (result.success) {
                    var fileNos = result.data;
                    var product = me.getDataProductModal();
                    product.golfPackageProductOption = me.getDataProductOption();
                    product.imageFiles = fileNos;
                    me.saveGolfPackageProduct(product);
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            }
        });
    },

    getSmartEditor: function(elementId, content) {
        var me = this;
        if(me.oEditors.length == 0 || $(me.oEditors.getById[elementId]).length == 0) {
            nhn.husky.EZCreator.createInIFrame({
                oAppRef: me.oEditors,
                elPlaceHolder: elementId,
                sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2",
                htParams : {
                    bUseToolbar: true,
                    fOnBeforeUnload: true
                },
                fOnAppLoad : function(){
                    me.oEditors.getById[elementId].setIR(content);
                }
            });
        }else{
            me.oEditors.getById[elementId].setIR(content);
        }

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
    },

    loadProductDetail: function(productNo) {
        var me = this;

        return $.ajax({
            url: '/admin/golfpackage/product/detail.json',
            dataType: 'json',
            data: {
                productNo: productNo
            },
            contentType: "application/json",
            success: function(response) {

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

var productManagementController = new ProductManagementController('#container-product-management');