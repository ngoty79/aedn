package com.namowebiz.mugrun.applications.siteadmin.controller.permission.controller;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.framework.services.menu.AdminMenuService;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroup;
import com.namowebiz.mugrun.applications.siteadmin.service.permission.MenuPermissionService;
import com.namowebiz.mugrun.applications.siteadmin.service.usergroup.UserGroupService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 9/18/2017.
 */

@Controller
@CommonsLog
public class PermissionController {
    @Autowired
    private UserGroupService userGroupService;
    @Autowired
    private MenuPermissionService menuPermissionService;
    @Autowired
    private AdminMenuService adminMenuService;




    @RequestMapping(value = "/admin/permission/index", method = RequestMethod.GET)
    public String payment(Map<String, Object> map, HttpServletRequest request) throws Exception {
        UserVO user = RequestUtil.getUserInfoInSession(request);
        if(user.getAdminYn() != null && user.getAdminYn() == true){
            List<UserGroup> groups = userGroupService.getUserGroups();
            map.put("groups", groups);
            map.put("menus", adminMenuService.getChildAdminMenus());
            return "siteadmin/permission/index";
        }
        return "redirect:" + CommonConstants.ADMIN_INDEX_URL;
    }

    @RequestMapping(value = "/admin/permission/update.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse update(UserGroup userGroup, HttpServletRequest request){
        UserVO user = RequestUtil.getUserInfoInSession(request);
        JsonResponse jsonResponse = new JsonResponse(false, null);
        UserGroup model = userGroupService.getByPK(userGroup.getUserGroupNo());
        if(model != null) {
            if(user.getAdminYn() == null || !user.getAdminYn()){
                jsonResponse.setMessages("Chỉ có quyền Quản Trị mới được cập nhật dữ liệu này.");
                return jsonResponse;
            }else{
                userGroupService.updateGroupPermission(userGroup);
                jsonResponse.setSuccess(true);
                jsonResponse.setData(userGroupService.getByPK(userGroup.getUserGroupNo()));
            }
        }else{
            jsonResponse.setMessages("Không tim thấy nhóm cần cập nhật.");
        }
        return jsonResponse;
    }







}
