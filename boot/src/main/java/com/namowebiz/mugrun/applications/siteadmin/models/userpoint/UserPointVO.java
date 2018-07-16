package com.namowebiz.mugrun.applications.siteadmin.models.userpoint;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by jipark on 7/17/2016.
 */
public class UserPointVO extends UserPoint {

    @Getter @Setter
    private Long userNo;

    @Getter @Setter
    private String userID;

    @Getter @Setter
    private String userName;

    @Getter @Setter
    private String userNickname;

}
