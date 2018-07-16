package com.namowebiz.mugrun.applications.siteadmin.models.customer;

import com.namowebiz.mugrun.applications.siteadmin.common.utils.NumberFormatUtil;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by asuspc on 12/14/2017.
 */
@Getter
@Setter
public class LoanPaymentVO extends LoanPayment {
    private String regUserName;
    private String customerName;
    private String customerCode;
    private String contractCode;
    private String staffUserName;
    private Double loanAmount;
    private Integer loanPeriod;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date startDate;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date endDate;

    List<LoanDetail> details = new ArrayList<>();

    public String getAmountFormat(){
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getAmount()));
    }


}
