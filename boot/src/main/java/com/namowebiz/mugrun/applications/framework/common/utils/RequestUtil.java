package com.namowebiz.mugrun.applications.framework.common.utils;


import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Locale;

/**
 * Util class for request related tasks
 */
public class RequestUtil {
    /**The value of the key containing login user info in session.*/
    public static final String SESSION_LOGIN_USER_KEY = "loginUser";

    /**
     * Set logged in user info to session.
     *
     * @param request the HttpServletRequest of the http request
     * @param user the Object containing user info
     */
    public static void setUserInfo(HttpServletRequest request, UserVO user) {
        HttpSession session = request.getSession();
        session.setAttribute(SESSION_LOGIN_USER_KEY, user);
    }

    /**
     * Get logged in user info from session.
     *
     * @param request the HttpServletRequest of the http request
     * @return the Object containing user info
     */
    public static UserVO getUserInfoInSession(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute(SESSION_LOGIN_USER_KEY) != null) {
            return (UserVO) session.getAttribute(SESSION_LOGIN_USER_KEY);
        }
        return null;
    }

    public static Long getUserNo(HttpServletRequest request) {
        UserVO user = getUserInfoInSession(request);
        if(user != null){
            return user.getUserNo();
        }
        return null;
    }

    public static String getUserId(HttpServletRequest request) {
        UserVO user = getUserInfoInSession(request);
        if(user != null){
            return user.getId();
        }
        return null;
    }

    public static String getUserName(HttpServletRequest request) {
        UserVO user = getUserInfoInSession(request);
        if(user != null){
            return user.getName();
        }
        return null;
    }
    public static String getUserNickname(HttpServletRequest request) {
        UserVO user = getUserInfoInSession(request);
        if(user != null){
            return user.getNickname();
        }
        return null;
    }

    /**
     * Get the info of the current login user.
     * @return the Object containing user info
     */
    public static UserVO getLoginUserInfo() {
        UserVO userVO = null;
        try {
            userVO = (UserVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            userVO = null;
        }
        if (userVO != null && userVO.getUserNo() > 0) {
            return userVO;
        } else {
            return null;
        }
    }

    /**
     * Set data to session.
     *
     * @param request the HttpServletRequest of the http request
     * @param name the key of session attribute to set
     * @param data the data to set
     */
    public static void setSessionData(HttpServletRequest request, String name, Object data) {
        HttpSession session = request.getSession();
        session.setAttribute(name, data);
    }

    /**
     * Get data from session.
     *
     * @param request the HttpServletRequest of the http request
     * @param name the key of session attribute to get
     * @return the Object containing user info
     */
    public static Object getSessionData(HttpServletRequest request, String name) {
        HttpSession session = request.getSession();
        return session.getAttribute(name);
    }

    /**
     * Remove data from session.
     *
     * @param request the HttpServletRequest of the http request
     * @param name the key of session attribute to remove
     */
    public static void removeSessionData(HttpServletRequest request, String name) {
        HttpSession session = request.getSession();
        session.removeAttribute(name);
    }

    /**
     * Get the current locale of user.
     *
     * @return the current locale of user, or KOREA as default if not setting found.
     */
    public static Locale getCurrentLocale() {
        Locale locale = LocaleContextHolder.getLocale();
        if (locale == null) {
            locale = Locale.ENGLISH;
        }
        return locale;
    }

    public static String getCurrentDomain(HttpServletRequest request) {
        if(!"80".equals(request.getServerPort())){
            return request.getScheme() + "://" + request.getServerName()+":"+request.getServerPort();
        }
        return request.getScheme() + "://" + request.getServerName();
    }

    public static void addSessionAttr(HttpServletRequest request, String key, String val) {
        request.getSession().setAttribute(key, val);
    }

    public static String getSessionAttr(HttpServletRequest request, String key) {
        return (String) request.getSession().getAttribute(key);
    }
}
