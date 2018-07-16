package com.namowebiz.mugrun.applications.siteadmin.dao.moenyflow;

import com.namowebiz.mugrun.applications.siteadmin.models.moenyflow.Property;
import org.springframework.stereotype.Repository;

/**
 * Created by ngo.ty on 10/30/2017.
 */
@Repository
public interface PropertyMapper {

    Property get(Long MoneyFlowNo);

    void addMoney(Long cash);



}
