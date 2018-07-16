package com.namowebiz.mugrun.applications.framework.services.component.util;

import com.namowebiz.mugrun.applications.framework.helper.StringUtil;
import lombok.extern.apachecommons.CommonsLog;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.map.ObjectMapper;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//import com.namowebiz.mugrun.applications.framework.render.common.message.Message;
@CommonsLog
public class WidgetConfigUtil {

    private static Map<String, List<String>> configConvertorNameCache = new HashMap<String, List<String>>();

    /**
     *	componentConfig ? configContent ? JSON ???? ??? ??? ??? ???? ???
     */
    private static final String[] excludeFieldNameList = {
            "siteId",
            "sitePageWidgetId",
            "widgetId",
            "widgetType",
            "pageContainer",
            "divId",
            "configContent",

            "regUserNo",
            "regDate",
            "modUserNo",
            "modDate",

            "regUserId",
            "regUserNickname",
            "modUserId",
            "modUserNickname"
    };

    /**
     * JSON ???? ???? ??? ???? Map ?? ??
     * @param config
     * @return
     */
    public static Map<String,Object> convertToMap(Object config) {
        if (config!=null) {
            @SuppressWarnings("rawtypes")
            Class c = config.getClass();

            if (configConvertorNameCache.get(config.getClass().getName())==null) {
                List<String> fieldList = new ArrayList<String>();
                Field[] fields = c.getDeclaredFields();
                if (fields!=null) {
                    for (int i=0;i<fields.length;i++) {
                        String name = fields[i].getName();
                        if (!inExcludeFieldList(name)) {
                            fieldList.add(name);
                        }
                    }
                    configConvertorNameCache.put(c.getName(), fieldList);
                }
            }

            List<String> fieldList = configConvertorNameCache.get(c.getName());
            if (fieldList!=null && !fieldList.isEmpty()) {
                Map<String,Object> map = new HashMap<String, Object>();
                for(String fieldName : fieldList) {
                    map.put(fieldName, getValueFromObject(config,fieldName));
                }
                return map;
            }

        }
        return null;
    }

    private static boolean inExcludeFieldList(String name) {
        for (int i=0;i<excludeFieldNameList.length;i++) {
            if (excludeFieldNameList[i].equals(name)) return true;
        }
        return false;
    }

    private static Object getValueFromObject(Object o, String fieldName) {
        @SuppressWarnings("rawtypes")
        Class c = o.getClass();
        StringBuilder methodName = new StringBuilder();

        try {
            // ?? ??? getter ???? ??
            methodName.append("get");
            StringBuilder input = new StringBuilder(fieldName);
            methodName.append(Character.toUpperCase(input.charAt(0)));
            input.deleteCharAt(0);
            methodName.append(input);

            @SuppressWarnings("unchecked")
            Method m = c.getMethod(methodName.toString());
            Object value = m.invoke(o);

            return value;

        } catch (Exception e) {

            log.error(e.getMessage(),e);
            log.error("ERROR : " + c.getName() + " does not have getter for fieldname '"+fieldName+"' - getter " + methodName);
        }

        return null;

    }

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
                getObjectMapper().configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
                return getObjectMapper().readValue(json, HashMap.class);
            }catch(Exception e) {
                log.debug("ERROR while processing json str : " + json);
            }
        }
        return null;
    }

    public static Object parseJson(String json,Class<?> valueType) {
        try {
            return getObjectMapper().readValue(json, valueType);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
            return null;
        }
    }

    public  static <T> T parseJsonType(String json, Class<T> valueType) {
        try {
            getObjectMapper().configure(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
            return getObjectMapper().readValue(json, valueType);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
            return null;
        }
    }

    public  static <T> T map2Object(Map<String, Object> map, Class<T> valueType) {
        try {
            return getObjectMapper().convertValue(map, valueType);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
            return null;
        }
    }

    public static boolean isValidConfig(String content) {
        Object o = parseJson(content);
        return o != null;
    }

    public static String toString(Object o) {
        try{
            return getObjectMapper().writeValueAsString(o);
        }catch(Exception e){
            return null;
        }
    }

    public static String convertToJSON(Object o){
        return toString(o);
    }


    public static String escape(String str) {
        return StringUtil.replace(StringUtil.replace(str, "\"", "\\\""),"\n","\\n");
    }

    private static String[] cssAttrArr = {"width","height","left","top"};
    public static String extractJsonCSS(String str) {
        if (str!=null) {
            if (!str.endsWith(";")) str += ";";
            StringBuilder json = new StringBuilder("{");
            String attr=null,value=null;
            for(int i=0;i<cssAttrArr.length;i++){
                attr  = cssAttrArr[i];
                value = ""; //ComponentUtil.getCssAttr(str, attr);
                if (!StringUtil.isEmpty(value)) {
                    if (json.length()>1) json.append(",");
                    json.append("\"").append(attr).append("\":\"").append(value).append("\"");
                }
            }
            json.append("}");
            return json.toString();
        }
        return "{}";

    }
    public static String convertMap2Css(Map<String,Object> map) {
        if (map!=null && !map.isEmpty()){
            StringBuilder css = new StringBuilder();

            for (Map.Entry<String, Object> entry : map.entrySet()) {
                css.append(entry.getKey()).append(":").append(entry.getValue()).append(";");
            }

            return css.toString();
        }
        return "";
    }

    public static Map<String,String> convertCssToMap(String css) {
        String[] arr = StringUtil.split(css,";");
        Map<String,String> cssMap = new HashMap<String, String>();
        String[] c;
        if (arr!=null) {
            for (String var :arr) {
                c=StringUtil.split(var, ":");
                if (c!=null && c.length>1) cssMap.put(c[0], c[1]);
            }
        }
        return cssMap;
    }






    public static String[] getMyPageModuleDefaultConfig(String sitePageId){
        String configList = "";

        String config="";
        return new String[]{configList, config};

    }




}

