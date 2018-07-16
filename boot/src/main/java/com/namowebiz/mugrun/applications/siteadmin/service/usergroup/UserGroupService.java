package com.namowebiz.mugrun.applications.siteadmin.service.usergroup;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.siteadmin.dao.usergroup.UserGroupMapper;
import com.namowebiz.mugrun.applications.siteadmin.dao.usergroup.UserGroupUsersMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroup;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroupUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * UserGroupService
 *
 * @author Vinh
 * @since 1.0
 */
@Service
public class UserGroupService {
    @Autowired
    private UserGroupMapper userGroupDao;

    @Autowired
    private UserGroupUsersMapper userGroupUsersDao;

    @Autowired
    private MessageSource messageSource;

    public List<UserGroup> list(Map<String, Object> params){
        return userGroupDao.list(params);
    }

    public List<UserGroup> getUserGroups(){
        return userGroupDao.list(new HashMap());
    }

    public UserGroup getByPK(Long userGroupNo){
        if(userGroupNo != null){
            return userGroupDao.getByPK(userGroupNo);
        }
        return null;
    }

    public List<UserGroup> getUserGroupListOfUser(Long userNo){
        return userGroupDao.getUserGroupListOfUser(userNo);
    }

    public UserGroup getNoneLoginUserGroup(){
        UserGroup noneLoginGroup = new UserGroup();
        String noneLoginUserGorupName = messageSource.getMessage("module.board.noneLoginUserGorupName", null, LocaleContextHolder.getLocale());
        noneLoginGroup.setUserGroupNo(Long.parseLong(CommonConstants.NONE_LOGIN_USER_GROUP));
        noneLoginGroup.setUserGroupName( noneLoginUserGorupName );
        noneLoginGroup.setUserGroupDesc(noneLoginUserGorupName);
        return noneLoginGroup;
    }

    public Long save(UserGroup userGroup, UserVO loginUser) throws Exception {
        if(userGroup.getUserGroupNo() != null && userGroup.getUserGroupNo() > 0) {
            //Update
            userGroup.setModUserNo(loginUser.getUserNo());
            userGroupDao.update(userGroup);
        }else{
            //Insert
            userGroup.setRegUserNo(loginUser.getUserNo());
            userGroupDao.insert(userGroup);
        }
        return userGroup.getUserGroupNo();
    }

    public UserGroup checkDuplicateName(String userGroupName, Long userGroupNo) {
        Long userGNo = (userGroupNo != null && userGroupNo > 0) ? userGroupNo : null;
        return userGroupDao.checkDuplicateName(userGroupName, userGNo);
    }

    @Transactional
    public void delete(Long userGroupNo) {
        userGroupDao.deleteByPK(userGroupNo);

        UserGroup defaultUserGroup = userGroupDao.getDefaultUserGroup();
        if(defaultUserGroup != null) {
            List<UserGroupUsers> ls = userGroupUsersDao.getByUserGroupNo(userGroupNo);
            if(ls != null && ls.size() > 0) {
                userGroupUsersDao.updateUserGroupNo(userGroupNo, defaultUserGroup.getUserGroupNo());
            }
        }
    }

    public void deleteUserGroupLink(Long userGroupNo, Long userNo) {
        userGroupUsersDao.deleteByPK(userGroupNo, userNo);
    }

    @Transactional
    public void deleteMultilUserGroupLink(List<Integer> listUserNo, Long userGroupNo) {
        for(Integer userNo: listUserNo) {
            userGroupUsersDao.deleteByPK(userGroupNo, Long.parseLong(String.valueOf(userNo)));
        }
    }

    public boolean checkUsersAssigned(List<Integer> listUserNo, Long userGroupNo) {
        UserGroupUsers userGroupUsers = userGroupUsersDao.checkUsersAssigned(listUserNo, userGroupNo);
        if(userGroupUsers != null)
            return true;
        return false;
    }

    @Transactional
    public void addUsersToGroup(List<Integer> listUserNo, Long userGroupNo, Long loginUserNo) {
        for(Integer userNoInt: listUserNo) {
            Long userNo = Long.parseLong(String.valueOf(userNoInt));

            UserGroupUsers checkExist = userGroupUsersDao.getByPK(userGroupNo, userNo);
            if(checkExist == null) {
                List<Integer> listUserNos = new ArrayList<>();
                listUserNos.add(userNoInt);
                UserGroupUsers userGroupUsers = userGroupUsersDao.checkUsersAssigned(listUserNos, userGroupNo);
                if(userGroupUsers != null) {
                    userGroupUsersDao.deleteOtherGroupOfUser(userNo, userGroupNo);
                }

                UserGroupUsers ugu = new UserGroupUsers();
                ugu.setUserNo(userNo);
                ugu.setUserGroupNo(userGroupNo);
                ugu.setRegDate(new Date());
                ugu.setRegUserNo(loginUserNo);
                userGroupUsersDao.insert(ugu);
            }
        }
    }

    public void updateGroupPermission(UserGroup userGroup){
        userGroup.setModDate(new Date());
        userGroupDao.updateGroupPermission(userGroup);
    }
}
