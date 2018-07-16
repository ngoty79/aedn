package com.namowebiz.mugrun.applications.siteadmin.models.sitefile;

import java.io.Serializable;

public class SiteFileVO implements Serializable {
	private static final long serialVersionUID = 20101101214100001L;
	
	private Long[] arrFileNo;
	private String filePath;
	private String newFilePath;
	private String fileName;
	private String siteId;
	private String fileUseType;
	private Long fileUseRefNo;
	private String fileViewType;
	private Long bdConfigNo;
	private Long bdContentNo;
	private String memo;
	private String bigFileType;		//대용량파일유형
	private String fileAltTag;		//대체문자열
	private Long fileDelYn;			//관리자삭제여부
	private Long regUserNo;
	
	private String originalFileName;
	
	
	
	public String getOriginalFileName() {
		return originalFileName;
	}
	public void setOriginalFileName(String originalFileName) {
		this.originalFileName = originalFileName;
	}
	public Long[] getArrFileNo() {
		return arrFileNo;
	}
	public void setArrFileNo(Long[] arrFileNo) {
		this.arrFileNo = arrFileNo;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getNewFilePath() {
		return newFilePath;
	}
	public void setNewFilePath(String newFilePath) {
		this.newFilePath = newFilePath;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getSiteId() {
		return siteId;
	}
	public void setSiteId(String siteId) {
		this.siteId = siteId;
	}
	public String getFileUseType() {
		return fileUseType;
	}
	public void setFileUseType(String fileUseType) {
		this.fileUseType = fileUseType;
	}
	public Long getFileUseRefNo() {
		return fileUseRefNo;
	}
	public void setFileUseRefNo(Long fileUseRefNo) {
		this.fileUseRefNo = fileUseRefNo;
	}
	public String getFileViewType() {
		return fileViewType;
	}
	public void setFileViewType(String fileViewType) {
		this.fileViewType = fileViewType;
	}
	public Long getBdConfigNo() {
		return bdConfigNo;
	}
	public void setBdConfigNo(Long bdConfigNo) {
		this.bdConfigNo = bdConfigNo;
	}
	public Long getBdContentNo() {
		return bdContentNo;
	}
	public void setBdContentNo(Long bdContentNo) {
		this.bdContentNo = bdContentNo;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public String getBigFileYn() {
		return bigFileType;
	}
	public void setBigFileYn(String bigFileType) {
		this.bigFileType = bigFileType;
	}
	public String getFileAltTag() {
		return fileAltTag;
	}
	public void setFileAltTag(String fileAltTag) {
		this.fileAltTag = fileAltTag;
	}
	public Long getFileDelYn() {
		return fileDelYn;
	}
	public void setFileDelYn(Long fileDelYn) {
		this.fileDelYn = fileDelYn;
	}
	public Long getRegUserNo() {
		return regUserNo;
	}
	public void setRegUserNo(Long regUserNo) {
		this.regUserNo = regUserNo;
	}
	
}
