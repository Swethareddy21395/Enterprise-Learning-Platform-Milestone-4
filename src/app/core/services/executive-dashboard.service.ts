import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DashboardFilters,
  DeptSkillCoverage,
  PromotionPipelineStage,
  WorkforceMetrics
} from '../models/dashboard.model';
import { StorageService } from './storage.service';

const FILTERS_KEY = 'dashboardFilters';

export const BASE_METRICS: WorkforceMetrics = {
  employees: 12400,
  careerPlans: 2847,
  promotions: 247,
  skillCoverage: 87,
  certifications: 8400,
  courses: 847,
  completion: 87,
  renewal: 94
};

const DEPT_COVERAGE: DeptSkillCoverage[] = [
  { department: 'Engineering', coverage: 92 },
  { department: 'Technology', coverage: 88 },
  { department: 'Cloud', coverage: 84 },
  { department: 'Data', coverage: 81 },
  { department: 'Security', coverage: 79 }
];

const TOP_SKILL_GAPS = ['Angular', 'Cloud Architecture', 'DevOps', 'System Design', 'Leadership'];

const PROMOTION_PIPELINE: PromotionPipelineStage[] = [
  { label: 'Ready', count: 312 },
  { label: 'Almost Ready', count: 540 },
  { label: 'Development Required', count: 1995 }
];

export const DEFAULT_DASHBOARD_FILTERS: DashboardFilters = {
  department: '',
  role: '',
  location: '',
  skill: '',
  timePeriod: 'This Quarter'
};

// Small, deliberately transparent multiplier so KPI values visibly react to
// the time-period filter without inventing fictitious business logic.
const TIME_PERIOD_MULTIPLIER: Record<string, number> = {
  'This Month': 0.34,
  'This Quarter': 1,
  'This Year': 3.9
};

@Injectable({ providedIn: 'root' })
export class ExecutiveDashboardService {
  private readonly filtersSubject: BehaviorSubject<DashboardFilters>;
  readonly filters$: Observable<DashboardFilters>;
  readonly departmentOptions = DEPT_COVERAGE.map((d) => d.department);
  readonly locationOptions = ['Hyderabad', 'Bengaluru', 'Pune', 'Chennai', 'Remote'];
  readonly roleOptions = ['Developer', 'Senior Developer', 'Tech Lead', 'Engineering Manager'];
  readonly skillOptions = TOP_SKILL_GAPS;
  readonly timePeriodOptions = Object.keys(TIME_PERIOD_MULTIPLIER);

  readonly filteredMetrics$: Observable<WorkforceMetrics>;
  readonly filteredDeptCoverage$: Observable<DeptSkillCoverage[]>;
  readonly filteredSkillGaps$: Observable<string[]>;
  readonly promotionPipeline$: Observable<PromotionPipelineStage[]>;

  constructor(private storage: StorageService) {
    const stored = this.storage.get<DashboardFilters>(FILTERS_KEY, DEFAULT_DASHBOARD_FILTERS);
    this.filtersSubject = new BehaviorSubject<DashboardFilters>(stored);
    this.filters$ = this.filtersSubject.asObservable();

    this.filteredMetrics$ = this.filters$.pipe(map((f) => this.computeMetrics(f)));
    this.filteredDeptCoverage$ = this.filters$.pipe(map((f) => this.computeDeptCoverage(f)));
    this.filteredSkillGaps$ = this.filters$.pipe(map((f) => this.computeSkillGaps(f)));
    this.promotionPipeline$ = this.filters$.pipe(map(() => PROMOTION_PIPELINE));
  }

  private computeMetrics(filters: DashboardFilters): WorkforceMetrics {
    const multiplier = TIME_PERIOD_MULTIPLIER[filters.timePeriod] ?? 1;
    const deptFactor = filters.department ? 1 / DEPT_COVERAGE.length : 1;
    return {
      employees: Math.round(BASE_METRICS.employees * deptFactor),
      careerPlans: Math.round(BASE_METRICS.careerPlans * deptFactor),
      promotions: Math.max(1, Math.round(BASE_METRICS.promotions * multiplier * deptFactor)),
      skillCoverage: filters.department
        ? DEPT_COVERAGE.find((d) => d.department === filters.department)?.coverage ??
          BASE_METRICS.skillCoverage
        : BASE_METRICS.skillCoverage,
      certifications: Math.round(BASE_METRICS.certifications * deptFactor),
      courses: BASE_METRICS.courses,
      completion: BASE_METRICS.completion,
      renewal: BASE_METRICS.renewal
    };
  }

  private computeDeptCoverage(filters: DashboardFilters): DeptSkillCoverage[] {
    if (!filters.department) {
      return DEPT_COVERAGE;
    }
    return DEPT_COVERAGE.filter((d) => d.department === filters.department);
  }

  private computeSkillGaps(filters: DashboardFilters): string[] {
    if (!filters.skill) {
      return TOP_SKILL_GAPS;
    }
    return TOP_SKILL_GAPS.filter((s) => s === filters.skill);
  }

  updateFilters(partial: Partial<DashboardFilters>): void {
    const next = { ...this.filtersSubject.value, ...partial };
    this.filtersSubject.next(next);
    this.storage.set(FILTERS_KEY, next);
  }

  clearFilters(): void {
    this.filtersSubject.next({ ...DEFAULT_DASHBOARD_FILTERS });
    this.storage.set(FILTERS_KEY, DEFAULT_DASHBOARD_FILTERS);
  }

  resetDemoData(): void {
    this.clearFilters();
  }
}
