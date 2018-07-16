var ShopProductPostsController = function (selector) {
    this.init(selector);
};

$.extend(ShopProductPostsController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tbListContent               = me.$container.find('.table-list-content');
        me.$filterHeader                = me.$container.find('.table-list-header');
        me.$selectPostingType           = me.$filterHeader.find('select.select-productPosting-postingType');
        me.$selectQueryOptions          = me.$filterHeader.find('select.select-option-search');
        me.$inputText                   = me.$filterHeader.find('.text-search');
        me.$btnClear                    = me.$filterHeader.find('.search-clear');
        me.$btnSearch                   = me.$filterHeader.find('.btn-search');
        me.$btnDelete                   = me.$filterHeader.find('.btn-delete');

        me.$modalProductPostingEditor   = me.$container.find("#modal-productPosting-editor");
        me.$modalTitleEditor            = me.$modalProductPostingEditor.find("#title-modal-productPostingEditor");
        me.$formPostingEditor           = me.$modalProductPostingEditor.find("#form-productPosting");
        me.$btnSavePosting              = me.$modalProductPostingEditor.find('button.btn-dialog-save');
        me.$btnCloseDialog              = me.$modalProductPostingEditor.find('button.btn-dialog-cancel');
        me.$modalBtnDelete              = me.$modalProductPostingEditor.find('a.btn-delete');

        me.$tmplSelectPostingType       = me.$container.find('#tmpl-productPosting-postingType');
        me.$tmplPostingEditorForm       = me.$container.find('#tmpl-productPosting-formEditor');

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;

        me.loadPostingType();
        me.initGrid();
    },

    initFormValidation: function() {
        var me = this;

        me.$formPostingEditor.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'answerContent': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: '값을 입력해주세요.'
                        }
                    }
                }
            }
        });
    },

    initEventHandlers: function() {
        var me = this;

        me.$inputText.keydown(function(event) {
            setTimeout(function() {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13' && me.$inputText.val() != "") {
                    me.reloadGrid();
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
            me.reloadGrid();
        });

        me.$selectPostingType.on('change', function (e) {
            e.preventDefault();
            me.reloadGrid();
        });

        me.$btnDelete.click(function(e) {
            e.preventDefault();
            var listNo = [];
            me.$tbListContent.find('input[type="checkbox"]:checked').each(function(i, item){
                listNo.push($(item).closest('tr').data('uniqueid'));
            });

            if(listNo.length > 0) {
                mugrunApp.showWarningDeleteDialog(me.deleteMultiData, listNo.join(","), '삭제하시겠습니까?');
            }else{
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = '삭제할 게시물을 선택하시기 바랍니다.';
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
            }
        });

        me.$modalProductPostingEditor.on('hidden.bs.modal', function () {
            me.$formPostingEditor[0].reset();
            if(me.$formPostingEditor.data('formValidation')) {
                me.$formPostingEditor.data('formValidation').destroy();
            }
        });

        me.$tbListContent.on("click", 'a.btn-edit', function(e) {
            e.preventDefault();
            me.$formPostingEditor.empty();

            var type = $(this).data('postingtype');
            if(type == 1) {
                if(!me.$btnSavePosting.hasClass('hide')){
                    me.$btnSavePosting.addClass('hide');
                }
            }else{
                if(me.$btnSavePosting.hasClass('hide')){
                    me.$btnSavePosting.removeClass('hide');
                }
            }
            me.$modalProductPostingEditor.modal({backdrop: 'static', show: true});
            me.openPostingEditor($(this).data('no'));
        });

        me.$btnSavePosting.on("click", function(e) {
            e.preventDefault();
            var formValidation = me.$formPostingEditor.data('formValidation');
            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else{
                me.submitAnswerPosting();
            }
        });

        me.$modalBtnDelete.on("click", function(e) {
            e.preventDefault();
            var postingNo = me.$formPostingEditor.find('input[name="postingNo"]').val();
            mugrunApp.showWarningDeleteDialog(me.deletePosting, postingNo, '삭제하시겠습니까?');
        });
    },

    initGrid: function() {
        var me = this;

        me.$tbListContent.bootstrapTable({
            url: '/admin/shop/posting/loadProductPosting.json',
            cache: false,
            smartDisplay: false,
            showHeader : true,
            pagination : true,
            paginationHAlign: 'center',
            pageSize: 15,
            uniqueId: "postingNo",
            queryParamsType: '',
            sidePagination: 'server',
            totalRows: 100,
            queryParams: function(params) {
                params['postingType'] = me.$selectPostingType.val();
                params['query'] = $.trim(me.$inputText.val());
                params['field'] = me.$selectQueryOptions.val();
                return params;
            },
            columns: [
                {
                    checkbox: true,
                    title: 'No',
                    width: '5%',
                    align: 'center'
                },
                {
                    field: 'postingTypeName',
                    title: '구분',
                    align: 'left',
                    width: '5%'
                },
                {
                    field: 'categoryName',
                    title: '분류',
                    align: 'left',
                    width: '15%',
                    formatter: function(value,object){
                        return object.categoryName;
                    }
                }, {
                    field: 'productName',
                    title: '상품명',
                    align: 'left',
                    width: '25%',
                    formatter: function(value,object){
                        return object.productName;
                    }
                }, {
                    field: 'title',
                    title: '제목',
                    align: 'left',
                    width: '25%',
                    formatter: function(value,object){
                        if(object.postingType == 2){
                            var status = '답변대기';
                            if(object.answerContent != null && object.answerContent != ''){
                                status = '답변완료';
                            }
                            if(object.addFile != null){
                                return object.title  + ' <span class="font-color-blue">(' + status+ ')</span> ' + '<span><i class="fa fa-file-image-o"></i></span>';
                            } else {
                                return object.title + ' <span class="font-color-blue">(' + status+ ')</span> ';
                            }
                        } else {
                            if(object.addFile != null){
                                return object.title + ' ' + '<span><i class="fa fa-file-image-o"></i></span>';
                            } else {
                                return object.title;
                            }
                        }
                    }
                }, {
                    field: 'writer',
                    title: '등록자',
                    align: 'left',
                    width: '10%',
                    formatter: function(value,object){
                        return object.writer;
                    }
                }, {
                    field: 'regDate',
                    title: '등록일',
                    align: 'center',
                    width: '10%',
                    formatter: function(value,object){
                        return mugrunApp.formatDate(object.regDate, 'YYYY-MM-DD');
                    }
                }, {
                    field: 'edit',
                    title: '보기',
                    width: '5%',
                    align: 'center',
                    formatter: function(value,object){
                        return '<a class="btn-edit" data-no="'+object.postingNo+'" data-postingType="'+object.postingType+'"><i class="inline glyphicon glyphicon-pencil"></i></a>';
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

    loadPostingType: function() {
        var me = this;
        return $.ajax({
            url: '/admin/common/getCodeByCodeGroup.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                codeGroup: 'ShopPostingType'
            },
            success: function(response) {
                me.$selectPostingType.empty().append('<option value="">전체</option>').append(
                    $.tmpl(me.$tmplSelectPostingType.html(), response.data)
                );
            }
        });
    },

    reloadGrid: function() {
        var me = this;
        me.$tbListContent.bootstrapTable("refresh");
    },

    deleteMultiData: function(listNo) {
        var me = shopProductPostsController;

        $.ajax({
            url: '/admin/shop/posting/deleteMultiPosting.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                listNo: listNo
            },
            success: function(response) {
                if (response.success) {
                    me.reloadGrid();
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
    },

    openPostingEditor: function(postingNo) {
        var me = this;

        return $.ajax({
            url: '/admin/shop/posting/getProductPosting.json',
            dataType: 'json',
            data: {
                postingNo: postingNo
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    var data = response.data;
                    data['regDateStr'] = mugrunApp.formatDate(data.regDate, 'YYYY/MM/DD H:mm:s');
                    me.$formPostingEditor.append(
                        $.tmpl(me.$tmplPostingEditorForm.html(), data)
                    );
                    me.$modalTitleEditor.text(data.postingTypeName);

                    if(data.postingType == 2){
                        me.initFormValidation();
                    }
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

    submitAnswerPosting: function() {
        var me = this;

        var data = {};
        data['postingNo']           = me.$formPostingEditor.find('input[name="postingNo"]').val();
        data['answerContent']       = me.$formPostingEditor.find('textarea[name="answerContent"]').val();
        return $.ajax({
            url: '/admin/shop/posting/submitAnswerPosting.json',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    me.$modalProductPostingEditor.modal('hide');
                    mugrunApp.alertMessage('저장되었습니다.');
                    me.reloadGrid();
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

    deletePosting: function(postingNo) {
        var me = shopProductPostsController;
        $.ajax({
            url: '/admin/shop/posting/deletePosting.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                postingNo: postingNo
            },
            success: function(response) {
                if (response.success) {
                    me.$modalProductPostingEditor.modal('hide');
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.alert.dialog.message.deleted'));
                    me.reloadGrid();
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

