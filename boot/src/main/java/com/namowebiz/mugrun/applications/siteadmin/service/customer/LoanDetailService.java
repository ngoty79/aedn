package com.namowebiz.mugrun.applications.siteadmin.service.customer;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.dao.customer.LoanDetailDao;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanDetail;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanPaymentVO;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.MoneyFlowService;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Created by asuspc on 9/17/2017.
 */
@Service
@CommonsLog
public class LoanDetailService {
    @Autowired
    private LoanDetailDao loanDetailDao;
    @Autowired
    private MoneyFlowService moneyFlowService;
    @Autowired
    private LoanPaymentService loanPaymentService;


    public LoanDetail getByPK(Long loanDetailNo){
        return loanDetailDao.getByPK(loanDetailNo);
    }

    public void insertList(List<LoanDetail> loanDetailList){
        loanDetailDao.insertList(loanDetailList);
    }

    public void deleteByLoanNo(Long loanNo){
        loanDetailDao.deleteByLoanNo(loanNo);
    }

    public Long getCountByLoanNo(Long loanNo){
        Map<String, Object> params = new HashMap<>();
        params.put("loanNo", loanNo);
        Long count = loanDetailDao.count(params);
        return count == null? 0L : count;

    }

    public PaginationList<LoanDetail> getByLoanNo(Long loanNo, String status, int pageNumber, int pageSize){
        PaginationList<LoanDetail> paging = new PaginationList<>(pageNumber, pageSize);
        Map<String, Object> params = new HashMap<>();
        params.put("loanNo", loanNo);
        if(!StringUtils.isEmpty(status)){
            params.put("status", status);
        }
        int startIndex = (pageNumber-1)*pageSize;
        params.put("today", new Date());
        params.put("startIndex", startIndex);
        params.put("pageSize", pageSize);
        List<LoanDetail> list = loanDetailDao.list(params);
        int number = startIndex;
        for (LoanDetail loanDetail : list) {
            number++;
            loanDetail.setNo(number);
        }
        Long count = loanDetailDao.count(params);
        paging.setRows(list);
        paging.setTotal(count == null? 0 : count);
        return paging;
    }

    public void updateStatus(Long LoanDetailNo, String status){
        LoanDetail loanDetail = getByPK(LoanDetailNo);
        loanDetail.setStatus(status);
        loanDetailDao.updateStatus(loanDetail);

    }

    public void confirm(List<Long> loanDetailNoList, Long userNo){
        loanDetailDao.confirm(loanDetailNoList, userNo);
    }

    public void approveFinishedLoan(Long loanNo, Long userNo){
        loanDetailDao.approveFinishedLoan(loanNo, userNo);
    }

    @Transactional
    public JsonResponse reject(Long paymentNo){
        JsonResponse jsonResponse = new JsonResponse(true, null);
        try{
            LoanPaymentVO payment = loanPaymentService.getByPK(paymentNo);
            if(payment != null){
                List<Long> detailNoList = convertToLongList(payment.getDetailNoList());
                loanDetailDao.reject(detailNoList, RequestUtil.getLoginUserInfo().getUserNo());
                loanPaymentService.delete(paymentNo);
            }
        }catch(Exception ex){
            jsonResponse.setSuccess(false);
            jsonResponse.setMessages(ex.getMessage());
            log.error(ex);
        }
        return jsonResponse;
    }
    @Transactional
    public JsonResponse approve(List<Long> paymentNoList){
        JsonResponse jsonResponse = new JsonResponse(true, null);
        List<LoanPaymentVO> payments = new ArrayList<>();
        try{
            for (Long paymentNo : paymentNoList) {
                LoanPaymentVO payment = loanPaymentService.getByPK(paymentNo);
                if(payment != null){
                    List<Long> detailNoList = convertToLongList(payment.getDetailNoList());
                    loanDetailDao.confirmLoanDetail(detailNoList, RequestUtil.getLoginUserInfo().getUserNo());

                    loanPaymentService.delete(paymentNo);
                    payments.add(payment);
                }
            }
            moneyFlowService.approveLoanDetailPayment(payments);

        }catch(Exception ex){
            jsonResponse.setSuccess(false);
            jsonResponse.setMessages(ex.getMessage());
            log.error(ex);
        }

        return jsonResponse;
    }

    private List<Long> convertToLongList(String str){
        List<Long> list = new ArrayList<>();
        String [] values = str.split(",");
        for (String val : values) {
            list.add(Long.valueOf(val));
        }
        return list;
    }

    public void pay(List<Long> detailNoList, Long modUserNo){
        loanDetailDao.pay(detailNoList, modUserNo);
    }

    public List<LoanDetail> getByDays(Long loanNo, int days){
        return loanDetailDao.getByDays(loanNo, days);
    }

    public List<LoanDetail> getByDetailNoList(List<Long> detailNoList){
        return loanDetailDao.getByDetailNoList(detailNoList);
    }
}
