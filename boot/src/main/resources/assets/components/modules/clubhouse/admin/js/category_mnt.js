var ClubhouseCategoryMntController = function (selector) {
    this.init(selector);
};

$.extend(ClubhouseCategoryMntController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$categoryList                    = me.$container.find(".container-categoryMnt-list");
        me.$categoryInfo                    = me.$container.find(".container-categoryMnt-info");
        me.$tbListCategory                  = me.$categoryList.find("#table-categoryMnt-listCategory");
        me.$btnAddCategory                  = me.$categoryList.find("#btn-categoryMnt-addCategory");
        me.$formCategoryInfo                = me.$categoryInfo.find("#form-categoryMnt-modifyInfo");
        me.$btnSave                         = me.$categoryInfo.find(".btn-save");
        me.$btnCancel                       = me.$categoryInfo.find(".btn-cancel");

        me.rowSelected = 0;

        me.initUi();
        me.initFormValidation();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;
        me.initTable();
    },

    loadData: function() {
        var me = this;
        me.$tbListCategory.bootstrapTable("refresh");
    },

    initEventHandlers: function() {
        var me = this;

        me.$btnAddCategory.on('click', function(e){
            e.preventDefault();
            me.addNewCategory();
        });

        me.$btnSave.on('click', function(e){
            e.preventDefault();
            var formValidation = me.$formCategoryInfo.data('formValidation');

            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else {
                me.submitCategoryInfo();
            }
        });

        me.$btnCancel.on('click', function(e){
            e.preventDefault();
            var selectedRow = me.$tbListCategory.find('tbody > tr.row-selected')[0];
            me.showDetail(selectedRow);
        });

        me.$tbListCategory.find('tbody').on('click', '.btn-category-delete', function (e) {
            e.preventDefault();
            mugrunApp.showWarningDeleteDialog(me.deleteCategory, $(this).data('categoryno'), '카테고리 삭제 시 등록된 모든 일정이 삭제됩니다. 삭제하시겠습니까?');
        });
    },

    initTable: function() {
        var me = this;

        me.$tbListCategory.bootstrapTable({
            url: '/admin/clubhouse/loadCategories.json',
            cache: false,
            smartDisplay: false,
            height: 450,
            showHeader : false,
            pagination : false,
            uniqueId: "categoryNo",
            columns: [
                {
                    field: 'categoryName',
                    title: '',
                    width: '100%',
                    formatter: function(value,object){
                        return '<i class="glyphicon glyphicon-calendar"></i> <span>'+ object.categoryName + ' (' + object.categoryNo + ')</span>';
                    }
                }, {
                    field: 'categoryNo',
                    title: 'delete',
                    width: '5px',
                    align: 'right',
                    formatter: function(value,object){
                        return '<div class="pull-right"><i class="glyphicon glyphicon-folder-close btn-category-delete hide" data-categoryno="'+object.categoryNo+'"></i></div>';
                    }
                }
            ],
            rowAttributes: function(row, index) {
                return {
                    categoryNo: row.categoryNo,
                    categoryName: row.categoryName
                };
            },
            onClickRow: function(row, element) {
                me.callClickRow(row.categoryNo);
            },
            onPostBody: function() {
                if(me.rowSelected) {
                    me.callClickRow(me.rowSelected);
                }else{
                    me.callClickRow();
                }
            }
        });
    },

    callClickRow: function(rowId) {
        var me = this, row;
        me.rowSelected = rowId;
        if(rowId) {
            me.$tbListCategory.find('tbody > tr').each(function(i, item){
                if($(item).data('uniqueid') == rowId) {
                    row = item;
                    return;
                }
            });
        }else{
            //default
            row = me.$tbListCategory.find('tbody > tr').first();
            me.rowSelected = $(row).data('uniqueid');
        }

        if($(row).length > 0 && $(row).data('uniqueid')) {
            var $oldRow = me.$tbListCategory.find('tbody > tr.row-selected');
            $oldRow.removeClass('row-selected');
            $oldRow.find('.btn-category-delete').addClass('hide');

            $(row).find('.btn-category-delete').removeClass('hide');
            $(row).addClass('row-selected');
            me.showDetail(row);
        }
    },

    showDetail: function(row) {
        var me = this;
        me.resetForm();
        me.$formCategoryInfo.find('input[name="categoryName"]').val($(row).attr('categoryname'));
        me.$formCategoryInfo.find('input[name="categoryNo"]').val($(row).attr('categoryno'));
    },

    resetForm: function() {
        var me = this;
        me.$formCategoryInfo.find('input[name="categoryName"]').val('');
        me.$formCategoryInfo.find('input[name="categoryNo"]').val('');
        if(me.$formCategoryInfo.data('formValidation')) {
            me.$formCategoryInfo.data('formValidation').destroy();
        }
        me.initFormValidation();
    },

    initFormValidation: function() {
        var me = this;

        me.$formCategoryInfo.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'categoryName': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: '카테고리명을 입력하여 주세요.'
                        },
                        stringLength: {
                            max: 256,
                            message: siteAdminApp.getMessage('common.validation.field.maxlength', {maxLength: 256})
                        }
                    }
                }
            }
        });
    },

    addNewCategory: function() {
        var me = this;
        me.rowSelected = 0;
        var $selectedRow = me.$tbListCategory.find('tbody > tr.row-selected');
        if($selectedRow.length > 0) {
            $selectedRow.removeClass('row-selected');
            $selectedRow.find('.btn-category-delete').addClass('hide');
        }
        me.resetForm();
    },

    submitCategoryInfo: function() {
        var me = this;

        var data = {};
        me.$formCategoryInfo.serializeArray().map(function(item) {
            if ( data[item.name] ) {
                if ( typeof(data[item.name]) === "string" ) {
                    data[item.name] = [data[item.name]];
                }
                data[item.name].push(item.value);
            } else {
                data[item.name] = item.value;
            }
        });
        var categoryNo = me.$formCategoryInfo.find('input[name="categoryNo"]').val();
        $.ajax({
            url: '/admin/clubhouse/submitCategoryInfo.json',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    if(!categoryNo){
                        me.rowSelected = response.data.categoryNo;
                    }
                    me.$tbListCategory.bootstrapTable("refresh");
                    mugrunApp.alertMessage(siteAdminApp.getMessage('calendar.category.mnt.save.success'));
                } else if(response.status == '1'){
                    mugrunApp.alertMessage(siteAdminApp.getMessage('calendar.category.mnt.save.error.duplicate'));
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$btnSave.prop('disabled', true);
            },
            complete: function () {
                me.$btnSave.prop('disabled', false);
            }
        });
    },

    deleteCategory: function(categoryNo) {
        var me = clubhouseCategoryMntController;
        $.ajax({
            url: '/admin/clubhouse/deleteCategory.json',
            dataType: 'json',
            data: {
                categoryNo: categoryNo
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    me.addNewCategory();
                    me.$tbListCategory.bootstrapTable("refresh");
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
    }

});


