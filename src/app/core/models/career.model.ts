export interface CareerPlan {
  employeeId: string;
  employeeName: string;
  currentRole: string;
  targetRole: string;
  careerGoal: string;
  mentor: string;
  targetDate: string;
  developmentPriority: string;
  notes: string;
  progress: number; // 0-100, derived
}

export type StageStatus = 'completed' | 'current' | 'upcoming';

export interface RoadmapStage {
  role: string;
  status: StageStatus;
  requiredSkills: string[];
  requiredCertifications: string[];
  requiredTraining: string[];
  experienceRequirement: string;
  promotionRequirements: string[];
}

export interface SkillGap {
  skill: string;
  current: number;
  required: number;
}

export interface PromotionCriterion {
  id: string;
  name: string;
  completed: boolean;
}
