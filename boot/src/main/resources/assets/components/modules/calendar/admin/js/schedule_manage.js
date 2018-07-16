var CalendarScheduleMntController = function (selector) {
    this.init(selector);
};

$.extend(CalendarScheduleMntController.prototype, {
    $container: null,
    oEditors: [],

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$filterHeader                = me.$container.find('.table-list-header');
        me.$tbListContent               = me.$container.find('.table-list-content');
        me.$selectCategories            = me.$filterHeader.find('.select-scheduleMnt-categories');
        me.$selectOptionSearch          = me.$filterHeader.find('.select-option-search');
        me.$inputTextSearch             = me.$filterHeader.find('.text-search');
        me.$btnClear                    = me.$filterHeader.find('.search-clear');
        me.$btnSearch                   = me.$filterHeader.find('.btn-search');
        me.$btnSelectAll                = me.$filterHeader.find('.btn-selectAll');
        me.$btnDelete                   = me.$filterHeader.find('.btn-delete');
        me.$btnAdd                      = me.$filterHeader.find('.btn-add');

        me.$tmplSelectCategories        = me.$container.find('#tmpl-scheduleMnt-optionCategories');

        me.$modalRegistSchedule         = me.$container.find('#modal-calendar-registSchedule');
        me.$formRegistSchedule          = me.$modalRegistSchedule.find('#form-registSchedule');


        me.initUi();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;


    },

    initEventHandlers: function() {
        var me = this;

        me.$selectCategories.on('change', function (e) {
            e.preventDefault();
            me.$tbListContent.bootstrapTable("refresh");
        });

        me.$inputTextSearch.keydown(function(event) {
            setTimeout(function() {
                if(me.$inputTextSearch.val() != ""){
                    me.$btnClear.removeClass('hide');
                } else if(!me.$btnClear.hasClass('hide')) {
                    me.$btnClear.addClass('hide');
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
            me.$tbListContent.bootstrapTable("refresh");
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
                mugrunApp.showWarningDeleteDialog(me.deleteMultiSchedules, listNo);
            }else{
                var title = mugrunApp.getMessage('common.alert.dialog.title');
                var message = '선택한 일정이 없습니다.';
                var type = BootstrapDialog.TYPE_PRIMARY;
                var buttonLabel = mugrunApp.getMessage('common.close');
                var buttonClass = 'btn blue';
                mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
            }
        });

        me.$btnAdd.click(function(e) {
            e.preventDefault();

            me.$formRegistSchedule[0].reset();
            if(me.$formRegistSchedule.data('formValidation')) {
                me.$formRegistSchedule.data('formValidation').destroy();
            }
            me.$formRegistSchedule.find('input[name="scheduleNo"]').val('');
            me.$modalRegistSchedule.find('#label-registSchedule-title').text('일정등록');
            me.$modalRegistSchedule.modal({backdrop: 'static', show: true});

            me.initScheduleRegisterInfoValidation();
            me.getSmartEditor('');

        });

        me.$tbListContent.on('click', 'i.btn-delete', function(e) {
            e.preventDefault();
            mugrunApp.showWarningDeleteDialog(me.deleteSchedule, $(this).data('scheduleno'), '입력하신 일정이 삭제됩니다. 삭제하시겠습니까?');
        });

        me.$tbListContent.on('click', 'i.btn-edit', function(e) {
            e.preventDefault();
            me.$formRegistSchedule[0].reset();
            if(me.$formRegistSchedule.data('formValidation')) {
                me.$formRegistSchedule.data('formValidation').destroy();
            }
            me.initScheduleRegisterInfoValidation();
            me.modifySchedule($(this).data('scheduleno'));
            me.$modalRegistSchedule.find('#label-registSchedule-title').text('일정수정');
            me.$modalRegistSchedule.modal({backdrop: 'static', show: true});
        });

        me.initScheduleRegisterEventHandlers();
    },

    loadData: function() {
        var me = this;

        $.when(me.loadCategories()).done(function(rs){
            me.loadSchedules();
        });

    },

    loadCategories: function() {
        var me = this;

        return $.ajax({
            url: '/admin/calendar/loadCategories.json',
            dataType: 'json',
            contentType: "application/json",
            success: function(response) {
                var params = {};
                params['categories'] = response.data;
                me.$selectCategories.empty().append(
                    $.tmpl(me.$tmplSelectCategories.html(), params)
                );
                me.$modalRegistSchedule.find('select[name="categoryNo"]').html(me.$selectCategories.html());
            }
        });
    },

    loadSchedules: function() {
        var me = this;

        return me.$tbListContent.bootstrapTable({
            url: '/admin/calendar/getScheduleList.json',
            cache: false,
            smartDisplay: false,
            showHeader : true,
            pagination : true,
            paginationHAlign: 'center',
            pageSize: 15,
            uniqueId: "scheduleNo",
            queryParamsType: '',
            queryParams: function(params) {
                params['categoryNo'] = me.$selectCategories.val();
                params['field'] = $.trim(me.$selectOptionSearch.val());
                params['keyword'] = $.trim(me.$inputTextSearch.val());
                return params;
            },
            columns: [
                {
                    field: 'scheduleNo',
                    title: '선택',
                    width: '5%',
                    align: 'center',
                    cellStyle: function(value, row, index) {
                        return {
                            classes: 'inbox-small-cells'
                        }
                    },
                    formatter: function(value,object){
                        return '<input type="checkbox" data-no="' + object.scheduleNo + '">';
                    }
                }, {
                    field: 'categoryName',
                    title: '구분',
                    sortable: true,
                    width: '30%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.categoryName;
                    }
                }, {
                    field: 'scheduleName',
                    title: '제목',
                    sortable: true,
                    width: '40%',
                    align: 'center',
                    formatter: function(value,object){
                        return object.scheduleName;
                    }
                }, {
                    field: 'startDate',
                    title: '시작일',
                    sortable: true,
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return mugrunApp.formatDate(object.startDate, 'YYYY-MM-DD');
                    }
                }, {
                    field: 'endDate',
                    title: '종료일',
                    sortable: true,
                    width: '10%',
                    align: 'center',
                    formatter: function(value,object){
                        return mugrunApp.formatDate(object.endDate, 'YYYY-MM-DD');
                    }
                }, {
                    field: 'edit',
                    title: '관리',
                    width: '5%',
                    align: 'center',
                    formatter: function(value,object){
                        return '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 none-padding-left none-padding-right"><i class="col-lg-4 col-md-4 col-sm-4 col-xs-4 inline glyphicon glyphicon-pencil btn-edit none-padding-left none-padding-right" data-scheduleNo="'+object.scheduleNo+'"></i>' +
                            '<i class="col-lg-4 col-md-4 col-sm-4 col-xs-4 inline glyphicon glyphicon-folder-close  btn-delete none-padding-left none-padding-right" data-scheduleNo="' + object.scheduleNo + '"></i></div>';
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

    initScheduleRegisterEventHandlers: function() {
        var me = this;

        var $dateStart = me.$modalRegistSchedule.find('input[name="startDate"]');
        var $dateEnd = me.$modalRegistSchedule.find('input[name="endDate"]');
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
        //var currentDate = new Date();
        //$dateStart.datepicker( "setDate", currentDate);
        //$dateEnd.datepicker( "setDate", currentDate);
        $dateStart.datepicker().on('changeDate', function(e){
            $dateEnd.datepicker('setStartDate', e.date);
        });
        $dateEnd.datepicker().on('changeDate', function(e){
            $dateStart.datepicker('setEndDate', e.date);
        });

        me.$modalRegistSchedule.find('button.btn-dialog-save').click(function(e) {
            e.preventDefault();
            var formValidation = me.$formRegistSchedule.data('formValidation');
            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else{
                me.submitScheduleRegisterInfo();
            }
        });

        me.initScheduleRegisterInfoValidation();
    },

    submitScheduleRegisterInfo: function() {
        var me = this;
        var data = {};
        me.$formRegistSchedule.serializeArray().map(function(item) {
            if ( data[item.name] ) {
                if ( typeof(data[item.name]) === "string" ) {
                    data[item.name] = [data[item.name]];
                }
                data[item.name].push(item.value);
            } else {
                data[item.name] = item.value;
            }
        });
        data['scheduleContent'] = me.oEditors.getById["txt-registSchedule-content"].getIR();

        $.ajax({
            url: '/admin/calendar/submitScheduleRegisterInfo.json',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(response) {
                if(response.success) {
                    me.$tbListContent.bootstrapTable("refresh");
                    me.$modalRegistSchedule.modal('hide');
                    mugrunApp.alertMessage(siteAdminApp.getMessage('calendar.category.mnt.save.success'));
                }else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$modalRegistSchedule.find('button.btn-dialog-save').prop('disabled', true);
            },
            complete: function () {
                me.$modalRegistSchedule.find('button.btn-dialog-save').prop('disabled', false);
            }
        });
    },

    initScheduleRegisterInfoValidation: function() {
        var me = this;

        me.$formRegistSchedule.formValidation({
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
                'scheduleName': {
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
                'linkUrl': {
                    row: '.controls',
                    validators: {
                        stringLength: {
                            max: 512,
                            message: siteAdminApp.getMessage('common.validation.field.maxlength', {maxLength: 512})
                        }
                    }
                }
            }
        });
    },

    deleteMultiSchedules: function(listNo) {
        var me = calendarScheduleMntController;

        $.ajax({
            url: '/admin/calendar/deleteMultiSchedules.json',
            dataType: 'json',
            contentType: "application/json",
            data: {
                listNo: JSON.stringify(listNo)
            },
            success: function(response) {
                if (response.success) {
                    me.$tbListContent.bootstrapTable("refresh");
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

    deleteSchedule: function(scheduleNo) {
        var me = calendarScheduleMntController;
        $.ajax({
            url: '/admin/calendar/deleteSchedule.json',
            dataType: 'json',
            data: {
                scheduleNo: scheduleNo
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    me.$tbListContent.bootstrapTable("refresh");
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

    modifySchedule: function(scheduleNo) {
        var me = this;

        $.ajax({
            url: '/admin/calendar/getSchedule.json',
            dataType: 'json',
            data: {
                scheduleNo: scheduleNo
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    var data = response.data;
                    me.$formRegistSchedule.find('input[name="scheduleNo"]').val(data.scheduleNo);
                    me.$formRegistSchedule.find('select[name="categoryNo"]').val(data.categoryNo);
                    me.$formRegistSchedule.find('input[name="scheduleName"]').val(data.scheduleName);
                    me.$formRegistSchedule.find('input[name="startDate"]').datepicker("setDate", mugrunApp.formatDate(data.startDate, 'YYYY-MM-DD'));
                    me.$formRegistSchedule.find('input[name="endDate"]').datepicker("setDate", mugrunApp.formatDate(data.endDate, 'YYYY-MM-DD'));
                    me.$formRegistSchedule.find('input[name="linkUrl"]').val(data.linkUrl);
                    me.getSmartEditor(data.scheduleContent);
                } else{
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                me.$modalRegistSchedule.find('button.btn-dialog-save').prop('disabled', true);
            },
            complete: function () {
                me.$modalRegistSchedule.find('button.btn-dialog-save').prop('disabled', false);
            }
        });
    },

    getSmartEditor: function(content) {
        var me = this;
        if(me.oEditors.length == 0 || $(me.oEditors.getById["txt-registSchedule-content"]).length == 0) {
            nhn.husky.EZCreator.createInIFrame({
                oAppRef: me.oEditors,
                elPlaceHolder: 'txt-registSchedule-content',
                sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2",
                htParams : {
                    bUseToolbar : true
                },
                fOnAppLoad : function(){
                    me.oEditors.getById["txt-registSchedule-content"].setIR(content);
                }
            });
        }else{
            me.oEditors.getById["txt-registSchedule-content"].setIR(content);
        }

    }

});


