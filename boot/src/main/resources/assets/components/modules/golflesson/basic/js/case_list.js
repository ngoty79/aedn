$( document ).ready(function() {

    var CaseListController = function (selector) {
        this.init(selector);
    };

    $.extend(CaseListController.prototype, {
        $container: null,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.settingType = me.$container.find('input#setting-type').val();

            if(me.settingType == '2') {
                me.scene = 'situation_vod_list';
            } else if(me.settingType == '3') {
                me.scene = 'club_vod_list';
            }

            me.initEventHandlers();
        },

        initEventHandlers: function () {
            var me = this;

            me.$container.on('click', '.btn-situation-detail', function(e){
                e.preventDefault();

                var settingNo = $(this).data('settingNo');

                siteApp.redirectPage('', 'POST', {method:me.scene, settingType:me.settingType ,settingNo: settingNo, page: 1});
            });
        }

    });

    var caseListController = new CaseListController('#container-case-list');

});