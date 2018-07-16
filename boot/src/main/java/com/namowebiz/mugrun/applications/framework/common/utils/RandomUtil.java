package com.namowebiz.mugrun.applications.framework.common.utils;

import java.util.Random;

/**
 * 난수생성 모듈
 * @author jipark
 * @since 2009.12.08
 */
public class RandomUtil {
	
	/**
	 * 난수 생성
	 * @param size 난수 자리수
	 * @return 난수
	 * @throws Exception
	 */
	public static String createRandomNum(int size) throws Exception {
		StringBuilder random = new StringBuilder();
		Random rnd = new Random();
		int i2 = 0;
		
		for(int i=0; i<size; i++) {
			i2 = rnd.nextInt(10);
			random.append(i2);
		}
//		logger.debug("---> random=[" + random.toString() + "]");
		
		return random.toString();
	}

}
