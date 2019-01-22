package com.namowebiz.mugrun.applications.siteadmin.controller.report;

import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.siteadmin.models.moenyflow.MoneyFlowVO;
import com.namowebiz.mugrun.applications.siteadmin.models.moenyflow.Property;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanService;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.MoneyFlowService;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.PropertyService;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 11/29/2017.
 */
@Controller
@CommonsLog
public class MoneyFlowController {
    @Autowired
    private PropertyService propertyService;
    @Autowired
    private MoneyFlowService moneyFlowService;
    @Autowired
    private LoanService loanService;

    @RequestMapping(value = "/admin/moneyflow/index", method = RequestMethod.GET)
    public String moneyFlowIndex(Map<String, Object> map, HttpServletRequest request) throws Exception {
        map.put("property", propertyService.get());
        return "siteadmin/report/moneyflow";
    }

    @RequestMapping(value = "/admin/moneyflow/calculate", method = RequestMethod.GET)
    @Transactional
    public String calculate(Map<String, Object> map, HttpServletRequest request) throws Exception {
        Property property = propertyService.get();
        loanService.updateIsPaidAll();


        map.put("property", property);
        return "siteadmin/report/moneyflow";
    }

    @RequestMapping(value = "/admin/moneyflow/list.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<MoneyFlowVO> getUserList(String searchText,
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
