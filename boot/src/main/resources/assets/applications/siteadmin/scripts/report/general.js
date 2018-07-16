var GeneralController = function (selector) {
    this.selector = selector;
};

$.extend(GeneralController.prototype, {
    $container: null,

    init: function (data) {
        var me = this;
        this.reportData = data;
        me.$container = $(this.selector);
        // Load the Visualization API and the corechart package.
        google.charts.load('current', {'packages':['corechart']});

        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(function(){
            me.drawChart();
        });

        me.initUi();
    },
    initUi : function(){
        var me = this;

    },
    drawChart: function(){
        var me = this;
        var locationData = [];
        var totalAmount = 0;
        $.each(me.reportData.locationDataList, function(index, report){
            var row = [report.townName, report.amount];
            totalAmount+=report.amount;
            locationData.push(row);
        });
        var drawStaffChart = [];
        $.each(me.reportData.staffDataList, function(index, report){
            var row = [report.staffUserName, report.amount];
            drawStaffChart.push(row);
        });

        var totalFmt = mugrunApp.formatNumber(totalAmount) + ' VNĐ';
        me.drawLocationChart(locationData, totalFmt);
        me.drawStaffChart(drawStaffChart, totalFmt);
        me.drawRevenueDayChart();
        me.drawRevenueMonthChart();
    },
    drawRevenueDayChart: function(){
        var me = this;
        var revenueDayChart = [['Ngày', 'Doanh Thu', 'Lơi Nhuận']];
        $.each(me.reportData.revenueDays, function(index, report){
            var day = mugrunApp.formatDate(report.date, 'DD/MM/YYYY');
            var row = [day, report.revenue, report.profit];
            revenueDayChart.push(row);
        });

        var data = google.visualization.arrayToDataTable(revenueDayChart);
        var options = {
            title : '',
            vAxis: {title: 'Số tiền'},
            hAxis: {title: 'Ngày'},
            seriesType: 'bars',
            'height': 400
        };

        var chart = new google.visualization.ComboChart(document.getElementById('chart-revenue-day'));
        chart.draw(data, options);


    },
    drawRevenueMonthChart: function(){
        var me = this;
        var revenueMonthChart = [['Ngày', 'Doanh Thu', 'Lợi Nhuận']];
        $.each(me.reportData.revenueMonths, function(index, report){
            var row = [report.month + "/" + report.year, report.revenue, report.profit];
            revenueMonthChart.push(row);
        });

        var data = google.visualization.arrayToDataTable(revenueMonthChart);
        var options = {
            title : '',
            vAxis: {title: 'Doanh Thu'},
            hAxis: {title: 'Tháng'},
            seriesType: 'bars',
            'height': 400
        };

        var chart = new google.visualization.ComboChart(document.getElementById('chart-revenue-month'));
        chart.draw(data, options);


    },

    drawLocationChart: function(locationData, totalFmt){
        var me = this;
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Khu Vực');
        data.addColumn('number', 'Dư Nợ');

        data.addRows(locationData);

        // Set chart options
        var options = {
            'title':'Thống kê dư nợ theo khu vực. Tổng dư nợ: ' + totalFmt,
            is3D: true,
            'width':'500',
            'height':'400'
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart-town'));
        chart.draw(data, options);
    },
    drawStaffChart: function(staffData, totalFmt){
        var me = this;
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Nhân Viên');
        data.addColumn('number', 'Dư Nợ');

        data.addRows(staffData);

        // Set chart options
        var options = {
            'title':'Thống kê dư nợ theo Nhân Viên. Tổng dư nợ: ' + totalFmt,
            is3D: true,
            'width':'500',
            'height':'400'
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart-staff'));
        chart.draw(data, options);
    }


});

$(document).ready(function(){
    new GeneralController('#container-report-general');
});