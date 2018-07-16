package com.namowebiz.mugrun.applications.framework.services.authentication.handlers;

import com.namowebiz.mugrun.applications.framework.helper.StringUtil;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.web.servlet.FlashMap;
import org.springframework.web.servlet.support.SessionFlashMapManager;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Handler class for failed authentication for user pages.
 */
public class FailureHandler extends SimpleUrlAuthenticationFailureHandler {
    private static final String LOGIN_URL_PARAMETER = "loginUrl";
    private String redirectUri;

    public FailureHandler(String redirectUri) {
        super();
        this.redirectUri = redirectUri;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception)
            throws IOException, ServletException {
        String loginURI = this.redirectUri;
        if(!StringUtil.isEmpty(request.getParameter(LOGIN_URL_PARAMETER))){
            loginURI = request.getParameter(LOGIN_URL_PARAMETER);
        }

        SessionFlashMapManager sessionFlashMapManager = new SessionFlashMapManager();
        FlashMap fm = new FlashMap();
        fm.put("errorMessage", exception.getMessage());
        fm.put("userId", request.getParameter("userId"));
        sessionFlashMapManager.saveOutputFlashMap(fm, request, response);

        this.getRedirectStrategy().sendRedirect(request, response, loginURI);

    }
}
