package com.namowebiz.mugrun.applications.framework.configuration;

import com.namowebiz.mugrun.applications.framework.services.authentication.strategies.CookieHttpSessionStrategy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.MapSessionRepository;
import org.springframework.session.SessionRepository;
import org.springframework.session.config.annotation.web.http.EnableSpringHttpSession;
import org.springframework.session.config.annotation.web.http.SpringHttpSessionConfiguration;

/**
 * Created by BLACKJACK on 5/16/2016.
 */
@EnableSpringHttpSession
@Configuration
public class HttpSessionConfig {
    @Bean
    public SessionRepository sessionRepository(@Value("${server.sessionTimeout}") int sessionTimeout) {
        MapSessionRepository sessionRepository = new MapSessionRepository();
        sessionRepository.setDefaultMaxInactiveInterval(sessionTimeout);
        return sessionRepository;
    }

    @Bean
    public SpringHttpSessionConfiguration springHttpSessionConfiguration(CookieHttpSessionStrategy cookieHttpSessionStrategy) {
        SpringHttpSessionConfiguration springHttpSessionConfiguration = new SpringHttpSessionConfiguration();
        springHttpSessionConfiguration.setHttpSessionStrategy(cookieHttpSessionStrategy);
        return springHttpSessionConfiguration;
    }
}
