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

    private Double salary;
    private Double officeStuff;
    private Double withdrawFee;
    private Double bonus;
    private Double salary13th;
    private Double otherCost;
    private Double interestCost;
    private Double operatingCost;
    private Double giamLai;
    private Double birthdayCost;
    private Double uniformCost;
    private Double insuranceCost;
    private Double oilCost;
    private Double telCardCost;

    public Double getTotalRevenue(){
        return sum(loanProfit, cash, profileCost, bankInterest, otherRevenue);
    }

    public Double getTotalCost(){
        return sum(salary, officeStuff, withdrawFee, bonus, salary13th, otherCost,
                interestCost, operatingCost, giamLai, birthdayCost, uniformCost, insuranceCost,
                oilCost, telCardCost);
    }

    private Double sum(Double... args){
        Double sum = 0D;
        for (Double value : args) {
            sum += value == null? 0 : value;
        }
        return sum;
    }
}
