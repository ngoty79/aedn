var PackageSettingsController = function (selector) {
    this.init(selector);
};

$.extend(PackageSettingsController.prototype, {
    $container: null,
    oEditors: [],


    init: function (selector) {
        var me = this;
        me.$container = $(selector);
        me.tableFirstCategory          = me.$container.find('#table-first-category-list');
        me.tableSecondCategory         = me.$container.find('#table-second-category-list');
        me.$containerFirstCategoryList = me.$container.find('.container-first-category-list');
        me.$containerSecondCategoryList = me.$container.find('.container-second-category-list');

        me.rowSelected = undefined;

        me.initSmartEditor();
        me.initBootstrapTable();
        me.initEventHandlers();
    },

    initEventHandlers: function() {
        var me = this;

        me.initEventTableCategory(me.tableFirstCategory, 'first');
        me.initEventTableCategory(me.tableSecondCategory, 'second');

        me.$containerFirstCategoryList.on('change', 'input[name=AddFirstCategory]', function(e){
            e.preventDefault();
            me.$containerFirstCategoryList.find('.input-box-category-name .error-msg.duplicate').addClass('hide');
        });

        me.$containerSecondCategoryList.on('change', 'input[name=AddSecondCategory]', function(e){
            e.preventDefault();
            me.$containerSecondCategoryList.find('.input-box-category-name .error-msg.duplicate').addClass('hide');
        });

        me.$container.on('click', '#btn-add-first-category', function(e){
            e.preventDefault();
            var categoryName = me.$containerFirstCategoryList.find('input[name="AddFirstCategory"]').val();
            if(categoryName != '') {
                var data = {};
                data.packageNo = golfPackageController.$currGolfPackageDetail.packageNo;
                data.categoryName = categoryName;
                data.categoryType = 'first';
                me.checkCategoryName(data);
            }
        });

        me.$container.on('click', '#btn-add-second-category', function(e){
            e.preventDefault();
            if(me.rowSelected == undefined){
                var message = siteAdminApp.getMessage('golf.package.no.select.first.category.message');
                mugrunApp.showCommonAlertDialog(message);
            } else {
                var categoryName = me.$containerSecondCategoryList.find('input[name="AddSecondCategory"]').val();
                if(categoryName != '') {
                    var data = {};
                    data.packageNo = golfPackageController.$currGolfPackageDetail.packageNo;
                    data.categoryName = categoryName;
                    data.parentCategoryNo = me.rowSelected;
                    data.categoryType = 'second';
                    me.checkCategoryName(data);
                }
            }
        });

        me.$container.on('click', '#cancel-package-settings', function(e){
            e.preventDefault();
            me.resetPackageSettingsInfo(golfPackageController.$currGolfPackageDetail);
        });

        me.$container.on('click', '#save-package-settings', function(e){
            e.preventDefault();
            var data = golfPackageController.$currGolfPackageDetail;
            data.packageAgreement = me.oEditors.getById['packageAgreement'].getIR();
            var categoryShowYn = me.$container.find('input[name=categoryShowYn]');
            data.categoryShowYn = me.isCheck(categoryShowYn) ? 1 : 0;
            golfPackageController.saveGolfPackage(data, false);
        });
    },

    initEventTableCategory: function(tableCategory, categoryType) {
        var me = this;

        tableCategory.on('dblclick','.row-category-name', function(e){
            e.preventDefault();
            $(this).find('.txt-category-name').addClass('hide');
            $(this).parent().find('input[name="categoryName"]').removeClass('hide');
        });

        tableCategory.on('blur','input[name="categoryName"]', function() {
            var newCategoryName = this.value;
            if(newCategoryName != '') {
                var oldCategoryName = $(this).parent().find('.txt-category-name').text();
                if(oldCategoryName != newCategoryName) {
                    var categoryNo = $(this).data('categoryno');
                    var data = tableCategory.bootstrapTable('getRowByUniqueId', categoryNo);
                    data.categoryName = newCategoryName;
                    data.categoryType = categoryType;

                    var ele = $(this);
                    me.checkCategoryName(data, ele);
                } else {
                    $(this).addClass('hide');
                    $(this).parent().find('.txt-category-name').removeClass('hide');
                    $(this).closest('td').find('.error-msg.duplicate').addClass('hide');
                    $(this).parent().removeClass('has-error');
                }
            } else {
                $(this).parent().addClass('has-error');
            }
        });

        tableCategory.on('click','.btn-category-delete', function() {
            var categoryNo = $(this).data('categoryno');
            var arr = [categoryNo];
            var packageNo = golfPackageController.$currGolfPackageDetail.packageNo;
            me.deleteGolfPackageCategory(arr, categoryType, packageNo);
        });
    },

    initSmartEditor: function() {
        var me = this;

        nhn.husky.EZCreator.createInIFrame({
            oAppRef: me.oEditors,
            elPlaceHolder: 'packageAgreement',
            sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
            fCreator: "createSEditor2",
            htParams: {
                bUseToolbar: true,
                fOnBeforeUnload: true
            },
            fOnAppLoad : function(){
                if(golfPackageController.$currGolfPackageDetail != null) {
                    if (golfPackageController.$currGolfPackageDetail.packageAgreement == null) {
                        me.oEditors.getById['packageAgreement'].setIR('');
                    } else {
                        me.oEditors.getById['packageAgreement'].setIR(golfPackageController.$currGolfPackageDetail.packageAgreement);
                    }
                }
            }
        });
    },

    initBootstrapTable : function() {
        var me = this;

        var columns = [
            {
                field: 'categoryNo'
            },
            {
                field: 'categoryName',
                cellStyle: function(value, row, index) {
                    return {
                        classes: 'row-category-name'
                    }
                },
                formatter: function(value,row){
                    return '<span class="control-label txt-category-name">' + value +'</span>' +
                        '<input type="text" name="categoryName" class="form-control hide" data-categoryNo="' + row.categoryNo +'" value="' + value +'">' +
                        '<span class="error-msg duplicate hide">이미 사용중인 카테고리명이 있습니다.</span>';
                }
            },
            {
                formatter: function(value,row){
                    return '<a class="btn-category-delete" href="javascript:void(0)" data-categoryNo="' + row.categoryNo +'">' +
                        '<i class="control-label glyphicon glyphicon-remove pull-right" ></i> ' +
                        '</a>';
                }
            }
        ];

        me.tableFirstCategory.bootstrapTable({
            showHeader: false,
            uniqueId: 'categoryNo',
            height: 200,
            columns: columns,
            onClickRow: function(row, element) {
                me.callClickRow(row.categoryNo);
            },
            onPostBody: function() {
                me.callClickRow();
            }
        });

        me.tableSecondCategory.bootstrapTable({
            showHeader: false,
            uniqueId: 'categoryNo',
            height: 200,
            columns: columns
        });

        var category1 = {categoryNo: 1000, categoryName: 'test1'};
        var category2 = {categoryNo: 1001, categoryName: 'test2'};
        var category3 = {categoryNo: 1002, categoryName: 'test3'};
        var category4 = {categoryNo: 1003, categoryName: 'test4'};
        me.mockupDataFirstCategory  = [category1, category2, category3, category4];
        me.mockupDataSecondCategory = [category1, category2, category3, category4];
        /*me.tableFirstCategory.bootstrapTable('load', me.mockupDataFirstCategory);
        me.tableSecondCategory.bootstrapTable('load', me.mockupDataSecondCategory);*/
    },

    callClickRow: function(rowId) {
        var me = this, row;
        me.rowSelected = rowId;
        if(rowId) {
            me.tableFirstCategory.find('tbody > tr').each(function(i, item){
                if($(item).data('uniqueid') == rowId) {
                    row = item;
                    return;
                }
            });
        }else{
            //default
            row = me.tableFirstCategory.find('tbody > tr').first();
            me.rowSelected = $(row).data('uniqueid');
        }

        if($(row).length > 0 && $(row).data('uniqueid')) {
            var $oldRow = me.tableFirstCategory.find('tbody > tr.row-selected');
            $oldRow.removeClass('row-selected');

            $(row).addClass('row-selected');

            var packageNo = golfPackageController.$currGolfPackageDetail.packageNo;
            me.loadSecondCategoryList(packageNo, me.rowSelected);
        }
    },

    loadPackageSettingsInfo: function(golfPackage){
        var me = this;
        var ele = me.$container.find('input[name=categoryShowYn]');
        if(golfPackage.categoryShowYn == 1) {
            me.check(ele);
        } else {
            me.unCheck(ele);
        }

        if(me.oEditors.length > 0 && me.oEditors.getById["packageAgreement"] != undefined
            && typeof me.oEditors.getById["packageAgreement"].setIR == 'function') {
            if (golfPackage.packageAgreement == null) {
                me.oEditors.getById['packageAgreement'].setIR('');
            } else {
                me.oEditors.getById['packageAgreement'].setIR(golfPackage.packageAgreement);
            }
        }

        me.tableFirstCategory.bootstrapTable('load', golfPackage.golfPackageFirstCategory);
        me.tableSecondCategory.bootstrapTable('load', []);
    },

    loadSecondCategoryList: function(packageNo, parentCategoryNo) {
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
                    me.tableSecondCategory.bootstrapTable('load', categories);
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

    resetPackageSettingsInfo: function(golfPackage){
        var me = this;
        var ele = me.$container.find('input[name=categoryShowYn]');
        if(golfPackage.categoryShowYn == 1) {
            me.check(ele);
        } else {
            me.unCheck(ele);
        }

        if (golfPackage.packageAgreement == null) {
            me.oEditors.getById['packageAgreement'].setIR('');
        } else {
            me.oEditors.getById['packageAgreement'].setIR(golfPackage.packageAgreement);
        }
    },

    saveGolfPackageCategory : function(golfPackageCategory){
        var me = this;

        $.ajax({
            url: '/admin/golfpackage/category/save.json',
            type: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(golfPackageCategory),
            success: function(data) {
                if (data.success) {
                    var categoryList = data.data;
                    if(golfPackageCategory.categoryType == 'first') {
                        me.tableFirstCategory.bootstrapTable('load', categoryList);
                        productManagementController.loadFirstCategoryList();
                        reservationManagementController.loadFirstCategoryList();
                    } else if(golfPackageCategory.categoryType == 'second') {
                        //me.tableSecondCategory.bootstrapTable('load', categoryList);
                        if(me.rowSelected) {
                            var packageNo = golfPackageController.$currGolfPackageDetail.packageNo;
                            me.loadSecondCategoryList(packageNo, me.rowSelected);
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
    },

    checkCategoryName : function(golfPackageCategory, placeMessage){
        var me = this;

        var data = {
            categoryName: golfPackageCategory.categoryName,
            packageNo: golfPackageCategory.packageNo,
            categoryType: golfPackageCategory.categoryType
        };

        if(golfPackageCategory.parentCategoryNo){
            data.parentCategoryNo = golfPackageCategory.parentCategoryNo;
        }

        $.ajax({
            url: '/admin/golfpackage/category/checkCategoryName.json',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: data,
            success: function(data) {
                if (data.success) {
                    if(placeMessage) {
                        var closestTd = $(placeMessage).closest('td');
                        if ((golfPackageCategory.categoryType == 'first' || golfPackageCategory.categoryType == 'second')&& data.valid == false) {
                            $(placeMessage).parent().addClass('has-error');
                            closestTd.find('.error-msg.duplicate').removeClass('hide');
                        } else if ((golfPackageCategory.categoryType == 'first' || golfPackageCategory.categoryType == 'second') && data.valid == true) {
                            me.saveGolfPackageCategory(golfPackageCategory);
                            closestTd.find('.error-msg.duplicate').addClass('hide');
                            $(placeMessage).addClass('hide');
                            $(placeMessage).parent().find('.txt-category-name').removeClass('hide');
                            $(placeMessage).parent().find('.txt-category-name').text(this.value);
                            $(this).parent().removeClass('has-error');
                        }
                    } else {
                        if (golfPackageCategory.categoryType == 'first' && data.valid == false) {
                            me.$containerFirstCategoryList.find('.input-box-category-name .error-msg.duplicate').removeClass('hide');
                        } else if (golfPackageCategory.categoryType == 'first' && data.valid == true) {
                            me.saveGolfPackageCategory(golfPackageCategory);
                            me.$containerFirstCategoryList.find('input[name="AddFirstCategory"]').val('');
                            me.$containerFirstCategoryList.find('.input-box-category-name .error-msg.duplicate').addClass('hide');
                        } else if (golfPackageCategory.categoryType == 'second' && data.valid == false) {
                            me.$containerSecondCategoryList.find('.input-box-category-name .error-msg.duplicate').removeClass('hide');
                        } else if (golfPackageCategory.categoryType == 'second' && data.valid == true) {
                            me.saveGolfPackageCategory(golfPackageCategory);
                            me.$containerSecondCategoryList.find('input[name="AddSecondCategory"]').val('');
                            me.$containerSecondCategoryList.find('.input-box-category-name .error-msg.duplicate').addClass('hide');
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
    },

    deleteGolfPackageCategory : function(categoryNos, categoryType, packageNo){
        var me = this;

        var data = {
            categoryNos: categoryNos.join(','),
            categoryType: categoryType,
            packageNo: packageNo
        };

        if(categoryType == 'second'){
            data.parentCategoryNo = me.rowSelected;
        }

        $.ajax({
            url: '/admin/golfpackage/category/delete.json',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: data,
            success: function(data) {
                if (data.success) {
                    var categoryList = data.data;
                    if(categoryType == 'first') {
                        me.tableFirstCategory.bootstrapTable('load', categoryList);
                    } else if(categoryType == 'second') {
                        me.tableSecondCategory.bootstrapTable('load', categoryList);
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

var packageSettingsController = new PackageSettingsController('#container-package-settings');
