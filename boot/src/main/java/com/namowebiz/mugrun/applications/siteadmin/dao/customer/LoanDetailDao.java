package com.namowebiz.mugrun.applications.siteadmin.dao.customer;

import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanDetail;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 9/17/2017.
 */
@Repository
public interface LoanDetailDao {

    void insertList(@Param("details") List<LoanDetail> loanDetailList);

    LoanDetail getByPK(Long loanDetailNo);

    void updateStatus(LoanDetail loanDetail);

    void approveFinishedLoan(@Param("loanNo") Long loanNo, @Param("userNo") Long userNo);

    void pay(@Param("detailNoList") List<Long> detailNoList, @Param("modUserNo") Long modUserNo);

    void deleteByLoanNo(Long loanNo);

    void confirmLoanDetail(@Param("detailNoList") List<Long> detailNoList, @Param("userNo")Long userNo);

    void reject(@Param("detailNoList") List<Long> detailNoList, @Param("userNo")Long userNo);

    void confirm(@Param("loanDetailNoList") List<Long> loanDetailNoList, @Param("userNo") Long userNo);

    List<LoanDetail> list(Map<String, Object> params);

    List<LoanDetail> getByDetailNoList(@Param("detailNoList") List<Long> detailNoList);

    List<LoanDetail> getByDays(@Param("loanNo") Long loanNo, @Param("days") int days);

    Long count(Map<String, Object> params);

}
