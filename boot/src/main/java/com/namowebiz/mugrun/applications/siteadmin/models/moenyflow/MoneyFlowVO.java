package com.namowebiz.mugrun.applications.siteadmin.models.moenyflow;

import com.namowebiz.mugrun.applications.siteadmin.common.utils.NumberFormatUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 11/13/2017.
 */
@Getter
@Setter
public class MoneyFlowVO extends MoneyFlow {
    private String regUserName;

    public String getAmountFormat(){
        if(getAmount() != null){
            return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getAmount()));
        }
        return "";
    }
}
