package com.namowebiz.mugrun.components.modules.signup.models;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by Hai Nguyen on 7/12/2016.
 */
public class ModuleSignup extends BaseObject{

    @Getter
    @Setter
    private Long moduleNo;
    @Getter @Setter
    private String moduleTitle;
    @Getter @Setter
    private String moduleDesc;
    @Getter @Setter
    private String certType;
    @Getter @Setter
    private Integer captchaYn;
    @Getter @Setter
    private String memberJoinStep;
    @Getter @Setter
    private String mobileVerifyService;
    @Getter @Setter
    private String ipinVerifyService;
    @Getter @Setter
    private Integer provisionAgreeYn;
}
