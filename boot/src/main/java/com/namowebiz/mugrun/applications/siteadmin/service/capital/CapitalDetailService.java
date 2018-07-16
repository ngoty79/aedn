package com.namowebiz.mugrun.applications.siteadmin.service.capital;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.siteadmin.dao.capital.CapitalDetailMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.capital.CapitalDetail;
import com.namowebiz.mugrun.applications.siteadmin.models.capital.CapitalDetailVO;
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
public class CapitalDetailService {
    @Autowired
    private CapitalDetailMapper capitalDetailMapper;
    @Autowired
    private MoneyFlowService moneyFlowService;


    public void insert(CapitalDetail data){
        capitalDetailMapper.insert(data);
    }

    public List<CapitalDetailVO> list(Map params){
        return capitalDetailMapper.list(params);
    }

    public List<CapitalDetailVO> getCapitalDetailList(Date startDate, Date endDate){
        Map<String, Object> map = new HashMap<>();
        map.put("startDate", startDate);
        map.put("endDate", endDate);
        map.put("status", CapitalDetail.APPROVE);
        return capitalDetailMapper.list(map);
    }

    public Long count(Map params){
        Long count = capitalDetailMapper.count(params);
        return count == null? 0L : count;
    }

    public void delete(Long salaryMasterNo){
        capitalDetailMapper.delete(salaryMasterNo);
    }

    @Transactional
    public JsonResponse delete(List<Long> costDetailNoList){
        JsonResponse jsonResponse = new JsonResponse(true, null);
        try{
            for (Long costDetailNo : costDetailNoList) {
                CapitalDetail model = capitalDetailMapper.getByPK(costDetailNo);
                if(model != null && CapitalDetail.WAITING.equals(model.getStatus())){
                    capitalDetailMapper.delete(costDetailNo);
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

    public CapitalDetailVO getByPK(Long salaryMasterNo){
        return capitalDetailMapper.getByPK(salaryMasterNo);
    }



    public void update(CapitalDetail data){
        capitalDetailMapper.update(data);
    }

    @Transactional
    public JsonResponse approve(Long capitalDetailNo, User user){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        try{
            CapitalDetailVO model = capitalDetailMapper.getByPK(capitalDetailNo);
            if(model != null){
                model.setApproveUserNo(user.getUserNo());
                model.setStatus(CapitalDetailVO.APPROVE);
                capitalDetailMapper.approve(model);
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

    @Transactional
    public JsonResponse finish(Long capitalDetailNo, User user){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        try{
            CapitalDetailVO model = capitalDetailMapper.getByPK(capitalDetailNo);
            if(model != null){
                model.setFinishUserNo(user.getUserNo());
                model.setStatus(CapitalDetailVO.FINISH);
                capitalDetailMapper.finish(model);
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


    public JsonResponse addOrEditCapitalDetail(CapitalDetail capitalDetail, User user){
        JsonResponse jsonResponse = new JsonResponse(true, null);
        try{
            if(capitalDetail.getCapitalDetailNo() == null){
                capitalDetail.setStatus(CapitalDetail.WAITING);
                capitalDetail.setRegUserNo(user.getUserNo());
                capitalDetailMapper.insert(capitalDetail);
            } else {
                CapitalDetailVO model = capitalDetailMapper.getByPK(capitalDetail.getCapitalDetailNo());
                if(model != null){
                    model.setModUserNo(user.getUserNo());
                    model.setTitle(capitalDetail.getTitle());
                    model.setStartDate(capitalDetail.getStartDate());
                    model.setEndDate(capitalDetail.getEndDate());
                    model.setAmount(capitalDetail.getAmount());
                    model.setNotice(capitalDetail.getNotice());
                    capitalDetailMapper.update(model);
                }
            }
        }catch (Exception ex) {
            jsonResponse.setSuccess(false);
            jsonResponse.setMessages(ex.getMessage());
        }

        return jsonResponse;

    }
}
