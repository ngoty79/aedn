package com.namowebiz.mugrun.applications.siteadmin.common.data;

public enum FileType {
    NORMAL("N"),
    IMAGE("I"),
    VIDEO("V");

    FileType(String code) {
        this.code = code;
    }

    /**
     * The name of the encryption type.
     */
    private final String code;

    /**
     * Return the name of this encryption type.
     * @return the name of this encryption type
     */
    public String getCode() {
        return this.code;
    }
}
