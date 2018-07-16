$( document ).ready(function(){
    var ClubhouseController = function (selector) {
        this.init(selector);
    };

    $.extend(ClubhouseController.prototype, {
        $container: null,
        init: function (selector) {
            var me = this;
            me.$container = $(selector);
            me.$containerEventList = me.$container.find('#container-clubhouse-eventList');
            me.categoryNo = me.$container.find(':hidden[name=categoryNo]').val();
            me.$containerPaging = me.$container.find('.container-paging');
            me.$tableEvent = me.$container.find('#table-clubhouse-event');
            me.$cboEventStatus = me.$container.find('select[name="eventStatus"]');
            me.initEventHandlers();
            
            var page = me.$container.find(':hidden[name=page]').val();
            (page != null && page != '') ? me.gotoPage(page) : me.gotoPage(1);
        },
        initEventHandlers: function() {
            var me = this;
            me.$containerEventList.on('click', 'div.container-paging a', function(){
                var page = $(this).data()['page'];
                if(page != null && page != ''){
                    me.gotoPage(page);
                }
            });

            me.$cboEventStatus.change(function(){
                me.gotoPage(1);
            });

        },
        gotoPage: function(page){
            var me = this;
            var url = '/site/clubhouse/loadEventList?page=' + page +'&eventStatus=' + me.$cboEventStatus.val() + '&categoryNo=' + me.categoryNo;
            me.$containerEventList.load(url);
        }
    });

    new ClubhouseController('.container-clubhouse-wrapper');
});