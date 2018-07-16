package com.namowebiz.mugrun.applications.framework.common.data;

/**
 * Enumeration for admin types.
 * Created by NgocSon on 2/18/2016.
 */
public enum AdminType {
    SUPER_ADMIN("1","superAdmin"),
    CENTER_ADMIN("2","centerAdmin"),
    FACILITY_ADMIN("3","facilityAdmin"),
    RESERVATION_USER("4","reservationUser");

    AdminType(String typeCode, String themeName) {
        this.typeCode = typeCode;
        this.themeName = themeName;
    }

    /**
     * The code of the admin type.
     */
    private final String typeCode;

    /**
     *The name of admin type theme
     */
    private final String themeName;

    /**
     * Return the code of this admin type.
     * @return the code of this admin type
     */
    public String getTypeCode() {
        return this.typeCode;
    }

    /**
     * Return the theme name of this admin type
     * @return the theme name of this admin type
     */
    public String getThemeName() {
        return this.themeName;
    }
}
