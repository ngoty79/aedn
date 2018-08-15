var BizReportController = function (selector) {
    this.init(selector);
};

$.extend(BizReportController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$btnSearch               = me.$container.find('#btn-search');
        me.$selectViewType          = me.$container.find('select[name="viewType"]');

        me.initUi();
    },
    initUi : function(){
        var me = this;
        me.$selectViewType.change(function(){
            me.search();
        });
        me.$btnSearch.click(function(){
            me.search();
        });
    },
    search: function(){
        var me = this;

    }


});

$(document).ready(function(){
    new BizReportController('#container-biz-report');
});