package com.namowebiz.mugrun.applications.siteadmin.models.customer;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang.StringUtils;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by asuspc on 9/14/2017.
 */
public class Customer extends BaseObject {
    @Getter @Setter
    private Long customerNo;
    @Getter @Setter
    private Long staffUserNo;
    @Getter @Setter
    private String name;
    @Getter @Setter
    private String customerCode;
    @Getter @Setter
    private String sex;
    @Getter @Setter
    private String phone;
    @Getter @Setter
    private String email;
    @Getter @Setter
    private String socialId;
    @Getter @Setter
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date issueDate;
    @Getter @Setter
    private String issuePlace;
    @Getter @Setter
    private String passportNo;
    @Getter @Setter
    private String address;
    @Getter @Setter
    private String subAddress;
    @Getter @Setter
    private String birthday;
    @Getter @Setter
    private String customerType;
    @Getter @Setter
    private String job;
    @Getter @Setter
    private Long provinceNo;
    @Getter @Setter
    private Long districtNo;
    @Getter @Setter
    private Long townNo;
    @Getter @Setter
    private Boolean deleteYn;
    @Getter @Setter
    private String staffUserName;
    @Getter @Setter
    private String provinceName;
    @Getter @Setter
    private String districtName;
    @Getter @Setter
    private String townName;

    public String getPhoneFormat(){
        if(!StringUtils.isEmpty(phone) && phone.length()>7){
            return phone.substring(0,4) + "-" + phone.substring(4,7) + "-" + phone.substring(7);
        }
        return phone;
    }
    public String getSocialIdFormat(){
        if(!StringUtils.isEmpty(socialId) && socialId.length()>7){
            return socialId.substring(0,3) + " " + socialId.substring(3,6) + " " + socialId.substring(6);
        }
        return phone;
    }



}
