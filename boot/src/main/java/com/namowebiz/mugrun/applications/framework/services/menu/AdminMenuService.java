package com.namowebiz.mugrun.applications.framework.services.menu;

import com.namowebiz.mugrun.applications.framework.dao.menu.AdminMenuMapper;
import com.namowebiz.mugrun.applications.framework.models.authentication.AuthUser;
import com.namowebiz.mugrun.applications.framework.models.menu.AdminMenu;
import com.namowebiz.mugrun.applications.framework.models.menu.AdminMenuVO;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Service class of admin_menu.
 *
 * Created by NgocSon on 2/17/2016.
 */
@CommonsLog
@Component
public class AdminMenuService {
    @Autowired
    private AdminMenuMapper adminMenuMapper;

    /**
     * Get an admin_menu record using its menu_code.
     *
     * @param menuCode the menu_code value of admin_menu
     * @return the AdminMenu object of admin_menu record
     */
    public AdminMenu get(String menuCode) {
        return adminMenuMapper.get(menuCode);
    }

    /**
     * Get all admin menus for a role.
     *
     * @param authGroupCode the authGroupCode of admin role
     * @return a list of AdminMenu objects of admin role
     */
    public List<AdminMenu> getAdminMenusForRole(String authGroupCode) {
        return adminMenuMapper.getAdminMenusForRole(authGroupCode);
    }

    public List<AdminMenuVO> getUserAdminMenu(String authGroupCode, AuthUser user) {
        List<AdminMenuVO> userAdminMenu = new ArrayList<>();

        List<AdminMenu> allAdminMenus = adminMenuMapper.getAdminMenusForRole(authGroupCode);
        boolean isAdmin = (user.getAdminYn() != null && user.getAdminYn() == true)? true: false;
        if (allAdminMenus != null) {
            for (AdminMenu adminMenu : allAdminMenus) {
                if (adminMenu.getParentMenuCode() == null) {
                    try {
                        AdminMenuVO vo = new AdminMenuVO();
                        BeanUtils.copyProperties(vo, adminMenu);

                        for (AdminMenu secondMenus : allAdminMenus) {
                            if (secondMenus.getParentMenuCode() != null
                                    && secondMenus.getParentMenuCode().equals(vo.getMenuCode())) {
                                AdminMenuVO secondVO = new AdminMenuVO();
                                BeanUtils.copyProperties(secondVO, secondMenus);
                                if(isAdmin){
                                    vo.getChildMenus().add(secondVO);
                                }else{
                                    if(hasPermission(secondVO, user)){
                                        vo.getChildMenus().add(secondVO);
                                    }
                                }

                            }
                        }
                        if(vo.getChildMenus().size()>0){
                            userAdminMenu.add(vo);
                        }
                    } catch (Exception e) {
                        log.error(e.getMessage(), e);
                    }
                }
            }
        }

        return userAdminMenu;
    }

    public List<AdminMenu> getChildAdminMenus(){
        return adminMenuMapper.getChildAdminMenus();
    }

    private boolean hasPermission(AdminMenuVO adminMenu, AuthUser authUser){
        boolean permission = false;
        String menuCode = adminMenu.getMenuCode();
        if(authUser.getMenus() != null && authUser.getMenus().indexOf(menuCode) >= 0){
            return true;
        }

        return permission;
    }
}
