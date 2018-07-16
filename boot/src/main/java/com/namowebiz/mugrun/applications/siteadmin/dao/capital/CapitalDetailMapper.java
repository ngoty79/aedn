package com.namowebiz.mugrun.applications.siteadmin.dao.capital;

import com.namowebiz.mugrun.applications.siteadmin.models.capital.CapitalDetail;
import com.namowebiz.mugrun.applications.siteadmin.models.capital.CapitalDetailVO;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by ngo.ty on 10/30/2017.
 */
@Repository
public interface CapitalDetailMapper {
    List<CapitalDetailVO> list(Map params);

    Long count(Map params);

    void delete(Long receiveDetailNo);

    void insert(CapitalDetail data);

    CapitalDetailVO getByPK(Long receiveDetailNo);

    void update(CapitalDetail data);

    void approve(CapitalDetail data);

    void finish(CapitalDetail data);

}
