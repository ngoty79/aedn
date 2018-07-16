package com.namowebiz.mugrun.applications.siteadmin.models.salary;

import com.namowebiz.mugrun.applications.siteadmin.common.utils.NumberFormatUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 10/30/2017.
 */
public class SalaryMstVO extends SalaryMst {
    @Getter @Setter
    private String regUserName;
    @Getter @Setter
    private String userName;

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


}
