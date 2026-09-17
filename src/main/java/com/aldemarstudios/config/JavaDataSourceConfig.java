package com.aldemarstudios.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class JavaDataSourceConfig {

    @Primary
    @Bean(name = "dataSource")
    public DataSource dataSource(
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

        dataSource.setMaximumPoolSize(10);
        dataSource.setMinimumIdle(2);
        dataSource.setPoolName("JavaPrimaryPool");

        return dataSource;
    }
}