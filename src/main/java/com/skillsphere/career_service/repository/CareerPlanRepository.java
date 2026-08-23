package com.skillsphere.career_service.repository;

import com.skillsphere.career_service.entity.CareerPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CareerPlanRepository extends JpaRepository<CareerPlan, Long> {
  Optional<CareerPlan> findByEmployeeId(String employeeId);
  Optional<CareerPlan> findByTargetRole(String targetRole);
}
