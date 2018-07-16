package com.namowebiz.mugrun.applications.framework.helper;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Enumeration;

/**
 * Session 공통 Util.
 * @author jipark
 * @since 3.0
 */
public class SessionUtil {
	
	/**
	 * 해당 Key로 Session에 Unique 값 셋팅.
	 * @param request
	 * @param sessionKey session key
	 * @return session value
	 */
	public static String setUniqueValue(HttpServletRequest request, String sessionKey) {
		String sessionValue = "";
		
		try {
			sessionValue = System.currentTimeMillis() + "_" + RandomUtil.createRandomNum(6);
		} catch(Exception e) {
			sessionValue = System.currentTimeMillis() + "";
		}
		//System.out.println("[SessionUtil setUniqueValue] key=" + sessionKey + ", value=" + sessionValue);
		
		//기존 session값 제거.
		request.getSession().removeAttribute(sessionKey);
		//신규 session값 셋팅.
		request.getSession().setAttribute(sessionKey, sessionValue);
		
		return sessionValue;
	}
	
	/**
	 * Session의 모든 값을 제거한다.
	 * @param request
	 */
	public static void clearSession(HttpServletRequest request) {
		HttpSession session = request.getSession();
		String key = "";
		for (Enumeration e = session.getAttributeNames() ; e.hasMoreElements() ;) {
			key = (String) e.nextElement();
			session.removeAttribute(key);
		}
	}


}
