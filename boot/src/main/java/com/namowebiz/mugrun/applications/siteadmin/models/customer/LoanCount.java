package com.namowebiz.mugrun.applications.siteadmin.models.customer;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 11/10/2017.
 */
@Getter
@Setter
public class LoanCount extends BaseObject{
    private String newType;
    private Integer count;
}
