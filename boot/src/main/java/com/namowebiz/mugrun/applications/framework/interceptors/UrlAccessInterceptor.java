package com.namowebiz.mugrun.applications.framework.interceptors;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.framework.models.menu.AdminMenuVO;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import org.apache.commons.lang.StringUtils;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**
 * Interceptor to check user's authorized access to a specific url.
 * Created by NgocSon on 2016/02/23.
 */
public class UrlAccessInterceptor extends HandlerInterceptorAdapter {
    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response, Object handler) throws Exception {
        UserVO loginUser = RequestUtil.getUserInfoInSession(request);
        String uri = request.getRequestURI();
        if (loginUser != null) {
            if ("/login".equals(uri)) {
                response.sendRedirect("/");
                return true;
            }
            String requestedWithHeader = request.getHeader("X-Requested-With");
            if(uri.startsWith("/user") || uri.indexOf("/popup")>0
                    || "XMLHttpRequest".equals(requestedWithHeader) ){
                return true;
            }
            boolean canAccess = checkUrlAccess(request, loginUser);

            if (!canAccess) {
                String targetUrl = CommonConstants.USER_INDEX_URL;
                if(loginUser.getMyAdminMenu().size() > 0){
                    AdminMenuVO menu = loginUser.getMyAdminMenu().get(0);
                    if(!StringUtils.isEmpty(menu.getMenuUrl())){
                        targetUrl = menu.getMenuUrl();
                    }else{
                        if(menu.getChildMenus().size() > 0){
                            targetUrl = menu.getChildMenus().get(0).getMenuUrl();
                        }
                    }

                }
                response.sendRedirect(targetUrl);
                return false;
            }
        }

        return true;
    }

    private boolean checkUrlAccess(HttpServletRequest request, UserVO user) {
        List<AdminMenuVO> menus = user.getMyAdminMenu();
        List<AdminMenuVO> menuList = new ArrayList<>();

        for (AdminMenuVO menu : menus) {
            menuList.add(menu);
            for (AdminMenuVO secondMenu : menu.getChildMenus()) {
                menuList.add(secondMenu);
            }
        }

        for (AdminMenuVO menu : menuList) {
            if (!StringUtils.isEmpty(menu.getMenuUrl())
                    && isPrefixMatch(request.getRequestURI(), menu.getMenuUrl())) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the request uri matches with the prefix of the page which user can access.
     *
     * @param requestUri the uri of the request
     * @param pageUrl    the url of a page which user can access
     * @return true if prefix matches, otherwise false
     */
    private boolean isPrefixMatch(String requestUri, String pageUrl) {
        String pagePrefix = pageUrl.substring(0, pageUrl.lastIndexOf("/") + 1);
        return requestUri.startsWith(pagePrefix);
    }

    /**
     * Check if request uri is a common access url which any user can access.
     *
     * @param requestUri the uri of the request
     * @return true if request is for a common access url
     */
//    private boolean isCommonAccessUrl(String requestUri) {
//        if ("/".equals(requestUri)
//                || CommonConstants.DASHBOARD_INDEX_URL.equals(requestUri)
//                || requestUri != null && requestUri.startsWith("/mobile/")
//                || requestUri != null && requestUri.startsWith("/error/")
//                || requestUri != null && requestUri.startsWith("/common/")) {
//            return true;
//        } else {
//            return false;
//        }
//    }
}
