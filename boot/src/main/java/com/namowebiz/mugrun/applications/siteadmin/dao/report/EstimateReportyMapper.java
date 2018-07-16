package com.namowebiz.mugrun.applications.siteadmin.dao.report;

import com.namowebiz.mugrun.applications.siteadmin.models.report.EstimateReport;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

/**
 * Created by asuspc on 11/30/2017.
 */
@Repository
public interface EstimateReportyMapper {
    public EstimateReport getEstimateReport(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    List<EstimateReport> getLoanAmountByStaff();

    List<EstimateReport> getLoanAmountByLocation();

    List<EstimateReport> getReportRevenueProfitByMonth();

    List<EstimateReport> getReportRevenueProfitByDay(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    EstimateReport getStopLoanRevenue(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    EstimateReport getLoanRevenue(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
