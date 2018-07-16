package com.namowebiz.mugrun.applications.siteadmin.models.user;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by Hai Nguyen on 6/26/2016.
 */
public class UserDataExcels {

    public UserDataExcels() {
    }

    public UserDataExcels(String columnName, String columnData) {
        this.columnName = columnName;
        this.columnData = columnData;
    }

    @Getter @Setter
    private String columnName;

    @Getter @Setter
    private String columnData;
}
