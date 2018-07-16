package com.namowebiz.mugrun.applications.siteadmin.dao.commoncode;

import com.namowebiz.mugrun.applications.siteadmin.models.commoncode.CommonCodeVO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Created by Hai Nguyen on 7/14/2016.
 */
@Component
public interface CommonCodeMapper {

    public List<CommonCodeVO> list(Map<String, Object> params);

    List<CommonCodeVO> getByGroupCode(String groupCode);
}
