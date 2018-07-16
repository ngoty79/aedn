package com.namowebiz.mugrun.applications.siteadmin.dao.usergroup;

import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroupUsers;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * UserGroupDao
 *
 * @author Vinh
 * @since 1.0
 */
@Repository
public interface UserGroupUsersMapper {

    public void insert(UserGroupUsers userGroupUsers);

    public void deleteByUserNo(Long userNo);

    void deleteByPK(@Param("userGroupNo")Long userGroupNo, @Param("userNo")Long userNo);

    UserGroupUsers checkUsersAssigned(@Param("listUserNo")List<Integer> listUserNo, @Param("userGroupNo")Long userGroupNo);

    UserGroupUsers getByPK(@Param("userGroupNo")Long userGroupNo, @Param("userNo")Long userNo);

    List<UserGroupUsers> getByUserNo(@Param("userNo")Long userNo);

    List<UserGroupUsers> getByUserGroupNo(@Param("userGroupNo")Long userGroupNo);

    void deleteOtherGroupOfUser(@Param("userNo")Long userNo, @Param("userGroupNo")Long userGroupNo);

    void updateUserGroupNo(@Param("oldUserGroupNo")Long oldUserGroupNo, @Param("newUserGroupNo")Long newUserGroupNo);
}
