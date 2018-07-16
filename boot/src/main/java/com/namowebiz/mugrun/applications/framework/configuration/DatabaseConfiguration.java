package com.namowebiz.mugrun.applications.framework.configuration;

import lombok.extern.apachecommons.CommonsLog;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@CommonsLog
@Configuration
@EnableTransactionManagement
@MapperScan("com.namowebiz.mugrun")
public class DatabaseConfiguration {

    @Value("${datasource.primary.platform}")
    private String primaryFlatform;

    @Bean
    @Primary
    @ConfigurationProperties(prefix="datasource.primary")
    public DataSource primaryDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    @ConfigurationProperties(prefix="datasource.primary")
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        log.info(primaryFlatform);
        final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        sessionFactory.setConfigLocation(
                new PathMatchingResourcePatternResolver()
                        .getResource("classpath:config/mybatis-config.xml"));
        Resource[] mapperLocations = new PathMatchingResourcePatternResolver()
                .getResources("classpath*:com/**/sqlmap/" + primaryFlatform + "/**/*.xml");
        sessionFactory.setMapperLocations(mapperLocations);
        return sessionFactory.getObject();
    }

    @Bean
    public SqlSessionTemplate sqlSessionForMyBatis(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
