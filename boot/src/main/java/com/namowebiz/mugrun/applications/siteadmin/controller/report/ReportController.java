package com.namowebiz.mugrun.applications.siteadmin.controller.report;

import com.namowebiz.mugrun.applications.siteadmin.models.report.EstimateReport;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.MoneyFlowService;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.PropertyService;
import com.namowebiz.mugrun.applications.siteadmin.service.report.EstimateReportService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

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



}
