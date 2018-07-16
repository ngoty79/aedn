var ClubhouseFacilityMntController = function (selector) {
    this.init(selector);
};

$.extend(ClubhouseFacilityMntController.prototype, {
    $container: null,

    init: function (selector) {
        var me = this;

        me.$container = $(selector);
        me.$groupsContainer                     = me.$container.find('#contain-facilityMnt-groups');
        me.$allGroupTmpl                        = me.$container.find('#tmpl-facilityMnt-group');
        me.$singleGroupTmpl                     = me.$container.find('#tmpl-facilityMnt-singleGroup');

        me.initUi();
        me.initEventHandlers();
    },

    initUi: function() {
        var me = this;

    },

    initEventHandlers: function() {
        var me = this;

    },

    loadFacilities: function() {
        var me = this;

        $.ajax({
            url: '/admin/clubhouse/loadFacilities.json',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    var data = response.data;
                    me.buildGroupFacilities(data);
                    me.initFacilityEventHandlers();
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

    buildGroupFacilities: function(groups) {
        var me = this;
        me.$groupsContainer.empty();
        $.each(groups, function(key, group) {
            me.$groupsContainer.append(
                $.tmpl(me.$allGroupTmpl.html(), group)
            );
        });
    },

    initFacilityEventHandlers: function(tableFacilityMntList) {
        var me = this;

        var $tableFacilityList = $(tableFacilityMntList);
        if($tableFacilityList.length == 0) {
            $tableFacilityList = me.$groupsContainer.find('.table-facilityMnt-list');
            me.$groupsContainer.find('.btn-facilityMnt-add').unbind('click').click(function(e){
                e.preventDefault();
                var $row = $(this).closest('.row');
                if($row.find('.error-msg.required.hide').length == 0) {
                    $row.find('.error-msg.required').addClass('hide');
                }
                if($row.find('.error-msg.duplicate.hide').length == 0) {
                    $row.find('.error-msg.duplicate').addClass('hide');
                }

                var $input = $row.find('input[name="facilityNameAdd"]');
                if($.trim($input.val()) != '') {
                    me.submitFacilityInfo($input, 0, this);
                }else{
                    $row.find('.error-msg.required').removeClass('hide');
                }
            });
        }

        me.$groupsContainer.find('input[name="facilityNameAdd"]')
            .unbind('keydown')
            .keydown(function(e){
                var $row = $(this).closest('.row');
                if($row.find('.error-msg.required.hide').length == 0) {
                    $row.find('.error-msg.required').addClass('hide');
                }
                if($row.find('.error-msg.duplicate.hide').length == 0) {
                    $row.find('.error-msg.duplicate').addClass('hide');
                }
                var keycode = (e.keyCode ? e.keyCode : e.which);
                if (keycode == '13') {
                    $(this).parent().find('a.btn-facilityMnt-add').click();
                }
            });

        $tableFacilityList.find('.row-facilityMnt-name').unbind('click').click(function(e){
            e.preventDefault();
            if($(this).closest('.table-facilityMnt-list').find('span.error-msg').not('.hide').length == 0) {
                $(this).closest('.table-facilityMnt-list')
                    .find('input[name="facilityName"]')
                    .not('.hide')
                    .addClass('hide')
                    .parent()
                    .find('span.txt-facilityMnt-name')
                    .removeClass('hide');
                $(this).find('span.txt-facilityMnt-name').addClass('hide');
                $(this).parent().find('input[name="facilityName"]').removeClass('hide');
            }
        });

        $tableFacilityList.find('input[name="facilityName"]')
            .unbind('change')
            .change(function(){
                if($.trim(this.value) != '' && $.trim(this.defaultValue) != $.trim(this.value)) {
                    me.submitFacilityInfo(this, $(this).data('facilityno'));
                }else if($.trim(this.defaultValue) == $.trim(this.value) && $(this).parent().find('span.error-msg').not('.hide')) {
                    $(this).parent().find('span.error-msg').addClass('hide');
                }
            });

        $tableFacilityList.find('.btn-facilityMnt-delete').unbind('click').click(function(e){
            e.preventDefault();
            var params = {};
            params.facilityNo = $(this).data('facilityno');
            params.facilityType = $(this).data('facilitytype');
            params.row = $(this).closest('.row');
            var headerGroup = '';
            if($(this).data('facilitytype') == '1') {
                headerGroup = '골프장';
            }else if($(this).data('facilitytype') == '2') {
                headerGroup = '연습장';
            }
            mugrunApp.showWarningDeleteDialog(me.deleteFacility, params, headerGroup+'을 삭제하시겠습니까?');
        });

    },

    submitFacilityInfo: function(input, facilityNo, btnAdd) {
        var me = this;
        var data = {};
        data['facilityType'] = $(input).data('facilitytype');
        data['facilityName'] = $(input).val();
        data['facilityNo'] = facilityNo;
        $.ajax({
            url: '/admin/clubhouse/submitFacilityInfo.json',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    if(!facilityNo) {
                        //add new
                        $(btnAdd).closest('.input-group').find('input[name="facilityNameAdd"]').val('');
                        if(!$(input).closest('.row').find('.error-msg').hasClass('hide')){
                            $(input).closest('.row').find('.error-msg').addClass('hide');
                        }
                        me.reloadFacilitiesOnGroup($(btnAdd).closest('.container-facilityMnt-list').find('.table-facilityMnt-list'), $(input).data('facilitytype'));
                    }else if(!$(btnAdd).parent().find('.error-msg').hasClass('hide')){
                        //$(input).parent().find('.error-msg').addClass('hide');
                        me.reloadFacilitiesOnGroup($(input).closest('.table-facilityMnt-list'), $(input).data('facilitytype'));
                    }
                } else if(response.status == '1'){
                    if(facilityNo) {
                        $(input).parent().find('.error-msg').removeClass('hide');
                    }else{
                        if($(input).closest('.row').find('.error-msg.duplicate.hide').length > 0) {
                            $(input).closest('.row').find('.error-msg.duplicate').removeClass('hide');
                        }
                    }
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            },
            beforeSend: function() {
                $(btnAdd).prop('disabled', true);
            },
            complete: function () {
                $(btnAdd).prop('disabled', false);
            }
        });
    },

    reloadFacilitiesOnGroup: function(tableFacilityList, group) {
        var me = this;
        $.ajax({
            url: '/admin/clubhouse/loadFacilitiesOnGroup.json',
            type: 'GET',
            dataType: 'json',
            data: {
                groupCode: group
            },
            success: function(response) {
                if (response.success) {
                    var data = response.data;
                    $(tableFacilityList).empty().append(
                        $.tmpl(me.$singleGroupTmpl.html(), data)
                    );
                    me.initFacilityEventHandlers(tableFacilityList);
                } else {
                    mugrunApp.alertMessage(mugrunApp.getMessage('common.server.error'));
                }
            }
        });
    },

    deleteFacility: function(params) {
        var me = clubhouseFacilityMntController;
        $.ajax({
            url: '/admin/clubhouse/deleteFacility.json',
            dataType: 'json',
            data: {
                facilityNo: params.facilityNo,
                facilityType: params.facilityType
            },
            contentType: "application/json",
            success: function(response) {
                if (response.success) {
                    $(params.row).remove();
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
    }
});


