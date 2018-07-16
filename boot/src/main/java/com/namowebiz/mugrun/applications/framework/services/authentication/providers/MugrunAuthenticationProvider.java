package com.namowebiz.mugrun.applications.framework.services.authentication.providers;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.common.data.Role;
import com.namowebiz.mugrun.applications.framework.configuration.SecurityConfiguration;
import com.namowebiz.mugrun.applications.framework.models.authentication.AuthUser;
import com.namowebiz.mugrun.applications.framework.services.authentication.AuthenticationUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * GolfAuthenticationProvider class for Admin.
 */
@Component(value = "mugrunAuthenticationProvider")
public class MugrunAuthenticationProvider implements AuthenticationProvider {
    @Autowired
    protected AuthenticationUserService authenticationUserService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        try {
            String userId = authentication.getName();
            String password = (String) authentication.getCredentials();

            RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
            HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
            boolean isAdminLogin = this.isAdminLogin(request);
            String role = Role.ROLE_ADMIN.getRoleName();

            AuthUser user = authenticationUserService.authenticate(userId, password);
            return new UsernamePasswordAuthenticationToken(user, user.getPassword(), user.getAuthorities(role));
        } catch (DisabledException e) {
            throw new DisabledException(e.getMessage(), e);
        } catch (BadCredentialsException e) {
            throw new AuthenticationServiceException(e.getMessage(), e);
        }  catch (Exception ex) {
            ex.printStackTrace();
            throw new AuthenticationServiceException(CommonConstants.SERVER_ERROR_MSG_CODE);
        }
    }

    @Override
    public boolean supports(Class<? extends Object> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }

    private boolean isAdminLogin(HttpServletRequest request){
        String uri = request.getRequestURI();
        if(uri.startsWith(SecurityConfiguration.ADMIN_LOGIN_URL)){
            return true;
        }
        return false;
    }
}
