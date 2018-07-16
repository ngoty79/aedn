package com.namowebiz.mugrun.applications.siteadmin.service.common;

import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordEncryptor {
	public final static String PLAIN_TEXT = "PlainText";
	public final static String SHA_256 = "SHA-256";
	public final static String SHA_256_BASE64 = "SHA-256BASE64Encoder";
	public final static String MD5 = "MD5";
	public final static String MD5_BASE64 = "MD5BASE64Encoder";

	private Md5PasswordEncoder md5Encoder = new Md5PasswordEncoder();
	private ShaPasswordEncoder shaEncoder = new ShaPasswordEncoder(256);
	
	//public String encrypt(String password) {
	//	return encrypt(PineTree.getDefaultEncryptType(), password);
	//}

	public String encrypt(String encryptType, String password) {
		if (SHA_256.equals(encryptType)) {
			return sha256(password);
		} else if (SHA_256_BASE64.equals(encryptType)) {
			return sha256Base64(password);
		} else if (MD5.equals(encryptType)) {
			return md5(password);
		} else if (MD5_BASE64.equals(encryptType)) {
			return md5Base64(password);
		}

        // Plain Text or not support scheme.
		return password;
	}

	//public boolean isPasswordValid(String encryptPassword, String rawPassword) {
	//	return isPasswordValid(PineTree.getDefaultEncryptType(), encryptPassword, rawPassword);
	//}

	public boolean isPasswordValid(String encryptType, String encryptPassword, String rawPassword) {
		if (SHA_256.equals(encryptType)) {
			shaEncoder.setEncodeHashAsBase64(false);
			return shaEncoder.isPasswordValid(encryptPassword, rawPassword, null);
		} else if (SHA_256_BASE64.equals(encryptType)) {
			shaEncoder.setEncodeHashAsBase64(true);
			return shaEncoder.isPasswordValid(encryptPassword, rawPassword, null);
		} else if (MD5.equals(encryptType)) {
			md5Encoder.setEncodeHashAsBase64(false);
			return md5Encoder.isPasswordValid(encryptPassword, rawPassword, null);
		} else if (MD5_BASE64.equals(encryptType)) {
			md5Encoder.setEncodeHashAsBase64(true);
			return md5Encoder.isPasswordValid(encryptPassword, rawPassword, null);
		}
		return encryptPassword.equals(rawPassword);
	}
	


	private String md5Base64(String password) {
		md5Encoder.setEncodeHashAsBase64(true);
		return md5Encoder.encodePassword(password, null);
	}

	private String md5(String password) {
		md5Encoder.setEncodeHashAsBase64(false);
		return md5Encoder.encodePassword(password, null);
	}

	private String sha256Base64(String password) {
		shaEncoder.setEncodeHashAsBase64(true);
		return shaEncoder.encodePassword(password, null);
	}

	private String sha256(String password) {
		shaEncoder.setEncodeHashAsBase64(false);
		return shaEncoder.encodePassword(password, null);
	}
}