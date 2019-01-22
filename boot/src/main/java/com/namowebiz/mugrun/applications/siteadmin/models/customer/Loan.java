package com.namowebiz.mugrun.applications.siteadmin.models.customer;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by ngo.ty on 9/17/2017.
 */
@Getter @Setter
public class Loan extends BaseObject {
    public static final String STATUS_NEW = "N";
    public static final String STATUS_APPROVE = "A";
    public static final String STATUS_CANCEL = "C";
    public static final String STATUS_FINISHED = "F";
    public static final String STATUS_REQUEST_FINISHED = "R";

    public static final String LOAN_DAILY = "1";
    public static final String LOAN_WEEKLY = "2";
    public static final String LOAN_MONTHLY = "3";

    private Long loanNo;
    private Long customerNo;
    private Long staffUserNo;
    private Long dutyStaffNo;
    private String contractCode;
    private Double loanAmount;
    private Integer loanPeriod;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date startDate;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date endDate;
    private String loanType;
    private String loanPayType;
    private Double loanInterest;
    private String status;
    private Integer  totalLate;
    private Date  finishedDate;
    private Integer  discountAmount;
    private Integer  extraAmount;
    private Boolean deleteYn;
    private Long approveUserNo;
    private Date approveDate;
    private Date denyDate;
    private Long denyUserNo;
    private Long requestUserNo;
    private Date requestDate;
    private Long finishUserNo;
    private Date finishDate;
    private String finishedNote;
    private String customerAsset;
    private Integer finishReturnAmount;
    private Boolean isPaidAll;



}
