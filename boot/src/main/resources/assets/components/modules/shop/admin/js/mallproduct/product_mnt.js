var ShopProductController = function (selector) {
    this.init(selector);
};

$.extend(ShopProductController.prototype, {
    $container: null,
    shopMallNo: $('input#hdn-shopmall-mallNo').val(),

    init: function (selector) {
        var me = this;

        //controls
        me.$container = $(selector);

        //Product grid
        me.$filterHeader                = me.$container.find('.table-list-header');
        me.$inputText                   = me.$filterHeader.find('.text-search');
        me.$btnClear                    = me.$filterHeader.find('.search-clear');
        me.$btnSearch                   = me.$filterHeader.find('.btn-search');
        me.$btnDelete                   = me.$filterHeader.find('.btn-delete');
        me.$btnAdd                      = me.$filterHeader.find('.btn-add');
        me.$btnOpenUploadDialog         = me.$filterHeader.find('.btn-upload');
        me.$tbListContent               = me.$container.find('.table-list-content');

        //modals
        me.$modalUploadProduct          = me.$container.find('#modal-productmnt-uploadproduct');
        me.$formUploadProduct           = me.$modalUploadProduct.find('#form-productmnt-uploadproduct');
        me.$btnUploadProduct            = me.$modalUploadProduct.find('.btn-dialog-upload');
        me.$linkDownloadProductSample   = me.$modalUploadProduct.find("#link-productsample-excel");

        me.initUi();
        me.initEventHandlers();
    },

    refreshMallNo: function(mallNo) {
        var me = this;
        me.shopMallNo = mallNo;
    },

    initUi: function () {
        var me = this;
        me.$tbListContent.bootstrapTable({
            url: '/admin/shop/product/loadProducts.json',
            cache: false,
            smartDisplay: false,
            showHeader : true,
            pagination : true,
            paginationHAlign: 'center',
            pageSize: 15,
            uniqueId: "productNo",
            queryParamsType: '',
            sidePagination: 'server',
            totalRows: 100,
            queryParams: function(params) {
                params['mallNo'] = me.shopMallNo;
                params['categoryNos'] = categoryTreeController.getSelectedAndAllChildCategoryNo();
                params['searchText'] = $.trim(me.$inputText.val());
                return params;
            },
            columns: [
                {
                    checkbox: true,
                    title: 'No',
                    width: '5%',
                    align: 'center'
                }, {
                    field: 'categoryName',
                    title: '분류',
                    align: 'left',
                    width: '25%',
                    formatter: function(value,object){
                        return object.categoryName;
                    }
                }, {
                    field: 'productName',
                    title: '상품명',
                    align: 'left',
                    width: '30%',
                    formatter: function(value,object){
                        if(object.saleStatus == 1){
                            return object.productName + '<span><img src="/assets/components/modules/shop/basic/images/common/icon_soldout_backend.gif"></span>';
                        } else {
                            return object.productName;
                        }
                    }
                }, {
                    field: 'salePrice',
                    title: '가격',
                    align: 'right',
                    width: '15%',
                    formatter: function(value,object){
                        return accounting.formatNumber(object.salePrice, 0, ",", ".");
                    }
                }, {
                    field: 'regDate',
                    title: '등록일',
                    align: 'center',
                    width: '20%',
                    formatter: function(value,object){
                        return mugrunApp.formatDate(object.regDate, 'YYYY-MM-DD');
                    }
                }, {
                    field: 'edit',
                    title: '관리',
                    width: '5%',
                    align: 'center',
                    formatter: function(value,object){
                        return '<a class="btn-edit" data-no="'+object.productNo+'"><i class="inline glyphicon glyphicon-pencil"></i></a>';
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

    initEventHandlers: function () {
        var me = this;

        me.$inputText.keydown(function(event) {
            setTimeout(function() {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13' && me.$inputText.val() != "") {
                    me.loadListEvent();
                }else{
                    if(me.$inputText.val() != ""){
                        me.$btnClear.removeClass('hide');
                    } else if(!me.$btnClear.hasClass('hide')) {
                        me.$btnClear.addClass('hide');
                    }
                }
            },1);
        });

        me.$btnClear.on('click', function (e) {
            e.preventDefault();
            me.$inputText.val("");
            me.$btnClear.addClass('hide');
        });

        me.$btnSearch.on('click', function (e) {
            e.preventDefault();
            me.$tbListContent.bootstrapTable("refresh");
        });

        me.$btnAdd.click(function(e) {
            e.preventDefault();
            shopProductEditorController.addNewProduct();
        });

        me.$btnDelete.click(function(e) {
            e.preventDefault();
            var listNo = [];
            me.$tbListContent.find('input[type="checkbox"]:checked').each(function(i, item){
                listNo.push($(item).closest('tr').data('uniqueid'));
            });

            if(listNo.length > 0) {
                mugrunApp.showWarningDeleteDialog(me.deleteMultiData, listNo, '상품을 삭제하시겠습니까?');
            }else{
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = '선택한 행사가 없습니다.';
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
            }
        });

        me.$tbListContent.on("click", 'a.btn-edit', function(e) {
            e.preventDefault();
            shopProductEditorController.modifyProduct($(this).data('no'));
        });

        me.$btnOpenUploadDialog.on("click", function(e) {
            e.preventDefault();
            if(me.$modalUploadProduct.data('formValidation')) {
                me.$modalUploadProduct.data('formValidation').destroy();
            }
            me.$formUploadProduct.find('input[type="file"]').val('');
            me.$formUploadProduct.find('span.fileinput-filename').text('');
            me.initUploadProductFormValidation();
            me.$modalUploadProduct.modal({backdrop: 'static', show: true});
        });

        me.$btnUploadProduct.on("click", function(e) {
            e.preventDefault();
            var formValidation = me.$modalUploadProduct.data('formValidation');
            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            }else{

                var fileName = me.$formUploadProduct.find('input[type="file"]').val();
                var length = fileName.length;
                if(length > 3) {
                    var ext = fileName.substring(length - 4, length);
                    if('.xls' == ext) {
                        me.uploadProduct();
                    }else{
                        mugrunApp.alertMessage('파일 형식이 xls 이어야 합니다.');
                    }
                }else{
                    mugrunApp.alertMessage('파일 형식이 xls 이어야 합니다.');
                }
            }
        });

        me.$linkDownloadProductSample.on("click", function(e) {
            e.preventDefault();
            var url = '/assets/components/modules/shop/sample/product-sample.xls';
            window.open(url, '_blank');
        });
    },

    reloadProductList: function() {
        var me = this;
        me.$tbListContent.bootstrapTable("refresh");
    },

    deleteMultiData: function(listNo) {
        var me = shopProductController;

        $.ajax({
            url: '/admin/shop/product/deleteProducts.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                listNo: JSON.stringify(listNo)
            },
            success: function(response) {
                if (response.success) {
                    me.reloadProductList();
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.alert.dialog.message.deleted'));
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

    initUploadProductFormValidation: function() {
        var me = this;

        me.$modalUploadProduct.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'file': {
                    row: '.controls',
                    excluded: false,
                    validators: {
                        notEmpty: {
                            message: '업로드 파일을 선택하세요.'
                        }
                    }
                }
            }
        });
    },

    uploadProduct: function(file) {
        var me = this;
        var data = new FormData(me.$formUploadProduct[0]);
        data.append("mallNo", me.shopMallNo);
        $.ajax({
            dataType : 'json',
            url : "/admin/shop/product/uploadProductDataExcel.json",
            data : data,
            type : "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType:false,
            success : function(response) {
                if (response.success) {
                    mugrunApp.alertMessage('저장되었습니다.');
                    me.reloadProductList();
                } else if('1' == response.status) {
                    mugrunApp.alertMessage('상품 카테고리명이 존재하지 않습니다. ('+response.data+')');
                } else{
                    mugrunApp.alertMessage('상품 업로드시 서버 에러가 발생했습니다.');
                }
            },
            beforeSend: function() {
                me.$modalUploadProduct.find('.modal-content').mask('Uploading Data...');
            },
            complete: function () {
                me.$modalUploadProduct.find('.modal-content').unmask();
            }
        });
    },

});
