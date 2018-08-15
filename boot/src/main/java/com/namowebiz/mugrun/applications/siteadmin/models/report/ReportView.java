package com.namowebiz.mugrun.applications.siteadmin.models.report;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportView {
    private String monthYear;
    private Double loanProfit;
    private Double loanRevenue;
    private Double cash;
    private Double profileCost;
    private Double bankInterest;
    private Double otherRevenue;
}
