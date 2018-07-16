package com.namowebiz.mugrun.applications.siteadmin.models.salary;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * Created by asuspc on 10/30/2017.
 */
@Getter
@Setter
public class SalaryDetail extends BaseObject {
    public static final String APPROVE = "A";
    public static final String WAITING = "W";
    private Long salaryDetailNo;
    private Long userNo;
    private String status;
    private Integer salary;
    private Integer allowance;
    private Integer insurance;
    private Integer extraCost;
    private Integer month;
    private Integer year;
    private Date approveDate;
    private Long approveUserNo;
}
