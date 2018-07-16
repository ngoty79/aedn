package com.namowebiz.mugrun.applications.siteadmin.models.sitefile;

/**
 * 파일정보 Model
 * @author namo
 */
public class FileInfoBean {
	
	private String orgNm;
	private String realNm;
	private String rurl;
	private String name;
	private long size;
	private String ext;
	private String fileViewType;	//파일출력유형(N:일반,P:앨범,V:동영상)
	private String thumbFilepath;	//썸네일파일Path
	private String memo;
	private String altStr;
	private String bigFileType;
	private String avScale;
    private Long categoryNo;
	
	/**
	 * getName
	 * @return
	 */
	public String getName() {
		return name;
	}
	/**
	 * setName
	 * @param name
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * @return 원래 파일명
	 */
	public String getOrgNm() {
		return orgNm;
	}
	/**
	 * @param orgNm 원래 파일명
	 */
	public void setOrgNm(String orgNm) {
		this.orgNm = orgNm;
	}
	/**
	 * @return 저장된 파일명
	 */
	public String getRealNm() {
		return realNm;
	}
	/**
	 * @param realNm 저장된 파일명
	 */
	public void setRealNm(String realNm) {
		this.realNm = realNm;
	}
	/**
	 * @return 파일크기
	 */
	public long getSize() {
		return size;
	}
	/**
	 * @param size 파일크기
	 */
	public void setSize(long size) {
		this.size = size;
	}
	/**
	 * @return 확장자
	 */
	public String getExt() {
		return ext;
	}
	/**
	 * @param ext 확장자
	 */
	public void setExt(String ext) {
		this.ext = ext;
	}
	/**
	 * @return URL
	 */
	public String getRurl() {
		return rurl;
	}
	/**
	 * @param rurl URL
	 */
	public void setRurl(String rurl) {
		this.rurl = rurl;
	}
	public String getFileViewType() {
		return fileViewType;
	}
	public void setFileViewType(String fileViewType) {
		this.fileViewType = fileViewType;
	}
	public String getThumbFilepath() {
		return thumbFilepath;
	}
	public void setThumbFilepath(String thumbFilepath) {
		this.thumbFilepath = thumbFilepath;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public String getAltStr() {
		return altStr;
	}
	public void setAltStr(String altStr) {
		this.altStr = altStr;
	}
	public String getBigFileType() {
		return bigFileType;
	}
	public void setBigFileType(String bigFileType) {
		this.bigFileType = bigFileType;
	}
	public String getAvScale() {
		return avScale;
	}
	public void setAvScale(String avScale) {
		this.avScale = avScale;
	}

    public Long getCategoryNo() {
        return categoryNo;
    }

    public void setCategoryNo(Long categoryNo) {
        this.categoryNo = categoryNo;
    }
}
