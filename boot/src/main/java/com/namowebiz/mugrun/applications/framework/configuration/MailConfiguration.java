package com.namowebiz.mugrun.applications.framework.configuration;

import lombok.extern.apachecommons.CommonsLog;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@CommonsLog
@Configuration
@MapperScan("com.namowebiz.mugrun")
public class MailConfiguration {

    @Value("${datasource.primary.platform}")
    private String primaryFlatform;
    @Value("${mail.host}")
    private String host;
    @Value("${mail.username}")
    private String username;
    @Value("${mail.password}")
    private String password;
    @Value("${mail.defaultEncoding}")
    private String defaultEncoding;
    @Value("${mail.smtp.auth}")
    private String auth;
    @Value("${mail.smtp.starttls.required}")
    private String starttlsRequired;
    @Value("${mail.smtp.starttls.enable}")
    private String starttlsEnable;
    @Value("${mail.smtp.socketFactory.class}")
    private String socketFactoryClass;
    @Value("${mail.smtp.socketFactory.fallback}")
    private String socketFactoryFallback;
    @Value("${mail.smtp.port}")
    private Integer port;
    @Value("${mail.smtp.socketFactory.port}")
    private String socketFactoryPort;


    @Bean
    public JavaMailSenderImpl javaMailSenderImpl(){
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setUsername(username);
        mailSender.setPassword(password);
        mailSender.setDefaultEncoding(defaultEncoding);
        Properties prop = mailSender.getJavaMailProperties();
        prop.put("mail.smtp.auth",auth);
        prop.put("mail.smtp.starttls.required",starttlsRequired);
        prop.put("mail.smtp.starttls.enable",starttlsEnable);
        prop.put("mail.smtp.socketFactory.class",socketFactoryClass);
        prop.put("mail.smtp.socketFactory.fallback",socketFactoryFallback);
        prop.put("mail.smtp.port",port);
        prop.put("mail.smtp.socketFactory.port",socketFactoryPort);

        return mailSender;
    }
}
