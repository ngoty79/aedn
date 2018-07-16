
var JoinCompleteAdmin = function (selector) {
    this.init(selector);
};

$.extend(JoinCompleteAdmin.prototype, {
    $container: null,
    oEditors: [],

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.initEventHandlers();
    },

    initEventHandlers: function(){
        var me = this;

        me.$container.on('click', '#save-join-complete', function (e) {
            e.preventDefault();
            me.currCompleteProvision.provisionContent = me.oEditors.getById['join-complete-content'].getIR();
            var arrProvision = [me.currCompleteProvision];
            userAgreementAdmin.updateListProvision(arrProvision);
        });

        me.$container.on('click', '#cancel-join-complete', function (e) {
            e.preventDefault();
            me.oEditors.getById['join-complete-content'].setIR(me.currCompleteProvision.provisionContent);
        });

    },

    initSmartEditor: function() {
        var me = this;
        if(me.oEditors.length  > 0){
            me.getJoinCompleteProvision();
        } else {
            nhn.husky.EZCreator.createInIFrame({
                oAppRef: me.oEditors,
                elPlaceHolder: 'join-complete-content',
                sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2",
                htParams: {
                    bUseToolbar: true,
                    fOnBeforeUnload: true
                },
                fOnAppLoad : function(){
                    me.getJoinCompleteProvision();
                }
            });
        }
    },

    getJoinCompleteProvision: function(){
        var me = this;

        $.ajax({
            url: '/admin/signup/getJoinCompleteProvision.json',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    var joinCompleteProvision = data.data;
                    me.currCompleteProvision = joinCompleteProvision;
                    me.oEditors.getById['join-complete-content'].setIR(joinCompleteProvision.provisionContent);
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
    }
});

var joinCompleteAdmin = new JoinCompleteAdmin('#container-join-complete');
