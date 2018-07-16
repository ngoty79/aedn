(function ($) {
    var MessageBoardModuleController = function (selector) {
        this.init(selector);
    };

    $.extend(MessageBoardModuleController.prototype, {
        $container: null,
        oEditors: [],

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.tableBoardListAction                = me.$container.find('#table-board-list-action');
            me.tableBoardList                      = me.$container.find('#table-board-list');
            me.containerPostManagement             = me.$container.find('#container-post-management');
            me.containerBoardSettings              = me.$container.find('#container-board-settings');
            me.containerContentManagement          = me.$container.find('#container-content-management');
            me.containerBackupManagement           = me.$container.find('#container-backup-management');
            me.containerTrashcanManagement         = me.$container.find('#container-trashcan-management');
            me.containerTablePostList              = me.$container.find('#container-table-post-list');
            me.containerTableAttachmentList        = me.$container.find('#container-table-attachment-list');
            me.colorPickerModal                    = me.$container.find('#color-picker-modal');
            me.tablePostList                       = me.containerTablePostList.find('#table-post-list');
            me.tableAttachmentList                 = me.containerTableAttachmentList.find('#table-attachment-list');
            me.$formUpdateSettings                 = me.containerBoardSettings.find('#form-board-settings');
            me.tableHeadings                       = me.containerBoardSettings.find('#table-subject-line-list');
            me.tableSubjectTemplate                = me.containerBoardSettings.find('.table-subject');
            me.tableSubject1                       = me.containerBoardSettings.find('#table-subject-position-1');
            me.tableSubject2                       = me.containerBoardSettings.find('#table-subject-position-2');
            me.tableSubject3                       = me.containerBoardSettings.find('#table-subject-position-3');
            me.tableSubject4                       = me.containerBoardSettings.find('#table-subject-position-4');
            me.tableSubject5                       = me.containerBoardSettings.find('#table-subject-position-5');
            me.tablePermissionSettings             = me.containerContentManagement.find('#table-permission-settings');
            me.tableBackupList                     = me.containerBackupManagement.find('#table-backup-list');
            me.tableTrashcanList                   = me.containerTrashcanManagement.find('#table-trashcan-list');
            me.$modalAddModuleBoard                = me.$container.find('#modal-board-addModule');
            me.$formAddModuleBoard                 = me.$container.find('#form-board-addModule');
            me.$tabs                               = me.$container.find('#tabs-boardIndex');
            me.$contentContainer                   = me.$container.find('#container-boardIndex-contents');

            me.tableHeadingsItemDeleted = [];
            me.tableSubjectItemDeleted1 = [];
            me.tableSubjectItemDeleted2 = [];
            me.tableSubjectItemDeleted3 = [];
            me.tableSubjectItemDeleted4 = [];
            me.tableSubjectItemDeleted5 = [];

            me.initBootstrapTable();
            me.initEventHandlers();
            me.checkInputSearchBoard();
            me.checkInputSearchBackup();
            me.initFormValidation();
            me.initSmartEditor();

            setTimeout(function(){
                me.getFirstBoardOfList();
            }, 500);

        },

        initFormValidation: function() {
            var me = this;

            me.$formAddModuleBoard.formValidation({
                framework: 'bootstrap',
                icon: {
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    'moduleTitle': {
                        row: '.controls',
                        validators: {
                            notEmpty: {},
                            stringLength: {
                                max: 256,
                                message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 256})
                            }
                        }
                    },
                    moduleDesc: {
                        row: '.controls',
                        validators: {
                            stringLength: {
                                max: 1024,
                                message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 1024})
                            }
                        }
                    }
                }
            });

            me.$formUpdateSettings.formValidation({
                framework: 'bootstrap',
                icon: {
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    'moduleTitle': {
                        row: '.settings-name-input-column',
                        validators: {
                            notEmpty: {},
                            stringLength: {
                                max: 256,
                                message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 256})
                            }
                        }
                    },
                    moduleDesc: {
                        row: '.settings-description-input',
                        validators: {
                            stringLength: {
                                max: 1024,
                                message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 1024})
                            }
                        }
                    },
                    'limitAttachFileSize': {
                        row: '.col-md-6.col-sm-6.col-xs-6',
                        validators: {
                            lessThan: {
                                value: 10240,
                                message: siteAdminApp.getMessage('board.contents.limit.file.size', {maxSize: 10240})
                            }
                        }
                    },
                    'newBasisDays': {
                        row: '.col-md-6.col-sm-6.col-xs-6',
                        validators: {
                            lessThan: {
                                value: 7,
                                message: siteAdminApp.getMessage('board.contents.limit.basic.day', {maxDay: 7})
                            }
                        }
                    }
                }
            });
        },

        setContentManagementTopBottomHtml: function(board){
            var me = this;

            if (board.bdTopHtml == null) {
                me.oEditors.getById['bdTopHtml'].setIR('');
            } else {
                me.oEditors.getById['bdTopHtml'].setIR(board.bdTopHtml);
            }

            if (board.bdBottomHtml == null) {
                me.oEditors.getById['bdBottomHtml'].setIR('');
            } else {
                me.oEditors.getById['bdBottomHtml'].setIR(board.bdBottomHtml);
            }
        },
        openBoardEditor: function(row) {
            var me = this,
                moduleNo = null;
            if(row){
                me.$modalAddModuleBoard.find('.modal-title').text('게시판 수정');
            }else{
                me.$modalAddModuleBoard.find('.modal-title').text('게시판 추가');
            }
            me.$formAddModuleBoard.find('input[name=moduleNo]').val('');
            me.$formAddModuleBoard[0].reset();

            if(row) {
                moduleNo = row.moduleNo;
                me.$formAddModuleBoard.find('input[name=moduleNo]').val(row.moduleNo);
                me.$formAddModuleBoard.find('input[name=moduleTitle]').val(row.moduleTitle);
                me.$formAddModuleBoard.find('textarea[name=moduleDesc]').val(row.moduleDesc);
            }


            me.validateModuleEditor(moduleNo);
            me.$modalAddModuleBoard.removeClass('hide');
            me.$modalAddModuleBoard.modal({backdrop: 'static', show: true});
        },
        validateModuleEditor: function(moduleNo) {
            var me = this;
            if(me.$formAddModuleBoard.data('formValidation')) {
                me.$formAddModuleBoard.data('formValidation').destroy();
            }
            me.$formAddModuleBoard.formValidation({
                framework: 'bootstrap',
                icon: {
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    'moduleTitle': {
                        row: '.controls',
                        validators: {
                            notEmpty: {
                                message: '게시판명을 입력하여 주세요.'
                            },
                            stringLength: {
                                max: 256,
                                message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 256})
                            },
                            remote: {
                                url: '/admin/board/checkModuleTile.json',
                                type: "POST",
                                data: function(validator, $field, value) {
                                    return {
                                        moduleTitle: value,
                                        moduleNo: moduleNo
                                    }
                                },
                                delay: 500,
                                message: '이미 등록된 게시판명입니다 다시 입력하여 주세요.'
                            }
                        }
                    },
                    moduleDesc: {
                        row: '.controls',
                        validators: {
                            stringLength: {
                                max: 1024,
                                message: mugrunApp.getMessage('common.validation.field.maxlength', {maxLength: 1024})
                            }
                        }
                    }
                }
            });
        },

        initEventHandlers: function() {
            var me = this;

            me.tableBoardList.on('click', 'tbody > tr', function (e) {
                if(e.target.type != 'checkbox') {
                    me.tableBoardList.find('input.checkbox-item:checked').click();
                    jQuery(e.currentTarget).find('input').click();
                    var moduleNo = $(this).find('div.moduleNo').text();
                    me.currModuleNo = moduleNo;
                    me.getDetailBoard(moduleNo);
                }
            });

            me.tableBoardList.on('click', 'tbody > tr .btn-edit', function (e) {
                me.openBoardEditor(me.tableBoardList.bootstrapTable('getRowByUniqueId', $(this).data('no')));
            });

            me.tableBoardListAction.on('click', 'button#btn-select-all-board', function (e) {
                e.preventDefault();
                var itemNotCheck = me.tableBoardList.find('input.checkbox-item:not(:checked)');
                if(itemNotCheck.length == 0) {
                    me.$container.find('input.checkbox-item').click();
                } else {
                    itemNotCheck.click();
                }
            });

            me.tableBoardListAction.on('click', 'button#btn-delete-board', function (e) {
                e.preventDefault();
                var allItem = me.tableBoardList.find('input.checkbox-item:checked');
                var allModuleNo = [];
                $.each(allItem, function(i, item){
                    allModuleNo.push($(item).attr('data-value'));
                });
                if(allModuleNo.length > 0) {
                    var title = mugrunApp.getMessage('common.btn.delete');
                    var message = siteAdminApp.getMessage('board.delete.message');
                    var type = BootstrapDialog.TYPE_WARNING;
                    var textCancelLabel = mugrunApp.getMessage('common.btn.cancel');
                    var textOKLabel = mugrunApp.getMessage('common.btn.ok');
                    var buttonOKClass = 'green';
                    var buttonCancelClass = 'btn-outline green';
                    var callbackFunc = me.deleteBoard;
                    var paramsForCallbackFunc = allModuleNo;
                    mugrunApp.showConfirmDialog(title, message, type, textOKLabel, textCancelLabel , buttonCancelClass, buttonOKClass, undefined, undefined,  callbackFunc, paramsForCallbackFunc);
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.delete.no.selection'));
                }
            });

            me.tableBoardListAction.on('click', 'button#btn-add-board', function (e) {
                e.preventDefault();
                me.openBoardEditor(null);
                //me.$formAddModuleBoard.find('input[name="moduleNo"]').val('');
                //me.$formAddModuleBoard.find('input[name=moduleTitle]').val('');
                //me.$formAddModuleBoard.find('textarea[name=moduleDesc]').val('');
                //me.$modalAddModuleBoard.removeClass('hide');
                //me.$modalAddModuleBoard.modal({backdrop: 'static', show: true});
            });

            me.$modalAddModuleBoard.on('click', 'button#btn_addModule-save', function (e) {
                e.preventDefault();
                me.addModuleBoard();
            });

            me.tableBoardListAction.find('#text-search-board').keydown(function (event) {
                setTimeout(function () {
                    me.checkInputSearchBoard();
                    me.loadBoardList(true);
                }, 1);
            });

            me.tableBoardListAction.on('click', '#search-clear', function(e){
                e.preventDefault();
                me.tableBoardListAction.find('#text-search-board').val("");
                //me.loadBoardList(true);
                me.tableBoardListAction.find('#search-clear').addClass('hide');
            });

            me.tableBoardListAction.on('click', 'i#btn-search-board', function (e) {
                e.preventDefault();
                me.loadBoardList(true);
            });

            me.tablePostList.on('change', 'select', function(e){
                var ele = e.currentTarget;
                var openYn = ele.options[ele.selectedIndex].value;
                var contentNo = $(ele).attr('data-value');
                var boardContent = { contentNo: contentNo, openYn : openYn };
                me.updateBoardContentItem(boardContent);
            });

            me.containerPostManagement.on('click', '#btn-attachment-management', function(e){
                e.preventDefault();
                me.containerTablePostList.addClass('hide');
                me.containerTableAttachmentList.removeClass('hide');
            });

            me.containerPostManagement.on('click', '#btn-download-post', function(e){
                e.preventDefault();
                var url = '/admin/board/download-excel?moduleNo=' + me.currModuleNo;
                window.open(url, '_blank');
            });

            me.containerPostManagement.on('click', '#btn-post-management', function(e){
                e.preventDefault();
                me.containerTableAttachmentList.addClass('hide');
                me.containerTablePostList.removeClass('hide');
            });

            me.containerPostManagement.on('click', '#btn-delete-selected-post, #btn-delete-selected-post-2', function(e){
                e.preventDefault();

                if(me.containerTableAttachmentList.hasClass('hide')){
                    var url = '/admin/board/content/delete/selection';
                    me.deleteSelectedItem(me.tablePostList, me.getSelectedContentNo, url, me.deletePost);
                } else {
                    var url = '/admin/board/attachment/delete/selection';
                    me.deleteSelectedItem(me.tableAttachmentList, me.getSelectedFileNo, url, me.deleteAttachment);
                }

            });

            me.containerPostManagement.on('click', '#btn-delete-all-post, #btn-delete-all-post-2', function(e){
                e.preventDefault();
                var url = '';
                var calback;

                if(me.containerTableAttachmentList.hasClass('hide')){
                    url = '/admin/board/content/delete/all';
                    calback = me.deletePost;
                } else {
                    url = '/admin/board/attachment/delete/all';
                    calback = me.deleteAttachment;
                }

                var cancel = mugrunApp.getMessage('common.btn.cancel');
                var ok = mugrunApp.getMessage('common.btn.ok');
                var message = mugrunApp.getMessage('common.confirm.all.delete');
                var title = mugrunApp.getMessage('common.btn.delete');
                BootstrapDialog.show({
                    title: title,
                    message: message,
                    buttons: [{
                        label: ok,
                        cssClass: 'green',
                        action: function(dialogRef) {
                            dialogRef.close();
                            me.alertInputPassword(url, undefined, calback);
                        }
                    }, {
                        label: cancel,
                        cssClass: 'btn-outline green',
                        action: function(dialogRef) {
                            dialogRef.close();
                        }
                    }]
                });
            });

            me.containerBoardSettings.on('click', '#btn-delete-new-post-icon', function(e){
                e.preventDefault();
                me.containerBoardSettings.find('#text-search-new-post-icon').val("");
                me.containerBoardSettings.find('#file-post-icon').val('')
            });

            me.containerBoardSettings.on('click', '#btn-search-new-post-icon', function(e){
                e.preventDefault();
                me.containerBoardSettings.find('#file-post-icon').click();
            });

            me.containerBoardSettings.on('change', '#file-post-icon', function(e){
                e.preventDefault();
                var arr = this.value.split('\\');
                var fileName = '';
                if(arr.length > 0) {
                    fileName = arr[arr.length - 1];
                }
                me.containerBoardSettings.find('#text-search-new-post-icon').val(fileName);
            });

            me.containerBoardSettings.on('click', '#board-settings-update', function(e){
                e.preventDefault();
                var formValidation = me.$formUpdateSettings.data('formValidation');

                formValidation.validate();
                if (!formValidation.isValid()) {
                    return;
                } else {
                    var board = me.buildBoardSettings();
                    board = me.buildSettingsHeadingSubject(board);
                    var file = me.containerBoardSettings.find('input#file-post-icon')[0].files[0];
                    if(file) {
                        me.uploadBoardSettingsFile(file, board);
                    } else {
                        me.updateBoardSettings(board);
                    }
                }
            });

            me.colorPickerModal.find('#selectColor').minicolors({position: 'bottom right'});
            me.tableHeadings.on('click','.select-color', function(e){
                e.preventDefault();
                me.openColorPickerModal(e);
            });

            me.containerBoardSettings.on('click', '#add-subject-line', function(e){
                e.preventDefault();
                var headingTitle = me.containerBoardSettings.find('#text-subject-line').val();
                if(headingTitle != '') {
                    var row = me.tableHeadings.bootstrapTable('getRowByUniqueId', headingTitle);
                    if (row == null) {
                        me.tableHeadings.bootstrapTable('insertRow', {
                            index: 0,
                            row: {
                                headingTitle: headingTitle,
                                headingTitleColor: ''
                            }
                        });
                        me.containerBoardSettings.find('#text-subject-line').val('');
                    }
                }
            });

            me.tableHeadings.on('click', '.box-remove-item', function(e){
                e.preventDefault();
                me.removeRowTableById(e, me.tableHeadings, me.tableHeadingsItemDeleted, 'headingNo');
            });

            me.tableHeadings.on('change', 'input.box-input-title', function(e){
                e.preventDefault();
                var headingTitleOld = $(e.target).attr('value');
                var headingTitleNew = e.currentTarget.value;
                me.tableHeadings.bootstrapTable('updateByUniqueId', {
                    id: headingTitleOld,
                    row: {
                        headingTitle: headingTitleNew,
                        modified: true
                    }
                });
            });

            me.tableHeadings.on('change', 'input.box-input-title-color', function(e){
                e.preventDefault();
                var headingTitle = $(e.target).parent().prev().find('input').attr('value');
                var headingTitleColor = e.currentTarget.value;
                me.tableHeadings.bootstrapTable('updateByUniqueId', {
                    id: headingTitle,
                    row: {
                        headingTitleColor: headingTitleColor,
                        modified: true
                    }
                });
            });

            me.colorPickerModal.on('hidden.bs.modal', function () {
                var selectColor = me.colorPickerModal.find('#selectColor').val();
                me.selectTitleRow.val(selectColor);
                me.selectTitleRow.trigger('change');
                console.log(selectColor);
            });

            me.initEventTableSubject(me.tableSubject1, '#add-subject-position-1', '#subject-position-1', me.tableSubjectItemDeleted1, 1);
            me.initEventTableSubject(me.tableSubject2, '#add-subject-position-2', '#subject-position-2', me.tableSubjectItemDeleted2, 2);
            me.initEventTableSubject(me.tableSubject3, '#add-subject-position-3', '#subject-position-3', me.tableSubjectItemDeleted3, 3);
            me.initEventTableSubject(me.tableSubject4, '#add-subject-position-4', '#subject-position-4', me.tableSubjectItemDeleted4, 4);
            me.initEventTableSubject(me.tableSubject5, '#add-subject-position-5', '#subject-position-5', me.tableSubjectItemDeleted5, 5);

            me.containerContentManagement.on('click', '#board-contents-update', function(e){
                e.preventDefault();
                var board = me.buildBoardContents();
                me.updateBoardContents(board);
            });

            me.tablePermissionSettings.on('click', '.check-list, .check-read, .check-write, .check-modify,' +
            ' .check-delete, .check-reply, .check-comment', function(e){
                var id = $(e.currentTarget).attr('data-value');
                var field = $(e.currentTarget).attr('class').split('-')[1];
                var rowObj = {};

                if(e.currentTarget.checked == true) {
                    rowObj[field] = true;
                } else {
                    rowObj[field] = false;
                }
                me.tablePermissionSettings.bootstrapTable('updateByUniqueId', {
                    id: id,
                    row: rowObj
                });
            });

            me.tablePermissionSettings.on('click', '.check-all-permission', function(e){
                var id = $(e.currentTarget).attr('data-value');
                var rowObj = {};
                if(e.currentTarget.checked == true) {
                    $(e.currentTarget).parent().parent().find('input:not(:checked)').click();
                    rowObj = {
                        list    : true,
                        read    : true,
                        write   : true,
                        modify  : true,
                        delete  : true,
                        reply   : true,
                        comment : true
                    };
                } else {
                    $(e.currentTarget).parent().parent().find('input:checked').click();
                    rowObj = {
                        list    : false,
                        read    : false,
                        write   : false,
                        modify  : false,
                        delete  : false,
                        reply   : false,
                        comment : false
                    };
                }

                me.tablePermissionSettings.bootstrapTable('updateByUniqueId', {
                    id: id,
                    row: rowObj
                });
            });

            me.containerBackupManagement.on('click', '#btn-backup-all-post', function(e){
                e.preventDefault();
                var rowCount = me.tableBackupList.bootstrapTable('getData').length;
                var maxCount = me.currModule.backupFileCnt;
                if(rowCount < maxCount) {
                    me.createBackup(me.currModuleNo);
                } else {
                    mugrunApp.alertMessage(siteAdminApp.getMessage('board.backup.create.over.limit', {maxCount : maxCount}));
                }
            });

            me.containerBackupManagement.find('#text-search-backup-file').keydown(function (event) {
                setTimeout(function () {
                    me.checkInputSearchBackup();
                }, 1);
            });

            me.containerBackupManagement.on('click', '#search-clear-backup-file', function(e){
                e.preventDefault();
                me.containerBackupManagement.find('#text-search-backup-file').val("");
                me.loadBackupList(me.currModuleNo);
                me.containerBackupManagement.find('#search-clear-backup-file').addClass('hide');
            });

            me.containerBackupManagement.on('click', 'i#btn-search-backup-file', function (e) {
                e.preventDefault();
                var textSearchBackupFile = me.containerBackupManagement.find('input[name="textSearchBackupFile"]').val();
                me.loadBackupList(me.currModuleNo, textSearchBackupFile);
            });

            me.containerBackupManagement.on('click', 'table#table-backup-list > tbody > tr', function (e) {
                if(e.target.type != 'checkbox' && e.target.className.indexOf('download-backup-file') == -1
                    && e.target.className.indexOf('delete-backup-file') == -1 ) {
                    me.containerBackupManagement.find('input.checkbox-item:checked').click();
                    jQuery(e.currentTarget).find('input').click();
                }
            });

            me.containerBackupManagement.on('click', '.download-backup-file', function (e) {
                var fileName = $(this).data('value');
                var url = '/admin/board/backup/download/selection?moduleNo=' + me.currModuleNo + '&fileName=' + fileName;
                window.open(url, '_blank');
            });

            me.containerBackupManagement.on('click', '.delete-backup-file', function (e) {
                var fileName = $(this).data('value');
                var listFileName = [];
                listFileName.push(fileName);
                me.deleteBackupFiles('/admin/board/backup/delete/selection', listFileName);
            });

            me.containerBackupManagement.on('click', '#btn-delete-selected-backup-file, #btn-delete-selected-backup-file-2', function(e){
                e.preventDefault();
                var allItem = me.tableBackupList.find('input.checkbox-item:checked');
                var allFileName = [];
                $.each(allItem, function(i, item){
                    allFileName.push($(item).attr('data-value'));
                });
                if(allFileName.length > 0){
                    me.deleteBackupFiles('/admin/board/backup/delete/selection', allFileName);
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.delete.no.selection'));
                }
            });

            me.containerBackupManagement.on('click', '#btn-delete-all-backup-file, #btn-delete-all-backup-file-2', function(e){
                e.preventDefault();
                //me.deleteBackupFiles('/admin/board/backup/delete/all', undefined);
                var title = mugrunApp.getMessage('common.btn.delete');
                var message = mugrunApp.getMessage('common.confirm.all.delete');
                var type = BootstrapDialog.TYPE_WARNING;
                var textCancelLabel = mugrunApp.getMessage('common.btn.cancel');
                var textOKLabel = mugrunApp.getMessage('common.btn.ok');
                var buttonOKClass = 'green';
                var buttonCancelClass = 'btn-outline green';
                var callbackFunc = me.deleteBackupFiles;
                var paramsForCallbackFunc = '/admin/board/backup/delete/all';
                mugrunApp.showConfirmDialog(title, message, type, textOKLabel, textCancelLabel , buttonCancelClass, buttonOKClass, undefined, undefined,  callbackFunc, paramsForCallbackFunc);
            });

            me.containerTrashcanManagement.on('click', '#btn-delete-selected-trashcan, #btn-delete-selected-trashcan-2', function(e){
                e.preventDefault();
                var rows = me.tableTrashcanList.bootstrapTable('getSelections');
                if(rows.length > 0) {
                    var allContentNo = me.getSelectedContentNo(rows);
                    me.deletePermanentlyPost('/admin/board/content/delete/permanent/selection', allContentNo);
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.delete.no.selection'));
                }
            });

            me.containerTrashcanManagement.on('click', '#btn-delete-all-trashcan, #btn-delete-all-trashcan-2', function(e){
                e.preventDefault();
                //me.deletePermanentlyPost('/admin/board/content/delete/permanent/all', undefined);
                var title = mugrunApp.getMessage('common.btn.delete');
                var message = mugrunApp.getMessage('common.confirm.all.delete');
                var type = BootstrapDialog.TYPE_WARNING;
                var textCancelLabel = mugrunApp.getMessage('common.btn.cancel');
                var textOKLabel = mugrunApp.getMessage('common.btn.ok');
                var buttonOKClass = 'green';
                var buttonCancelClass = 'btn-outline green';
                var callbackFunc = me.deletePermanentlyPost;
                var paramsForCallbackFunc = '/admin/board/content/delete/permanent/all';
                mugrunApp.showConfirmDialog(title, message, type, textOKLabel, textCancelLabel , buttonCancelClass, buttonOKClass, undefined, undefined,  callbackFunc, paramsForCallbackFunc);
            });

            me.containerTrashcanManagement.on('click', '#btn-restore-selected-trashcan, #btn-restore-selected-trashcan-2', function(e){
                e.preventDefault();
                var rows = me.tableTrashcanList.bootstrapTable('getSelections');
                if(rows.length > 0) {
                    var allContentNo = me.getSelectedContentNo(rows);
                    me.recoveryPost('/admin/board/content/recovery/selection', allContentNo);
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.recover.no.selection'));
                }
            });

            me.containerTrashcanManagement.on('click', '#btn-restore-all-trashcan, #btn-restore-all-trashcan-2', function(e){
                e.preventDefault();
                //me.recoveryPost('/admin/board/content/recovery/all', undefined);
                var title = mugrunApp.getMessage('common.btn.recover');
                var message = mugrunApp.getMessage('common.confirm.all.recover');
                var type = BootstrapDialog.TYPE_WARNING;
                var textCancelLabel = mugrunApp.getMessage('common.btn.cancel');
                var textOKLabel = mugrunApp.getMessage('common.btn.ok');
                var buttonOKClass = 'green';
                var buttonCancelClass = 'btn-outline green';
                var callbackFunc = me.recoveryPost;
                var paramsForCallbackFunc = '/admin/board/content/recovery/all';
                mugrunApp.showConfirmDialog(title, message, type, textOKLabel, textCancelLabel , buttonCancelClass, buttonOKClass, undefined, undefined,  callbackFunc, paramsForCallbackFunc);
            });


            me.$tabs.on('click', 'a#tab-boardIndex-contentMnt', function(e){
                e.preventDefault();

                me.setContentManagementTopBottomHtml(me.currModule);
            });
        },

        initEventTableSubject: function(tableSubject, iconAddsubject, titleSubject, itemsDeleted, positionNo){
            var me = this;

            tableSubject.on('click','.select-color', function(e){
                e.preventDefault();
                me.openColorPickerModal(e);
            });

            me.containerBoardSettings.on('click', iconAddsubject, function(e){
                e.preventDefault();
                me.addRowToTableSubject(titleSubject, tableSubject, positionNo)
            });

            tableSubject.on('click', '.box-remove-item', function(e){
                e.preventDefault();
                me.removeRowTableById(e, tableSubject, itemsDeleted, 'subjectNo');
            });

            tableSubject.on('change', 'input.box-input-title', function(e){
                e.preventDefault();
                var subjectTitleOld = $(e.target).attr('value');
                var subjectTitleNew = e.currentTarget.value;
                tableSubject.bootstrapTable('updateByUniqueId', {
                    id: subjectTitleOld,
                    row: {
                        subjectTitle: subjectTitleNew,
                        modified: true
                    }
                });
            });

            tableSubject.on('change', 'input.box-input-title-color', function(e){
                e.preventDefault();
                var subjectTitle = $(e.target).parent().prev().find('input').attr('value');
                var subjectTitleColor = e.currentTarget.value;
                tableSubject.bootstrapTable('updateByUniqueId', {
                    id: subjectTitle,
                    row: {
                        subjectTitleColor: subjectTitleColor,
                        modified: true
                    }
                });
            });
        },

        initBootstrapTable : function(){
            var me = this;
            me.tableBoardList.bootstrapTable({
                height: 598,
                url: '/admin/board/list.json',
                smartDisplay: false,
                showHeader:false,
                pageSize: 15,
                pagination: true,
                uniqueId: 'moduleNo',
                sidePagination: 'server',
                queryParamsType: '',
                paginationHAlign: 'center',
                queryParams: function(params) {
                    return params;
                },
                columns: [
                    {
                        cellStyle: function(value, row, index) {
                            return {
                                classes: 'checkbox-item'
                            }
                        },
                        formatter: function(value,object){
                            return '<input type="checkbox" class="checkbox-item" data-value="' + object.moduleNo + '">';
                        }
                    },
                    {
                        field: 'moduleNameNo',
                        title: 'Name',
                        formatter: function(value,object){
                            return '<i class="fa fa-file"></i> <span>'+ object.moduleTitle + ' (' + object.moduleNo + ') ' + '</span>';
                        }
                    },
                    {
                        field: 'moduleNo',
                        title: 'Module No',
                        formatter: function(value,object){
                            return ' <div class="moduleNo">' + object.moduleNo + '</div>';
                        }
                    },
                    {
                        field: 'edit',
                        align: 'center',
                        formatter: function(value,object){
                            return'<div class="text-align-right padding-right-5">' +
                                '<i class="inline glyphicon glyphicon-pencil btn-edit pointer-click-icon" data-no="'+object.moduleNo+'">' +
                                '</i></div>';
                        }
                    }
                ]
            });
            me.tablePostList.bootstrapTable({
                //height: 301,
                smartDisplay: false,
                clickToSelect : true,
                pagination : true,
                pageSize: 10,
                pageList: [10, 20, 50],
                checkboxHeader: true,
                uniqueId: 'contentNo',
                sidePagination: 'server',
                queryParamsType: '',
                queryParams: function(params) {
                    return params;
                },
                columns: [
                    {
                        checkbox: true,
                        width: '5%'
                    },
                    {
                        field: 'contentNo',
                        title: '번호',
                        width: '10%',
                        sortable: true,
                        formatter: function(value,object){
                            return ' <div class="contentNo">' + object.contentNo + '</div>';
                        }
                    },
                    {
                        field: 'title',
                        title: '제목',
                        width: '35%',
                        sortable: true
                    },
                    {
                        field: 'regUserName',
                        title: '작성자',
                        width: '10%',
                        sortable: true
                    },
                    {
                        field: 'regDateStr',
                        title: '작성일',
                        width: '10%',
                        sortable: true
                    },
                    {
                        field: 'modDateStr',
                        title: '수정일',
                        width: '10%',
                        sortable: true
                    },
                    {
                        field: 'viewCnt',
                        title: '조회수',
                        width: '5%',
                        align: 'center',
                        sortable: true
                    },
                    {
                        field: 'recommendCnt',
                        title: '추천',
                        width: '5%',
                        align: 'center',
                        sortable: true
                    },
                    {
                        field: 'openYn',
                        title: '공개여부',
                        formatter: function(value,object){
                            var $select = $([
                                '<select data-container="body" data-live-search="true" data-value="' + object.contentNo + '">',
                                '<option value="1"> 공개</option>',
                                '<option value="2"> 비공개</option>',
                                '</select>'
                            ].join(''));
                            $select.find('option[value="' + object.openYn + '"]').attr('selected', 'selected');
                            return $('<div/>').append($select).html();
                        },
                        width: '10%'
                    }
                ]
            });
            me.tableAttachmentList.bootstrapTable({
                //height: 301,
                smartDisplay: false,
                clickToSelect : true,
                pagination : true,
                pageSize: 10,
                pageList: [10, 20, 50],
                checkboxHeader: true,
                uniqueId: 'siteFileNo',
                sidePagination: 'server',
                queryParamsType: '',
                queryParams: function(params) {
                    return params;
                },
                columns: [
                    {
                        name: 'select',
                        checkbox: true,
                        width: '5%'
                    },
                    {
                        field: 'siteFileNo',
                        title: '파일 제목',
                        formatter: function(value,object){
                            return ' <div class="siteFileNo">' + object.siteFileNo + '</div>';
                        },
                        width: '5%',
                        sortable: true
                    },
                    {
                        field: 'originalFileName',
                        title: '파일 제목',
                        width: '15%',
                        sortable: true
                    },
                    {
                        field: 'postTitle',
                        title: '게시물 제목',
                        width: '35%',
                        sortable: true
                    },
                    {
                        field: 'fileSize',
                        title: '크기',
                        width: '10%',
                        align: 'center',
                        formatter: function(value,object){
                            return mugrunApp.formatNumber(value) + ' KB';
                        },
                        sortable: true
                    },
                    {
                        field: 'regUserName',
                        title: '작성자',
                        width: '10%',
                        sortable: true
                    },
                    {
                        field: 'regDateStr',
                        title: '작성일',
                        width: '10%',
                        sortable: true
                    },
                    {
                        field: 'modDateStr',
                        title: '수정일',
                        width: '10%',
                        sortable: true
                    }
                ]
            });

            me.tableHeadings.bootstrapTable({
                height: 100,
                pageSize: 3,
                pageList: [3, 5, 10, 25, 50, 100],
                showHeader: false,
                classes : 'table',
                uniqueId: 'headingTitle',
                columns: [
                    {
                        width: '104px',
                        field: 'headingTitle',
                        formatter: function(value,row){
                            return '<input type="text" class="input-sm box-input-title" value="' + row.headingTitle + '" />';
                        }
                    },
                    {
                        field: 'headingTitleColor',
                        formatter: function(value,row){
                            if(row.headingTitleColor != undefined && row.headingTitleColor != ''){
                                return '<input type="text" class="input-sm box-input-title-color display-none" value="' + row.headingTitleColor + '" />' +
                                    '<span class="select-color pointer-click-icon" style="background-color: ' + row.headingTitleColor +'"></span>';
                            } else {
                                return '<input type="text" class="input-sm box-input-title-color display-none" value="' + row.headingTitleColor + '" />' +
                                    '<i class="fa fa-th select-color pointer-click-icon" style="margin-top: 8px"></i>';
                            }
                        }
                    },
                    {
                        formatter: function(value,row){
                            return '<span class="glyphicon glyphicon-remove box-remove-item pointer-click-icon" data-value="' + row.headingTitle +'"></span>';
                        }
                    },
                    {
                        field: 'headingNo',
                        title: 'Heading No',
                        formatter: function(value,object){
                            return ' <div class="headingNo">' + object.headingNo + '</div>';
                        }
                    }
                ]
            });

            me.tableSubjectTemplate.bootstrapTable({
                height: 100,
                pageSize: 3,
                pageList: [3, 5, 10, 25, 50, 100],
                showHeader: false,
                classes : 'table',
                uniqueId: 'subjectTitle',
                columns: [
                    {
                        width: '104px',
                        field: 'subjectTitle',
                        formatter: function(value,row){
                            return '<input type="text" class="input-sm box-input-title" value="' + row.subjectTitle + '" />';
                        }
                    },
                    {
                        field: 'subjectTitleColor',
                        formatter: function(value,row){
                            if(row.subjectTitleColor != undefined && row.subjectTitleColor != '') {
                                return '<input type="text" class="input-sm box-input-title-color display-none" value="' + row.subjectTitleColor + '" />' +
                                    '<span class="select-color pointer-click-icon" style="background-color: ' + row.subjectTitleColor +'"></span>';
                            } else {
                                return '<input type="text" class="input-sm box-input-title-color display-none" value="' + row.subjectTitleColor + '" />' +
                                    '<i class="fa fa-th select-color pointer-click-icon" style="margin-top: 8px"></i>';
                            }
                        }
                    },
                    {
                        formatter: function(value,row){
                            return '<span class="glyphicon glyphicon-remove box-remove-item pointer-click-icon" data-value="' + row.subjectTitle +'"></span>';
                        }
                    },
                    {
                        field: 'subjectNo',
                        title: 'Subject No',
                        formatter: function(value,object){
                            return ' <div class="subjectNo">' + object.subjectNo + '</div>';
                        }
                    }
                ]
            });

            me.tablePermissionSettings.bootstrapTable({
                //height: 203,
                smartDisplay: false,
                pagination : true,
                pageSize: 5,
                pageList: [5, 10, 25, 50, 100],
                checkboxHeader: false,
                showHeader: false,
                uniqueId: 'userGroupNo',
                columns: [
                    {
                        field: 'userGroupNo',
                        title: '사용자',
                        width: '20%',
                        sortable: true
                    },
                    {
                        field: 'userGroup',
                        title: '사용자',
                        width: '20%',
                        sortable: true
                    },
                    {
                        field: 'allPermission',
                        title: '전체 권한',
                        formatter: function(value, object) {
                            if(object.list == 1 && object.read == 1 && object.write == 1 && object.modify == 1
                                && object.delete == 1 && object.reply == 1 && object.comment == 1 ){
                                return '<input type="checkbox" class="check-all-permission" data-value="' + object.userGroupNo + '"  checked>';
                            }
                            return '<input type="checkbox" class="check-all-permission" data-value="' + object.userGroupNo + '">';
                        },
                        width: '10%',
                        align: 'center'
                    },
                    {
                        field: 'list',
                        title: '접근 권한',
                        formatter: function(value, object) {
                            if(value == 1){
                                return '<input type="checkbox" class="check-list" data-value="' + object.userGroupNo + '" checked>';
                            }
                            return '<input type="checkbox" class="check-list" data-value="' + object.userGroupNo + '">';
                        },
                        width: '10%',
                        align: 'center'
                    },
                    {
                        field: 'read',
                        title: '본문 읽기',
                        formatter: function(value, object) {
                            if(value == 1){
                                return '<input type="checkbox" class="check-read" data-value="' + object.userGroupNo + '" checked>';
                            }
                            return '<input type="checkbox" class="check-read" data-value="' + object.userGroupNo + '">';
                        },
                        width: '10%',
                        align: 'center'
                    },
                    {
                        field: 'write',
                        title: '본문 쓰기',
                        formatter: function(value, object) {
                            if(value == 1){
                                return '<input type="checkbox" class="check-write" data-value="' + object.userGroupNo + '" checked>';
                            }
                            return '<input type="checkbox" class="check-write" data-value="' + object.userGroupNo + '">';
                        },
                        width: '10%',
                        align: 'center'
                    },
                    {
                        field: 'modify',
                        title: '본문 수정',
                        formatter: function(value, object) {
                            if(value == 1){
                                return '<input type="checkbox" class="check-modify" data-value="' + object.userGroupNo + '" checked>';
                            }
                            return '<input type="checkbox" class="check-modify" data-value="' + object.userGroupNo + '">';
                        },
                        width: '10%',
                        align: 'center'
                    },
                    {
                        field: 'delete',
                        title: '본문 삭제',
                        formatter: function(value, object) {
                            if(value == 1){
                                return '<input type="checkbox" class="check-delete" data-value="' + object.userGroupNo + '" checked>';
                            }
                            return '<input type="checkbox" class="check-delete" data-value="' + object.userGroupNo + '">';
                        },
                        width: '10%',
                        align: 'center'
                    },
                    {
                        field: 'reply',
                        title: '답글 쓰기',
                        formatter: function(value, object) {
                            if(value == 1){
                                return '<input type="checkbox" class="check-reply" data-value="' + object.userGroupNo + '" checked>';
                            }
                            return '<input type="checkbox" class="check-reply" data-value="' + object.userGroupNo + '">';
                        },
                        width: '10%',
                        align: 'center'
                    },
                    {
                        field: 'comment',
                        title: '댓글 쓰기',
                        formatter: function(value, object) {
                            if(value == 1){
                                return '<input type="checkbox" class="check-comment" data-value="' + object.userGroupNo + '" checked>';
                            }
                            return '<input type="checkbox" class="check-comment" data-value="' + object.userGroupNo + '">';
                        },
                        width: '10%',
                        align: 'center'
                    }
                ]
            });

            me.tableBackupList.bootstrapTable({
                //height: 261,
                smartDisplay: false,
                clickToSelect : true,
                pagination : true,
                pageSize: 10,
                pageList: [10, 20, 50],
                checkboxHeader: true,
                columns: [
                    {
                        cellStyle: function(value, row, index) {
                            return {
                                classes: 'checkbox-item'
                            }
                        },
                        formatter: function(value,object){
                            return '<input type="checkbox" class="checkbox-item" data-value="' + object.fileName + '">';
                        }
                    },
                    {
                        field: 'fileName',
                        title: '백업파일 이름',
                        sortable: true
                    },
                    {
                        field: 'fileSize',
                        title: '용량',
                        formatter: function(value,object){
                            return mugrunApp.formatNumber(value) + ' KB';
                        },
                        sortable: true
                    },
                    {
                        field: 'backupDateStr',
                        title: '백업 날짜',
                        sortable: true
                    },
                    {
                        title: '관리',
                        formatter: function(value,row){
                            return '<button type="button" class="btn btn-sm btn-circle btn-outline green delete-backup-file" data-value="' + row.fileName + '">삭제</button>'
                                + '<button type="button" class="btn btn-sm btn-circle btn-outline green download-backup-file" data-value="' + row.fileName + '">다운</button>';
                        }
                    }
                ]
            });

            me.tableTrashcanList.bootstrapTable({
                //height: 261,
                smartDisplay: false,
                clickToSelect : true,
                pagination : true,
                pageSize: 10,
                pageList: [10, 20, 50],
                checkboxHeader: true,
                uniqueId: 'contentNo',
                sidePagination: 'server',
                queryParamsType: '',
                queryParams: function(params) {
                    return params;
                },
                columns: [
                    {
                        checkbox: true,
                        width: '5%'
                    },
                    {
                        field: 'contentNo',
                        title: '번호',
                        formatter: function(value,object){
                            return ' <div class="contentNo">' + object.contentNo + '</div>';
                        },
                        width: '10%',
                        sortable: true
                    },
                    {
                        field: 'title',
                        title: '제목',
                        width: '35%',
                        sortable: true
                    },
                    {
                        field: 'regUserName',
                        title: '만든 사람',
                        sortable: true
                    },
                    {
                        field: 'regDateStr',
                        title: '만든 날짜',
                        sortable: true
                    },
                    {
                        field: 'viewCnt',
                        title: '조회수',
                        sortable: true
                    },
                    {
                        field: 'recommendCnt',
                        title: '추천',
                        sortable: true
                    }
                ]
            });

        },

        loadBoardList: function(loadFirstBoard) {
            var me = this;

            var field = me.tableBoardListAction.find('select[name="fieldSearchBoard"]').val();
            var keyword = me.tableBoardListAction.find('input[name="textSearchBoard"]').val();
            var url = '/admin/board/list.json?field=' + field + '&keyword=' + keyword;
            me.tableBoardList.bootstrapTable('refresh', {url: url});

            if (loadFirstBoard) {
                me.getFirstBoardOfList();
            }
        },

        getFirstBoardOfList: function() {
            var me = this;

            var field = me.tableBoardListAction.find('select[name="fieldSearchBoard"]').val();
            var keyword = me.tableBoardListAction.find('input[name="textSearchBoard"]').val();
            var url = '/admin/board/list/first.json';
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                data: {
                    pageNumber:1,
                    pageSize:15,
                    field: field,
                    keyword: keyword
                },
                success: function(data) {
                    if (data.success) {
                        var board = data.data;
                        if(board != null){
                            me.$contentContainer.removeClass('hide');
                            me.currModule = board;
                            me.currModuleNo = board.moduleNo;
                            me.getDetailBoard(board.moduleNo);
                            if(me.tableBoardList.find('input.checkbox-item[data-value=' + board.moduleNo + ']').length > 0){
                                me.tableBoardList.find('input.checkbox-item[data-value=' + board.moduleNo + ']')[0].click()
                            }
                        } else {
                            me.$contentContainer.addClass('hide');
                        }
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

        loadBoardPostList: function(moduleNo) {
            var me = this;

            var url = '/admin/board/content/list.json?moduleNo=' + moduleNo;
            me.tablePostList.bootstrapTable('refresh', {url: url});

        },

        loadAttachmentList: function(moduleNo) {
            var me = this;

            var url = '/admin/board/attachment/list.json?moduleNo=' + moduleNo;
            me.tableAttachmentList.bootstrapTable('refresh', {url: url});
        },

        loadPostDeletedList: function(moduleNo) {
            var me = this;

            var url = '/admin/board/content/deleted/list.json?moduleNo=' + moduleNo;
            me.tableTrashcanList.bootstrapTable('refresh', {url: url});
        },

        loadBackupList: function(moduleNo, searchtext) {
            var me = this;

            var data = {
                moduleNo: moduleNo
            };
            if(searchtext) {
                data.searchText = searchtext
            };

            $.ajax({
                url: '/admin/board/backup/list',
                type: 'GET',
                dataType: 'json',
                data: data,
                success: function(data) {
                    if (data.success) {
                        var backupList = data.data;

                        me.tableBackupList.find('th.bs-checkbox div div').removeClass('checker');
                        me.tableBackupList.bootstrapTable('load', backupList);
                        //me.tableBackupList.bootstrapTable('load', me.mockupDataBackupFile);

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

        deleteBackupFiles : function(url, fileNames){
            var me = messageBoardModuleController;

            var data = {
                moduleNo: me.currModuleNo
            };

            if(fileNames) {
                data.fileNames = fileNames.join(',');
            };

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                data: data,
                success: function(data) {
                    if (data.success) {
                        // load deleted post list again
                        me.loadBackupList(me.currModuleNo);
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

        createBackup: function(moduleNo) {
            var me = this;

            $.ajax({
                url: '/admin/board/backup/create',
                type: 'GET',
                dataType: 'json',
                data: {
                    moduleNo: moduleNo
                },
                success: function(data) {
                    if (data.success) {
                        // load backup list again
                        me.loadBackupList(me.currModuleNo, undefined);

                        mugrunApp.alertMessage(siteAdminApp.getMessage('board.backup.create.success'));
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

        getDetailBoard: function(moduleNo) {
            var me = this;

            $.ajax({
                url: '/admin/board/detail.json',
                type: 'GET',
                dataType: 'json',
                data: {
                    moduleNo: moduleNo
                },
                success: function(data) {
                    if (data.success) {
                        var board = data.data;
                        me.currModule = board;
                        me.currModuleNo = board.moduleNo;
                        //Post list tab
                        me.loadBoardPostList(board.moduleNo);
                        me.loadAttachmentList(board.moduleNo);

                        // Setting tab
                        me.loadBoardSettings(board);
                        me.loadSettingsHeadingSubject(board);

                        // Content tab
                        //me.setContentManagementTopBottomHtml(board);
                        me.loadContentManagement(board);

                        // backup tab
                        me.containerBackupManagement.find('#number-backup-file').text(board.backupFileCnt);
                        me.loadBackupList(board.moduleNo, undefined);

                        // trashcan tab
                        me.loadPostDeletedList(board.moduleNo);

                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    me.$container.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    me.$container.unmask();
                    if(me.oEditors.getById && me.oEditors.getById['bdTopHtml'] && typeof me.oEditors.getById['bdTopHtml'].setIR == 'function'
                        && me.oEditors.getById['bdBottomHtml'] && typeof me.oEditors.getById['bdBottomHtml'].setIR == 'function'){
                        me.setContentManagementTopBottomHtml(me.currModule);
                    }
                }
            });
        },

        loadBoardSettings: function(board){
            var me = this;
            me.containerBoardSettings.find('input[name="moduleTitle"]').val(board.moduleTitle);
            me.containerBoardSettings.find('textarea[name="moduleDesc"]').val(board.moduleDesc);
            if(board.showListType == 'L'){
                me.containerBoardSettings.find('#L').parent().click();
                me.containerBoardSettings.find('#L').click();
            } else if(board.showListType == 'A') {
                me.containerBoardSettings.find('#A').parent().click();
                me.containerBoardSettings.find('#A').click();
            } else if(board.showListType == 'F') {
                me.containerBoardSettings.find('#F').parent().click();
                me.containerBoardSettings.find('#F').click();
            }
            var checkUseAttachFile = me.containerBoardSettings.find('input[name="useAttachFile"]:checked');
            if((board.useAttachFile && checkUseAttachFile.length == 0)
                || (board.useAttachFile == false && checkUseAttachFile.length > 0)) {
                me.containerBoardSettings.find('input[name="useAttachFile"]').click();
            }
            me.containerBoardSettings.find('select[name="limitAttachFileCnt"]').val(board.limitAttachFileCnt);
            me.containerBoardSettings.find('input[name="limitAttachFileSize"]').val(board.limitAttachFileSize);
            var checkUseNew = me.containerBoardSettings.find('input[name="useNew"]:checked');
            if((board.useNew && checkUseNew.length == 0) || (board.useNew == false && checkUseNew.length > 0)) {
                me.containerBoardSettings.find('input[name="useNew"]').click();
            }
            me.containerBoardSettings.find('input[name="iconNew"]').val(board.iconNewFileName);
            me.containerBoardSettings.find('input[name="newBasisDays"]').val(board.newBasisDays);

            var checkUseHeading = me.containerBoardSettings.find('input[name="useHeading"]:checked');
            if((board.useHeading && checkUseHeading.length ==0) || (board.useHeading ==false && checkUseHeading.length > 0)) {
                me.containerBoardSettings.find('input[name="useHeading"]').click();
            }
            var checkUseCategory = me.containerBoardSettings.find('input[name="useCategory"]:checked');
            if((board.useCategory && checkUseCategory.length ==0) || (board.useCategory ==false && checkUseCategory.length >0)) {
                me.containerBoardSettings.find('input[name="useCategory"]').click();
            }
            var checkUseSecret = me.containerBoardSettings.find('input[name="useSecret"]:checked');
            if((board.useSecret && checkUseSecret.length ==0) || (board.useSecret == false && checkUseSecret.length >0)) {
                me.containerBoardSettings.find('input[name="useSecret"]').click();
            }
        },

        loadSettingsHeadingSubject: function(board){
            var me = this;

            me.tableHeadings.bootstrapTable('load', board.moduleBoardHeadings);
            me.tableSubject1.bootstrapTable('load', board.moduleBoardSubjectsPosition1);
            me.tableSubject2.bootstrapTable('load', board.moduleBoardSubjectsPosition2);
            me.tableSubject3.bootstrapTable('load', board.moduleBoardSubjectsPosition3);
            me.tableSubject4.bootstrapTable('load', board.moduleBoardSubjectsPosition4);
            me.tableSubject5.bootstrapTable('load', board.moduleBoardSubjectsPosition5);
        },

        loadContentManagement: function(board){
            var me = this;
            me.containerContentManagement.find('textarea[name="forbidAlertMsg"]').val(board.forbidAlertMsg);
            me.containerContentManagement.find('textarea[name="forbidWord"]').val(board.forbidWord);
            me.containerContentManagement.find('textarea[name="forbidFileExtension"]').val(board.forbidFileExtension);

            var permission = board.moduleBoardPermissions;
            me.tablePermissionSettings.bootstrapTable('load', permission);
        },

        buildBoardSettings: function(){
            var me = this;
            var board = {};
            board.moduleNo = me.currModuleNo;
            board.moduleTitle = me.containerBoardSettings.find('input[name="moduleTitle"]').val();
            board.moduleDesc = me.containerBoardSettings.find('textarea[name="moduleDesc"]').val();
            board.showListType = $(me.containerBoardSettings.find(':radio[name="viewType"]:checked'))[0].id;
            board.useAttachFile = 0;
            if(me.containerBoardSettings.find('input[name="useAttachFile"]:checked').length > 0){
                board.useAttachFile = 1;
            }
            board.limitAttachFileCnt = me.containerBoardSettings.find('select[name="limitAttachFileCnt"]').val();
            board.limitAttachFileSize = me.containerBoardSettings.find('input[name="limitAttachFileSize"]').val();
            board.useNew = 0;
            if(me.containerBoardSettings.find('input[name="useNew"]:checked').length > 0) {
                board.useNew = 1;
            }
            //board.iconNew = me.containerBoardSettings.find('input[name="iconNew"]').val();
            board.newBasisDays = me.containerBoardSettings.find('input[name="newBasisDays"]').val();

            board.useHeading = 0;
            if(me.containerBoardSettings.find('input[name="useHeading"]:checked').length > 0) {
                board.useHeading = 1;
            }

            board.useCategory = 0;
            if(me.containerBoardSettings.find('input[name="useCategory"]:checked').length > 0) {
                board.useCategory = 1;
            }
            board.useSecret = 0;
            if(me.containerBoardSettings.find('input[name="useSecret"]:checked').length > 0) {
                board.useSecret = 1;
            }
            return board;
        },

        buildSettingsHeadingSubject: function(board) {
            var me = this;
            var moduleBoardHeadings = me.tableHeadings.bootstrapTable('getData');
            var allHeadingItem = moduleBoardHeadings.concat(me.tableHeadingsItemDeleted);
            board.moduleBoardHeadings = allHeadingItem;

            var moduleBoardSubject1 = me.tableSubject1.bootstrapTable('getData');
            var allSubjectItem1 = moduleBoardSubject1.concat(me.tableSubjectItemDeleted1);
            board.moduleBoardSubjectsPosition1 = allSubjectItem1;

            var moduleBoardSubject2 = me.tableSubject2.bootstrapTable('getData');
            var allSubjectItem2 = moduleBoardSubject2.concat(me.tableSubjectItemDeleted2);
            board.moduleBoardSubjectsPosition2 = allSubjectItem2;

            var moduleBoardSubject3 = me.tableSubject3.bootstrapTable('getData');
            var allSubjectItem3 = moduleBoardSubject3.concat(me.tableSubjectItemDeleted3);
            board.moduleBoardSubjectsPosition3 = allSubjectItem3;

            var moduleBoardSubject4 = me.tableSubject4.bootstrapTable('getData');
            var allSubjectItem4 = moduleBoardSubject4.concat(me.tableSubjectItemDeleted4);
            board.moduleBoardSubjectsPosition4 = allSubjectItem4;

            var moduleBoardSubject5 = me.tableSubject5.bootstrapTable('getData');
            var allSubjectItem5 = moduleBoardSubject5.concat(me.tableSubjectItemDeleted5);
            board.moduleBoardSubjectsPosition5 = allSubjectItem5;

            return board;
        },

        buildBoardContents: function(){
            var me = this;
            var board = {};
            board.moduleNo = me.currModuleNo;

            board.forbidAlertMsg = me.containerContentManagement.find('textarea[name="forbidAlertMsg"]').val();
            board.forbidWord = me.containerContentManagement.find('textarea[name="forbidWord"]').val();
            board.forbidFileExtension = me.containerContentManagement.find('textarea[name="forbidFileExtension"]').val();

            board.bdTopHtml = me.oEditors.getById["bdTopHtml"].getIR();
            board.bdBottomHtml = me.oEditors.getById["bdBottomHtml"].getIR();

            // assign table permission

            board.moduleBoardPermissions = me.tablePermissionSettings.bootstrapTable('getData');

            return board;
        },

        updateBoardSettings: function(board){
            var me = this;
            $.ajax({
                method: 'POST',
                url: "/admin/board/settings/update.json",
                dataType: 'json',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(board),
                success: function(data) {
                    if (data.success) {
                        // load board list again
                        me.loadBoardList(false);
                        // load detail current board
                        me.getDetailBoard(me.currModuleNo);
                        mugrunApp.alertMessage(siteAdminApp.getMessage('board.settings.update.success'));
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

        uploadBoardSettingsFile: function(file, board){
            var me = this;
            var oMyForm = new FormData();
            oMyForm.append("file", file);
            $.ajax({
                dataType : 'json',
                url : "/admin/board/settings/upload/file/icon.json",
                data : oMyForm,
                type : "POST",
                enctype: 'multipart/form-data',
                processData: false,
                contentType:false,
                success : function(result) {
                    if (result.success) {
                        var fileNo = result.data;
                        board.iconNew = fileNo;
                        me.updateBoardSettings(board);
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                }
            });
        },

        updateBoardContents: function(board){
            var me = this;
            $.ajax({
                method: 'POST',
                url: "/admin/board/contents/update.json",
                dataType: 'json',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(board),
                success: function(data) {
                    if (data.success) {
                        // load board list again
                        me.loadBoardList(false);
                        // load detail current board
                        me.getDetailBoard(me.currModuleNo);

                        mugrunApp.alertMessage(siteAdminApp.getMessage('board.contents.update.success'));
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

        updateBoardContentItem : function(boardContent){
            var me = this;

            $.ajax({
                url: '/admin/board/content/update',
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                data: JSON.stringify(boardContent),
                success: function(data) {
                    if (data.success) {
                        me.loadBoardPostList(me.currModuleNo);
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

        deletePost : function(url, password, contentNos){
            var me = messageBoardModuleController;

            var data = {
                password: password,
                moduleNo: me.currModuleNo
            };

            if(contentNos) {
                data.contentNos = contentNos;
            };

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                data: data,
                success: function(data) {
                    if (data.success) {
                        // load post list again
                        me.loadBoardPostList(me.currModuleNo);

                        // load deleted post list again
                        me.loadPostDeletedList(me.currModuleNo);
                    } else {
                        if(data.data == false) {
                            mugrunApp.alertMessage(siteAdminApp.getMessage('board.delete.password.not.valid'));
                        } else {
                            mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                        }
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

        deleteAttachment : function(url, password, siteFileNos){
            var me = messageBoardModuleController;

            var data = {
                password: password,
                moduleNo: me.currModuleNo
            };

            if(siteFileNos) {
                data.siteFileNos = siteFileNos;
            };

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                data: data,
                success: function(data) {
                    if (data.success) {
                        // load post list again
                        me.loadAttachmentList(me.currModuleNo);

                    } else {
                        if(data.data == false) {
                            mugrunApp.alertMessage(siteAdminApp.getMessage('board.delete.password.not.valid'));
                        } else {
                            mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                        }
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

        deletePermanentlyPost : function(url, contentNos){
            var me = messageBoardModuleController;

            var data = {
                moduleNo: me.currModuleNo
            };

            if(contentNos) {
                data.contentNos = contentNos;
            };

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                data: data,
                success: function(data) {
                    if (data.success) {
                        // load deleted post list again
                        me.loadPostDeletedList(me.currModuleNo)
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

        recoveryPost : function(url, contentNos){
            var me = messageBoardModuleController;

            var data = {
                moduleNo: me.currModuleNo
            };

            if(contentNos) {
                data.contentNos = contentNos;
            };

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                data: data,
                success: function(data) {
                    if (data.success) {
                        // load post list again
                        me.loadBoardPostList(me.currModuleNo);

                        // load deleted post list again
                        me.loadPostDeletedList(me.currModuleNo);
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

        checkInputSearchBoard : function(){
            var me = this;
            me.checkInputSearch(me.tableBoardListAction, '#text-search-board', '#search-clear');
        },

        checkInputSearchBackup : function(){
            var me = this;
            me.checkInputSearch(me.containerBackupManagement, '#text-search-backup-file', '#search-clear-backup-file');
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

        getSelectedContentNo: function(rows){
            var allContentNo = rows[0].contentNo;
            if(rows.length > 1) {
                for (var i = 1; i < rows.length; i++) {
                    var item = ',' + rows[i].contentNo;
                    allContentNo += item;
                }
            }
            return allContentNo;
        },

        getSelectedFileNo: function(rows){
            var allFileNo = rows[0].siteFileNo;
            if(rows.length > 1) {
                for (var i = 1; i < rows.length; i++) {
                    var item = ',' + rows[i].allFileNo;
                    allFileNo += item;
                }
            }
            return allFileNo;
        },

        deleteSelectedItem: function(table, getPKFunc, url, nextFunc){
            var me = this;
            var rows = table.bootstrapTable('getSelections');
            if(rows.length > 0) {
                var allPKNo = getPKFunc(rows);
                me.alertInputPassword(url, allPKNo, nextFunc);
            } else {
                mugrunApp.alertMessage(mugrunApp.getMessage('common.delete.no.selection'));
            }
        },

        alertInputPassword: function(url, allPKNo, callback){
            var cancel = mugrunApp.getMessage('common.btn.cancel');
            var ok = mugrunApp.getMessage('common.btn.ok');
            var message = siteAdminApp.getMessage('board.your.admin.password.message');
            var title = siteAdminApp.getMessage('board.your.admin.password.title');
            BootstrapDialog.show({
                title: title,
                message: message + '<input type="password" class="form-control input-password-modal"><span class="error-msg hide">필수 입력항목 입니다.</span>',
                onshown: function(dialogRef){
                    dialogRef.getModalBody().find('input').keydown(function (event) {
                        setTimeout(function () {
                            var password = dialogRef.getModalBody().find('input').val();
                            if(password == ''){
                                dialogRef.getModalBody().find('.error-msg').removeClass('hide');
                            } else {
                                dialogRef.getModalBody().find('.error-msg').addClass('hide');
                            }
                        }, 1);
                    });
                },
                buttons: [{
                    label: ok,
                    cssClass: 'green',
                    action: function(dialogRef) {
                        var password = dialogRef.getModalBody().find('input').val();
                        if(password == ''){
                            dialogRef.getModalBody().find('.error-msg').removeClass('hide');
                        } else {
                            dialogRef.getModalBody().find('.error-msg').addClass('hide');
                            callback(url, password, allPKNo);
                            dialogRef.close();
                        }
                    }
                }, {
                    label: cancel,
                    cssClass: 'btn-outline green',
                    action: function(dialogRef) {
                        dialogRef.close();
                    }
                }]
            });
        },

        openColorPickerModal: function(e){
            var me = this;
            me.colorPickerModal.removeClass('hide');
            me.colorPickerModal.modal({backdrop: 'static', show: true});
            me.colorPickerModal.find('#selectColor').val($(e.target.parentElement).find('input').val());
            me.selectTitleRow = $(e.target.parentElement).find('input');
        },

        removeRowTableById: function(e, table, itemDeleted, primaryKey){
            var headingTitle = $(e.target).attr('data-value');
            // add to array list item deleted
            var row = table.bootstrapTable('getRowByUniqueId', headingTitle);
            if(row[primaryKey] != null) {
                row.deleted = true;
                itemDeleted.push(row);
            }
            // delete item from table
            table.bootstrapTable('removeByUniqueId', headingTitle);
        },

        addRowToTableSubject: function(textSubjectId, tableSubject, positionNo){
            var me = this;
            var subjectTitle = me.containerBoardSettings.find(textSubjectId).val();
            if(subjectTitle != '') {
                var row = tableSubject.bootstrapTable('getRowByUniqueId', subjectTitle);
                if (row == null) {
                    tableSubject.bootstrapTable('insertRow', {
                        index: 0,
                        row: {
                            subjectTitle: subjectTitle,
                            subjectTitleColor: '',
                            positionNo: positionNo
                        }
                    });
                    me.containerBoardSettings.find(textSubjectId).val('');
                }
            }
        },

        deleteBoard : function(moduleNos){
            var me = messageBoardModuleController;

            $.ajax({
                url: '/admin/board/delete',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    moduleNos: moduleNos.join(',')
                },
                success: function(data) {
                    if (data.success) {
                        mugrunApp.alertMessage(siteAdminApp.getMessage('board.delete.success'));
                        // load again
                        me.loadBoardList(true);
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

        addModuleBoard: function(){
            var me = this;

            var formValidation = me.$formAddModuleBoard.data('formValidation');
            formValidation.validate();
            if (!formValidation.isValid()) {
                return;
            } else{
                var data = {};
                data['moduleNo'] = me.$formAddModuleBoard.find('input[name=moduleNo]').val();
                data['moduleTitle'] = me.$formAddModuleBoard.find('input[name=moduleTitle]').val();
                data['moduleDesc'] = me.$formAddModuleBoard.find('textarea[name=moduleDesc]').val();

                $.ajax({
                    url: '/admin/board/createOrUpdate',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function(data) {
                        if (data.success) {
                            me.$modalAddModuleBoard.modal('hide');
                            me.loadBoardList(true);
                        } else {
                            mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                        }
                    },
                    beforeSend: function() {
                        me.$modalAddModuleBoard.find('#btn_addModule-save').prop('disabled', true);
                        me.$container.mask(mugrunApp.getMessage('common.loading'));
                    },
                    complete: function () {
                        me.$modalAddModuleBoard.find('#btn_addModule-save').prop('disabled', false);
                        me.$container.unmask();
                    }
                });
            }
        },

        initSmartEditor: function(elementId, content) {
            var me = this;

            nhn.husky.EZCreator.createInIFrame({
                oAppRef: me.oEditors,
                elPlaceHolder: 'bdTopHtml',
                sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2",
                htParams : {
                    bUseToolbar : true,
                    fOnBeforeUnload : true
                },
                fOnAppLoad : function(){
                    //me.oEditors.getById[elementId].setIR(content);
                    //me.loadBoardList(true);
                }
            });

            nhn.husky.EZCreator.createInIFrame({
                oAppRef: me.oEditors,
                elPlaceHolder: 'bdBottomHtml',
                sSkinURI: "/assets/vendors/smarteditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2",
                htParams : {
                    bUseToolbar : true,
                    fOnBeforeUnload : true
                },
                fOnAppLoad : function(){
                    //me.oEditors.getById[elementId].setIR(content);
                    //me.loadBoardList(true);
                }
            });
        }
    });

    var messageBoardModuleController = new MessageBoardModuleController('#container-boardIndex');
})(jQuery);

