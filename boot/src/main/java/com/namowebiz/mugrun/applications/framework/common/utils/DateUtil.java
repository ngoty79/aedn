package com.namowebiz.mugrun.applications.framework.common.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Created by ngo.ty on 12/16/2015.
 */
public class DateUtil {
    public static final String ISO_DATE_FORMAT = "yyyy-MM-dd";
    public static final String KOREAN_DATE_FORMAT = "yyyy.MM.dd";
    public static final String FORMAT_DAY_IN_WEEK = "EE";
    public static final Locale LOCALE_DEFAULT = Locale.US;
    public static final Locale LOCALE_KOREAN = Locale.KOREAN;

    public static String format(Date dt, String format){
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format, RequestUtil.getCurrentLocale());
        return simpleDateFormat.format(dt);
    }


    public static String formatISO(Date dt){
        SimpleDateFormat df = new SimpleDateFormat(ISO_DATE_FORMAT, RequestUtil.getCurrentLocale());
        return df.format(dt);
    }

    public static Date parse(String dateString, String format) {
        Date date = null;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat(format);
            date = dateFormat.parse(dateString);
        } catch (Exception ignored) {
        }
        return date;
    }

    public static Date getCurrentDate(){
        return new Date();
    }


}
