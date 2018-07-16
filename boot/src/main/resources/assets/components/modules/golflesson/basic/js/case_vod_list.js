$( document ).ready(function() {

    var CaseVodListController = function (selector) {
        this.init(selector);
    };

    $.extend(CaseVodListController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$selectSituation = me.$container.find('.select-situation');
            me.settingNo = me.$container.find('input#setting-no').val();
            me.settingType = me.$container.find('input#setting-type').val();
            me.userNo = me.$container.find('input#user-no').val();
            me.page = me.$container.find('input#page').val();

            if(me.settingType == '2') {
                me.scene = 'situation_vod_list';
            } else if(me.settingType == '3') {
                me.scene = 'club_vod_list';
            }

            me.initEventHandlers();

        },

        initEventHandlers: function () {
            var me = this;

            me.$selectSituation.on('change', function(e){
                e.preventDefault();

                var settingNo = $(this).val();

                siteApp.redirectPage('', 'POST', {method:me.scene,settingType:me.settingType ,settingNo: settingNo,
                    page: 1});
            });

            me.$container.on('click', 'a.page', function(){
                siteApp.redirectPage('', 'POST', {method:me.scene,settingType:me.settingType ,settingNo: me.settingNo,
                    page: $(this).data('page')});
            });

            me.$container.on('click', 'a.page-golflesson-prev', function(){
                if($(this).data('prev') != $(this).data('page')) {
                    siteApp.redirectPage('', 'POST', {method:me.scene,settingType:me.settingType ,settingNo: me.settingNo,
                        page: $(this).data('prev'), prev: true});
                }
            });

            me.$container.on('click', 'a.page-golflesson-next', function(){
                if($(this).data('next') != $(this).data('page')) {
                    siteApp.redirectPage('', 'POST', {method:me.scene,settingType:me.settingType ,settingNo: me.settingNo,
                        page: $(this).data('next'), next:true});
                }
            });

            me.$container.on('click', '.view-lesson-detail', function(){
                var dataNo = $(this).data('no');
                siteApp.redirectPage('', 'POST', {
                    method: 'vod_view',
                    dataNo: dataNo,
                    currVodListPage: me.page,
                    settingNo: me.settingNo,
                    settingType: me.settingType
                });
            });
        }

    });

    var caseVodListController = new CaseVodListController('#container-case-vod-list');

});