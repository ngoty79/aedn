package com.namowebiz.mugrun.applications.framework.common.utils;

import jodd.util.StringUtil;
import lombok.extern.apachecommons.CommonsLog;
import org.codehaus.jackson.map.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by ngo.ty on 6/6/2016.
 */
@CommonsLog
public class JsonUtil {

    private static ObjectMapper mapper = null;
    public static ObjectMapper getObjectMapper() {
        if (mapper == null) {
            mapper = new ObjectMapper();
        }
        return mapper;
    }

    public static Map<String,Object> parseJSON(String json) {
        if (!StringUtil.isEmpty(json)) {
            try{
                return getObjectMapper().readValue(json, HashMap.class);
            }catch(Exception e) {
                log.error("Can't convert to string Map object " + e.getMessage());
            }
        }
        return null;
    }


    public static String convertToJSON(Object o){
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
            return parseJSON(json);
        } else {
            return null;
        }
    }

    public static <T> T parseJSON(String json, Class<T> clazz) {
        if (jodd.util.StringUtil.isNotBlank(json)) {
            try {
                return getObjectMapper().readValue(json, clazz);
            } catch (Exception e) {
                log.error("Can't convert to string object " + e.getMessage());
            }
        }
        return null;
    }
}
