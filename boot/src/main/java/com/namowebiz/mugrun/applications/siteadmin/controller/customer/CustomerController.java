package com.namowebiz.mugrun.applications.siteadmin.controller.customer;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.Customer;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.CustomerVO;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanVO;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.service.common.TownService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.CustomerService;
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
@RequestMapping("/admin/customer")
@CommonsLog
public class CustomerController {
    @Autowired
    private CustomerService customerService;
    @Autowired
    private LoanService loanService;

    @Autowired
    private UserService userService;

    @Autowired
    private TownService townService;


    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String index(Map<String, Object> map, HttpServletRequest request,
                        String action, Long customerNo) throws Exception {
        String viewPath;
        map.put("user", RequestUtil.getUserInfoInSession(request));
        Map<String, Object> params = new HashMap<>();
        map.put("townList", townService.list(params));
        params.clear();
        params.put("adminYn", 0);
        map.put("userList", userService.list(params));
        params.clear();
        if(StringUtils.isEmpty(action)){
            map.put("summary", customerService.getSummary());
            viewPath = "siteadmin/customer/index";
        }else{
            Customer customer = customerService.getByPK(customerNo);
            map.put("customer", customer);
            viewPath = "siteadmin/customer/detail";
        }

        return viewPath;
    }

    @RequestMapping(value = "/list.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<CustomerVO> getUserList(String searchText, String searchType,
                                                  String loanStatus, String sortName, String sortOrder,
                                                  Long townNo, Long staffUserNo, int pageNumber, int pageSize) throws Exception {
        Map<String, Object> params = new HashMap<>();
        if(!StringUtils.isEmpty(searchText)) {
            params.put("searchText", searchText);
        }
        if(!StringUtils.isEmpty(searchType)) {
            params.put("searchType", searchType);
        }
        if(townNo != null){
            params.put("townNo", townNo);
        }
        if(staffUserNo != null){
            params.put("staffUserNo", staffUserNo);
        }
        if(!StringUtils.isEmpty(loanStatus)){
            params.put("loanStatus", loanStatus);
        }
        if(!StringUtils.isEmpty(sortName)){
            params.put("sortName", sortName);
            params.put("sortOrder", sortOrder);
        }
        int startIndex = (pageNumber-1)*pageSize;
        params.put("startIndex", startIndex);
        params.put("pageSize", pageSize);
        PaginationList<CustomerVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<CustomerVO> customers = customerService.list(params);
        Long count = customerService.count(params);
        paging.setRows(customers);
        paging.setTotal(count);

        return paging;
    }

    @RequestMapping(value = "/addOrEdit.json", method = RequestMethod.POST)
    @ResponseBody
    public Object addOrEdit(Customer modal, HttpServletRequest request) throws Exception {
        JsonResponse jsonResponse = new JsonResponse(false, modal);
        customerService.addOrEdit(modal, RequestUtil.getUserNo(request));
        jsonResponse.setSuccess(true);
        return jsonResponse;
    }

    @RequestMapping(value = "/getPopupData.json", method = RequestMethod.GET)
    @ResponseBody
    public Map getPopupData(HttpServletRequest request) throws Exception {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> params = new HashMap<>();
        result.put("townList", townService.list(params));
        params.clear();
        params.put("adminYn", 0);
        result.put("userList", userService.list(params));
        params.clear();
        return result;
    }

    @RequestMapping(value = "/loadCreditData.html", method = RequestMethod.GET)
    public String loadCreditData(Map<String, Object> map, HttpServletRequest request, Long customerNo, Long loanNo) throws Exception {
        Customer customer = null;
        if(customerNo != null){
            customer = customerService.getByPK(customerNo);
            map.put("customer", customer);
        }
        LoanVO loanVO = null;
        if(loanNo != null){
            loanVO = loanService.getByPK(loanNo);
            if(loanVO != null){
                customer = customerService.getByPK(loanVO.getCustomerNo());
                map.put("customer", customer);
            }
        }
        if(loanVO == null){
            loanVO = new LoanVO();
            loanVO.setStaffUserNo(customer.getStaffUserNo());
            loanVO.setDutyStaffNo(customer.getStaffUserNo());
        }
        map.put("loan", loanVO);

        Map<String, Object> params = new HashMap<>();
        params.put("adminYn", 0);
        map.put("userList", userService.list(params));

        return "siteadmin/customer/view/credit";
    }

    @RequestMapping(value = "/getLoanListByCustomer.html", method = RequestMethod.GET)
    public String getLoanListByCustomer(Map<String, Object> map, HttpServletRequest request, Long customerNo) throws Exception {
        UserVO user = RequestUtil.getUserInfoInSession(request);
        map.put("user", user);
        map.put("loanList", loanService.getByCustomerNo(customerNo));
        return "siteadmin/customer/view/customerLoanList";
    }

    @RequestMapping(value = "/deleteSelected.json", method = RequestMethod.POST)
    @ResponseBody
    public Object deleteSelected(@RequestBody List<Long> customerNoList, HttpServletRequest request) throws Exception {
        return customerService.deleteList(customerNoList);
    }

}
