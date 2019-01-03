package com.namowebiz.mugrun.applications.siteadmin.controller.plan;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanVO;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroup;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanService;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.StringUtils;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ASUS on 12/27/2018.
 */
@Controller
@CommonsLog
public class PlanController {
    @Autowired
    private UserService userService;
    @Autowired
    private LoanService loanService;

    @RequestMapping(value = "/admin/plan/index", method = RequestMethod.GET)
    public String index(Map<String, Object> map, HttpServletRequest request) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.clear();
        params.put("adminYn", 0);
        map.put("userList", userService.list(params));
        return "siteadmin/plan/index";
    }


    @RequestMapping(value = "/admin/plan/pagination.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<LoanVO> pagination(HttpServletRequest request, Long userNo,
                                             @DateTimeFormat(pattern="dd/MM/yyyy") Date startDate,
                                             @DateTimeFormat(pattern="dd/MM/yyyy") Date endDate,
                                             int pageNumber, int pageSize) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.put("staffUserNo", userNo);
        if(startDate != null){
            params.put("startDate", startDate);
        }
        if(endDate != null){
            params.put("endDate", endDate);
        }


        int startIndex = (pageNumber-1)*pageSize;
        params.put("startIndex", startIndex);
        params.put("pageSize", pageSize);
        PaginationList<LoanVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<LoanVO> loans = loanService.getLoanPlan(params);
        Integer count = loanService.getCountLoanPlan(params);
        paging.setRows(loans);
        paging.setTotal(count);

        return paging;
    }
}
