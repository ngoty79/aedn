package com.namowebiz.mugrun.applications.siteadmin.models.zipcode;


import org.h2.util.StringUtils;

public class Zipcode implements java.io.Serializable {
	private static final long serialVersionUID = 190875398L;

	private String zipcode;
	private String sido;
	private String gugun;
	private String dong;
	private String ri;
	private String stBunji;
	private String edBunji;
	
	public String getZipcode() {
		return zipcode;
	}
	public void setZipcode(String zipcode) {
		this.zipcode = zipcode;
	}
	public String getSido() {
		return sido;
	}
	public void setSido(String sido) {
		this.sido = sido;
	}
	public String getGugun() {
		return gugun;
	}
	public void setGugun(String gugun) {
		this.gugun = gugun;
	}
	public String getDong() {
		return dong;
	}
	public void setDong(String dong) {
		this.dong = dong;
	}
	public String getRi() {
		return ri;
	}
	public void setRi(String ri) {
		this.ri = ri;
	}
	public String getStBunji() {
		return stBunji;
	}
	public void setStBunji(String stBunji) {
		this.stBunji = stBunji;
	}
	public String getEdBunji() {
		return edBunji;
	}
	public void setEdBunji(String edBunji) {
		this.edBunji = edBunji;
	}
	
	public String getFieldValue(){
		String value = "";
		value = String.format("%s;%s", zipcode, getDisplayAddress());
		return value;
	}
	
	public String getFieldDisplay(){
		String value = "";
		value = String.format("[%s] %s", zipcode, getDisplayAddress());
		return value;
	}

    public String getDisplayZipcode(){
        if(!StringUtils.isNullOrEmpty(zipcode) && zipcode.length()>=6){
            return zipcode.substring(0, 3) + "-"+zipcode.substring(3, zipcode.length());
        }
        return zipcode;
    }
	
	public String getDisplayAddress(){
		String value = "";
		if("null".equals(ri)||ri==null){
			ri = "";
		}
		value = sido + " " + gugun + " " + dong + " " + ri ;
		
		if(!StringUtils.isNullOrEmpty(stBunji)){
			value = value + " " + stBunji;
			if(!StringUtils.isNullOrEmpty(edBunji) && !"0".equals(edBunji) && edBunji.trim().length()>0){
				value = value + "-" + edBunji;
			}
		}
		return value;
	}
	
}
