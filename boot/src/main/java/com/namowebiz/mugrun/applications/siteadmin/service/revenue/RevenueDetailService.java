package com.namowebiz.mugrun.applications.siteadmin.service.revenue;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.siteadmin.dao.revenue.RevenueDetailMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.revenue.RevenueDetail;
import com.namowebiz.mugrun.applications.siteadmin.models.revenue.RevenueDetailVO;
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
public class RevenueDetailService {
    @Autowired
    private RevenueDetailMapper revenueDetailMapper;
    @Autowired
    private MoneyFlowService moneyFlowService;


    public void insert(RevenueDetail data){
        revenueDetailMapper.insert(data);
    }

    public List<RevenueDetailVO> list(Map params){
        return revenueDetailMapper.list(params);
    }

    public List<RevenueDetailVO> getRevenueDetailList(Date startDate, Date endDate){
        Map<String, Object> map = new HashMap<>();
        map.put("startDate", startDate);
        map.put("endDate", endDate);
        map.put("status", RevenueDetail.APPROVE);
        return revenueDetailMapper.list(map);
    }

    public Long count(Map params){
        Long count = revenueDetailMapper.count(params);
        return count == null? 0L : count;
    }

    public void delete(Long salaryMasterNo){
        revenueDetailMapper.delete(salaryMasterNo);
    }

    @Transactional
    public JsonResponse delete(List<Long> costDetailNoList){
        JsonResponse jsonResponse = new JsonResponse(true, null);
        try{
            for (Long costDetailNo : costDetailNoList) {
                RevenueDetail model = revenueDetailMapper.getByPK(costDetailNo);
                if(model != null && RevenueDetail.WAITING.equals(model.getStatus())){
                    revenueDetailMapper.delete(costDetailNo);
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

    public RevenueDetailVO getByPK(Long salaryMasterNo){
        return revenueDetailMapper.getByPK(salaryMasterNo);
    }



    public void update(RevenueDetail data){
        revenueDetailMapper.update(data);
    }

    @Transactional
    public JsonResponse approve(Long costDetailNo, User user){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        try{
            RevenueDetailVO model = revenueDetailMapper.getByPK(costDetailNo);
            if(model != null){
                model.setApproveUserNo(user.getUserNo());
                revenueDetailMapper.approve(model);
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
    public JsonResponse addOrEditRevenueDetail(RevenueDetail revenueDetail, User user){
        JsonResponse jsonResponse = new JsonResponse(true, null);
        try{
            if(revenueDetail.getRevenueDetailNo() == null){
                revenueDetail.setStatus(RevenueDetail.WAITING);
                revenueDetail.setRegUserNo(user.getUserNo());
                revenueDetailMapper.insert(revenueDetail);
            } else {
                RevenueDetailVO model = revenueDetailMapper.getByPK(revenueDetail.getRevenueDetailNo());
                if(model != null){
                    model.setModUserNo(user.getUserNo());
                    model.setName(revenueDetail.getName());
                    model.setDate(revenueDetail.getDate());
                    model.setAmount(revenueDetail.getAmount());
                    model.setNotice(revenueDetail.getNotice());
                    revenueDetailMapper.update(model);
                }
            }
        }catch (Exception ex) {
            jsonResponse.setSuccess(false);
            jsonResponse.setMessages(ex.getMessage());
        }

        return jsonResponse;

    }
}
