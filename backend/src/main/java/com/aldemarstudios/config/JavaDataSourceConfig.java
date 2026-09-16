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
            @Value("${DATABASE_URL:jdbc:mysql://localhost:3306/aldemar_studios_java?useSSL=true&requireSSL=false&serverTimezone=UTC}") String url,
            @Value("${DATABASE_USERNAME:root}") String username,
            @Value("${DATABASE_PASSWORD:}") String password) {

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
