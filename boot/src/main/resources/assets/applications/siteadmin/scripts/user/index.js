(function ($) {
    var UserManagementController = function (selector) {
        this.init(selector);
    };

    $.extend(UserManagementController.prototype, {
        $container: null,
        $firstTime: true,

        init: function (selector) {
            var me = this;

            me.$container = $(selector);
            me.userNo = me.$container.data("userNo");
            me.adminYn = me.$container.data("adminYn");
            me.containerUserDetailInfo = me.$container.find('#user-detail-info');
            me.containerUserAddInfo    = me.$container.find('#user-additional-info');
            me.containerCreateUserAdd  = me.$container.find('#container-create-user-add');
            me.containerTableUserList  = me.$container.find('#table-list-user');
            me.tableUserListAction     = me.$container.find('#table-user-list-action');
            me.$formUpdateUser         = me.$container.find('#form-update-user-info');
            me.$passwordModal          = me.$container.find('#password_modal');
            me.$formChangePassword     = me.$container.find('#form-change-password');
            me.$createUserModal        = me.$container.find('#create_user_modal');
            me.$formCreateUser         = me.$container.find('#form-create-user');
            me.$formUserUpdateAction   = me.$container.find('#form-user-update-actions');

            if(me.adminYn == true){
                me.initUserListTable();
                me.getTotalCountUserList();
                me.loadUserGroupList();
            }else{
                me.allUserGroupList = [];
                me.getUserDetail(me.userNo);
            }

            me.initEventHandlers();
            me.checkInputSearch();
        },

        initUserListTable : function(){
            var me = this;
            me.containerTableUserList.bootstrapTable({
                url: '/admin/user/list.json',
                smartDisplay: false,
                showHeader:false,
                pageSize: 15,
                pagination: true,
                uniqueId: 'userNo',
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
                            return '<input type="checkbox" class="checkbox-item" data-value="' + object.userNo + '">';
                        }
                    }
                    , {
                        field: 'name',
                        title: 'Name',
                        formatter: function(value,object){
                            return '<i class="fa fa-user"></i> <span>'+ object.name + '</span>';
                        }
                    }, {
                        field: 'userNo',
                        title: 'User No',
                        formatter: function(value,object){
                            return ' <div class="userNo">' + object.userNo + '</div>';
                        }
                    }
                ]
            });
        },

        initFormChangePasswordValidation: function(){
            var me = this;

            me.$formChangePassword.formValidation({
                framework: 'bootstrap',
                icon: {
                    //valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    'password': {
                        row: '.col-md-12',
                        validators: {
                            notEmpty: {
                                message: siteAdminApp.getMessage('login.validation.password.required')
                            },
                            regexp: {
                                message: siteAdminApp.getMessage('msg.account.pass_rule'),
                                regexp: /^[a-z\d!@#$%^&*()_+?=.]{4,15}$/i
                            }
                        }
                    },
                    repassword:{
                        row: '.col-md-12',
                        validators: {
                            identical: {
                                message: siteAdminApp.getMessage('msg.account.pass_confirm'),
                                field: "password"
                            }
                        }
                    }
                }
            });

        },


        initFormCreateUserValidation: function(){
            var me = this;
            me.$formCreateUser.find('input.input-date').inputmask({});

            me.$formCreateUser.formValidation({
                framework: 'bootstrap',
                icon: {
                    //valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    name: {
                        row: '.col-md-4',
                        validators: {
                            notEmpty: {}
                        }
                    },
                    'id': {
                        row: '.col-md-4',
                        validators: {
                            notEmpty: {

                            },
                            regexp: {
                                message: 'Tên đăng nhập không hợp lệ. Ít nhất 6 ký tự chỉ gổm alphabet và số.',
                                regexp: /^[a-zA-Z0-9]{6,16}$/
                            },
                            remote: {
                                url: '/admin/user/checkUserID.json',
                                type: "POST",
                                data: function(validator, $field, value) {
                                    return {
                                        userId: value,
                                        currId: ''
                                    }
                                },
                                delay: 500,
                                message: 'Trùng tên đăng nhập, vui lòng chọn tên khác.'
                            }
                        }
                    },
                    'password': {
                        row: '.ccol-md-4',
                        validators: {
                            notEmpty: {
                                message: siteAdminApp.getMessage('login.validation.password.required')
                            },
                            regexp: {
                                message: 'Mật khẩu ít nhất 6 ký tự và phải có chữ cái, số và ký tự đặc biệt ($@$!%*#?&)',
                                regexp: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,20}$/
                            }
                        }
                    },
                    repassword:{
                        row: '.col-md-4',
                        validators: {
                            identical: {
                                message: 'Không giống với mật khẩu đã nhập',
                                field: "password"
                            }
                        }
                    },
                    email: {
                        row: '.col-md-3',
                        validators: {
                            regexp: {
                                message: 'Email không hợp lệ.',
                                regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            }
                        }
                    },
                    tel: {
                        row: '.col-md-4',
                        validators: {
                            notEmpty: {}
                        }
                    },
                    sex: {
                        row: '.col-md-6.col-sm-6',
                        validators: {
                            notEmpty: {}
                        }
                    }
                }
            });
        },

        initFormUserDetailValidation: function(){
            var me = this;
            me.$formUserDetail.find('input.input-date').inputmask({});
            me.$formUserDetail.formValidation({
                framework: 'bootstrap',
                icon: {
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    name: {
                        row: '.col-md-3.col-sm-3',
                        validators: {
                            notEmpty: {}
                        }
                    },
                    email: {
                        row: '.col-md-3',
                        validators: {
                            regexp: {
                                message: 'Email không hợp lệ.',
                                regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            }
                        }
                    },
                    sex: {
                        row: '.col-md-6.col-sm-6',
                        validators: {
                            notEmpty: {}
                        }
                    }
                }
            });
        },

        initEventHandlers: function() {
            var me = this;

            me.initFormCreateUserValidation();

            me.$formUserUpdateAction.on('click', 'button#btn-cancel-update', function (e) {
                e.preventDefault();
                //me.getUserDetail(me.currentUserNo);
                var title = mugrunApp.getMessage('common.btn.cancel');
                var message = mugrunApp.getMessage('common.dialog.confirm.default.message.cancel');
                var type = BootstrapDialog.TYPE_PRIMARY;
                var textCancelLabel = mugrunApp.getMessage('common.btn.no');
                var textOKLabel = mugrunApp.getMessage('common.btn.yes');
                var buttonOKClass = 'green';
                var buttonCancelClass = 'btn-outline green';
                var callbackFunc = me.getUserDetail;
                var paramsForCallbackFunc = me.currentUserNo;
                mugrunApp.showConfirmDialog(title, message, type, textOKLabel, textCancelLabel , buttonCancelClass, buttonOKClass, undefined, undefined,  callbackFunc, paramsForCallbackFunc);
            });

            me.$formUserUpdateAction.on('click', 'button#btn-submit-update', function (e) {
                e.preventDefault();
                var formValidation = me.$formUserDetail.data('formValidation');

                formValidation.validate();
                if(formValidation.getInvalidFields().length > 0 && me.checkReceiveTypeExist(formValidation.getInvalidFields())) {
                    me.$formUserDetail.find('.user-detail-receive-type .message-receive-type').removeClass('hide');
                }
                if (!formValidation.isValid()) {
                    return;
                } else{
                    var $birthday = me.$formUserDetail.find('input[name="birthday"]');
                    if (!$birthday.inputmask("isComplete")){
                        $birthday.closest('div').addClass('has-error');
                        return ;
                    }else{
                        $birthday.closest('div').removeClass('has-error');
                    }

                    var $issueDate = me.$formUserDetail.find('input[name="issueDate"]');
                    if (!$issueDate.inputmask("isComplete")){
                        $issueDate.closest('div').addClass('has-error');
                        return ;
                    }else{
                        $issueDate.closest('div').removeClass('has-error');
                    }

                    me.buildUserDetail();
                    var userData = me.$formUpdateUser.serializeObject();

                    var userGroup = me.currUser.userGroupListOfUser;
                    var selectGroupNo = me.containerUserDetailInfo.find("select[name=userGroup]").val();
                    var newGroupList = [];
                    var group = {isUpdate : false};
                    if(userGroup.length > 0 && userGroup[0].userGroupNo != selectGroupNo) {
                        group.userGroupNo = selectGroupNo;
                        group.isUpdate = true;
                    } else if(userGroup.length == 0 && selectGroupNo != null) {
                        group.userGroupNo = selectGroupNo;
                        group.isUpdate = true;
                    }
                    newGroupList[0] = group;

                    userData.userGroupListOfUser = newGroupList;

                    //me.processUpdate(userData);
                    var title = mugrunApp.getMessage('common.btn.save');
                    var message = mugrunApp.getMessage('common.dialog.confirm.default.message.save');
                    var type = BootstrapDialog.TYPE_PRIMARY;
                    var textCancelLabel = mugrunApp.getMessage('common.btn.no');
                    var textOKLabel = mugrunApp.getMessage('common.btn.yes');
                    var buttonOKClass = 'green';
                    var buttonCancelClass = 'btn-outline green';
                    var callbackFunc = me.processUpdate;
                    var paramsForCallbackFunc = userData;
                    mugrunApp.showConfirmDialog(title, message, type, textOKLabel, textCancelLabel , buttonCancelClass, buttonOKClass, undefined, undefined,  callbackFunc, paramsForCallbackFunc);
                }
            });

            me.tableUserListAction.find('#text-search-user').keydown(function(event) {
                setTimeout(function() {
                    me.checkInputSearch();
                    me.loadUserList();
                },1);
            });

            me.tableUserListAction.on('click', '#search-clear', function(){
                me.tableUserListAction.find('#text-search-user').val("");
                me.tableUserListAction.find('#search-clear').addClass('hide');
            });

            me.$container.on('click', 'table#table-list-user > tbody > tr', function (e) {
                if(e.target.type != 'checkbox') {
                    me.$container.find('input.checkbox-item:checked').click();
                    jQuery(e.currentTarget).find('input').click();
                    var userNo = $(this).find('div.userNo').text();
                    me.currentUserNo = userNo;
                    me.getUserDetail(userNo);
                }
            });

            me.$container.on('click', 'i#btn-search-user', function (e) {
                e.preventDefault();
                me.loadUserList();
            });

            me.$container.on('click', 'button#btn-delete-user', function (e) {
                e.preventDefault();
                var allItem = me.$container.find('input.checkbox-item:checked');
                var allUserNo = [];
                $.each(allItem, function(i, item){
                    allUserNo.push($(item).attr('data-value'));
                });
                if(allUserNo.length > 0) {
                    var title = mugrunApp.getMessage('common.alert.dialog.title');
                    var message = siteAdminApp.getMessage('admin.delete.user.message');
                    var type = BootstrapDialog.TYPE_PRIMARY;
                    var textCancelLabel = mugrunApp.getMessage('common.btn.no');
                    var textOKLabel = mugrunApp.getMessage('common.btn.yes');
                    var buttonOKClass = 'green';
                    var buttonCancelClass = 'btn-outline green';
                    var callbackFunc = me.deleteUser;
                    var paramsForCallbackFunc = allUserNo;
                    mugrunApp.showConfirmDialog(title, message, type, textOKLabel, textCancelLabel , buttonCancelClass, buttonOKClass, undefined, undefined,  callbackFunc, paramsForCallbackFunc);
                } else {
                    var title = mugrunApp.getMessage('common.alert.dialog.title');
                    var message = siteAdminApp.getMessage('user.delete.no.selection');
                    var type = BootstrapDialog.TYPE_PRIMARY;
                    var buttonLabel = mugrunApp.getMessage('common.close');
                    var buttonClass = 'btn blue';
                    mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
                }
            });

            me.$container.on('click', 'button#btn-add-user', function (e) {
                e.preventDefault();
                me.$createUserModal.removeClass('hide');
                me.$createUserModal.modal({backdrop: 'static', show: true});
            });

            me.$container.on('click', 'button#btn-select-all-user', function (e) {
                e.preventDefault();
                var itemNotCheck = me.$container.find('input.checkbox-item:not(:checked)');
                if(itemNotCheck.length == 0) {
                    me.$container.find('input.checkbox-item').click();
                } else {
                    itemNotCheck.click();
                }
            });



            me.$createUserModal.on('click', 'button#create_user_modal_save', function (e) {
                e.preventDefault();
                var formValidation = me.$formCreateUser.data('formValidation');
                formValidation.validate();
                if (!formValidation.isValid()) {
                    return;
                } else{
                    var $birthday = me.$formCreateUser.find('input[name="birthday"]');
                    if (!$birthday.inputmask("isComplete")){
                        $birthday.closest('div').addClass('has-error');
                        $('#date-invalide-msg').show();
                        return ;
                    }else{
                        $birthday.closest('div').removeClass('has-error');
                        $('#date-invalide-msg').hide();
                    }

                    var $issueDate = me.$formCreateUser.find('input[name="issueDate"]');
                    if (!$issueDate.inputmask("isComplete")){
                        $issueDate.closest('div').addClass('has-error');
                        return ;
                    }else{
                        $issueDate.closest('div').removeClass('has-error');
                    }


                    me.buildUserCreate();
                    var userData = me.$formUpdateUser.serializeObject();
                    var userGroupListOfUser = [];
                    var group = {};
                    group.userGroupNo = me.$formCreateUser.find('select[name="createUserGroup"]').val();
                    userGroupListOfUser.push(group);
                    userData.userGroupListOfUser = userGroupListOfUser;
                    me.processCreate(userData);
                }
            });

            me.$createUserModal.on('click', 'button#create_user_modal_cancel', function (e) {
                e.preventDefault();
                var title = mugrunApp.getMessage('common.btn.cancel');
                var message = mugrunApp.getMessage('common.dialog.confirm.default.message.cancel');
                var type = BootstrapDialog.TYPE_PRIMARY;
                var textCancelLabel = mugrunApp.getMessage('common.btn.no');
                var textOKLabel = mugrunApp.getMessage('common.btn.yes');
                var buttonOKClass = 'green';
                var buttonCancelClass = 'btn-outline green';
                var okCallbackFunc = me.closeCreateUserModal;
                var paramsForOkCallbackFunc = undefined;
                mugrunApp.showConfirmDialog(title, message, type, textOKLabel, textCancelLabel , buttonCancelClass, buttonOKClass, undefined, undefined,  okCallbackFunc, paramsForOkCallbackFunc);

            });

            me.$createUserModal.on('hidden.bs.modal', function () {
                me.closeCreateUserModal();
            });

            me.$createUserModal.on('change', '#create-user-select-domain-email', function (e) {
                e.preventDefault();
                var emailSelect = me.$createUserModal.find('#create-user-select-domain-email').val();
                if(emailSelect != '') {
                    me.$createUserModal.find(':text[name="emailRegion"]').val(emailSelect);
                    me.$formCreateUser.formValidation('revalidateField', 'emailRegion');
                }
            });

        },

        initUserDetailEventHandlers: function() {
            var me = this;

            me.$container.on('click', 'button#btn-check-duplicate', function (e) {
                e.preventDefault();
                me.$formUserDetail         = me.$container.find('#form-user-detail');
                var emailName = me.$formUserDetail.find(':text[name="emailName"]').val();
                var emailRegion = me.$formUserDetail.find(':text[name="emailRegion"]').val();
                if(emailName !== '' && emailRegion != ''){
                    var email = emailName + '@' + emailRegion;
                    me.checkExistEmail(email);
                }
            });

            me.$formUserDetail.on('change', '#select-domain-email', function (e) {
                e.preventDefault();
                var emailSelect = me.$formUserDetail.find('#select-domain-email').val();
                if(emailSelect != '') {
                    me.$formUserDetail.find(':text[name="emailRegion"]').val(emailSelect);
                    me.$formUserDetail.formValidation('revalidateField', 'emailRegion');
                }
            });

            me.$container.on('click', 'button#btn-change-password', function (e) {
                e.preventDefault();
                me.$passwordModal.removeClass('hide');
                me.initFormChangePasswordValidation();
                me.$passwordModal.modal({backdrop: 'static', show: true});
            });

            me.$passwordModal.on('hidden.bs.modal', function () {
                me.closeChangePasswordModal();
            });

            me.$passwordModal.on('click', '#password_modal_save', function(){
                var formValidation = me.$formChangePassword.data('formValidation');

                formValidation.validate();
                if (!formValidation.isValid()) {
                    return;
                } else{
                    var newPassword = me.$formChangePassword.serializeArray()[0].value;
                    me.changePassword(me.currentUserNo, newPassword);
                }
            });




            me.$container.on('click', 'button#btn-download-user-info', function (e) {
                e.preventDefault();
                var url = '/admin/user/download/user/info?userNo=' + me.currentUserNo;
                window.open(url, '_blank');
            });
            me.$container.on('click', 'button#btn-download-user-list', function (e) {
                e.preventDefault();
                var url = '/admin/user/download/user/list';
                window.open(url, '_blank');
            });


        },

        checkInputSearch : function(){
            var me = this;
            if(me.tableUserListAction.find('#text-search-user').val() != ""){
                me.tableUserListAction.find('#search-clear').removeClass('hide');
            } else {
                if(!me.tableUserListAction.find('#search-clear').hasClass('hide')) {
                    me.tableUserListAction.find('#search-clear').addClass('hide');
                }
            }
        },

        loadUserList: function(loadFirstUser) {
            var me = this;

            var searchType = me.$container.find('select[name="fieldSearchUser"]').val();
            var searchText = me.$container.find('input[name="textSearchUser"]').val();
            var url = '/admin/user/list.json?searchType=' + searchType + '&searchText=' + searchText;
            me.containerTableUserList.bootstrapTable('refresh', {url: url});

            if (loadFirstUser) {
               me.getFirstUserOfList();
            }
        },

        getFirstUserOfList: function() {
            var me = this;

            var searchType = me.$container.find('select[name="fieldSearchUser"]').val();
            var searchText = me.$container.find('input[name="textSearchUser"]').val();
            var url = '/admin/user/list/first.json';
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                data: {
                    pageNumber:1,
                    pageSize:15,
                    searchType: searchType,
                    searchText: searchText
                },
                success: function(data) {
                    if (data.success) {
                        var user = data.data;
                        if(user != null){
                            me.currentUserNo = user.userNo;
                            me.getUserDetail(user.userNo);
                            if(me.containerTableUserList.find('input.checkbox-item[data-value=' + user.userNo + ']').length > 0){
                                me.containerTableUserList.find('input.checkbox-item[data-value=' + user.userNo + ']')[0].click()
                            }
                        }
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    mugrunApp.unmask();
                }
            });
        },

        loadUserGroupList: function() {
            var me = this;

            $.ajax({
                url: '/admin/user/usergroup/list.json',
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (data.success) {
                        var userGroupList = data.data;
                        me.allUserGroupList = userGroupList;
                        var eleSelect = me.$formCreateUser.find('select[name=createUserGroup]');
                        for(var i = 0 ; i < userGroupList.length; i++) {
                            var group = userGroupList[i];
                            eleSelect.append('<option value="' + group.userGroupNo + '"> ' + group.userGroupName + '</option>')
                        }
                        // because user detail depend on user group
                        // so make all user group loaded before load user detail
                        me.loadUserList(true);
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    mugrunApp.unmask();
                }
            });
        },


        getUserDetail: function(userNo) {
            var me = this;

            $.ajax({
                url: '/admin/user/detail.json',
                type: 'GET',
                dataType: 'json',
                data: {
                    userNo: userNo
                },
                success: function(data) {
                    if (data.success) {
                        var user = data.data;
                        me.currUser = user;
                        var containerUserDetailInfo = me.containerUserDetailInfo;
                        var listGroup = user.userGroupListOfUser;

                        if(listGroup.length > 0){
                            var userGroupNo = listGroup[0].userGroupNo;
                            user.userGroupNo = userGroupNo;
                        }

                        containerUserDetailInfo.empty().append(
                            $.tmpl(
                                me.$container.find('#tmpl-user-detail-info').html(),
                                {user : user, allUserGroupList : me.allUserGroupList}
                            )
                        );

                        if(user.receiveTypes != null && user.receiveTypes != ''){
                            me.updateCheckboxByField(containerUserDetailInfo, user.receiveTypes, '.chk_mail', 'E');
                            me.updateCheckboxByField(containerUserDetailInfo, user.receiveTypes, '.chk_sms', 'sms');
                        }



                        if(user.userGroupNo == undefined) {
                            containerUserDetailInfo.find("select[name=userGroup]").prop("selectedIndex", -1);
                        }

                        me.currentUserId = user.id;
                        me.currentUserNickname = user.nickname;
                        //if don't have container will init
                        me.$formUserDetail         = me.$container.find('#form-user-detail');
                        me.$formUpdateUserAdd      = me.$container.find('#form-update-user-additional');

                        //me.initFormAdditionValidation(user.myAddInfo, me.$formUpdateUserAdd);
                        if(me.$firstTime == true) {
                            me.initUserDetailEventHandlers();
                        }
                        me.$firstTime = false;
                        me.initFormUserDetailValidation();

                        me.$formUserDetail         = me.$container.find('#form-user-detail');
                        me.$formUserDetail.on('click', '.chk_mail, .chk_sms', function(e) {
                            if(me.$formUserDetail.find('.chk_mail').prop('checked') == false
                                && me.$formUserDetail.find('.chk_sms').prop('checked') == false){
                                me.$formUserDetail.find('.user-detail-receive-type .message-receive-type').removeClass('hide');
                            } else {
                                me.$formUserDetail.find('.user-detail-receive-type .message-receive-type').addClass('hide');
                            }

                        });
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    mugrunApp.unmask();
                }
            });
        },

        buildUserCreate : function(){
            var me = this;
            me.$formUserStatus         = me.$container.find('#form-user-status');
            me.$formUpdateUser.find(':hidden[name="password"]').val(me.$formCreateUser.find('input[name="password"]').val());
            me.buildUserCommonInfo(me.$formUpdateUser, me.$formCreateUser);
        },

        buildUserDetail : function(){
            var me = this;
            me.$formUserStatus         = me.$container.find('#form-user-status');
            me.$formUpdateUser.find(':hidden[name="userNo"]').val(me.currentUserNo);
            me.$formUpdateUser.find(':hidden[name="userStatus"]').val(me.$formUserStatus.find('select[name="userStatus"]').val());
            me.buildUserCommonInfo(me.$formUpdateUser, me.$formUserDetail);
        },

        buildUserAddtionalInfo : function(userAddInfo, containerUserAddInfo){
            var me = this;
            var result = [];
            for(var i = 0; i < userAddInfo.length; i++){
                var item = userAddInfo[i];
                if(item.itemType == 'text'){
                    item.itemValue = containerUserAddInfo.find('input[name="' + item.itemType + item.itemNo + '"]').val()
                } else {
                    item.itemValue = containerUserAddInfo.find('input[name="' + item.itemType + item.itemNo + '"]').text();
                }
                result.push(item);
            }
            return result;
        },

        buildUserCommonInfo: function(formUpdate, formSource){
            formUpdate.find(':hidden[name="id"]').val(formSource.find(':text[name="id"]').val());
            formUpdate.find(':hidden[name="name"]').val(formSource.find(':text[name="name"]').val());
            formUpdate.find(':hidden[name="nickname"]').val(formSource.find(':text[name="nickname"]').val());
            formUpdate.find(':hidden[name="email"]').val(formSource.find(':text[name="email"]').val());
            formUpdate.find(':hidden[name="tel"]').val(formSource.find(':text[name="tel"]').val());
            formUpdate.find(':hidden[name="birthday"]').val(formSource.find(':text[name="birthday"]').val());
            formUpdate.find(':hidden[name="sex"]').val(formSource.find('input[name="sex"]:checked').val());
            formUpdate.find(':hidden[name="address"]').val(formSource.find(':text[name="address"]').val());
            formUpdate.find(':hidden[name="subAddress"]').val(formSource.find(':text[name="subAddress"]').val());
            formUpdate.find(':hidden[name="socialId"]').val(formSource.find(':text[name="socialId"]').val());
            formUpdate.find(':hidden[name="issueDate"]').val(formSource.find(':text[name="issueDate"]').val());
            formUpdate.find(':hidden[name="issuePlace"]').val(formSource.find(':text[name="issuePlace"]').val());
        },

        processUpdate : function(userData){
            var me = userManagementController;
            $.ajax({
                method: 'POST',
                url: "/admin/user/detail/update.json",
                dataType: 'json',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(userData),
                success: function(data) {
                    if (data.success) {
                        var title = mugrunApp.getMessage('common.alert.dialog.title');
                        var message = mugrunApp.getMessage('common.alert.dialog.message.saved');
                        var type = BootstrapDialog.TYPE_PRIMARY;
                        var buttonLabel = mugrunApp.getMessage('common.close');
                        var buttonClass = 'btn blue';
                        mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
                        // load again
                        me.loadUserList(false);
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    mugrunApp.unmask();
                }
            });
        },

        processCreate : function(userData){
            var me = this;
            $('#create_user_modal_save').prop('disabled', true);
            $.ajax({
                method: 'POST',
                url: "/admin/user/create",
                dataType: 'json',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(userData),
                success: function(data) {
                    if (data.success) {
                        me.$createUserModal.modal('hide');
                        var title = mugrunApp.getMessage('common.alert.dialog.title');
                        var message = mugrunApp.getMessage('common.alert.dialog.message.saved');
                        var type = BootstrapDialog.TYPE_PRIMARY;
                        var buttonLabel = mugrunApp.getMessage('common.close');
                        var buttonClass = 'btn blue';
                        mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
                        // close modal
                        me.closeCreateUserModal();
                        // load again
                        me.loadUserList(true);

                        // update total Count
                        me.getTotalCountUserList();
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    $('#create_user_modal_save').prop('disabled', false);
                    mugrunApp.unmask();
                }
            });
        },

        checkExistEmail : function(email){
            var me = this;
            $.ajax({
                url: '/admin/user/email/checkexist',
                type: 'GET',
                dataType: 'json',
                data: {
                    email: email
                },
                success: function(data) {
                    if (data.success) {
                        var isExist = data.data;
                        if(isExist) {
                            mugrunApp.alertMessage(siteAdminApp.getMessage('user.check.email.exist'));
                        } else {
                            mugrunApp.alertMessage(siteAdminApp.getMessage('user.check.email.not.exist'));
                        }
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    mugrunApp.unmask();
                }
            });
        },

        deleteUser : function(listUserNo){
            var me = userManagementController;

            $.ajax({
                url: '/admin/user/delete',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    listUserNo: JSON.stringify(listUserNo)
                },
                success: function(data) {
                    if (data.success) {
                        var title = mugrunApp.getMessage('common.alert.dialog.title');
                        var message = mugrunApp.getMessage('common.alert.dialog.message.deleted');
                        var type = BootstrapDialog.TYPE_PRIMARY;
                        var buttonLabel = mugrunApp.getMessage('common.close');
                        var buttonClass = 'btn blue';
                        mugrunApp.showAlertDialog(title,message,type,buttonLabel, buttonClass);
                        // load again
                        me.loadUserList(true);

                        // update total
                        me.getTotalCountUserList();
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    mugrunApp.unmask();
                }
            });
        },

        formatDataTable : function(users){
            var data = [];
            for(var i = 0; i < users.length; i++){
                var user = users[i];
                var userTemp = {};
                userTemp.userNo = user.userNo;
                userTemp.name = user.name + ' (' + user.id + ') ';
                data.push(userTemp);
            }
            return data;
        },

        changePassword: function(currentUserNo, newPassword){
            var me = this;
            $.ajax({
                url: '/admin/user/password/update',
                type: 'GET',
                dataType: 'json',
                data: {
                    userNo: currentUserNo,
                    password: newPassword
                },
                success: function(data) {
                    me.$passwordModal.modal('hide');
                    if (data.success) {
                        mugrunApp.alertMessage(siteAdminApp.getMessage('user.update.password.success'));
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                }
            });
        },



        lastDayOfMonth : function(formUser) {
            var fv = formUser.data('formValidation');
            fv.validate();
            if(fv && fv.isValidField('yearBirthday') && fv.isValidField('monthBirthday')){
                var yearBirthday = fv.getFieldElements('yearBirthday').val();
                var monthBirthday = fv.getFieldElements('monthBirthday').val();
                return new Date( (new Date(yearBirthday, monthBirthday,1))-1 ).getDate();
            }
            return 31;
        },

        updateCheckboxByField: function(container, userDataReceiveType, field, code) {
            var ele = container.find(field);
            if(userDataReceiveType.indexOf(code) > -1) {
                $(ele).prop('checked', true);
            } else {
                $(ele).prop('checked', false);
            }
        },

        closeCreateUserModal : function(){
            var me = userManagementController;

            me.$createUserModal.modal('hide');
            me.$formCreateUser[0].reset();

        },

        closeChangePasswordModal : function(){
            var me = userManagementController;

            me.$passwordModal.modal('hide');
            me.$formChangePassword[0].reset();
            if(me.$formChangePassword.data('formValidation')) {
                me.$formChangePassword.data('formValidation').destroy();
            }
        },


        checkReceiveTypeExist: function(arr){
            for(var i=0; i < arr.length; i++){
                var obj = arr[i];
                if(obj.name == 'receiveType[]'){
                    return true;
                }
            }
            return false;
        },

        getTotalCountUserList: function() {
            var me = this;

            $.ajax({
                url: '/admin/user/list/total.json',
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (data.success) {
                        var totalCount = data.data;
                        //var text = 'Tổng số: ' + mugrunApp.formatNumber(totalCount) + ' người.';
                        //me.tableUserListAction.find('#total-count-user-list').text(text);
                    } else {
                        mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                    }
                },
                beforeSend: function() {
                    mugrunApp.mask(mugrunApp.getMessage('common.loading'));
                },
                complete: function () {
                    mugrunApp.unmask();
                }
            });
        }

    });

    var userManagementController = new UserManagementController('#container-userIndex');
})(jQuery);

