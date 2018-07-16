package com.namowebiz.mugrun.applications.framework.common.data;

import lombok.Getter;

/**
 * Enumeration for user roles
 * Created by NgocSon on 6/30/2016.
 */
public enum Role {
    ROLE_ADMIN("ROLE_ADMIN"),
    ROLE_USER("ROLE_USER");

    Role(String roleName) {
        this.roleName = roleName;
    }

    @Getter
    private final String roleName;
}
