package com.namowebiz.mugrun.applications.siteadmin.models.commoncode;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommonCode extends BaseObject {
    private String commonCode;
    private String groupCode;
    private String commonCodeName;
    private String commonCodeDesc;
    private String useYn;
    private String viewOrder;
}
