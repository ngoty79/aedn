package com.namowebiz.mugrun.applications.framework.services.authentication;

import com.namowebiz.mugrun.applications.framework.common.utils.PasswordUtil;
import com.namowebiz.mugrun.applications.framework.models.authentication.AuthUser;
import com.namowebiz.mugrun.applications.framework.models.menu.AdminMenuVO;
import com.namowebiz.mugrun.applications.framework.services.menu.AdminMenuService;
import com.namowebiz.mugrun.applications.siteadmin.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.siteadmin.dao.user.UserMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.user.User;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroup;
import com.namowebiz.mugrun.applications.siteadmin.service.usergroup.UserGroupService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


/**
 * This class contains pure authentication logic, database related logic is in UserService
 */
@Component(value = "authenticationUserService")
public class AuthenticationUserService implements UserDetailsService {
    private static final String INVALID_PASSWORD = "msg.auth.invalid";
    private static final String INVALID_USERID = "msg.auth.invalid";
    private static final String LIMITED_ACCESS = "msg.auth.limited.access";
    private static final String NONE_ADMIN_ROLE = "msg.auth.none.admin.role";

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordUtil passwordUtil;
    @Autowired
    private AdminMenuService adminMenuService;
    @Autowired
    private UserGroupService userGroupService;


    public AuthUser authenticate(String userId, String password) {
        return authenticateUser(userId, password);
    }


    public String getRole() {
        AuthUser principal = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ((SimpleGrantedAuthority) principal.getAuthorities().toArray()[0]).getAuthority();
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        return this.selectAuthUser(userId);
    }

    public AuthUser selectAuthUserByToken(String userId) {
        User user = userMapper.selectByToken(userId);
        userMapper.updateToken(user);
        return selectAuthUser(userId);
    }

    public AuthUser selectAuthUser(String userId) {
        User user = userMapper.getByUserId(userId);;
        AuthUser authUser = getAuthUser(user);
        if (authUser == null) {
            return null;
        }
        return loadUserAdminMenu(authUser);
    }

    private AuthUser loadUserAdminMenu(AuthUser authUser){
        List<AdminMenuVO> myAdminMenu = new ArrayList();

        if(authUser.getAdminYn() != null && authUser.getAdminYn() == true){
            authUser.setApproveYn(true);
            authUser.setFinishYn(true);
            authUser.setCostYn(true);
            authUser.setRevenueYn(true);
            authUser.setCapitalYn(true);
            myAdminMenu = adminMenuService.getUserAdminMenu(null, authUser);
        }else{
            List<UserGroup> groups = userGroupService.getUserGroupListOfUser(authUser.getUserNo());
            if(groups != null && !groups.isEmpty()){
                UserGroup userGroup = groups.get(0);
                authUser.copyPermission(userGroup);
                myAdminMenu = adminMenuService.getUserAdminMenu(null, authUser);
            }
        }

        authUser.setMyAdminMenu(myAdminMenu);
        return authUser;
    }

    private AuthUser authenticateUser(String userId, String password) {
        AuthUser authUser = this.selectAuthUser(userId);
        if (authUser == null) {
            throw new BadCredentialsException(INVALID_USERID);
        } else {
            if(!CommonConstants.USER_STATUS_APPROVAL.equals(authUser.getUserStatus()))
                throw new BadCredentialsException(INVALID_USERID);
        }

        if (!isPasswordValid(authUser, password)) {
            throw new BadCredentialsException(INVALID_PASSWORD);
        }

        return authUser;
    }


    private AuthUser getAuthUser(User user) {
        if (user != null) {
            AuthUser authUser = new AuthUser();
            BeanUtils.copyProperties(user, authUser);
            return authUser;
        } else {
            return null;
        }
    }

    private boolean isPasswordValid(User user, String password) {
        return passwordUtil.isPasswordValid(user.getPassword(), password);
    }
}
