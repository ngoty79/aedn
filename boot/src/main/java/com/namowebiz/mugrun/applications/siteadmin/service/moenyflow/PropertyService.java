package com.namowebiz.mugrun.applications.siteadmin.service.moenyflow;

import com.namowebiz.mugrun.applications.siteadmin.dao.moenyflow.PropertyMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.moenyflow.Property;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by asuspc on 11/29/2017.
 */
@Service
public class PropertyService {
    @Autowired
    private PropertyMapper propertyMapper;

    public Property get(){
        return propertyMapper.get(null);
    }

    public void addMoney(Long cash){
        propertyMapper.addMoney(cash);
    }
}
