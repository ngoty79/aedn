$( document ).ready(function() {

    var ProfileVodListController = function (selector) {
        this.init(selector);
    };

    $.extend(ProfileVodListController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.$tabLessonProgram = me.$container.find('.tab-lesson-program');
            me.settingNo = me.$container.find('input#setting-no').val();
            me.activeTab = me.$container.find('input#active-tab').val();
            me.lessonProgram = me.$container.find('input#lession-program').val();
            me.settingType = me.$container.find('input#setting-type').val();
            me.userNo = me.$container.find('input#user-no').val();
            me.page = me.$container.find('input#page').val();

            me.initEventHandlers();
        },

        initEventHandlers: function () {
            var me = this;

            me.$tabLessonProgram.on('click', function(e){
                e.preventDefault();

                var activeTab = $(this).data('index');
                var lessonProgram = $(this).data('value');

                siteApp.redirectPage('', 'POST', {method:'pro_vod_list',settingNo: me.settingNo,
                    activeTab: activeTab, lessonProgram: lessonProgram, page: 1});
            });

            me.$container.on('click', 'a.page', function(){
                siteApp.redirectPage('', 'POST', {method:'pro_vod_list',settingNo: me.settingNo,
                    activeTab: me.activeTab, lessonProgram: me.lessonProgram, page: $(this).data('page')});
            });

            me.$container.on('click', 'a.page-golflesson-prev', function(){
                if($(this).data('prev') != $(this).data('page')) {
                    siteApp.redirectPage('', 'POST', {method:'pro_vod_list',settingNo: me.settingNo,
                        activeTab: me.activeTab, lessonProgram: me.lessonProgram, page: $(this).data('prev'), prev: true});
                }
            });

            me.$container.on('click', 'a.page-golflesson-next', function(){
                if($(this).data('next') != $(this).data('page')) {
                    siteApp.redirectPage('', 'POST', {method:'pro_vod_list',settingNo: me.settingNo,
                        activeTab: me.activeTab, lessonProgram: me.lessonProgram, page: $(this).data('next'), next:true});
                }
            });

            me.$container.on('click', '.view-lession-detail', function(){
                var dataNo = $(this).data('no');
                siteApp.redirectPage('', 'POST', {
                    method: 'vod_view',
                    dataNo: dataNo,
                    currVodListPage: me.page,
                    currActiveTab: me.activeTab,
                    currLessonProgram: me.lessonProgram,
                    settingNo: me.settingNo,
                    settingType: me.settingType
                });
            });
        }

    });

    var profileVodListController = new ProfileVodListController('#container-pro-vod-list');

});