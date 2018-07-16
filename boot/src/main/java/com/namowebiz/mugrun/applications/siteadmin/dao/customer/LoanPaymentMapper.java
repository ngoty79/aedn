package com.namowebiz.mugrun.applications.siteadmin.dao.customer;

import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanPayment;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanPaymentVO;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 12/12/2017.
 */
@Repository
public interface LoanPaymentMapper {

    void approve(LoanPayment data);

    void approveList(@Param("paymentNoList") List<Long> paymentNoList,
                     @Param("status") String status,
                     @Param("approveUserNo") Long approveUserNo);

    void delete(Long paymentNo);

    void insert(LoanPayment data);

    LoanPaymentVO getByPK(Long paymentNo);

    List<LoanPaymentVO> list(Map<String, Object> params);

    Long count(Map<String, Object> params);
}
