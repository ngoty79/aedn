package com.namowebiz.mugrun.applications.siteadmin.controller.report;

import com.google.common.collect.Lists;
import com.namowebiz.mugrun.applications.siteadmin.models.report.EstimateReport;
import com.namowebiz.mugrun.applications.siteadmin.models.report.ReportData;
import com.namowebiz.mugrun.applications.siteadmin.models.report.ReportView;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.MoneyFlowService;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.PropertyService;
import com.namowebiz.mugrun.applications.siteadmin.service.report.EstimateReportService;
import lombok.extern.apachecommons.CommonsLog;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * Created by asuspc on 11/29/2017.
 */
@Controller
@CommonsLog
public class ReportController {
    @Autowired
    private PropertyService propertyService;
    @Autowired
    private MoneyFlowService moneyFlowService;
    @Autowired
    private EstimateReportService estimateReportService;


    @RequestMapping(value = "/admin/report/index", method = RequestMethod.GET)
    public String revenue(Map<String, Object> map, HttpServletRequest request) throws Exception {
        List<EstimateReport> staffDataList = estimateReportService.getLoanAmountByStaff();
        List<EstimateReport> locationDataList = estimateReportService.getLoanAmountByLocation();
        map.put("staffDataList", staffDataList);
        map.put("locationDataList", locationDataList);
        Date endDate = new  Date();
        Calendar now = Calendar.getInstance();
        now.set(Calendar.DATE, now.get(Calendar.DATE) - 60);
        Date startDate = now.getTime();
        map.put("revenueDays", estimateReportService.getReportRevenueProfitByDay(startDate, endDate));
        map.put("revenueMonths", estimateReportService.getReportRevenueProfitByMonth());
        return "siteadmin/report/general";
    }

    @RequestMapping(value = "/admin/bizreport/index", method = RequestMethod.GET)
    public String bizreport(Map<String, Object> map, HttpServletRequest request) throws Exception {
        buildReport(map);
        return "siteadmin/report/bizReport";
    }


    private void buildReport(Map<String, Object> map){
        int month = 6;
        DateTime endDate = DateTime.now();
        DateTime startDate = DateTime.now().minusMonths(month);
        String startMonthYear = startDate.toString("yyyy-MM");
        String endMonthYear = endDate.toString("yyyy-MM");
        List<ReportData> data = estimateReportService.getLoanRevenueByMonth(month);
        List<ReportData> otherRevenueReports = estimateReportService.getOtherRevenueReport(startMonthYear, endMonthYear);
        List<ReportData> otherCostReports = estimateReportService.getOtherCostReport(startMonthYear, endMonthYear);
        List<ReportView> reports = new ArrayList<>(month);
        for (int i = 0; i < month; i++) {
            ReportView reportView = new ReportView();
            String monthYear = DateTime.now().minusMonths(i).toString("yyyy-MM");
            Double loanProfit = getLoanProfit(data, monthYear);
            reportView.setMonthYear(monthYear);
            reportView.setLoanProfit(loanProfit);
            reportView.setCash(getAmountBy(otherRevenueReports, monthYear, "01"));
            reportView.setProfileCost(getAmountBy(otherRevenueReports, monthYear, "02"));
            reportView.setBankInterest(getAmountBy(otherRevenueReports, monthYear, "03"));
            reportView.setOtherRevenue(getAmountBy(otherRevenueReports, monthYear, "99"));
            reports.add(reportView);

        }
        reports = Lists.reverse(reports);
        map.put("reports", reports);
        map.put("revenueList", data);
    }

    private Double getLoanProfit(List<ReportData> list, String monthYear){
        Double d = 0D;
        for (ReportData reportData : list) {
            if(monthYear.equals(reportData.getMonth())){
                d = reportData.getProfit();
                break;
            }
        }
        return d;
    }

    private Double getAmountBy(List<ReportData> list, String monthYear, String commonCode){
        Double d = 0D;
        for (ReportData reportData : list) {
            if(monthYear.equals(reportData.getMonth()) && commonCode.equals(reportData.getCommonCode())){
                d = reportData.getAmount();
                break;
            }
        }
        return d;
    }


}
