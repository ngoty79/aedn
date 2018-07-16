package com.namowebiz.mugrun.applications.framework.models.menu;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * POJO class for admin_menu.
 * Created by NgocSon on 2/17/2016.
 */
@SuppressWarnings("PMD.UnusedPrivateField")
public class AdminMenu extends BaseObject {
    @Getter @Setter
    private String menuCode;

    @Getter @Setter
    private String parentMenuCode;

    @Getter @Setter
    private String menuName;

    @Getter @Setter
    private String description;

    @Getter @Setter
    private String menuUrl;

    @Getter @Setter
    private String authGroupData;
    @Getter @Setter
    private String systemType;

    @Getter @Setter
    private String iconClass;

    @Getter @Setter
    private Boolean useYn;
}
