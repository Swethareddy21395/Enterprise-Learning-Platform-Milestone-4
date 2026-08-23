package com.skillsphere.career_service.controller;

import com.skillsphere.career_service.dto.CareerPlanDTO;
import com.skillsphere.career_service.service.CareerPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career/plans")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CareerPlanController {

  private final CareerPlanService service;

  @PostMapping
  public ResponseEntity<CareerPlanDTO> create(@Valid @RequestBody CareerPlanDTO dto) {
    return new ResponseEntity<>(service.createCareerPlan(dto), HttpStatus.CREATED);
  }

  @GetMapping
  public ResponseEntity<List<CareerPlanDTO>> getAll() {
    return ResponseEntity.ok(service.getAllCareerPlans());
  }

  @GetMapping("/{id}")
  public ResponseEntity<CareerPlanDTO> getById(@PathVariable Long id) {
    return ResponseEntity.ok(service.getCareerPlanById(id));
  }

  @GetMapping("/employee/{employeeId}")
  public ResponseEntity<CareerPlanDTO> getByEmployee(@PathVariable String employeeId) {
    return ResponseEntity.ok(service.getCareerPlanByEmployeeId(employeeId));
  }

  @PutMapping("/{id}/progress")
  public ResponseEntity<CareerPlanDTO> updateProgress(@PathVariable Long id, @RequestParam Integer progress) {
    return ResponseEntity.ok(service.updateProgress(id, progress));
  }
  // इन दो नए एंडपॉइंट्स को अपनी CareerPlanController क्लास में सबसे नीचे जोड़ दें

  @GetMapping("/employee/{employeeId}/roadmap")
  public ResponseEntity<com.skillsphere.career_service.dto.CareerPlanDTO> getRoadmap(@PathVariable String employeeId) {
    return ResponseEntity.ok(service.getRoadmapAndGapAnalysis(employeeId));
  }

  @GetMapping("/employee/{employeeId}/recommendations")
  public ResponseEntity<List<String>> getRecommendations(@PathVariable String employeeId) {
    return ResponseEntity.ok(service.getTrainingRecommendations(employeeId));
  }

}
