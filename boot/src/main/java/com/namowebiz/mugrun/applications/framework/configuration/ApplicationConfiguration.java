package com.namowebiz.mugrun.applications.framework.configuration;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix="mugrun")
@SuppressWarnings("PMD.UnusedPrivateField")
public class ApplicationConfiguration {
    @Getter @Setter
    private String siteId;
    @Getter @Setter
    private String siteWorkspace;
    @Getter @Setter
    private String storageBasePath;
    @Getter @Setter
    private String siteBasePath;
}
