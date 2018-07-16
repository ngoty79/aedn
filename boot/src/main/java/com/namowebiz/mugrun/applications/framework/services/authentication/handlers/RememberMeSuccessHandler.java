package com.namowebiz.mugrun.applications.framework.services.authentication.handlers;

import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Handler for success remember-me authentication for usage in mobile web apps.
 * Created by NgocSon on 3/8/2017.
 */
public class RememberMeSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    private RequestCache requestCache = new HttpSessionRequestCache();

    public RememberMeSuccessHandler(String targetUrl) {
        super();
        this.setDefaultTargetUrl(targetUrl);
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {
        UserVO loginUser = RequestUtil.getUserInfoInSession(request);
        if (loginUser == null) {
            loginUser = (UserVO) authentication.getPrincipal();
            RequestUtil.setUserInfo(request, loginUser);
        }
        clearAuthenticationAttributes(request);

        super.onAuthenticationSuccess(request, response, authentication);
    }

    @Override
    public void setRequestCache(RequestCache requestCache) {
        this.requestCache = requestCache;
    }
}
