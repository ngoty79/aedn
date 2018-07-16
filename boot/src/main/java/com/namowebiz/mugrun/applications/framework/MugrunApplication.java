package com.namowebiz.mugrun.applications.framework;

import com.namowebiz.mugrun.applications.framework.configuration.EmbeddedTomcatCustomizer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.velocity.VelocityAutoConfiguration;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAutoConfiguration(exclude = { VelocityAutoConfiguration.class,org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration.class })
@ComponentScan("com.namowebiz.mugrun")
public class MugrunApplication {

    public static void main(String[] args) {
        SpringApplication.run(MugrunApplication.class, args);
    }

    @Bean
    public EmbeddedServletContainerCustomizer containerCustomizer() {
        return new EmbeddedTomcatCustomizer();
    }

}
