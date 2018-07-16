package com.namowebiz.mugrun.applications.framework.models.menu;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by NgocSon on 6/28/2016.
 */
public class AdminMenuVO extends AdminMenu {

    private List<AdminMenuVO> childMenus = new ArrayList<>();

    public List<AdminMenuVO> getChildMenus() {
        return childMenus;
    }

    public void setChildMenus(List<AdminMenuVO> childMenus) {
        this.childMenus = childMenus;
    }
}
