package com.namowebiz.mugrun.applications.siteadmin.controller.cost;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanCount;
import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryDetailVO;
import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryMst;
import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryMstVO;
import com.namowebiz.mugrun.applications.siteadmin.models.user.User;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanService;
import com.namowebiz.mugrun.applications.siteadmin.service.salary.SalaryDetailService;
import com.namowebiz.mugrun.applications.siteadmin.service.salary.SalaryMstService;
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
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 9/18/2017.
 */

@Controller
@CommonsLog
public class SalaryController {

    @Autowired
    private UserService userService;
    @Autowired
    private LoanService loanService;
    @Autowired
    private SalaryMstService salaryMstService;
    @Autowired
    private SalaryDetailService salaryDetailService;



    @RequestMapping(value = "/admin/cost/salary/index", method = RequestMethod.GET)
    public String payment(Map<String, Object> map, HttpServletRequest request) throws Exception {
        Calendar now = Calendar.getInstance();
        map.put("user", RequestUtil.getUserInfoInSession(request));
        Map<String, Object> params = new HashMap<>();
        params.put("adminYn", 0);
        map.put("userList", userService.list(params));
        map.put("currentMonth", now.get(Calendar.MONTH) + 1);
        map.put("currentYear", now.get(Calendar.YEAR));
        return "siteadmin/cost/salary";
    }

    @RequestMapping(value = "/admin/cost/salary/list.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<SalaryMstVO> getSalaryMstList(String searchText,
                                              int pageNumber, int pageSize) throws Exception {

        Map<String, Object> params = new HashMap<>();
        if(!StringUtils.isEmpty(searchText)) {
            params.put("searchText", searchText);
        }

        int startIndex = (pageNumber-1)*pageSize;
        params.put("startIndex", startIndex);
        params.put("pageSize", pageSize);
        PaginationList<SalaryMstVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<SalaryMstVO> list = salaryMstService.list(params);
        paging.setRows(list);
        paging.setTotal(salaryMstService.count(params));

        return paging;
    }

    @RequestMapping(value = "/admin/cost/salary/getAvailableUsers.json", method = RequestMethod.GET)
    @ResponseBody
    public List<User> getAvailableUsers(){
        return salaryMstService.getAvailableUsers();
    }

    @RequestMapping(value = "/admin/cost/salary/addOrEditSalaryMst.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse addOrEditSalaryMst(SalaryMst salaryMst, HttpServletRequest request){
        JsonResponse jsonResponse = new JsonResponse(true, salaryMst);
        try{
            salaryMstService.addOrEditSalaryMst(salaryMst, RequestUtil.getUserInfoInSession(request));
        }catch (Exception ex){
            jsonResponse.setSuccess(false);
            jsonResponse.setData(ex.getMessage());
        }

        return jsonResponse;
    }


    @RequestMapping(value = "/admin/cost/salary/deleteSalaryMst.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse deleteSalaryMst(@RequestBody List<Long> salaryMasterNoList, HttpServletRequest request){
        JsonResponse jsonResponse = new JsonResponse(true, null);
        try{
            salaryMstService.delete(salaryMasterNoList);
        } catch (Exception ex) {
            jsonResponse.setSuccess(false);
            jsonResponse.setMessages(ex.getMessage());
        }

        return jsonResponse;
    }



    @RequestMapping(value = "/admin/cost/salary/getDetailList.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<SalaryDetailVO> getDetailList(String searchText,
                                                   int pageNumber, int pageSize) throws Exception {

        Map<String, Object> params = new HashMap<>();
        if(!StringUtils.isEmpty(searchText)) {
            params.put("searchText", searchText);
        }

        int startIndex = (pageNumber-1)*pageSize;
        params.put("startIndex", startIndex);
        params.put("pageSize", pageSize);
        PaginationList<SalaryDetailVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<SalaryDetailVO> list = salaryDetailService.list(params);
        paging.setRows(list);
        paging.setTotal(salaryDetailService.count(params));

        return paging;
    }

    @RequestMapping(value = "/admin/cost/salary/detail-list.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<SalaryDetailVO> getSalaryDetailList(String searchText,
                                                            int pageNumber, int pageSize) throws Exception {

        Map<String, Object> params = new HashMap<>();
        if(!StringUtils.isEmpty(searchText)) {
            params.put("searchText", searchText);
        }

        int startIndex = (pageNumber-1)*pageSize;
        params.put("startIndex", startIndex);
        params.put("pageSize", pageSize);
        PaginationList<SalaryDetailVO> paging = new PaginationList<>(pageNumber, pageSize);

        List<SalaryDetailVO> list = salaryDetailService.list(params);
        paging.setRows(list);
        paging.setTotal(salaryDetailService.count(params));

        return paging;
    }

    @RequestMapping(value = "/admin/cost/salary/getUserInfo.json", method = RequestMethod.GET)
    @ResponseBody
    public SalaryMstVO getUserInfo(Long userNo) throws Exception {
        return salaryMstService.getByUserNo(userNo);
    }


    @RequestMapping(value = "/admin/cost/salary/getAllUserOfSalaryMaster.json", method = RequestMethod.GET)
    @ResponseBody
    public List<User>  getAllUserOfSalaryMaster() throws Exception {
        return salaryMstService.getAllUsers();
    }

    @RequestMapping(value = "/admin/cost/salary/getCountOfStaff.json", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getCountOfStaff(Long userNo, String year, String month) throws Exception {
        JsonResponse jsonResponse = new JsonResponse(true, null);
        Map params = new HashMap<>();
        params.put("userNo", userNo);
        params.put("yearMonth", year + "-" + month);
        Map result = new HashMap<>();
        List<LoanCount> list = loanService.getCountOfStaff(params);
        for (LoanCount loanCount : list) {
            result.put(loanCount.getNewType(), loanCount.getCount());
        }
        jsonResponse.setData(result);
        return jsonResponse;
    }

    @RequestMapping(value = "/admin/cost/salary/addOrEditSalaryDetail.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse addOrEditSalaryDetail(SalaryDetailVO salaryDetail, HttpServletRequest request){
        return salaryDetailService.addOrEditSalaryDetail(salaryDetail, RequestUtil.getUserInfoInSession(request));
    }

    @RequestMapping(value = "/admin/cost/salary/approve.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse approve(Long salaryDetailNo, HttpServletRequest request){
        return salaryDetailService.approve(salaryDetailNo, RequestUtil.getUserInfoInSession(request));
    }


    @RequestMapping(value = "/admin/cost/salary/deleteSalaryDetail.json", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse deleteSalaryDetail(@RequestBody List<Long> salaryDetailNoList, HttpServletRequest request){
        return salaryDetailService.delete(salaryDetailNoList);
    }


}
