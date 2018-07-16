package com.namowebiz.mugrun.applications.framework.configuration;

import com.google.common.collect.Sets;
import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.core.thymeleaf.dialect.MugrunDialect;
import nz.net.ultraq.thymeleaf.LayoutDialect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.spring4.SpringTemplateEngine;
import org.thymeleaf.spring4.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.spring4.view.ThymeleafViewResolver;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.FileTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

//import org.codehaus.jackson.map.ObjectMapper;

/**
 * Created by ngo.ty on 6/21/2016.
 */

@Configuration
@EnableWebMvc
@EnableConfigurationProperties(ThymeleafProperties.class)
public class ThymeleafConfiguration extends WebMvcConfigurerAdapter implements ApplicationContextAware {
    private ApplicationContext applicationContext;

    @Autowired
    ThymeleafProperties properties;
    @Autowired
    private ApplicationConfiguration applicationConfiguration;

    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Bean
    public ViewResolver viewResolver() {
        ThymeleafViewResolver resolver = new ThymeleafViewResolver();
        resolver.setTemplateEngine(templateEngine());
        resolver.setCharacterEncoding(CommonConstants.ENCODING_UTF_8);
        resolver.setOrder(1);
        return resolver;
    }

    @Bean
    public TemplateEngine templateEngine() {
        SpringTemplateEngine engine = new SpringTemplateEngine();
        engine.setTemplateResolvers(Sets.newHashSet(templateResolver(), externalTemplateResolver()));
        engine.addDialect(new LayoutDialect());
        engine.addDialect(new MugrunDialect());
        engine.setEnableSpringELCompiler(true);
        return engine;
    }

    private ITemplateResolver templateResolver() {
        SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
        resolver.setCheckExistence(true);
        resolver.setApplicationContext(applicationContext);
        resolver.setPrefix(properties.getPrefix());
        resolver.setSuffix(properties.getSuffix());
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding(CommonConstants.ENCODING_UTF_8);
        resolver.setCacheable(properties.isCache());
        resolver.setOrder(1);
        return resolver;
    }

    private ITemplateResolver externalTemplateResolver() {
        FileTemplateResolver resolver = new FileTemplateResolver();
        resolver.setCheckExistence(true);
        resolver.setPrefix(applicationConfiguration.getSiteBasePath());
        resolver.setSuffix(properties.getSuffix());
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding(CommonConstants.ENCODING_UTF_8);
        resolver.setCacheable(properties.isCache());
        resolver.setOrder(2);
        return resolver;
    }

//    @Bean
//    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
//        MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter();
//        mappingJackson2HttpMessageConverter.setObjectMapper(objectMapper());
//        return mappingJackson2HttpMessageConverter;
//    }
//
//    @Bean
//    public ObjectMapper objectMapper() {
//        ObjectMapper objMapper = new ObjectMapper();
//        objMapper.enable(SerializationFeature.INDENT_OUTPUT);
//        return objMapper;
//    }
//
//    @Override
//    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
//        super.configureMessageConverters(converters);
//        converters.add(mappingJackson2HttpMessageConverter());
//    }

}
