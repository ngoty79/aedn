var ClubhouseEventMntController = function (selector) {
    this.init(selector);
};

$.extend(ClubhouseEventMntController.prototype, {
    $container: null,
    oEditors: [],

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$filterHeader                = me.$container.find('.table-list-header');
        me.$tbListContent               = me.$container.find('.table-list-content');
        me.$selectCategories            = me.$filterHeader.find('.select-eventMnt-categories');
        me.$selectEventStatus           = me.$filterHeader.find('.select-eventMnt-eventStatus');
        me.$selectOptionSearch          = me.$filterHeader.find('.select-option-search');
        me.$inputTextSearch             = me.$filterHeader.find('.text-search');
        me.$btnClear                    = me.$filterHeader.find('.search-clear');
        me.$btnSearch                   = me.$filterHeader.find('.btn-search');
        me.$btnSelectAll                = me.$filterHeader.find('.btn-selectAll');
        me.$btnDelete                   = me.$filterHeader.find('.btn-delete');
        me.$btnAdd                      = me.$filterHeader.find('.btn-add');

        me.$tmplSelectCategories        = me.$container.find('#tmpl-eventMnt-categoryOptions');
        me.$tmplSelectEventStatus       = me.$container.find('#tmpl-eventMnt-eventStatusOptions');
        me.$tmplFacilitySelection       = me.$container.find('#tmpl-eventMnt-facilitySelection');

        me.$modalAddEvent               = me.$container.find('#modal-eventMnt-addEvent');
        me.$formAddEvent                = me.$modalAddEvent.find('#form-addEvent');
        /*me.$applyStartDate              = me.$modalAddEvent.find('input[name="applyStartDate"]');
        me.$applyEndDate                = me.$modalAddEvent.find('input[name="applyEndDate"]');*/

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;

        me.initEventTable();

        var timeOptions = me.generateTimes();
        me.$modalAddEvent.find('select[name="eventTime"]').html(timeOptions);
        me.$modalAddEvent.find('select[name="applyStartTime"]').html(timeOptions);
        me.$modalAddEvent.find('select[name="applyEndTime"]').html(timeOptions);
    },

    initDatePicker: function(){
        var me = this;

        var $applyStartDate              = me.$modalAddEvent.find('input[name="applyStartDate"]');
        var $applyEndDate                = me.$modalAddEvent.find('input[name="applyEndDate"]');
        var $eventDate                  = me.$modalAddEvent.find('input[name="eventDate"]');

        $eventDate.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        });

        $applyStartDate.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        }).on('changeDate', function(e){
            $applyEndDate.datepicker('setStartDate', e.date);
        });

        $applyEndDate.datepicker({
            language : 'ko',
            format: 'yyyy-mm-dd',
            autoclose: true
        }).on('changeDate', function(e){
            $applyStartDate.datepicker('setEndDate', e.date);
        });
    },


    initEventHandlers: function() {
        var me = this;

        me.$modalAddEvent.on('hidden.bs.modal', function (e) {
            e.preventDefault();

            me.$formAddEvent[0].reset();
            me.$formAddEvent.find('input[name="eventNo"]').val(0);
            if(me.$formAddEvent.data('formValidation')) {
                me.$formAddEvent.data('formValidation').destroy();
            }

            var $applyStartDate              = me.$modalAddEvent.find('input[name="applyStartDate"]');
            var $applyEndDate                = me.$modalAddEvent.find('input[name="applyEndDate"]');
            var $eventDate                  = me.$modalAddEvent.find('input[name="eventDate"]');

            $applyStartDate.datepicker('remove');
            $applyEndDate.datepicker('remove');
            $eventDate.datepicker('remove');
        });

        me.$btnAdd.click(function(e) {
            e.preventDefault();

            me.initDatePicker();

            me.$formAddEvent[0].reset();
            me.$formAddEvent.find('input[name="eventNo"]').val(0);
            if(me.$formAddEvent.data('formValidation')) {
                me.$formAddEvent.data('formValidation').destroy();
            }

            me.unCheck(me.$formAddEvent.find('input[name="attendWaitYn"]'));
            me.unCheck(me.$formAddEvent.find('input[name="attendAgreementYn"]'));
            me.initEventFormValidation();

            me.$modalAddEvent.find('#label-addEvent-title').text('행사등록');
            me.$modalAddEvent.modal({backdrop: 'static', show: true});

            me.getSmartEditor("txt-addEvent-content", '');
            me.getSmartEditor("txt-addEvent-attendAgreement", '');
        });

        me.$modalAddEvent.find('button.btn-dialog-save').click(function(e) {
            e.preventDefault();
            me.validateEventDate();
            me.validateApplyStartDate();
            me.validateApplyEndDate();
            me.validateApplyFacility();
            var formValidation = me.$formAddEvent.data('formValidation');
            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else{
                me.submitEventInfo();
            }
        });

        me.$modalAddEvent.find('input[name="peopleCount"]').keypress(function(event){
            mugrunApp.onlyNumber(event);
        });

        me.$selectCategories.on('change', function (e) {
            e.preventDefault();
            me.loadListEvent();
        });

        me.$selectEventStatus.on('change', function (e) {
            e.preventDefault();
            me.loadListEvent();
        });

        me.$inputTextSearch.keydown(function(event) {
            setTimeout(function() {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13') {
                    me.loadListEvent();
                }else{
                    if(me.$inputTextSearch.val() != ""){
                        me.$btnClear.removeClass('hide');
                    } else if(!me.$btnClear.hasClass('hide')) {
                        me.$btnClear.addClass('hide');
                    }
                }
            },1);
        });

        me.$btnClear.on('click', function (e) {
            e.preventDefault();
            me.$inputTextSearch.val("");
            me.$btnClear.addClass('hide');
        });

        me.$btnSearch.on('click', function (e) {
            e.preventDefault();
            me.loadListEvent();
        });

        me.$btnSelectAll.on('click', function (e) {
            e.preventDefault();
            var $checkboxUnchecked = me.$tbListContent.find('input[type="checkbox"]:not(:checked)');
            if($checkboxUnchecked.length > 0) {
                $checkboxUnchecked.each(function(i, item){
                    $(item).click();
                });
            }else{
                me.$tbListContent.find('input[type="checkbox"]').each(function(i, item){
                    $(item).click();
                });
            }
        });

        me.$btnDelete.on('click', function(e) {
            e.preventDefault();

            var listNo = [];
            me.$tbListContent.find('input[type="checkbox"]:checked').each(function(i, item){
                listNo.push($(item).data('no'));
            });

            if(listNo.length > 0) {
                mugrunApp.showWarningDeleteDialog(me.deleteMultiEvent, listNo, '행사 삭제 시 신청자 정보도 삭제됩니다. 삭제하시겠습니까?’');
            }else{
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = '선택한 행사가 없습니다.';
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
            }
        });

        me.$tbListContent.on('click', 'i.btn-delete', function(e) {
            e.preventDefault();
            mugrunApp.showWarningDeleteDialog(me.deleteEvent, $(this).data('no'), '행사 삭제 시 신청자 정보도 삭제됩니다. 삭제하시겠습니까?');
        });

        me.$tbListContent.on('click', 'i.btn-edit', function(e) {
            e.preventDefault();

            me.$modalAddEvent.find('#label-addEvent-title').text('행사수정');
            $.when(me.loadEventEditor($(this).data('no'))).done(function(rs){
                if (rs.success) {

                    me.initDatePicker();

                    me.$formAddEvent[0].reset();
                    me.setEventInfoEditor(rs.data);
                    if(me.$formAddEvent.data('formValidation')) {
                        me.$formAddEvent.data('formValidation').destroy();
                    }
                    me.initEventFormValidation();

                    me.$modalAddEvent.modal({backdrop: 'static', show: true});
                } else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            });

        });

        me.$tbListContent.on('click', 'i.btn-view', function(e) {
            e.preventDefault();
            var appliedCount = $(this).data('appliedcount');
            var canceledCount = $(this).data('canceledcount');
            if((appliedCount == 0 || appliedCount == null) && 
               (canceledCount == 0 || canceledCount == null)) {
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = '참가 신청인원이 없습니다.';
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);;
            }else{
                clubhouseIndexController.openApplicantInfo($(this).data('no'));
            }
        });
    },

    loadData: function() {
        var me = this;

        $.when(me.loadCategories(),
            me.loadEventStatus(),
            me.loadFacilityByGroup(1, me.$modalAddEvent.find('select[name="golfFacilityNo"]')),
            me.loadFacilityByGroup(2, me.$modalAddEvent.find('select[name="practiceFacilityNo"]'))
        ).done(function(rs1, rs2, rs3, rs4){
            me.loadListEvent();
        });
    },

    initEventTable: function() {
        var me = this;

        me.$tbListContent.bootstrapTable({
            cache: false,
            smartDisplay: false,
            showHeader : true,
            pagination : true,
            paginationHAlign: 'center',
            pageSize: 15,
            uniqueId: "eventNo",
            columns: [
                {
                    field: 'eventNo',
                    title: '선택',
                    width: '5%',
                    align: 'center',
                    cellStyle: function(value, row, index) {
                        return {
                            classes: 'inbox-small-cells'
                        }
                    },
                    formatter: function(value,object){
                        return '<input type="checkbox" data-no="' + object.eventNo + '">';
                    }
                }, {
                    field: 'categoryName',
                    title: '구분',
                    sortable: true,
                    width: '15%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.categoryName;
                    }
                }, {
                    field: 'locationName',
                    title: '지역',
                    sortable: true,
                    width: '15%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.locationName;
                    }
                }, {
                    field: 'eventTitle',
                    title: '제목',
                    sortable: true,
                    width: '15%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.eventTitle;
                    }
                }, {
                    field: 'eventDateStr',
                    title: '일시',
                    sortable: true,
                    width: '8%',
                    align: 'center'
                }, {
                    field: 'appliedCount',
                    title: '신청인원 ',
                    width: '8%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.appliedCount+"/"+object.peopleCount;
                    }
                }, {
                    field: 'canceledCount ',
                    title: '취소인원',
                    width: '8%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.canceledCount;
                    }
                }, {
                    field: 'waitingPeopleCount ',
                    title: '참석대기 ',
                    width: '8%',
                    align: 'center',
                    formatter: function(value,object){
                        if(object.waitingPeopleCount == 0) return null;
                        return object.waitingPeopleCount;
                    }
                }, {
                    field: 'eventStatusname ',
                    title: '진행상태 ',
                    width: '8%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.eventStatusname;
                    }
                }, {
                    field: 'edit',
                    title: '관리',
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-right none-padding"><i class="inline glyphicon glyphicon-user btn-view" data-no="'+object.eventNo+'" data-appliedCount="'+object.appliedCount+'" data-canceledCount="'+object.canceledCount+'"></i></div>' +
                            '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center none-padding"><i class="inline glyphicon glyphicon-pencil btn-edit " data-no="'+object.eventNo+'"></i></div>' +
                            '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-left none-padding"><i class="inline glyphicon glyphicon-folder-close btn-delete " data-no="' + object.eventNo + '"></i></div></div>';
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

    loadCategories: function() {
        var me = this;
        return $.ajax({
            url: '/admin/clubhouse/loadCategories.json',
            dataType: 'json',
            contentType: "application/json",
            success: function(response) {
                var params = {};
                params['categories'] = response.data;
                me.$selectCategories.empty().append(
                    $.tmpl(me.$tmplSelectCategories.html(), params)
                );
                me.$modalAddEvent.find('select[name="categoryNo"]').html(me.$selectCategories.html());
            }
        });
    },

    loadEventStatus: function() {
        var me = this;
        return $.ajax({
            url: '/admin/common/getCodeByCodeGroup.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                codeGroup: 'ClubEventStatus'
            },
            success: function(response) {
                var params = {};
                params['eventStatus'] = response.data;
                me.$selectEventStatus.empty().append('<option value="">전체</option>').append(
                    $.tmpl(me.$tmplSelectEventStatus.html(), params)
                );
                me.$modalAddEvent.find('select[name="eventStatus"]').empty().append(
                    $.tmpl(me.$tmplSelectEventStatus.html(), params)
                );
            }
        });
    },

    loadFacilityByGroup: function(group, selectControl) {
        var me = this;
        return $.ajax({
            url: '/admin/clubhouse/loadFacilitiesOnGroup.json',
            type: 'GET',
            dataType: 'json',
            data: {
                groupCode: group
            },
            success: function(response) {
                var params = {};
                params['group'] = group;
                params['facilities'] = response.data;
                $(selectControl).empty().append(
                    $.tmpl(me.$tmplFacilitySelection.html(), params)
                );
            }
        });
    },

    generateTimes: function() {
        var options = '<option value="">시간선택</option>';
        for(var i=0; i<24; i++) {
            options += '<option value="'+i.pad(2)+':00'+'">'+i.pad(2)+':00'+'</option>';
        }
        return options;
    },

    initEventFormValidation: function() {
        var me = this;

        me.$formAddEvent.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'categoryNo': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: '카테고리를 선택하여 주세요.'
                        }
                    }
                },
                'eventTitle': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: '제목을 입력하여 주세요.'
                        },
                        stringLength: {
                            max: 256,
                            message: siteAdminApp.getMessage('common.validation.field.maxlength', {maxLength: 256})
                        }
                    }
                },
                'eventDateValidator': {
                    row: '.controls',
                    excluded: false,
                    validators: {
                        notEmpty: {
                            message: '일시 및 시간을 선택하여 주세요.'
                        }
                    }
                },
                'applyStartDateValidator': {
                    row: '.controls',
                    excluded: false,
                    validators: {
                        notEmpty: {
                            message: '접수일시 및 시간을 입력하여 주세요.'
                        }
                    }
                },
                'applyEndDateValidator': {
                    row: '.controls',
                    excluded: false,
                    validators: {
                        notEmpty: {
                            message: '접수일시 및 시간을 입력하여 주세요.'
                        }
                    }
                },
                'peopleCount': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: '인원을 입력하여 주세요.'
                        },
                        stringLength: {
                            max: 11,
                            message: siteAdminApp.getMessage('common.validation.field.maxlength', {maxLength: 11})
                        }
                    }
                },
                'locationName': {
                    row: '.controls',
                    validators: {
                        notEmpty: {
                            message: '지역을 입력하여 주세요.'
                        },
                        stringLength: {
                            max: 256,
                            message: siteAdminApp.getMessage('common.validation.field.maxlength', {maxLength: 256})
                        }
                    }
                },
                'facilityValidator': {
                    row: '.controls',
                    excluded: false,
                    validators: {
                        notEmpty: {
                            message: '골프장 및 연습장 둘 중에 하나는 선택하여야 합니다.'
                        }
                    }
                }
            }
        });

        me.$formAddEvent.find('input[name="eventDate"],select[name="eventTime"]')
            .unbind('change')
            .change(function(e) {
            me.validateEventDate();
        });
        me.$formAddEvent.find('input[name="applyStartDate"],select[name="applyStartTime"]')
            .unbind('change')
            .change(function(e) {
            me.validateApplyStartDate();
        });
        me.$formAddEvent.find('input[name="applyEndDate"],select[name="applyEndTime"]')
            .unbind('change')
            .change(function(e) {
            me.validateApplyEndDate();
        });
        me.$formAddEvent.find('select[name="golfFacilityNo"],select[name="practiceFacilityNo"]')
            .unbind('change')
            .change(function(e) {
            me.validateApplyFacility();
        });
    },

    validateEventDate: function() {
        var me = this;
        if(me.$formAddEvent.find('input[name="eventDate"]').val() != '' && me.$formAddEvent.find('select[name="eventTime"]').val() != '') {
            me.$formAddEvent.find('input[name="eventDateValidator"]').val(true);
        }else{
            me.$formAddEvent.find('input[name="eventDateValidator"]').val('');
        }
        me.$formAddEvent.formValidation('revalidateField', 'eventDateValidator');
    },

    validateApplyStartDate: function() {
        var me = this;
        if(me.$formAddEvent.find('input[name="applyStartDate"]').val() != '' && me.$formAddEvent.find('select[name="applyStartTime"]').val() != '') {
            me.$formAddEvent.find('input[name="applyStartDateValidator"]').val(true);
        }else{
            me.$formAddEvent.find('input[name="applyStartDateValidator"]').val('');
        }
        me.$formAddEvent.formValidation('revalidateField', 'applyStartDateValidator');
    },

    validateApplyEndDate: function() {
        var me = this;
        if(me.$formAddEvent.find('input[name="applyEndDate"]').val() != '' && me.$formAddEvent.find('select[name="applyEndTime"]').val() != '') {
            me.$formAddEvent.find('input[name="applyEndDateValidator"]').val(true);
        }else{
            me.$formAddEvent.find('input[name="applyEndDateValidator"]').val('');
        }
        me.$formAddEvent.formValidation('revalidateField', 'applyEndDateValidator');
    },

    validateApplyFacility: function() {
        var me = this;
        if(me.$formAddEvent.find('select[name="golfFacilityNo"]').val() != '' || me.$formAddEvent.find('select[name="practiceFacilityNo"]').val() != '') {
            me.$formAddEvent.find('input[name="facilityValidator"]').val(true);
        }else{
            me.$formAddEvent.find('input[name="facilityValidator"]').val('');
        }
        me.$formAddEvent.formValidation('revalidateField', 'facilityValidator');
    },

    submitEventInfo: function() {
        var me = this;
        var data = {};
        data['attendWaitYn'] = 0;
        data['attendAgreementYn'] = 0;
        me.$formAddEvent.serializeArray().map(function(item) {
            var value = item.value;
            if (item.name === 'attendWaitYn' || item.name === 'attendAgreementYn') {
                value = (item.value == 'on' || item.value == true) ? 1 : 0;
            }
            if (data[item.name]) {
                if (typeof(data[item.name]) === "string" ) {
                    data[item.name] = [data[item.name]];
                }
                data[item.name].push(value);
            } else {
                data[item.name] = value;
            }
        });
        data['eventContent']    = me.oEditors.getById["txt-addEvent-content"].getIR();
        data['attendAgreement'] = me.oEditors.getById["txt-addEvent-attendAgreement"].getIR();

        $.ajax({
            url: '/admin/clubhouse/submitEventInfo.json',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(response) {
                if(response.success) {
                    me.loadListEvent();
                    me.$modalAddEvent.modal('hide');
                    mugrunApp.alertMessage(siteAdminApp.getMessage('calendar.category.mnt.save.success'));
                }else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$modalAddEvent.find('button.btn-dialog-save').prop('disabled', true);
            },
            complete: function () {
                me.$modalAddEvent.find('button.btn-dialog-save').prop('disabled', false);
            }
        });
    },

    loadListEvent: function() {
        var me = this;

        var data = {};
        data['categoryNo'] = me.$selectCategories.val();
        data['eventStatus'] = me.$selectEventStatus.val();
        data['optSearch'] = me.$selectOptionSearch.val();
        data['textSearch'] = me.$inputTextSearch.val();
        $.ajax({
            url: '/admin/clubhouse/loadListEvent.json',
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
                me.$container.mask(mugrunApp.getMessage('common.loading'));
            },
            complete: function () {
                me.$container.unmask();
            }
        });
    },

    deleteMultiEvent: function(listNo) {
        var me = clubhouseEventMntController;

        $.ajax({
            url: '/admin/clubhouse/deleteMultiEvent.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                listNo: JSON.stringify(listNo)
            },
            success: function(response) {
                if (response.success) {
                    me.loadListEvent();
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.alert.dialog.message.deleted'));
                } else{
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

    deleteEvent: function(eventNo) {
        var me = clubhouseEventMntController;
        $.ajax({
            url: '/admin/clubhouse/deleteEvent.json',
            dataType: 'json',
            data: {
                eventNo: eventNo
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    me.loadListEvent();
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.alert.dialog.message.deleted'));
                } else{
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

    loadEventEditor: function(eventNo) {
        var me = this;

        return $.ajax({
            url: '/admin/clubhouse/getEventInfo.json',
            dataType: 'json',
            data: {
                eventNo: eventNo
            },
            contentType: "application/json",
            success: function(response) {

            },
            beforeSend: function() {
                me.$modalAddEvent.find('button.btn-dialog-save').prop('disabled', true);
            },
            complete: function () {
                me.$modalAddEvent.find('button.btn-dialog-save').prop('disabled', false);
            }
        });
    },

    setEventInfoEditor: function(data) {
        var me = this;
        me.$formAddEvent.find('input[name="eventNo"]').val(data.eventNo);
        me.$formAddEvent.find('select[name="categoryNo"]').val(data.categoryNo);
        me.$formAddEvent.find('select[name="eventStatus"]').val(data.eventStatus);
        me.$formAddEvent.find('input[name="eventTitle"]').val(data.eventTitle);
        me.$formAddEvent.find('input[name="eventDate"]').datepicker("setDate", data.eventDateStr);
        me.$formAddEvent.find('select[name="eventTime"]').val(data.eventTime);
        me.$formAddEvent.find('input[name="applyStartDate"]').datepicker("setDate", data.applyStartDateStr);
        me.$formAddEvent.find('select[name="applyStartTime"]').val(data.applyStartTime);
        me.$formAddEvent.find('input[name="applyEndDate"]').datepicker("setDate", data.applyEndDateStr);
        me.$formAddEvent.find('select[name="applyEndTime"]').val(data.applyEndTime);
        me.$formAddEvent.find('input[name="peopleCount"]').val(data.peopleCount);
        if(Number(data.attendWaitYn) == 1) {
            me.check(me.$formAddEvent.find('input[name="attendWaitYn"]'));
        }else{
            me.unCheck(me.$formAddEvent.find('input[name="attendWaitYn"]'));
        }
        if(Number(data.attendAgreementYn) == 1) {
            me.check(me.$formAddEvent.find('input[name="attendAgreementYn"]'));
        }else{
            me.unCheck(me.$formAddEvent.find('input[name="attendAgreementYn"]'));
        }

        me.$formAddEvent.find('input[name="locationName"]').val(data.locationName);
        me.$formAddEvent.find('select[name="golfFacilityNo"]').val(data.golfFacilityNo);
        me.$formAddEvent.find('select[name="practiceFacilityNo"]').val(data.practiceFacilityNo);
        me.getSmartEditor("txt-addEvent-content", data.eventContent);
        var attendAgreement = data.attendAgreement != null ? data.attendAgreement : '';
        me.getSmartEditor("txt-addEvent-attendAgreement", attendAgreement);
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

    getSmartEditor: function(elementId, content) {
        var me = this;
        if(me.oEditors.length == 0 || $(me.oEditors.getById[elementId]).length == 0) {
            nhn.husky.EZCreator.createInIFrame({
                oAppRef: me.oEditors,
                elPlaceHolder: elementId,
                sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2",
                htParams : {
                    bUseToolbar : true
                },
                fOnAppLoad : function(){
                    me.oEditors.getById[elementId].setIR(content);
                }
            });
        }else{
            me.oEditors.getById[elementId].setIR(content);
        }

    }
});


