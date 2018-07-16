package com.namowebiz.mugrun.components.modules.signup.models;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by Hai Nguyen on 7/12/2016.
 */
public class ModuleSignupVO extends ModuleSignup{

    @Getter
    @Setter
    private String mobileVerifyServiceCompName;
    @Getter @Setter
    private String ipinVerifyServiceCompName;
}
