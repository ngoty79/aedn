package com.namowebiz.mugrun.applications.siteadmin.controller.capital;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;

import com.namowebiz.mugrun.applications.siteadmin.models.capital.CapitalDetailVO;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanDetailService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanPaymentService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanService;
import com.namowebiz.mugrun.applications.siteadmin.service.capital.CapitalDetailService;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.StringUtils;
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
public class CapitalController {
    @Autowired
    private CapitalDetailService capitalDetailService;

    @RequestMapping(value = "/admin/capital/index", method = RequestMethod.GET)
    public String capital(Map<String, Object> map, HttpServletRequest request) throws Exception {
        map.put("user", RequestUtil.getUserInfoInSession(request));
        return "siteadmin/capital/capital_in";
    }

    @RequestMapping(value = "/admin/capital_out/index", method = RequestMethod.GET)
    public String capital_out(Map<String, Object> map, HttpServletRequest request) throws Exception {
        map.put("user", RequestUtil.getUserInfoInSession(request));
        return "siteadmin/capital/capital_out";
    }

    @RequestMapping(value = "/admin/capital/list.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<CapitalDetailVO> getCapitalList(String searchText, String capitalType,
                                                          @DateTimeFormat(pattern = "dd/MM/yyyy") Date startDate,
                                                          @DateTimeFormat(pattern = "dd/MM/yyyy") Date endDate,
                                                        int pageNumber, int pageSize) throws Exception {

        Map<String, Object> params = new HashMap<>();
        params.put("capitalType", capitalType);
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
        PaginationList<CapitalDetailVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<CapitalDetailVO> list = capitalDetailService.list(params);
        paging.setRows(list);
        paging.setTotal(capitalDetailService.count(params));

        return paging;
    }

    @RequestMapping(value = "/admin/capital/addOrEditCapitalDetail.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse addOrEditSalaryDetail(CapitalDetailVO salaryDetail, HttpServletRequest request){
        return capitalDetailService.addOrEditCapitalDetail(salaryDetail, RequestUtil.getUserInfoInSession(request));
    }

    @RequestMapping(value = "/admin/capital/approve.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse approve(Long capitalDetailNo, HttpServletRequest request){
        return capitalDetailService.approve(capitalDetailNo, RequestUtil.getUserInfoInSession(request));
    }

    @RequestMapping(value = "/admin/capital/finish.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse finish(Long capitalDetailNo, HttpServletRequest request){
        return capitalDetailService.finish(capitalDetailNo, RequestUtil.getUserInfoInSession(request));
    }



    @RequestMapping(value = "/admin/capital/deleteCapitalDetail.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse deleteSalaryDetail(@RequestBody List<Long> capitalDetailNoList, HttpServletRequest request){
        return capitalDetailService.delete(capitalDetailNoList);
    }

}
