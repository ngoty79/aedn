package com.namowebiz.mugrun.applications.siteadmin.service.permission;

import com.namowebiz.mugrun.applications.siteadmin.dao.permission.MenuPermissionMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.permission.MenuPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by asuspc on 11/18/2017.
 */
@Service
public class MenuPermissionService {
    @Autowired
    private MenuPermissionMapper menuPermissionMapper;

    public void insert(MenuPermission userMenu){
        menuPermissionMapper.insert(userMenu);
    }

    public void insertList(List<MenuPermission> userMenu){
        menuPermissionMapper.insertList(userMenu);
    }

    public void deleteByUserNo(Long userNo){
        menuPermissionMapper.deleteByUserNo(userNo);
    }
}
