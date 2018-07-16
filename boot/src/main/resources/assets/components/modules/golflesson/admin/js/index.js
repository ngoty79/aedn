var GolfLessonAdminModuleController = function (selector) {
    this.init(selector);
};

$.extend(GolfLessonAdminModuleController.prototype, {
    $container: null,
    optionEmpty: '<option value="">전체</option>',
    optionLectureTemplate: '<option value="${settingNo}">${lecturerName}</option>',
    optionSituationTemplate: '<option value="${settingNo}">${situationName}</option>',
    optionClubTemplate: '<option value="${settingNo}">${clubName}</option>',
    init: function (selector) {
        var me = this;
        me.$container = $(selector);
        me.$settingPanel = me.$container.find('#container-lesson-settings');
        me.$btnAddLecture = me.$container.find('#btn-add-golflesson-lecture');
        me.$btnAddSituation = me.$container.find('#btn-add-golflesson-situation');
        me.$btnAddClub = me.$container.find('#btn-add-golflesson-club');
        me.$tableLecture = me.$container.find('#table-golflesson-settings');
        me.$tableSituation = me.$container.find('#table-golflesson-situation');
        me.$tableClub = me.$container.find('#table-golflesson-club');
        me.$modalSetting = me.$container.find('#modal-golflesson-setting');
        me.gridUrl = '/admin/golflesson/getGolflessonSettingList.json';
        //Management Tab
        me.$formDataSearch = me.$container.find('#form-golflesson-mgr-search');
        me.$modalLessonData = me.$container.find('#modal-golflesson-data');
        me.$tableLessonData = me.$container.find('#table-golflesson-data');
        me.$btnSearchData = me.$container.find('#btn-golflesson-data-search');
        me.$btnSelectAll = me.$container.find('#btn-golflesson-data-selectAll');
        me.$btnDeleteSelection = me.$container.find('#btn-golflesson-data-deleteSelection');
        me.$btnAddLessonData = me.$container.find('#btn-golflesson-data-addLessonData');
        me.$selectProfile = me.$container.find('select[name=lecturerSettingNo]');
        me.$selectSituation = me.$container.find('select[name=situationSettingNo]');
        me.$selectClub = me.$container.find('select[name=clubSettingNo]');
        me.$selectLessonProgram = me.$container.find('select[name=lessonProgram]');
        me.$gridLessonDataUrl = '/admin/golflesson/getLessonDataList.json';

        me.initEventHandler();
        me.initBootstrapTable();
    },
    initEventHandler: function(){
        var me = this;
        me.$btnAddLecture.click(function(){
            me.openSetting('1');
        });
        me.$btnAddSituation.click(function(){
            me.openSetting('2');
        });
        me.$btnAddClub.click(function(){
            me.openSetting('3');
        });

        me.$settingPanel.on('click', 'i.delete-setting', function(){
            var params = $(this).closest('a').data();
            var settingNo = params['settingNo'];
            var type = params['type'];
            me.deleteSetting(settingNo, type);
        });

        me.$settingPanel.on('click', 'i.edit-setting', function(){
            var settingNo = $(this).closest('a').data()['settingNo'];
            me.editSetting(settingNo);
        });

        me.$modalSetting.on('click', '#btn-search-file', function (e) {
            e.preventDefault();
            me.$modalSetting.find('#file-image').trigger('click');
        });

        me.$modalSetting.on('change', '#file-image', function(e){
            e.preventDefault();
            var arr = this.value.split('\\');
            var fileName = '';
            if(arr.length > 0) {
                fileName = arr[arr.length - 1];
            }
            me.$modalSetting.find('input[name=txtFile]').val(fileName);
            me.$modalSettingForm.formValidation('revalidateField', 'txtFile');
        });

        me.$modalSetting.on('show.bs.modal', function (e) {
            me.initModalSettingEvents();
        });

        me.$modalSetting.on('hidden.bs.modal', function (e) {
            me.$modalSetting.empty();
        });

        //Management Tab
        me.$selectProfile.change(function(){
            me.changeProfile();
        });

        me.$btnSearchData.click(function(){
            me.searchLessonData();
        });

        me.$btnSelectAll.click(function(){
            me.selectAllLessonData();
        });

        me.$btnDeleteSelection.click(function(){
            me.deleteSelectedLessonData();
        });

        me.$btnAddLessonData.click(function(){
            me.addLessonData();
        });


        me.$formDataSearch.on('keypress', function(e){
            if(e.which == 13) {
                e.preventDefault();
                me.searchLessonData();
            }
        });

        me.$modalLessonData.on('show.bs.modal', function (e) {
            me.initModalDataEvents();
        });

        me.$modalLessonData.on('hidden.bs.modal', function (e) {
            me.$modalLessonData.empty();
        });

        me.$tableLessonData.on('click', 'i.delete-data', function(){
            var params = $(this).closest('a').data();
            var dataNo = params['dataNo'];
            me.deleteLessonData(dataNo);
        });

        me.$tableLessonData.on('click', 'i.edit-data', function(){
            var dataNo = $(this).closest('a').data()['dataNo'];
            me.editLessonData(dataNo);

        });
    },
    updateSettingCombobox: function(){
        var me = this;
        $.ajax({
            method: 'GET',
            url: "/admin/golflesson/getGolflessSettingListByType.json",
        }).done(function(map) {
            me.$selectProfile.empty();
            me.$selectProfile.append(me.optionEmpty);
            me.$selectProfile.append($.tmpl(me.optionLectureTemplate, map.profileList));

            me.$selectSituation.empty();
            me.$selectSituation.append(me.optionEmpty);
            me.$selectSituation.append($.tmpl(me.optionSituationTemplate, map.situationList));

            me.$selectClub.empty();
            me.$selectClub.append(me.optionEmpty);
            me.$selectClub.append($.tmpl(me.optionClubTemplate, map.clubList));
        });
    },
    initBootstrapTable : function() {
        var me = this;

        me.$tableLecture.bootstrapTable({
            showHeader: false,
            url: me.gridUrl + '?settingType=1',
            uniqueId: 'settingNo',
            height: 420,
            queryParamsType: '',
            queryParams: function(params) {
                return params;
            },
            columns: [{
                    field: 'lecturerName',
                    width: '70%',
                    cellStyle: function(value, row, index) {
                        return {
                            classes: 'row-category-name'
                        }
                    },
                    formatter: function(value,row){
                        return '<span class="control-label">' + '<i class="control-label glyphicon glyphicon-user pull-left margin-right-10" ></i>' +value +'</span>';
                    }
                },{
                    width: '30%',
                    formatter: function(value,row){
                        return '<a class="" href="javascript:void(0)" data-type="1" data-setting-no="' + row.settingNo +'">' +
                            '<i class="control-label glyphicon glyphicon-trash pull-right margin-right-10 delete-setting"></i>'
                            + '<i class="control-label glyphicon glyphicon-pencil pull-right margin-right-10 edit-setting"></i>' +
                            '</a>';
                    }
            }],
            sortable: false,
            sidePagination: 'server',
            totalRows: 100,
            pagination: true,
            pageSize: 10,
            pageList: [10],
            onLoadSuccess: function(row, element) {

            }
        });

        me.$tableSituation.bootstrapTable({
            showHeader: false,
            url: me.gridUrl + '?settingType=2',
            uniqueId: 'settingNo',
            height: 420,
            queryParamsType: '',
            queryParams: function(params) {
                return params;
            },
            columns: [{
                field: 'situationName',
                width: '70%',
                cellStyle: function(value, row, index) {
                    return {
                        classes: 'row-category-name'
                    }
                },
                formatter: function(value,row){
                    return '<span class="control-label">' + '<i class="control-label glyphicon glyphicon-list-alt pull-left margin-right-10" ></i>' +value +'</span>';
                }
            },{
                width: '30%',
                formatter: function(value,row){
                    return '<a class="" href="javascript:void(0)" data-type="2" data-setting-no="' + row.settingNo +'">' +
                        '<i class="control-label glyphicon glyphicon-trash pull-right margin-right-10 delete-setting" ></i>'
                        + '<i class="control-label glyphicon glyphicon-pencil pull-right margin-right-10 edit-setting"></i>' +
                        '</a>';
                }
            }],
            sortable: false,
            sidePagination: 'server',
            totalRows: 100,
            pagination: true,
            pageSize: 10,
            pageList: [10]
        });

        me.$tableClub.bootstrapTable({
            showHeader: false,
            url: me.gridUrl + '?settingType=3',
            uniqueId: 'settingNo',
            height: 420,
            queryParamsType: '',
            queryParams: function(params) {
                return params;
            },
            columns: [{
                field: 'clubName',
                width: '70%',
                cellStyle: function(value, row, index) {
                    return {
                        classes: 'row-category-name'
                    }
                },
                formatter: function(value,row){
                    return '<span class="control-label">' + '<i class="control-label glyphicon glyphicon-list-alt pull-left margin-right-10" ></i>' +value +'</span>';
                }
            },{
                width: '30%',
                formatter: function(value,row){
                    return '<a class="" href="javascript:void(0)" data-type="3" data-setting-no="' + row.settingNo +'">' +
                        '<i class="control-label glyphicon glyphicon-trash pull-right margin-right-10 delete-setting" ></i>'
                        + '<i class="control-label glyphicon glyphicon-pencil pull-right margin-right-10 edit-setting" ></i>' +
                        '</a>';
                }
            }],
            sortable: false,
            sidePagination: 'server',
            totalRows: 100,
            pagination: true,
            pageSize: 10,
            pageList: [10]
        });

        me.$tableLessonData.bootstrapTable({
            //showHeader: true,
            url: me.$gridLessonDataUrl,
            uniqueId: 'dataNo',
            //height: 480,
            pageSize: 10,
            pageList: [10, 20, 50],
            smartDisplay: false,
            queryParamsType: '',
            queryParams: function(params) {
                return params;
            },
            columns: [{
                name: 'select',
                title: '선택',
                checkbox: true,
                width: '5%'
            },{
                title: '레슨명',
                align: 'center',
                field: 'lessonName',
                width: '22%'
            },{
                title: '프로',
                align: 'center',
                field: 'lecturerName',
                width: '15%'
            },{
                title: '프로그램',
                align: 'center',
                field: 'lessonProgram',
                width: '20%'
            },{
                title: '상황',
                align: 'center',
                field: 'situationName',
                width: '15%'
            },{
                title: '클럽',
                align: 'center',
                field: 'clubName',
                width: '15%'
            },{
                title: '관리',
                align: 'center',
                width: '8%',
                formatter: function(value,row){
                    return '<a class="" href="javascript:void(0)" data-type="1" data-data-no="' + row.dataNo +'">' +
                        '<i class="control-label glyphicon glyphicon-pencil margin-right-10 edit-data"></i>'
                        + '<i class="control-label glyphicon glyphicon-trash delete-data"></i>' +
                        '</a>';
                }
            }],
            sortable: false,
            sidePagination: 'server',
            totalRows: 100,
            pagination: true,
            pageSize: 10,
            pageList: [10],
            onLoadSuccess: function(row, element) {

            }
        });


    },
    deleteSetting: function(settingNo, type){
        var me = this;
        BootstrapDialog.show({
            title: siteAdminApp.getMessage('common.title'),
            message: siteAdminApp.getMessage('golflesson.ask_delete_setting'),
            buttons: [{
                label: siteAdminApp.getMessage('common.ok'),
                closable: false,
                cssClass: 'btn green',
                action: function(dialog) {
                    $(this).prop('disabled', true);
                    $.ajax({
                        method: 'POST',
                        url: "/admin/golflesson/deleteSetting.json",
                        data: {
                            settingNo: settingNo
                        }
                    }).done(function(data) {

                        me.refreshTable(type);
                        dialog.close();
                        siteAdminApp.alertMessage(siteAdminApp.getMessage('common.delete.done'));
                    });
                }
            }, {
                label: siteAdminApp.getMessage('common.cancel'),
                cssClass: 'btn btn-outline green',
                action: function(dialog) {
                    dialog.close();
                }
            }]
        });
    },
    refreshTable: function(type){
        var me = this;
        if(type == '1'){
            me.$tableLecture.bootstrapTable('refresh', {url: me.gridUrl + '?settingType=1'});
        }else if(type == '2'){
            me.$tableSituation.bootstrapTable('refresh', {url: me.gridUrl + '?settingType=2'});
        }else if(type == '3'){
            me.$tableClub.bootstrapTable('refresh', {url: me.gridUrl + '?settingType=3'});
        }

        me.updateSettingCombobox();

    },
    doPaginationCenter: function(){
        var me = this;
        setTimeout(function(){
            var $pagination = $('.container-table-setting-profile').find('.fixed-table-pagination');
            var btnGroup = $pagination.find('div.pagination');
            if(btnGroup.length>0){
                var marginLeft = ($pagination.width() - btnGroup.width())/2 - 20;
                btnGroup.attr('style', 'margin-right:' + marginLeft + 'px;');
            }
        }, 500);
    },
    editSetting: function(settingNo){
        var me = this;
        me.$modalSetting.load('/admin/golflesson/loadSettingForm?settingNo=' + settingNo, function(){
            me.$modalSetting.modal({backdrop: 'static', show: true});
        })
    },
    openSetting: function(settingType){
        var me = this;

        me.$modalSetting.load('/admin/golflesson/loadSettingForm?settingType='+settingType, function(){
            me.$modalSetting.modal({backdrop: 'static', show: true});
        })
    },
    initModalSettingEvents: function(){
        var me = this;
        me.$modalSetting.find('[data-canel=true]').click(function(){
            siteAdminApp.showConfirmDialog(siteAdminApp.getMessage('golflesson.setting.cancel.confirm'), function(){
                me.$modalSetting.modal('hide');
            });
        });

        me.$modalSettingForm = me.$modalSetting.find('form');
        var settingType = me.$modalSetting.find(':hidden[name=settingType]').val();
        var fileMsg = '';
        if(settingType == '1'){
            fileMsg = siteAdminApp.getMessage('golflesson.setting.require.profileFile');
        }else if(settingType == '2'){
            fileMsg = siteAdminApp.getMessage('golflesson.setting.require.situationFile');
        }else if(settingType == '3'){
            fileMsg = siteAdminApp.getMessage('golflesson.setting.require.clubFile');
        }
        me.$modalSettingForm.formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                lecturerTitle: {
                    row: '.col-md-5',
                    validators: {
                        notEmpty: {
                            message: siteAdminApp.getMessage('golflesson.setting.require.lecturerTitle')
                        }
                    }
                },
                txtFile: {
                    row: '.col-md-5',
                    validators: {
                        notEmpty: {
                            message: fileMsg
                        }
                    }
                }
            }
        });
        me.$modalSettingForm.ajaxForm({
            beforeSubmit: function(){

            },
            success: function(esponseText, statusText, xhr, $form){
                var settingType = me.$modalSetting.find(':hidden[name=settingType]').val();
                me.refreshTable(settingType);
                me.$modalSetting.modal('hide');
                siteAdminApp.alertMessage(siteAdminApp.getMessage('common.save.done'));
            }
        });
    },
    changeProfile: function(){
        var me = this;
        me.$selectLessonProgram.empty();
        me.$selectLessonProgram.append(me.optionEmpty);
        if(me.$selectProfile.val()!= ''){
            var $option = me.$selectProfile.find('option:selected');
            var values = $option.data().lessonProgram.split(',');
            for(var i=0; i<values.length;i++){
                me.$selectLessonProgram.append('<option>' + values[i]+'</option>');
            }
        }
    },
    searchLessonData: function(){
        var me = this;
        var params = me.$formDataSearch.serialize();
        var url = me.$gridLessonDataUrl + "?" + params;
        me.$tableLessonData.bootstrapTable('refresh', {url: url});
    },
    selectAllLessonData: function(){
        var me = this;
        if(me.$btnSelectAll.attr('data-toogle') == '1'){
            me.$btnSelectAll.attr('data-toogle', '');
            me.$tableLessonData.bootstrapTable('uncheckAll');
        }else{
            me.$btnSelectAll.attr('data-toogle', '1');
            me.$tableLessonData.bootstrapTable('checkAll');
        }

    },
    deleteSelectedLessonData: function(){
        var me = this;
        var selections = me.$tableLessonData.bootstrapTable('getSelections');
        if(selections.length>0){
            var ids = [];
            for(var i=0;i<selections.length;i++){
                ids.push(selections[i].dataNo);
            }
            siteAdminApp.showConfirmDialog(siteAdminApp.getMessage('golflesson.setting.delete.data.confirm'), function(){
                $.ajax({
                    method: 'POST',
                    url: "/admin/golflesson/deleteSelectedLessonData.json",
                    data: {
                        ids: ids.join(',')
                    }
                }).done(function(data) {
                    me.searchLessonData();
                    siteAdminApp.alertMessage(siteAdminApp.getMessage('common.delete.done'));
                });
            });
        }else{
            siteAdminApp.alertMessage(siteAdminApp.getMessage('golflesson.setting.no.select.data'));
        }
    },
    deleteLessonData: function(dataNo){
        var me = this;
        siteAdminApp.showConfirmDialog(siteAdminApp.getMessage('golflesson.setting.delete.data.confirm'), function(){
            $.ajax({
                method: 'POST',
                url: "/admin/golflesson/deleteSelectedLessonData.json",
                data: {
                    ids: dataNo
                }
            }).done(function(data) {
                me.searchLessonData();
                siteAdminApp.alertMessage(siteAdminApp.getMessage('common.delete.done'));
            });
        });
    },
    addLessonData: function(){
        var me = this;
        me.$modalLessonData.load('/admin/golflesson/loadLessonDataForm?', function(){
            me.$modalLessonData.modal({backdrop: 'static', show: true});
        });
    },
    editLessonData: function(dataNo){
        var me = this;
        me.$modalLessonData.load('/admin/golflesson/loadLessonDataForm?dataNo=' + dataNo, function(){
            me.$modalLessonData.modal({backdrop: 'static', show: true});
        });
    },
    initModalDataEvents: function(){
        var me = this;
        me.initSmartEditor();

        me.$modalLessonData.find('[data-canel=true]').click(function(){
            siteAdminApp.showConfirmDialog(siteAdminApp.getMessage('golflesson.data.cancel.confirm'), function(){
                me.$modalLessonData.modal('hide');
                siteAdminApp.alertMessage(siteAdminApp.getMessage('golflesson.data.cancel.done'));
            });
        });

        me.$modalLessonData.find('#btn-lesson-iamge-search-file').click(function(e){
            e.preventDefault();
            me.$modalLessonData.find('#file-lesson-image-file').trigger('click');
        });

        me.$modalLessonData.on('change', '#file-lesson-image-file', function(e){
            e.preventDefault();
            var arr = this.value.split('\\');
            var fileName = '';
            if(arr.length > 0) {
                fileName = arr[arr.length - 1];
            }
            me.$modalLessonData.find('input[name=fileName]').val(fileName);
        });

        me.$modalLessonData.find('select[name=lecturerSettingNo]').change(function(){
            var $cbo = $(this);

            var $cboLessonProgram = me.$modalLessonData.find('select[name=lessonProgram]');
            var val = $cboLessonProgram.data()['lessonProgram'];
            $cboLessonProgram.removeAttr('data-lesson-program');
            $cboLessonProgram.empty();
            $cboLessonProgram.append(me.optionEmpty);
            if($cbo.val()!= ''){
                var $option = $cbo.find('option:selected');
                var optionData = $option.data();
                var values = [];
                if(optionData.lessonProgram != undefined){
                    values = optionData.lessonProgram.split(',');
                }

                for(var i=0; i < values.length;i++){
                    if(val == values[i]){
                        $cboLessonProgram.append('<option selected="true">' + values[i] +'</option>');
                    }else{
                        $cboLessonProgram.append('<option >' + values[i] +'</option>');
                    }

                }
            }
        });

        me.$modalLessonData.find('select[name=lecturerSettingNo]').change();

        me.$lessonDataForm = me.$modalLessonData.find('form');

        me.$lessonDataForm.formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                lessonName: {
                    row: '.col-md-5',
                    validators: {
                        notEmpty: {
                            message: siteAdminApp.getMessage('golflesson.setting.require.lecturerTitle')
                        }
                    }
                },
                movieUrl: {
                    row: '.col-md-5',
                    validators: {
                        notEmpty: {
                            message: siteAdminApp.getMessage('golflesson.setting.require.movieUrl')
                        }
                    }
                },
                minute: {
                    row: '.col-md-3',
                    validators: {
                        greaterThan: {
                            value: 0,
                            message: mugrunApp.getMessage('common.validation.field.greaterThanEqual', {value: 0})
                        }
                    }
                },
                second: {
                    row: '.col-md-3',
                    validators: {
                        between: {
                            min: 0,
                            max: 59,
                            message: mugrunApp.getMessage('common.validation.field.number.between', {min: 0, max : 59})
                        }
                    }
                }
            }
        });
        me.$lessonDataForm.ajaxForm({
            beforeSerialize: function($form, options) {
                // return false to cancel submit
                var htmlContent = me.oEditors.getById["txt-lesson-data-content"].getRawContents();
                me.$lessonDataForm.find('#txt-lesson-data-content').val(htmlContent);
            },
            beforeSubmit: function(){
                var second = me.$lessonDataForm.find('input[name=second]').val();
                var isValid = true;
                if(second != '' && parseInt(second)>59){
                    isValid = false;
                    me.$lessonDataForm.find('input[name=second]').addClass('error');
                }else{
                    me.$lessonDataForm.find('input[name=second]').removeClass('error');
                }
                if(!isValid){
                    me.$lessonDataForm.find('button[name=saveData]')
                        .removeClass('disabled')
                        .prop('disabled', false);
                }

                return isValid;
            },
            success: function(esponseText, statusText, xhr, $form){
                me.searchLessonData();
                me.$modalLessonData.modal('hide');
                siteAdminApp.alertMessage(siteAdminApp.getMessage('common.save.done'));
            }
        });
        me.$lessonDataForm.find('input.number').number(true, 0, '', '');


    },
    initSmartEditor: function() {
        var me = this;
        me.oEditors = [];
        nhn.husky.EZCreator.createInIFrame({
            oAppRef: me.oEditors,
            elPlaceHolder: 'txt-lesson-data-content',
            sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
            fCreator: "createSEditor2",
            htParams : {
                bUseToolbar : true,
                fOnBeforeUnload: true
            },
            fOnAppLoad : function(){

                me.oEditors.getById["txt-lesson-data-content"].setIR( $('#txt-lesson-data-content').val() );
            }
        });
    }


});

var GolfLessonAdminModuleController = new GolfLessonAdminModuleController('#container-admin-golflesson');

