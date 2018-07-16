package com.namowebiz.mugrun.applications.siteadmin.dao.salary;

import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryMst;
import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryMstVO;
import com.namowebiz.mugrun.applications.siteadmin.models.user.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by ngo.ty on 10/30/2017.
 */
@Repository
public interface SalaryMstMapper {
    List<SalaryMstVO> list(Map params);

    Long count(Map params);

    void delete(Long salaryMasterNo);

    void insert(SalaryMst data);

    SalaryMstVO getByPK(Long salaryMasterNo);

    List<User> getAvailableUsers();

    List<User> getAllUsers();

    SalaryMstVO getByUserNo(Long userNo);

    void update(SalaryMst data);

}
