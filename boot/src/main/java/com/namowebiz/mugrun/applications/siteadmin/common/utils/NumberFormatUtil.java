package com.namowebiz.mugrun.applications.siteadmin.common.utils;

import java.text.DecimalFormat;
import java.text.NumberFormat;

/**
 * Created by Bryant on 10/5/2017.
 */
public class NumberFormatUtil {
    public static final String DEFAULT_CURRENCY = "VNĐ";
    public static final String DEFAULT_DECIMAL_PATTERN = "###,###";
    private static DecimalFormat decimalFormat;

    public static DecimalFormat getDecimalFormat(){
        if(decimalFormat == null){
            decimalFormat = (DecimalFormat) NumberFormat.getNumberInstance();
        }
        return decimalFormat;
    }

    public static String formatDecimal(double d, String pattern){
        getDecimalFormat().applyPattern(pattern);
        String format = getDecimalFormat().format(d);
        return format;
    }

    public static String formatNumber(long d){
        return formatDecimal(d, DEFAULT_DECIMAL_PATTERN);
    }

    public static String formatNumber(double d){
        return formatDecimal(d, DEFAULT_DECIMAL_PATTERN);
    }

    public static String formatCurrency(long d){
        return toCurrency(formatDecimal(d, DEFAULT_DECIMAL_PATTERN));
    }

    public static String formatCurrency(double d) {
        return toCurrency(formatDecimal(d, DEFAULT_DECIMAL_PATTERN));
    }

    private static String toCurrency(String format){
        return format + ' ' + DEFAULT_CURRENCY;
    }


//    public static int round(double value){
////        return (int)(Math.round( value / 1000) * 1000);
//        return (int)(Math.round( value ));
//    }

    public static long round(double value){
//        return (int)(Math.round( value / 1000) * 1000);
        return (long)(Math.round( value ));
    }

}
