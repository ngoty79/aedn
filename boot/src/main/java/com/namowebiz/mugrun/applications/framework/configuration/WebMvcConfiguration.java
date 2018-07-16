package com.namowebiz.mugrun.applications.framework.configuration;

import com.namowebiz.mugrun.applications.framework.interceptors.UrlAccessInterceptor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.web.DispatcherServletAutoConfiguration;
import org.springframework.boot.autoconfigure.web.WebMvcAutoConfiguration;
import org.springframework.boot.context.embedded.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.CacheControl;
import org.springframework.ui.context.ThemeSource;
import org.springframework.ui.context.support.ResourceBundleThemeSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.resource.AppCacheManifestTransformer;
import org.springframework.web.servlet.resource.GzipResourceResolver;
import org.springframework.web.servlet.resource.ResourceUrlEncodingFilter;
import org.springframework.web.servlet.resource.VersionResourceResolver;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.SessionTrackingMode;
import java.util.Collections;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

@CommonsLog
@Configuration
@AutoConfigureAfter(DispatcherServletAutoConfiguration.class)
public class WebMvcConfiguration extends WebMvcAutoConfiguration.WebMvcAutoConfigurationAdapter {
    @Autowired
    private Environment env;
    @Autowired
    private ApplicationConfiguration applicationConfiguration;

    @Bean
    public ServletContextInitializer servletContextInitializer() {
        return new ServletContextInitializer() {
            @Override
            public void onStartup(ServletContext servletContext) throws ServletException {
                servletContext.setSessionTrackingModes(Collections.singleton(SessionTrackingMode.COOKIE));
            }
        };
    }

    @Bean
    public ResourceUrlEncodingFilter resourceUrlEncodingFilter() {
        return new ResourceUrlEncodingFilter();
    }

    @Bean
    public LocaleResolver localeResolver() {
        CookieLocaleResolver cookieLocaleResolver = new CookieLocaleResolver();
        cookieLocaleResolver.setDefaultLocale(Locale.ENGLISH);
        return cookieLocaleResolver;
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("lang");
        return localeChangeInterceptor;
    }



    @Bean
    public ThemeSource themeSource() {
        ResourceBundleThemeSource themeSource = new ResourceBundleThemeSource();
        themeSource.setBasenamePrefix("themes/");
        return themeSource;
    }

//    @Bean
//    public ThemeResolver themeResolver() {
//        RoleThemeResolver themeResolver = new RoleThemeResolver();
//        themeResolver.setDefaultThemeName("superAdmin");
//        return themeResolver;
//    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        boolean useResourceCache = true;
        CacheControl cacheControl = CacheControl.maxAge(7, TimeUnit.DAYS);

        //log.info("Mapping reqource: /assets/vendors/ -> classpath:/assets/vendors/");
        registry.addResourceHandler("/assets/vendors/**")
                .addResourceLocations("/assets/vendors/", "classpath:/assets/vendors/")
                .setCacheControl(cacheControl)
                .resourceChain(useResourceCache)
                .addResolver(new GzipResourceResolver())
                .addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"))
                .addTransformer(new AppCacheManifestTransformer());
        //log.info("Mapping reqource: /assets/applications/ -> classpath:/assets/applications/");
        registry.addResourceHandler("/assets/applications/**")
                .addResourceLocations("/assets/applications/", "classpath:/assets/applications/")
                .setCachePeriod(0)
                .resourceChain(false)
                .addResolver(new GzipResourceResolver())
                .addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"))
                .addTransformer(new AppCacheManifestTransformer());

        registry.addResourceHandler("/assets/components/**")
                .addResourceLocations("/assets/components/", "classpath:/assets/components/")
                .setCacheControl(cacheControl)
                .resourceChain(useResourceCache)
                .addResolver(new GzipResourceResolver())
                .addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"))
                .addTransformer(new AppCacheManifestTransformer());

        if (!registry.hasMappingForPattern("/assets/templates/**")) {
            registry.addResourceHandler("/assets/templates/**")
                    .addResourceLocations("/assets/templates/", "classpath:/assets/templates/")
                    .setCacheControl(cacheControl)
                    .resourceChain(useResourceCache)
                    .addResolver(new GzipResourceResolver())
                    .addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"))
                    .addTransformer(new AppCacheManifestTransformer());
        }
        if (!registry.hasMappingForPattern("/messages/common/client/**")) {
            registry.addResourceHandler("/messages/common/client/**")
                    .addResourceLocations("/messages/common/client/", "classpath:/messages/common/client/")
                    .setCacheControl(cacheControl)
                    .resourceChain(useResourceCache)
                    .addResolver(new GzipResourceResolver())
                    .addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"))
                    .addTransformer(new AppCacheManifestTransformer());
        }
        if (!registry.hasMappingForPattern("/messages/siteadmin/client/**")) {
            registry.addResourceHandler("/messages/siteadmin/client/**")
                    .addResourceLocations("/messages/siteadmin/client/", "classpath:/messages/siteadmin/client/")
                    .setCacheControl(cacheControl)
                    .resourceChain(useResourceCache)
                    .addResolver(new GzipResourceResolver())
                    .addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"))
                    .addTransformer(new AppCacheManifestTransformer());
        }
        if (!registry.hasMappingForPattern("/messages/components/client/**")) {
            registry.addResourceHandler("/messages/components/client/**")
                    .addResourceLocations("/messages/components/client/", "classpath:/messages/components/client/")
                    .setCacheControl(cacheControl)
                    .resourceChain(useResourceCache)
                    .addResolver(new GzipResourceResolver())
                    .addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"))
                    .addTransformer(new AppCacheManifestTransformer());
        }

        //Map url request for /site/assets/** to external resources at site base path
        if (!registry.hasMappingForPattern("/site/assets/**")) {
            String siteBasePath = applicationConfiguration.getSiteBasePath();
            if (siteBasePath.startsWith("/")) {
                siteBasePath = siteBasePath.substring(1); //we remove the / so that ResourceLocation "file:" can work
            }
            registry.addResourceHandler("/site/assets/**")
                    .addResourceLocations("file:/" + siteBasePath + "assets/")
                    .setCacheControl(cacheControl)
                    .resourceChain(useResourceCache)
                    .addResolver(new GzipResourceResolver())
                    .addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"))
                    .addTransformer(new AppCacheManifestTransformer());
        }

        //실제 request에서 호출되는 주소는 rewite.config에 매핑되어 있음
        log.info("Mapping reqource: /storage/ -> " + applicationConfiguration.getStorageBasePath());
        String storageBasePath = applicationConfiguration.getStorageBasePath();
        if (storageBasePath.startsWith("/")) {
            storageBasePath = storageBasePath.substring(1); //we remove the / so that ResourceLocation "file:" can work
        }
        registry.addResourceHandler("/storage/**")
                .addResourceLocations("/storage/", "file:/" + storageBasePath)
                .setCacheControl(cacheControl)
                .resourceChain(useResourceCache)
                .addResolver(new GzipResourceResolver())
                .addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"))
                .addTransformer(new AppCacheManifestTransformer());
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(urlAccessInterceptor());
        registry.addInterceptor(localeChangeInterceptor());
    }

    @Bean
    public UrlAccessInterceptor urlAccessInterceptor() {
        return new UrlAccessInterceptor();
    }
}