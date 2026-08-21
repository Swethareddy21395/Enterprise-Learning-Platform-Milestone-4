import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CompletionStats, SkillImprovement, TrainingProgram } from '../models/training.model';

const PROGRAMS: TrainingProgram[] = [
  { name: 'Java Full Stack', effectiveness: 91, employeesTrained: 3120, avgAssessmentScore: 88 },
  { name: 'Spring Boot 4 Microservices', effectiveness: 89, employeesTrained: 2480, avgAssessmentScore: 86 },
  { name: 'Angular 20', effectiveness: 84, employeesTrained: 1975, avgAssessmentScore: 81 },
  { name: 'Cloud Fundamentals', effectiveness: 79, employeesTrained: 1540, avgAssessmentScore: 77 },
  { name: 'Leadership Essentials', effectiveness: 82, employeesTrained: 860, avgAssessmentScore: 80 },
  { name: 'DevOps & Kubernetes', effectiveness: 76, employeesTrained: 1120, avgAssessmentScore: 74 }
];

const COMPLETION: CompletionStats = { completed: 87, inProgress: 8, notStarted: 5 };

const SKILL_IMPROVEMENT: SkillImprovement[] = [
  { skill: 'Java Full Stack', before: 58, after: 88 },
  { skill: 'Spring Boot', before: 55, after: 86 },
  { skill: 'Angular', before: 50, after: 81 },
  { skill: 'Cloud Fundamentals', before: 42, after: 77 }
];

@Injectable({ providedIn: 'root' })
export class TrainingAnalyticsService {
  private readonly programsSubject = new BehaviorSubject<TrainingProgram[]>(PROGRAMS);
  private readonly completionSubject = new BehaviorSubject<CompletionStats>(COMPLETION);
  private readonly improvementSubject = new BehaviorSubject<SkillImprovement[]>(SKILL_IMPROVEMENT);

  readonly programs$ = this.programsSubject.asObservable();
  readonly completion$ = this.completionSubject.asObservable();
  readonly skillImprovement$ = this.improvementSubject.asObservable();

  getPrograms(): TrainingProgram[] {
    return this.programsSubject.value;
  }
}
