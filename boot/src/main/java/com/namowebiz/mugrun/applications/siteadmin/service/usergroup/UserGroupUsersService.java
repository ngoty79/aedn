package com.namowebiz.mugrun.applications.siteadmin.service.usergroup;

import com.namowebiz.mugrun.applications.siteadmin.dao.usergroup.UserGroupUsersMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroupUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


/**
 * UserGroupService
 *
 * @author Vinh
 * @since 1.0
 */
@Service
public class UserGroupUsersService {
    @Autowired
    private UserGroupUsersMapper userGroupUsersDao;

    public void insert(UserGroupUsers userGroupUsers){
        userGroupUsersDao.insert(userGroupUsers);
    }


    public void deleteByUserNo(Long userNo){
        userGroupUsersDao.deleteByUserNo(userNo);
    }
}
