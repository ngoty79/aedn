package com.namowebiz.mugrun.applications.siteadmin.dao.salary;

import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryDetail;
import com.namowebiz.mugrun.applications.siteadmin.models.salary.SalaryDetailVO;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by ngo.ty on 10/30/2017.
 */
@Repository
public interface SalaryDetailMapper {
    List<SalaryDetailVO> list(Map params);

    Long count(Map params);

    void delete(Long salaryDetailNo);

    void insert(SalaryDetail data);

    SalaryDetailVO getByPK(Long salaryDetailNo);

    SalaryDetailVO getTotalSalaryByMonth(@Param("date") Date date);

    void update(SalaryDetail data);

    void approve(SalaryDetail data);

}
