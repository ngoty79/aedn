package com.namowebiz.mugrun.applications.siteadmin.controller.revenue;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanPayment;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanPaymentVO;
import com.namowebiz.mugrun.applications.siteadmin.models.revenue.RevenueDetailVO;
import com.namowebiz.mugrun.applications.siteadmin.service.commoncode.CommonCodeService;
import com.namowebiz.mugrun.applications.siteadmin.service.cost.CostDetailService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanDetailService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanPaymentService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanService;
import com.namowebiz.mugrun.applications.siteadmin.service.revenue.RevenueDetailService;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.StringUtils;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * Created by asuspc on 9/18/2017.
 */

@Controller
@CommonsLog
public class RevenueController {
    @Autowired
    private RevenueDetailService revenueDetailService;
    @Autowired
    private LoanDetailService loanDetailService;
    @Autowired
    private LoanPaymentService loanPaymentService;
    @Autowired
    private UserService userService;
    @Autowired
    private CommonCodeService commonCodeService;

    @RequestMapping(value = "/admin/revenue/index", method = RequestMethod.GET)
    public String revenue(Map<String, Object> map, HttpServletRequest request) throws Exception {
        Calendar now = Calendar.getInstance();
        map.put("user", RequestUtil.getUserInfoInSession(request));
        map.put("currentMonth", now.get(Calendar.MONTH) + 1);
        map.put("currentYear", now.get(Calendar.YEAR));
        map.put("otherRevenues", commonCodeService.getByCodeGroup(CommonConstants.COMMON_CODE_OTHER_INCOME));
        return "siteadmin/revenue/index";
    }

    @RequestMapping(value = "/admin/revenue/list.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<RevenueDetailVO> getRevenueList(String searchText,
                                                          @DateTimeFormat(pattern = "dd/MM/yyyy") Date startDate,
                                                          @DateTimeFormat(pattern = "dd/MM/yyyy") Date endDate,
                                                          String commonCode,
                                                        int pageNumber, int pageSize) throws Exception {

        Map<String, Object> params = new HashMap<>();
        if(!StringUtils.isEmpty(searchText)) {
            params.put("searchText", searchText);
        }
        if(!StringUtils.isEmpty(commonCode)) {
            params.put("revenueType", commonCode);
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
        PaginationList<RevenueDetailVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<RevenueDetailVO> list = revenueDetailService.list(params);
        paging.setRows(list);
        paging.setTotal(revenueDetailService.count(params));

        return paging;
    }

    @RequestMapping(value = "/admin/revenue/addOrEditRevenueDetail.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse addOrEditSalaryDetail(RevenueDetailVO salaryDetail, HttpServletRequest request){
        return revenueDetailService.addOrEditRevenueDetail(salaryDetail, RequestUtil.getUserInfoInSession(request));
    }

    @RequestMapping(value = "/admin/revenue/approve.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse approve(Long revenueDetailNo, HttpServletRequest request){
        return revenueDetailService.approve(revenueDetailNo, RequestUtil.getUserInfoInSession(request));
    }


    @RequestMapping(value = "/admin/revenue/deleteRevenueDetail.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse deleteSalaryDetail(@RequestBody List<Long> revenueDetailNoList, HttpServletRequest request){
        return revenueDetailService.delete(revenueDetailNoList);
    }


    @RequestMapping(value = "/admin/loanrevenue/index", method = RequestMethod.GET)
    public String loanRevenue(Map<String, Object> map, HttpServletRequest request) throws Exception {
        Calendar now = Calendar.getInstance();
        map.put("user", RequestUtil.getUserInfoInSession(request));
        map.put("currentMonth", now.get(Calendar.MONTH) + 1);
        map.put("currentYear", now.get(Calendar.YEAR));
        map.put("currentDate", now.getTime());
        Map<String, Object> params = new HashMap<>();
        params.put("adminYn", 0);
        map.put("userList", userService.list(params));


        return "siteadmin/revenue/loanrevenue";
    }


    @RequestMapping(value = "/admin/loanrevenue/list.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<LoanPaymentVO> getLoanList(@DateTimeFormat(pattern = "dd/MM/yyyy") Date startDate,
                                                   @DateTimeFormat(pattern = "dd/MM/yyyy") Date endDate,
                                                   Long staffUserNo,
                                                   int pageNumber, int pageSize) throws Exception {

        Map<String, Object> params = new HashMap<>();
        if(startDate != null){
            params.put("startDate", startDate);
        }
        if(endDate != null){
            params.put("endDate", endDate);
        }
        if(staffUserNo != null){
            params.put("staffUserNo", staffUserNo);
        }
        params.put("status", LoanPayment.STATUS_REQUEST);
        int startIndex = (pageNumber-1)*pageSize;
        params.put("startIndex", startIndex);
        params.put("pageSize", pageSize);
        PaginationList<LoanPaymentVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<LoanPaymentVO> loans = loanPaymentService.list(params);
        Long count = loanPaymentService.count(params);
        paging.setRows(loans);
        paging.setTotal(count);

        return paging;
    }

    @RequestMapping(value = "/admin/loanrevenue/approve.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse approveLoanRevenue(@RequestBody List<Long> paymentNoList) throws Exception {
        return loanDetailService.approve(paymentNoList);
    }

    @RequestMapping(value = "/admin/loanrevenue/reject.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse rejectLoanRevenue(Long paymentNo) throws Exception {
        return loanDetailService.reject(paymentNo);
    }


}
