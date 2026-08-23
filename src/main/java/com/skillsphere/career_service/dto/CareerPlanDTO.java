package com.skillsphere.career_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CareerPlanDTO {
  private Long id;

  @NotBlank(message = "Employee ID is mandatory")
  private String employeeId;

  @NotBlank(message = "Current role is required")
  private String currentRole;

  @NotBlank(message = "Target role is required")
  private String targetRole;

  private Integer progress;
  private String mentor;
  private String status;
}
