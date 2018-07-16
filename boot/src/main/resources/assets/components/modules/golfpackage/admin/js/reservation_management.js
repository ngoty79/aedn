var ReservationManagementController = function (selector) {
    this.init(selector);
};

$.extend(ReservationManagementController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;
        me.$container = $(selector);
        me.$tableActionReservationList      = me.$container.find('#table-action-reservation-list');
        me.$tableReservationList            = me.$container.find('#table-reservation-list');
        me.selectFirstCategory              = me.$tableActionReservationList.find('.select-first-category');
        me.selectSecondCategory             = me.$tableActionReservationList.find('.select-second-category');
        me.tmplSelectFirstCategory          = me.$container.find('#tmpl-select-first-category');
        me.tmplSelectSecondCategory         = me.$container.find('#tmpl-select-second-category');
        me.selectReservationStatus          = me.$tableActionReservationList.find('.select-reservation-status-list');
        me.$modalReservationDetail          = me.$container.find('#modal-reservation-detail');
        me.$formReservationDetail           = me.$modalReservationDetail.find('#form-reservation-detail');
        me.$tableReservationDetailInfo      = me.$modalReservationDetail.find('#table-reservation-detail-info');
        me.$tableReservationUserInfo        = me.$modalReservationDetail.find('#table-reservation-user-info');

        me.eleRefundYn                      = me.$formReservationDetail.find('input[name=refundYn]');
        me.eleRefundAmount                  = me.$formReservationDetail.find('input[name="refundAmount"]');
        me.eleRefundComment                 = me.$formReservationDetail.find('textarea[name="refundComment"]');

        me.initEventHandlers();
        me.initBootstrapTable();
        me.checkInputSearchReservation();
    },
    initEventHandlers: function(){
        var me = this;

        me.$tableActionReservationList.on('change', '.select-first-category', function(e){
            e.preventDefault();
            var categoryNo = me.selectFirstCategory.val();
            if(categoryNo != ''){
                var packageNo = golfPackageController.$currGolfPackageDetail.packageNo;
                me.loadSecondCategoryList(packageNo, categoryNo);
            } else {
                me.selectSecondCategory.val('');
                me.selectSecondCategory.empty().append(
                    $.tmpl(me.tmplSelectSecondCategory.html(), {categories : []})
                );
            }
            me.loadReservationList();
        });

        me.$tableActionReservationList.on('change', '.select-second-category, .select-reservation-status-list', function(e){
            e.preventDefault();
            me.loadReservationList();
        });

        me.$tableActionReservationList.on('change', '.change-reservation-status-list', function(e){
            e.preventDefault();
            var reserveStatus = me.$tableActionReservationList.find('.change-reservation-status-list').val();
            if(reserveStatus != '') {
                var allItem = me.$tableReservationList.find('input.checkbox-item:checked');
                var allReserveNo = [];
                $.each(allItem, function (i, item) {
                    allReserveNo.push($(item).attr('data-value'));
                });
                if (allReserveNo.length > 0) {
                    var message = siteAdminApp.getMessage('golf.package.reserve.change.status.confirm');
                    var callbackFunc = me.changeStatusReserve;
                    var paramsForCallbackFunc = allReserveNo;
                    mugrunApp.showCommonConfirmDialog(message, callbackFunc, paramsForCallbackFunc);
                } else {
                    var message = siteAdminApp.getMessage('golf.package.reserve.change.status.no.selection');
                    mugrunApp.showCommonAlertDialog(message);
                    me.$tableActionReservationList.find('.change-reservation-status-list').val('');
                }
            }
        });

        me.$tableActionReservationList.find('#text-search-reservation').keydown(function (event) {
            setTimeout(function () {
                me.checkInputSearchReservation();
            }, 1);
        });

        me.$tableActionReservationList.on('click', '.search-clear', function(e){
            e.preventDefault();
            me.$container.find('#text-search-reservation').val("");
            me.loadReservationList();
            me.$tableActionReservationList.find('.search-clear').addClass('hide');
        });

        me.$tableActionReservationList.on('click', '#btn-search-reservation', function (e) {
            e.preventDefault();
            me.loadReservationList();
        });

        /*me.$tableReservationList.on('click', 'tbody > tr', function (e) {
            if (e.target.type != 'checkbox') {
                me.$tableReservationList.find('input.checkbox-item:checked').click();
                jQuery(e.currentTarget).find('input').click();
            }
        });*/

        me.$tableActionReservationList.on('click', '.btn-select-all', function (e) {
            e.preventDefault();
            var itemNotCheck = me.$tableReservationList.find('input.checkbox-item:not(:checked)');
            if (itemNotCheck.length == 0) {
                me.$tableReservationList.find('input.checkbox-item').click();
            } else {
                itemNotCheck.click();
            }
        });

        me.$tableActionReservationList.on('click', '.btn-download-excel', function (e) {
            e.preventDefault();
            var packageNo = golfPackageController.$currGolfPackageDetail.packageNo;
            var url = '/admin/golfpackage/reservation/download/list?packageNo=' + packageNo;
            window.open(url, '_blank');
        });

        me.$tableReservationList.on('click', '.open-reserve-detail', function (e) {
            e.preventDefault();

            me.initFormValidation();

            var reserveNo = $(this).data('value');
            //var row = me.$tableReservationList.bootstrapTable('getRowByUniqueId', reserveNo);
            $.when(me.loadReservationDetail(reserveNo)).done(function(rs){
                if (rs.success) {
                    var reservation = rs.data;

                    me.buildReservationDetail(reservation);

                    me.$modalReservationDetail.modal({backdrop: 'static', show: true});
                } else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            });

        });

        me.$formReservationDetail.on('change', 'select[name=reserveStatus]' , function(event){
            var reserveStatus = $(this).val();
            if(reserveStatus != 40 && me.isCheck(me.eleRefundYn)) {
                me.$formReservationDetail.find('#container-refund-yn-validate').addClass('has-error');
                me.$formReservationDetail.find('#refund-yn-message')[0].style.display = 'block';
            } else {
                me.$formReservationDetail.find('#refund-yn-message')[0].style.display = 'none';
                me.$formReservationDetail.find('#container-refund-yn-validate').removeClass('has-error');
            }
        });

        me.eleRefundYn.on('click', function(event){
            // because at this time. it will get previous state
            // so we must check opposite
            if(me.isCheck(me.eleRefundYn)) { // uncheck
                me.$formReservationDetail.formValidation('enableFieldValidators', 'refundAmount', false);
                me.$formReservationDetail.formValidation('enableFieldValidators', 'refundComment', false);
                me.$formReservationDetail.formValidation('revalidateField', 'refundAmount');
                me.$formReservationDetail.formValidation('revalidateField', 'refundComment');

                me.eleRefundAmount[0].setAttribute("disabled","disabled");
                me.eleRefundComment[0].setAttribute("disabled","disabled");
                me.$formReservationDetail.find('#refund-yn-message')[0].style.display = 'none';
                me.$formReservationDetail.find('#container-refund-yn-validate').removeClass('has-error');
            } else { // check
                me.eleRefundAmount[0].removeAttribute("disabled");
                me.eleRefundComment[0].removeAttribute("disabled");
                var reserveStatus = me.$formReservationDetail.find('select[name=reserveStatus]').val();
                if (reserveStatus != 40) {
                    me.$formReservationDetail.find('#container-refund-yn-validate').addClass('has-error');
                    me.$formReservationDetail.find('#refund-yn-message')[0].style.display = 'block';
                } else {
                    me.$formReservationDetail.find('#refund-yn-message')[0].style.display = 'none';
                    me.$formReservationDetail.find('#container-refund-yn-validate').removeClass('has-error');
                }

                me.$formReservationDetail.formValidation('enableFieldValidators', 'refundAmount', true);
                me.$formReservationDetail.formValidation('enableFieldValidators', 'refundComment', true);
                me.$formReservationDetail.formValidation('revalidateField', 'refundAmount');
                me.$formReservationDetail.formValidation('revalidateField', 'refundComment');
            }

        });

        me.$modalReservationDetail.on('click', '.btn-dialog-cancel', function (e) {
            e.preventDefault();
            me.closeReservationDetailModal();
        });

        me.$modalReservationDetail.on('click', '.btn-dialog-save', function (e) {
            e.preventDefault();
            var formValidation = me.$formReservationDetail.data('formValidation');
            var reserveStatus = me.$formReservationDetail.find('select[name=reserveStatus]').val();

            formValidation.validate();
            if (!formValidation.isValid() || (reserveStatus != 40 && me.isCheck(me.eleRefundYn))) {
                return;
            } else{
                var reservation = me.getReservationDetail();
                var message = siteAdminApp.getMessage('golf.package.reserve.detail.update.confirm');
                var callbackFunc = me.updateReservationDetail;
                var paramsForCallbackFunc = reservation;
                mugrunApp.showCommonConfirmDialog(message, callbackFunc, paramsForCallbackFunc);
            }
        });

        me.$formReservationDetail.on('click', '.btn-print-page' , function(event){
            var elem = me.$formReservationDetail;
            var domClone = elem[0].cloneNode(true);
            var $printSection = document.createElement("div");
            $printSection.id = "printSection";
            $printSection.appendChild(domClone);
            $($printSection).find('.btn-print-page').remove();
            document.body.insertBefore($printSection, document.body.firstChild);

            window.print();

            // Clean up print section for future use
            var oldElem = document.getElementById("printSection");
            if (oldElem != null) { oldElem.parentNode.removeChild(oldElem); }
            //oldElem.remove() not supported by IE
        });

        me.$modalReservationDetail.on('hidden.bs.modal', function () {
            me.closeReservationDetailModal();
        });
    },

    initBootstrapTable : function() {
        var me = this;

        me.$tableReservationList.bootstrapTable({
            cache: false,
            smartDisplay: false,
            showHeader : true,
            pagination : true,
            paginationHAlign: 'center',
            pageSize: 15,
            uniqueId: "reserveNo",
            classes: 'table',
            sidePagination: 'server',
            queryParamsType: '',
            queryParams: function(params) {
                return params;
            },
            columns: [
                {
                    field: 'reserveNo',
                    title: '선택',
                    width: '5%',
                    align: 'center',
                    cellStyle: function (value, row, index) {
                        return {
                            classes: 'checkbox-item'
                        }
                    },
                    formatter: function (value, object) {
                        return '<input type="checkbox" class="checkbox-item" data-value="' + object.reserveNo + '">';
                    }
                }, {
                    field: 'productName',
                    title: '상품명',
                    sortable: true,
                    width: '20%',
                    align: 'center',
                    formatter: function(value,object){
                        return '<a class="open-reserve-detail" data-value="' + object.reserveNo + '" ' +
                            'href="javascript:void(0)">' + value +'</a>';
                    }
                },
                {
                    field: 'userID',
                    title: '아이디',
                    sortable: true,
                    width: '10%',
                    align: 'center'
                },
                {
                    field: 'userName',
                    title: '이름',
                    sortable: true,
                    width: '10%',
                    align: 'center'
                },
                {
                    field: 'reserveDate',
                    title: '예약일',
                    sortable: true,
                    width: '15%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.reserveDate;
                    }
                }, {
                    field: 'peopleCount',
                    title: '인원',
                    sortable: true,
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return mugrunApp.formatNumber(value);
                    }
                }, {
                    field: 'paymentAmount',
                    title: '금액',
                    sortable: true,
                    width: '15%',
                    align: 'center',
                    formatter: function(value,object){
                        return mugrunApp.formatNumber(value) + '원';
                    }
                },
                {
                    field: 'reserveStatusName',
                    title: '상태',
                    sortable: true,
                    width: '15%',
                    align: 'center'
                }
            ],
            rowAttributes: function(row, index) {

            },
            onClickRow: function(row, element) {

            },
            onPostBody: function() {

            }
        });

        me.$tableReservationDetailInfo.bootstrapTable({
            cache: false,
            smartDisplay: false,
            showHeader : true,
            classes: 'table',
            columns: [
                {
                    field: 'departDateCustom',
                    title: '출발일',
                    width: '30%',
                    align: 'center',
                    formatter: function(value,object){
                        var fm = object.departDateStr + '(' + object.departWeekday + ')';
                        if(object.departTime != null){
                            fm += ' ' + object.departTime;
                        }
                        return fm;
                    }
                },
                {
                    field: 'arriveDateCustom',
                    title: '도착일',
                    width: '30%',
                    align: 'center',
                    formatter: function(value,object){
                        var fm = object.arriveDateStr + '(' + object.arriveWeekday + ')';
                        if(object.arriveTime != null){
                            fm += ' ' + object.arriveTime;
                        }
                        return fm;
                    }
                },
                {
                    field: 'dayCount',
                    title: '기간',
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        var arrive = moment(mugrunApp.formatDateByCurrentLocale(object.arriveDate));
                        var depart = moment(mugrunApp.formatDateByCurrentLocale(object.departDate));
                        var dayCount = arrive.diff(depart, 'days') + 1;
                        return dayCount + '일';
                    }
                },
                {
                    field: 'peopleCount',
                    title: '인원',
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return mugrunApp.formatNumber(value);
                    }
                },
                {
                    field: 'paymentAmount',
                    title: '결제금액',
                    width: '20%',
                    align: 'center',
                    formatter: function(value,object){
                        return mugrunApp.formatNumber(value) + '원';
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

        me.$tableReservationUserInfo.bootstrapTable({
            cache: false,
            smartDisplay: false,
            showHeader : true,
            classes: 'table',
            columns: [
                {
                    field: 'idNickname',
                    title: '아이디/닉네임',
                    width: '40%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.userID + '/' + object.userNickName;
                    }
                },
                {
                    field: 'userName',
                    title: '이름',
                    width: '20%',
                    align: 'center'
                },
                {
                    field: 'phoneNo',
                    title: '연락처',
                    width: '40%',
                    align: 'center'
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

    initFormValidation: function(){
        var me = this;

        me.$formReservationDetail.formValidation({
            framework: 'bootstrap',
            icon: {
                //valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'refundAmount': {
                    enabled: false,
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: siteAdminApp.getMessage('golf.package.refund.amount.required')
                        },
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                        },
                        integer: {
                            message: mugrunApp.getMessage('common.validation.field.integer')
                        }
                    }
                },
                'refundComment': {
                    enabled: false,
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: siteAdminApp.getMessage('golf.package.refund.comment.required')
                        }
                    }
                }
            }
        })
        // Showing only one message each time
        .on('err.validator.fv', function(e, data) {
            // $(e.target)    --> The field element
            // data.fv        --> The FormValidation instance
            // data.field     --> The field name
            // data.element   --> The field element
            // data.validator --> The current validator name

            data.element
                .data('fv.messages')
                // Hide all the messages
                .find('.help-block[data-fv-for="' + data.field + '"]').hide()
                // Show only message associated with current validator
                .filter('[data-fv-validator="' + data.validator + '"]').show();
        });
    },

    checkInputSearchReservation : function(){
        var me = this;
        me.checkInputSearch(me.$container, '#text-search-reservation', '.search-clear');
    },

    checkInputSearch : function(container, inputTextSearch, iconClear){

        if(container.find(inputTextSearch).val() != ""){
            container.find(iconClear).removeClass('hide');
        } else {
            if(!container.find(iconClear).hasClass('hide')) {
                container.find(iconClear).addClass('hide');
            }
        }
    },

    loadFirstCategoryList: function() {
        var me = this;
        var packageNo = golfPackageController.$currGolfPackageDetail.packageNo;

        $.ajax({
            url: '/admin/golfpackage/category/first/list.json',
            type: 'GET',
            dataType: 'json',
            data: {
                packageNo: packageNo
            },
            success: function(data) {
                if (data.success) {
                    var categories = data.data;
                    me.selectFirstCategory.empty().append(
                        $.tmpl(me.tmplSelectFirstCategory.html(), {categories: categories})
                    );

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

    loadSecondCategoryList: function(packageNo, parentCategoryNo) {
        var me = this;

        $.ajax({
            url: '/admin/golfpackage/category/second/list.json',
            type: 'GET',
            dataType: 'json',
            data: {
                packageNo: packageNo,
                parentCategoryNo: parentCategoryNo
            },
            success: function(data) {
                if (data.success) {
                    var categories = data.data;
                    me.selectSecondCategory.empty().append(
                        $.tmpl(me.tmplSelectSecondCategory.html(), {categories : categories})
                    );
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

    loadReservationList: function() {
        var me = this;

        var packageNo = golfPackageController.$currGolfPackageDetail.packageNo;

        var firstCategoryNo = me.selectFirstCategory.val();
        if(firstCategoryNo == ''){
            firstCategoryNo = 0;
        }

        var secondCategoryNo = me.selectSecondCategory.val();
        if(secondCategoryNo == ''){
            secondCategoryNo = 0;
        }

        var reserveStatus = me.selectReservationStatus.val();
        if(reserveStatus == ''){
            reserveStatus = 0;
        }

        var textSearch = me.$container.find('input[name=textSearch]').val();
        var fieldSearch = me.$container.find('select[name=fieldSearch]').val();

        var url = '/admin/golfpackage/reservation/list.json?packageNo=' + packageNo
            + '&firstCategoryNo=' + firstCategoryNo + '&secondCategoryNo=' + secondCategoryNo
            + '&reserveStatus=' + reserveStatus + '&textSearch=' + textSearch
            + '&fieldSearch=' + fieldSearch;
        me.$tableReservationList.bootstrapTable('refresh', {url: url});
    },

    loadReservationDetail: function(reserveNo) {
        var me = this;

        return $.ajax({
            url: '/admin/golfpackage/reservation/detail.json',
            dataType: 'json',
            data: {
                reserveNo: reserveNo
            },
            contentType: "application/json",
            success: function(response) {

            },
            beforeSend: function() {
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                me.$container.unmask();
            }
        });
    },

    changeStatusReserve : function(reserveNos){
        var me = reservationManagementController;

        var reserveStatus = me.$tableActionReservationList.find('.change-reservation-status-list').val();
        me.$tableActionReservationList.find('.change-reservation-status-list').val('');

        $.ajax({
            url: '/admin/golfpackage/reservation/status/change.json',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                reserveNos: reserveNos.join(','),
                reserveStatus: reserveStatus
            },
            success: function(data) {
                if (data.success) {
                    var message = mugrunApp.getMessage('common.alert.dialog.message.saved');
                    mugrunApp.showCommonAlertDialog(message);
                    // load again
                    //me.loadReservationList();
                    golfPackageController.getGolfPackageDetail(packageListController.currPackageNo);
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

    buildReservationDetail: function(row){
        var me = this;
        me.$tableReservationDetailInfo.bootstrapTable('load', [row]);
        me.$tableReservationUserInfo.bootstrapTable('load', [row]);

        me.$formReservationDetail.find('#first-cat-name').text('[' + row.firstCategoryName + '] ');
        if(row.secondCategoryName != null && row.secondCategoryName != '') {
            me.$formReservationDetail.find('#second-cat-name').text(row.secondCategoryName + ' ');
        }
        me.$formReservationDetail.find('#product-name').text(row.productName);

        me.$formReservationDetail.find('select[name=reserveStatus]').val(row.reserveStatus);
        me.$formReservationDetail.find('input[name=reserveNo]').val(row.reserveNo);

        if(row.refundYn == 1) {
            me.check(me.eleRefundYn);
            me.eleRefundAmount[0].removeAttribute("disabled");
            me.eleRefundComment[0].removeAttribute("disabled");
        } else {
            //if the box is checked when the unchecked event is fired which that would never happen
            var containerRefundYn = me.$formReservationDetail.find('#container-refund-yn-validate');

            me.unCheck(me.eleRefundYn);
            me.eleRefundAmount[0].setAttribute("disabled","disabled");
            me.eleRefundComment[0].setAttribute("disabled","disabled");
        }

        me.eleRefundAmount.val(row.refundAmount);
        me.eleRefundComment.val(row.refundComment);
    },

    getReservationDetail: function(){
        var me = this;

        var reserveNo = me.$formReservationDetail.find('input[name=reserveNo]').val();
        var row = me.$tableReservationList.bootstrapTable('getRowByUniqueId', reserveNo);
        row.reserveStatus = me.$formReservationDetail.find('select[name=reserveStatus]').val();

        if(me.isCheck(me.eleRefundYn)) {
            row.refundYn = 1;
            row.refundAmount = me.eleRefundAmount.val();
            row.refundComment = me.eleRefundComment.val();
        } else {
            row.refundYn = 0;
            row.refundAmount = '';
            row.refundComment = '';
        }

        return row;
    },

    updateReservationDetail : function(reservation){
        var me = reservationManagementController;

        $.ajax({
            url: '/admin/golfpackage/reservation/save.json',
            type: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(reservation),
            success: function(data) {
                if (data.success) {
                    me.$modalReservationDetail.modal('hide');
                    var message = mugrunApp.getMessage('common.alert.dialog.message.saved');
                    mugrunApp.showCommonAlertDialog(message);
                    // load again
                    //me.loadReservationList();
                    golfPackageController.getGolfPackageDetail(packageListController.currPackageNo);
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

    closeReservationDetailModal: function(){
        var me = this;
        me.$formReservationDetail.find('#refund-yn-message')[0].style.display = 'none';
        me.$modalReservationDetail.modal('hide');
        me.$formReservationDetail[0].reset();
        if(me.$formReservationDetail.data('formValidation')) {
            me.$formReservationDetail.data('formValidation').destroy();
        }
    },

    unCheck: function(cb) {
        if($(cb).parent().hasClass('checked')) {
            $(cb).prop("checked", false);
            $(cb).parent().removeClass('checked');
        }
    },
    check: function(cb) {
        if(!$(cb).parent().hasClass('checked')) {
            $(cb).click();
        }
    },

    isCheck: function(cb){
        if($(cb).parent().hasClass('checked')) {
            return true;
        }
        return false;
    }

});

var reservationManagementController = new ReservationManagementController('#container-reservation-management');