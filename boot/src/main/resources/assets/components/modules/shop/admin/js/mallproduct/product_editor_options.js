var ShopProductOptionsController = function (selector) {
    this.init(selector);
};

$.extend(ShopProductOptionsController.prototype, {
    $container: null,
    currentField: {},

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$btnDelete                   = me.$container.find('a.btn-delete');
        me.$btnAdd                      = me.$container.find('a.btn-add');
        me.$btnCheckAll                 = me.$container.find('input.chb-checkAll');
        me.$tbListContent               = me.$container.find('#tbl-productEditorOptions-list tbody');
        me.$tmpRow                      = me.$container.find('#tmpl-productEditor-option-row');

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function () {
        var me = this;

    },

    initEventHandlers: function () {
        var me = this;

        me.$btnCheckAll.on('click', function (e) {
            var $checkboxUnchecked = me.$tbListContent.find('input[type="checkbox"]:not(:checked)');
            if($checkboxUnchecked.length > 0) {
                $checkboxUnchecked.each(function(i, item){
                    $(item).click();
                });
            }else{
                me.$tbListContent.find('input[type="checkbox"]').each(function(i, item){
                    $(item).click();
                });
            }
        });

        me.$tbListContent.on('click', 'td.cell-productOption-editor',function (e) {
            e.preventDefault();
            if($(me.currentField).length > 0) {
                if(me.currentField.id != this.id) {
                    $(me.currentField).find('input').addClass('hide');
                    $(me.currentField).find('span').removeClass('hide');

                    $(this).find('span').addClass('hide');
                    $(this).find('input').removeClass('hide').focus().select();
                    me.currentField = this;
                }
            }else{
                $(this).find('span').addClass('hide');
                $(this).find('input').removeClass('hide');
                me.currentField = this;
            }
        });

        me.$tbListContent.on('blur', 'input',function (e) {
            e.preventDefault();
            var val = 0;
            if('optionPrice' == $(this).attr('name')) {
                if($.trim(this.value) != '') {
                    val = accounting.formatNumber(this.value, 0, ",", ".");
                }
                if(isNaN(this.value) || (!isNaN(this.value) && this.value < 0)){
                    val = this.value;
                }
            }else{
                val = this.value;
            }
            $(this).parent().find('span').text(val);

            var optionType = 0;
            if(shopProductEditorController.$modalForm.find('input[name="optionType"]:checked').val()){
                optionType = shopProductEditorController.$modalForm.find('input[name="optionType"]:checked').val();
            }
            if('optionPrice' == $(this).attr('name') && optionType == 2 && (isNaN(this.value) || (!isNaN(this.value) && this.value < 0))){
                $(this).parent().find('.msg-option-price').removeClass('hide');
            } else if('optionPrice' == $(this).attr('name') && optionType == 3 && (isNaN(this.value) || (!isNaN(this.value) && this.value <= 0))){
                $(this).parent().find('.msg-option-price').removeClass('hide');
            } else if('optionPrice' == $(this).attr('name')){
                $(this).parent().find('.msg-option-price').addClass('hide');
            }
        });

        me.$btnAdd.on('click', function (e) {
            e.preventDefault();
            var optionType = 0;
            if(shopProductEditorController.$modalForm.find('input[name="optionType"]:checked').val()){
                optionType = shopProductEditorController.$modalForm.find('input[name="optionType"]:checked').val();
            }
            me.addRow(undefined, optionType);
            if(me.$tbListContent.find('tr:last') && me.$tbListContent.find('tr:last').find('td:nth-child(2)')) {
                me.$tbListContent.find('tr:last').find('td:nth-child(2)').click();
            }
        });

        me.$btnDelete.on('click', function (e) {
            e.preventDefault();
            var listNo = [];
            me.$tbListContent.find('input[type="checkbox"]:checked').each(function(i, item){
                listNo.push($(item).closest('tr').data('uniqueid'));
            });

            if(listNo.length > 0) {
                mugrunApp.showWarningDeleteDialog(me.deleteMultiData, listNo, '선택한 항목을 정말 삭제하시겠습니까?');
            }else{
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = '상품 옵션을 선택하세요.';
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
            }

        });
    },

    emptyGrid: function() {
        var me = this;
        me.$tbListContent.empty();
    },

    addRow: function(data, optionType) {
        var me = this;
        var params = {};
        if(data) {
            params['optionNo'] = data.optionNo;
            params['id'] = data.optionNo;
            params['optionName'] = data.optionName;
            params['useYn'] = data.useYn;
            if(optionType == 1){
                params['optionPriceFormatted'] = '';
                params['optionPrice'] = '';
            } else {
                params['optionPriceFormatted'] = accounting.formatNumber(data.optionPrice, 0, ",", ".");
                params['optionPrice'] = data.optionPrice;
            }
            params['optionType'] = optionType;
        }else{
            var d = new Date();
            params['optionNo'] = 0;
            params['id'] = d.getMilliseconds();
            params['optionName'] = '옵션명';
            if(optionType == 1){
                params['optionPriceFormatted'] = '';
                params['optionPrice'] = '';
            } else {
                params['optionPrice'] = 0;
                params['optionPriceFormatted'] = 0;
            }
            params['useYn'] = 1;
            params['optionType'] = optionType;
        }
        me.$tbListContent.append(
            $.tmpl(me.$tmpRow.html(), params)
        );
    },

    getData: function() {
        var me = this;
        var result = [];
        me.$tbListContent.find('tr').each(function() {
            var productOption = {};
            productOption['optionNo'] = $(this).data('no');
            productOption['optionName'] = $(this).find('input[name="optionName"]').val();
            productOption['useYn'] = $(this).find('select[name="optionUseYn"]').val();
            productOption['optionPrice'] = $(this).find('input[name="optionPrice"]').val();
            result.push(productOption);
        });
        return result;
    },

    setData: function(options, optionType) {
        var me = this;
        me.emptyGrid();
        if($(options).length > 0) {
            $.each(options, function(index, item) {
                me.addRow(item, optionType);
            });
        }
    },

    deleteMultiData: function() {
        var me = shopProductOptionsController;

        me.$tbListContent.find('input[type="checkbox"]:checked').each(function( index ) {
            $(this).closest('tr').remove();
        });
    }

});
