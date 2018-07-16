package com.namowebiz.mugrun.components.modules.login.controller;

import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.framework.common.utils.TripleDesTool;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by ngo.ty on 6/27/2016.
 */
@Controller
@RequestMapping("/site/view/login/")
public class LoginController {
    private static final String SYSTEM_ATTR_USERNO = "_site_user_no";
    private static final String SYSTEM_ATTR_USERID = "_site_user_id";
    private static TripleDesTool tripleDesTool = new TripleDesTool();

    @Autowired
    private UserService userService;

    @RequestMapping("login.json")
    @ResponseBody
    public Object login(String userId, String password, Boolean stayLogin, HttpServletRequest request,
                      HttpServletResponse response) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("success", false);
        if(userService.getByUserId(userId) == null){
            map.put("wrongId", true);
        }else{
            UserVO user = userService.getByUserIdAndPassword(userId, password);
            if (user != null) {
                if (!user.getAdminYn()) {
                    request.getSession().setAttribute(SYSTEM_ATTR_USERNO, user.getUserNo());
                    request.getSession().setAttribute(SYSTEM_ATTR_USERID, user.getId());
                    userService.gainSpringAuthentication(user);
                    Boolean flag = new Boolean(true);
                    if (flag.equals(stayLogin)) {
                        String key = user.getUserNo() + "_" + user.getId();
                        String encryptString = tripleDesTool.encrypt(key);
                        map.put("encryptString", encryptString);
                    }
                    RequestUtil.setUserInfo(request, user);
                    map.put("success", true);
                } else {
                    map.put("invalidRole", true);
                }
            }else{
                map.put("wrongPassword", true);
            }
        }
        return map;
    }


}
