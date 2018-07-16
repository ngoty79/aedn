package com.namowebiz.mugrun.applications.siteadmin.models.customer;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import com.namowebiz.mugrun.applications.siteadmin.common.utils.NumberFormatUtil;
import lombok.Getter;
import lombok.Setter;
import org.joda.time.DateTime;
import org.joda.time.Days;

import java.util.Date;

/**
 * Created by ngoty on 9/17/2017.
 */
public class LoanDetail extends BaseObject {
    public static final String STATUS_NEW = "N";
    public static final String STATUS_DELAY = "D";
    public static final String STATUS_PAID = "P";
    @Getter @Setter
    private Long loanDetailNo;
    @Getter @Setter
    private Long loanNo;
    @Getter @Setter
    private Date startDate;
    @Getter @Setter
    private Date endDate;
    @Getter @Setter
    private Integer capital;
    @Getter @Setter
    private Integer profit;
    @Getter @Setter
    private Integer amount;

    @Getter @Setter
    private String status;
    @Getter @Setter
    private String notice;
    @Getter @Setter
    private Integer no;
    @Getter @Setter
    private Boolean finished;
    @Getter @Setter
    private Boolean deleteYn;
    @Getter @Setter
    private Date confirmDate;
    @Getter @Setter
    private Long confirmUserNo;
    @Getter @Setter
    private String customerName;
    @Getter @Setter
    private String contractCode;

    public int getTotalDays(){
        return Days.daysBetween(new DateTime(getStartDate()), new DateTime(getEndDate())).getDays() + 1;
    }

    public String getAmountFormat(){
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getAmount()));
    }
}
