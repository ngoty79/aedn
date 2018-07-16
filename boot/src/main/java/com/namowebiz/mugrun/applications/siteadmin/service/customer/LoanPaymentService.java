package com.namowebiz.mugrun.applications.siteadmin.service.customer;

import com.namowebiz.mugrun.applications.siteadmin.dao.customer.LoanPaymentMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanPayment;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanPaymentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.util.StringUtils;

import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 12/13/2017.
 */
@Service
public class LoanPaymentService {
    @Autowired
    LoanPaymentMapper loanPaymentMapper;

    public LoanPaymentVO getByPK(Long paymentNo){
        return loanPaymentMapper.getByPK(paymentNo);
    }

    public void delete(Long paymentNo){
        loanPaymentMapper.delete(paymentNo);
    }
    public void approve(LoanPayment data){
        loanPaymentMapper.approve(data);
    }

    public void approveList(List<Long> paymentNoList, String status, Long approveUserNo){
        loanPaymentMapper.approveList(paymentNoList, status, approveUserNo);
    }

    public void insert(LoanPayment data){
        loanPaymentMapper.insert(data);
    }

    public List<LoanPaymentVO> list(Map<String, Object> params){
        return loanPaymentMapper.list(params);
    }

    public Long count(Map<String, Object> params){
        Long count = loanPaymentMapper.count(params);
        return count == null? 0L : count;
    }


    public void insertData(Long loanNo, List<Long> detailNoList, int amount, Long userNo){
        LoanPayment data = new LoanPayment();
        data.setLoanNo(loanNo);
        data.setDetailNoList(StringUtils.join(detailNoList, ","));
        data.setRegUserNo(userNo);
        data.setStatus(LoanPayment.STATUS_REQUEST);
        data.setAmount(amount);
        insert(data);
    }
}
