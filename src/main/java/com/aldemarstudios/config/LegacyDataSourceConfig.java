package com.aldemarstudios.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class LegacyDataSourceConfig {

    @Bean(name = "legacyDataSource")
    public DataSource legacyDataSource(
            @Value("${DB_HOST}") String host,
            @Value("${DB_PORT}") String port,
            @Value("${DB_NAME}") String database,
            @Value("${DB_USER}") String username,
            @Value("${DB_PASSWORD}") String password) {

        String url = "jdbc:mysql://" + host + ":" + port + "/" + database
                + "?useSSL=true"
                + "&allowPublicKeyRetrieval=true"
                + "&serverTimezone=UTC"
                + "&connectTimeout=10000"
                + "&socketTimeout=10000";

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