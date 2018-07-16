package com.namowebiz.mugrun.applications.framework.configuration;

import com.namowebiz.mugrun.applications.framework.models.authentication.AuthUser;
import com.namowebiz.mugrun.applications.framework.services.authentication.AuthenticationUserService;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.stereotype.Component;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

@Component(value = "tokenAuthenticationFilter")
public class TokenAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    private static final String SECURITY_TOKEN_KEY = "token";
    @Autowired
    private AuthenticationUserService authenticationUserService;
    @Value("${api.token.timeout.days}")
    private int dayNo;

    public TokenAuthenticationFilter() {
        super("/");
        this.setAuthenticationManager(new AuthenticationManager() {
            @Override
            public Authentication authenticate(Authentication authentication) throws AuthenticationException {
                return null;
            }
        });
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        return null;
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");

        String token = request.getParameter(SECURITY_TOKEN_KEY);
        if (token != null && !"/api/login".equals(request.getRequestURI())) {
            Authentication authResult = authUserByToken(token);
            if (authResult == null) {
                response.getWriter().write("{\"authenticationStatus\": \"failed\"}");
                response.setContentType(MediaType.APPLICATION_JSON.toString());
            } else {
                successfulAuthentication(request, response, chain, authResult);
                chain.doFilter(request, response);
            }
        } else {
            chain.doFilter(request, response);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        SecurityContextHolder.getContext().setAuthentication(authResult);
    }

    private AbstractAuthenticationToken authUserByToken(String token) {
        AbstractAuthenticationToken authToken;
        AuthUser user = this.authenticationUserService.selectAuthUserByToken(token);
        if (user == null || (dayNo >= 0 && DateUtils.addDays(new Date(), -dayNo).after(user.getLastAccessTime()))) {
            return null;
        } else {
            authToken = new UsernamePasswordAuthenticationToken(user, token, user.getAuthorities());
            return authToken;
        }
    }
}