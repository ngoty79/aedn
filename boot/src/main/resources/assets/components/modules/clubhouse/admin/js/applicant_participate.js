var ApplicantParticipateController = function (selector) {
    this.init(selector);
};

$.extend(ApplicantParticipateController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$tbListContent               = me.$container.find('.table-applicant-list');
        me.$selectApplyStatusFilter     = me.$container.find('#applyStatusFilter');
        me.$labelTotalItemApplied       = me.$container.find('#label-applicant-totalItemApplied');
        me.$labelTotalItemCompleted     = me.$container.find('#label-applicant-totalItemCompleted');
        me.$labelTotalItemCanceled      = me.$container.find('#label-applicant-totalItemCanceled');
        me.$btnExportExcel              = me.$container.find('.btn-export-excel');

        me.$tmplSelectApplyStatus       = me.$container.find('#tmpl-applicant-applyStatusOptions');

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
                    width: '20%',
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
                    width: '15%',
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
                    field: 'applyStatusName ',
                    title: '상태  ',
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        var btnStype = '';
                        if(object.applyStatus == CLHConstants.APPLY_STATUS_APPLY) {//apply
                            btnStype = 'green';
                        }else if(object.applyStatus == CLHConstants.APPLY_STATUS_COMPLETE) {//complete payment
                            btnStype = 'btn-danger';
                        }else if(object.applyStatus == CLHConstants.APPLY_STATUS_CANCEL) {//cancel
                            btnStype = 'bg-gray';
                        }
                        return '<button type="button" class="btn '+btnStype+' font-size-13 btn-participate-applyStatus">'+object.applyStatusName+'</button>';
                    }
                }, {
                    field: 'edit',
                    title: '관리',
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-center none-padding action-grid-column inline">' +
                            '<i class="inline glyphicon glyphicon-ok-sign btn-complete-payment none-padding-left none-padding-right" data-no="'+object.applyNo+'" data-originStatus="'+object.applyStatus+'" title="입금완료"></i></div>' +
                            '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-center none-padding action-grid-column inline">' +
                            '<i class="inline glyphicon glyphicon-remove-sign btn-cancel-application none-padding-right" data-no="' + object.applyNo + '" data-originStatus="'+object.applyStatus+'" title="신청취소"></i></div>';
                    }
                }
            ],
            rowAttributes: function(row, index) {

            },
            onClickRow: function(row, element) {

            },
            onPostBody: function() {

            }
        });
    },

    initEventHandlers: function() {
        var me = this;

        me.$tbListContent.on('click', 'i.btn-complete-payment', function(e) {
            e.preventDefault();
            me.changeApplyStatus('BTNCOMPLETE', $(this).data('no'), $(this).data('originstatus'));
        });

        me.$tbListContent.on('click', 'i.btn-cancel-application', function(e) {
            e.preventDefault();
            me.changeApplyStatus('BTNCANCEL', $(this).data('no'), $(this).data('originstatus'));
        });

        me.$selectApplyStatusFilter.on('change', function (e) {
            e.preventDefault();
            me.loadListParticipate(me.eventNo);
        });

        me.$btnExportExcel.on('click', function (e) {
            e.preventDefault();
            var url = '/admin/clubhouse/download/list?eventNo=' + me.eventNo+'&applyType=1';
            window.open(url, '_blank');
        });
    },

    loadData: function(eventNo) {
        var me = this;
        me.eventNo = eventNo;
        $.when(me.loadApplyStatus(), me.loadApplyStatusTotals(eventNo)).done(function(rs1, rs2){
            me.loadListParticipate(eventNo);
        });
    },

    loadApplyStatus: function() {
        var me = this;
        return $.ajax({
            url: '/admin/common/getCodeByCodeGroup.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                codeGroup: 'ClubApplyStatus'
            },
            success: function(response) {
                me.$selectApplyStatusFilter.empty().append('<option value="">전체</option>').append(
                    $.tmpl(me.$tmplSelectApplyStatus.html(), response.data)
                );
            }
        });
    },

    loadApplyStatusTotals: function(eventNo) {
        var me = this;

        $.ajax({
            url: '/admin/clubhouse/getApplyStatusTotals.json',
            dataType: 'json',
            data: {
                eventNo: eventNo
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    var data = response.data;
                    me.$labelTotalItemApplied.text(data.totalItemApplied);
                    me.$labelTotalItemCompleted.text(data.totalItemCompleted);
                    me.$labelTotalItemCanceled.text(data.totalItemCanceled);
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {

            },
            complete: function () {

            }
        });
    },

    loadListParticipate: function(eventNo) {
        var me = this;

        var data = {};
        data['eventNo'] = eventNo;
        data['applyStatus'] = me.$selectApplyStatusFilter.val();
        data['applyType'] = '1';
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

    changeApplyStatus: function(action, applyNo, originstatus) {
        var me = this;

        var applyStatus = '', message = '';
        if('BTNCOMPLETE' == action) {
            if(CLHConstants.APPLY_STATUS_APPLY == originstatus || CLHConstants.APPLY_STATUS_CANCEL == originstatus) {
                applyStatus = CLHConstants.APPLY_STATUS_COMPLETE;
                message = '입금완료 처리되었습니다.';
            }else if(CLHConstants.APPLY_STATUS_COMPLETE == originstatus) {
                message = '입금완료 처리가 취소되었습니다.';
                applyStatus = CLHConstants.APPLY_STATUS_APPLY;
            }
        }else if('BTNCANCEL' == action) {
            if(CLHConstants.APPLY_STATUS_APPLY == originstatus || CLHConstants.APPLY_STATUS_COMPLETE == originstatus) {
                applyStatus = CLHConstants.APPLY_STATUS_CANCEL;
                message = '참가신청이 취소되었습니다.';
            }else if(CLHConstants.APPLY_STATUS_CANCEL == originstatus) {
                applyStatus = CLHConstants.APPLY_STATUS_APPLY;
                message = '신청취소 처리가 취소되었습니다.';
            }
        }

        $.ajax({
            url: '/admin/clubhouse/changeApplyStatus.json',
            dataType: 'json',
            data: {
                applyNo: applyNo,
                applyStatus: applyStatus
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    mugrunApp.alertMessage(message);
                    me.$tbListContent.bootstrapTable('updateByUniqueId', {
                        id: applyNo,
                        row: {
                            applyStatus: applyStatus,
                            applyStatusName: me.getApplyStatusName(applyStatus)
                        }
                    });
                    me.loadApplyStatusTotals(me.eventNo);
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
    },

    getApplyStatusName: function(applyStatusNo) {
        var me = this;
        return me.$selectApplyStatusFilter.find("option[value="+applyStatusNo+"]").text();
    }

});

