package com.namowebiz.mugrun.applications.siteadmin.controller.customer;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.Loan;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanDetail;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanVO;
import com.namowebiz.mugrun.applications.siteadmin.service.common.TownService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.CustomerService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanDetailService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanService;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 9/18/2017.
 */

@Controller
@RequestMapping("/admin/loan")
@CommonsLog
public class LoanController {
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

    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String index(Map<String, Object> map, HttpServletRequest request) throws Exception {
        map.put("user", RequestUtil.getUserInfoInSession(request));
        Map<String, Object> params = new HashMap<>();
        map.put("townList", townService.list(params));
        params.clear();
        params.put("adminYn", 0);
        map.put("userList", userService.list(params));
        params.clear();
        map.put("user", RequestUtil.getUserInfoInSession(request));
//        loanService.updateAllContractCode();
        return "siteadmin/loan/index";
    }

    @RequestMapping(value = "/list.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<LoanVO> getUserList(String searchText, Long townNo,
                                              String sortName, String sortOrder,
                                              Long staffUserNo, String delayType, String status, String loanPayType,
                                              int pageNumber, int pageSize) throws Exception {
        Map<String, Object> params = new HashMap<>();
        if(!StringUtils.isEmpty(searchText)) {
            params.put("searchText", searchText);
        }
        if(!StringUtils.isEmpty(status)) {
            params.put("status", status);
        }
        if(!StringUtils.isEmpty(loanPayType)) {
            params.put("loanPayType", loanPayType);
        }

        if(townNo != null){
            params.put("townNo", townNo);
        }
        if(delayType != null){
            params.put("delayType", delayType);
        }
        if(staffUserNo != null){
            params.put("staffUserNo", staffUserNo);
        }
        if(!StringUtils.isEmpty(sortName)){
            params.put("sortName", sortName);
            params.put("sortOrder", sortOrder);
        }


        int startIndex = (pageNumber-1)*pageSize;
        params.put("startIndex", startIndex);
        params.put("pageSize", pageSize);
        PaginationList<LoanVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<LoanVO> loans = loanService.getLoanList(params);
        Long count = loanService.countLoanList(params);
        paging.setRows(loans);
        paging.setTotal(count);

        return paging;
    }

    @RequestMapping(value = "/addOrEdit.json", method = RequestMethod.POST)
    @ResponseBody
    public Object addOrEdit(@Valid Loan loan, BindingResult bindingResult, HttpServletRequest request) throws Exception {
        JsonResponse jsonResponse = new JsonResponse(false, loan);
        if (bindingResult.hasErrors()) {
            jsonResponse.setData("Validation not passing");
            return jsonResponse;
        }else{
            loanService.addOrEdit(loan, RequestUtil.getUserNo(request));
            jsonResponse.setSuccess(true);
            return jsonResponse;
        }
    }

    @RequestMapping(value = "/getDetail.json", method = RequestMethod.GET)
    @ResponseBody
    public Object getDetail(Long loanNo){
       return new JsonResponse(true, loanService.getByPK(loanNo));
    }

    @RequestMapping(value = "/delete.json", method = RequestMethod.GET)
    @ResponseBody
    public Object delete(Long loanNo){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        jsonResponse.setSuccess(loanService.delete(loanNo));
        return jsonResponse;
    }

    @RequestMapping(value = "/approve.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse approve(Long loanNo){
        return loanService.approve(loanNo);
    }

    @RequestMapping(value = "/deny.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse deny(Long loanNo){
        return loanService.deny(loanNo);
    }



    @RequestMapping(value = "/requestFinish.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse requestFinish(Long loanNo, Integer finishReturnAmount, Integer extraAmount, Integer discountAmount, String finishedNote){
        return loanService.requestFinish(loanNo, finishReturnAmount, extraAmount, discountAmount, finishedNote);
    }

    @RequestMapping(value = "/approveFinish.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse approveFinish(Long loanNo, Double finishReturnAmount, Double extraAmount, String finishedNote){
        return loanService.approveFinish(loanNo, finishReturnAmount, extraAmount, finishedNote);
    }

    @RequestMapping(value = "/rejectRequest.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse rejectRequest(Long loanNo, Double finishReturnAmount, Double extraAmount, String finishedNote){
        return loanService.rejectRequest(loanNo);
    }





    @RequestMapping(value = "/getLoanDetailList.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<LoanDetail> getLoanDetailList(Long loanNo, String status, int pageNumber, int pageSize) throws Exception {
        PaginationList<LoanDetail> paging= loanDetailService.getByLoanNo(loanNo, status, pageNumber, pageSize);
        return paging;
    }


    @RequestMapping(value = "/changeLoanDetailStatus.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse changeLoanDetailStatus(Long loanDetailNo, String status){
        JsonResponse jsonResponse = new JsonResponse(true, null);

        loanDetailService.updateStatus(loanDetailNo, status);
        return jsonResponse;
    }

    @RequestMapping(value = "/getLoanInfo.html", method = RequestMethod.GET)
    public String getLoanInfo(Map<String, Object> map, HttpServletRequest request, Long loanNo, String status) throws Exception {
        LoanVO loanVO = loanService.getInfoByPK(loanNo);
        map.put("loan", loanVO);
        map.put("customer", customerService.getByPK(loanVO.getCustomerNo()));
        map.put("status", status);
        return "siteadmin/customer/view/loan-detail";
    }



}
