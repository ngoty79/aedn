var AttendCheckSettingController = function (selector) {
    this.init(selector);
};

$.extend(AttendCheckSettingController.prototype, {
    $container: null,
    currGradeAttendPoint: undefined,
    columnGAP: 2,

    init: function (selector) {
        var me = this;

        me.$container                       = $(selector);
        me.$checkStartTime                  = me.$container.find('select[name=checkStartTime]');
        me.$checkEndTime                    = me.$container.find('select[name=checkEndTime]');
        me.containerGradeAttendPoint        = me.$container.find('#grade-attend-point');
        me.$formAttendanceCheckSetting      = me.$container.find('#form-attendance-check-setting');

        me.initSelectTimeOption();
        me.initEventHandlers();
        me.getGradeAttendPoint();
    },


    initEventHandlers: function() {
        var me = this;

        me.$container.on('click', '#save-attendance-check-setting', function (e) {
            e.preventDefault();
            var formValidation = me.$formAttendanceCheckSetting.data('formValidation');
            var isValid = me.validateCheckTime();

            formValidation.validate();
            if (!formValidation.isValid() || !isValid) {
                return;
            } else {
                var moduleAttendCheck = me.buildUpdateModuleAttendCheck();
                attendCheckIndexController.updateModuleAttendCheck(moduleAttendCheck, attendCheckSettingController, true);
            }

        });

        me.$container.on('click', '#cancel-attendance-check-setting', function (e) {
            e.preventDefault();
            me.buildInfoAttendCheck(attendCheckIndexController.currModuleAttendCheck);
            me.resetDataGAP(me.currGradeAttendPoint);
            me.$container.find('#end-time-msg').text('');
        });

        me.$container.on('change', 'select[name=checkEndTime], select[name=checkStartTime]', function (e) {
            e.preventDefault();
            me.validateCheckTime();
        });
    },

    initFormACSValidation: function(gradeAttendPointFields) {
        var me = this;

        var basicField = {
            'basicAttendPoint': {
                row: '.controls',
                validators: {
                    greaterThan: {
                        value: 0,
                        message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                    },
                    integer: {
                        message: mugrunApp.getMessage('common.validation.field.integer')
                    }
                }
            },
            'regularAttendDays': {
                row: '.controls',
                validators: {
                    greaterThan: {
                        value: 0,
                        message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                    },
                    integer: {
                        message: mugrunApp.getMessage('common.validation.field.integer')
                    }
                }
            },
            'regularAttendPoint': {
                row: '.controls',
                validators: {
                    greaterThan: {
                        value: 0,
                        message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                    },
                    integer: {
                        message: mugrunApp.getMessage('common.validation.field.integer')
                    }
                }
            },
            'viewDays': {
                row: '.controls',
                validators: {
                    greaterThan: {
                        value: 0,
                        message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                    },
                    integer: {
                        message: mugrunApp.getMessage('common.validation.field.integer')
                    }
                }
            },
            'viewCount': {
                row: '.controls',
                validators: {
                    greaterThan: {
                        value: 0,
                        message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                    },
                    integer: {
                        message: mugrunApp.getMessage('common.validation.field.integer')
                    }
                }
            }
        };

        var allFields = $.extend({}, basicField, gradeAttendPointFields);

        me.$formAttendanceCheckSetting.formValidation({
            framework: 'bootstrap',
            icon: {
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: allFields
        })
        // Revalidate the floor field when changing the number of floors
        .on('keyup', '[name="checkStartTimeIndex"]', function(e) {
            me.$formAttendanceCheckSetting.formValidation('revalidateField', 'checkEndTimeIndex');
        });

    },

    buildInfoAttendCheck: function(attendCheck){
        var me = this;

        if(attendCheck.checkStartTime == null) {
            me.$container.find('select[name=checkStartTime]').val('');
        } else {
            me.$container.find('select[name=checkStartTime]').val(attendCheck.checkStartTime);
            me.$container.find('input[name=checkStartTimeIndex]').val(attendCheck.checkStartTime.split(':')[0]);
        }

        if(attendCheck.checkEndTime == null){
            me.$container.find('select[name=checkEndTime]').val('');
        } else {
            me.$container.find('select[name=checkEndTime]').val(attendCheck.checkEndTime);
            me.$container.find('input[name=checkEndTimeIndex]').val(attendCheck.checkEndTime.split(':')[0]);
        }

        me.$container.find('input[name=basicAttendPoint]').val(attendCheck.basicAttendPoint);
        me.$container.find('input[name=regularAttendDays]').val(attendCheck.regularAttendDays);
        me.$container.find('input[name=regularAttendPoint]').val(attendCheck.regularAttendPoint);
        me.$container.find('input[name=viewDays]').val(attendCheck.viewDays);
        me.$container.find('input[name=viewCount]').val(attendCheck.viewCount);
        me.$container.find('textarea[name=greeting]').val(attendCheck.greeting);

    },

    initSelectTimeOption: function(){
        var me = this;

        me.$checkStartTime.append('<option data-index="" value="">시간을 설정하세요</option>');
        me.$checkEndTime.append('<option data-index="" value="">시간을 설정하세요</option>');

        for(var i = 0; i < 25; i++){
            var text = i + ':00';
            if( i < 10) {
                text = '0' + text;
            }
            me.$checkStartTime.append('<option data-index="' + i +'" value="' + text + '"> ' + text + '</option>');
            me.$checkEndTime.append('<option data-index="' + i +'" value="' + text + '"> ' + text + '</option>');
        }

    },

    getGradeAttendPoint: function(){
        var me = this;

        $.ajax({
            url: '/admin/attendcheck/getGradeAttendPoint.json',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    var gradeAttendPointData = data.data;
                    me.currGradeAttendPoint = gradeAttendPointData;

                    var newData = me.formatGrateAttendByColumn(gradeAttendPointData, me.columnGAP);

                    var tmpl = me.containerGradeAttendPoint.empty().append(
                        $.tmpl(
                            me.$container.find('#tmpl-grade-attend-point').html(),
                            {gradeAttendPoint : newData, column : me.columnGAP}
                        )
                    );

                    me.item = $.tmplItem(tmpl);

                    var gradeAttendPointFields = me.gradeAttendPointField(gradeAttendPointData);
                    me.initFormACSValidation(gradeAttendPointFields);

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

    resetDataGAP: function(gradeAttendPointData) {
        var me = this;

        for (var i = 0; i < gradeAttendPointData.length; i++) {
            var name = 'gradeAttendPoint' + gradeAttendPointData[i].index;
            me.$container.find('input[name=' + name + ']').val(gradeAttendPointData[i].value);
        }
    },

    formatGrateAttendByColumn: function(gradeAttendPointData, column) {
        var result = [];
        var eachColumnLength = gradeAttendPointData.length / column;
        for(var i = 0; i < eachColumnLength; i++){
            result[i] = [];
            for(var j = 0; j < column; j++){
                result[i][j] = gradeAttendPointData[j * eachColumnLength + i] ;
            }
        }
        return result;
    },

    gradeAttendPointField: function(gradeAttendPointData) {

        var field = {};
        for (var i = 0; i < gradeAttendPointData.length; i++) {
            var item = gradeAttendPointData[i];
            var name = 'gradeAttendPoint' + item.index;
            field[name] = {};
            field[name].row = '.controls';
            field[name].validators = {};
            field[name].validators.greaterThan = {};
            field[name].validators.greaterThan.value = 0;
            field[name].validators.greaterThan.message = mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0});
            field[name].validators.integer = {};
            field[name].validators.integer.message = mugrunApp.getMessage('common.validation.field.integer');
        }

        return field;
    },

    buildUpdateModuleAttendCheck: function(){
        var me = this;
        var attendCheck = attendCheckIndexController.currModuleAttendCheck;
        attendCheck.checkStartTime      = me.$container.find('select[name=checkStartTime]').val();
        attendCheck.checkEndTime        = me.$container.find('select[name=checkEndTime]').val();
        attendCheck.basicAttendPoint    = me.$container.find('input[name=basicAttendPoint]').val();
        attendCheck.regularAttendDays   = me.$container.find('input[name=regularAttendDays]').val();
        attendCheck.regularAttendPoint  = me.$container.find('input[name=regularAttendPoint]').val();
        attendCheck.viewDays            = me.$container.find('input[name=viewDays]').val();
        attendCheck.viewCount           = me.$container.find('input[name=viewCount]').val();
        attendCheck.greeting            = me.$container.find('textarea[name=greeting]').val();

        var newGradeAttendPoint = me.currGradeAttendPoint;
        for (var i = 0; i < newGradeAttendPoint.length; i++) {
            var name = 'gradeAttendPoint' + newGradeAttendPoint[i].index;
            var newPoint = me.$container.find('input[name=' + name + ']').val();
            newGradeAttendPoint[i].value = newPoint;

        }
        attendCheck.gradeAttendPoint = JSON.stringify(newGradeAttendPoint);
        return attendCheck;
    },

    validateCheckTime: function(){
        var me = this;
        var checkEndTime = me.$container.find('select[name=checkEndTime]').val();
        var checkStartTime = me.$container.find('select[name=checkStartTime]').val();

        if(checkEndTime == '' && checkStartTime != '') {
            me.$container.find('#end-time-msg').text(mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: checkStartTime}));
            return false;
        } else if(checkStartTime == '' && checkEndTime != '') {
            me.$container.find('#end-time-msg').text(siteAdminApp.getMessage('attend.check.select.check.start.time'));
            return false;
        } else if(checkStartTime != '' && checkEndTime != '') {
            var checkEndTimeInt = checkEndTime.split(':')[0];
            var checkStartTimeInt = checkStartTime.split(':')[0];
            if (checkEndTimeInt <= checkStartTimeInt) {
                me.$container.find('#end-time-msg').text(mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: checkStartTime}));
                return false;
            } else {
                me.$container.find('#end-time-msg').text('');
                return true;
            }
        }

        me.$container.find('#end-time-msg').text('');
        return true;
    }

});

var attendCheckSettingController = new AttendCheckSettingController('#container-attendance-check-setting');

(function ($) {
    $.extend(jQuery.tmpl.tag, {
        "for": {
            _default: {$2: "var i=1;i<=1;i++"},
            open: 'for ($2){',
            close: '};'
        }
    });
})(jQuery);

