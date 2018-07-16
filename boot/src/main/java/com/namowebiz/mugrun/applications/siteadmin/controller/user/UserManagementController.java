package com.namowebiz.mugrun.applications.siteadmin.controller.user;

import com.namowebiz.mugrun.applications.framework.common.utils.*;
import com.namowebiz.mugrun.applications.siteadmin.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroup;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroupUsers;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserExcelService;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import com.namowebiz.mugrun.applications.siteadmin.service.usergroup.UserGroupService;
import com.namowebiz.mugrun.applications.siteadmin.service.usergroup.UserGroupUsersService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.websocket.server.PathParam;
import java.io.OutputStream;
import java.util.*;

/**
 * Created by Hai Nguyen on 6/21/2016.
 */

@Controller
@RequestMapping("/admin")
@CommonsLog
public class UserManagementController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordUtil passwordUtil;

    @Autowired
    private UserExcelService userExcelService;

    @Autowired
    private UserGroupService userGroupService;

    @Autowired
    private UserGroupUsersService userGroupUsersService;


    /**
     * Return index page
     *
     * @param
     * @return A JSON object that represents the user list
     * @throws Exception
     */
    @RequestMapping(value = "/user/index", method = RequestMethod.GET)
    public String index(Map<String, Object> map, HttpServletRequest request) throws Exception {
        map.put("user", RequestUtil.getUserInfoInSession(request));
        return "siteadmin/user/index";
    }

    /**
     * Get total count user first
     *
     * @return A JSON object that represents the count user first
     * @throws Exception
     */
    @RequestMapping(value = "/user/list/total.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getTotalCountUserList() throws Exception {
        Map<String, Object> params = new HashMap<>();

        JsonResponse jsonResponse = new JsonResponse();
        try {
            Long totalCount = userService.countList(params);
            jsonResponse.setData(totalCount);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }


    /**
     * Get user list
     *
     * @param
     * @return A JSON object that represents the user list
     * @throws Exception
     */
    @RequestMapping(value = "/user/list.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<UserVO> getUserList(String searchType, String searchText, int pageNumber, int pageSize) throws Exception {
        Map<String, Object> params = new HashMap<>();
        if(searchText != null && !"".equals(searchText)) {
            params.put(searchType, searchText);
        }
        int startIndex = (pageNumber-1)*pageSize;
        params.put("startIndex", startIndex);
        params.put("pageSize", pageSize);
        PaginationList<UserVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<UserVO> users = userService.list(params);
        Long count = userService.countList(params);
        paging.setRows(users);
        paging.setTotal(count);

        return paging;
    }

    /**
     * Get user first
     *
     * @param
     * @return A JSON object that represents the user first
     * @throws Exception
     */
    @RequestMapping(value = "/user/list/first.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getFirstUserList(String searchType, String searchText, int pageNumber, int pageSize) throws Exception {
        Map<String, Object> params = new HashMap<>();

        JsonResponse jsonResponse = new JsonResponse();
        try {
            if(searchText != null && !"".equals(searchText)) {
                params.put(searchType, searchText);
            }
            int startIndex = (pageNumber-1)*pageSize;
            params.put("startIndex", startIndex);
            params.put("pageSize", pageSize);
            List<UserVO> users = userService.list(params);
            if(users.size() > 0) {
                jsonResponse.setData(users.get(0));
            } else {
                jsonResponse.setData(null);
            }
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    /**
     * Get user group list
     *
     * @param
     * @return A JSON object that represents the user group list
     * @throws Exception
     */
    @RequestMapping(value = "/user/usergroup/list.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getUserGroupList() throws Exception {
        Map<String, Object> params = new HashMap<>();

        JsonResponse jsonResponse = new JsonResponse();
        try {
            List<UserGroup> userGroups = userGroupService.list(params);
            jsonResponse.setData(userGroups);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    /**
     * Get additional list
     *
     * @param
     * @return A JSON object that represents the additional list
     * @throws Exception
     */
    @RequestMapping(value = "/user/additional/list.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getUserAdditonalList() throws Exception {
        Map<String, Object> params = new HashMap<>();

        JsonResponse jsonResponse = new JsonResponse();
        try {
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    /**
     * Get user detail
     *
     * @param userNo
     * @return A JSON object that represents the user detail
     * @throws Exception
     */
    @RequestMapping(value = "/user/detail.json")
    @ResponseBody
    public JsonResponse getUserDetail(Long userNo) throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            if(userNo != null && userNo > 0) {
                UserVO user = userService.getByPK(userNo);
                user = userService.convertDateToStringOfUser(user);
                List<UserGroup> groups = userGroupService.getUserGroupListOfUser(userNo);
                user.setUserGroupListOfUser(groups);
                jsonResponse.setData(user);
            }
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    /**
     * Update user detail
     *
     * @param user
     * @return A JSON object that represents the status update
     * @throws Exception
     */
    @RequestMapping(value = "/user/detail/update.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse updateUserDetail(@RequestBody UserVO user, HttpServletRequest request) throws Exception {
        Long userNo = RequestUtil.getUserInfoInSession(request).getUserNo();
        JsonResponse jsonResponse = new JsonResponse();
        try {
            UserVO currUser = userService.getByPK(user.getUserNo());
            currUser.setId(user.getId());
            currUser.setName(user.getName());
            currUser.setNickname(user.getNickname());
            currUser.setBirthday(user.getBirthday());
            currUser.setSex(user.getSex());
            currUser.setReceiveTypes(user.getReceiveTypes());
            currUser.setEmail(user.getEmail());
            currUser.setTel(user.getTel());
            currUser.setZipcode(user.getZipcode());
            currUser.setAddress(user.getAddress());
            currUser.setSubAddress(user.getSubAddress());
            currUser.setSocialId(user.getSocialId());
            currUser.setIssueDate(user.getIssueDate());
            currUser.setIssuePlace(user.getIssuePlace());
            currUser.setUserStatus(user.getUserStatus());
            currUser.setModUserNo(userNo);
            // update user info
            userService.update(currUser);

            List<UserGroup> userGroupListOfUser = user.getUserGroupListOfUser();
            UserGroup userGroup = userGroupListOfUser.get(0);
            if (userGroup.getIsUpdate() == true) {
                userGroupUsersService.deleteByUserNo(currUser.getUserNo());
                UserGroupUsers userGroupUsers = new UserGroupUsers();
                userGroupUsers.setUserGroupNo(userGroup.getUserGroupNo());
                userGroupUsers.setUserNo(currUser.getUserNo());
                userGroup.setRegUserNo(userNo);
                userGroupUsersService.insert(userGroupUsers);
            }
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    /**
     * Check email
     *
     * @param email
     * @return return exist or not
     * @throws Exception
     */
    @RequestMapping(value = "/user/email/checkexist")
    @ResponseBody
    public JsonResponse checkEmailExist(String email) throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("email", email);
            List<UserVO> users = userService.list(params);
            if (users.size() > 0){
                jsonResponse.setData(true);
            } else {
                jsonResponse.setData(false);
            }
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    /**
     * Check email
     *
     * @param listUserNo
     * @return status of delete
     * @throws Exception
     */
    @RequestMapping(value = "/user/delete")
    @ResponseBody
    public JsonResponse deleteSelectUser(@RequestParam String listUserNo) throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            List<String> listUserNoObj = JsonUtil.parseJSON(listUserNo, List.class);
            for(String userNo : listUserNoObj){
                userService.deleteByPK(Long.valueOf(userNo));
            }
            jsonResponse.setData(true);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    /**
     * Update password
     *
     * @param password
     * @return return success or fail
     * @throws Exception
     */
    @RequestMapping(value = "/user/password/update")
    @ResponseBody
    public JsonResponse updatePassword(Long userNo, String password) throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            UserVO user = userService.getByPK(userNo);
            String encodePassword = passwordUtil.encodePassword(password);
            user.setPassword(encodePassword);
            user.setPasswordModDate(new Date());
            userService.update(user);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

    /**
     * Download user information
     *
     * @param response
     * @param userNo
     *
     * @throws Exception
     */
    @RequestMapping(value = "/user/download/user/info")
    @ResponseBody
    public void downloadUserInfo(HttpServletResponse response,@PathParam(value = "userNo") Long userNo) throws Exception {

        response.setContentType("application/vnd.ms-excel");
        response.addHeader("Content-Disposition", "attachment; filename=user.xls");
        try {
            OutputStream outputStream = response.getOutputStream();
            UserVO user = userService.getByPK(userNo);
            List<UserVO> users = new ArrayList<>();
            users.add(user);
            userExcelService.doExportUserList(outputStream, users);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

    }

    /**
     * Download user list
     *
     * @param response
     *
     * @throws Exception
     */
    @RequestMapping(value = "/user/download/user/list")
    @ResponseBody
    public void downloadUserList(HttpServletResponse response) throws Exception {

        response.setContentType("application/vnd.ms-excel");
        response.addHeader("Content-Disposition", "attachment; filename=users.xls");
        try {
            Map<String, Object> params = new HashMap<>();
            OutputStream outputStream = response.getOutputStream();
            List<UserVO> users = userService.list(params);
            userExcelService.doExportUserList(outputStream, users);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }

    }

    /**
     * Download user information sample
     *
     * @param response
     *
     * @throws Exception
     */
    @RequestMapping(value = "/user/download/user/info/sample")
    @ResponseBody
    public void downloadUserInfoSample(HttpServletResponse response) throws Exception {

        response.setContentType("application/vnd.ms-excel");
        response.addHeader("Content-Disposition", "attachment; filename=example.xls");
        try {
            OutputStream outputStream = response.getOutputStream();
            UserVO user = new UserVO();
            user.setId("id");
            user.setPassword("namoWeb1234!");
            user.setName("테스터");
            user.setNickname("tester");
            user.setEmail("sample@gmail.com");
            user.setTel("01012345678");
            user.setZipcode("123456");
            user.setAddress("Address");
            user.setSubAddress("Detail address");
            List<UserVO> users = new ArrayList<>();
            users.add(user);
            userExcelService.doExportUserList(outputStream, users);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    /**
     * Upload user information
     *
     * @param file
     *
     * @throws Exception
     */
    @RequestMapping(value = "/user/upload/userinfo", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse uploadUserInfo(@RequestParam("file") MultipartFile file, HttpServletRequest request) throws Exception {

        JsonResponse jsonResponse = new JsonResponse();
        try {
            Long userNo = RequestUtil.getUserInfoInSession(request).getUserNo();
            userExcelService.doImport(file.getInputStream(), userNo, jsonResponse);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;

    }

    @RequestMapping(value = "/user/checkUserID.json", method = RequestMethod.POST)
    @ResponseBody
    public Object checkUserID(String userId, String currId){
        Map<String, Object> json = new HashMap<>();
        json.put("valid", true);
        if(!currId.equalsIgnoreCase(userId)) {
            UserVO user = userService.getByUserId(userId);
            if (user != null) {
                json.put("valid", false);
            }
        }
        return json;
    }

    /**
     * check Username if validation or not
     * @param nickname user name
     * @return JSON string in Response body
     * @throws Exception
     */
    @RequestMapping(value = "/user/checkUserNickName.json")
    @ResponseBody
    public Object checkUserNickName(String nickname, String currNickname) throws Exception {

        Map<String, Object> json = new HashMap<>();
        json.put("valid", true);
        if(!currNickname.equalsIgnoreCase(nickname)) {
            Map<String, Object> params = new HashMap<>();
            params.put("nickname", nickname);
            List<UserVO> list = userService.list(params);
            if (list.size() > 0) {
                json.put("valid", false);
            }
        }
        return json;
    }

    /**
     * Update user detail
     *
     * @param user
     * @return A JSON object that represents the status update
     * @throws Exception
     */
    @RequestMapping(value = "/user/create", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse createUser(@RequestBody UserVO user, HttpServletRequest request) throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            String password =  user.getPassword();
            String passwordEnc = passwordUtil.encodePassword(password);
            user.setPassword(passwordEnc);
            user.setPasswordModDate(new Date());
            user.setUserStatus(CommonConstants.USER_STATUS_APPROVAL);
            user.setAdminYn(false);
            Long userNo = RequestUtil.getUserInfoInSession(request).getUserNo();
            user.setRegUserNo(userNo);
            user.setModUserNo(userNo);
            userService.insert(user);

            Long newUserNo = user.getUserNo();

            List<UserGroup> userGroup = user.getUserGroupListOfUser();
            UserGroupUsers userGroupUsers = new UserGroupUsers();
            if(userGroup.size() > 0){
                for (int i = 0 ; i < userGroup.size(); i++){
                    UserGroup group = userGroup.get(i);
                    userGroupUsers.setUserNo(newUserNo);
                    userGroupUsers.setRegUserNo(userNo);
                    userGroupUsers.setUserGroupNo(group.getUserGroupNo());
                    userGroupUsersService.insert(userGroupUsers);
                }
            }
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }
}
