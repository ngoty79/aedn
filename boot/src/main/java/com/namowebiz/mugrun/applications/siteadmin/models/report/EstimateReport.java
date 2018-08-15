package com.namowebiz.mugrun.applications.siteadmin.models.report;

import com.namowebiz.mugrun.applications.siteadmin.common.utils.NumberFormatUtil;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * Created by asuspc on 11/30/2017.
 */
@Getter
@Setter
public class EstimateReport {
    private Double loanRevenue;
    private Double salaryCost;
    private Double loanProvide;
    private Double amount;
    private Double revenue;
    private Double profit;
    private String townName;
    private String month;
    private String year;
    private String contractCodeList;
    private String staffUserName;
    private String costName;
    private String revenueName;
    private Date date;


    public String getLoanRevenueFormat(){
        Double value = getLoanRevenue() != null? getLoanRevenue() : 0d;
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(value));
    }

    public String getSalaryCostFormat(){
        Double value = getSalaryCost() != null? getSalaryCost() : 0d;
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(value));
    }

    public String getLoanProvideFormat(){
        Double value = getLoanProvide() != null? getLoanProvide() : 0d;
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(value));
    }

    public String getTotalCostFormat(){
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getTotalCost()));
    }

    public String getAmountFormat(){
        Double value = getAmount() != null? getAmount() : 0d;
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(value));
    }

    public Double getTotalCost(){
        Double cost = 0D;
        if(getSalaryCost() != null){
            cost += getSalaryCost();
        }
        if(getLoanProvide() != null){
            cost += getLoanProvide();
        }

        return cost;
    }


}
