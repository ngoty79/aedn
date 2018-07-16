package com.namowebiz.mugrun.applications.siteadmin.models.user;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by jipark on 7/17/2016.
 */
public class UserAddInfoVO extends UserAddInfo{

    @Getter @Setter
    private String itemName;

    @Getter @Setter
    private String itemType;

    @Getter @Setter
    private Integer requiredYn;

    @Getter @Setter
    private String helpMsg;

    @Getter @Setter
    private String defaultValue;
}
