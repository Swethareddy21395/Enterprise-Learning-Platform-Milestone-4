package com.skillsphere.career_service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CareerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CareerServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner demoData(com.skillsphere.career_service.repository.CareerPlanRepository repository) {
		return args -> {
			if (repository.findByEmployeeId("EMP101").isEmpty()) {
				com.skillsphere.career_service.entity.CareerPlan plan = com.skillsphere.career_service.entity.CareerPlan.builder()
					.employeeId("EMP101")
					.currentRole("Developer")
					.targetRole("Tech Lead")
					.mentor("Jane Doe")
					.progress(67)
					.status("IN_PROGRESS")
					.build();
				repository.save(plan);
				System.out.println("Seeded default career plan for EMP101! 🎉");
			}
		};
	}
}
