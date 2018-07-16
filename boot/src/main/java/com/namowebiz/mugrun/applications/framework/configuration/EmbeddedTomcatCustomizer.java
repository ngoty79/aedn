package com.namowebiz.mugrun.applications.framework.configuration;

import lombok.extern.apachecommons.CommonsLog;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.ErrorPage;
import org.springframework.http.HttpStatus;

@CommonsLog
public class EmbeddedTomcatCustomizer implements EmbeddedServletContainerCustomizer {
	@Override
    public void customize(ConfigurableEmbeddedServletContainer container) {
        ErrorPage error401Page = new ErrorPage(HttpStatus.UNAUTHORIZED, "/error/401");
        ErrorPage error403Page = new ErrorPage(HttpStatus.FORBIDDEN, "/error/403");
        ErrorPage error404Page = new ErrorPage(HttpStatus.NOT_FOUND, "/error/404");
        ErrorPage error500Page = new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/error/500");
        container.addErrorPages(error401Page, error403Page, error404Page, error500Page);
        container.setPersistSession(true);
    }
}
