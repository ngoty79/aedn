package com.namowebiz.mugrun.applications.siteadmin.common.utils;

import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * ConversionUtil
 * @author Vinh
 * @since 1.0
 */
public class ConversionUtil {

    /**
     * Convert a String to a Long[]
     * @param s Given String format: 1,2,3 (The numbers are separated by commas)
     * @return Long[]
     */
    public static Long[] stringToLongArray(String s) {
        Long[] results = null;
        if (s != null && s.length() > 0) {
            String[] arrays = s.split(",");
            results = new Long[arrays.length];
            for (int i = 0; i < arrays.length; i++) {
                results[i] = parseLong(arrays[i]);
            }
        }
        
        return results;
    }

    /**
     * Convert a String to a List<Long>
     * @param s Given String format: 1,2,3 (The numbers are separated by commas)
     * @return List<Long>
     */
    public static List<Long> stringToLongList(String s) {
        List<Long> results = null;
        if (s != null && s.length() > 0) {
            String[] arrays = s.split(",");
            results = new ArrayList<Long>();
            for (int i = 0; i < arrays.length; i++) {
                results.add(parseLong(arrays[i]));
            }
        }
        
        return results;
    }

    /**
     * Convert a String to a List<String>
     * @param s Given String format: 1,2,3 (The numbers are separated by commas)
     * @return List<String>
     */
    public static List<String> stringToStringList(String s) {
        List<String> results = null;
        if (s != null && s.length() > 0) {
            String[] arrays = s.split(",");
            results = new ArrayList<String>();
            for (int i = 0; i < arrays.length; i++) {
                results.add(arrays[i]);
            }
        }
        
        return results;
    }
    
    /**
     * Parse long from a String 
     * @param s
     * @return 0 If the String cannot be parsed. Ignore all exceptions.
     */
    public static Long parseLong(String s) {
        Long result = 0L;
        try {
            if(StringUtils.isNotEmpty(s))
                s = s.trim();
            result = Long.valueOf(s);
        } catch (Exception e) {
            // Ignore the exception
        }
        return result;
    }
    
    public static String arrayToString(Object[] o) {
        StringBuilder sb = new StringBuilder();
        
        for (int i = 0; i < o.length; i++) {
            if (i > 0) {
                sb.append(", ");
            }
            sb.append(o[i]);
        }
        
        return sb.toString();
    }
}
