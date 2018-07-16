package com.namowebiz.mugrun.applications.siteadmin.service.common;

import com.namowebiz.mugrun.applications.siteadmin.dao.commoncode.CommonCodeMapper;
import com.namowebiz.mugrun.applications.siteadmin.models.commoncode.CommonCodeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CodeService {

    @Autowired
    private CommonCodeMapper codeMapper;

    public List<CommonCodeVO> getByCodeGroup(String groupCode){
        return codeMapper.getByGroupCode(groupCode);
    }

}
