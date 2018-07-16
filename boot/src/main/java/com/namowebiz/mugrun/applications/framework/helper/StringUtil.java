package com.namowebiz.mugrun.applications.framework.helper;

import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.StringUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;



/**
 * 문자열 관련 UTIL함수들의 모음. 모든 메소드는 static함수로 구현되어 있다.
 */
@CommonsLog
public class StringUtil {

    /**
     * 배열에 배열 붙이기
     *
     * @param src
     * @param dest
     * @return
     */
    public static Object[] addArray(Object[] src, Object[] dest) {
        List<Object> list = new ArrayList<Object>();
        for (int i = 0; i < dest.length; i++) {
            if (dest[i] != null) list.add(dest[i]);
        }
        for (int i = 0; i < src.length; i++) {
            if (src[i] != null) list.add(src[i]);
        }

        return list.toArray(new String[list.size()]);
/*		List<Object> listTemp = Arrays.asList(dest) ;

		for(int i = 0 ; i < src.length ; i++ )
			listTemp.add(src[i]) ;
			
		return listTemp.toArray() ;*/
    }

    /**
     * ',",\ 앞에 \를 추가
     *
     * @param
     */
    public static String addSlashes(String str) {
        if (str != null && !"".equals(str)) {
            str = StringUtil.replace(StringUtil.replace(str, "'", "\'"), "\"", "\\\"");
        }

        return str;
    }

    /**
     * 이메일 주소를 한글로 변환
     *
     * @param email 이메일
     * @return 한글 변환된 이메일
     */
    public static String convertEmailToKor(String email) {
        if (email == null || "".equals(email))
            return "";

        //변환된 이메일
        StringBuilder strEmail = new StringBuilder();
        String[] keys = {
                "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
                "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                "@", "."
        };
        String[] values = {
                "에이", "비", "씨", "디", "이", "에프", "지", "에이치", "아이", "제이", "케이", "엘", "엠",
                "엔", "오", "피", "큐", "알", "에스", "티", "유", "브이", "더블유", "엑스", "와이", "제트",
                "영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구",
                "골뱅이", "점"
        };

        List<String> keyList = Arrays.asList(keys);
        List<String> valueList = Arrays.asList(values);

        email = email.toLowerCase();
        for (int i = 0; i < email.length(); i++) {
            int keyIdx = keyList.indexOf(email.substring(i, i + 1));
            if (keyIdx >= 0)
                strEmail.append((String) valueList.get(keyIdx));
            else
                strEmail.append(email.substring(i, i + 1));
        }

        return strEmail.toString();
    }

    /**
     * 글자수 제한해서 ch 붙이기
     *
     * @param title  스트링
     * @param maxNum 제한 글자수
     * @param ch     후미사
     * @return
     */
    public static String cut(String title, int maxNum, String ch) {
        return StringUtil.getStringLimit(title, maxNum, ch);
    }

    /**
     * 글자수 제한해서 ch 붙이기 (답변글 고려-7글자)
     *
     * @param title  스트링
     * @param maxNum 제한 글자수
     * @param ch     후미사
     * @param reply
     * @return
     */
    public static String cut(String title, int maxNum, String ch, boolean reply) {
        maxNum = reply ? maxNum - 7 : maxNum;

        return StringUtil.getStringLimit(title, maxNum, ch);
    }

    /**
     * 문자열을 Byte단위로 잘라내서 오버된 문자열 값은 버리고 반환한다.<br>
     *
     * @param sStr<br>
     * @param iMaxByte<br>
     * @return<br>
     */
    public static String cutStringByte(String sStr, int iMaxByte) {

        String sResult = null;

        try {

            final int MAX_BYTE = iMaxByte; //자르려는 문자열 byte단위
            StringBuilder sbTemp = new StringBuilder();
            char chTmp;
            int iTotalByte = 0;
            int iByte = 0;

            for (int i = 0; i < sStr.length(); i++) {
                chTmp = sStr.charAt(i);

                //영문 1byte, 한글 2byte
                iByte = (chTmp <= 127) ? 1 : 2;

                if (iTotalByte + iByte > MAX_BYTE) {
                    //일정 byte가 되면 문자열을 ArrayList에 담는다.
                    sResult = sbTemp.toString();
                    iTotalByte = 0;
                    break;
                }

                sbTemp.append(chTmp);
                iTotalByte = iTotalByte + iByte;
            }

            if (iTotalByte > 0) {
                //나머지 문자열을 담는다.
                sResult = sbTemp.toString();
            }

        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return sResult;
    }

    /**
     * 문자열을 Byte단위로 잘라내서 오버된 문자열 값은 버리고 일정한 문자열 값이 넘었을 경우 ... 붙혀 반환한다.<br>
     *
     * @param sStr<br>
     * @param iMaxByte<br>
     * @return<br>
     */
    public static String cutStringByteDot(String sStr, int iMaxByte) {

        String sResult = null;
        boolean bCheck = false;
        try {

            final int MAX_BYTE = iMaxByte; //자르려는 문자열 byte단위
            StringBuilder sbTemp = new StringBuilder();
            char chTmp;
            int iTotalByte = 0;
            int iByte = 0;

            for (int i = 0; i < sStr.length(); i++) {
                chTmp = sStr.charAt(i);

                //영문 1byte, 한글 2byte
                iByte = (chTmp <= 127) ? 1 : 2;

                if (iTotalByte + iByte > MAX_BYTE) {
                    //일정 byte가 되면 문자열을 ArrayList에 담는다.
                    sResult = sbTemp.toString();
                    iTotalByte = 0;
                    bCheck = true;
                    break;
                }

                sbTemp.append(chTmp);
                iTotalByte = iTotalByte + iByte;
            }

            if (iTotalByte > 0) {
                //나머지 문자열을 담는다.
                sResult = sbTemp.toString();
            }
            if (bCheck) {
                sResult += "...";
            }

        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return sResult;
    }

    /**
     * 문자열을 Byte단위로 잘라내서 오버된 문자열 값은 버리고 일정한 문자열 값이 넘었을 경우 ... 붙혀 반환한다.<br>
     * - Velocity 처리용으로 재구성
     *
     * @param str
     * @param iMaxByte
     * @return
     */
    public static String cutStringByteDot(String str, String iMaxByte) {
        return cutStringByteDot(str, parseInt(iMaxByte, 0));
    }

    /**
     * 문자열을 Byte단위로 잘라내서 오버된 문자열 값은 버리고 일정한 문자열 값이 넘었을 경우 ... 붙혀 반환한다.<br>
     * - Velocity 처리용으로 재구성
     *
     * @param str
     * @param iMaxByte
     * @return
     */
    public static String cutStringByteDot(String str, long iMaxByte) {
        return cutStringByteDot(str, (int) iMaxByte);
    }

    /**
     * 문자열을 Byte단위로 잘라내서 ArrayList에 담는다.<br>
     *
     * @param sStr<br>
     * @param iMaxByte<br>
     * @return<br>
     */
    @SuppressWarnings({"rawtypes", "unchecked"})
    public static ArrayList cutStringListByte(String sStr, int iMaxByte) {

        ArrayList list = new ArrayList();

        try {

            final int MAX_BYTE = iMaxByte; //자르려는 문자열 byte단위
            StringBuilder sbTemp = new StringBuilder();
            char chTmp;
            int iTotalByte = 0;
            int iByte = 0;

            for (int i = 0; i < sStr.length(); i++) {
                chTmp = sStr.charAt(i);

                //영문 1byte, 한글 2byte
                iByte = (chTmp <= 127) ? 1 : 2;

                if (iTotalByte + iByte > MAX_BYTE) {
                    //일정 byte가 되면 문자열을 ArrayList에 담는다.
                    list.add(sbTemp.toString());
                    iTotalByte = 0;
                    sbTemp = new StringBuilder();
                }

                sbTemp.append(chTmp);
                iTotalByte = iTotalByte + iByte;
            }

            if (iTotalByte > 0) {
                //나머지 문자열을 담는다.
                list.add(sbTemp.toString());
            }

        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return list;
    }

    /**
     * hex를 decode함 (url decode포함)
     *
     * @param input
     * @return
     * @throws Exception
     */
    public static String deHex(String input) throws Exception {
        StringBuilder returnStr = new StringBuilder("");
        String str = null;

        for (int i = 0; i < input.length(); i = i + 2) {
            str = input.substring(i, i + 2);
            char c = (char) Integer.parseInt(str, 16);
            returnStr.append(c);
        }
        input = URLDecoder.decode(returnStr.toString(), "utf-8");
        return input;
    }

    /**
     * hex를 decode함 (url decode안함)
     *
     * @param input
     * @return
     * @throws Exception
     */
    public static String deHex2(String input) throws Exception {
        StringBuilder returnStr = new StringBuilder("");
        String str = null;

        for (int i = 0; i < input.length(); i = i + 2) {
            str = input.substring(i, i + 2);
            char c = (char) Integer.parseInt(str, 16);
            returnStr.append(c);
        }

        return returnStr.toString();
    }

    /**
     * "을 &quot;로 바꾼다.<br>
     * @return<br>
     */
    public static String DQ2Amp(String sStr) {
        if (sStr != null && sStr.length() != 0) {
            return replace(sStr, "\"", "&quot;");
        } else {
            return sStr;
        }
    }

    /**
     * ''을 '로 바꾼다.<br>
     * @return<br>
     */
    public static String DQ2SQ(String sStr) {
        return replace(sStr, "''", "'");
    }

    /**
     * 8859_1 인코딩을 KSC5601으로 변환한다.<br>
     *
     * @param sStr<br>
     * @return<br>
     */
    public static String EnglishToKorean(String sStr) {
        String sResult = "";

        try {
            if (!isEmpty(sStr)) {
                sResult = new String(sStr.getBytes("8859_1"), "KSC5601");
            }
        } catch (UnsupportedEncodingException ex) {
            log.error(ex.getMessage(), ex);
        }

        return sResult;
    }


    /**
     * 16진수로 변환
     *
     * @param input
     * @return
     * @throws Exception
     */
    public static String enHex(String input) throws Exception {


        input = (input == null) ? "" : input;

        input = URLEncoder.encode(input, "utf-8");

        StringBuilder returnStr = new StringBuilder("");

        for (int i = 0; i < input.length(); i++) {
            int k = input.charAt(i);
            String str = Integer.toHexString(k);
            returnStr.append(str);
        }

        return returnStr.toString();
    }

    /**
     * 16진수로 변환
     *
     * @param input
     * @return
     * @throws Exception
     */
    public static String enHex2(String input) throws Exception {


        input = (input == null) ? "" : input;


        StringBuilder returnStr = new StringBuilder("");

        for (int i = 0; i < input.length(); i++) {
            int k = input.charAt(i);
            String str = Integer.toHexString(k);
            returnStr.append(str);
        }

        return returnStr.toString();
    }

    /**
     * split 의 별칭<br>
     */
    public static String[] explode(String sDelim, String sString) {
        return StringUtil.split(sString, sDelim);
    }

    /**
     * 관리자 입력용 HTML필터 (사용자 디자인 위젯)
     *
     * @param sSource
     * @return DB에 입력될 내용
     */
    public static String filterHtmlForAdmin(String sSource) {
        String sReturn = "";
        if (sSource != null) {
            sReturn = replace(sSource, "◦", "&#176");
            sReturn = replace(sReturn, "&lt;", "<");
            sReturn = replace(sReturn, "&gt;", ">");
            sReturn = replace(sReturn, "<object", "<div><object"); // IE create
            // chile
            // node 에러때문
            sReturn = replace(sReturn, "object>", "object></div>"); // IE create
            // chile
            // node 에러때문
        }
        return StringUtil.trim(sReturn);
    }

    /**
     * 대상 String 에서 특정 String을 찾아서  발견된 index 값, 없을시 returns -1
     *
     * @param str    대상 String
     * @param substr 찾는 String
     */
    public static int find(String str, String substr) {
        if (str == null || "".equals(str)) {
            return -1;
        }
        return str.indexOf(substr);
    }

    /**
     * 문자열을 구분자로 분리하여 원하는 문자가 있으면 true를 넘겨준다.
     *
     * @param sString 문자열<br>
     * @param sDelim  구분자<br>
     * @return String[] 배열<br>
     */
    public static boolean findChecked(String sString, String sDelim, String findStr) {

        if (isEmpty(sString)) {
            return false;
        }

        StringTokenizer stringtokenizer = new StringTokenizer(sString, sDelim);
        int iTokenCount = stringtokenizer.countTokens();

        if (iTokenCount <= 0) {
            return false;
        }

        boolean ret = false;
        while (stringtokenizer.hasMoreTokens()) {
            if (findStr.equals(stringtokenizer.nextToken())) ret = true;
        }

        return ret;
    }

    /**
     * 배열의 첫번째 요소의 값을 count 크기의 배열의 값으로 모두 채운다.
     *
     * @param array
     * @param count
     * @return
     * @throws Exception
     */
    public static String[] getArrayOfCopy(Object array, int count) throws Exception {

        String[] temp = new String[count];

        String[] pArray = (String[]) array;


        for (int i = 0; i < temp.length; i++) {
            temp[i] = pArray[0];
        }

        return temp;

    }

    /**
     * 리스트(List) 자료 구조를 스트링으로 변환
     *
     * @param list
     * @param identifier
     * @return
     * @throws Exception
     */
    @SuppressWarnings("rawtypes")
    public static String getArrayToString(List list, String identifier) throws Exception {

        StringBuilder sb = new StringBuilder(2000);

        int SIZE = list.size();

        for (int i = 0; i < SIZE; i++) {
            //System.out.println();
            sb.append(StringUtils.join((Object[]) list.get(i), identifier));

            if (i != (SIZE - 1)) sb.append(identifier);

        }

        return sb.toString();
    }

    /**
     * 사이즈가 0 이거나 null 인 배열을 defaultsize 를 가지는 배열로 리턴
     *
     * @param obj
     * @param defaultsize
     * @return
     */
    public static String[] getCreatedArray(Object obj, int defaultsize) {

        String[] array = (String[]) obj;

        String[] rv = null;
        if (array == null)
            rv = getNullCheckedArray(new String[defaultsize]);
        else if (array.length == 0)
            rv = getNullCheckedArray(new String[defaultsize]);
        else
            rv = getNullCheckedArray(array);

        return rv;
    }

    /**
     * 현재날짜를 yyyyMMddHHmmss 형식으로 리턴 한다.<br>
     *
     * @return String<br>
     */
//    public static String getCurDate() {
//        //java.text.SimpleDateFormat form = new java.text.SimpleDateFormat( "yyyyMMddHHmmss" );
//        Calendar calendar = Calendar.getInstance();
//        return FormatUtil.toDateFormat(calendar.getTime(), "yyyyMMddHHmmss");
//    }

    /**
     * 개행문자를 제외한 텍스트
     *
     * @param str
     * @return
     */
    public static String getIgnoreNewLineText(String str) {
        StringBuilder tmpString = new StringBuilder();

        try {
            if (str != null && !"".equals(str)) {
                BufferedReader br = new BufferedReader(new StringReader(str));
                String line;

                while ((line = br.readLine()) != null) {
                    line = line.trim();
                    // 시작부분에 있는 공백 무시
                    if (line.length() != 0) {
                        tmpString.append(" ").append(line);
                    }
                }
            }
        } catch (IOException e) {
            // TODO Auto-generated catch block
            log.error(e.getMessage(),e);
        }

        return tmpString.toString();
    }

    /**
     * 현재의 날짜를 8자리 character로 변환해서 구함.
     *
     * @return : 8자리의 character.
     */
    public static String getNow() {
        Calendar now = Calendar.getInstance();
        String year = Integer.toString(now.get(Calendar.YEAR));
        String month = getTwoDate(now.get(Calendar.MONTH) + 1);
        String day = getTwoDate(now.get(Calendar.DATE));
        return year + month + day;
    }

    /**
     * null 값인 항목을 "" 로 바꾼  배열 리턴
     *
     * @param obj
     * @return
     */
    public static String[] getNullCheckedArray(Object obj) {
        String[] array = (String[]) obj;

        for (int i = 0; i < array.length; i++)
            if (array[i] == null)
                array[i] = "";

        return array;
    }

    /**
     * 문자열을 잘라서 2쌍씩의 2차배열로 반환
     *
     * @param str
     * @param spliter
     * @return
     * @throws Exception
     */
    public static String[][] getPairByParsing(String str, String spliter) throws Exception {

        String[][] aPair = new String[2][];
        String[] array = str.split(spliter);

        int aPairLength = array.length / 2;

        aPair[0] = new String[aPairLength];
        aPair[1] = new String[aPairLength];


        int index = 0;
        for (int i = 0; i < aPairLength; i++) {
            index = i * 2;

            aPair[0][i] = array[index];
            aPair[1][i] = array[index + 1];

        }

        return aPair;

    }

    /**
     * 2 중 배열 데이터 스트링 구조를 2차 배열로 얻어옴
     *
     * @param str     스트링
     * @param spliter 스트링 구분자
     * @param UNIT    데이터 단위
     * @return
     * @throws Exception
     */
    public static String[][] getPairByParsing(String str, String spliter, int UNIT) throws Exception {

        String[][] aPair = new String[UNIT][];
        String[] array = str.split(spliter);

        int aPairLength = array.length / UNIT;


        for (int aUnit = 0; aUnit < UNIT; aUnit++) {
            aPair[aUnit] = new String[aPairLength];
        }

        int index = 0;
        for (int i = 0; i < aPairLength; i++) {
            index = i * UNIT;

            for (int aUnit = 0; aUnit < UNIT; aUnit++)
                aPair[aUnit][i] = array[index + aUnit];

        }

        return aPair;


    }

    /**
     * 대상 String(requestURL) 에서 특정 param 찾아서 value 를 리턴, 없을 시 null
     *
     * @param requestURL 대상 String
     * @param paramKey   찾는 String
     */
    public static String getParamValueInUrl(String requestURL, String paramKey) {
        if (requestURL == null || "".equals(requestURL)) {
            return null;
        }
        String[] temp = StringUtil.split(requestURL, "?");
        if (temp.length > 1 && temp[1] != null) {
            String[] paramList = StringUtil.split(temp[1], "&");
            for (int i = 0; i < paramList.length; i++) {
                String[] param = StringUtil.split(paramList[i], "=");
                if (paramKey.equals(param[0])) {
                    return param[1];
                }
            }
        }
        return null;
    }

    /**
     * 자바스크립트 배열 형식의 문자열로 리턴한다.
     *
     * @param head
     * @param spliter
     * @return
     */
    public static String getStringByJSArray(String head, String[] array, String spliter) {
        boolean flag = false;

        if (array == null) return "";

        StringBuilder sb = new StringBuilder("");

        sb.append("var ");
        sb.append(head);
        sb.append(" = new Array(");

        for (int i = 0; i < array.length; i++) {
            flag = true;
            sb.append("'");
            sb.append(array[i]);
            sb.append("'");

            if (i != (array.length - 1))
                sb.append(spliter);

        }

        sb.append(");");

        if (flag)
            return sb.toString();
        else
            return "var " + head + " = new Array()";
    }

    /**
     * "\r\n" 을 "\\\\\\n"으로 변환하여 리턴
     *
     * @param obj
     * @return
     */
    public static String getStringForRF(Object obj) {
        String str = (String) obj;


        return str.replaceAll("\r\n", "\\\\\\n");

    }

    /**
     * 글자수 제한해서 ch 붙이기
     *
     * @param title  스트링
     * @param maxNum 제한 글자수
     * @param ch     후미사
     * @return
     */
    public static String getStringLimit(String title, int maxNum, String ch) {
        if (title == null)
            return "";

        int blankLen = 0;
        int re_level = 0;
        if (re_level != 0)
            blankLen = (re_level + 1) * 2;
        int tLen = title.length();
        int count = 0;
        char c;
        int s = 0;

        for (s = 0; s < tLen; s++) {
            c = title.charAt(s);
            if ((count) > (maxNum - blankLen))
                break;
            if (c > 127)
                count += 2;
            else
                count++;
        }
        return (tLen > s) ? title.substring(0, s) + ch : title;
    }

    public static String getText(String content) {
        Pattern SCRIPTS = Pattern.compile("<(no)?head[^>]*>.*?</(no)?head>", Pattern.DOTALL);
        Pattern STYLE = Pattern.compile("<style[^>]*>.*</style>", Pattern.DOTALL);
        Pattern TAGS = Pattern.compile("<(\"[^\"]*\"|\'[^\']*\'|[^\'\">])*>");
        //Pattern nTAGS = Pattern.compile("<\\w+\\s+[^<]*\\s*>");
        //Pattern ENTITY_REFS = Pattern.compile("&[^;]+;");
        Pattern WHITESPACE = Pattern.compile("\\s\\s+");

        Matcher m;

        m = SCRIPTS.matcher(content);
        content = m.replaceAll("");
        m = STYLE.matcher(content);
        content = m.replaceAll("");
        m = TAGS.matcher(content);
        content = m.replaceAll("");
        //m = ENTITY_REFS.matcher(content);
        //content = m.replaceAll("");
        m = WHITESPACE.matcher(content);
        content = m.replaceAll(" ");

        return content;
    }

    /**
     * html 문장에서 화면에 표현되는 텍스트만 검출<br>
     *
     * @param sSource 원본소스<br>
     * @return 변경된 문자열<br>
     */
    public static String getTextFromHtml(String sSource) {
        String sReturn = "";
        if (sSource != null) {
            sReturn = toLowerCaseSE(sSource, "<", ">");
            sReturn = replaceSE(sReturn, "<script", "</script>", "");
            sReturn = replaceSE(sReturn, "<style", "</style>", "");
            sReturn = replace(sReturn, "<br>", "\n");
            sReturn = replaceSE(sReturn, "<", ">", "");
            sReturn = replace(sReturn, "&amp;", "&");
            //sReturn = replace( sReturn, "&nbsp;", " " );
            sReturn = replace(sReturn, "&lt;", "<");
            sReturn = replace(sReturn, "&gt;", ">");
            sReturn = replace(sReturn, "&quot;", "\"");
            sReturn = replace(sReturn, "&#039;", "'");
            sReturn = replace(sReturn, "&#009;", "\t");
        }
        return sReturn;
    }

    public static String getTextFromHtml2(String sSource) {
        String sReturn = "";
        if (sSource != null) {
            // sReturn = toLowerCaseSE( sSource, "<", ">" );
            sReturn = replaceSE(sSource, "<script", "</script>", "");
            sReturn = replaceSE(sReturn, "<style", "</style>", "");
            sReturn = replace(sReturn, "&lt;", "<");
            sReturn = replace(sReturn, "&gt;", ">");
            sReturn = replace(sReturn, "◦", "&#176");
            sReturn = replace(sReturn, "<object", "<div><object"); // IE create
            // chile
            // node 에러때문
            sReturn = replace(sReturn, "object>", "object></div>"); // IE create
            // chile
            // node 에러때문
        }
        return sReturn;
    }

    public static String getTwoDate(int iDate) {
        if (iDate < 0 || iDate > 9)
            return Integer.toString(iDate);

        String str = Integer.toString(iDate);
        str = "00" + str;
        return str.substring(1, 3);
    }

    /**
     * 월과 일을 무조건 두자리로 만들어 준다.
     *
     * @param sDate String
     * @return String
     */
    public static String getTwoDate(String sDate) {
        if (sDate == null || "".equals(sDate))
            return "";

        if (sDate.length() == 2)
            return sDate;

        sDate = "00" + sDate;
        return sDate.substring(1, 3);
    }

    /**
     * get the day of week..
     *
     * @return : the day of week in Korean..
     */
    public static String getWeekDay() {
        String ret = "";
        Date date = new Date();
        String wday = date.toString().substring(0, 3);
        if ("Sun".equals(wday))
            ret = "일";
        else if ("Mon".equals(wday))
            ret = "월";
        else if ("Tue".equals(wday))
            ret = "화";
        else if ("Wed".equals(wday))
            ret = "수";
        else if ("Thu".equals(wday))
            ret = "목";
        else if ("Fri".equals(wday))
            ret = "금";
        else if ("Sat".equals(wday))
            ret = "토";

        return ret;
    }

    /**
     * html의 특수문자를 수정한다.<br>
     */
    public static String htmlspecialchars(String sStr) {
        String sDesc = "";
        try {
            if (sStr != null && sStr.length() != 0) {
                sDesc = StringUtil.replace(sStr, "&", "&amp;");
                sDesc = StringUtil.replace(sDesc, "<", "&lt;");
                sDesc = StringUtil.replace(sDesc, ">", "&gt;");
            } else {
                sDesc = "";
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }

        return sDesc;
    }

    /**
     * List안의 문자열을  separator로 구분된 String으로 변환<br>
     * ex) 값이 a, b, c 인 3row의 List -> 'a','b','c'<br>
     * List가 null 이면 ''을 리턴<br>
     *
     * @param list 변환시킬 List<br>
     * @return<br>
     */
    public static String implode(List<String> list, String separator) {
        StringBuilder sBuf = new StringBuilder();
        if (list != null && !list.isEmpty()) {
            for (int i = 0; i < list.size(); i++) {
                String str = (String) list.get(i);
                if (str != null && str.trim().length() > 0) {
                    sBuf.append(str);
                    if (i < list.size() - 1) {
                        sBuf.append(separator);
                    }
                }
            }
        } else {
            sBuf.append("");
        }
        return sBuf.toString();
    }

    //@SuppressWarnings({ "unchecked", "unused" })
    public static boolean inArray(String[] strArray, String needle) {
        for (int i = 0; i < strArray.length; i++) {
            if (strArray[i].equals(needle)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 해당 문자열에 값이 있는지 확인한다.<br>
     * @return<br>
     */
    public static boolean isEmpty(String sStr) {
        boolean bResult = false;

        if (sStr == null || "".equals(sStr.trim())) {
            bResult = true;
        }

        return bResult;
    }

    /**
     * 해당 문자열이 null일 경우 대체 문자열을 반환한다.<br>
     *
     * @param source  String 검사할 문자열<br>
     * @param replace String 대체 문자열<br>
     * @return String 결과 문자열<br>
     */
    public static String isNull(String source, String replace) {
        if (source != null) {
            return source;
        } else {
            return replace;
        }
    }

    /**
     * 숫자형 문자열인지 확인
     *
     */
    public static boolean isNumberic(String num) {
        try {
            Integer.decode(num);
            return true;
        } catch (Exception a) {
            try {
                Float.parseFloat(num);
                return true;
            } catch (Exception b) {
                return false;
            }
        }
    }

    /**
     * KSC5601 인코딩을 8859_1로 변환한다.<br>
     *
     * @param sStr<br>
     * @return<br>
     */
    public static String KoreanToEnglish(String sStr) {
        String sResult = "";

        try {
            if (!isEmpty(sStr)) {
                sResult = new String(sStr.getBytes("KSC5601"), "8859_1");
            }
        } catch (UnsupportedEncodingException ex) {
            log.error(ex.getMessage(), ex);
        }

        return sResult;
    }


    /**
     * 문자열을 왼쪽에서 해당 길이만큼 짤라서 반환한다.<br>
     * @return String<br>
     */
    public static String left(String sStrString, int iLength) {
        if (sStrString != null && sStrString.length() >= iLength) {
            sStrString = sStrString.substring(0, iLength);
            return sStrString;
        } else {
            return "";
        }
    }


    /**
     * 경로안에서 파일명만 추출
     *
     * @param 문자열(경로)
     */
    public static String LinkToName(String link) {
        String[] links = link.split("/");
        String name;
        name = links[links.length - 1];
        return name;
    }

    /**
     * List안의 각각 문자열 앞뒤를 '로 싼다음 , 로 구분된 String으로 변환<br>
     * ex) 값이 a, b, c 인 3row의 List -> 'a','b','c'<br>
     * List가 null 이면 ''을 리턴<br>
     *
     * @param list 변환시킬 List<br>
     * @return<br>
     */
    @SuppressWarnings("rawtypes")
    public static String listToStringWithAmp(List list) {
        StringBuilder sBuf = new StringBuilder();
        if (list != null && !list.isEmpty()) {
            for (int i = 0; i < list.size(); i++) {
                String str = (String) list.get(i);
                if (str != null && str.trim().length() > 0) {
                    sBuf.append("'" + str + "'");
                    ////System.out.println("i:: " + i + ", list.size():: " + list.size());
                    if (i < list.size() - 1) {
                        sBuf.append(",");
                    }
                }
            }
        } else {
            sBuf.append("''");
        }
        return sBuf.toString();
    }

    /**
     * 문자열을 임의의 위치에서 해당 길이만큼 짤라서 반환한다.<br>
     *
     * @return<br>
     */
    public static String mid(String sStrString, int iStart, int iLength) {

        sStrString = sStrString.substring(iStart, iLength + iStart);
        return sStrString;
    }

    /**
     * \n을 <BR>로 바꾼다.<br>
     * @return<br>
     */
    public static String nl2br(String sStr) {
        String sDesc = null;
        try {
            if (sStr == null) {
                return null;
            }

            sDesc = "";
            if (sStr.length() != 0) {
                sDesc = replace(sStr, "\n", "<BR>");
                sDesc = replace(sDesc, "  ", "&nbsp;&nbsp");
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }

        return sDesc;
    }

    /**
     * 해당 문자열이 null인경우 빈문자열("")을 반환한다.<br>
     *
     * @param sStr String<br>
     * @return String<br>
     */
    public static String nullToEmpty(String sStr) {
        if (sStr == null) {
            sStr = "";
        }

        return sStr;
    }

    /**
     * 대상 String이 null일 경우 ""을, null이 아닐 경우 대상 String을 return
     *
     * @param str 대상 스트링
     */
    public static String nvl(String str) throws Exception {
        if (str == null || "null".equals(str))
            return "";
        else
            return str;
    }

    /**
     * 대상 String이 null일 경우 대체 int 를, null이 아닐 경우 대상 String을
     * int 로 변환하여 return
     *
     * @param str 대상 문자
     * @param val null일 경우 대체될 문자
     */
    public static int nvl(String str, int val) throws Exception {
        int iRs = 0;

        if (str == null || "".equals(str.trim()) || "null".equals(str.trim()))
            iRs = val;
        else
            iRs = Integer.parseInt(str);

        return iRs;

    }

    /**
     * 대상 String이 null일 경우 대체 String을, null이 아닐 경우 대상 String을 return
     *
     * @param str 대상 문자
     * @param val null일 경우 대체될 문자
     */
    public static String nvl(String str, String val) {
        if (str == null)
            return val;
        else if ("".equals(str))
            return val;
        else
            return str;
    }

    /**
     * 대상 String이 null일 경우 대체 String을, null이 아닐 경우 대상 String을 return
     *
     * @param str 대상 문자
     * @param val null일 경우 대체될 문자
     */
    public static String nvlS(String str, String val) {
        if (str == null)
            return val;
        else if ("".equals(str) || "null".equals(str))
            return val;
        else
            return str;
    }


    /**
     * 대상 String이 null일 경우 대체 int 를, null이 아닐 경우 대상 String을
     * int 로 변환하여 return
     */
    public static int nvlI(int num) throws Exception {
        int iRs = 0;

        if (num != 0)
            iRs = num;

        return iRs;
    }

    /**
     * 대상 String이 null일 경우 대체 int 를, null이 아닐 경우 대상 String을
     * int 로 변환하여 return
     */
    public static int nvlI(String str) throws Exception {
        int iRs = 0;

        if (str == null || "null".equals(str) || "".equals(str))
            iRs = 0;
        else
            iRs = Integer.parseInt(str);

        return iRs;

    }

    /**
     * 대상 String이 null일 경우 대체 int 를, null이 아닐 경우 대상 String을
     * int 로 변환하여 return
     *
     * @param str 대상 문자
     */
    public static Long nvlL(Long str) throws Exception {
        Long iRs = 0L;

        if (str == null)
            iRs = 0L;
        else
            iRs = str;

        return iRs;

    }

    /**
     * 대상 String이 null일 경우 대체 int 를, null이 아닐 경우 대상 String을
     * int 로 변환하여 return
     *
     * @param str 대상 문자
     */
    public static Long nvlL(String str) {
        Long iRs = 0L;

        if ((str != null) && (!("null".equals(str))) && (!("".equals(str)))) {
            try {
                iRs = Long.parseLong(str);
            } catch (NumberFormatException e) {

            }
        }

        return iRs;

    }

    /**
     * int형으로 변환한다.
     *
     * @param sStr String
     * @return int
     */
    public static int parseInt(String sStr, int iDefault) {
        int iResult = iDefault;

        try {
            if (!isEmpty(sStr)) {
                iResult = Integer.parseInt(sStr);
            }
        } catch (NumberFormatException ex) {
        }

        return iResult;
    }

    /**
     * Long형으로 변환한다.
     *
     * @param sStr String
     * @return long
     */
    public static long parseLong(String sStr, int nDefault) {
        long nResult = nDefault;

        try {
            if (!isEmpty(sStr)) {
                nResult = Long.parseLong(sStr);
            }
        } catch (NumberFormatException ex) {
        }

        return nResult;
    }

    public static Double parseDouble(String sStr, Double nDefault) {
        Double nResult = nDefault;

        try {
            if (!isEmpty(sStr)) {
                nResult = Double.parseDouble(sStr);
            }
        } catch (NumberFormatException ex) {
        }

        return nResult;
    }

    public static boolean str2Bl(String sStr) {
        if (isEmpty(sStr)) {
            return false;
        }
        return Boolean.parseBoolean(sStr);
    }

    /**
     * 두 문자열을 비교하여 같으면 " checked"를 반환한다.<br>
     *
     * @param sTarget1 String<br>
     * @param sTarget2 String<br>
     * @return String<br>
     */
    public static String printChecked(String sTarget1, String sTarget2) {
        String sResult = "";

        if (sTarget1 == null) {
            sTarget1 = "";
        }

        if (sTarget1.equals(sTarget2)) {
            sResult = " checked";
        }

        return sResult;
    }

    /**
     * 두 문자열을 비교하여 같으면 " selected"를 반환한다.<br>
     *
     * @param sTarget1 String<br>
     * @param sTarget2 String<br>
     * @return String<br>
     */
    public static String printSelected(String sTarget1, String sTarget2) {
        String sResult = "";

        if (sTarget1 == null) {
            sTarget1 = "";
        }

        if (sTarget1.equals(sTarget2)) {
            sResult = " selected";
        }

        return sResult;
    }

    /**
     * 대상 String 에서 특정 String을 찾아서 다른 String으로 대체하여 return
     *
     * @param str  대상 String
     */
    public static int removeComma(String str) {
        int sResult = 0;
        try {

            if (str == null || "".equals(str)) str = "0";
            StringBuilder sb;
            sb = new StringBuilder(str.length() * 2);
            String posString = str.toLowerCase();
            String cmpString = ",";
            int i = 0;
            boolean done = false;
            while (i < str.length() && !done) {
                int start = posString.indexOf(cmpString, i);
                if (start == -1) {
                    done = true;
                } else {
                    sb.append(str.substring(i, start)).append("");
                    i = start + 1;
                }
            }
            if (i < str.length()) {
                sb.append(str.substring(i));
            }

            sResult = Integer.parseInt(sb.toString());
        } catch (Exception e) {
            sResult = Integer.parseInt(str);
        }
        return sResult;
    }

    public static String removeXss(String sHTML) {
        if (sHTML == null || "".equals(sHTML.trim()))
            return "";
        sHTML = StringUtil.replace(sHTML, "<", "&lt");
        sHTML = StringUtil.replace(sHTML, ">", "&gt");
        return sHTML;
    }

    public static String removeXssAllowHtml(String sHTML) {
        if (sHTML == null || "".equals(sHTML.trim()))
            return "";
        sHTML = sHTML.replaceAll("(?i)script", "scr<!---->ipt");
        //sHTML = sHTML.replaceAll("(?i)on", "&#111;n");
        return sHTML;
    }

    public static String removeXssHtml(String sHTML) {
        sHTML = sHTML.replaceAll("(?i)script", "sc#ipt");
        sHTML = sHTML.replaceAll("(?i).js", "#.js");
        sHTML = sHTML.replaceAll(":url", "#url");
        return sHTML;
    }

    public static StringBuilder removeXss(StringBuilder sBuilderHTML) {
        String sHTML = StringUtil.removeXss(sBuilderHTML.toString());
        if (sHTML == null || "".equals(sHTML.trim()))
            return new StringBuilder("");
        sHTML = StringUtil.replace(sHTML, "<", "&lt");
        sHTML = StringUtil.replace(sHTML, ">", "&gt");
        return new StringBuilder(sHTML);
    }

    /**
     * 해당 문자열을 다른 문자열로 대체한다.<br>
     * @return<br>
     */
    public static String replace(String sStrString, String sStrOld, String sStrNew) {
        if (sStrString == null) {
            return null;
        }
        for (int iIndex = 0; (iIndex = sStrString.indexOf(sStrOld, iIndex)) >= 0; iIndex += sStrNew.length()) {
            sStrString = sStrString.substring(0, iIndex) + sStrNew + sStrString.substring(iIndex + sStrOld.length());
        }

        return sStrString;
    }

    /**
     * 대상 String 에서 < 와 > & 를
     * &lt; 와 &gt; 와 &amp;로 바꿔서 return
     *
     * @param sHTML 대상 String
     */
    public static String replaceHtmlTag(String sHTML) throws Exception {
        if (sHTML == null || "".equals(sHTML.trim()))
            return "";

        String sResult = "";
        StringBuilder sbResult = null;

        try {
            String s = "";
            sbResult = new StringBuilder();

            for (int i = 0; i < sHTML.length(); i++) {
                s = sHTML.substring(i, i + 1);

                if ("<".equals(s)) {
                    sbResult.append("&lt;");
                } else if (">".equals(s)) {
                    sbResult.append("&gt;");
                } else if ("\"".equals(s)) {
                    sbResult.append("&quot;");
                } else if ("'".equals(s)) {
                    sbResult.append("&#39;");
                } else if ("&".equals(s)) {
                    sbResult.append("&amp;");
                } else {
                    sbResult.append(s);
                }
            }

            sResult = sbResult.toString();
        } finally {
            sbResult = null;
        }

        return sResult;
    }

    /**
     * 대상 String 을 trim 처리 한 후 < 와 > & 를
     * &lt; 와 &gt; 와 &amp;로 바꿔서 return
     *
     * @param sHTML 대상 String
     */
    public static String replaceHtmlTagTrim(String sHTML) throws Exception {
        return replaceHtmlTag(trim(sHTML));
    }

    /**
     * 소스문자열에서 시작문자열부터 끝문자열까지를 찾아 다른 문자열로 치환하여 반환하는 메소드<br>
     *
     * @param sSource  원본소스<br>
     * @param sStart   시작문자열<br>
     * @param sEnd     종료문자열<br>
     * @param sConvert 치환할 문자열<br>
     * @return 치환된 문자열<br>
     */
    public static String replaceSE(String sSource, String sStart, String sEnd, String sConvert) {
        StringBuilder sb = new StringBuilder();
        String sRest = null; // 원본문자열 받아서 처리하는 변수
        int iIndexStart = 0; // 인덱스시작값
        int iIndexEnd; // 인덱스끝값

        //sSource NullPointException 때문에 이하 if 구문 수정
        if (sSource != null) {
            sRest = sSource;

            while ((iIndexStart = sRest.indexOf(sStart)) > -1
                    &&
                    (iIndexEnd = sRest.indexOf(sEnd, iIndexStart)) > -1) {
                sb.append(sRest.substring(0, iIndexStart) + sConvert);
                sRest = sRest.substring(iIndexEnd + sEnd.length());
            }

            sb.append(sRest);
        }
        return sb.toString();
    }

    /**
     * 문자열을 오른쪽에서 해당 길이만큼 짤라서 반환한다.<br>
     * @return<br>
     */
    public static String right(String sStrString, int iLength) {
        if (sStrString != null && sStrString.length() >= iLength) {
            sStrString = sStrString.substring(sStrString.length() - iLength, sStrString.length());
            return sStrString;
        } else {
            return "";
        }
    }

    /**
     * 기본값 보장
     *
     * @param in
     * @return
     */
    public static String safe(Object in) {
        if (in == null)
            return "";
        else
            return (String) in;
    }

    /**
     * 기본값 보장
     *
     * @param in
     * @return
     */
    public static String safeLong(long in) {
        if (in == 0L)
            return "";
        else
            return String.valueOf(in);
    }

//	/**
//	 * 기본 값 보장
//	 * @param value
//	 * @param defa02
//	 * @return
//	 */
//	public static void safe(MyHashMap map,String key,String def)
//	{
//		String value = map.getString(key) ;
//		
//		if( "".equals(value) )
//			value = def ;
//		
//		map.put(key, value) ;
//
//	}

    /**
     * 문자열을 구분자로 분리하여 배열에 담아 반환한다.<br>
     *
     * @param sString 문자열<br>
     * @param sDelim  구분자<br>
     * @return String[] 배열<br>
     */
    public static String[] split(String sString, String sDelim) {
        if (isEmpty(sString)) {
            return null;
        }

        StringTokenizer stringtokenizer = new StringTokenizer(sString, sDelim);
        int iTokenCount = stringtokenizer.countTokens();

        if (iTokenCount <= 0) {
            return null;
        }

        String sResults[] = new String[iTokenCount];
        int i = 0;

        while (stringtokenizer.hasMoreTokens()) {
            sResults[i++] = stringtokenizer.nextToken();
        }

        return sResults;
    }

    /**
     * 배열의 값을 limit만큼 잘라서 반
     *
     * @param arrStrBS
     * @param index
     * @param limit
     * @return
     * @throws Exception
     */
    public static String[] SptWebString(String[] arrStrBS, int index, int limit) throws Exception {
        if (arrStrBS[index] == null)
            arrStrBS[index] = "&nbsp";
        else {
            if (arrStrBS[index].length() >= limit)
                arrStrBS[index] = arrStrBS[index].substring(0, limit);
        }

        return arrStrBS;
    }

    /**
     * 2차배열의 값을 limit만큼 잘라서 반환
     *
     * @param arrStrBS
     * @param index
     * @param limit
     * @return
     * @throws Exception
     */
    public static String[][] SptWebString(String[][] arrStrBS, int index, int limit) throws Exception {
        for (int i = 0; i < arrStrBS.length; i++)
            if (arrStrBS[i][index] == null)
                arrStrBS[i][index] = "&nbsp";
            else {
                if ((arrStrBS[i][index]).length() >= limit)
                    arrStrBS[i][index] = arrStrBS[i][index].substring(0, limit);
            }

        return arrStrBS;
    }

    /**
     * '을 ''로 바꾼다.<br>
     * @return<br>
     */
    public static String SQ2DQ(String sStr) {
        return replace(sStr, "'", "''");
    }

    /**
     * Extjs 의 작은따옴표안에 들어가는 value로 변환
     */
    public static String toExtValue(String str) {
        String returnValue;
        try {
            //returnValue = StringUtil.replace(StringUtil.nvl(str), "'", "\'");
            //returnValue = StringUtil.addSlashes(str);
            returnValue = StringUtil.nvl(str).replace("'", "\\'");

        } catch (Exception e) {
            returnValue = "";
        }
        return returnValue;
    }


    /**
     * 대상 String을 int로 변환하여 return
     *
     * @param s 대상 String
     */
    public static int toInt(String s) throws Exception {
        return Integer.parseInt(s);
    }

    /**
     * 문자열을 잘라서 배열로 반환
     *
     * @param obj
     * @param identitier
     * @return
     */
    public static String[] tokenizer(Object obj, String identitier) {
        String string = (String) obj;

        String[] rv = string.split(identitier);

        return rv;
    }

    /**
     * 스트링을 받아서 사이즈가 0 이거나 null 인 배열을 defaultsize 를 가지는 배열로 리턴
     *
     * @param obj
     * @param identitier
     * @param defaultsize
     * @return
     */
    public static String[] tokenizer(Object obj, String identitier, int defaultsize) {
        String string = (String) obj;

        String[] rv = null;
        if (string == null)
            rv = getCreatedArray(rv, defaultsize);
        else if ("".equals(string))
            rv = getCreatedArray(rv, defaultsize);
        else
            rv = string.split(identitier, defaultsize);

        return rv;
    }


    /**
     * 소스문자열에서 시작문자열과 끝문자열 사이의 단어를 소문자로 바꾼후 반환하는 메소드<br>
     * ex) toLowerCaseSE('<STYLE>ABC<HELP>', '<', '>') => '<style>ABC<help>'<br>
     *
     * @param sSource 원본소스<br>
     * @param sStart  시작문자열<br>
     * @param sEnd    종료문자열<br>
     * @return 변경된 문자열<br>
     */
    public static String toLowerCaseSE(String sSource, String sStart, String sEnd) {
        StringBuilder sb = new StringBuilder();
        String sRest = null; // 원본문자열 받아서 처리하는 변수
        int iIndexStart = 0; // 인덱스시작값
        int iIndexEnd; // 인덱스끝값

        sRest = sSource;

        while ((iIndexStart = sRest.indexOf(sStart)) > -1
                &&
                (iIndexEnd = sRest.indexOf(sEnd, iIndexStart)) > -1) {
            sb.append(sRest.substring(0, iIndexStart));
            sb.append(sRest.substring(iIndexStart, iIndexEnd + sEnd.length()).
                    toLowerCase());
            sRest = sRest.substring(iIndexEnd + sEnd.length());
        }

        sb.append(sRest);
        return sb.toString();
    }


    /**
     * java.sql.Date형으로 변환한다. (yyyyMMdd or yyyyMMddhhmmss)
     *
     * @param sDate String
     * @return Date
     */
    public static java.sql.Date toSqlDate(String sDate) throws Exception {
        return new java.sql.Date(toUtilDate(sDate).getTime());
    }

    /**
     * int를 String으로 바꾼다. 한자리 숫자이면 앞에 "0"을 붙인다.
     *
     * @param iNumber 숫자 문자열
     * @return String
     */
    public static String toStringNumber(int iNumber) {
        String sResult = "0";

        try {
            if (iNumber < 10) {
                sResult = sResult + Integer.toString(iNumber);
            } else {
                sResult = Integer.toString(iNumber);
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return sResult;
    }

    /**
     * long를 String으로 바꾼다. 한자리 숫자이면 앞에 "0"을 붙인다.<br>
     * @return<br>
     */
    public static String toStringNumber(Long iNumber) {
        String sResult = "0";

        try {
            if (iNumber < 10) {
                sResult = sResult + Long.toString(iNumber);
            } else {
                sResult = Long.toString(iNumber);
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return sResult;
    }

    /**
     * 한자리 숫자이면 앞에 "0"을 붙인다.<br>
     * @return<br>
     */
    public static String toStringNumber(String sNumber) {
        if (isEmpty(sNumber)) {
            return "";
        }

        return toStringNumber(Integer.parseInt(sNumber));
    }

    /**
     * 전화번호 형식을 sDelim 단위로 잘라서 반환한다. sDelim 형식에 맞지 않은 타입의 문자열이 검출되었을때 "","","" 빈문자열 배열이 반환 된다.
     *
     * @param sString String
     * @param sDelim  String
     * @return String[]
     */
    public static String[] toTelNum(String sString, String sDelim) {
        String[] sTelNums = {"", "", ""};
        try {
            Pattern p = Pattern.compile("([0-9]+)" + sDelim + "([0-9]+)" + sDelim + "([0-9]+)");
            Matcher m = p.matcher(sString);
            if (m.matches()) {
                sTelNums = split(sString, sDelim);
            } else {
                sTelNums[0] = "";
                sTelNums[1] = "";
                sTelNums[2] = "";
            }

        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return sTelNums;
    }

    /**
     * java.util.Date형으로 변환한다. (yyyyMMdd or yyyyMMddhhmmss)
     *
     * @param sDate String
     * @return Date
     */
    public static Date toUtilDate(String sDate) throws Exception {
        if (sDate == null) {
            throw new Exception("잘못된 날짜형식입니다.  : sDate is Null");
        }

        if (sDate.length() != 8 && sDate.length() != 14) {
            throw new Exception("잘못된 날짜형식입니다.(8자리 또는 14자리) : " + sDate);
        }

        if (sDate.length() == 8) {
            sDate = sDate + "000000";
        }

        Calendar calendar = Calendar.getInstance();
        calendar.set(Integer.valueOf(sDate.substring(0, 4))
                , Integer.valueOf(sDate.substring(4, 6)) - 1
                , Integer.valueOf(sDate.substring(6, 8))
                , Integer.valueOf(sDate.substring(8, 10))
                , Integer.valueOf(sDate.substring(10, 12))
                , Integer.valueOf(sDate.substring(12, 14)));

        return calendar.getTime();
    }


    /**
     * 대상 String이 null일 경우 ""을, null이 아닐 경우 대상 String을 trim한 후 return
     *
     * @param str trim한 대상 스트링
     */
    public static String trim(String str) {
        String sTmp = str;

        if (str == null) {
            sTmp = "";
        } else if (!"".equals(str) && str.length() > 0) {
            sTmp = str.trim();
        }

        return sTmp;
    }

    /**
     * 대상 String이 null일 경우 ""을, null이 아닐 경우 대상 String을 trim한 후 return
     *
     * @param str   trim한 대상 스트링
     * @param value null일 경우 대체 string
     */
    public static String trim(String str, String value) {
        String sTmp = str;

        if (str == null) {
            sTmp = value;
        } else if (!"".equals(str) && str.length() > 0) {
            sTmp = str.trim();
        }

        return sTmp;
    }

    /**
     * javascript 에서 escape 형태로 넘어온 문자열을 unescape 해주는 메소
     * @return
     */
    public static String unescape(String src) {
        StringBuilder tmp = new StringBuilder();
        tmp.ensureCapacity(src.length());
        int lastPos = 0, pos = 0;
        char ch;
        while (lastPos < src.length()) {
            pos = src.indexOf('%', lastPos);
            if (pos == lastPos) {
                if (src.charAt(pos + 1) == 'u') {
                    ch = (char) Integer.parseInt(src
                            .substring(pos + 2, pos + 6), 16);
                    tmp.append(ch);
                    lastPos = pos + 6;
                } else {
                    ch = (char) Integer.parseInt(src
                            .substring(pos + 1, pos + 3), 16);
                    tmp.append(ch);
                    lastPos = pos + 3;
                }
            } else {
                if (pos == -1) {
                    tmp.append(src.substring(lastPos));
                    lastPos = src.length();
                } else {
                    tmp.append(src.substring(lastPos, pos));
                    lastPos = pos;
                }
            }
        }

        return tmp.toString();
    }

    /**
     * 배열을 구분자로 합치기
     * @param array
     * @param identitier
     * @return
     */
    public static String unTokenizer(Object array, String identitier) {

        String[] strArray = (String[]) array;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < strArray.length; i++) {
            sb.append(strArray[i]);
            if (i != (strArray.length - 1)) sb.append(identitier);
        }

        return sb.toString();

    }

    /**
     * 중복 요소 없이 unTokenize 하기
     *
     * @param str
     * @param spliter
     * @return
     */
    @SuppressWarnings({"rawtypes", "unchecked"})
    public static String unTokenizerWithoutDuplication(String str, String spliter) {
        StringTokenizer st = new StringTokenizer(str, spliter);
        ArrayList alTemp = new ArrayList();
        String temp;
        while (st.hasMoreTokens()) {
            temp = st.nextToken();
            if (!alTemp.contains(temp)) {
                alTemp.add(temp);
            }
        }

        String[] temp_arr = (String[]) alTemp.toArray(new String[alTemp.size()]);
        StringBuilder temp_str = new StringBuilder();

        for (String aTemp_arr : temp_arr) {
            temp_str.append(aTemp_arr).append(spliter);
        }
        return temp_str.toString();

    }

    /**
     * JSON String 으로 묶여온 값들을 list 로 반환함
     *
     * @param json
     * @return
     */
    public static List<String> parseJsonStr(String json) {
        List<String> result = new ArrayList<String>();
        try {
            json = StringUtil.replace(json, "[", "");
            json = StringUtil.replace(json, "]", "");

            String[] arr = StringUtil.split(json, ",");
            String r = "";
            for (int i = 0; i < arr.length; i++) {
                r = StringUtil.replace(arr[i], "\"", "");
                result.add(r);
                log.info("[parseArr][" + i + "] " + r);
            }
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }
        return result;
    }

    /**
     * break line 태그를 \r\n 으로 치환
     *
     * @param str
     * @return
     */
    public static String brToRn(String str) {
    	if(str!=null){
            str = str.replaceAll("<br>", "\\r\\n");
    	}
    	return str;
    }

    /**
     * \r\n 을 break line 태그로 치환
     *
     * @param str
     * @return
     */
    public static String rnToBr(String str) {
    	if(str!=null) {
            return str.replaceAll("\\r\\n", "<br>");
    	} else {
    		return null;
    	}
    }

    /**
     * 입력값이 Y/N 인지 체크
     *
     * @param str 입력값
     * @return Y/N 여부(Y이면 true, 그외 false)
     */
    public static boolean isYN(String str) {
        return "Y".equals(str) || "N".equals(str);
    }

    /**
     * Y/N 입력값을 숫자형으로 변환
     *
     * @param str 입력값(Y/N)
     * @return 변환값(Y이면 1, 그외는 0)
     */
    public static int toUseYn(String str) {
        if ("Y".equals(str))
            return 1;
        else
            return 0;
    }

    public static String toYn(Long value) {
        if (value != null && value == 1L)
            return "Y";
        else
            return "N";
    }

    public static String encodeStr(String str) {
        String result;
        try {
            result = URLEncoder.encode(str, "UTF-8").replaceAll("\\+", "%20");
        } catch (Exception e) {
            log.error(e.getMessage(),e);
            result = str;
        }

        return result;
    }

    public static String encodeStr(String str, String encodeType) {
        String result;
        try {
            result = URLEncoder.encode(str, encodeType).replaceAll("\\+", "%20");
        } catch (Exception e) {
            log.error(e.getMessage(),e);
            result = str;
        }

        return result;
    }

    /**
     * 스트링 문자열의 길이가 splitInt 값의 배수보다 길게 되면 splitInt 자릿수에 <br/> 태그를 추가하는 함수
     *
     * @param str      오리지날 스트링 문자열
     * @param splitInt <br/> 태그가 들어가는 스트링 문자열의 자리
     * @return
     */
    public static String addBrTagToStr(String str, Integer splitInt) {
        char[] arrayStr = str.toCharArray();
        StringBuilder returnStr = new StringBuilder();
        for (int i = 0; i < arrayStr.length; i++) {
            if (i % splitInt == 0 && i != 0) {
                returnStr.append("<br/>").append(arrayStr[i]);
            }
            else {
                returnStr.append(arrayStr[i]);
            }
        }

        return returnStr.toString();
    }

    /**
     * 스트링 문자열을 startIdx byte 부터 bytes 까지 출력
     *
     * @param s
     * @param startIdx
     * @param bytes
     * @return
     */
    public static String getByteString(String s, int startIdx, int bytes) {
        return new String(s.getBytes(), startIdx, bytes);
    }

    /**
     * 입력받은 문자열중 첫글자만 대문자로 치환하여 반환함
     *
     * @param str
     * @return
     */
    public static String getFirstUpperStr(String str) {

        if (!isEmpty(str)) {
            StringBuilder sb = new StringBuilder();
            sb.append(str.substring(0, 1).toUpperCase()).append(str.substring(1).toLowerCase());
            str = sb.toString();
        }
        return str;
    }

    public static String getArrayToString(String[] arrLevel, String delimiter) {
        StringBuilder sb = new StringBuilder("");
        if (arrLevel != null && arrLevel.length > 0) {
            for (int i = 0; i < arrLevel.length; i++) {
                if (i < arrLevel.length - 1)
                    sb.append(arrLevel[i]).append(delimiter);
                else
                    sb.append(arrLevel[i]);
            }
        }

        return sb.toString();
    }

    /**
     * util method for enc/dec json
     *
     * @param o
     * @return
     */
    public static String obj2Json(Object o) {
        return JsonUtil.convertToJson(o);
    }

    public static Object json2Obj(String json) {
        return JsonUtil.parseJson(json);
    }

    public static Object json2Arr(String json) {
        return JsonUtil.parseJson(json, ArrayList.class);
    }

    public static Object json2Obj(String json, Class<?> type) {
        return JsonUtil.parseJson(json, type);
    }

    public static String getFirstLine(String str, String spliter) {
        if (!StringUtil.isEmpty(str) && !StringUtil.isEmpty(spliter)) {
            String[] split = str.split(spliter);
            if (split != null && split.length > 0) {
                return split[0];
            }
        }
        return "";
    }

    public static String formatPrice(Double price) {
        if (price == null || price == 0) return "0";
        DecimalFormat df = new DecimalFormat("#,##0");
        return df.format(price);
    }

    public static String formatPrice2(Double price) {
        if (price == null || price == 0) return "0";
        BigDecimal bf = new BigDecimal(price);
        return bf.setScale(2, BigDecimal.ROUND_DOWN).stripTrailingZeros().toPlainString();
    }

    public static String formatPrecision(Double numberInput, Integer precision) {
        if (numberInput == null || numberInput == 0) return "0";
        BigDecimal bf = new BigDecimal(numberInput);
        return bf.setScale(precision, BigDecimal.ROUND_DOWN).stripTrailingZeros().toPlainString();
    }

    public static String replaceLastString(String str, int length, String ch) {
        if (isEmpty(str) || str.length() <= length) {
            return str;
        }

        StringBuilder lastString = new StringBuilder();
        for (int i = 0; i < length; i++){
            lastString.append(ch);
        }


        lastString.insert(0, str.substring(0, str.length() - length));
        return lastString.toString();
    }

    public static String maskEmail(String email) {
        if (!isEmpty(email)) {
            return email.replaceAll("^.*@","****@");
        }
        return email;
    }

    public static String[] splitEmail(String email) {
        if (!isEmpty(email)) {
            return email.split("@");
        }
        return null;
    }

    public static String[] splitPhone(String phone) {
        if (!isEmpty(phone)) {
            return phone.split("-");
        }
        return new String[]{};
    }

    public static String findImgSrc(String contain) {
        String imgSrc = "";
        if(StringUtils.isNotEmpty(contain)) {
            String imgContain = findSubString(contain, "<img", ">");
            if(StringUtils.isNotEmpty(imgContain)) {
                imgSrc = findSubString(imgContain, "src=[\"|']", "[\"|']");
            }
        }
        return imgSrc;
    }

    public static String findSubString(String contain, String begin, String end) {
        if(StringUtils.isNotEmpty(contain)) {
            Pattern pattern = Pattern.compile(begin+"(.*?)"+end);
            Matcher matcher = pattern.matcher(contain);
            if (matcher.find())
            {
                return matcher.group(1);
            }
        }
        return "";
    }
}
