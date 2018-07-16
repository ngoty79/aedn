package com.namowebiz.mugrun.applications.framework.configuration;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.services.authentication.AuthenticationUserService;
import com.namowebiz.mugrun.applications.framework.services.authentication.handlers.FailureHandler;
import com.namowebiz.mugrun.applications.framework.services.authentication.handlers.LogoutSuccessHandler;
import com.namowebiz.mugrun.applications.framework.services.authentication.handlers.RememberMeSuccessHandler;
import com.namowebiz.mugrun.applications.framework.services.authentication.handlers.SuccessHandler;
import com.namowebiz.mugrun.applications.framework.services.authentication.providers.MugrunAuthenticationProvider;
import com.namowebiz.mugrun.applications.framework.services.authentication.providers.WebAuthenticationDetailsSource;
import com.namowebiz.mugrun.applications.framework.services.authentication.strategies.MugrunInvalidSessionStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.session.SessionManagementFilter;


/**
 * @author shpark
 *	product 환경에서는 적절하게 수정해야 함 - 추후 profile에 따라 제어되도록 해야겠다.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    public static final String ADMIN_LOGIN_URL = "/admin/login";
    @Bean(name = "userSessionFilter")
    public SessionManagementFilter userSessionFilter(@Qualifier("userInvalidSessionStrategy") MugrunInvalidSessionStrategy invalidSessionStrategy) {
        SessionManagementFilter filter = new SessionManagementFilter(new HttpSessionSecurityContextRepository());
        filter.setInvalidSessionStrategy(invalidSessionStrategy);
        return filter;
    }

    @Bean(name = "adminSessionFilter")
    public SessionManagementFilter adminSessionFilter(@Qualifier("adminInvalidSessionStrategy") MugrunInvalidSessionStrategy invalidSessionStrategy) {
        SessionManagementFilter filter = new SessionManagementFilter(new HttpSessionSecurityContextRepository());
        filter.setInvalidSessionStrategy(invalidSessionStrategy);
        return filter;
    }

    @Bean(name = "userInvalidSessionStrategy")
    public MugrunInvalidSessionStrategy userInvalidSessionStrategy() {
        return new MugrunInvalidSessionStrategy(CommonConstants.USER_LOGIN_URL);
    }

    @Bean(name = "adminInvalidSessionStrategy")
    public MugrunInvalidSessionStrategy adminInvalidSessionStrategy() {
        return new MugrunInvalidSessionStrategy(CommonConstants.ADMIN_LOGIN_URL);
    }

    @Bean(name = "adminFailureHandler")
    public FailureHandler adminFailureHandler() {
        return new FailureHandler(CommonConstants.ADMIN_LOGIN_URL);
    }

    @Bean(name = "adminLogoutSuccessHandler")
    public LogoutSuccessHandler adminLogoutSuccessHandler() {
        return new LogoutSuccessHandler(CommonConstants.ADMIN_LOGIN_URL);
    }

    @Bean(name = "adminSuccessHandler")
    public SuccessHandler adminSuccessHandler() {
        return new SuccessHandler(CommonConstants.ADMIN_INDEX_URL);
    }

    @Bean(name = "userFailureHandler")
    public FailureHandler userFailureHandler() {
        return new FailureHandler(CommonConstants.USER_LOGIN_URL);
    }

    @Bean(name = "userLogoutSuccessHandler")
    public LogoutSuccessHandler userLogoutSuccessHandler() {
        return new LogoutSuccessHandler(CommonConstants.USER_INDEX_URL);
    }

    @Bean(name = "userSuccessHandler")
    public SuccessHandler userSuccessHandler() {
        return new SuccessHandler(CommonConstants.USER_INDEX_URL);
    }

    @Bean(name = "rememberMeSuccessHandler")
    public AuthenticationSuccessHandler rememberMeSuccessHandler() {
        return new RememberMeSuccessHandler(CommonConstants.USER_INDEX_URL);
    }

    @Bean(name = "adminRememberMeSuccessHandler")
    public AuthenticationSuccessHandler adminRememberMeSuccessHandler() {
        return new RememberMeSuccessHandler(CommonConstants.ADMIN_INDEX_URL);
    }

    @Configuration
    @Order(1)
    public static class AdminSecurityConfiguration extends WebSecurityConfigurerAdapter {
        public static final String ADMIN_REMEMBER_ME = "admin-remember-me";
        @Autowired
        @Qualifier("mugrunAuthenticationProvider")
        private MugrunAuthenticationProvider authenticationProvider;
        @Autowired
        private AuthenticationUserService authenticationUserService;
        @Autowired
        @Qualifier("adminSuccessHandler")
        private SuccessHandler successHandler;
        @Autowired
        @Qualifier("adminLogoutSuccessHandler")
        private LogoutSuccessHandler logoutSuccessHandler;
        @Autowired
        @Qualifier("adminFailureHandler")
        private FailureHandler failureHandler;
        @Autowired
        @Qualifier("adminSessionFilter")
        private SessionManagementFilter sessionFilter;
        @Autowired
        private WebAuthenticationDetailsSource detailsSource;
        @Autowired
        @Qualifier("adminRememberMeSuccessHandler")
        private AuthenticationSuccessHandler adminRememberMeSuccessHandler;

        @Override
        public void configure(AuthenticationManagerBuilder authenticationManagerBuilder)
                throws Exception {
            authenticationManagerBuilder.authenticationProvider(authenticationProvider);
        }

        @Override
        protected void configure(HttpSecurity httpSecurity) throws Exception {
            httpSecurity
                    .antMatcher("/admin/**")
                    .authorizeRequests()
                    .antMatchers("/admin/login").permitAll()
                    .antMatchers("/admin/logout").permitAll()
                    .antMatchers("/admin/**/*").hasAnyRole("ADMIN")
                    .and().formLogin()
                        .loginPage("/admin/login")
                        .loginProcessingUrl("/admin/login")
                        .usernameParameter("userId")
                        .passwordParameter("password")
                        .authenticationDetailsSource(detailsSource)
                        .successHandler(successHandler)
                        .failureHandler(failureHandler)
                    .and().logout()
                    .invalidateHttpSession(true)
                    .logoutUrl("/admin/logout")
                    .logoutSuccessHandler(logoutSuccessHandler)
                    .deleteCookies(ADMIN_REMEMBER_ME)
                    .and().rememberMe()
                    .rememberMeParameter(ADMIN_REMEMBER_ME)
                    .rememberMeCookieName(ADMIN_REMEMBER_ME)
                    .key("gh14SZARE6JKnpyaDEGYwyACTj7d8e4C3QbbBJ88")
                    .tokenValiditySeconds(1209600)
                    .userDetailsService(authenticationUserService)
                    .authenticationSuccessHandler(adminRememberMeSuccessHandler)
//                    .and().exceptionHandling().accessDeniedPage("/admin/login")
                    .and().addFilterBefore(sessionFilter, SessionManagementFilter.class);
            //In annotation configuration, the default http name for “remember me” check box is “remember-me”.

            httpSecurity.headers().disable();
//            httpSecurity.headers()
//                    .addHeaderWriter(new XFrameOptionsHeaderWriter(
//                            XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN));
        }
    }

    @Configuration
    @Order(2)
    public static class UserSecurityConfiguration extends WebSecurityConfigurerAdapter {
        @Autowired
        @Qualifier("mugrunAuthenticationProvider")
        private MugrunAuthenticationProvider authenticationProvider;
        @Autowired
        private WebAuthenticationDetailsSource webAuthenticationDetailsSource;
        @Autowired
        @Qualifier("userSuccessHandler")
        private SuccessHandler successHandler;
        @Autowired
        @Qualifier("userLogoutSuccessHandler")
        private LogoutSuccessHandler logoutSuccessHandler;
        @Autowired
        @Qualifier("userFailureHandler")
        private FailureHandler failureHandler;
        @Autowired
        @Qualifier("userSessionFilter")
        private SessionManagementFilter sessionFilter;

        @Autowired
        private AuthenticationUserService authenticationUserService;
        @Autowired
        @Qualifier("rememberMeSuccessHandler")
        private AuthenticationSuccessHandler rememberMeSuccessHandler;

        @Override
        protected void configure(HttpSecurity httpSecurity) throws Exception {
            httpSecurity
                    .antMatcher("/**/*")
                    .authorizeRequests()
                    .antMatchers("/assets/**/*").permitAll()
                    .antMatchers("/captcha/captcha.do").permitAll()
                    .antMatchers("/components/**/*").permitAll()
                    .antMatchers("/site/assets/**/*").permitAll()
                    .antMatchers("/site/**/*").permitAll()
                    .antMatchers("/instagram/login").permitAll()
                    .antMatchers("/messages/common/client/**/*").permitAll()
                    .antMatchers("/messages/siteadmin/client/**/*").permitAll()
                    .antMatchers("/messages/components/client/**/*").permitAll()
                    .antMatchers("/common/**/*").permitAll()
                    .antMatchers("/login").permitAll()
                    .antMatchers("/logout").permitAll()
                    .antMatchers("/index").permitAll()
                    .antMatchers("/storage/components/module/board/old/content_img/**/*").permitAll()//for old data

                    .antMatchers("/**/*").hasAnyRole("USER")
                    .and().formLogin()
                    .loginPage("/login")
                    .usernameParameter("userId")
                    .passwordParameter("password")
                    .loginProcessingUrl("/login")
                    .authenticationDetailsSource(webAuthenticationDetailsSource)
                    .successHandler(successHandler)
                    .failureHandler(failureHandler)
                    .and().logout()
                    .invalidateHttpSession(true)
                    .logoutUrl("/logout")
                    .logoutSuccessHandler(logoutSuccessHandler)
                    .deleteCookies("remember-me")
                    .and().rememberMe()
                    .key("gh14SZARE6JKnpyaDEGYwyACTj7d8e4C3QbbBJ88")
                    .tokenValiditySeconds(1209600)
                    .userDetailsService(authenticationUserService)
                    .authenticationSuccessHandler(rememberMeSuccessHandler)
//                    .and().exceptionHandling().accessDeniedPage("/login")
                    .and().addFilterBefore(sessionFilter, SessionManagementFilter.class);
            //In annotation configuration, the default http name for “remember me” check box is “remember-me”.

            httpSecurity.headers().disable();
            
            httpSecurity.csrf()
            		.ignoringAntMatchers("/site/module/shop/smilepay/*");
//            httpSecurity.headers()
//                    .addHeaderWriter(new XFrameOptionsHeaderWriter(
//                            XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN));
        }

        @Override
        public void configure(AuthenticationManagerBuilder authenticationManagerBuilder)
                throws Exception {
            authenticationManagerBuilder.authenticationProvider(authenticationProvider);
        }
    }
}