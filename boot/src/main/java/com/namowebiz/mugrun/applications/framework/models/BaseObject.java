package com.namowebiz.mugrun.applications.framework.models;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * Created by ngo.ty on 2/19/2016.
 */
@SuppressWarnings("PMD.UnusedPrivateField")
public class BaseObject {
    private Date regDate;
    @Getter @Setter
    private Long regUserNo;
    private Date modDate;
    @Getter @Setter
    private Long modUserNo;

    public Date getRegDate() {
        if (this.regDate != null) {
            return new Date(this.regDate.getTime());
        } else {
            return null;
        }
    }

    public void setRegDate(Date value) {
        if (value != null) {
            this.regDate = new Date(value.getTime());
        } else {
            this.regDate = null;
        }
    }

    public Date getModDate() {
        if (this.modDate != null) {
            return new Date(this.modDate.getTime());
        } else {
            return null;
        }
    }

    public void setModDate(Date value) {
        if (value != null) {
            this.modDate = new Date(value.getTime());
        } else {
            this.modDate = null;
        }
    }

    @Getter @Setter
    public String regDateStr;

    @Getter @Setter
    public String modDateStr;
}
