var ApplicantAwaiterController = function (selector) {
    this.init(selector);
};

$.extend(ApplicantAwaiterController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tbListContent               = me.$container.find('.table-awaiter-list');
        me.$labelTotalAwaiter           = me.$container.find('#label-awaiter-total');
        me.$btnExportExcel              = me.$container.find('.btn-export-excel');

        me.eventNo = 0;

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;

        me.$tbListContent.bootstrapTable({
            cache: false,
            smartDisplay: false,
            showHeader : true,
            pagination : true,
            paginationHAlign: 'center',
            pageSize: 15,
            uniqueId: "applyNo",
            columns: [
                {
                    field: 'applyNo',
                    title: '번호',
                    width: '5%',
                    align: 'center',
                    formatter: function(value, row, index){
                        return me.$tbListContent.bootstrapTable('getOptions').totalRows - index;
                    }
                }, {
                    field: 'regUserName',
                    title: '닉네임',
                    sortable: true,
                    width: '25%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.regUserName;
                    }
                }, {
                    field: 'regUserItemValue',
                    title: '핸디 ',
                    sortable: true,
                    width: '5%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.regUserItemValue;
                    }
                }, {
                    field: 'regUserTel',
                    title: '휴대전화',
                    sortable: true,
                    width: '20%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.regUserTel;
                    }
                }, {
                    field: 'departLocation',
                    title: '출발지역',
                    sortable: true,
                    width: '25%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.departLocation;
                    }
                }, {
                    field: 'carpoolYn ',
                    title: '카풀가능',
                    width: '5%',
                    align: 'center',
                    formatter: function(value,object){
                        if(object.carpoolYn == 1) {
                            return 'O';
                        }
                        return 'X';
                    }
                }, {
                    field: 'edit',
                    title: '관리',
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return '<div class="col-lg-11 col-md-11 col-sm-11 col-xs-11 text-center none-padding action-grid-column inline">' +
                            '<i class="inline glyphicon glyphicon-ok-sign btn-apply-attendance none-padding-left none-padding-right" data-no="'+object.applyNo+'" title="참가신청"></i></div>';
                    }
                }
            ],
            rowAttributes: function(row, index) {

            },
            onClickRow: function(row, element) {

            },
            onPostBody: function() {
                var total = me.$tbListContent.bootstrapTable('getOptions').totalRows;
                me.$labelTotalAwaiter.text(total);
            }
        });
    },

    initEventHandlers: function() {
        var me = this;

        me.$tbListContent.on('click', 'i.btn-apply-attendance', function(e) {
            e.preventDefault();
            var total = me.$tbListContent.bootstrapTable('getOptions').totalRows;
            var index = Number($(this).closest('tr').data('index'));
            if(total != index + 1) {
                mugrunApp.alertMessage('상위 대기 신청자가 있습니다.');
            }else{
                mugrunApp.showWarningDeleteDialog(me.applyAttendance, $(this).data('no'), '참가신청자로 변경하시겠습니까?');
            }
        });

        me.$btnExportExcel.on('click', function (e) {
            e.preventDefault();
            var url = '/admin/clubhouse/download/list?eventNo=' + me.eventNo+'&applyType=2';
            window.open(url, '_blank');
        });
    },

    loadData: function(eventNo) {
        var me = this;
        me.eventNo = eventNo;
        me.loadListAwaiter(eventNo);
    },

    loadListAwaiter: function(eventNo) {
        var me = this;

        var data = {};
        data['eventNo'] = eventNo;
        data['applyType'] = '2';
        $.ajax({
            url: '/admin/clubhouse/loadListEventApply.json',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    var data = response.data;
                    me.$tbListContent.bootstrapTable("load" , data);
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                //me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                //me.$container.unmask();
            }
        });
    },

    applyAttendance: function(applyNo) {
        var me = applicantAwaiterController;

        $.ajax({
            url: '/admin/clubhouse/applyAttendance.json',
            dataType: 'json',
            data: {
                applyNo: applyNo,
                eventNo: me.eventNo
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    me.loadListAwaiter(me.eventNo);
                    mugrunApp.alertMessage('참가신청자로 변경되었습니다.');
                } else if(response.status = 'FULL'){
                    mugrunApp.alertMessage('참가신청자로 변경이 불가능합니다.');
                } else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                //me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                //me.$container.unmask();
            }
        });
    }

});

