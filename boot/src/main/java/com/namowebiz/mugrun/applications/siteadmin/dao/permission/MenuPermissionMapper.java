package com.namowebiz.mugrun.applications.siteadmin.dao.permission;

import com.namowebiz.mugrun.applications.siteadmin.models.permission.MenuPermission;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by asuspc on 11/15/2017.
 */
@Repository
public interface MenuPermissionMapper {

    void insert(MenuPermission userMenu);

    void insertList(@Param("userMenuList") List<MenuPermission> userMenu);

    void deleteByUserNo(Long userNo);
}
