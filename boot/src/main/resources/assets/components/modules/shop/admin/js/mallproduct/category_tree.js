
var CategoryTreeController = function (selector) {
    this.init(selector);
};

$.extend(CategoryTreeController.prototype, {
    $container: null,
    data: [],
    shopMallNo: $('input#hdn-shopmall-mallNo').val(),

    init: function (selector) {
        var me = this;

        me.$container = $(selector);

        me.$treeContainer       = me.$container.find('#container-categoryTree-contain');
        me.$btnAdd              = me.$container.find('button.btn-add');
        me.$btnRemove           = me.$container.find('button.btn-remove');
        me.$modalAddCategory    = me.$container.find('#modal-shopCategoryTree');
        me.$formAddCategory     = me.$modalAddCategory.find('#form-shopCategoryTree');
        me.$btnSaveCategory     = me.$modalAddCategory.find('button.btn-dialog-save');
        me.$inputText           = me.$formAddCategory.find('input[name=categoryName]');
        me.levelSelected        = 1;

        me.initUi();
        me.initEventHandlers();

    },

    refreshMallNo: function(mallNo) {
        var me = this;
        me.shopMallNo = mallNo;
    },

    initUi: function () {
        var me = this;
        var isReloadListProduct = true;
        me.$treeContainer.jstree({
            'plugins': ["wholerow", "types", "dnd"],
            'core': {
                'themes' : {
                    "responsive": false,
                    'dots': false
                },
                'multiple': false,
                //'check_callback' : true,
                'check_callback' : function(operation, node, node_parent, node_position, more) {
                    if (operation == 'move_node') {
                        if(node_parent.parents.length <= 3){
                            return true;
                        }
                        return false;
                    }
                },
                'expand_selected_onload': true,
                'data': me.data
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                }
            }
        }).on('changed.jstree', function (e, data) {
            if(data.selected.length > 0) {
                if(isReloadListProduct) {
                    shopProductController.reloadProductList();
                }
                isReloadListProduct = true;
                me.levelSelected=data.node.parents.length;
            }else{
                isReloadListProduct = false;
                data.instance.select_node(['0']);
            }
        }).bind( "move_node.jstree", function( e, data ) {
            var inst = me.$treeContainer.jstree(true),
                node = inst.get_node(data.node.id),
                parent = inst.get_node(data.parent);
            var newPos = $.inArray(node.id, parent.children);
            console.log(newPos);
            var updateOrderId = [];
            for(var i = newPos + 1; i < parent.children.length; i++){
                updateOrderId.push(parent.children[i]);
            }
            me.moveCategory(data.node.id, data.parent, updateOrderId.join(','));
        }).bind("dblclick.jstree", function (event) {
            var node = $(event.target).closest("li");
            if(node[0]) {
                var categoryNo = node[0].id;
                if(categoryNo && categoryNo != null && categoryNo > 0){
                    me.editCategory(categoryNo);
                }
            }
        });
    },

    initEventHandlers: function () {
        var me = this;
        if(shopMallController.getMallNo() > 0) {
            me.load(me.shopMallNo);
        }

        me.$btnAdd.click(function(e) {
            e.preventDefault();
            me.$formAddCategory[0].reset();
            if(me.$formAddCategory.data('formValidation')) {
                me.$formAddCategory.data('formValidation').destroy();
            }
            me.initFormValidation();

            me.$modalAddCategory.find('.modal-title').text('카테고리 추가');
            me.$formAddCategory.find('input[name=categoryNo]').val(0);
            mugrunApp.setCheckboxVal(me.$formAddCategory.find('input[name=useYn]'), true);

            me.$modalAddCategory.modal({backdrop: 'static', show: true});
        });

        me.$inputText.keydown(function(event) {
            setTimeout(function() {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13' && me.$inputText.val() != "") {
                    me.submitCategory();
                }
            },1);
        });

        me.$btnSaveCategory.click(function(e) {
            e.preventDefault();
            var formValidation = me.$formAddCategory.data('formValidation');
            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else{
                me.submitCategory();
            }
        });

        me.$btnRemove.click(function(e) {
            e.preventDefault();
            var $selected = me.$treeContainer.jstree('get_selected');
            if($selected.length > 0) {
                var ids = [];
                ids.push($selected[0]);
                me.getChildIds($selected, ids);

                mugrunApp.showWarningDeleteDialog(me.deleteCategory, ids.join(","), '등록된 상품은 카테고리가 초기화 됩니다. 삭제하시겠습니까?');
            }else{
                mugrunApp.alertMessage('상품 분류를 선택하시기 바랍니다.');
            }
        });

        me.$modalAddCategory.unbind('hidden.bs.modal').on('hidden.bs.modal', function() {
            me.load(me.shopMallNo);
            me.$treeContainer.jstree(true).deselect_all();
        });
    },

    getChildIds: function($selected, ids) {
        var me = this;
        if(!ids) {
            ids = [];
        }
        var treeData =  me.$treeContainer.jstree(true).get_json($selected, {flat:false});
        $.each(treeData.children, function( index, node ) {
            ids.push(node.id);
            if(node.children.length > 0) {
                me.getChildIds(node, ids);
            }
        });
    },

    initFormValidation: function() {
        var me = this;

        me.$formAddCategory.formValidation({
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
                            message: '값을 입력해주세요.'
                        }
                    }
                }
            }
        });
    },

    load: function(shopMallNo) {
        var me = this;

        $.ajax({
            url: '/admin/shop/category/loadCategoryTree.json',
            method: 'GET',
            dataType: 'json',
            data: {
                mallNo: shopMallNo
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    me.$treeContainer.jstree(true).settings.core.data = response.data;
                    me.$treeContainer.jstree(true).refresh();
                    shopProductController.reloadProductList();
                } else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function () {

            },
            complete: function () {

            }
        });
    },

    submitCategory: function() {
        var me = this;
        var categoryNo = me.$formAddCategory.find('input[name=categoryNo]').val();

        if(me.levelSelected > 3 && categoryNo == 0){
            mugrunApp.alertMessage(siteAdminApp.getMessage('shop.product.add.category.depth.bigger.3'));
            me.$modalAddCategory.modal('hide');
        } else {
            var data = {};
            data['categoryNo'] = categoryNo;
            data["categoryName"] = $.trim(me.$formAddCategory.find('input[name="categoryName"]').val());
            data["mallNo"] = me.shopMallNo;
            if (mugrunApp.getCheckboxVal(me.$formAddCategory.find('input[name="useYn"]'))) {
                data['useYn'] = 1;
            } else {
                data['useYn'] = 0;
            }
            var parentNo = 0;
            if (me.$treeContainer.jstree('get_selected').length > 0) {
                parentNo = me.$treeContainer.jstree('get_selected')[0];
            }
            data["parentCategoryNo"] = parentNo;
            //data["category_depth"] = ?;
            //data["sort_no"] = ?;
            $.ajax({
                url: '/admin/shop/category/addCategory.json',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    if (response.success) {
                        me.$modalAddCategory.modal('hide');
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function () {
                    me.$btnSaveCategory.prop('disabled', true);
                },
                complete: function () {
                    me.$btnSaveCategory.prop('disabled', false);
                }
            });
        }
    },

    moveCategory: function(categoryNo, targetId, updateOrderId) {
        var me = this;
        $.ajax({
            url: '/admin/shop/category/moveCategory.json',
            dataType: 'json',
            data: {
                categoryNo: categoryNo,
                parentCategoryNo: targetId,
                updateOrderId: updateOrderId
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    me.$treeContainer.jstree('open_node', targetId);
                }else{
                    me.$treeContainer.jstree(true).refresh();
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

    deleteCategory: function(ids) {
        var me = categoryTreeController;
        $.ajax({
            url: '/admin/shop/category/deleteCategory.json',
            dataType: 'json',
            data: {
                categoryNos: ids
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    me.load(me.shopMallNo);
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

    getSelectedCategoryNo: function() {
        var me = this;
        var categoryNo = 0;
        if(me.$treeContainer.jstree('get_selected').length > 0) {
            categoryNo = me.$treeContainer.jstree('get_selected')[0];
        }
        return categoryNo;
    },

    getSelectedAndAllChildCategoryNo: function() {
        var me = this;
        var categoryNos = [];
        if(me.$treeContainer.jstree('get_selected').length > 0 && me.$treeContainer.jstree('get_selected')[0] != '0') {
            // all child
            categoryNos = me.$treeContainer.jstree(true).get_selected(true)[0].children_d;
            // node selected
            categoryNos.push(me.$treeContainer.jstree(true).get_selected(true)[0].id);
        }
        var uniqueArray = categoryNos.filter(function(item, pos) {
            return categoryNos.indexOf(item) == pos;
        });
        return uniqueArray.join(',');
    },

    getData: function() {
        var me = this;
        return me.$treeContainer.jstree(true).settings.core.data;
    },

    editCategory: function(categoryNo) {
        var me = this;

        $.ajax({
            url: '/admin/shop/category/getCategory.json',
            method: 'GET',
            dataType: 'json',
            data: {
                categoryNo: categoryNo
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    me.$formAddCategory[0].reset();
                    if(me.$formAddCategory.data('formValidation')) {
                        me.$formAddCategory.data('formValidation').destroy();
                    }
                    me.initFormValidation();

                    var category = response.data;
                    me.$modalAddCategory.find('.modal-title').text('카테고리 수정');
                    mugrunApp.setCheckboxVal(me.$formAddCategory.find('input[name=useYn]'), category.useYn);
                    me.$formAddCategory.find('input[name=categoryName]').val(category.categoryName);
                    me.$formAddCategory.find('input[name=categoryNo]').val(category.categoryNo);

                    me.$modalAddCategory.modal({backdrop: 'static', show: true});
                } else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function () {

            },
            complete: function () {

            }
        });
    }
});
