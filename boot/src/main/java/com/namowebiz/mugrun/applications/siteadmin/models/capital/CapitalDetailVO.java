package com.namowebiz.mugrun.applications.siteadmin.models.capital;

import com.namowebiz.mugrun.applications.siteadmin.common.utils.NumberFormatUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 11/14/2017.
 */
@Getter
@Setter
public class CapitalDetailVO extends CapitalDetail {
    private String regUserName;
    private String approveUserName;
    private String finishUserName;

    public String getAmountFormat(){
        if(getAmount() != null){
            return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getAmount()));
        }
        return "";
    }
}
