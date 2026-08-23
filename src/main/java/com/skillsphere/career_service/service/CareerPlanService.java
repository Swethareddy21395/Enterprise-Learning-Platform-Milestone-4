package com.skillsphere.career_service.service;

import com.skillsphere.career_service.dto.CareerPlanDTO;
import java.util.List;

public interface CareerPlanService {
  CareerPlanDTO createCareerPlan(CareerPlanDTO dto);
  CareerPlanDTO getCareerPlanById(Long id);
  CareerPlanDTO getCareerPlanByEmployeeId(String employeeId);
  List<CareerPlanDTO> getAllCareerPlans();
  CareerPlanDTO updateProgress(Long id, Integer progress);
  // इन दो मेथड्स को इंटरफ़ेस के अंदर सबसे नीचे जोड़ें
  CareerPlanDTO getRoadmapAndGapAnalysis(String employeeId);
  List<String> getTrainingRecommendations(String employeeId);

}
// इन दो मेथड्स को इंटरफ़ेस के अंदर सबसे नीचे जोड़ें
