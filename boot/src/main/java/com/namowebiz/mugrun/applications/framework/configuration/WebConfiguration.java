package com.namowebiz.mugrun.applications.framework.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.authentication.AuthenticationTrustResolverImpl;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;

@Configuration
@ImportResource("classpath:config/captcha-context.xml")
public class WebConfiguration {
    @Value("${spring.messages.basename}")
    private String baseNames;
    @Value("${spring.messages.encoding}")
    private String messageEncoding;
    @Value("${spring.messages.cache-seconds}")
    private Integer cacheSeconds;

    @Bean(name = "authenticationTrustResolverImpl")
    public AuthenticationTrustResolver authenticationTrustResolverImpl() {
        return new AuthenticationTrustResolverImpl();
    }

    @Bean(name = "sha256Encoder")
    public ShaPasswordEncoder sha256Encoder() {
        ShaPasswordEncoder shaPasswordEncoder = new ShaPasswordEncoder(256);
        return shaPasswordEncoder;
    }

    @Bean
    public ReloadableResourceBundleMessageSource messageSource(){
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames(getMessageBaseNames());
        messageSource.setDefaultEncoding(messageEncoding);
        messageSource.setCacheSeconds(cacheSeconds == null? 0: cacheSeconds);
        return messageSource;
    }

    private String[] getMessageBaseNames(){
        String[] values = baseNames.split(",");
        String[] baseNames = new String[values.length];
        for (int i = 0; i < values.length; i++) {
            baseNames[i] = "classpath:" + values[i].trim();
        }
        return baseNames;
    }

}
