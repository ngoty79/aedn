package com.namowebiz.mugrun.applications.siteadmin.dao.moenyflow;

import com.namowebiz.mugrun.applications.siteadmin.models.moenyflow.MoneyFlow;
import com.namowebiz.mugrun.applications.siteadmin.models.moenyflow.MoneyFlowVO;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by ngo.ty on 10/30/2017.
 */
@Repository
public interface MoneyFlowMapper {
    List<MoneyFlowVO> list(Map params);

    Long count(Map params);

    void insert(MoneyFlow data);

    MoneyFlowVO getByPK(Long MoneyFlowNo);



}
