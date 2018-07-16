package com.namowebiz.mugrun.applications.siteadmin.controller.report;

import com.namowebiz.mugrun.applications.siteadmin.models.cost.CostDetailVO;
import com.namowebiz.mugrun.applications.siteadmin.models.report.EstimateReport;
import com.namowebiz.mugrun.applications.siteadmin.models.revenue.RevenueDetailVO;
import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryDetailVO;
import com.namowebiz.mugrun.applications.siteadmin.service.cost.CostDetailService;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.MoneyFlowService;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.PropertyService;
import com.namowebiz.mugrun.applications.siteadmin.service.report.EstimateReportService;
import com.namowebiz.mugrun.applications.siteadmin.service.revenue.RevenueDetailService;
import com.namowebiz.mugrun.applications.siteadmin.service.salary.SalaryDetailService;
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
 * Created by asuspc on 12/21/2017.
 */
@Controller
@CommonsLog
public class RevenueReportController {
    @Autowired
    private RevenueDetailService revenueDetailService;
    @Autowired
    private CostDetailService costDetailService;

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private MoneyFlowService moneyFlowService;
    @Autowired
    private EstimateReportService estimateReportService;
    @Autowired
    private SalaryDetailService salaryDetailService;



    @RequestMapping(value = "/admin/revenuereport/index", method = RequestMethod.GET)
    public String revenue(Map<String, Object> map, HttpServletRequest request) throws Exception {
        initData(map);
        return "siteadmin/report/revenueReport";
    }

    private void initData(Map<String, Object> map){
        Calendar startDate = Calendar.getInstance();
        startDate.set(Calendar.DAY_OF_MONTH, 1);
        Date start = startDate.getTime();
        map.put("startDate", start);
        startDate.set(Calendar.DAY_OF_MONTH, startDate.getActualMaximum(Calendar.DAY_OF_MONTH));
        Date end = startDate.getTime();
        map.put("endDate", end);
        EstimateReport loanRevenue = estimateReportService.getLoanRevenue(start, end);
        EstimateReport stopLoanRevenue = estimateReportService.getStopLoanRevenue(start, end);
        map.put("loanRevenue", loanRevenue);
        map.put("stopLoanRevenue", stopLoanRevenue);
        List<RevenueDetailVO> revenueDetailList = revenueDetailService.getRevenueDetailList(start, end);
        map.put("revenueDetailList", revenueDetailList);
        int amountRevenue = 0;
        for (RevenueDetailVO revenueDetailVO : revenueDetailList) {
            amountRevenue += revenueDetailVO.getAmount();
        }
        map.put("amountRevenue", amountRevenue);


        List<CostDetailVO> costDetailList = costDetailService.getCostDetailList(start, end);
        map.put("costDetailList", costDetailList);
        int amountCost = 0;
        for (CostDetailVO costDetailVO : costDetailList) {
            amountCost += costDetailVO.getAmount() == null? 0 : costDetailVO.getAmount();
        }
        map.put("amountCost", amountCost);

        SalaryDetailVO salaryDetail = salaryDetailService.getTotalSalaryByMonth(start);
        map.put("salaryDetail", salaryDetail);
    }

}
