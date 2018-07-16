package com.namowebiz.mugrun.applications.framework.services.authentication;

import com.namowebiz.mugrun.applications.framework.models.authentication.AuthUser;
import com.namowebiz.mugrun.applications.siteadmin.models.user.User;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class StorageUserDetailsService implements UserDetailsService {

	@Autowired
	private UserService userService;

	@Override
	public final AuthUser loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userService.findByEmail(username);
		if(user == null) {
			throw new UsernameNotFoundException("Not Exist User");
		}
		AuthUser authUser = new AuthUser();
		BeanUtils.copyProperties(user, authUser);
		return authUser;
	}
}
