var ShopProductEditorController = function (selector) {
    this.init(selector);
};

$.extend(ShopProductEditorController.prototype, {
    $container: null,
    oEditors: [],
    data: [],
    shopMallNo: $('input#hdn-shopmall-mallNo').val(),

    init: function (selector) {
        var me = this;

        //controls
        me.$container = $(selector);
        me.$treeContainer               = me.$container.find('#tree-productEditor-category');

        //Product Editor
        me.$modalBtnSave                = me.$container.find('button.btn-dialog-save');
        me.$modalBtnCancel              = me.$container.find('button.btn-dialog-cancel');
        me.$modalForm                   = me.$container.find('#form-mallproduct-productEditor');
        me.$modalFileImage              = me.$modalForm.find('#imageFile');
        me.$modalMainImage              = me.$modalForm.find('img#img-productEdditor-mainImage');

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function () {
        var me = this;

    },

    refreshMallNo: function(mallNo) {
        var me = this;
        me.shopMallNo = mallNo;
    },

    initProductCategoryTree: function(data) {
        var me = this;

        me.$treeContainer.jstree({
            'plugins': ["wholerow", "types", "checkbox"],
            'core': {
                'themes' : {
                    "responsive": false,
                    'dots': false
                },
                'multiple': true,
                'data': data
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                }
            }
        });
    },

    initEventHandlers: function () {
        var me = this;

        me.$modalForm.on('click', 'input[name="saleStatus"]', function(e){
            var isCheck = mugrunApp.getCheckboxVal(me.$modalForm.find('input[name="saleStatus"]'));
            if(isCheck){
                me.$modalForm.find('input[name="soldoutShowYn"]').closest('.checker').removeClass('disabled');
                me.$modalForm.find('input[name="soldoutShowYn"]').removeAttr('disabled');
            } else {
                me.$modalForm.find('input[name="soldoutShowYn"]').closest('.checker').addClass('disabled');
                me.$modalForm.find('input[name="soldoutShowYn"]').attr('disabled', true);
                mugrunApp.setCheckboxVal(me.$modalForm.find('input[name="soldoutShowYn"]'), false);
            }
        });

        me.$modalBtnSave.click(function(e) {
            e.preventDefault();

            var validPrice = me.checkOptionPrice();

            var formValidation = me.$modalForm.data('formValidation');
            formValidation.validate();
            if (!formValidation.isValid() || !validPrice) {
                return;
            } else if(me.$treeContainer.jstree('get_selected').length == 0) {
                mugrunApp.alertMessage('상품 분류를 선택하시기 바랍니다.');
            } else{
                me.submitProductInfo(me.$treeContainer.jstree('get_selected'));
            }
            return;
        });

        me.$modalForm.on('keypress'
            , 'input[name="salePrice"], input[name="marketPrice"], input[name="deliveryFee"], input[name="minBuyCount"], input[name="maxBuyCount"], input[name="optionPrice"] '
            , function(e){
                mugrunApp.onlyNumber(e);
            });

        me.$modalFileImage.on('change', function(e){
            e.preventDefault();
            if(this.files[0]) {
                me.upload(this.files[0]);
            }
        });

        me.$modalForm.on('click', '.fileinput span.search-clear',function(e){
            me.$modalMainImage.attr('src', '');
            me.$modalMainImage.addClass('hide');
        });

        me.$modalForm.on('click', 'input[name="deliveryFeeType"]',function(e){
            e.preventDefault();
            if(1 == this.value) {
                me.$modalForm.find('input[name="deliveryFee"]').prop('disabled', true);
                me.$modalForm.find('input[name="deliveryCollectYn"]').prop('disabled', true);
            }else{
                me.$modalForm.find('input[name="deliveryFee"]').prop('disabled', false);
                me.$modalForm.find('input[name="deliveryCollectYn"]').prop('disabled', false);
            }
        });

        me.$modalForm.on('change', 'select[name="requiredOptionYn"]',function(e){
            e.preventDefault();

            me.$modalForm.find('input[name="optionType"]').closest('span').removeClass('checked');
            me.$modalForm.find('input[name="optionType"]').attr('checked', false);

            var optionTypes = me.$modalForm.find('input[name="optionType"]');
            for (var i=0; i < optionTypes.length; i++) {
                if(1 == this.value) {
                    optionTypes[i].disabled = false;
                } else {
                    optionTypes[i].disabled = true;
                }
            }

            if(1 == this.value){
                me.$modalForm.find('input[name="optionType"]')[0].click();
                shopProductOptionsController.$container.find('.btn-add').removeAttr('disabled');
            } else {
                shopProductOptionsController.$container.find('.btn-add').attr('disabled', true);
            }

        });

        me.$modalForm.on('change', 'input[name="optionType"]',function(e){
            e.preventDefault();

            shopProductOptionsController.$tbListContent.find('.msg-option-price').addClass('hide');

            if(this.value == 1){
                shopProductOptionsController.$tbListContent.find('input[name=optionPrice]').val('');
                shopProductOptionsController.$tbListContent.find('.lbl-option-price').text('');
                shopProductOptionsController.$tbListContent.find('input[name=optionPrice]').attr('disabled', true);
            } else if(this.value == 2){
                shopProductOptionsController.$tbListContent.find('input[name=optionPrice]').val('0');
                shopProductOptionsController.$tbListContent.find('.lbl-option-price').text('0');
                shopProductOptionsController.$tbListContent.find('input[name=optionPrice]').removeAttr('disabled');
            } else if(this.value == 3){
                shopProductOptionsController.$tbListContent.find('input[name=optionPrice]').val('0');
                shopProductOptionsController.$tbListContent.find('.lbl-option-price').text('0');
                shopProductOptionsController.$tbListContent.find('input[name=optionPrice]').removeAttr('disabled');
                var prices = shopProductOptionsController.$tbListContent.find('input[name=optionPrice]');
                for(var i = 0; i < prices.length; i++){
                    var price = $(prices[i]);
                    if(price.val() <= 0){
                        price.parent().find('.msg-option-price').removeClass('hide');
                    }
                }
            }

        });

    },

    addNewProduct: function() {
        var me = this;

        me.resetDataForm();
        me.$container.modal({backdrop: 'static', show: true});
        me.data = categoryTreeController.getData();
        me.initProductCategoryTree(me.data);
        //me.$treeContainer.jstree(true).settings.core.data = categoryTreeController.getData();
        //me.$treeContainer.jstree(true).refresh();
        me.getSmartEditor("txt-mallproduct-detailContent", '');

        // default deliverytype is 2
        me.$modalForm.find('input[name="deliveryFeeType"]')[1].click();
    },

    modifyProduct: function(productNo) {
        var me = this;
        me.resetDataForm();
        me.$container.modal({backdrop: 'static', show: true});
        me.loadProduct(productNo);
    },

    initEventFormValidation: function() {
        var me = this;

        me.$modalForm.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'productName': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: '상품명을 입력하세요.'
                        }
                    }
                },
                'minBuyCount': {
                    row: '.controls',
                    validators: {
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value:1})
                        }
                    }
                },
                'maxBuyCount': {
                    row: '.controls',
                    validators: {
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value:1})
                        }
                    }
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
                    bUseToolbar : true
                },
                fOnAppLoad : function(){
                    me.oEditors.getById[elementId].setIR(content);
                }
            });
        }else{
            me.oEditors.getById[elementId].setIR(content);
        }
    },

    submitProductInfo: function(categories) {
        var me = this;

        var data = {};
        data['mallNo']           = me.shopMallNo;
        data['options']          = shopProductOptionsController.getData();
        data['categoryNos']      = me.$treeContainer.jstree('get_selected');
        data['detailContent']    = me.oEditors.getById["txt-mallproduct-detailContent"].getIR();
        if($.trim(me.$modalForm.find('span.fileinput-filename').text()) == '') {
            me.$modalForm.find('input[name="mainImage"]').val('');//clear image
        }
        me.$modalForm.serializeArray().map(function(item) {
            if(item.name != 'optionName' && item.name != 'optionPrice' && item.name != 'optionUseYn'){
                var value = item.value;
                if(item.name == 'marketPriceYn' || item.name == 'deliveryCollectYn') {
                    value = 1;
                }
                if (data[item.name]) {
                    if (typeof(data[item.name]) === "string" ) {
                        data[item.name] = [data[item.name]];
                    }
                    data[item.name].push(value);
                } else {
                    data[item.name] = value;
                }
            }
        });

        var deliveryFeeType=1;
        me.$modalForm.find('input[name=deliveryFeeType]').each(function(){
            if($(this).parent().hasClass('checked')) {
                deliveryFeeType = this.value;
                return;
            }
        });
        data['deliveryFeeType'] = deliveryFeeType;
        if('1' == deliveryFeeType) {
            data['deliveryFee']           = '';
            data['deliveryCollectYn']     = 1;
        }else{
            data['deliveryFee']           = me.$modalForm.find('input[name="deliveryFee"]').val();
            if(me.$modalForm.find('input[name="deliveryCollectYn"]').is(':checked')) {
                data['deliveryCollectYn'] = 0;
            }else{
                data['deliveryCollectYn'] = 1;
            }
        }

        if(mugrunApp.getCheckboxVal(me.$modalForm.find('input[name="saleStatus"]'))){
            data['saleStatus'] = 1;
        } else {
            data['saleStatus'] = 0;
        }

        if(mugrunApp.getCheckboxVal(me.$modalForm.find('input[name="soldoutShowYn"]'))){
            data['soldoutShowYn'] = 1;
        } else {
            data['soldoutShowYn'] = 0;
        }

        if(me.$modalForm.find('input[name="optionType"]:checked').val()) {
            data['optionType'] = me.$modalForm.find('input[name="optionType"]:checked').val();
        }

        $.ajax({
            url: '/admin/shop/product/saveProduct.json',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(response) {
                if(response.success) {
                    mugrunApp.alertMessage('저장되었습니다.');
                    me.$container.modal('hide');
                    shopProductController.reloadProductList();
                }else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$modalBtnSave.prop('disabled', true);
            },
            complete: function () {
                me.$modalBtnSave.prop('disabled', false);
            }
        });
    },

    upload: function(file) {
        var me = this;
        var formData = new FormData();
        formData.append("file", file);
        $.ajax({
            dataType : 'json',
            url : "/admin/shop/product/uploadImage.json",
            data : formData,
            type : "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType:false,
            success : function(response) {
                if (response.success) {
                    var data = response.data;
                    me.$modalForm.find('input[name="mainImage"]').val(data.filePath);
                    me.$modalForm.find('span.fileinput-filename').text(data.fileName);
                    me.$modalForm.find('span.fileinput-filename').attr('title',data.fileName);
                    me.refreshImage(file, me.$modalMainImage);
                    if(me.$modalMainImage.hasClass('hide')) {
                        me.$modalMainImage.removeClass('hide');
                    }
                }
            }
        });
    },

    refreshImage: function(file, img) {
        var reader = new FileReader();
        reader.onload = function (event) {
            $(img).attr('src', event.target.result);
        };
        reader.readAsDataURL(file);
    },

    loadProduct: function(productNo) {
        var me = this;

        return $.ajax({
            url: '/admin/shop/product/loadProduct.json',
            dataType: 'json',
            data: {
                productNo: productNo
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    me.setDataForm(response.data);
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

    resetDataForm: function() {
        var me = this;
        //reset inputs text and others
        me.$modalForm[0].reset();
        //me.$treeContainer.jstree(true).settings.core.data = [];
        //me.$treeContainer.jstree(true).refresh();
        me.$treeContainer.jstree("destroy");
        //reset hidden fields
        me.$modalForm.find('input[name="productNo"]').val(0);
        me.$modalForm.find('input[name="mainImage"]').val('');
        //reset checkbox
        me.$modalForm.find('input[type="checkbox"]').each(function(){
            mugrunApp.setCheckboxVal(this, false);
        });
        // add disabled default for soldoutShowYn
        me.$modalForm.find('input[name="soldoutShowYn"]').closest('.checker').addClass('disabled');
        me.$modalForm.find('input[name="soldoutShowYn"]').attr('disabled', true);

        me.$modalForm.find('select[name="requiredOptionYn"]').val('0');
        var optionTypes = me.$modalForm.find('input[name="optionType"]');
        for (var i=0; i < optionTypes.length; i++) {
            optionTypes[i].disabled = true;
        }
        me.$modalForm.find('input[name="optionType"]').closest('span').removeClass('checked');

        //reset radio
        me.$modalForm.find('input[name="deliveryFeeType"]')[0].click();
        //clear product options
        shopProductOptionsController.emptyGrid();
        //clear editors
        //me.getSmartEditor("txt-mallproduct-detailContent", '');
        //clear images
        me.$modalForm.find('.fileinput span.search-clear')[0].click();

        //rebind validation
        if(me.$modalForm.data('formValidation')) {
            me.$modalForm.data('formValidation').destroy();
        }
        me.initEventFormValidation();
    },

    setDataForm: function(data) {
        var me = this;
        me.setListCheckedCategory(data.categories);

        me.$modalForm.find('input[name="productNo"]').val(data.product.productNo);
        me.$modalForm.find('input[name="mainImage"]').val(data.product.mainImage);
        me.$modalForm.find('input[name="productName"]').val(data.product.productName);
        me.$modalForm.find('input[name="makerName"]').val(data.product.makerName);
        me.$modalForm.find('input[name="originName"]').val(data.product.originName);
        me.$modalForm.find('input[name="salePrice"]').val(data.product.salePrice);
        me.$modalForm.find('input[name="marketPrice"]').val(data.product.marketPrice);
        me.$modalForm.find('input[name="deliveryFee"]').val(data.product.deliveryFee);
        me.$modalForm.find('input[name="minBuyCount"]').val(data.product.minBuyCount);
        me.$modalForm.find('input[name="maxBuyCount"]').val(data.product.maxBuyCount);
        me.getSmartEditor("txt-mallproduct-detailContent", data.product.detailContent);
        if (data.product.saleStatus == 1) {
            mugrunApp.setCheckboxVal(me.$modalForm.find('input[name="saleStatus"]'), true);
            me.$modalForm.find('input[name="soldoutShowYn"]').closest('.checker').removeClass('disabled');
            me.$modalForm.find('input[name="soldoutShowYn"]').removeAttr('disabled');
        } else {
            me.$modalForm.find('input[name="soldoutShowYn"]').closest('.checker').addClass('disabled');
            me.$modalForm.find('input[name="soldoutShowYn"]').attr('disabled', true);
        }
        if (data.product.soldoutShowYn == 1) {
            mugrunApp.setCheckboxVal(me.$modalForm.find('input[name="soldoutShowYn"]'), true);
        }

        me.$modalForm.find('select[name="requiredOptionYn"]').val(data.product.requiredOptionYn);
        var optionTypes = me.$modalForm.find('input[name="optionType"]');
        for (var i=0; i < optionTypes.length; i++) {
            if(data.product.requiredOptionYn == 1) {
                optionTypes[i].disabled = false;
            } else {
                optionTypes[i].disabled = true;
            }
        }
        if (data.product.optionType == 1) {
            me.$modalForm.find('input[name="optionType"]')[0].click();
        } else if (data.product.optionType == 2) {
            me.$modalForm.find('input[name="optionType"]')[1].click();
        } else if(data.product.optionType == 3){
            me.$modalForm.find('input[name="optionType"]')[2].click();
        }

        if(data.product.requiredOptionYn == 1){
            shopProductOptionsController.$container.find('.btn-add').removeAttr('disabled');
        } else {
            shopProductOptionsController.$container.find('.btn-add').attr('disabled', true);
        }

        if(data.product.marketPriceYn == 1) {
            mugrunApp.setCheckboxVal(me.$modalForm.find('input[name="marketPriceYn"]'), true);
        }
        if(data.product.deliveryCollectYn == 0) {
            mugrunApp.setCheckboxVal(me.$modalForm.find('input[name="deliveryCollectYn"]'), true);
        }else{
            mugrunApp.setCheckboxVal(me.$modalForm.find('input[name="deliveryCollectYn"]'), false);
        }

        if(data.product.deliveryFeeType == 1) {
            me.$modalForm.find('input[name="deliveryFeeType"]')[0].click();
        }else if(data.product.deliveryFeeType == 2) {
            me.$modalForm.find('input[name="deliveryFeeType"]')[1].click();
        }

        //me.$modalForm.find('input[name="mainImage"]').val(data.product.mainImage);
        if($.trim(data.product.mainImageSrc) != '') {
            me.$modalMainImage.attr('src', 'data:image/png;base64,'+data.product.mainImageSrc);
            if(me.$modalMainImage.hasClass('hide')) {
                me.$modalMainImage.removeClass('hide');
            }
            var imageFileName = me.getImageFileName(data.product.mainImage);
            me.$modalForm.find('span.fileinput-filename').text(imageFileName);
            me.$modalForm.find('span.fileinput-filename').attr('title',imageFileName);
        }

        // set options after option type
        me.setListProductOption(data.options, data.product.optionType);
    },

    setListCheckedCategory: function(categories) {
        var me = this;
        var ids = [];
        $.each(categories, function(index, item) {
            ids.push(item.categoryNo);
        });
        var categoryIds = ','+ids.join(",")+',';

        me.data = categoryTreeController.getData();
        var treeData = $.extend(true, {}, me.data);
        if(ids.length > 0) {
            me.setCheckedCategory(treeData, categoryIds);
        }

        me.initProductCategoryTree(treeData);
        //me.$treeContainer.jstree(true).settings.core.data = treeData;
        //me.$treeContainer.jstree(true).refresh();
    },

    setCheckedCategory: function(node, ids) {
        var me = this;
        if($(node.children).length > 0) {
            $.each(node.children, function(index, child) {
                me.setCheckedCategory(child, ids);
            });
        }

        if(ids.indexOf(','+node.id+',') !== -1) {
            node.state.checked = true;
            node.state.selected = true;
        }
    },

    getImageFileName: function(imagePath) {
        var result = imagePath.split("/");
        return result[result.length - 1]
    },

    setListProductOption: function(options, optionType) {
        shopProductOptionsController.setData(options, optionType);
    },

    checkOptionPrice: function(){
        var me =this;
        var valid = true;
        var optionType = me.$modalForm.find('input[name="optionType"]:checked').val();
        if(optionType && optionType == 3) {
            shopProductOptionsController.$tbListContent.find('input[name=optionPrice]').removeAttr('disabled');
            var prices = shopProductOptionsController.$tbListContent.find('input[name=optionPrice]');
            for (var i = 0; i < prices.length; i++) {
                var price = $(prices[i]);
                if (price.val() <= 0) {
                    price.parent().find('.msg-option-price').removeClass('hide');
                    valid = false;
                }
            }
        }
        return valid;
    }
});