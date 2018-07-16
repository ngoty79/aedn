package com.namowebiz.mugrun.applications.framework.common.utils;

import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

/**
 * Triple DES 클래스
 * This class defines methods for encrypting and decrypting using the Triple DES
 * algorithm and for generating, reading and writing Triple DES keys. It also
 * defines a main() method that allows these methods to be used from the command
 * line.
 */
@CommonsLog
public class TripleDES {

	/**
	 * encrypt
	 * @param keyString
	 * @param text
	 * @return
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchPaddingException
	 * @throws InvalidKeyException
	 * @throws UnsupportedEncodingException
	 */
	private static String keyString  = "";
	
	public static String encrypt(String keyString, String text)
      throws IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, UnsupportedEncodingException {
	  
		SecretKey key = TripleDES.genKey(keyString);
		Cipher cipher = Cipher.getInstance("DESede");
		cipher.init(Cipher.ENCRYPT_MODE, key);

		byte[] plainText = text.getBytes("UTF8");
		byte[] encrypted = cipher.doFinal(plainText);
      
		//new String();

        return new String(Hex.encodeHex(encrypted));
	}
  
	/**
	 * generate key
	 * @param keyString
	 * @return
	 */
	private static SecretKey genKey(String keyString) {
		//String keyString = "4d89g13j4j91j27c582ji69373y788r6"; // I made this key up by the way!
		byte[] keyB = new byte[24]; // a Triple DES key is a byte[24] array
		
		for (int i = 0; i < keyString.length() && i < keyB.length; i++) {
			keyB[i] = (byte) keyString.charAt(i);
		}
		// Make the Key
        return new SecretKeySpec(keyB, "DESede");
	}

	/**
	 * decrypt
	 * @param keyString
	 * @param text
	 * @return
	 * @throws NoSuchAlgorithmException
	 * @throws InvalidKeyException
	 * @throws IOException
	 * @throws IllegalBlockSizeException
	 * @throws NoSuchPaddingException
	 * @throws BadPaddingException
	 * @throws DecoderException
	 */
	public static String decrypt(String keyString, String text)
      throws NoSuchAlgorithmException, InvalidKeyException, IOException,
			IllegalBlockSizeException, NoSuchPaddingException,
			BadPaddingException, DecoderException {
		SecretKey key = TripleDES.genKey(keyString);
		
		Cipher cipher = Cipher.getInstance("DESede");
		cipher.init(Cipher.DECRYPT_MODE, key);

		byte[] decrypted = cipher.doFinal(Hex.decodeHex(text.toCharArray()));

        return new String(decrypted, "UTF-8");
	}
	
	/**
	 * 암호화
	 * 암호화키와 같이 리턴한다.(암호화키 : 16자리)
	 * @param text
	 * @return
	 */
	public static String encrypt(String text){
		String encode = "";
		String encKeyString = "";
		
		if(text == null || "".equals(text)){
			return "";
		}
		
		try {
			setUp();
			
			BASE64Encoder b64enc = new BASE64Encoder();
			encKeyString = b64enc.encode(keyString.getBytes());
			encode = b64enc.encode(encrypt(keyString, text).getBytes());
		} catch (Exception e) {
			log.error(e.getMessage(),e);
		} 
		
		return encKeyString + encode;
	}
	
	/**
	 * 복호화
	 * @param text
	 * @return
	 */
	public static String decrypt(String text){
		String decode = "";
		BASE64Decoder b64dec = new BASE64Decoder();
		
		if(text == null || "".equals(text)){
			return "";
		}
		
		if(text.length() <= 16){
			return text;
		}
		
		try {
			//앞16자리 암호화 키를 뽑아낸다.
			byte[] b = b64dec.decodeBuffer(text.substring(0, 16));
			
			String decKeyString = new String(b);
			String decString =  new String(b64dec.decodeBuffer(text.substring(16, text.length())));
			
			decode = decrypt(decKeyString, decString);
		} catch (Exception e) {
			log.error(e.getMessage(),e);
			decode = text;
		}
		
		return decode;
	}
	private static void setUp() throws Exception {
		keyString = RandomUtil.createRandomNum(10);
	}
}

