package com.namowebiz.mugrun.applications.siteadmin.service.commoncode;

import com.namowebiz.mugrun.applications.siteadmin.dao.commoncode.CommonCodeMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.commoncode.CommonCodeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by Hai Nguyen on 7/14/2016.
 */
@Service
public class CommonCodeService {

    @Autowired
    private CommonCodeMapper commonCodeMapper;


    public List<CommonCodeVO> list(Map<String, Object> params){
        return commonCodeMapper.list(params);
    }
}
