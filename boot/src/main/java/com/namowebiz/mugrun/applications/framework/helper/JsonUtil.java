package com.namowebiz.mugrun.applications.framework.helper;

//import com.namowebiz.mugrun.framework.services.foundation.PineTree;

import lombok.extern.apachecommons.CommonsLog;
import org.codehaus.jackson.map.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CommonsLog
public class JsonUtil {

	private static ObjectMapper mapper = null;
	public static ObjectMapper getObjectMapper() {
		if (mapper==null) {
			mapper = new ObjectMapper();
		}
		return mapper;
	}
	
	@SuppressWarnings("unchecked")
	public static Map<String,Object> parseJson(String json) {
		if (!StringUtil.isEmpty(json)) {
			try{
				return getObjectMapper().readValue(json, HashMap.class);
			}catch(Exception e) {
				log.debug("ERROR while processing json str : " + json);
				log.error(e.getMessage(),e);
			}
		}
		return null;
	}


	public static String convertToJson(Object o){
		return toString(o);
	}
	
	public static String toString(Object o) {
		try{
			return getObjectMapper().writeValueAsString(o);
		}catch(Exception e){
			return null;
		}
	}

	public static Map<String,Object> obj2Map(Object o) {
		String json = toString(o);
		if (json!=null) {
			return parseJson(json);
		} else {
			return null;
		}
	}
	
	@SuppressWarnings("unchecked")
    public static List<Map<String,Object>> parseJsonArray(String json) {
		List<Map<String,Object>> result = null;
		try {
            Map<String, Object> map = (Map<String, Object>) StringUtil.json2Obj("{\"list\":" + json + "}");
            result = (List<Map<String, Object>>) map.get("list");
        }catch(Exception e){
			log.error(e.getMessage(),e);
		}
		return result;
	}

    public static <T> T parseJson(String json, Class<T> clazz) {
        if (jodd.util.StringUtil.isNotBlank(json)) {
            try {
                return getObjectMapper().readValue(json, clazz);
            } catch (Exception e) {
                log.error(e.getMessage(),e);
            }
        }
        return null;
    }
}
