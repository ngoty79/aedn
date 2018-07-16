package com.namowebiz.mugrun.applications.framework.services.component.control;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.helper.StringUtil;
import com.namowebiz.mugrun.applications.framework.services.component.data.ComponentResultModel;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Repository;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;

/**
 * 
 * @author Sungyeol Cho
 *
 */
@CommonsLog
@Repository
public abstract class AbstractComponentControl {
    public static final String DEFAULT_SCENE_NAME = "index";
    @Autowired
    private ApplicationContext context;

    @Getter @Setter
    private boolean redirect = false;
    @Getter @Setter
    private String redirectUri = "";

	/**
	 * 각 컨트롤별 지정된 메소드로 분기하는 추상 메소드. 컨트롤마다 구현 필요.
	 * @param request
	 * @param response
	 * @return
	 */
	public abstract ComponentResultModel doControl(HttpServletRequest request, HttpServletResponse response, Map<String,Object> componentConfig);

	public abstract String getScene(HttpServletRequest request);

    /**
     * Wrapper method of doControl
     * @param request
     * @param response
     * @param componentConfig
     */
    public ComponentResultModel runControl(HttpServletRequest request, HttpServletResponse response, Map<String,Object> componentConfig) {
        // Check login if specified in component.xml
        return doControl(request, response, componentConfig);
    }



    public void sendRedirectToLogin() {
        redirect = true;
        redirectUri = CommonConstants.USER_LOGIN_URL;
    }

    public void sendRedirectToLogin(String targetUri) {
        redirect = true;
        redirectUri = CommonConstants.USER_LOGIN_URL;
        if(!StringUtil.isEmpty(targetUri)){
            try {
                redirectUri += "?" + CommonConstants.TARGET_URL_PARAMETER + "=" + URLEncoder.encode(targetUri, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
    }

    public void sendRedirect(String url) {
        redirect = true;
        redirectUri = url;
    }

    /**
     * Get message from property file
     * @param key
     * @return
     */
    protected String getMessage(String key){
        return context.getMessage(key, null, LocaleContextHolder.getLocale());
    }
}
