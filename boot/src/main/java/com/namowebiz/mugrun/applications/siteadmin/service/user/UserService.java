package com.namowebiz.mugrun.applications.siteadmin.service.user;

import com.namowebiz.mugrun.applications.framework.common.data.Role;
import com.namowebiz.mugrun.applications.framework.common.utils.DateUtil;
import com.namowebiz.mugrun.applications.framework.common.utils.PasswordUtil;
import com.namowebiz.mugrun.applications.framework.models.authentication.AuthUser;
import com.namowebiz.mugrun.applications.siteadmin.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.siteadmin.dao.user.UserMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.user.User;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroup;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroupUsers;
import com.namowebiz.mugrun.applications.siteadmin.service.usergroup.UserGroupUsersService;
import jodd.util.StringUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ngo.ty on 6/7/2016.
 */
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordUtil passwordUtil;

    @Autowired
    private UserGroupUsersService userGroupUsersService;


    public UserVO getByPK(Long userNo){
        return userMapper.getByPK(userNo);
    }

    public UserVO getByUserId(String userId){
        return userMapper.getByUserId(userId);
    }

    public void insert(User user){
        userMapper.insert(user);
    }

    public void update(User user){
        userMapper.update(user);
    }

    public void deleteByPK(Long userNo){
        userMapper.deleteByPK(userNo);
    }
    
    public UserVO findByEmail(String userName){
        return userMapper.findByEmail(userName);
    }

    public List<UserVO> list(Map<String, Object> params){
        return userMapper.list(params);
    }

    public Long countList(Map<String, Object> params){
        Long count = userMapper.countList(params);
        if(count != null){
            return count;
        }
        return 0L;
    }

    public UserVO convertDateToStringOfUser(UserVO user){
        Date regDate = user.getRegDate();
        if(regDate != null) {
            String regDateStr = DateUtil.format(regDate, "yyyy-MM-dd");
            user.setRegDateStr(regDateStr);
        }

        Date modDate = user.getModDate();
        if(modDate != null) {
            String modDateStr = DateUtil.format(modDate, "yyyy-MM-dd");
            user.setModDateStr(modDateStr);
        }

        Date pointRegDate = user.getPointRegDate();
        if(pointRegDate != null) {
            String pointRegDateStr = DateUtil.format(modDate, "yyyy-MM-dd HH:mm:ss");
            user.setPointRegDateStr(pointRegDateStr);
        }

        return user;
    }



    public UserVO getByUserIdAndPassword(String userId, String password){
        UserVO user = userMapper.getByUserId(userId);
        if(user != null){
            if (isPasswordValid(user, password)) {
                return user;
            }
        }
        return null;
    }

    public boolean isPasswordValid(User user, String password) {
        return passwordUtil.isPasswordValid(user.getPassword(), password);
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

    public void gainSpringAuthentication(User user) throws Exception{
        AuthUser authUser = getAuthUser(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(authUser,  user.getPassword(),
                authUser.getAuthorities(Role.ROLE_USER.getRoleName()));
        SecurityContextHolder.getContext().setAuthentication(auth);

    }

    /**
     * Get a user by name of user and email of user
     * @param userName
     * @param userEmail
     * @return
     */
    public List<UserVO> getByUserNameAndEmail(String userName, String userEmail) {
        Map<String, Object> params = new HashMap<String, Object>(3);
        params.put("name", userName);
        params.put("email", userEmail);
        return userMapper.list(params);
    }

    /**
     * getByUserNameAndUserPhone
     * @param userName
     * @param userPhone
     * @return
     */
    public List<UserVO> getByUserNameAndUserPhone(String userName, String userPhone) {
        Map<String, Object> params = new HashMap<String, Object>(3);
        params.put("name", userName);
        params.put("tel", userPhone);
        return userMapper.list(params);
    }

    public List<UserVO> getUserByGroup(Map<String, Object> params) {
        return userMapper.getUserByGroup(params);
    }

    public List<UserVO> getUserWithGroup(Map<String, Object> params) {
        return userMapper.getUserWithGroup(params);
    }

    public List<UserVO> listUserPoint(Map<String, Object> params){
        return userMapper.listUserPoint(params);
    }

    @Transactional
    public boolean addOrUpdateUserData(UserVO userForm, Long userNo){
        boolean success = false;
        if(userForm.getUserNo() != null) {
            UserVO model = this.getByPK(userForm.getUserNo());
            if(model != null){
                if(!StringUtil.isEmpty(userForm.getPassword())){
                    String passwordEnc = passwordUtil.encodePassword(userForm.getPassword());
                    model.setPassword(passwordEnc);
                    model.setPasswordModDate(new Date());
                }
                model.setName(userForm.getName());
                model.setNickname(userForm.getNickname());
                model.setEmail(userForm.getEmail());
                model.setTel(userForm.getTel());
                model.setBirthday(userForm.getBirthday());
                model.setSex(userForm.getSex());
                model.setReceiveTypes(userForm.getReceiveTypes());
                model.setZipcode(userForm.getZipcode());
                model.setAddress(userForm.getAddress());
                model.setSubAddress(userForm.getSubAddress());
                model.setModUserNo(userNo);
                //update DB
                update(model);

                success = true;
            }
        }else{
            String password =  userForm.getPassword();
            String passwordEnc = passwordUtil.encodePassword(password);
            userForm.setPassword(passwordEnc);
            userForm.setPasswordModDate(new Date());
            userForm.setUserStatus(CommonConstants.USER_STATUS_APPROVAL);
            userForm.setAdminYn(false);
            userForm.setRegUserNo(userNo);
            userForm.setModUserNo(userNo);
            //insert into DB
            insert(userForm);

            Long newUserNo = userForm.getUserNo();

            List<UserGroup> userGroup = userForm.getUserGroupListOfUser();
            UserGroupUsers userGroupUsers = new UserGroupUsers();
            if(userGroup.size() > 0){
                for (int i = 0 ; i < userGroup.size(); i++){
                    UserGroup group = userGroup.get(i);
                    userGroupUsers.setUserNo(newUserNo);
                    userGroupUsers.setRegUserNo(userNo);
                    userGroupUsers.setUserGroupNo(group.getUserGroupNo());
                    userGroupUsersService.insert(userGroupUsers);
                }
            }

            success = true;
        }
        return success;
    }

    /**
     * quit MemberShip
     * @param userNo
     * @throws Exception
     */
    @Transactional
    public void quitMemberShip(Long userNo) throws Exception{
        User user = userMapper.getByPK(userNo);
        if(user != null){
            userGroupUsersService.deleteByUserNo(userNo);
            userMapper.deleteByPK(userNo);
        }
    }
}
