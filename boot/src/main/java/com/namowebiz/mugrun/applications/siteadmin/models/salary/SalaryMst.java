package com.namowebiz.mugrun.applications.siteadmin.models.salary;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 10/30/2017.
 */
@Getter
@Setter
public class SalaryMst extends BaseObject {
    private Long salaryMasterNo;
    private Long userNo;
    private Integer salary;
    private Integer allowance;
    private Integer insurance;
    private Integer extraCost;
    private Integer deleteYn;
}
