package com.namowebiz.mugrun.applications.siteadmin.controller.customer;

import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanVO;
import com.namowebiz.mugrun.applications.siteadmin.service.common.TownService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.CustomerService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanService;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.util.Calendar;
import java.util.Map;

/**
 * Created by asuspc on 9/18/2017.
 */

@Controller
@RequestMapping("/admin/popup")
@CommonsLog
public class PopupController {
    @Autowired
    private CustomerService customerService;
    @Autowired
    private UserService userService;
    @Autowired
    private TownService townService;
    @Autowired
    private LoanService loanService;



    @RequestMapping(value = {"/nhantien.html"}, method = RequestMethod.GET)
    public String nhantien(Map<String, Object> map, HttpServletRequest request, Long loanNo) throws Exception {
        buildPrintData(map, loanNo);
        return "siteadmin/common/print_popup/bien_ban_nhan_tien";
    }

    @RequestMapping(value = {"/denghimuontien.html"}, method = RequestMethod.GET)
    public String denghimuontien(Map<String, Object> map, HttpServletRequest request, Long loanNo) throws Exception {
        buildPrintData(map, loanNo);
        return "siteadmin/common/print_popup/de_nghi_muon_tien";
    }

    @RequestMapping(value = {"/bangiaots.html"}, method = RequestMethod.GET)
    public String bangiaots(Map<String, Object> map, HttpServletRequest request, Long loanNo) throws Exception {
        buildPrintData(map, loanNo);
        return "siteadmin/common/print_popup/ban_giao_ts";
    }

    @RequestMapping(value = {"/giayghino.html"}, method = RequestMethod.GET)
    public String giayghino(Map<String, Object> map, HttpServletRequest request, Long loanNo) throws Exception {
        buildPrintData(map, loanNo);
        return "siteadmin/common/print_popup/giay_ghi_no";
    }

    @RequestMapping(value = {"/thoa-thuan-han-muc-muon-tien.html"}, method = RequestMethod.GET)
    public String hanMucMuonTien(Map<String, Object> map, HttpServletRequest request, Long loanNo) throws Exception {
        buildPrintData(map, loanNo);
        return "siteadmin/common/print_popup/han_muc_muon_tien";
    }



    private void buildPrintData(Map<String, Object> map, Long loanNo){
        LoanVO loan = loanService.getByPK(loanNo);
        Calendar cal = Calendar.getInstance();
        if(loan != null){
            map.put("year", cal.get(Calendar.YEAR));
            map.put("month", cal.get(Calendar.MONTH) + 1);
            map.put("loan", loan);
            map.put("user", userService.getByPK(loan.getDutyStaffNo()));
            map.put("customer", customerService.getByPK(loan.getCustomerNo()));
        }
    }
}
