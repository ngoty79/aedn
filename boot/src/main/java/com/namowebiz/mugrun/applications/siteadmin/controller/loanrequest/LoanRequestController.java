package com.namowebiz.mugrun.applications.siteadmin.controller.loanrequest;

import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.service.common.TownService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.CustomerService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanDetailService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanService;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by asuspc on 9/18/2017.
 */

@Controller
@CommonsLog
public class LoanRequestController {
    @Autowired
    private CustomerService customerService;
    @Autowired
    private UserService userService;
    @Autowired
    private TownService townService;
    @Autowired
    private LoanService loanService;
    @Autowired
    private LoanDetailService loanDetailService;


    @RequestMapping(value = "/admin/request/approve", method = RequestMethod.GET)
    public String waitingIndex(Map<String, Object> map, HttpServletRequest request) throws Exception {
        map.put("user", RequestUtil.getUserInfoInSession(request));
        Map<String, Object> params = new HashMap<>();
        map.put("townList", townService.list(params));
        params.clear();
        params.put("adminYn", 0);
        map.put("userList", userService.list(params));
        params.clear();
        map.put("user", RequestUtil.getUserInfoInSession(request));
        return "siteadmin/loanRequest/requestApprove";
    }

    @RequestMapping(value = "/admin/request/finish", method = RequestMethod.GET)
    public String finishIndex(Map<String, Object> map, HttpServletRequest request) throws Exception {
        map.put("user", RequestUtil.getUserInfoInSession(request));
        Map<String, Object> params = new HashMap<>();
        map.put("townList", townService.list(params));
        params.clear();
        params.put("adminYn", 0);
        map.put("userList", userService.list(params));
        params.clear();
        map.put("user", RequestUtil.getUserInfoInSession(request));
        return "siteadmin/loanRequest/requestFinish";
    }







}
