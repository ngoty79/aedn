package com.namowebiz.mugrun.applications.siteadmin.models.report;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportData {
    private Double amount;
    private Double revenue;
    private Double profit;
    private String commonCode;
    private String commonCodeName;
    private String month;

}
