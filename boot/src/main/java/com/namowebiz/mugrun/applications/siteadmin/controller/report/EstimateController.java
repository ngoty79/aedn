package com.namowebiz.mugrun.applications.siteadmin.controller.report;

import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.siteadmin.models.moenyflow.MoneyFlowVO;
import com.namowebiz.mugrun.applications.siteadmin.models.report.EstimateReport;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.MoneyFlowService;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.PropertyService;
import com.namowebiz.mugrun.applications.siteadmin.service.report.EstimateReportService;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 11/29/2017.
 */
@Controller
@CommonsLog
public class EstimateController {
    @Autowired
    private PropertyService propertyService;
    @Autowired
    private MoneyFlowService moneyFlowService;
    @Autowired
    private EstimateReportService estimateReportService;


    @RequestMapping(value = "/admin/estimate/index", method = RequestMethod.GET)
    public String revenue(Map<String, Object> map, HttpServletRequest request) throws Exception {
        LocalDate monday = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.MONDAY));
        LocalDate sunday = monday.with(TemporalAdjusters.next(DayOfWeek.SUNDAY));
        Date nextMonday = java.sql.Date.valueOf(monday);
        Date nextSunday = java.sql.Date.valueOf(sunday);
        map.put("startDate", nextMonday);
        map.put("endDate", nextSunday);
        map.put("estimate", estimateReportService.getEstimateReport(nextMonday, nextSunday));
        return "siteadmin/report/estimate";
    }

    @RequestMapping(value = "/admin/estimate/cost.json", method = RequestMethod.GET)
    @ResponseBody
    public EstimateReport estimateCost(@DateTimeFormat(pattern = "dd/MM/yyyy") Date startDate,
                                       @DateTimeFormat(pattern = "dd/MM/yyyy") Date endDate) throws Exception {
        EstimateReport estimateReport = estimateReportService.getEstimateReport(startDate, endDate);

        return estimateReport;
    }

    @RequestMapping(value = "/admin/estimate/revenue.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<MoneyFlowVO> estimatRevenue(String searchText,
                                                    @DateTimeFormat(pattern = "dd/MM/yyyy") Date startDate,
                                                    @DateTimeFormat(pattern = "dd/MM/yyyy") Date endDate,
                                                    int pageNumber, int pageSize) throws Exception {

        Map<String, Object> params = new HashMap<>();
        if(!StringUtils.isEmpty(searchText)) {
            params.put("searchText", searchText);
        }
        if(startDate != null){
            params.put("startDate", startDate);
        }
        if(endDate != null){
            params.put("endDate", endDate);
        }

        int startIndex = (pageNumber-1)*pageSize;
        params.put("startIndex", startIndex);
        params.put("pageSize", pageSize);
        PaginationList<MoneyFlowVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<MoneyFlowVO> loans = moneyFlowService.list(params);
        Long count = moneyFlowService.count(params);
        paging.setRows(loans);
        paging.setTotal(count);

        return paging;
    }

}
