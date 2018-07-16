package com.namowebiz.mugrun.applications.framework.common.utils;

public class TripleDesTool {
	
	public String encrypt(String value) {
		return TripleDES.encrypt(value);
	}

}
