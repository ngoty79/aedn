/**
 * CSS 관련 조작을 하는 static 메소드
 */
package com.namowebiz.mugrun.applications.framework.helper;

import java.util.HashMap;
import java.util.Map;

/**
 * @author shpark
 *
 */
public class CssUtil {

	/**
	 * property와 value로 이루어진 맵을 CSS rule 중 declation block 으로 리턴
	 * 
	 * @param map
	 * @return
	 */
	public static String convertMap2CssDeclarations(Map<String,Object> map) {
		if (map!=null && !map.isEmpty()){
            StringBuilder css = new StringBuilder();

            for (Map.Entry<String, Object> entry : map.entrySet()) {
                css.append(entry.getKey()).append(":").append(entry.getValue()).append(";");
            }

			return css.toString();
		}
		return "";
	}

	/**
	 * CSS rule 중 declation block을 읽어서 property와 value로 이루어진 맵에 저장
	 * 
	 * @param css
	 * @return
	 */
	public static Map<String,Object> convertCssDeclarationsToMap(String css) {
		String[] arr = StringUtil.split(css,";");
		Map<String,Object> cssMap = new HashMap<String, Object>();
		String[] c;
		if (arr!=null) {
			for (String var :arr) {
				c=StringUtil.split(var, ":");
				if (c!=null && c.length>1) cssMap.put(c[0].trim(), c[1].trim());
			}
		}
		return cssMap;
	}

}
