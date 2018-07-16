package com.namowebiz.mugrun.applications.framework.services.authentication.handlers;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.framework.helper.StringUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Handler class for successful authentication for user pages.
 */
public class SuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {


    public SuccessHandler(String targetUrl) {
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
        String redirectUrl = getDefaultTargetUrl();
        if(!StringUtil.isEmpty(request.getParameter(CommonConstants.TARGET_URL_PARAMETER))){
            redirectUrl = request.getParameter(CommonConstants.TARGET_URL_PARAMETER);
        }
        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);

    }
}
