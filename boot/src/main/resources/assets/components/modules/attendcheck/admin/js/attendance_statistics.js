var AttendanceStatisticsController = function (selector) {
    this.init(selector);
};

$.extend(AttendanceStatisticsController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tableStatisticslist = me.$container.find('#table-statistics-list');

        me.initEventHandlers();
        me.initBootstrapTable();
    },

    initBootstrapTable : function() {
        var me = this;
        me.$tableStatisticslist.bootstrapTable({
            classes: 'table',
            columns: [
                {
                    field: 'attendDateStr',
                    title: '날짜',
                    width: '15%',
                    align: 'center',
                    formatter: function (value, object) {
                        return value;
                    }
                },
                {
                    field: 'attendCount',
                    title: '출석수',
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return mugrunApp.formatNumber(value);
                    }
                },
                {
                    field: 'graph',
                    title: '그래프',
                    width: '75%',
                    formatter: function (value, object) {
                        return '<div class="progress" style="width: ' + value +'%">' +
                            ' <div class="progress-bar progress-bar-graph" role="progressbar" style="width: 100%">' +
                            '</div> </div>';
                    }
                }
            ]
        });

        var attend1 = {attendDateStr: '2016-07-01', attendCount: '13', graph: '13'};
        var attend2 = {attendDateStr: '2016-07-02', attendCount: '53', graph: '53'};
        var attend3 = {attendDateStr: '2016-07-03', attendCount: '8', graph: '8'};
        var attend4 = {attendDateStr: '2016-07-04', attendCount: '28', graph: '28'};
        me.mockupDataStatisticslist = [attend1, attend2, attend3, attend4];
        //me.$tableStatisticslist.bootstrapTable('load', me.mockupDataStatisticslist);
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
        var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        $dateStart.datepicker( "setDate", firstDay);
        $dateEnd.datepicker( "setDate", currentDate);
        if($dateStart.val() == '') {
            $dateStart.val($.datepicker.formatDate('yy-mm-dd', firstDay));
        }
        if($dateEnd.val() == '') {
            $dateEnd.val($.datepicker.formatDate('yy-mm-dd', new Date()));
        }

        var startDate = me.$container.find('input[name="startDate"]').val();
        var endDate = me.$container.find('input[name="endDate"]').val();
        me.getStatisticsListByRange(startDate, endDate);

        /*$dateStart.datepicker().on('changeDate', function(e){
            me.reloadStatisticsList();
        });
        $dateEnd.datepicker().on('changeDate', function(e){
            me.reloadStatisticsList();
        });*/

        me.$container.on('click', 'button.btn-search', function(e){
            e.preventDefault();
            me.reloadStatisticsList();
        });

        me.$container.on('change', 'select[name=statisticsType]', function (e) {
            e.preventDefault();
            me.reloadStatisticsList();
        });

    },

    getStatisticsListByRange: function(startDate, endDate){
        var me = this;

        $.ajax({
            url: '/admin/attendcheck/getStatisticsList.json',
            type: 'GET',
            dataType: 'json',
            data : {
                startDate: startDate,
                endDate: endDate
            },
            success: function(data) {
                if (data.success) {
                    var statisticsList = data.data;
                    var dataFormated = me.formatDateByStatisticType(statisticsList);
                    me.$tableStatisticslist.bootstrapTable('load', dataFormated);

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

    formatDateByStatisticType: function(statisticsList){
        var me = this;

        var result = [];
        var statisticsType = me.$container.find('select[name=statisticsType]').val()
        if(statisticsType == 'D') {
            var uniqueList = me.getUniqueValue(statisticsList);
            var percentList = me.calculatePercentGraph(uniqueList);
            result = me.formatAttendDateTypeDay(percentList);
        } else {
            var formatAD = [];
            for (var i = 0; i < statisticsList.length; i++) {
                var obj = statisticsList[i];
                var arr = obj.attendDateStr.split('-');
                if (statisticsType == 'M') {
                    obj.attendDateStr = arr[0] + '-' + arr[1];
                } else if (statisticsType == 'Y') {
                    obj.attendDateStr = arr[0];
                }
                formatAD.push(obj);
            }
            var uniqueList = me.getUniqueValue(formatAD);
            result = me.calculatePercentGraph(uniqueList);
        }

        return result;
    },

    formatAttendDateTypeDay: function(statisticsList){
        var result = [];
        for (var i = 0; i < statisticsList.length; i++) {
            var object = statisticsList[i];
            var data = object.attendDateStr + '(' + object.attendDateWeekday + ')';
            if(object.attendDateWeekday == '토') {
                object.attendDateStr =  '<div style="color: blue">' + data + '</div>';
            } else if(object.attendDateWeekday == '일') {
                object.attendDateStr = '<div style="color: red">' + data + '</div>';
            } else {
                object.attendDateStr = '<div>' + data + '</div>';
            }
            result.push(object);
        }
        return result;
    },

    getUniqueValue: function(statisticsList){
        var result = [];
        var temp = statisticsList.slice();
        for(var i = 0 ; i <statisticsList.length; i++ ) {
            var obj = statisticsList[i];

            // remove duplicate item on temp array
            var indexTemp = temp.indexOf(obj);
            if(indexTemp > -1) {
                temp.splice(indexTemp, 1);
            }

            for(var j = 0 ; j < temp.length; j++ ) {
                var obj1 = temp[j];
                if(obj1.attendDateStr == obj.attendDateStr) {
                    obj.attendCount += obj1.attendCount;

                    // remove item have the same value
                    var index = statisticsList.indexOf(obj1);
                    if(index > -1) {
                        statisticsList.splice(index, 1);
                    }
                }
            }
            result.push(obj);
            // remove item done and reset index
            var index1 = statisticsList.indexOf(obj);
            if(index1 > -1) {
                statisticsList.splice(index1, 1);
            }
            i = -1;
        }
        return result;
    },

    calculatePercentGraph: function(statisticsList){
        var result = [];
        var maxCount = 0;
        for (var i = 0; i < statisticsList.length; i++) {
            var obj = statisticsList[i];
            if(obj.attendCount > maxCount){
                maxCount = obj.attendCount;
            }
        }

        for (var i = 0; i < statisticsList.length; i++) {
            var obj = statisticsList[i];
            obj.graph = (obj.attendCount*100)/maxCount;
            result.push(obj);
        }
        return result;
    },

    reloadStatisticsList: function(){
        var me = this;
        var startDate = me.$container.find('input[name="startDate"]').val();
        var endDate = me.$container.find('input[name="endDate"]').val();
        var statisticsType = me.$container.find('select[name=statisticsType]').val()
        var arrStartDate = startDate.split('-');
        var yearStartDate = arrStartDate[0];
        var monthStartDate = arrStartDate[1];
        var dateStartDate = arrStartDate[2];

        var arrEndDate = endDate.split('-');
        var yearEndDate = arrEndDate[0];
        var monthEndDate = arrEndDate[1];
        var dateEndDate = arrEndDate[2];

        if(statisticsType == 'D') {
            var numberOfMonths = (yearEndDate - yearStartDate) * 12 + (monthEndDate - monthStartDate);
            if(dateEndDate <= dateStartDate){
                numberOfMonths = numberOfMonths - 1;
            }

            if(numberOfMonths > 0) {
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = siteAdminApp.getMessage('attend.check.over.period.message');
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
                return;
            }

        } else if(statisticsType == 'M') {
            startDate = yearStartDate + '-' + monthStartDate + '-01';

            var lastDate = new Date( (new Date(yearEndDate, monthEndDate,1))-1 ).getDate();
            endDate = yearEndDate + '-' + monthEndDate + '-' + lastDate;

        } else if(statisticsType == 'Y') {
            startDate = yearStartDate + '-01-01';

            endDate = yearEndDate + '-12-31';
        }
        me.getStatisticsListByRange(startDate, endDate);
    }

});

var attendanceStatisticsController = new AttendanceStatisticsController('#container-attendance-statistics');

