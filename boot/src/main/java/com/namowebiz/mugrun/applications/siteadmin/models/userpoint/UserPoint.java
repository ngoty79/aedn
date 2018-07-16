package com.namowebiz.mugrun.applications.siteadmin.models.userpoint;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by jipark on 7/17/2016.
 */
public class UserPoint extends BaseObject{
    @Getter
    @Setter
    private Long pointNo;

    @Getter @Setter
    private Long userNo;

    @Getter @Setter
    private String pointName;

    @Getter @Setter
    private Integer pointValue;

    @Getter @Setter
    private Integer usePointValue;

    @Getter @Setter
    private String orderNo;
}
