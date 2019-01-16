package com.namowebiz.mugrun.applications.siteadmin.service.moenyflow;

import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.dao.moenyflow.MoneyFlowMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.capital.CapitalDetail;
import com.namowebiz.mugrun.applications.siteadmin.models.capital.CapitalDetailVO;
import com.namowebiz.mugrun.applications.siteadmin.models.cost.CostDetailVO;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanPaymentVO;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanVO;
import com.namowebiz.mugrun.applications.siteadmin.models.moenyflow.MoneyFlow;
import com.namowebiz.mugrun.applications.siteadmin.models.moenyflow.MoneyFlowVO;
import com.namowebiz.mugrun.applications.siteadmin.models.moenyflow.Property;
import com.namowebiz.mugrun.applications.siteadmin.models.revenue.RevenueDetailVO;
import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryDetailVO;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 11/13/2017.
 */
@Service
public class MoneyFlowService {
    @Autowired
    private MoneyFlowMapper moneyFlowMapper;
    @Autowired
    private PropertyService propertyService;


    public List<MoneyFlowVO> list(Map params){
        return moneyFlowMapper.list(params);
    }

    public Long count(Map params){
        Long count = moneyFlowMapper.count(params);
        return count == null? 0L : count;
    }
    @Transactional
    public void insert(MoneyFlow data){
        Property property = propertyService.get();
        double remainCash = property.getCash() + data.getAmount();
        data.setRemainCash(remainCash);
        moneyFlowMapper.insert(data);
        propertyService.addMoney(data.getAmount());
    }

    public MoneyFlowVO getByPK(Long moneyFlowNo){
        return moneyFlowMapper.getByPK(moneyFlowNo);
    }

    @Transactional
    public void addMoneyFlow(CostDetailVO cost){
        MoneyFlow data = new MoneyFlow();
        data.setType(MoneyFlow.TYPE_COST_OTHER);
        data.setTitle(cost.getName());
        data.setAmount(-cost.getAmount().longValue());
        data.setNotice(cost.getNotice());
        data.setReferData(cost.getCostDetailNo().toString());
        data.setRegUserNo(RequestUtil.getLoginUserInfo().getUserNo());
        insert(data);

    }

    @Transactional
    public void addMoneyFlow(SalaryDetailVO salary){
        MoneyFlow data = new MoneyFlow();
        data.setType(MoneyFlow.TYPE_SALARY_PAY);
        String title = "Trả lương: " + salary.getUserName() +" - tháng: " + salary.getMonth() + "/" + salary.getYear();
        String notice = "Lương cơ bản: " + salary.getSalaryFormat() + " / phụ cấp: " + salary.getAllowanceFormat();
        notice += " / phụ cấp doanh thu: " + salary.getExtraCostFormat();
        data.setTitle(title);
        data.setAmount(-salary.getTotal().longValue());
        data.setNotice(notice);
        data.setReferData(salary.getSalaryDetailNo().toString());
        data.setRegUserNo(RequestUtil.getLoginUserInfo().getUserNo());
        insert(data);

    }

    @Transactional
    public void addMoneyFlow(RevenueDetailVO revenue){
        MoneyFlow data = new MoneyFlow();
        data.setType(MoneyFlow.TYPE_REVENUE_OTHER);
        data.setTitle(revenue.getName());
        data.setAmount(revenue.getAmount().longValue());
        data.setNotice(revenue.getNotice());
        data.setReferData(revenue.getRevenueDetailNo().toString());
        data.setRegUserNo(RequestUtil.getLoginUserInfo().getUserNo());
        insert(data);

    }

    @Transactional
    public void addMoneyFlow(CapitalDetailVO capitalDetailVO){
        MoneyFlow data = new MoneyFlow();
        if(capitalDetailVO.APPROVE.equals(capitalDetailVO.getStatus())){
            if(CapitalDetail.CAPITAL_IN.equals(capitalDetailVO.getCapitalType())){
                data.setType(MoneyFlow.CAPITAL_IN);
                data.setTitle(capitalDetailVO.getTitle());
                data.setAmount(capitalDetailVO.getAmount().longValue());
                data.setNotice(capitalDetailVO.getNotice());
            }else{
                data.setType(MoneyFlow.CAPITAL_OUT);
                data.setTitle(capitalDetailVO.getTitle());
                data.setAmount(-capitalDetailVO.getAmount().longValue());
                data.setNotice(capitalDetailVO.getNotice());
            }
            data.setReferData(capitalDetailVO.getCapitalDetailNo().toString());
        }

//        else if(capitalDetailVO.FINISH.equals(capitalDetailVO.getStatus())){
//            data.setType(MoneyFlow.CAPITAL_OUT);
//            data.setTitle("[Tất toán] " + capitalDetailVO.getTitle());
//            data.setAmount(-capitalDetailVO.getAmount());
//            data.setReferData(capitalDetailVO.getCapitalDetailNo().toString());
//        }

        data.setRegUserNo(RequestUtil.getLoginUserInfo().getUserNo());
        insert(data);

    }

    @Transactional
    public void addMoneyFlow(LoanVO loanVO){
        MoneyFlow data = new MoneyFlow();
        data.setType(MoneyFlow.TYPE_CREDIT_PROVIDE);
        data.setTitle("Giải ngân HĐ vay [" + loanVO.getContractCode() + " / " + loanVO.getCustomerCode()+ " / " + loanVO.getCustomerName() +  "]");
        data.setAmount(-loanVO.getLoanAmount().longValue());
        data.setNotice("Người giải ngân: " + loanVO.getApproveUserName());
        data.setReferData(loanVO.getLoanNo().toString());
        data.setRegUserNo(RequestUtil.getLoginUserInfo().getUserNo());
        insert(data);
    }

    @Transactional
    public void finishLoanBeforePeriod(LoanVO loanVO){
        MoneyFlow data = new MoneyFlow();
        data.setType(MoneyFlow.TYPE_CREDIT_FINISH_RETURN);
        String title = "Tất Toán trước hạn HĐ vay [" + loanVO.getContractCode() + " / "+ loanVO.getCustomerCode()+ " / " + loanVO.getCustomerName() + "] ";
        String notice = "Vốn thu hồi: " + loanVO.getFinishReturnAmountFormat() + "\n";
        notice += "Lãi thu hồi: " + loanVO.getExtraAmountForamt();
        data.setTitle(title);
        long amount = (long)(loanVO.getFinishReturnAmount() == null? 0 : loanVO.getFinishReturnAmount());
        amount = amount + (loanVO.getExtraAmount() == null? 0 : loanVO.getExtraAmount());

        data.setAmount(amount);
        data.setNotice("Ghi Chú: " + loanVO.getFinishedNote() + "\n" + notice);
        data.setReferData(loanVO.getLoanNo().toString());
        data.setRegUserNo(RequestUtil.getLoginUserInfo().getUserNo());
        insert(data);
    }

    @Transactional
    public void approveLoanDetailPayment(List<LoanPaymentVO> payments){
        MoneyFlow data = new MoneyFlow();
        data.setTitle("Thu tín dụng từ khách hàng.");
        data.setType(MoneyFlow.TYPE_CREDIT_SESSION_RETURN);
        data.setRegUserNo(RequestUtil.getLoginUserInfo().getUserNo());
        List<String> detailNoList = new ArrayList<>();
        long amount = 0;
        String notice = "";
        for (LoanPaymentVO payment : payments) {
            detailNoList.add(payment.getDetailNoList());
            amount += payment.getAmount();
            notice += "[" + payment.getCustomerCode() +" / " +  payment.getCustomerName() + " / "
                    + payment.getDetailNoList().split(",").length + " kỳ / " + payment.getAmountFormat() + "] \n";
        }
        data.setAmount(amount);
        data.setNotice(notice.substring(0, notice.length() - 2));
        data.setReferData(StringUtils.join(detailNoList.toArray(), ","));
        insert(data);

    }


}
