export interface TrainingProgram {
  name: string;
  effectiveness: number; // percent
  employeesTrained: number;
  avgAssessmentScore: number;
}

export interface CompletionStats {
  completed: number;
  inProgress: number;
  notStarted: number;
}

export interface SkillImprovement {
  skill: string;
  before: number;
  after: number;
}
