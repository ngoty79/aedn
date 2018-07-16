package com.namowebiz.mugrun.applications.siteadmin.controller.usergroup;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.JsonUtil;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroup;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import com.namowebiz.mugrun.applications.siteadmin.service.usergroup.UserGroupService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin/usergroup")
@CommonsLog
public class UserGroupController {

    @Autowired
    private UserGroupService userGroupService;

    @Autowired
    private UserService userService;

    @Autowired
    private ApplicationContext context;

    @RequestMapping("/index")
    public String index(Map<String, Object> map) {
        return "siteadmin/usergroup/index";
    }

    @RequestMapping(value = "/loadUserGroups.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse loadUserGroups() throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("orderGroupName", true);
            List<UserGroup> rs = userGroupService.list(params);
            jsonResponse.setData(rs);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }
        return jsonResponse;
    }


    @RequestMapping(value = "/saveUserGroup.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse saveUserGroup(@RequestBody UserGroup userGroup) {
        JsonResponse jsonResponse = new JsonResponse();
        Map<String, Object> dataResponse = new HashMap<>();
        try {
            if(userGroup != null) {
                UserGroup userGroupChecking = userGroupService.checkDuplicateName(userGroup.getUserGroupName(), userGroup.getUserGroupNo());
                if(userGroupChecking != null) {
                    dataResponse.put("message", context.getMessage("usergroup.message.duplicate.groupname", null, LocaleContextHolder.getLocale()));
                    jsonResponse.setSuccess(false);
                }else{
                    UserVO loginUser = RequestUtil.getLoginUserInfo();
                    Long userGroupNo = userGroupService.save(userGroup, loginUser);
                    dataResponse.put("userGroupNo", userGroupNo);
                    jsonResponse.setSuccess(true);
                }
            }else{
                jsonResponse.setSuccess(false);
            }
            jsonResponse.setData(dataResponse);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            jsonResponse.setSuccess(false);
        }

        return jsonResponse;
    }


    @RequestMapping("/deleteUserGroup.json")
    @ResponseBody
    public JsonResponse deleteUserGroup(Long userGroupNo) {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            if(userGroupNo != null && userGroupNo > 0) {
                userGroupService.delete(userGroupNo);
            } else{
                jsonResponse.setSuccess(false);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            jsonResponse.setSuccess(false);
        }

        return jsonResponse;
    }

    @RequestMapping(value = "/getTotal.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getTotalCountUsersOfGroup(Long userGroupNo) throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            if(userGroupNo != null && userGroupNo > 0) {
                Map<String, Object> params = new HashMap<>();
                params.put("userGroupNo", userGroupNo);
                Long totalCount = userService.countList(params);
                jsonResponse.setData(totalCount);
                jsonResponse.setSuccess(true);
            }
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }
        return jsonResponse;
    }

    @RequestMapping(value = "/loadUsersOfGroup.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse loadUsers(Integer pageNumber, Integer pageSize, Long userGroupNo, String field, String keyword) throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            if(userGroupNo != null && userGroupNo > 0) {
                Map<String, Object> params = new HashMap<>();
                params.put("userGroupNo", userGroupNo);
                params.put(field, keyword);
                List<UserVO> rs = userService.getUserByGroup(params);
                jsonResponse.setData(rs);
                jsonResponse.setSuccess(true);
            }else{
                jsonResponse.setSuccess(false);
            }
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }
        return jsonResponse;
    }

    @RequestMapping(value = "/loadUsers.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse searchUserList(String field, String keyword) throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            Map<String, Object> params = new HashMap<>();
            params.put(field, keyword);
            List<UserVO> users = userService.getUserWithGroup(params);
            jsonResponse.setData(users);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }
        return jsonResponse;
    }

    @RequestMapping("/deleteUserGroupLink.json")
    @ResponseBody
    public JsonResponse deleteUserGroupLink(Long userGroupNo, Long userNo) {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            if(userGroupNo != null && userGroupNo > 0 && userNo != null && userNo > 0) {
                userGroupService.deleteUserGroupLink(userGroupNo, userNo);
            } else{
                jsonResponse.setSuccess(false);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            jsonResponse.setSuccess(false);
        }

        return jsonResponse;
    }

    @RequestMapping("/deleteMultiUserGroupLink.json")
    @ResponseBody
    public JsonResponse deleteMultiUserGroupLink(@RequestParam String listUserNo, Long userGroupNo) {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            List<Integer> userNos = JsonUtil.parseJSON(listUserNo, List.class);
            userGroupService.deleteMultilUserGroupLink(userNos, userGroupNo);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            jsonResponse.setSuccess(false);
        }

        return jsonResponse;
    }

    @RequestMapping("/checkUsersAssigned.json")
    @ResponseBody
    public JsonResponse checkUsersAssigned(@RequestParam String listUserNo, Long userGroupNo) {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            List<Integer> userNos = JsonUtil.parseJSON(listUserNo, List.class);
            boolean rs = userGroupService.checkUsersAssigned(userNos, userGroupNo);
            if(rs) {
                jsonResponse.setSuccess(false);
                jsonResponse.setData(true);
            }else{
                jsonResponse.setSuccess(true);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            jsonResponse.setSuccess(false);
        }

        return jsonResponse;
    }

    @RequestMapping("/addUsersToGroup.json")
    @ResponseBody
    public JsonResponse addUsersToGroup(@RequestParam String listUserNo, Long userGroupNo) {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            List<Integer> userNos = JsonUtil.parseJSON(listUserNo, List.class);
            UserVO loginUser = RequestUtil.getLoginUserInfo();
            userGroupService.addUsersToGroup(userNos, userGroupNo, loginUser.getUserNo());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            jsonResponse.setSuccess(false);
        }

        return jsonResponse;
    }


}
