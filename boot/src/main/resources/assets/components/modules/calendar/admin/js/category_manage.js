var CalendarCategoryMntController = function (selector) {
    this.init(selector);
};

$.extend(CalendarCategoryMntController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$categoryList                    = me.$container.find(".container-categoryMnt-categoryList");
        me.$categoryInfo                    = me.$container.find(".container-categoryMnt-categoryInfo");
        me.$tbListCategory                  = me.$categoryList.find("#table-categoryMnt-listCategory");
        me.$btnAddCategory                  = me.$categoryList.find("#btn-categoryMnt-addCategory");
        me.$formCategoryInfo                = me.$categoryInfo.find("#form-categoryMnt-modifyInfo");
        me.$btnSave                         = me.$categoryInfo.find(".btn-save");
        me.$btnCancel                       = me.$categoryInfo.find(".btn-cancel");
        me.$btnImageBrowse                  = me.$categoryInfo.find(".btn-image-browse");
        me.$colorpicker         = me.$container.find('#colorpicker');

        me.rowSelected = 0;

        me.initUi();
        me.initFormValidation();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;
        me.$colorpicker.colorpicker();

        me.$colorpicker.on('changeColor', function(ev){
            me.$colorpicker.val( ev.color.toHex());
            var style = me.$colorpicker.closest('div').find('.input-group-addon')[0].style;
            style.backgroundColor = ev.color.toHex();
        });
        me.initTable();
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
            url: '/admin/calendar/loadCategories.json',
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
                        return '<i class="glyphicon glyphicon-calendar"></i> <span>'+ object.categoryName + '</span>';
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
                    categoryName: row.categoryName,
                    categorycolor: row.categoryColor == null? '#ffffff' : row.categoryColor
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

    submitCategoryInfo: function() {
        var me = this;

        var data = new FormData(me.$formCategoryInfo[0]);
        data.append('fileName', me.$formCategoryInfo.find('span.fileinput-filename').text());
        var categoryNo = me.$formCategoryInfo.find('input[name="categoryNo"]').val();
        $.ajax({
            dataType : 'json',
            url : "/admin/calendar/submitCategoryInfo.json",
            data : data,
            type : "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType:false,
            success : function(result) {
                if (result.success) {
                    if(!categoryNo){
                        //add new
                        me.rowSelected = result.data.categoryNo;
                    }
                    me.$tbListCategory.bootstrapTable("refresh");
                    mugrunApp.alertMessage(siteAdminApp.getMessage('calendar.category.mnt.save.success'));
                } else if(result.status == '1'){
                    mugrunApp.alertMessage(siteAdminApp.getMessage('calendar.category.mnt.save.error.duplicate'));
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
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
        var color = $(row).attr('categorycolor');
        me.$formCategoryInfo.find('input[name="categoryName"]').val($(row).attr('categoryname'));
        me.$formCategoryInfo.find('input[name="categoryNo"]').val($(row).attr('categoryno'));
        me.$formCategoryInfo.find('input[name="categoryColor"]').val(color);

        me.$colorpicker.colorpicker('setValue', color);
        var style = me.$colorpicker.closest('div').find('.input-group-addon')[0].style;
        style.backgroundColor = color;

        /*
        var fileName = $(row).attr('filename');
        if(fileName && fileName != 'null') {
            me.$formCategoryInfo.find('span.fileinput-filename').text(fileName);
            var $fileinput = me.$formCategoryInfo.find('div.fileinput');
            if($fileinput.hasClass('fileinput-new')) {
                $fileinput.removeClass('fileinput-new');
            }
            $fileinput.addClass('fileinput-exists');
        }
        */
    },

    resetForm: function() {
        var me = this;

        me.$formCategoryInfo.find('span.file-name-clear').click();
        me.$formCategoryInfo.find('input[name="categoryName"]').val('');
        me.$formCategoryInfo.find('input[name="categoryNo"]').val('');
        if(me.$formCategoryInfo.data('formValidation')) {
            me.$formCategoryInfo.data('formValidation').destroy();
        }
        me.$colorpicker.colorpicker('setValue', "#ffffff");
        var style = me.$colorpicker.closest('div').find('.input-group-addon')[0].style;
        style.backgroundColor = "#ffffff";
        me.$formCategoryInfo.find('input[name="categoryColor"]').val('');
        me.initFormValidation();
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

    deleteCategory: function(categoryNo) {
        var me = calendarCategoryMntController;
        $.ajax({
            url: '/admin/calendar/deleteCategory.json',
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


