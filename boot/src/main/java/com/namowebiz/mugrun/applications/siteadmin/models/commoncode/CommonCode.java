package com.namowebiz.mugrun.applications.siteadmin.models.commoncode;

import lombok.Getter;
import lombok.Setter;

public class CommonCode {
	private String commonCode;
	private String groupCode;
	private String commonCodeName;
	@Setter @Getter
	private String commonCodeDesc;
	private String useYn;
	private String viewOrder;
	private String regDate;
	private String regUserNo;
	private String modDate;
	private String modUserNo;
	public String getCommonCode() {
		return commonCode;
	}
	public void setCommonCode(String commonCode) {
		this.commonCode = commonCode;
	}
	public String getGroupCode() {
		return groupCode;
	}
	public void setGroupCode(String groupCode) {
		this.groupCode = groupCode;
	}
	public String getCommonCodeName() {
		return commonCodeName;
	}
	public void setCommonCodeName(String commonCodeName) {
		this.commonCodeName = commonCodeName;
	}
	public String getUseYn() {
		return useYn;
	}
	public void setUseYn(String useYn) {
		this.useYn = useYn;
	}
	public String getViewOrder() {
		return viewOrder;
	}
	public void setViewOrder(String viewOrder) {
		this.viewOrder = viewOrder;
	}
	public String getRegDate() {
		return regDate;
	}
	public void setRegDate(String regDate) {
		this.regDate = regDate;
	}
	public String getRegUserNo() {
		return regUserNo;
	}
	public void setRegUserNo(String regUserNo) {
		this.regUserNo = regUserNo;
	}
	public String getModDate() {
		return modDate;
	}
	public void setModDate(String modDate) {
		this.modDate = modDate;
	}
	public String getModUserNo() {
		return modUserNo;
	}
	public void setModUserNo(String modUserNo) {
		this.modUserNo = modUserNo;
	}
	
	
}
