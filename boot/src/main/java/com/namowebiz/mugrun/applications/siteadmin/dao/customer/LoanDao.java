package com.namowebiz.mugrun.applications.siteadmin.dao.customer;

import com.namowebiz.mugrun.applications.siteadmin.models.customer.Loan;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanCount;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanVO;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 9/17/2017.
 */
@Repository
public interface LoanDao {

    LoanVO getByPK(Long customerNo);
    LoanVO getInfoByPK(Long customerNo);

    void insert(Loan loan);

//    void updateContractCode(Loan loan);

    void update(Loan loan);

    void delete(Long customerNo);

    List<LoanVO> list(Map<String, Object> params);

    List<LoanVO> getPayment(Map<String, Object> params);

    List<LoanVO> getByCustomerNo(Long customerNo);

    public Long count(Map<String, Object> params);

    List<LoanCount> getCountOfStaff(Map<String, Object> params);

    String getMaxContractCode(String prefix);

//    void updateMoneyFlow(@Param("contractCode") String contractCode, @Param("newContractCode") String newContractCode);


}
