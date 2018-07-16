package com.namowebiz.mugrun.applications.siteadmin.models.common;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 9/19/2017.
 */
public class Town {
    @Getter
    @Setter
    private Long townNo;
    @Getter
    @Setter
    private Long districtNo;

    @Getter @Setter
    private String name;
    @Getter @Setter
    private String districtName;
    @Getter @Setter
    private String provinceName;
    @Getter @Setter
    private Boolean deleteYn;



}
