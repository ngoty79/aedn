package com.namowebiz.mugrun.applications.siteadmin.models.sitefile;

import java.io.Serializable;
import java.util.Date;

/**
 * 사이트 파일 Model
 * @author jipark
 * @since 2.6
 */
public class SiteFile implements Serializable{
	private static final long serialVersionUID = 20101101210200001L;
	
	private Long siteFileNo;			//사이트 파일일련번호
	private String fileUseType;			//파일사용구분
	private String filePath;			//파일경로 (파일경로+파일명)
	private Long fileSize;				//파일크기
	private String originalFileName;		//원본파일명
	private String fileViewType;			//파일출력유형 (F:일반,P:사진,V:동영상)
	private String fileExtType;			//파일확장자구분
	private Long downloadCnt;			//파일다운로드횟수
	private String fileAltTag;			//HTML ALT TAG
	private String thumbnailFilePath;		//미리보기 파일경로
	private String bigFileType;			//대용량파일유형(N:일반,B:대용량)
	private Date bigFileStartDate;			//대용량파일 시작일시
	private Date bigFileEndDate;			//대용량파일 종료일시
	private String avPlayerType;			//동영상플레이어구분
	private String avSubtitles;			//동영상자막
	private String memo;				//메모
	private Long fileDelYn;				//관리자파일삭제여부
	private String fileDelDescs;			//관리자파일 삭제메모
	private Long bdConfigNo;			//게시판설정번호
	private Long bdContentNo;			//게시물번호
	private Date regDate;				//등록일자
	private Long regUserNo;				//등록자일련번호
	private Date modDate;				//수정일자
	private Long modUserNo;				//수정자일련번호
	private String strStartDate;
	private String strEndDate;
	private String strRegDate;
	private String strModDate;
	
	public Long getSiteFileNo() {
		return siteFileNo;
	}
	public void setSiteFileNo(Long siteFileNo) {
		this.siteFileNo = siteFileNo;
	}
	public String getFileUseType() {
		return fileUseType;
	}
	public void setFileUseType(String fileUseType) {
		this.fileUseType = fileUseType;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public Long getFileSize() {
		return fileSize;
	}
	public void setFileSize(Long fileSize) {
		this.fileSize = fileSize;
	}
	public String getOriginalFileName() {
		return originalFileName;
	}
	public void setOriginalFileName(String originalFileName) {
		this.originalFileName = originalFileName;
	}
	public String getFileViewType() {
		return fileViewType;
	}
	public void setFileViewType(String fileViewType) {
		this.fileViewType = fileViewType;
	}
	public String getFileExtType() {
		return fileExtType;
	}
	public void setFileExtType(String fileExtType) {
		this.fileExtType = fileExtType;
	}
	public Long getDownloadCnt() {
		return downloadCnt;
	}
	public void setDownloadCnt(Long downloadCnt) {
		this.downloadCnt = downloadCnt;
	}
	public String getFileAltTag() {
		return fileAltTag;
	}
	public void setFileAltTag(String fileAltTag) {
		this.fileAltTag = fileAltTag;
	}
	public String getThumbnailFilePath() {
		return thumbnailFilePath;
	}
	public void setThumbnailFilePath(String thumbnailFilePath) {
		this.thumbnailFilePath = thumbnailFilePath;
	}
	public String getBigFileType() {
		return bigFileType;
	}
	public void setBigFileType(String bigFileType) {
		this.bigFileType = bigFileType;
	}
	public Date getBigFileStartDate() {
		return bigFileStartDate;
	}
	public void setBigFileStartDate(Date bigFileStartDate) {
		this.bigFileStartDate = bigFileStartDate;
	}
	public Date getBigFileEndDate() {
		return bigFileEndDate;
	}
	public void setBigFileEndDate(Date bigFileEndDate) {
		this.bigFileEndDate = bigFileEndDate;
	}
	public String getAvPlayerType() {
		return avPlayerType;
	}
	public void setAvPlayerType(String avPlayerType) {
		this.avPlayerType = avPlayerType;
	}
	public String getAvSubtitles() {
		return avSubtitles;
	}
	public void setAvSubtitles(String avSubtitles) {
		this.avSubtitles = avSubtitles;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public Long getFileDelYn() {
		return fileDelYn;
	}
	public void setFileDelYn(Long fileDelYn) {
		this.fileDelYn = fileDelYn;
	}
	public String getFileDelDescs() {
		return fileDelDescs;
	}
	public void setFileDelDescs(String fileDelDescs) {
		this.fileDelDescs = fileDelDescs;
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
	public Date getModDate() {
		return modDate;
	}
	public void setModDate(Date modDate) {
		this.modDate = modDate;
	}
	public Long getModUserNo() {
		return modUserNo;
	}
	public void setModUserNo(Long modUserNo) {
		this.modUserNo = modUserNo;
	}
	public String getStrStartDate() {
		return strStartDate;
	}
	public void setStrStartDate(String strStartDate) {
		this.strStartDate = strStartDate;
	}
	public String getStrEndDate() {
		return strEndDate;
	}
	public void setStrEndDate(String strEndDate) {
		this.strEndDate = strEndDate;
	}
	public String getStrRegDate() {
		return strRegDate;
	}
	public void setStrRegDate(String strRegDate) {
		this.strRegDate = strRegDate;
	}
	public String getStrModDate() {
		return strModDate;
	}
	public void setStrModDate(String strModDate) {
		this.strModDate = strModDate;
	}

	public boolean isImageFile(){
		if("png".equalsIgnoreCase(getFileExtType())
				|| "gif".equalsIgnoreCase(getFileExtType())
				|| "tif".equalsIgnoreCase(getFileExtType())
				|| "bmp".equalsIgnoreCase(getFileExtType())
				|| "jpg".equalsIgnoreCase(getFileExtType())){
			return true;
		}
		return false;
	}
	
}
