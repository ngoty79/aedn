package com.namowebiz.mugrun.components.modules.signup.models;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by Hai Nguyen on 7/13/2016.
 */
public class MemeberJoinStep {
    @Getter @Setter
    private boolean userAgreement;


    @Getter @Setter
    private boolean joinComplete;

    @Getter @Setter
    private boolean enterMemberInfo;

    @Getter @Setter
    private boolean identityVerification;
}
