package com.namowebiz.mugrun.components.modules.signup.controller;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.PasswordUtil;
import com.namowebiz.mugrun.applications.siteadmin.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroupUsers;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import com.namowebiz.mugrun.applications.siteadmin.service.usergroup.UserGroupUsersService;
import com.octo.captcha.service.CaptchaServiceException;
import com.octo.captcha.service.multitype.MultiTypeCaptchaService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * RegistrationViewController class handling all request in view page without checking authority
 * @version 1.0
 * @author ngo.ty
 */
@Controller
@CommonsLog
@RequestMapping("/site/view/signup")
public class SignupViewController {

    @Autowired
    private UserService userService;

    @Resource(name = "captchaService")
    private MultiTypeCaptchaService captchaService;

    @Autowired
    private PasswordUtil passwordUtil;

    @Autowired
    private UserGroupUsersService userGroupUsersService;

    @RequestMapping("/addStepInfoVerification.json")
    @ResponseBody
    public JsonResponse addStepInfoVerification(HttpServletRequest request, String currentScene) throws Exception {
        JsonResponse jsonResponse = new JsonResponse();
        try {
            request.getSession().setAttribute("_pt_passing_" + currentScene, "true");
            request.getSession().setAttribute("_pt_date_" + currentScene, Calendar.getInstance());
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(),e);
        }
        return jsonResponse;
    }

    /**
     * check UserID if validation or not
     * @param userId user ID
     * @return JSON string in Response body
     * @throws Exception
     */
    @RequestMapping(value = "/checkUserID.json")
    @ResponseBody
    public Object checkUserID(String userId) throws Exception {

        Map<String, Object> json = new HashMap<>();
        json.put("valid", true);
        UserVO user = userService.getByUserId(userId);
        if(user != null){
            json.put("valid", false);
        }
        return json;
    }

    /**
     * check UserID if validation or not
     * @param nickname user ID
     * @return JSON string in Response body
     * @throws Exception
     */
    @RequestMapping(value = "/checkUserNickName.json")
    @ResponseBody
    public Object checkUserNickName(Long userNo, String nickname) throws Exception {

        Map<String, Object> json = new HashMap<>();
        json.put("valid", true);
        Map<String, Object> params = new HashMap<>();
        params.put("nickname", nickname);
        params.put("excludeUserNo", userNo);
        List<UserVO> list = userService.list(params);
        if(list.size() > 0){
            json.put("valid", false);
        }
        return json;
    }

    /**
     * check captcha user enter
     * @param jcaptcha jcaptcha text that user enter
     * @param request HttpServletRequest object
     * @return JSON string in Response body
     * @throws Exception
     */
    @RequestMapping("/checkCaptcha.json")
    @ResponseBody
    public Object checkCaptcha(String jcaptcha, HttpServletRequest request) throws Exception {
        Map<String, Object> map = new HashMap<>();
        map.put("valid", false);
        try {
            map.put("valid", validateCaptcha(request, jcaptcha));
            map.put("success", true);

        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            map.put("success", false);
            map.put("valid", false);
        }

        return map;
    }

    protected boolean validateCaptcha(HttpServletRequest request, String jcaptcha) {
        // If the captcha field is already rejected
        if (jcaptcha == null)
            return false;

        boolean validCaptcha = false;

        try {
            validCaptcha = captchaService.validateResponseForID((String) request.getSession().getAttribute("captcharId"), jcaptcha);
        } catch (CaptchaServiceException e) {

        }

        return validCaptcha;
    }

    /**
     * Add user detail
     *
     * @param user
     * @return A JSON object that represents the status update
     * @throws Exception
     */
    @RequestMapping(value = "/addUserData.json", method = RequestMethod.POST)
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
            userService.insert(user);

            Long newUserNo = user.getUserNo();

            UserGroupUsers groupUser = new UserGroupUsers();
            groupUser.setUserNo(newUserNo);
            groupUser.setUserGroupNo(CommonConstants.DEFAULT_USER_GROUP_NO);
            userGroupUsersService.insert(groupUser);


            jsonResponse.setData(newUserNo);
            jsonResponse.setSuccess(true);
        } catch (Exception e) {
            jsonResponse.setSuccess(false);
            log.error(e.getMessage(), e);
        }

        return jsonResponse;
    }

}
