package com.namowebiz.mugrun.applications.siteadmin.models.user;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by jipark on 7/17/2016.
 */
public class UserAddInfo extends BaseObject{
    @Getter
    @Setter
    private Long userNo;

    @Getter @Setter
    private Long itemNo;

    @Getter @Setter
    private String itemValue;
}
