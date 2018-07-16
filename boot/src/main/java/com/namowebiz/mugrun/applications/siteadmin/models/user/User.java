package com.namowebiz.mugrun.applications.siteadmin.models.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by ngo.ty on 16/Feb/2016.
 */
@Getter
@Setter
@SuppressWarnings("PMD.UnusedPrivateField")
public class User extends BaseObject {
    @Getter @Setter
    private Long userNo;
    @Getter @Setter
    private String id;
    @Getter @Setter
    private String password;

    private Date passwordModDate;
    @Getter @Setter
    private String birthday;

    @Getter @Setter
    private String receiveTypes;

    @Getter @Setter
    private String name;
    @Getter @Setter
    private String nickname;
    @Getter @Setter
    private String userImage;
    @Getter @Setter
    private String email;
    @Getter @Setter
    private String tel;
    @Getter @Setter
    private String zipcode;
    @Getter @Setter
    private String address;
    @Getter @Setter
    private String subAddress;
    @Getter @Setter
    private String userStatus;
    @Getter @Setter
    private Boolean adminYn;
    @Getter @Setter
    private String certDi;
    @Getter @Setter
    private Integer passwordResetYn;
    @Getter @Setter
    private String verificationInfo;

    @Getter @Setter
    private String sex;
    @Getter @Setter
    private String socialId;
    @Getter @Setter
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date issueDate;
    @Getter @Setter
    private String issuePlace;
    @Getter @Setter
    private Boolean deleteYn;

    private Date lastAccessTime;
    public Date getLastAccessTime() {
        if (this.lastAccessTime != null) {
            return new Date(lastAccessTime.getTime());
        } else {
            return null;
        }
    }

    public void setLastAccessTime(Date value) {
        if (value != null) {
            this.lastAccessTime = new Date(value.getTime());
        } else {
            this.lastAccessTime = null;
        }
    }

    public Date getPasswordModDate() {
        if (this.passwordModDate != null) {
            return new Date(this.passwordModDate.getTime());
        } else {
            return null;
        }
    }

    public void setPasswordModDate(Date value) {
        if (value != null) {
            this.passwordModDate = new Date(value.getTime());
        } else {
            this.passwordModDate = null;
        }
    }

}
