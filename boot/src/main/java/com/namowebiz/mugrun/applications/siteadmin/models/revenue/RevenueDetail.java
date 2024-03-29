package com.namowebiz.mugrun.applications.siteadmin.models.revenue;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by asuspc on 11/12/2017.
 */
@Getter
@Setter
public class RevenueDetail extends BaseObject {
    public static final String APPROVE = "A";
    public static final String WAITING = "W";
    private Long revenueDetailNo;
    private String name;
    private String status;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date date;
    private Long amount;
    private Date approveDate;
    private Long approveUserNo;
    private String notice;
    private String revenueType;
}
