$( document ).ready(function() {

    var VodViewController = function (selector) {
        this.init(selector);
    };

    $.extend(VodViewController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.settingType = me.$container.find('input#setting-type').val();
            me.settingNo = me.$container.find('input#setting-no').val();
            me.currVodListPage = me.$container.find('input#curr-vod-list-page').val();
            me.currActiveTab = me.$container.find('input#curr-active-tab').val();
            me.currLessonProgram = me.$container.find('input#curr-lesson-program').val();

            me.initEventHandlers();
            me.initVideo();
        },

        initEventHandlers: function () {
            var me = this;

            me.$container.on('click', '.btn-back-setting-list', function(e){
                e.preventDefault();
                if(me.settingType == '1') {
                    siteApp.redirectPage('', 'POST', {method:'pro_vod_list',settingNo: me.settingNo,
                        activeTab: me.currActiveTab, lessonProgram: me.currLessonProgram, page: me.currVodListPage});
                } else if(me.settingType == '2'){
                    siteApp.redirectPage('', 'POST', {method:'situation_vod_list', settingType:me.settingType ,settingNo: me.settingNo, page: me.currVodListPage});
                } else if(me.settingType == '3'){
                    siteApp.redirectPage('', 'POST', {method:'club_vod_list', settingType:me.settingType ,settingNo: me.settingNo, page: me.currVodListPage});
                }
            });
        },

        initVideo: function(){
            $('video').mediaelementplayer({
                success: function (media, node, player) {
                    $('#' + node.id + '-mode').html('mode: ' + media.pluginType);
                }
            });
        }


    });

    var vodViewController = new VodViewController('#container-vod-view');

});