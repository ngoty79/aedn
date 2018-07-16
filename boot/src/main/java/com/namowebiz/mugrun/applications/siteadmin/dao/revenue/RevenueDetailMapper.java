package com.namowebiz.mugrun.applications.siteadmin.dao.revenue;

import com.namowebiz.mugrun.applications.siteadmin.models.revenue.RevenueDetail;
import com.namowebiz.mugrun.applications.siteadmin.models.revenue.RevenueDetailVO;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by ngo.ty on 10/30/2017.
 */
@Repository
public interface RevenueDetailMapper {
    List<RevenueDetailVO> list(Map params);

    Long count(Map params);

    void delete(Long receiveDetailNo);

    void insert(RevenueDetail data);

    RevenueDetailVO getByPK(Long receiveDetailNo);

    void update(RevenueDetail data);

    void approve(RevenueDetail data);

}
