package com.namowebiz.mugrun.applications.siteadmin.controller.customer;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanVO;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.service.common.TownService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.CustomerService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanDetailService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanService;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 9/18/2017.
 */

@Controller
@CommonsLog
public class PaymentController {
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


    @RequestMapping(value = "/admin/payment/index", method = RequestMethod.GET)
    public String payment(Map<String, Object> map, HttpServletRequest request) throws Exception {
        map.put("loginUser", RequestUtil.getUserInfoInSession(request));
        Map<String, Object> params = new HashMap<>();
        params.put("adminYn", 0);
        map.put("userList", userService.list(params));
        params.clear();
        map.put("loanList", getPaymentList(RequestUtil.getUserInfoInSession(request)));
        return "siteadmin/loan/payment/payment";
    }

    private List<LoanVO> getPaymentList(UserVO user){
        Map<String, Object> params = new HashMap<>();
        params.put("status", LoanVO.STATUS_APPROVE);
        if(!user.getAdminYn()){
            params.put("staffUserNo", user.getUserNo());
        }
        return loanService.getPayment(params);
    }

    @RequestMapping(value = "/admin/payment/list.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<LoanVO> getPaymentList(String sortName, String sortOrder,
                                              Long staffUserNo,
                                               String customerCode,
                                              int pageNumber, int pageSize) throws Exception {

        Map<String, Object> params = new HashMap<>();
        params.put("status", LoanVO.STATUS_APPROVE);
        params.put("excludeFinished", true);
        if(staffUserNo != null){
            params.put("staffUserNo", staffUserNo);
        }
        if(!StringUtils.isEmpty(sortName)){
            params.put("sortName", sortName);
            params.put("sortOrder", sortOrder);
        }
        if(!StringUtils.isEmpty(customerCode)){
            params.put("customerCode", customerCode);
        }


        int startIndex = (pageNumber-1)*pageSize;
        params.put("startIndex", startIndex);
        params.put("pageSize", pageSize);
        PaginationList<LoanVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<LoanVO> loans = loanService.getPayment(params);
        Long count = loanService.getPaymentCount(params);
        paging.setRows(loans);
        paging.setTotal(count);

        return paging;
    }

    @RequestMapping(value = "/admin/payment/approve.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse approvePayment(@RequestBody List<LoanVO> data){
        return loanService.payment(data);
    }


}
