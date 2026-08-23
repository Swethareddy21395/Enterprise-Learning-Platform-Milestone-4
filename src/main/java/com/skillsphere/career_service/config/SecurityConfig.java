package com.skillsphere.career_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(AbstractHttpConfigurer::disable) // POST रिक्वेस्ट को ब्लॉक होने से रोकेगा
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/**").permitAll() // आपके सभी एंडपॉइंट्स ओपन करेगा
        .anyRequest().authenticated()
      );

    return http.build();
  }
}
