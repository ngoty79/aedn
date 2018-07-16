package com.namowebiz.mugrun.applications.siteadmin.dao.cost;

import com.namowebiz.mugrun.applications.siteadmin.models.cost.CostDetail;
import com.namowebiz.mugrun.applications.siteadmin.models.cost.CostDetailVO;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by ngo.ty on 10/30/2017.
 */
@Repository
public interface CostDetailMapper {
    List<CostDetailVO> list(Map params);

    Long count(Map params);

    void delete(Long CostDetailNo);

    void insert(CostDetail data);

    CostDetailVO getByPK(Long CostDetailNo);

    void update(CostDetail data);

    void approve(CostDetail data);

}
