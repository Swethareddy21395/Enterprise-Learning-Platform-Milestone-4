export interface DashboardFilters {
  department: string;
  role: string;
  location: string;
  skill: string;
  timePeriod: string;
}

export interface DeptSkillCoverage {
  department: string;
  coverage: number;
}

export interface PromotionPipelineStage {
  label: string;
  count: number;
}

export interface WorkforceMetrics {
  employees: number;
  careerPlans: number;
  promotions: number;
  skillCoverage: number;
  certifications: number;
  courses: number;
  completion: number;
  renewal: number;
}
