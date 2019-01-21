package com.namowebiz.mugrun.applications.siteadmin.service.customer;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.dao.customer.LoanDao;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.*;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.MoneyFlowService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by asuspc on 9/17/2017.
 */
@Service
public class LoanService {
    @Autowired
    private LoanDao loanDao;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private LoanDetailService loanDetailService;
    @Autowired
    private LoanPaymentService loanPaymentService;
    @Autowired
    private MoneyFlowService moneyFlowService;

    public LoanVO getByPK(Long loanNo){
        return loanDao.getByPK(loanNo);
    }

    public LoanVO getInfoByPK(Long loanNo){
        return loanDao.getInfoByPK(loanNo);
    }

    public void insert(Loan loan){
        loanDao.insert(loan);
    }

    public void update(Loan loan){
        loanDao.update(loan);
    }

    @Transactional
    public boolean delete(Long loanNo){
        boolean sucess = false;
        Loan loan = getByPK(loanNo);
        if(loan != null){
            long count = loanDetailService.getCountByLoanNo(loanNo);
            if(count == 0){
                loanDao.delete(loanNo);
                sucess = true;
            }
        }
        return sucess;
    }

    public List<LoanVO> getLoanPlan(Map<String, Object> params){
        return loanDao.getLoanPlan(params);
    }

    public Integer getCountLoanPlan(Map<String, Object> params){
        Integer count = loanDao.getCountLoanPlan(params);
        return count == null? 0 : count;
    }

    public List<LoanVO> list(Map<String, Object> params){
        return loanDao.list(params);
    }

    public List<LoanVO> getLoanList(Map<String, Object> params){
        return loanDao.getLoanList(params);
    }

    public List<LoanVO> getPayment(Map<String, Object> params){
        return loanDao.getPayment(params);
    }



    public Long countLoanList(Map<String, Object> params){
        Long count = loanDao.countLoanList(params);
        return count == null? 0L : count;
    }
    public Long count(Map<String, Object> params){
        Long count = loanDao.count(params);
        return count == null? 0L : count;
    }


    public List<LoanVO> getByCustomerNo(Long customerNo){
        return loanDao.getByCustomerNo(customerNo);
    }

    public long getCountByCustomerNo(Long customerNo){
        Map<String, Object> params = new HashMap<>();
        params.put("customerNo", customerNo);
        return count(params);
    }

    @Transactional
    public void addOrEdit(Loan model, Long userNo){
        if(model.getLoanNo() == null){
            model.setRegUserNo(userNo);
            model.setStatus(Loan.STATUS_NEW);
            model.setContractCode(getNextContractCode());
            model.setRegDate(new Date());
            insert(model);
        }else{
            Loan loan = getByPK(model.getLoanNo());
            loan.setModUserNo(userNo);
            loan.setStaffUserNo(model.getStaffUserNo());
            loan.setDutyStaffNo(model.getDutyStaffNo());
            loan.setLoanPeriod(model.getLoanPeriod());
            loan.setStartDate(model.getStartDate());
            loan.setEndDate(model.getEndDate());
            loan.setLoanType(model.getLoanType());
            loan.setLoanPayType(model.getLoanPayType());
            loan.setLoanAmount(model.getLoanAmount());
            loan.setLoanInterest(model.getLoanInterest());
            loan.setCustomerAsset(model.getCustomerAsset());
            loan.setModDate(new Date());
            update(loan);
        }
    }


    @Transactional
    public JsonResponse approve(Long loanNo){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        if(!RequestUtil.getLoginUserInfo().isApprove()){
            jsonResponse.setData("Không có quyền duyệt HĐ vay.");
            return jsonResponse;
        }

        LoanVO loan = getInfoByPK(loanNo);
        if(loan != null){
            if(Loan.STATUS_NEW.equals(loan.getStatus())){
                List<LoanDetail> details = generatePayDetailList(loan);
                loanDetailService.deleteByLoanNo(loanNo);
                loanDetailService.insertList(details);
                loan.setStatus(Loan.STATUS_APPROVE);
                Long userNo = RequestUtil.getLoginUserInfo().getUserNo();
                loan.setApproveUserNo(userNo);
                loan.setApproveDate(new Date());
                update(loan);
                loan.setApproveUserName(RequestUtil.getLoginUserInfo().getName());
                moneyFlowService.addMoneyFlow(loan);
                jsonResponse.setSuccess(true);
            }else{
                jsonResponse.setData("Lỗi không thể duyệt hợp này.");
                return jsonResponse;
            }

        }

        return jsonResponse;
    }

    @Transactional
    public JsonResponse deny(Long loanNo){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        if(!RequestUtil.getLoginUserInfo().isApprove()){
            jsonResponse.setData("Không có quyền từ chối HĐ vay.");
            return jsonResponse;
        }
        LoanVO loan = getByPK(loanNo);
        if(loan != null){
            if(Loan.STATUS_NEW.equals(loan.getStatus())){
                loan.setStatus(Loan.STATUS_CANCEL);
                Long userNo = RequestUtil.getLoginUserInfo().getUserNo();
                loan.setDenyUserNo(userNo);
                loan.setDenyDate(new Date());
                update(loan);
                jsonResponse.setSuccess(true);
            }else{
                jsonResponse.setData("Lỗi: không thể duyệt hợp này.");
                return jsonResponse;
            }
        }
        return jsonResponse;
    }


    @Transactional
    public JsonResponse requestFinish(Long loanNo, Integer finishReturnAmount, Integer extraAmount, Integer discountAmount, String finishedNote){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        Long userNo = RequestUtil.getLoginUserInfo().getUserNo();
        LoanVO loan = getByPK(loanNo);
        if(loan != null){
            loan.setStatus(Loan.STATUS_REQUEST_FINISHED);
            loan.setModUserNo(userNo);
            loan.setRequestUserNo(userNo);
            loan.setRequestDate(new Date());
            loan.setFinishReturnAmount(finishReturnAmount == null ? 0 : finishReturnAmount);
            loan.setExtraAmount(extraAmount == null ? 0 : extraAmount);
            loan.setDiscountAmount(discountAmount == null ? 0 : discountAmount);
            loan.setFinishedNote(finishedNote);
            update(loan);
            jsonResponse.setSuccess(true);
        }
        return jsonResponse;
    }

    @Transactional
    public JsonResponse approveFinish(Long loanNo, Double finishReturnAmount, Double extraAmount, String finishedNote){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        if(!RequestUtil.getLoginUserInfo().isFinish()){
            jsonResponse.setData("Không có quyền tất toán.");
            return jsonResponse;
        }

        Long userNo = RequestUtil.getLoginUserInfo().getUserNo();
        LoanVO loan = getInfoByPK(loanNo);
        if(loan != null){
            loan.setStatus(Loan.STATUS_FINISHED);
            loan.setFinishUserNo(userNo);
            loan.setFinishDate(new Date());
            update(loan);
            if((loan.getFinishReturnAmount() != null && loan.getFinishReturnAmount() > 0)
                    || (loan.getExtraAmount() != null && loan.getExtraAmount() > 0) ){
                moneyFlowService.finishLoanBeforePeriod(loan);
            }

            jsonResponse.setSuccess(true);
        }

        return jsonResponse;
    }

    @Transactional
    public JsonResponse rejectRequest(Long loanNo){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        if(!RequestUtil.getLoginUserInfo().isFinish()){
            jsonResponse.setData("Không có quyền.");
            return jsonResponse;
        }

        Long userNo = RequestUtil.getLoginUserInfo().getUserNo();
        LoanVO loan = getByPK(loanNo);
        if(loan != null){
            loan.setStatus(Loan.STATUS_APPROVE);
            loan.setModUserNo(userNo);
            loan.setFinishReturnAmount(0);
            loan.setExtraAmount(0);
            loan.setDiscountAmount(0);
            loan.setFinishedNote("");
            update(loan);
            jsonResponse.setSuccess(true);
        }
        return jsonResponse;
    }


    private List<LoanDetail> generatePayDetailList(LoanVO loan){
        List<LoanDetail> details = new ArrayList<>();

        int sessions = loan.getTotalPaySessions();
        int dayOfSession = loan.getDayOfSession();
        double payByDay = loan.getPayByDay();
        double profitByDay = loan.getProfitByDay();
        double capitalByDay = loan.getCapitalByDay();

        Calendar startDate = Calendar.getInstance();
        Calendar endDate = Calendar.getInstance();
        startDate.setTime(loan.getStartDate());
        endDate.setTime(loan.getStartDate());
        Date now = new Date();
        for (int i = 0; i < sessions; i++) {
            LoanDetail loanDetail = new LoanDetail();
            loanDetail.setLoanNo(loan.getLoanNo());

            loanDetail.setStatus(LoanDetail.STATUS_NEW);
            if(i == 0){
                startDate.add(Calendar.DATE, 0);
                endDate.add(Calendar.DATE,(dayOfSession - 1));
            }
            else{
                startDate.add(Calendar.DATE, dayOfSession);
                endDate.add(Calendar.DATE, dayOfSession);
                if(endDate.getTime().after(loan.getEndDate())){
                    endDate.setTime(loan.getEndDate());
                }
            }
            loanDetail.setStartDate(startDate.getTime());
            loanDetail.setEndDate(endDate.getTime());

            loanDetail.setAmount((int) Math.round(loanDetail.getTotalDays() * payByDay));
            loanDetail.setCapital((int) Math.round(loanDetail.getTotalDays() * capitalByDay));
            loanDetail.setProfit((int)Math.round(loanDetail.getTotalDays() * profitByDay));
            details.add(loanDetail);
        }
        return details;
    }

    public List<LoanCount> getCountOfStaff(Map<String, Object> params){
        return loanDao.getCountOfStaff(params);
    }

    @Transactional
    public JsonResponse payment(List<LoanVO> dataList){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        if(dataList != null && !dataList.isEmpty()){
            Long userNo = RequestUtil.getLoginUserInfo().getUserNo();
            for (LoanVO data : dataList) {
                LoanVO loan = this.getByPK(data.getLoanNo());
                if(loan != null){
                    int amount = 0;
                    List<Long> detailNoList = new ArrayList<>();
                    List<LoanDetail> details = loanDetailService.getByDays(data.getLoanNo(), data.getDelayDays());
                    for (LoanDetail detail : details) {
                        detailNoList.add(detail.getLoanDetailNo());
                        amount += detail.getAmount();
                    }
                    loanDetailService.pay(detailNoList, userNo);
                    loanPaymentService.insertData(data.getLoanNo(), detailNoList, amount, userNo);
                }
            }
            jsonResponse.setSuccess(true);
        }
        return jsonResponse;
    }

    public String getMaxContractCode(String prefix){
        return loanDao.getMaxContractCode(prefix);
    }

    public String getNextContractCode(){
        String prefixCode = "AEĐN" + Calendar.getInstance().get(Calendar.YEAR) + "-";
        String contractCode = loanDao.getMaxContractCode(prefixCode);
        if(StringUtils.isEmpty(contractCode)){
            return prefixCode + "0001";
        }else{
            String value = contractCode.replace(prefixCode, "");
            value = StringUtils.stripStart(value, "0");
            int sequence = Integer.valueOf(value) + 1;
            String nextCode = prefixCode + StringUtils.leftPad(sequence + "", 4, "0");
            return nextCode;
        }
    }


}
