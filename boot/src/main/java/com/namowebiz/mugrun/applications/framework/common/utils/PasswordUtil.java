package com.namowebiz.mugrun.applications.framework.common.utils;


import com.namowebiz.mugrun.applications.framework.common.data.EncryptType;
import com.namowebiz.mugrun.applications.framework.dao.utils.PasswordUtilMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Util class for password related tasks.
 */
@Component
public class PasswordUtil {
    @Value("${mugrun.encryption.salt}")
    private String salt;
    @Value("${mugrun.crypto-passwordAlgorithm}")
    private String passwordAlgorithm;

    @Value("${mugrun.password.pattern}")
    private String passwordPattern;

    @Autowired
    private ShaPasswordEncoder sha256Encoder;

    @Autowired
    private PasswordUtilMapper passwordUtilMapper;
    
    /**
     * Encodes password using a specific algorithm provided in properties file.
     * @param rawPassword the value of the password to encode
     * @return the encoded password
     */
    public String encodePassword(String rawPassword) {
        if (EncryptType.PLAIN_TEXT.getTypeName().equals(passwordAlgorithm)) {
            return rawPassword;
        } else if (EncryptType.MYSQL_PASSWORD.getTypeName().equals(passwordAlgorithm)) {
            return passwordUtilMapper.getMysqlPasswordValue(rawPassword);
        } else {
            return sha256Encoder.encodePassword(rawPassword, salt);
        }
    }

    /**
     * Checks if the provided password matches the saved password.
     * @param encryptedPassword the value of the user's saved password
     * @param rawPassword the value of the password user provides
     * @return true if the 2 passwords match, otherwise false
     */
    public boolean isPasswordValid(String encryptedPassword, String rawPassword) {
        if (EncryptType.PLAIN_TEXT.getTypeName().equals(passwordAlgorithm)) {
            return rawPassword != null && rawPassword.equals(encryptedPassword);
        } else if (EncryptType.MYSQL_PASSWORD.getTypeName().equals(passwordAlgorithm)) {
            return rawPassword != null && encryptedPassword.equals(passwordUtilMapper.getMysqlPasswordValue(rawPassword));
        } else {
            return rawPassword != null
                    && sha256Encoder.isPasswordValid(encryptedPassword, rawPassword, salt);
        }
    }

    /**
     * Checks if the provided password matches pattern.
     * @param rawPassword the value of the password user provides
     * @return true if the passwords match pattern, otherwise false
     */
    public boolean isPasswordPattern(String rawPassword) {
        if (!"".equals(passwordPattern)) {
            return rawPassword.matches(passwordPattern);
        }
        return true;
    }
}
