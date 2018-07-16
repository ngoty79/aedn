package com.namowebiz.mugrun.applications.siteadmin.dao.usergroup;

import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroup;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * UserGroupDao
 *
 * @author Vinh
 * @since 1.0
 */
@Repository
public interface UserGroupMapper {

    public List<UserGroup> list(Map<String, Object> params);

    public UserGroup getByPK(Long userGroupNo);

    public List<UserGroup> getUserGroupListOfUser(Long userNo);

    void insert(UserGroup userGroup);

    void update(UserGroup userGroup);
    void updateGroupPermission(UserGroup userGroup);

    UserGroup checkDuplicateName(@Param("userGroupName")String userGroupName, @Param("userGroupNo")Long userGroupNo);

    void deleteByPK(Long userGroupNo);

    void deleteUserGroupLink(Long userGroupNo, Long userNo);

    UserGroup getDefaultUserGroup();

}
