package com.namowebiz.mugrun.applications.framework.helper;


import lombok.extern.apachecommons.CommonsLog;
import org.springframework.web.multipart.MultipartRequest;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CommonsLog
public class BaseUtil {
    //private final static String DEFAULT_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    //private final static String DEFAULT_TIME_ZONE = "KST";
    //private final static int DEFAULT_RAW_OFFSET = 32400000;	//9*60*60*1000 milliseconds
    private final static long MILLIS_PER_HOUR = 3600000L;        //60*60*1000

    private final static String defaultDateFormatter = "yyyyMMdd";
    private static Calendar CALENDAR = Calendar.getInstance();

    public static String cutString(String str, int length) {
        return cutString(str, length, "");
    }

    public static String cutString(String str, int length, String suffix) {
        if (str == null) return "";
        if (str.length() < length) return str;
        return str.substring(0, length) + suffix;
    }

    /**
     * @param String
     * @return String
     */
    public static String stringTrim(String str) {
        if (str == null) return "";
        return str.trim();
    }

    /**
     * @param String
     * @return String
     */
    public static String replaceBlank(String str) {
        if (str == null || str.length() == 0) return "&nbsp;";
        return str;
    }

    /**
     * @param String
     * @return String
     */
    public static String intTrim(String str) {
        if (str == null) return "0";
        return str.trim();
    }

    /**
     * @param String
     * @return String
     */
    public static String objTrim(Object str) {
        String rtnVal = "";
        rtnVal = (String) str;
        if (rtnVal == null) return "";
        return rtnVal.trim();
    }

    /**
     * @param String
     * @return String
     */
    public static String stringLTrim(String str) {
        if (str == null) return "";

        while (str.startsWith(" ")) {
            str = str.substring(1, str.length());
        }
        return str;
    }

    /**
     * @param String
     * @return String
     */
    public static String stringRTrim(String str) {
        if (str == null) return "";

        while (str.endsWith(" ")) {
            str = str.substring(0, str.length() - 1);
        }
        return str;
    }

    /**
     * @param str
     * @param padChar padded character
     * @param padLen  padded length
     * @return String padded String
     */
    public static String stringLPad(String str, char padChar, int padLen) {
        while (str.length() < padLen) {
            str = padChar + str;
        }

        return str;
    }

    /**
     * @param str
     * @param padChar padded character
     * @param padLen  padded length
     * @return String padded String
     */
    public static String stringRPad(String str, char padChar, int padLen) {
        StringBuilder stringBuilder = new StringBuilder(str);
        while (str.length() < padLen) {
            stringBuilder.append(padChar);
        }
        return stringBuilder.toString();
    }

    /**
     */
    public static String padNumber(int size, long num) {
        StringBuilder s = new StringBuilder();
        for (int j = size - 1; j >= 0; j--) {
            long l1 = (long) Math.pow(10D, j);
            long l2 = num / l1;
            s.append(l2);
            num -= l2 * l1;
        }
        return s.toString();
    }

    /**
     * @return String    ex) yyyyMMdd, yyyy-MM-dd HH:mm:ss
     */
    public static String getFormatter() {
        return defaultDateFormatter;
    }

    /**
     * @return String
     */
    public static String getTimeZoneID() {
        //String str = BasePropManager.getBaseProperties("Environment").getString("ebiz21.date.timezone");
        //return (str == null) ? (TimeZone.getDefault()).getID() : str   ).toUpperCase();
        return (TimeZone.getDefault()).getID();
    }

    /**
     * @return String
     */
    public static int getRawOffSet() {
        //int val = BasePropManager.getBaseProperties("Environment").getInt("ebiz21.date.rawoffset");
        //return (val == -1) ? ( TimeZone.getDefault() ).getRawOffSet() : val;
        return (TimeZone.getDefault()).getRawOffset();
    }

    /**
     * @return SimpleTimeZone
     */
    public static TimeZone getTimeZone() {
        return TimeZone.getDefault();
    }

    public static String getTime(long time) {
        SimpleDateFormat fmt = new SimpleDateFormat(getFormatter());
        fmt.setTimeZone(getTimeZone());

        return fmt.format(new java.util.Date(time));
    }

    /**
     * @return String
     */
    public static String getCurrentTime() {
        return getCurrentTime(getFormatter());
    }

    /**
     * @return String
     */
    public static String getCurrentTime(String formatter) {
        SimpleDateFormat fmt = new SimpleDateFormat(formatter);
        fmt.setTimeZone(getTimeZone());

        return fmt.format(new java.util.Date(System.currentTimeMillis()));
    }

    /**
     * @return java.util.Date
     */
    public static java.util.Date getCurrentDate() {
        return new java.util.Date(System.currentTimeMillis());
    }

    /**
     * @param dt ex) 15:00:00
     * @return java.util.Date
     */
    public static java.util.Date getCurrentDate(String dt) {
        if (dt.length() != 8) return null;

        Calendar cal = Calendar.getInstance();
        cal.set(
                cal.get(Calendar.YEAR),
                cal.get(Calendar.MONTH),
                cal.get(Calendar.DATE),
                Integer.valueOf(dt.substring(0, 2)).intValue(),
                Integer.valueOf(dt.substring(3, 5)).intValue(),
                Integer.valueOf(dt.substring(6, 8)).intValue()
        );

        return cal.getTime();
    }

    /**
     * @param dt yyyyMMddHHmmss ex) 19000518120000
     * @return java.util.Date
     */
    private static java.util.Date getUtilDate(String dt) {
        Calendar cal = Calendar.getInstance();
        cal.set(
                Integer.valueOf(dt.substring(0, 4)).intValue(),
                Integer.valueOf(dt.substring(4, 6)).intValue() - 1,
                Integer.valueOf(dt.substring(6, 8)).intValue(),
                Integer.valueOf(dt.substring(8, 10)).intValue(),
                Integer.valueOf(dt.substring(10, 12)).intValue(),
                Integer.valueOf(dt.substring(12, 14)).intValue()
        );

        return cal.getTime();
    }

    /**
     * @ return java.util.Date
     */
    public static java.util.Date addDate(String dt, int day) {
        if (dt == null)
            throw new IllegalArgumentException("dt can not be null");

        int len = dt.length();
        if (!(len == 8 || len == 14))
            throw new IllegalArgumentException("dt length must be 8 or 14 (yyyyMMdd or yyyyMMddHHmmss)");

        if (len == 8) dt += "000000";

        return addDate(getUtilDate(dt), day);
    }

    /**
     * @ param dt
     * @ return java.util.Date
     */
    public static java.util.Date addDate(java.util.Date dt, int day) {
        return new java.util.Date(dt.getTime() + (MILLIS_PER_HOUR * 24 * day));
    }

    /**
     * @return int
     */
    public static int betweenDate(String from, String to) {
        if (from == null)
            throw new IllegalArgumentException("from can not be null");
        if (to == null)
            throw new IllegalArgumentException("to can not be null");

        int len = from.length();
        if (!(len == 8 || len == 14))
            throw new IllegalArgumentException("from length must be 8 or 14 (yyyyMMdd or yyyyMMddHHmmss)");

        if (len == 8) from += "000000";

        len = to.length();
        if (!(len == 8 || len == 14))
            throw new IllegalArgumentException("to length must be 8 or 14 (yyyyMMdd or yyyyMMddHHmmss)");

        if (len == 8) to += "000000";

        return betweenDate(getUtilDate(to), getUtilDate(from));
    }

    /**
     * @param from
     * @param to
     * @return int
     */
    public static int betweenDate(java.util.Date from, java.util.Date to) {
        return (int) ((to.getTime() - from.getTime()) / (MILLIS_PER_HOUR * 24));
    }

    /**
     * @param dt        (yyyyMMdd or yyyyMMddHHmmss)
     * @param formatter (yyyyMMdd.....)
     * @return String
     */
    public static String convertDateFormat(String dt, String formatter) {
        if (dt == null)
            throw new IllegalArgumentException("dt can not be null");

        int len = dt.length();
        if (!(len == 8 || len == 14))
            throw new IllegalArgumentException("dt length must be 8 or 14 (yyyyMMdd or yyyyMMddHHmmss)");

        if (dt.length() == 8) dt += "000000";

        SimpleDateFormat sdf = new SimpleDateFormat(formatter);
        return sdf.format(getUtilDate(dt));
    }

    /**
     * @param dt
     * @param formatter (yyyyMMdd.....)
     * @return String
     */
    public static String convertDateFormat(java.sql.Date dt, String formatter) {
        return convertDateFormat((java.util.Date) dt, formatter);
    }

    /**
     * @param dt
     * @param formatter (yyyyMMdd.....)
     * @return String
     */
    public static String convertDateFormat(java.sql.Timestamp dt, String formatter) {
        return convertDateFormat((java.util.Date) dt, formatter);
    }

    /**
     * @param dt
     * @param formatter (yyyyMMdd.....)
     * @return String
     */
    public static String convertDateFormat(java.util.Date dt, String formatter) {
        SimpleDateFormat sdf = new SimpleDateFormat(formatter);
        return sdf.format(dt);
    }

    /**
     * @param dt (yyyyMMdd or yyyyMMddHHmmss)
     * @return java.sql.Date
     */
    public static java.sql.Date toSQLDate(String dt) {
        return (java.sql.Date) toUtilDate(dt);
    }

    /**
     * @param dt (yyyyMMdd or yyyyMMddHHmmss)
     * @return java.util.Date
     */
    public static java.util.Date toUtilDate(String dt) {
        if (dt == null)
            throw new IllegalArgumentException("dt can not be null");

        int len = dt.length();
        if (!(len == 8 || len == 14))
            throw new IllegalArgumentException("dt length must be 8 or 14 (yyyyMMdd or yyyyMMddHHmmss)");

        if (dt.length() == 8) dt += "000000";

        return getUtilDate(dt);
    }

    public static String makeMoneyType(String no) {
        int index = no.indexOf('.');
        if (index == -1) {
            return BaseUtil.makeMoneyType(Long.parseLong(no));
        } else {
            return BaseUtil.makeMoneyType(Long.parseLong(no.substring(0, index))) + no.substring(index, no.length());
        }
    }

    public static String makeMoneyType(int no) {
        return BaseUtil.makeMoneyType((long) no);
    }

    public static String makeMoneyType(long no) {
        return NumberFormat.getInstance().format(no);
    }

    public static String makeMoneyType(double no) {
        return NumberFormat.getInstance().format(no);
    }

    public static String makeMoneyType(float no) {
        return BaseUtil.makeMoneyType((double) no);
    }

    /**
     */
    public static String convertHTML(String src) {
        if (src == null) return "";

        char[] arr = src.toCharArray();
        StringBuilder sb = new StringBuilder();

        for (char anArr : arr) {
            switch (anArr) {
                case '<':
                    sb.append("&lt;");
                    break;
                case '>':
                    sb.append("&gt;");
                    break;
                case '&':
                    sb.append("&amp;");
                    break;
                case '\n':
                    sb.append("<br />");
                    break;
                case '\t':
                    sb.append("&nbsp;&nbsp;&nbsp;");
                    break;
                case '\"':
                    sb.append("&quot;");
                    break;
                default:
                    sb.append(anArr);
                    break;
            }
        }

        return sb.toString();
    }

    public static String convertCharToHtml(String src) {

        src = src.replaceAll("<br />", "\n");
        src = src.replaceAll("&lt;", "<");
        src = src.replaceAll("&gt;", ">");
        src = src.replaceAll("&lt;", "<");
        src = src.replaceAll("&nbsp;&nbsp;&nbsp;", "\t");

        return src;
    }

    public static String convertHTMLtoTag(String src) {
        if (src == null) return "";

        char[] arr = src.toCharArray();
        StringBuilder sb = new StringBuilder();

        for (char anArr : arr) {
            /*
            switch (arr[i]){
				case '\n'	:
					sb.append("<br />");					break;
				case '\t'	:
					sb.append("&nbsp;&nbsp;&nbsp;");		break;
				case '\"':
					sb.append("&quot;");					break;
				default	:
					sb.append(arr[i]);
			}
			*/
            switch (anArr) {
                case '<':
                    sb.append("&lt;");
                    break;
                case '>':
                    sb.append("&gt;");
                    break;
                case '&':
                    sb.append("&amp;");
                    break;
                case '\n':
                    sb.append("<br />");
                    break;
                case '\t':
                    sb.append("&nbsp;&nbsp;&nbsp;");
                    break;
                case '\"':
                    sb.append("&quot;");
                    break;
                default:
                    sb.append(anArr);
                    break;
            }
        }
        return sb.toString();
    }

    public static String convertHTMLConsult(String src) {
        if (src == null) return "";

        char[] arr = src.toCharArray();
        StringBuilder sb = new StringBuilder();

        for (char anArr : arr) {
            switch (anArr) {
                case '\n':
                    sb.append("<br />");
                    break;
                default:
                    sb.append(anArr);
                    break;
            }
        }

        return sb.toString();
    }

    /**
     */
    public static String convertOnlyBR(String src) {

        if (src == null) return "";

        char[] arr = src.toCharArray();
        StringBuilder sb = new StringBuilder();

        for (char anArr : arr) {
            switch (anArr) {
                case '\n':
                    sb.append("<br />");
                    break;
                default:
                    sb.append(anArr);
                    break;
            }
        }

        return sb.toString();
    }

    /**
     */
    public static String convertBR(String src) {
        return convertHTML(src);
    }

    public static String convertToContent(String src) {
        if (src == null) return "";

        char[] arr = src.toCharArray();
        StringBuilder sb = new StringBuilder();

        for (char anArr : arr) {
            /*
			switch (arr[i]){
				case '\n'	:
					sb.append("<br />");					break;
				case '\t'	:
					sb.append("&nbsp;&nbsp;&nbsp;");		break;
				case '\"':
					sb.append("&quot;");					break;
				default	:
					sb.append(arr[i]);
			}
			*/
            switch (anArr) {
                case '<':
                    sb.append("&lt;");
                    break;
                case '>':
                    sb.append("&gt;");
                    break;
                case '&':
                    sb.append("&amp;");
                    break;
                default:
                    sb.append(anArr);
                    break;
            }
        }
        return sb.toString();
    }

    /**
     * @param    str    string separated string
     * @param    strDelim        separating string
     * @return String[]
     */
    public static String[] getTokenArray(String str) {
        return getTokenArray(str, ",");
    }

    public static String[] getTokenArray(String str, String strDelim) {
        if (str == null || str.length() == 0) return null;
        StringTokenizer st = new StringTokenizer(str, strDelim);

        String arrToken[];
        arrToken = new String[st.countTokens()];

        int i = 0;
        while (st.hasMoreTokens()) {
            arrToken[i] = st.nextToken();
            i++;
        }

        return arrToken;
    }

    /**
     * String CurrentDate = BaseUtil.getKST("yyyyMMddHH");<BR>
     */
    public static String getKST(String format) {
        //1hour(ms) = 60s * 60m * 1000ms
        //int millisPerHour = 60 * 60 * 1000;
        SimpleDateFormat fmt = new SimpleDateFormat(format);

        //SimpleTimeZone timeZone = new SimpleTimeZone(9*MILLIS_PER_HOUR,"KST");
        //fmt.setTimeZone(timeZone);
        fmt.setTimeZone(BaseUtil.getTimeZone());

        long time = System.currentTimeMillis();
        String str = fmt.format(new java.util.Date(time));
        //BaseLogManager.trace("[Date="+str);
        return str;
    }

    /**
     */
    public static String getKSTDate() {
        //SimpleTimeZone pdt = new SimpleTimeZone(9 * 60 * 60 * 1000, "KST");

        // Format the current time.
        SimpleDateFormat formatter
                = new SimpleDateFormat("yyyyy-MM-dd");
        Date currentTime_1 = new Date();
        return formatter.format(currentTime_1);
    }


    public static String getKSTDateTime() {
        //SimpleTimeZone pdt = new SimpleTimeZone(9 * 60 * 60 * 1000, "KST");

        // Format the current time.
        SimpleDateFormat formatter
                = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date currentTime_1 = new Date();
        return formatter.format(currentTime_1);
    }//end method

    /**
     * PreparedStatement	pstmt = conn.prepareStatement("Insert into timetable values (?, ? )" );
     * pstmt.setDate( 1, CSaUtil.getDate("1999-10-10");
     *
     * @return java.sql.Date
     */
    public static java.sql.Date getDate(String in_time) {
        return java.sql.Date.valueOf(in_time);
    }

    /**
     * @return String
     */
    public static String getDateWithSpan(String dayString, int day) {
        //int millisPerHour = 60 * 60 * 1000;
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
        //SimpleTimeZone timeZone = new SimpleTimeZone(9*MILLIS_PER_HOUR,"KST");
        //fmt.setTimeZone(timeZone);
        fmt.setTimeZone(BaseUtil.getTimeZone());

        int y = Integer.parseInt(dayString.substring(0, 4));
        int m = Integer.parseInt(dayString.substring(4, 6));
        int d = Integer.parseInt(dayString.substring(6, 8));

        Calendar aCalendar = Calendar.getInstance();
        aCalendar.set(y, m + day, d + day);

        int year = aCalendar.get(Calendar.YEAR);
        int month = aCalendar.get(Calendar.MONTH) + 1;
        int date = aCalendar.get(Calendar.DATE);

        return fmt.format(Integer.toString(year) +
                ((month < 10) ? "0" + Integer.toString(month) : Integer.toString(month)) +
                ((date < 10) ? "0" + Integer.toString(date) : Integer.toString(date))
        );
    }

    /**
     * @param    dayString    string date (19991002)
     * @return String
     */
    public String getPrevDate(String dayString) {
        int y = Integer.parseInt(dayString.substring(0, 4));
        int m = Integer.parseInt(dayString.substring(4, 6));
        int d = Integer.parseInt(dayString.substring(6, 8));

        Calendar aCalendar = Calendar.getInstance();
        aCalendar.set(y, m - 1, d - 1);

        int year = aCalendar.get(Calendar.YEAR);
        int month = aCalendar.get(Calendar.MONTH) + 1;
        int date = aCalendar.get(Calendar.DATE);

        return Integer.toString(year) +
                ((month < 10) ? "0" + Integer.toString(month) : Integer.toString(month)) +
                ((date < 10) ? "0" + Integer.toString(date) : Integer.toString(date));
    }

    /**
     * int cnt = BaseUtil.stoi("10");	<BR>
     */
    public static int stoi(String str) {
        if (str == null) return 0;
        return Integer.valueOf(str).intValue();
    }

    /**
     */
    public static String itos(int i) {
        return Integer.toString(i);
    }


    /**
     */
    public static String numFormat(int valNum) throws Exception {

        String returnval = "";

        DecimalFormat df = new DecimalFormat("#,###");
        returnval = df.format(valNum);

        return returnval;
    }

    public static String percentFormat(double valNum) throws Exception {

        String returnval = "";

        DecimalFormat df = new DecimalFormat("##.##");
        returnval = df.format(valNum);

        return returnval;
    }


    /**
     */
    public static String toDB(String str) {
        String tmpStr = "";
        try {
            return Ksc2Uni(str);
        } catch (UnsupportedEncodingException e) {
            log.error(e.getMessage(), e);
        }

        return tmpStr;


    }


    /**
     */
    public static String fromDB(String str) {
        String tmpStr = "";
        try {
            tmpStr = Uni2Ksc(str);
        } catch (UnsupportedEncodingException e) {
            log.error(e.getMessage(), e);
        }

        return tmpStr;
    }

    /**
     * @param    KscStr
     * @return String
     */
    public static String Ksc2Uni(String KscStr)
            throws java.io.UnsupportedEncodingException {
        if (KscStr == null) {
            return null;
        } else {
            return new String(KscStr.getBytes("KSC5601"), "8859_1");
        }
    }


    /**
     * @param    UnicodeStr
     * @return String
     */
    public static String Uni2Ksc(String UnicodeStr)
            throws UnsupportedEncodingException {
        if (UnicodeStr == null) {
            return null;
        } else {
            return new String(UnicodeStr.getBytes("8859_1"), "KSC5601");
        }
    }

    /**
     * @param queryString queryString.
     */
    public static String parseQueryString(String queryString, String indexParam) {
        int start;
        int howLong;

        queryString += "&";
        indexParam += "=";
        start = queryString.indexOf(indexParam, 0);
        if (start == -1) return "";
        start += indexParam.length();
        howLong = queryString.indexOf('&', start);
        if (howLong < (start + 1)) return "";

        String temp = queryString.substring(start, howLong);
        int idx = temp.indexOf("%20");
        while (idx != -1) {
            temp = temp.substring(0, idx) + " " + temp.substring(idx + 3, temp.length());
            idx = temp.indexOf("%20");
        }
        return temp;

    }


    /**
     * convertString(kk, "ddd", "ki")
     *
     * @param String targetStr
     * @param String targetStr
     * @param String targetStr
     * @return String
     */
    public static String convertString(String targetStr, String fromStr, String toStr) {
        int targetStrLen = targetStr.length();
        int fromStrLen = fromStr.length();
        StringBuilder rstStr = new StringBuilder();

        if (targetStrLen < 1) return targetStr;

        int i = 0;
        while (true) {
            if (i + fromStrLen > targetStrLen) {
                rstStr.append(targetStr.substring(i, targetStrLen));
                break;
            }

            if (fromStr.equals(targetStr.substring(i, i + fromStrLen))) {
                rstStr.append(toStr);
                i += fromStrLen;
            } else {
                rstStr.append(targetStr.substring(i, i + 1));
                i++;
            }
        }

        return rstStr.toString();

    }


    public static int realLength(String str) {
        int cnt = 0, index = 0;
        if (str == null) return cnt;
        int len = str.length();
        while (index < len) {
            if (str.charAt(index++) < 256)
                cnt++;
            else
                cnt += 2;
        }

        return cnt;
    }

    /**
     */
    public static void makeDir(String dir) {
        File f = new File(dir);
        if (!f.exists()) {
            f.mkdirs();
        }
    }



    /**
     * @param request
     * @param parameter
     */
    public static int getIntParameter(HttpServletRequest request, String parameter) {
        return getIntParameter(request, parameter, 0);
    }

    public static int getIntParameter(Map<String, Object> param, String parameter) {
        return getIntParameter(param, parameter, 0);
    }

    /**
     * @param request
     * @param parameter
     * @param defaultValue
     */
    public static int getIntParameter(HttpServletRequest request, String parameter, int defaultValue) {
        int value = defaultValue;
        if (request.getParameter(parameter) != null) {
            try {
                value = Integer.parseInt(request.getParameter(parameter));
            } catch (NumberFormatException ex) {
            }
        }
        return value;
    }

    public static int getIntParameter(Map<String, Object> param, String parameter, int defaultValue) {
        int value = defaultValue;
        if (param.get(parameter) != null) {
            try {
                value = Integer.parseInt((String) param.get(parameter));
            } catch (NumberFormatException ex) {
            }
        }
        return value;
    }

    public static int getIntParameter(MultipartRequest request, String parameter) {
        return getIntParameter(request, parameter, 0);
    }

    public static int getIntParameter(MultipartRequest request, String parameter, int defaultValue) {
        int value = defaultValue;
        if (((ServletRequest) request).getParameter(parameter) != null) {
            try {
                value = Integer.parseInt(((ServletRequest) request).getParameter(parameter));
            } catch (NumberFormatException ex) {
            }
        }

        return value;
    }

    public static String getStringParameter(HttpServletRequest request, String parameter) {
        String value = "";
        if (request.getParameter(parameter) != null) {
            value = convertHTML(request.getParameter(parameter));
        }
        return value;
    }

    public static String getStringParameter(MultipartRequest request, String parameter) {
        return convertHTML(stringTrim(((ServletRequest) request).getParameter(parameter)));
    }

    public static String getStringParameter(HttpServletRequest request, String parameter, String nullValue) {
        String value = nullValue;
        if (request.getParameter(parameter) != null) {
            value = convertHTML(request.getParameter(parameter));
        }
        return value;
    }

    public static String getStringParameter(MultipartRequest request, String parameter, String nullValue) {
        String value = nullValue;
        if (((ServletRequest) request).getParameter(parameter) != null) {
            value = convertHTML(((ServletRequest) request).getParameter(parameter));
        }
        return value;
    }

    public static String getStringParameters(HttpServletRequest request, String parameter, String sep) {
        String[] values = request.getParameterValues(parameter);
        if (values == null) return "";
        StringBuilder value = new StringBuilder();
        for (String s : values) {
            value.append(s).append(sep);
        }
        return value.toString();
    }

    public static int getStringParametersCnt(HttpServletRequest request, String parameter) {
        String[] values = request.getParameterValues(parameter);
        return values == null ? 0 : values.length;
    }

    /**
     * @param request
     * @param parameter
     */
    public static String getCheckboxParameter(HttpServletRequest request, String parameter) {
        return "on".equals(request.getParameter(parameter)) ? "Y" : "N";
    }

    public static String getCheckboxParameter(MultipartRequest request, String parameter) {
        return "on".equals(((ServletRequest) request).getParameter(parameter)) ? "Y" : "N";
    }

    public static String getExtImg(String filename) {
        if (filename == null || "".equals(filename) || filename.indexOf('.') == -1) {
            return "<img src=\"/admin/images/icons/icon_file.gif\" alt=\"file\" />";
        }
        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();

        if ("html".equals(ext)) {
            ext = "htm";
        }
        if ("pdf".equalsIgnoreCase(ext)) {
            return "<img src=\"/admin/images/icons/icon_pdf.gif\" alt=\"PDF\" />";
        } else if ("doc".equalsIgnoreCase(ext)) {
            return "<img src=\"/admin/images/icons/icon_doc.gif\" alt=\"DOC\" />";
        } else if ("gif".equalsIgnoreCase(ext)) {
            return "<img src=\"/admin/images/icons/icon_gif.gif\" alt=\"GIF\" />";
        } else if ("hwp".equalsIgnoreCase(ext)) {
            return "<img src=\"/admin/images/icons/icon_hwp.gif\" alt=\"HWP\" />";
        } else if ("jpg".equalsIgnoreCase(ext)) {
            return "<img src=\"/admin/images/icons/icon_jpg.gif\" alt=\"JPG\" />";
        } else if ("ppt".equalsIgnoreCase(ext)) {
            return "<img src=\"/admin/images/icons/icon_ppt.gif\" alt=\"PPT\" />";
        } else if ("xls".equalsIgnoreCase(ext)) {
            return "<img src=\"/admin/images/icons/icon_xls.gif\" alt=\"XLS\" />";
        } else if ("zip".equalsIgnoreCase(ext)) {
            return "<img src=\"/admin/images/icons/icon_zip.gif\" alt=\"ZIP\" />";
        }

        return "<img src=\"/admin/images/icons/icon_file.gif\" alt=\"file\" />";
    }

    /**
     * @see        #htmlSpecialChars
     */
    public static String stripTags(String s) {
        StringBuilder buffer = new StringBuilder();
        StringTokenizer st = new StringTokenizer(s, "<>", true);
        String token;
        boolean inTag = false;
        while (st.hasMoreTokens()) {
            token = st.nextToken();
            switch (token.charAt(0)) {
                case '<':
                    inTag = true;
                    break;
                case '>':
                    inTag = false;
                    break;
                default:
                    if (!inTag) buffer.append(token);
                    break;
            }
        }
        return buffer.toString();
    }

    /**
     * yyyyMMdd -> yyyy.MM.dd
     * yyyy-MM-dd -> yyyy.MM.dd
     *
     * @param date
     * @return
     */
    public static String toDotFormatDate(String date) {
        if (date != null && date.length() == 8) {
            return date.substring(0, 4) + '.' + date.substring(4, 6) + '.' + date.substring(6, 8);
        } else if (date != null && date.length() == 10) {
            return date.replace('-', '.');
        } else {
            return date;
        }
    }

//    public static String base64Encode(String plainText) {
//        byte[] buf = plainText.getBytes();
//        String encodedText = null;
//        try {
//            // Convert a byte array to base64 string
//            encodedText = new sun.misc.BASE64Encoder().encode(buf);
//        } catch (Exception e) {
//            log.error(e.getMessage(), e);
//        }
//        return encodedText;
//    }

//    public static String base64Decode(String encodedText) {
//        byte[] buf = null;
//        String plainText = null;
//        try {
//            // Convert base64 string to a byte array
//            buf = new sun.misc.BASE64Decoder().decodeBuffer(encodedText);
//            plainText = new String(buf);
//        } catch (IOException e) {
//            log.error(e.getMessage(), e);
//        }
//        return plainText;
//    }

    public static String getRandomString(int len) {
        Random random = new Random();
        char alphaNum[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'};
        StringBuilder str = new StringBuilder();
        for (int j = 0; j < len; j++) {
            str.append(alphaNum[random.nextInt(10)]);
        }
        return str.toString();
    }

    public static long getPreviousMonth(long date) {
        return incrementMonth(date, -1);
    }

    public static long getNextMonth(long date) {
        return incrementMonth(date, 1);
    }

    private static long incrementMonth(long date, int increment) {
        Calendar calendar = CALENDAR;
        synchronized (calendar) {
            calendar.setTimeInMillis(date);
            calendar.add(Calendar.MONTH, increment);
            return calendar.getTimeInMillis();
        }
    }

    public static long getStartOfMonth(long date) {
        return getMonth(date, -1);
    }

    public static long getEndOfMonth(long date) {
        return getMonth(date, 1);
    }

    private static long getMonth(long date, int increment) {
        long result;
        Calendar calendar = CALENDAR;
        synchronized (calendar) {
            calendar.setTimeInMillis(date);
            if (increment == -1) {
                calendar.set(Calendar.DAY_OF_MONTH, 1);
                result = startOfDayInMillis(calendar.getTimeInMillis());
            } else {
                calendar.add(Calendar.MONTH, 1);
                calendar.set(Calendar.DAY_OF_MONTH, 1);
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                calendar.set(Calendar.MILLISECOND, 0);
                calendar.set(Calendar.SECOND, 0);
                calendar.set(Calendar.MINUTE, 0);
                calendar.add(Calendar.MILLISECOND, -1);
                result = calendar.getTimeInMillis();
            }
        }
        return result;
    }

    public static long startOfDayInMillis(long date) {
        Calendar calendar = CALENDAR;
        synchronized (calendar) {
            calendar.setTimeInMillis(date);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MINUTE, 0);
            return calendar.getTimeInMillis();
        }
    }

    public static String getAllParams(HttpServletRequest request, String exclusiveParam, String ampChar) throws UnsupportedEncodingException {
        Enumeration paramNames = request.getParameterNames();
        StringBuilder param = new StringBuilder();
        while (paramNames.hasMoreElements()) {
            String k = (String) paramNames.nextElement();
            String v = URLEncoder.encode(request.getParameter(k), "UTF-8");
            if (!k.equals(exclusiveParam) && !"resultCode".equals(k)) {
                param.append(ampChar).append(k).append("=").append(v);
            }
        }
        return param.toString();
    }

    public static String getAllParams(HttpServletRequest request, String exclusiveParam) throws UnsupportedEncodingException {
        return getAllParams(request, exclusiveParam, "&amp;");
    }

    public static String getAllParams(HttpServletRequest request) throws UnsupportedEncodingException {
        return getAllParams(request, null);
    }

    /**
     * @param filename
     * @return
     */
    public static boolean checkImageFile(String filename) {
        int dot = filename.lastIndexOf('.');
        if (dot == -1) {
            return false;
        }
        String ext = filename.substring(dot + 1).toLowerCase();
        return "jpg".equals(ext) || "gif".equals(ext) || "png".equals(ext);
    }

    /**
     * @param filename
     * @return
     */
    public static boolean checkFile(String filename) {
        int dot = filename.lastIndexOf('.');
        if (dot == -1) {
            return false;
        }
        String ext = filename.substring(dot + 1).toLowerCase();
        return !("jsp".equals(ext) || "exe".equals(ext) || "php".equals(ext) || "asp".equals(ext) || "js".equals(ext) || "hr".equals(ext));
    }

    /**
     */
    public static String getToday() {
        Date date = new Date();
        SimpleDateFormat simpledateformat = new SimpleDateFormat("yyyy-MM-dd");
        return simpledateformat.format(date);
    }

    public static String getYesterday() {
        Date date = new Date(System.currentTimeMillis() - (60 * 60 * 24 * 1000));
        SimpleDateFormat simpledateformat = new SimpleDateFormat("yyyy-MM-dd");
        return simpledateformat.format(date);
    }

    public static String getWeekAgo() {
        Date date = new Date(System.currentTimeMillis() - (60 * 60 * 24 * 1000 * 7));
        SimpleDateFormat simpledateformat = new SimpleDateFormat("yyyy-MM-dd");
        return simpledateformat.format(date);
    }

    public static String getURL(HttpServletRequest req, String scheme) {
        if (scheme == null) scheme = "http";
        String url = scheme + "://" + req.getServerName() + req.getRequestURI();
        if (req.getQueryString() != null) {
            url += "?" + req.getQueryString();
        }
        return url;
    }

    public static boolean isNumeric(String param) {
        String regex = "^[0-9]+$";
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(param);
        return m.matches();
    }

    public static boolean isTelNumber(String param) {
        String regex = "\\d{2,4}-\\d{3,4}-\\d{4}";
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(param);
        return m.matches();
    }

    public static boolean validLoginId(String param) {
        String regex = "^[a-zA-Z][a-zA-Z0-9]+$";
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(param);
        return m.matches();
    }

    public static boolean validYearType(String param) {
        String regex = "[0-9]{4}$";
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(param);
        return m.matches();
    }

    /**
     * string 형태 날짜 확인
     *
     * @param date yyyy.MM.dd
     * @return
     */
    public static boolean checkDateFormat(String date) {
        if (date != null) {
            String regex = "[0-9]{4}[.][0-9]{2}[.][0-9]{2}";
            Pattern p = Pattern.compile(regex);

            Matcher m = p.matcher(date);
            return m.matches();
        } else {
            return false;
        }
    }

    /**
     * E-Mail 형식 체크
     *
     * @param email
     * @return
     */
    public static boolean checkEmail(String email) {
        String regex = "^[_a-zA-Z0-9-\\.]+@[\\.a-zA-Z0-9-]+\\.[a-zA-Z]+$";
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(email);
        return m.matches();
    }

    public static String convertParam(String param) {
        if (param != null && "".equals(param)) {
            param = param.replaceAll("<", "&gt;");
            param = param.replaceAll(">", "&lt;");
        }
        log.info("after param :: " + param);
        return param;
    }
}
