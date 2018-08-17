package com.namowebiz.mugrun.applications.siteadmin.controller.cost;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.siteadmin.models.cost.CostDetailVO;
import com.namowebiz.mugrun.applications.siteadmin.service.commoncode.CommonCodeService;
import com.namowebiz.mugrun.applications.siteadmin.service.cost.CostDetailService;
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
public class CostController {
    @Autowired
    private CommonCodeService commonCodeService;
    @Autowired
    private UserService userService;
    @Autowired
    private CostDetailService costDetailService;




    @RequestMapping(value = "/admin/cost/other/index", method = RequestMethod.GET)
    public String payment(Map<String, Object> map, HttpServletRequest request) throws Exception {
        Calendar now = Calendar.getInstance();
        map.put("user", RequestUtil.getUserInfoInSession(request));
        map.put("otherCosts", commonCodeService.getByCodeGroup(CommonConstants.COMMON_CODE_OTHER_COST));
        map.put("currentMonth", now.get(Calendar.MONTH) + 1);
        map.put("currentYear", now.get(Calendar.YEAR));
        return "siteadmin/cost/cost";
    }

    @RequestMapping(value = "/admin/cost/other/list.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<CostDetailVO> getSalaryMstList(String searchText,
                                                         @DateTimeFormat(pattern = "dd/MM/yyyy") Date startDate,
                                                         @DateTimeFormat(pattern = "dd/MM/yyyy") Date endDate,
                                                         String commonCode,
                                                        int pageNumber, int pageSize) throws Exception {

        Map<String, Object> params = new HashMap<>();
        if(!StringUtils.isEmpty(searchText)) {
            params.put("searchText", searchText);
        }
        if(!StringUtils.isEmpty(commonCode)) {
            params.put("costType", commonCode);
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
        PaginationList<CostDetailVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<CostDetailVO> list = costDetailService.list(params);
        paging.setRows(list);
        paging.setTotal(costDetailService.count(params));

        return paging;
    }

    @RequestMapping(value = "/admin/cost/other/addOrEditCostDetail.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse addOrEditSalaryDetail(CostDetailVO salaryDetail, HttpServletRequest request){
        return costDetailService.addOrEditCostDetail(salaryDetail, RequestUtil.getUserInfoInSession(request));
    }

    @RequestMapping(value = "/admin/cost/other/approve.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse approve(Long costDetailNo, HttpServletRequest request){
        return costDetailService.approve(costDetailNo, RequestUtil.getUserInfoInSession(request));
    }


    @RequestMapping(value = "/admin/cost/other/deleteCostDetail.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse deleteSalaryDetail(@RequestBody List<Long> costDetailNoList, HttpServletRequest request){
        return costDetailService.delete(costDetailNoList);
    }




}
