package com.namowebiz.mugrun.applications.siteadmin.service.salary;

import com.namowebiz.mugrun.applications.siteadmin.dao.salary.SalaryMstMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryMst;
import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryMstVO;
import com.namowebiz.mugrun.applications.siteadmin.models.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 11/2/2017.
 */
@Service
public class SalaryMstService {
    @Autowired
    private SalaryMstMapper salaryMstMapper;

    public void insert(SalaryMst data){
        salaryMstMapper.insert(data);
    }

    public List<SalaryMstVO> list(Map params){
        return salaryMstMapper.list(params);
    }

    public Long count(Map params){
        Long count = salaryMstMapper.count(params);
        return count == null? 0L : count;
    }

    @Transactional
    public void delete(List<Long> salaryMasterNoList){
        for (Long salaryMasterNo : salaryMasterNoList) {
            salaryMstMapper.delete(salaryMasterNo);
        }
    }
    public void delete(Long salaryMasterNo){
        salaryMstMapper.delete(salaryMasterNo);
    }

    public SalaryMstVO getByPK(Long salaryMasterNo){
        return salaryMstMapper.getByPK(salaryMasterNo);
    }

    public void update(SalaryMstVO data){
        salaryMstMapper.update(data);
    }

    @Transactional
    public void addOrEditSalaryMst(SalaryMst salaryMst, User user){
        if(salaryMst.getSalaryMasterNo() == null){
            salaryMst.setRegUserNo(user.getUserNo());
            salaryMstMapper.insert(salaryMst);
        }else{
            SalaryMst model = salaryMstMapper.getByPK(salaryMst.getSalaryMasterNo());
            if(model != null){
                model.setModUserNo(user.getUserNo());
                model.setSalary(salaryMst.getSalary());
                model.setAllowance(salaryMst.getAllowance());
                salaryMstMapper.update(model);
            }
        }
    }

    public List<User> getAvailableUsers(){
        return salaryMstMapper.getAvailableUsers();
    }

    public List<User> getAllUsers(){
        return salaryMstMapper.getAllUsers();
    }



    public SalaryMstVO getByUserNo(Long userNo){
        return salaryMstMapper.getByUserNo(userNo);
    }
}
