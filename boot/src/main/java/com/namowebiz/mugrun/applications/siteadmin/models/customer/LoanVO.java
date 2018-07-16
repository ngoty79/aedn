package com.namowebiz.mugrun.applications.siteadmin.models.customer;

import com.namowebiz.mugrun.applications.siteadmin.common.utils.NumberFormatUtil;
import lombok.Getter;
import lombok.Setter;
import org.joda.time.DateTime;
import org.joda.time.Days;

/**
 * Created by asuspc on 10/3/2017.
 */
@Getter @Setter
public class LoanVO extends Loan {
    private String customerCode;
    private String staffUserName;
    private String provinceName;
    private String districtName;
    private String townName;
    private String customerName;
    private String dutyUserName;
    private String approveUserName;
    private String finishUserName;
    private String requestUserName;
    private String regUserName;
    private Double paid;
    private Integer delayDays;
    private Integer totalPaidAmount;
    private Integer alreadyPaidSession;
    private Double delayAmount;
    private Double returnCapital;
    private Integer currentDebt;
    private Integer remainProfit;


    public int getTotalDays(){
        return Days.daysBetween(new DateTime(getStartDate()), new DateTime(getEndDate())).getDays() + 1;
    }

    public int getDayOfSession(){
        int day=0;
        if(Loan.LOAN_DAILY.equals(getLoanPayType())){
            day = 1;
        }else if(Loan.LOAN_WEEKLY.equals(getLoanPayType())){
            day = 7;
        }else if(Loan.LOAN_MONTHLY.equals(getLoanPayType())){
            day = 30;
        }
        return day;
    }

    public int getTotalPaySessions(){
        if(getStartDate() != null && getEndDate()!=null){
            int paySession = 0;
            int totalDays = getTotalDays();
            if(Loan.LOAN_DAILY.equals(getLoanPayType())){
                paySession = totalDays;
            }else if(Loan.LOAN_WEEKLY.equals(getLoanPayType())){
                paySession = (int) Math.ceil((double)totalDays/7);
            }
            return paySession;
        }
        return 0;
    }

    public double getPayByDay(){
        double profitByMonth = getLoanAmount() * (getLoanInterest()/100);
        double profitByDay = profitByMonth/30;
        double returnMoney = getLoanAmount()/getTotalDays();
        return returnMoney + profitByDay;
    }

    public double getProfitByDay(){
        double profitByMonth = getLoanAmount() * (getLoanInterest()/100);
        double profitByDay = profitByMonth/30;
        return profitByDay;
    }

    public double getProfitBySession(){
        return getProfitByDay() * getDayOfSession();
    }

    public String getProfitBySessionFormat(){
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getProfitBySession()));
    }

    public double getCapitalByDay(){
        double returnMoney = getLoanAmount() / getTotalDays();
        return returnMoney;
    }

    public double getCapitalBySession(){
        return getCapitalByDay() * getDayOfSession();
    }

    public String getCapitalBySessionFormat(){
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getCapitalBySession()));
    }



    public long getPayBySession(){
        double payByDay = getPayByDay();
        double payBySession = 0;
        if(Loan.LOAN_DAILY.equals(getLoanPayType())){
            payBySession = payByDay;
        }else if(Loan.LOAN_WEEKLY.equals(getLoanPayType())){
            payBySession = payByDay * 7;
        }else if(Loan.LOAN_MONTHLY.equals(getLoanPayType())){
            payBySession = payByDay * 30;
        }
        return NumberFormatUtil.round(payBySession);
    }

    public String getPayBySessionFormat(){
        return NumberFormatUtil.formatCurrency(getPayBySession());
    }

    public String getLoanAmountFormat(){
        return NumberFormatUtil.formatCurrency(getLoanAmount());
    }


    public String getCurrentDebtFormat(){
        double value = getCurrentDebt() == null? 0 : getCurrentDebt();
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(value));
    }

    public String getPaidFormat(){
        double paid = getPaid()== null? 0: getPaid();
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(paid));
    }
    public String getTotalPaidAmountFormat(){
        double amount = getTotalPaidAmount() == null? 0: getTotalPaidAmount();
        return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(amount));
    }

    public String getDelayAmountFormat(){
        if(getDelayAmount() != null){
            return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getDelayAmount()));
        }
        return "";
    }

    public String getRemainAmountFormat(){
        if(Loan.STATUS_APPROVE.equals(getStatus())){
            double remainAmount = getLoanAmount() - (returnCapital == null? 0 : returnCapital);
            return NumberFormatUtil.formatNumber(NumberFormatUtil.round(remainAmount));
        }else if(Loan.STATUS_REQUEST_FINISHED.equals(getStatus())){
            return NumberFormatUtil.formatNumber(NumberFormatUtil.round(getFinishReturnAmount()));
        }
        return "";
    }


    public String getFinishReturnAmountFormat(){
        if(getFinishReturnAmount() != null){
            return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getFinishReturnAmount()));
        }
        return "";
    }

     public String getExtraAmountForamt(){
        if(getExtraAmount() != null){
            return NumberFormatUtil.formatCurrency(NumberFormatUtil.round(getExtraAmount()));
        }
        return "";
    }



    public String getId(){
        return getLoanNo().toString();
    }

    public String getText(){
        return getContractCode() + " / " + getCustomerName();
    }

}
