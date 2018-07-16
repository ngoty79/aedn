package com.namowebiz.mugrun.applications.siteadmin.models.user;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by jipark on 7/17/2016.
 */
public class UserAddItem extends BaseObject{

    @Getter @Setter
    private Long itemNo;

    @Getter @Setter
    private String itemName;

    @Getter @Setter
    private String itemType;

    @Getter @Setter
    private Integer viewOrder;

    @Getter @Setter
    private Integer requiredYn;

    @Getter @Setter
    private String helpMsg;

    @Getter @Setter
    private String defaultValue;
}
