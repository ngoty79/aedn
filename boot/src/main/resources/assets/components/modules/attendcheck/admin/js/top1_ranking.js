var Top1RankingController = function (selector) {
    this.init(selector);
};

$.extend(Top1RankingController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tableTop1Ranking = me.$container.find('#table-top1-ranking');
        me.$formTop1Ranking   = me.$container.find('#form-top1-ranking');

        me.initEventHandlers();
        me.initBootstrapTable();
        me.initFormValidation();
    },

    initFormValidation: function() {
        var me = this;

        me.$formTop1Ranking.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                top1Ranking : {
                    row: '.controls',
                    validators: {
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                }
            }
        });
    },

    initBootstrapTable : function() {
        var me = this;
        me.$tableTop1Ranking.bootstrapTable({
            classes: 'table',
            columns: [
                {
                    field: 'ranking',
                    title: '순위',
                    width: '20%',
                    align: 'center',
                    formatter: function (value, object) {
                        return value + '등';
                    }
                },
                {
                    field: 'attendCount',
                    title: '1등 횟수',
                    width: '15%',
                    align: 'center',
                    formatter: function(value,object){
                        return mugrunApp.formatNumber(value);
                    }
                },
                {
                    field: 'userNameID',
                    title: '회원',
                    width: '65%',
                    align: 'center',
                    formatter: function (value, object) {
                        return object.userName + '(' + object.userID + ')';
                    }
                }
            ]
        });

        var attend1 = {ranking: '1', attendCount: '113', userNameID: '회원(harry)'};
        var attend2 = {ranking: '2', attendCount: '83', userNameID: '회원(harry)'};
        var attend3 = {ranking: '3', attendCount: '58', userNameID: '회원(harry)'};
        var attend4 = {ranking: '4', attendCount: '29', userNameID: '회원(harry)'};
        me.mockupDataStatisticslist = [attend1, attend2, attend3, attend4];
        me.$tableTop1Ranking.bootstrapTable('load', me.mockupDataStatisticslist);
    },

    initEventHandlers: function() {
        var me = this;

        var $dateStart = me.$container.find('input[name="startDate"]');
        var $dateEnd = me.$container.find('input[name="endDate"]');
        $dateStart.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });
        $dateEnd.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });
        var currentDate = new Date();
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        $dateStart.datepicker( "setDate", currentDate);
        $dateEnd.datepicker( "setDate", currentDate);
        if($dateStart.val() == '') {
            $dateStart.val($.datepicker.formatDate('yy-mm-dd', currentDate));
        }
        if($dateEnd.val() == '') {
            $dateEnd.val($.datepicker.formatDate('yy-mm-dd', currentDate));
        }

        var startDate = me.$container.find('input[name="startDate"]').val();
        var endDate = me.$container.find('input[name="endDate"]').val();
        me.getTop1RankingByRange(startDate, endDate);

        /*$dateStart.datepicker().on('changeDate', function(e){
            me.reloadTop1RankingList();
        });

        $dateEnd.datepicker().on('changeDate', function(e){
            me.reloadTop1RankingList();
        });*/

        me.$container.on('click', 'button.btn-search', function(e){
            e.preventDefault();
            me.reloadTop1RankingList();
        });

        me.$container.on('change', 'input[name=top1Ranking]', function(){
            var itemShow = me.$container.find('input[name="top1Ranking"]').val();
            if(!isNaN(itemShow)){
                me.reloadTop1RankingList();
            }
        });

    },

    getTop1RankingByRange: function(startDate, endDate){
        var me = this;

        $.ajax({
            url: '/admin/attendcheck/getTop1RankingList.json',
            type: 'GET',
            dataType: 'json',
            data : {
                startDate: startDate,
                endDate: endDate
            },
            success: function(data) {
                if (data.success) {
                    var top1RankingList = data.data;
                    var dataList = me.sortListByAttendCount(top1RankingList);
                    me.$tableTop1Ranking.bootstrapTable('load', dataList);

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

    reloadTop1RankingList: function(){
        var me = this;
        var startDate = me.$container.find('input[name="startDate"]').val();
        var endDate = me.$container.find('input[name="endDate"]').val();
        me.getTop1RankingByRange(startDate, endDate);
    },

    sortListByAttendCount: function(list){
        var me = this;
        // sort by value
        var sortedList = list.sort(function (a, b) {
            if (a.attendCount < b.attendCount) {
                return 1;
            }
            if (a.attendCount > b.attendCount) {
                return -1;
            }

            var momentA  = moment(a.attendDateStr + ' ' + a.attendTime);
            var momentB  = moment(b.attendDateStr + ' ' + b.attendTime);
            if (momentA < momentB) {
                return -1;
            }
            if (momentA > momentB) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });

        for(var i = 0; i < sortedList.length; i++) {
            var obj = sortedList[i];
            obj.ranking = i + 1;
        }

        var itemShow = me.$container.find('input[name="top1Ranking"]').val();

        var result = sortedList.slice(0, itemShow);

        return result;
    }

});


var top1RankingController = new Top1RankingController('#container-top1-ranking');