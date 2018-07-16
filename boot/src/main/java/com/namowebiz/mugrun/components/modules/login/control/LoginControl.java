package com.namowebiz.mugrun.components.modules.login.control;


import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.common.utils.TripleDES;
import com.namowebiz.mugrun.applications.framework.helper.StringUtil;
import com.namowebiz.mugrun.applications.framework.services.component.control.AbstractComponentControl;
import com.namowebiz.mugrun.applications.framework.services.component.data.ComponentResultModel;
import com.namowebiz.mugrun.applications.siteadmin.models.user.User;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by ngo.ty on 6/24/2016.
 */
@Component
@CommonsLog
public class LoginControl extends AbstractComponentControl {
    @Autowired
    private UserService userService;
    @Autowired
    private MessageSource messageSource;

    @Override
    public String getScene(HttpServletRequest request){
        return ComponentResultModel.DEFAULT_SCENE_NAME;
    }

    @Override
    public ComponentResultModel doControl(HttpServletRequest request, HttpServletResponse response,
                                          Map<String, Object> componentConfig) {
        ComponentResultModel componentResultModel = new ComponentResultModel();
        Map<String, Object> result = new HashMap<>();

        User stayLoginUser = this.getRememberUser(request);
        String targetUri = CommonConstants.USER_INDEX_URL;
        if(componentConfig.containsKey("targetUrl")){
            targetUri = String.valueOf(componentConfig.get("targetUrl"));
        }
        if(!StringUtil.isEmpty(request.getParameter(CommonConstants.TARGET_URL_PARAMETER))){
            targetUri = request.getParameter(CommonConstants.TARGET_URL_PARAMETER);
        }
        result.put("loginSuccess", false);
        String loginUrl = request.getRequestURI();
        if(!StringUtil.isEmpty(request.getQueryString())){
            loginUrl += "?" + request.getQueryString();
        }
        result.put("loginUrl", loginUrl);
        request.setAttribute(CommonConstants.TARGET_URL_PARAMETER, targetUri);

        if(stayLoginUser != null){
            try {
                userService.gainSpringAuthentication(stayLoginUser);
                result.put("loginSuccess", true);
            } catch (Exception e) {
                e.printStackTrace();
                log.error(e.getMessage());
            }
        }


        componentResultModel.setResult(result);
        return componentResultModel;
    }


    private User getRememberUser(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        User stayLoginUser = null;

        if(cookies!=null){
            for (int i = 0; i < cookies.length; i++) {
                Cookie cookie = cookies[i];
                if (CommonConstants.MODULE_LOGIN_STAY_ON_COOKIE.equals(cookie.getName())) {
                    try{
                        String encryptString = cookie.getValue();
                        encryptString = URLDecoder.decode(encryptString, "UTF-8");
                        String key = TripleDES.decrypt(encryptString);
                        String strNo = key.split("_")[0];
                        stayLoginUser = userService.getByPK(Long.parseLong(strNo)) ;
                    }
                    catch (Exception ignore){
                        // Ignore
                        log.error(ignore.getMessage());
                    }
                }
            }
        }

        return stayLoginUser;
    }
}
