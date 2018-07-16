package com.namowebiz.mugrun.applications.siteadmin.models.salary;

import com.namowebiz.mugrun.applications.siteadmin.common.utils.NumberFormatUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 10/30/2017.
 */
public class SalaryDetailVO extends SalaryDetail {
    @Getter @Setter
    private String regUserName;
    @Getter @Setter
    private String userName;
    @Getter @Setter
    private String approveUserName;


    public String getSalaryFormat(){
        if(getSalary() != null){
            return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getSalary()));
        }
        return "";
    }
    public String getAllowanceFormat(){
        if(getAllowance() != null){
            return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getAllowance()));
        }
        return "";
    }

    public String getExtraCostFormat(){
        if(getExtraCost() != null){
            return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getExtraCost()));
        }
        return "";
    }

    public Integer getTotal(){
        Integer amount = getSalary() == null? 0 :getSalary();
        amount +=  getAllowance() == null? 0 :getAllowance();
        amount +=  getExtraCost() == null? 0 :getExtraCost();
        return amount;
    }
    public String getTotalFormat(){
        Integer amount = getTotal();
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(amount));
    }





}
