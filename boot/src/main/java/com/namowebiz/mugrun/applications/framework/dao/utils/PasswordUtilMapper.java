package com.namowebiz.mugrun.applications.framework.dao.utils;

import org.springframework.stereotype.Component;

@Component
public interface PasswordUtilMapper {
	String getMysqlPasswordValue(String rawPassword);
}
