package com.namowebiz.mugrun.applications.siteadmin.models.moenyflow;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 11/29/2017.
 */
@Getter
@Setter
public class Property extends BaseObject {
    private Long propertyNo;
    private Long cash;
    private Boolean deleteYn;

}
