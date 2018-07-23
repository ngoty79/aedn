package com.namowebiz.mugrun.applications.siteadmin.service.cost;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.siteadmin.dao.cost.CostDetailMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.cost.CostDetail;
import com.namowebiz.mugrun.applications.siteadmin.models.cost.CostDetailVO;
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
public class CostDetailService {
    @Autowired
    private CostDetailMapper costDetailMapper;
    @Autowired
    private MoneyFlowService moneyFlowService;


    public void insert(CostDetail data){
        costDetailMapper.insert(data);
    }

    public List<CostDetailVO> list(Map params){
        return costDetailMapper.list(params);
    }

    public List<CostDetailVO> getCostDetailList(Date startDate, Date endDate){
        Map<String, Object> map = new HashMap<>();
        map.put("startDate", startDate);
        map.put("endDate", endDate);
        map.put("status", CostDetail.APPROVE);
        return costDetailMapper.list(map);
    }

    public Long count(Map params){
        Long count = costDetailMapper.count(params);
        return count == null? 0L : count;
    }

    public void delete(Long salaryMasterNo){
        costDetailMapper.delete(salaryMasterNo);
    }

    @Transactional
    public JsonResponse delete(List<Long> costDetailNoList){
        JsonResponse jsonResponse = new JsonResponse(true, null);
        try{
            for (Long costDetailNo : costDetailNoList) {
                CostDetail model = costDetailMapper.getByPK(costDetailNo);
                if(model != null && CostDetail.WAITING.equals(model.getStatus())){
                    costDetailMapper.delete(costDetailNo);
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

    public CostDetailVO getByPK(Long salaryMasterNo){
        return costDetailMapper.getByPK(salaryMasterNo);
    }



    public void update(CostDetail data){
        costDetailMapper.update(data);
    }

    @Transactional
    public JsonResponse approve(Long costDetailNo, User user){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        try{
            CostDetailVO model = costDetailMapper.getByPK(costDetailNo);
            if(model != null){
                model.setApproveUserNo(user.getUserNo());
                costDetailMapper.approve(model);
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
    public JsonResponse addOrEditCostDetail(CostDetail costDetail, User user){
        JsonResponse jsonResponse = new JsonResponse(true, null);
        try{
            if(costDetail.getCostDetailNo() == null){
                costDetail.setStatus(CostDetail.WAITING);
                costDetail.setRegUserNo(user.getUserNo());
                costDetailMapper.insert(costDetail);
            } else {
                CostDetailVO model = costDetailMapper.getByPK(costDetail.getCostDetailNo());
                if(model != null){
                    model.setModUserNo(user.getUserNo());
                    model.setCostType(costDetail.getCostType());
                    model.setName(costDetail.getName());
                    model.setDate(costDetail.getDate());
                    model.setAmount(costDetail.getAmount());
                    costDetailMapper.update(model);
                }
            }
        }catch (Exception ex) {
            jsonResponse.setSuccess(false);
            jsonResponse.setMessages(ex.getMessage());
        }

        return jsonResponse;

    }
}
