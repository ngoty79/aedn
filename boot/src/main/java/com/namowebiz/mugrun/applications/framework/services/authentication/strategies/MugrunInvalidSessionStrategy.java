package com.namowebiz.mugrun.applications.framework.services.authentication.strategies;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.session.InvalidSessionStrategy;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class MugrunInvalidSessionStrategy implements InvalidSessionStrategy {
    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    public MugrunInvalidSessionStrategy(String loginUrl) {
        this.loginUrl = loginUrl;
    }

    private final String loginUrl;


    @Override
    public void onInvalidSessionDetected(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        Cookie cookie = new Cookie("SESSION", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        if ("".equals(request.getRequestURI())
                || "/".equals(request.getRequestURI())
                || "/index".equals(request.getRequestURI())) {
            request.getSession();
            redirectStrategy.sendRedirect(request, response, CommonConstants.USER_INDEX_URL);
        } else {
            if (request.getRequestURI().endsWith(".json")) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            } else {
                request.getSession();
                redirectStrategy.sendRedirect(request, response, loginUrl);
            }
        }
    }
}