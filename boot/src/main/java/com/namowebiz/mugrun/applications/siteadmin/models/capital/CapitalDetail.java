package com.namowebiz.mugrun.applications.siteadmin.models.capital;

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
public class CapitalDetail extends BaseObject {
    public static final String APPROVE = "A";
    public static final String WAITING = "W";
    public static final String FINISH = "F";
    public static final String CAPITAL_IN = "1";
    public static final String CAPITAL_OUT = "0";
    private Long capitalDetailNo;
    private String title;
    private String status;
    private String capitalType;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date startDate;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date endDate;
    private Long amount;
    private Date approveDate;
    private Long approveUserNo;
    private Date finishDate;
    private Long finishUserNo;

    private String notice;
}
