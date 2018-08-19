package com.namowebiz.mugrun.applications.siteadmin.dao.report;

import com.namowebiz.mugrun.applications.siteadmin.models.report.EstimateReport;
import com.namowebiz.mugrun.applications.siteadmin.models.report.ReportData;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

/**
 * Created by asuspc on 11/30/2017.
 */
@Repository
public interface EstimateReportMapper {
    public EstimateReport getEstimateReport(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    List<EstimateReport> getLoanAmountByStaff();

    List<EstimateReport> getLoanAmountByLocation();

    List<EstimateReport> getReportRevenueProfitByMonth();

    List<EstimateReport> getReportRevenueProfitByDay(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    EstimateReport getStopLoanRevenue(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    EstimateReport getLoanRevenue(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    List<ReportData> getLoanRevenueByMonth(@Param("limit") int limit);

    List<ReportData> getReportSalary(@Param("limit") int limit);

    List<ReportData> getOtherRevenueReport(@Param("startMonthYear") String startMonthYear, @Param("endMonthYear") String endMonthYear);

    List<ReportData> getOtherCostReport(@Param("startMonthYear") String startMonthYear, @Param("endMonthYear") String endMonthYear);
}
