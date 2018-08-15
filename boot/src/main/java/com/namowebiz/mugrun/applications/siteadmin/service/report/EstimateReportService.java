package com.namowebiz.mugrun.applications.siteadmin.service.report;

import com.google.common.collect.Lists;
import com.namowebiz.mugrun.applications.siteadmin.dao.report.EstimateReportMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.report.EstimateReport;
import com.namowebiz.mugrun.applications.siteadmin.models.report.ReportData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

/**
 * Created by asuspc on 11/30/2017.
 */
@Service
public class EstimateReportService {
    @Autowired
    private EstimateReportMapper estimateReportyMapper;

    public EstimateReport getEstimateReport( Date startDate, Date endDate){
        return estimateReportyMapper.getEstimateReport(startDate, endDate);
    }

    public List<EstimateReport> getLoanAmountByStaff(){
        return estimateReportyMapper.getLoanAmountByStaff();
    }

    public List<EstimateReport> getLoanAmountByLocation(){
        return estimateReportyMapper.getLoanAmountByLocation();
    }

    public EstimateReport getStopLoanRevenue(Date startDate, Date endDate){
        return estimateReportyMapper.getStopLoanRevenue(startDate, endDate);
//        return estimateReport == null? new EstimateReport() : estimateReport;
    }

    public EstimateReport getLoanRevenue(Date startDate, Date endDate){
        return estimateReportyMapper.getLoanRevenue(startDate, endDate);
//        return estimateReport == null? new EstimateReport() : estimateReport;
    }


    public List<EstimateReport> getReportRevenueProfitByDay(Date startDate, Date endDate){
        return estimateReportyMapper.getReportRevenueProfitByDay(startDate, endDate);
    }

    public List<EstimateReport> getReportRevenueProfitByMonth(){
        return estimateReportyMapper.getReportRevenueProfitByMonth();
    }

    public List<ReportData> getLoanRevenueByMonth(int limit){
        List<ReportData> list = estimateReportyMapper.getLoanRevenueByMonth(limit);
        return Lists.reverse(list);
    }

    public List<ReportData> getOtherRevenueReport(String startMonthYear, String endMonthYear){
        return estimateReportyMapper.getOtherRevenueReport(startMonthYear, endMonthYear);
    }

    public List<ReportData> getOtherCostReport(String startMonthYear, String endMonthYear){
        return estimateReportyMapper.getOtherCostReport(startMonthYear, endMonthYear);
    }

}
