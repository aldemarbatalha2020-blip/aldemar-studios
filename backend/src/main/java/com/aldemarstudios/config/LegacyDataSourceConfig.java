package com.aldemarstudios.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class LegacyDataSourceConfig {

    @Bean(name = "legacyDataSource")
    public DataSource legacyDataSource(
            @Value("${LEGACY_DATABASE_URL:jdbc:mysql://localhost:3306/aldemar_studios?useSSL=true&requireSSL=false&serverTimezone=UTC}") String url,
            @Value("${LEGACY_DATABASE_USERNAME:${DATABASE_USERNAME:root}}") String username,
            @Value("${LEGACY_DATABASE_PASSWORD:${DATABASE_PASSWORD:}}") String password) {

        HikariDataSource dataSource = new HikariDataSource();

        dataSource.setJdbcUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);

        dataSource.setReadOnly(true);
        dataSource.setMaximumPoolSize(3);
        dataSource.setMinimumIdle(1);
        dataSource.setPoolName("LegacyReadOnlyPool");

        return dataSource;
    }

    @Bean(name = "legacyJdbcTemplate")
    public JdbcTemplate legacyJdbcTemplate(
            @Qualifier("legacyDataSource") DataSource legacyDataSource) {

        return new JdbcTemplate(legacyDataSource);
    }
}

