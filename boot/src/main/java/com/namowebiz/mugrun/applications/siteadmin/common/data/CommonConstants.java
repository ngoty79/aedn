package com.namowebiz.mugrun.applications.siteadmin.common.data;

/**
 * Created by NgocSon on 11/13/2015.
 *
 */
public class CommonConstants {
    public static final Integer USE_YES = 1;
    public static final Integer USE_NO = 0;

    public static final String MAIL_TEMPLATE_SIGNUP = "signup";
    public static final String MAIL_TEMPLATE_SIGNUP_CLOSE = "signupclose";
    public static final String MAIL_TEMPLATE_FIND_ID = "findid";
    public static final String MAIL_TEMPLATE_FIND_PASSWORD = "findpass";
    public static final String MAIL_TEMPLATE_SMS = "sms";

    public static final String SMART_EDITOR_SUB_DIRECTORY_NAME = "editor";
    /**The postfix value of generated thumbnail images.*/
    public static final String THUMBNAIL_POSTFIX = "_THUMB";
    /**The file extension for generated thumbnail images.*/
    public static final String THUMBNAIL_EXT = ".jpg";
    /**The maximum sizes for generated thumbnail images.*/
    public static final int THUMNAIL_MAX_SIZE = 100;

    public static final String USER_STATUS_APPROVAL = "A";
    public static final String USER_STATUS_WAITING = "W";

    public static final Long DEFAULT_USER_GROUP_NO = 1L;

    public static final String BOARD_USE_YN = "1";

    public static final String MODULE_FIND_ID = "FIND_ID";
    public static final String MODULE_FIND_PASSWORD = "FIND_PASSWORD";

    public static final int MODULE_SIGNUP_CAPTCHA_YN = 1;
    public static final int MODULE_SIGNUP_BASE_AGREEMENT_YN = 1;
    public static final int MODULE_SIGNUP_USE_YN = 1;
    public static final int MODULE_SIGNUP_INIT_VIEW_ORDER = 0;
    public static final int MODULE_SIGNUP_PROVISION_AGREE_YN = 1;

    public static final int COMMON_CODE_USE_YN = 1;
    public static final String COMMON_CODE_GROUP_CODE_CERT_TYPE = "CertType";
    public static final String COMMON_CODE_CERT_TYPE_IPIN = "I";
    public static final String COMMON_CODE_CERT_TYPE_PHONE = "S";


    public static final int MODULE_ATTEND_CHECK_TOP_GRADE_VALUE = 1;

    public static final String GROUP_CODE_CLUB_FACILITY_TYPE = "ClubFacilityType";
    public static final String CLUB_FACILITY_TYPE_GOLF = "1";
    public static final String CLUB_FACILITY_TYPE_PRACTICE = "2";

    public static final String CLUB_EVENT_STATUS_ONGOING = "10";
    public static final String CLUB_EVENT_STATUS_CLOSE = "20";

    public static final String CLUB_APPLY_STATUS_APPLY = "10";
    public static final String CLUB_APPLY_STATUS_COMPLETE = "20";
    public static final String CLUB_APPLY_STATUS_CANCEL = "30";

    public static final int GOLF_PACKAGE_USE_YN = 1;
    public static final int GOLF_PACKAGE_CATEGORY_SHOW_YN_0 = 0;
    public static final int GOLF_PACKAGE_CATEGORY_SHOW_YN_1 = 1;
    public static final int GOLF_PACKAGE_PRODUCT_STATUS_ACTIVE = 1;
    public static final int GOLF_PACKAGE_PRODUCT_USE_YN = 1;
    public static final int GOLF_PACKAGE_OPTION_USE_YN = 1;

    public static final int GOLF_PACKAGE_RESERVE_STATUS_APPLY = 10;
    public static final int GOLF_PACKAGE_RESERVE_STATUS_COMPLETE = 20;
    public static final int GOLF_PACKAGE_RESERVE_STATUS_CLOSE = 30;
    public static final int GOLF_PACKAGE_RESERVE_STATUS_CANCEL = 40;

    public static final String PACKAGE_OPTION_STATUS_SUBSCRIBE = "10";
    public static final String PACKAGE_OPTION_STATUS_BOOKABLE = "20";
    public static final String PACKAGE_OPTION_STATUS_CLOSE = "30";
    public static final String PACKAGE_OPTION_STATUS_CANCELED = "40";
}
