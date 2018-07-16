package com.namowebiz.mugrun.applications.siteadmin.dao.user;

import com.namowebiz.mugrun.applications.siteadmin.models.user.User;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Created by ngo.ty on 6/6/2016.
 */
@Component
public interface UserMapper {

    UserVO getByPK(Long userNo);

    UserVO getByUserId(String userId);

    UserVO getByUserIdAndAdminYn(@Param("userId") String userId, @Param("adminYn") Integer adminYn);

    User selectByToken(String token);

    void insert(User user);

    void update(User user);

    void deleteByPK(Long userNo);
    
    UserVO findByEmail(String userName);

    List<UserVO> list(Map<String, Object> params);

    public Long countList(Map<String, Object> params);

    void updateToken(User user);

    UserVO getUserInfoByPhone(@Param("name")String id, @Param("tel") String tel);

    void updateUserCertDi(@Param("userNo")Long userNo, @Param("certDi")String certDi, @Param("modUserNo")Long modUserNo);

    UserVO getUserInfoByCertDI(@Param("certDi")String certDi);

    List<UserVO> getUserByGroup(Map<String, Object> params);

    List<UserVO> getUserWithGroup(Map<String, Object> params);

    List<UserVO> listUserPoint(Map<String, Object> params);

}
