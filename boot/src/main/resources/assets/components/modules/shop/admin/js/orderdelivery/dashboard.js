var DashboardController = function (selector) {
    this.init(selector);
};

$.extend(DashboardController.prototype, {
    $container: null,
    data: [],
    categoriesProcessingStatus: '',
    categoriesSalesStatus: '',

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$containerProcessingStatus   = me.$container.find('.container-processing-status');
        me.$containerSalesStatus        = me.$container.find('.container-sales-status');
        me.$treeContainerProcessing     = me.$containerProcessingStatus.find('.container-categoryTree-contain');
        me.$treeContainerSales          = me.$containerSalesStatus.find('.container-categoryTree-contain');

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function () {
        var me = this;
        me.$treeContainerProcessing.jstree({
            'plugins': ["wholerow", "types", "dnd"],
            'core': {
                'themes' : {
                    "responsive": false,
                    'dots': false
                },
                'multiple': false,
                'check_callback' : true,
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
            if(data.selected.length > 0 && data.node) {
                me.$containerProcessingStatus.find('input[name=categoryName]').val(data.node.text);
                var child = data.node.children_d;
                var categories = child.concat([data.node.id]);
                me.categoriesProcessingStatus = categories.join(',');
                me.loadProcessStatus(categories.join(','));
            }else{
                data.instance.select_node(['0']);
            }
        });

        me.$treeContainerSales.jstree({
            'plugins': ["wholerow", "types", "dnd"],
            'core': {
                'themes' : {
                    "responsive": false,
                    'dots': false
                },
                'multiple': false,
                'check_callback' : true,
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
            if(data.selected.length > 0 && data.node) {
                me.$containerSalesStatus.find('input[name=categoryName]').val(data.node.text);
                var child = data.node.children_d;
                var categories = child.concat([data.node.id]);
                me.categoriesSalesStatus = categories.join(',');
                me.loadSalesStatus(categories.join(','));
            }else{
                data.instance.select_node(['0']);
            }
        });
    },

    initEventHandlers: function() {
        var me = this;

        var $dateStartProcessing = me.$containerProcessingStatus.find('input[name="startDate"]');
        var $dateEndProcessing = me.$containerProcessingStatus.find('input[name="endDate"]');
        $dateStartProcessing.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });
        $dateEndProcessing.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });

        var $dateStartSales = me.$containerSalesStatus.find('input[name="startDate"]');
        var $dateEndSales = me.$containerSalesStatus.find('input[name="endDate"]');
        $dateStartSales.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });
        $dateEndSales.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });

        var currentDate = new Date();
        var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        $dateStartProcessing.datepicker( "setDate", firstDay);
        $dateStartSales.datepicker( "setDate", firstDay);
        $dateStartProcessing.on('changeDate', function(e) {
            $dateEndProcessing.datepicker('setStartDate', e.date);
        });
        $dateStartSales.on('changeDate', function(e) {
            $dateEndSales.datepicker('setStartDate', e.date);
        });

        var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        $dateEndProcessing.datepicker( "setDate", lastDay);
        $dateEndProcessing.datepicker( "setStartDate", firstDay);
        $dateEndSales.datepicker( "setDate", lastDay);
        $dateEndSales.datepicker( "setStartDate", firstDay);

        me.$containerProcessingStatus.on('change', 'input[name=startDate], input[name=endDate], select[name=category]', function(e){
            e.preventDefault();
            if(shopOrderDeliveryController.isFieldNotEmpty(me.$containerProcessingStatus, 'endDate') == true) {
                me.loadProcessStatus();
            }
        });

        me.$containerSalesStatus.on('change', 'input[name=startDate], input[name=endDate], select[name=category]', function(e){
            e.preventDefault();
            if(shopOrderDeliveryController.isFieldNotEmpty(me.$containerSalesStatus, 'endDate') == true) {
                me.loadSalesStatus();
            }
        });

        me.$containerProcessingStatus.on('click', 'button#btn-download-processing-status', function (e) {
            e.preventDefault();
            me.downloadExcelReport('/admin/shop/dashboard/downloadProcessStatusDataExcel.json', me.$containerProcessingStatus, me.categoriesProcessingStatus);
        });
        me.$containerSalesStatus.on('click', 'button#btn-download-sales-status', function (e) {
            e.preventDefault();
            me.downloadExcelReport('/admin/shop/dashboard/downloadSalesDataExcel.json', me.$containerSalesStatus, me.categoriesSalesStatus);
        });

        me.$containerProcessingStatus.on('click', '.action-click-icon', function(e){
            e.preventDefault();
            me.$containerProcessingStatus.find('.portlet-dashboard-categoryTree').removeClass('hide');
            me.$treeContainerProcessing.jstree('open_all');
        });

        me.$containerSalesStatus.on('click', '.action-click-icon', function(e){
            e.preventDefault();
            me.$containerSalesStatus.find('.portlet-dashboard-categoryTree').removeClass('hide');
            me.$treeContainerSales.jstree('open_all');
        });

        $('html').click(function (e) {

            if(me.detectIE()){

                if ($(e.target).closest('.portlet-dashboard-categoryTree') && e.target.tagName == 'I' && e.target.classList[1] == 'jstree-ocl'){

                } else if (e.target.id != 'category-container-processing' && e.target.id != 'category-processing-action-span'
                    && e.target.id != 'category-processing-action-i') {
                    me.$containerProcessingStatus.find('.portlet-dashboard-categoryTree').addClass('hide');
                }

                if ($(e.target).closest('.portlet-dashboard-categoryTree') && e.target.tagName == 'I' && e.target.classList[1] == 'jstree-ocl'){

                } else if (e.target.id != 'category-sales-processing' && e.target.id != 'category-sales-action-span'
                    && e.target.id != 'category-sales-action-i') {
                    me.$containerSalesStatus.find('.portlet-dashboard-categoryTree').addClass('hide');
                }
            } else {
                if (e.target.closest('.portlet-dashboard-categoryTree') && e.target.closest('.portlet-dashboard-categoryTree').id == 'category-container-processing'
                    && e.target.tagName == 'I' && e.target.classList[1] == 'jstree-ocl'){

                } else if (e.target.id != 'category-container-processing' && e.target.id != 'category-processing-action-span'
                    && e.target.id != 'category-processing-action-i') {
                    me.$containerProcessingStatus.find('.portlet-dashboard-categoryTree').addClass('hide');
                }

                if (e.target.closest('.portlet-dashboard-categoryTree') && e.target.closest('.portlet-dashboard-categoryTree').id == 'category-container-sales'
                    && e.target.tagName == 'I' && e.target.classList[1] == 'jstree-ocl'){

                } else if (e.target.id != 'category-sales-processing' && e.target.id != 'category-sales-action-span'
                    && e.target.id != 'category-sales-action-i') {
                    me.$containerSalesStatus.find('.portlet-dashboard-categoryTree').addClass('hide');
                }
            }
        });

        me.loadShopCategoriesTree();
    },

    loadShopCategoriesTree: function(){
        var me = this;

        $.ajax({
            url: '/admin/shop/category/loadCategoryTree.json',
            type: 'GET',
            dataType: 'json',
            data:{
                mallNo: shopOrderDeliveryController.shopMallNo
            },
            success: function(data) {
                if (data.success) {
                    var category = data.data;
                    me.$treeContainerSales.jstree(true).settings.core.data = category;
                    me.$treeContainerSales.jstree(true).refresh();

                    me.$treeContainerProcessing.jstree(true).settings.core.data = category;
                    me.$treeContainerProcessing.jstree(true).refresh();

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

    loadProcessStatus: function(categories){
        var me = this;

        if(categories == '') {
            categories = 0;
        }
        var startDate = me.$containerProcessingStatus.find('input[name="startDate"]').val();
        var endDate = me.$containerProcessingStatus.find('input[name="endDate"]').val();

        $.ajax({
            url: '/admin/shop/dashboard/processStatus.json',
            type: 'GET',
            dataType: 'json',
            data:{
                mallNo: shopOrderDeliveryController.shopMallNo,
                categories: categories,
                startDate: startDate,
                endDate: endDate
            },
            success: function(data) {
                if (data.success) {
                    var summary = data.data;
                    me.buildProcessStatusSummary(summary);
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

    loadSalesStatus: function(categories){
        var me = this;

        if(categories == '') {
            categories = 0;
        }
        var startDate = me.$containerSalesStatus.find('input[name="startDate"]').val();
        var endDate = me.$containerSalesStatus.find('input[name="endDate"]').val();

        $.ajax({
            url: '/admin/shop/dashboard/salesStatus.json',
            type: 'GET',
            dataType: 'json',
            data:{
                mallNo: shopOrderDeliveryController.shopMallNo,
                categories: categories,
                startDate: startDate,
                endDate: endDate
            },
            success: function(data) {
                if (data.success) {
                    var summary = data.data;
                    me.buildSalesStatusSummary(summary);
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

    buildProcessStatusSummary: function(arr){
        var me = this;

        for(var i = 0; i < arr.length; i++){
            var item = arr[i];
            if(item.name == 'dashboardOrderMgmt.totalOrder'){
                me.$containerProcessingStatus.find('.lbl-total-order').text(mugrunApp.formatNumber(item.value) + ' 건');
            } else if(item.name == 'dashboardOrderMgmt.waitDelivery'){
                me.$containerProcessingStatus.find('.lbl-wait-delivery').text(mugrunApp.formatNumber(item.value) + ' 건');
            } else if(item.name == 'dashboardOrderMgmt.delivering'){
                me.$containerProcessingStatus.find('.lbl-delivering').text(mugrunApp.formatNumber(item.value) + ' 건');
            } else if(item.name == 'dashboardOrderMgmt.completeDelivery'){
                me.$containerProcessingStatus.find('.lbl-complete-delivery').text(mugrunApp.formatNumber(item.value) + ' 건');
            } else if(item.name == 'dashboardOrderMgmt.requestRefund'){
                me.$containerProcessingStatus.find('.lbl-request-refund').text(mugrunApp.formatNumber(item.value) + ' 건');
            } else if(item.name == 'dashboardOrderMgmt.completeRefund'){
                me.$containerProcessingStatus.find('.lbl-complete-refund').text(mugrunApp.formatNumber(item.value) + ' 건');
            }
        }
    },

    buildSalesStatusSummary: function(arr){
        var me = this;

        for(var i = 0; i < arr.length; i++){
            var item = arr[i];
            if(item.name == 'dashboardOrderMgmt.totalSales'){
                me.$containerSalesStatus.find('.lbl-total-sales').text(mugrunApp.formatNumber(item.value) + ' 원');
            } else if(item.name == 'dashboardOrderMgmt.orderCount'){
                me.$containerSalesStatus.find('.lbl-order-count').text(mugrunApp.formatNumber(item.value) + ' 건');
            } else if(item.name == 'dashboardOrderMgmt.refundAmount'){
                me.$containerSalesStatus.find('.lbl-refund-amount').text(mugrunApp.formatNumber(item.value) + ' 원');
            } else if(item.name == 'dashboardOrderMgmt.refundCount'){
                me.$containerSalesStatus.find('.lbl-refund-count').text(mugrunApp.formatNumber(item.value) + ' 건');
            }
        }
    },

    downloadExcelReport: function(url, tempContainer, categories){

        var mallNo = shopOrderDeliveryController.shopMallNo;

        if(categories == ''){
            categories = 0;
        }
        var startDate = tempContainer.find('input[name="startDate"]').val();
        var endDate = tempContainer.find('input[name="endDate"]').val();

        url += '?mallNo=' + mallNo + '&categories=' + categories + '&startDate=' + startDate + '&endDate=' + endDate;
        window.open(url, '_blank');
    },

    setHeightForScroller: function(){
        var me = this;
        me.$containerProcessingStatus.find('.scroller')[0].style.height = 'auto';
        me.$containerProcessingStatus.find('.slimScrollDiv')[0].style.height = 'auto';
        me.$containerSalesStatus.find('.scroller')[0].style.height = 'auto';
        me.$containerSalesStatus.find('.slimScrollDiv')[0].style.height = 'auto';
    },

    detectIE: function() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');

        // IE 10 or older => return version number
        if (msie > 0) {
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        // IE 11 => return version number
        if (trident > 0) {
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        // IE 12 => return version number
        if (edge > 0) {
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        return false;
    }

});

var dashboardController = new DashboardController('#container-order-delivery-dashboard');
