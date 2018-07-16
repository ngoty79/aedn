package com.namowebiz.mugrun.applications.siteadmin.models.cost;

import com.namowebiz.mugrun.applications.siteadmin.common.utils.NumberFormatUtil;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 11/12/2017.
 */
@Getter
@Setter
public class CostDetailVO extends CostDetail {
    private String regUserName;
    private String approveUserName;

    public String getAmountFormat(){
        if(getAmount() != null){
            return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getAmount()));
        }
        return "";
    }
}
