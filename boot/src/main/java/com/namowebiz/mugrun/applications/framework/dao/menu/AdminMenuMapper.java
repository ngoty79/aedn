package com.namowebiz.mugrun.applications.framework.dao.menu;


import com.namowebiz.mugrun.applications.framework.models.menu.AdminMenu;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Interface containing crud actions for AdminMenu.
 * Implementation of this interface is wired by Spring Mybatis.
 *
 * Created by NgocSon on 2/17/2016.
 */
@Component
public interface AdminMenuMapper {
    /**
     * Get an admin_menu record using its menu_code.
     *
     * @param menuCode the menu_code value of admin_menu
     * @return the AdminMenu object of admin_menu record
     */
    AdminMenu get(String menuCode);

    /**
     * Get all admin menus for a role.
     *
     * @param authGroupCode the authGroupCode of admin role
     * @return a list of AdminMenu objects of admin role
     */

    List<AdminMenu> getAdminMenusForRole(@Param("authGroupCode") String authGroupCode);

    List<AdminMenu> getChildAdminMenus();
}
