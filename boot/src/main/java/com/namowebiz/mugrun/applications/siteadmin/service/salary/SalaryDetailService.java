package com.namowebiz.mugrun.applications.siteadmin.service.salary;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.siteadmin.dao.salary.SalaryDetailMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryDetail;
import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryDetailVO;
import com.namowebiz.mugrun.applications.siteadmin.models.user.User;
import com.namowebiz.mugrun.applications.siteadmin.service.moenyflow.MoneyFlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 11/2/2017.
 */
@Service
public class SalaryDetailService {
    @Autowired
    private SalaryDetailMapper salaryDetailMapper;
    @Autowired
    private MoneyFlowService moneyFlowService;

    public void insert(SalaryDetail data){
        salaryDetailMapper.insert(data);
    }

    public List<SalaryDetailVO> list(Map params){
        return salaryDetailMapper.list(params);
    }

    public Long count(Map params){
        Long count = salaryDetailMapper.count(params);
        return count == null? 0L : count;
    }

    public void delete(Long salaryMasterNo){
        salaryDetailMapper.delete(salaryMasterNo);
    }

    @Transactional
    public JsonResponse delete(List<Long> salaryDetailNoList){
        JsonResponse jsonResponse = new JsonResponse(true, null);
        try{
            for (Long salaryDetailNo : salaryDetailNoList) {
                SalaryDetail model = salaryDetailMapper.getByPK(salaryDetailNo);
                if(model != null && SalaryDetail.WAITING.equals(model.getStatus())){
                    salaryDetailMapper.delete(salaryDetailNo);
                }else{
                    jsonResponse.setSuccess(false);
                    jsonResponse.setMessages("Không Thể Xóa.");
                    break;
                }

            }
        } catch (Exception ex) {
            jsonResponse.setSuccess(false);
            jsonResponse.setMessages(ex.getMessage());
        }

        return jsonResponse;


    }

    public SalaryDetailVO getByPK(Long salaryMasterNo){
        return salaryDetailMapper.getByPK(salaryMasterNo);
    }

    public SalaryDetailVO getByUserAndMonth(Long userNo, int month, int year){
        Map<String, Object> params = new HashMap<>();
        params.put("userNo", userNo);
        params.put("month", month);
        params.put("year", year);
        List<SalaryDetailVO> list = salaryDetailMapper.list(params);
        if(list != null && !list.isEmpty()){
            return list.get(0);
        }
        return null;
    }


    public void update(SalaryDetail data){
        salaryDetailMapper.update(data);
    }

    @Transactional
    public JsonResponse approve(Long salaryDetailNo, User user){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        try{
            SalaryDetailVO model = salaryDetailMapper.getByPK(salaryDetailNo);
            if(model != null){
                model.setApproveUserNo(user.getUserNo());
                salaryDetailMapper.approve(model);
                moneyFlowService.addMoneyFlow(model);
                jsonResponse.setSuccess(true);
                jsonResponse.setData(model);
            }
        }catch (Exception ex) {
            jsonResponse.setSuccess(false);
            jsonResponse.setMessages(ex.getMessage());
        }

        return jsonResponse;
    }
    public JsonResponse addOrEditSalaryDetail(SalaryDetail salaryDetail, User user){
        JsonResponse jsonResponse = new JsonResponse(true, null);
        try{
            if(salaryDetail.getSalaryDetailNo() == null){
                SalaryDetailVO data = getByUserAndMonth(salaryDetail.getUserNo(), salaryDetail.getMonth(), salaryDetail.getYear());
                if(data == null){
                    salaryDetail.setStatus(SalaryDetail.WAITING);
                    salaryDetail.setRegUserNo(user.getUserNo());
                    salaryDetailMapper.insert(salaryDetail);
                }else{
                    jsonResponse.setSuccess(false);
                    jsonResponse.setMessages("Lương của [" + data.getUserName() + "] tháng: " + salaryDetail.getMonth() + "/" + salaryDetail.getYear() + " đã tồn tại.");
                }
            } else {
                SalaryDetailVO model = salaryDetailMapper.getByPK(salaryDetail.getSalaryDetailNo());
                if(model != null){
                    SalaryDetailVO data = getByUserAndMonth(salaryDetail.getUserNo(), salaryDetail.getMonth(), salaryDetail.getYear());
                    if(data != null && !data.getSalaryDetailNo().equals(salaryDetail.getSalaryDetailNo())){
                        jsonResponse.setSuccess(false);
                        jsonResponse.setMessages("Lương của [" + data.getUserName() + "] tháng: " + salaryDetail.getMonth() + "/" + salaryDetail.getYear() + " đã tồn tại.");
                    }else{
                        model.setModUserNo(user.getUserNo());
                        model.setSalary(salaryDetail.getSalary());
                        model.setAllowance(salaryDetail.getAllowance() == null ? 0 : salaryDetail.getAllowance());
                        model.setExtraCost(salaryDetail.getExtraCost() == null ? 0 : salaryDetail.getExtraCost());
                        model.setMonth(salaryDetail.getMonth());
                        model.setYear(salaryDetail.getYear());
                        salaryDetailMapper.update(model);
                    }
                }
            }
        }catch (Exception ex) {
            jsonResponse.setSuccess(false);
            jsonResponse.setMessages(ex.getMessage());
        }

        return jsonResponse;

    }
    public SalaryDetailVO getTotalSalaryByMonth(Date date){
        SalaryDetailVO salaryDetail = salaryDetailMapper.getTotalSalaryByMonth(date);
        return salaryDetail == null? new SalaryDetailVO() : salaryDetail;
    }
}
