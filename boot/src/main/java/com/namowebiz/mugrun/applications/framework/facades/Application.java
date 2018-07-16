package com.namowebiz.mugrun.applications.framework.facades;

import com.namowebiz.mugrun.applications.framework.configuration.ApplicationConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;

@Component
public class Application {
	
	@Autowired
	private ServletContext tServletContext;
	private static ServletContext servletContext;
	
	@Autowired
	private ApplicationConfiguration tConfiguration;
	private static ApplicationConfiguration configuration;
	
	@PostConstruct
    public void init() {
		Application.configuration = tConfiguration;
		Application.servletContext = tServletContext;
    }
	
	public static ApplicationConfiguration getConfiguration() {
		return configuration;
	}
	
	public static ServletContext getServletContext() {
		return servletContext;
	}
}
