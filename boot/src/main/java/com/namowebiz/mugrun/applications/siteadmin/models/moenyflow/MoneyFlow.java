package com.namowebiz.mugrun.applications.siteadmin.models.moenyflow;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 11/12/2017.
 */
@Getter
@Setter
public class MoneyFlow extends BaseObject {
    public static final String TYPE_CREDIT_PROVIDE = "1";
    public static final String TYPE_SALARY_PAY = "2";
    public static final String TYPE_COST_OTHER = "3";
    public static final String TYPE_CREDIT_SESSION_RETURN = "4";
    public static final String TYPE_CASH = "5";
    public static final String TYPE_CREDIT_FINISH_RETURN = "6";
    public static final String TYPE_REVENUE_OTHER = "7";
    public static final String CAPITAL_IN = "8";
    public static final String CAPITAL_OUT = "9";

    private Long moneyFlowNo;
    private String title;
    private String type;
    private Long amount;
    private Double remainCash;
    private String referData;
    private String notice;
}
