package com.namowebiz.mugrun.applications.siteadmin.models.customer;

import com.namowebiz.mugrun.applications.siteadmin.common.utils.NumberFormatUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 9/14/2017.
 */
public class CustomerVO extends Customer {
    @Getter @Setter
    private Integer loanCount;
    @Getter @Setter
    private Double currentDebt;
    @Getter @Setter
    private Integer delayDays;
    @Getter @Setter
    private Double delayAmount;
    @Getter @Setter
    private Double totalPaidAmount;
    @Getter @Setter
    private String loanStatus;
    @Getter @Setter
    private Integer totalCustomer;
    @Getter @Setter
    private Integer totalActiveCustomer;
    @Getter @Setter
    private Integer totalApproveCustomer;
    @Getter @Setter
    private String regUserName;
    @Getter @Setter
    private String contractCode;

    public int getTotalNewCustomer(){
        int count = (totalCustomer == null? 0:totalCustomer)
                - (totalActiveCustomer == null? 0 : totalActiveCustomer);
        return count;
    }

    public int getTotalFinishedCustomer(){
        int count = (totalActiveCustomer == null? 0:totalActiveCustomer)
                - (totalApproveCustomer == null? 0 : totalApproveCustomer);
        return count;
    }



    public String getCurrentDebtFmt(){
        if(getCurrentDebt() != null){
            return NumberFormatUtil.formatCurrency(getCurrentDebt());
        }
        return null;
    }

    public String getDelayAmountFmt(){
        if(getDelayAmount() != null){
            return NumberFormatUtil.formatCurrency(getDelayAmount());
        }
        return null;
    }

}
