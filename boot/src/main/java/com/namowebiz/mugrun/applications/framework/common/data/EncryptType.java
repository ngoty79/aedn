package com.namowebiz.mugrun.applications.framework.common.data;

/**
 * Enumeration for password encryption types.
 * Created by NgocSon on 11/12/2015.
 */
public enum EncryptType {
    PLAIN_TEXT("PlainText"),
    SHA_256("SHA-256"),
	MYSQL_PASSWORD("mysql-password");

    EncryptType(String encName) {
        this.typeName = encName;
    }

    /**
     * The name of the encryption type.
     */
    private final String typeName;

    /**
     * Return the name of this encryption type.
     * @return the name of this encryption type
     */
    public String getTypeName() {
        return this.typeName;
    }
}
