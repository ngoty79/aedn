package com.namowebiz.mugrun.applications.siteadmin.models.report;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportView {
    public static final String REVENUE_CASH = "01";
    public static final String REVENUE_PROFILE_COST = "02";
    public static final String REVENUE_BANK_INTEREST = "03";
    public static final String REVENUE_OTHER = "99";

    public static final String COST_OFFICE_STUFF = "01";
    public static final String COST_WITHDRAW_FEE = "02";
    public static final String COST_BONUS = "03";
    public static final String COST_13TH_SALARY = "04";
    public static final String COST_INTEREST_COST = "05";
    public static final String COST_OPERATING = "06";
    public static final String COST_GIAM_LAI = "07";
    public static final String COST_BIRTHDAY = "08";
    public static final String COST_UNIFORM = "09";
    public static final String COST_INSURANCE = "10";
    public static final String COST_OIL = "11";
    public static final String COST_TEL_CARD = "12";
    public static final String COST_OTHERS = "13";

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
