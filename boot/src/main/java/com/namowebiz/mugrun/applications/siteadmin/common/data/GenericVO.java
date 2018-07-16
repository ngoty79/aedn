package com.namowebiz.mugrun.applications.siteadmin.common.data;

import java.io.Serializable;
import java.util.Date;

public class GenericVO implements Serializable {
	
    private static final long serialVersionUID = 1L;
    //@IndexField
    private Date regDate;
	private Long regUserNo;
	private Long modUserNo;
	//@IndexField
	private Date modDate;
	
	private String baseScheme;

	public Date getRegDate() {
		return regDate;
	}

	public void setRegDate(Date regDate) {
		this.regDate = regDate;
	}

	public Long getRegUserNo() {
		return regUserNo;
	}

	public void setRegUserNo(Long regUserNo) {
		this.regUserNo = regUserNo;
	}

	public Long getModUserNo() {
		return modUserNo;
	}

	public void setModUserNo(Long modUserNo) {
		this.modUserNo = modUserNo;
	}

	public Date getModDate() {
		return modDate;
	}

	public void setModDate(Date modDate) {
		this.modDate = modDate;
	}

	public String getBaseScheme() {
		return baseScheme;
	}

	public void setBaseScheme(String baseScheme) {
		this.baseScheme = baseScheme;
	}

}
