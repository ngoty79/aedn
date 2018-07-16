package com.namowebiz.mugrun.applications.siteadmin.models.permission;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 11/15/2017.
 */
@Getter @Setter
public class MenuPermission extends BaseObject {
    private Long permissionNo;
    private Long userGroupNo;
    private String menuCode;

}
