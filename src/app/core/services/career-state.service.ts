import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CareerPlan, PromotionCriterion, RoadmapStage, SkillGap } from '../models/career.model';
import { StorageService } from './storage.service';
import {
  CURRENT_SKILL_LEVELS,
  DEFAULT_CAREER_PLAN,
  REQUIRED_SKILL_LEVELS_BY_TARGET,
  buildPromotionCriteriaTemplate,
  buildRoadmap
} from './career-data';

const CAREER_PLAN_KEY = 'careerPlan';
const PROMOTION_CRITERIA_KEY = 'promotionCriteria'; // Record<targetRole, PromotionCriterion[]>

@Injectable({ providedIn: 'root' })
export class CareerStateService {
  private readonly careerPlanSubject: BehaviorSubject<CareerPlan>;
  private readonly criteriaByRoleSubject: BehaviorSubject<Record<string, PromotionCriterion[]>>;

  readonly careerPlan$: Observable<CareerPlan>;
  readonly roadmap$: Observable<RoadmapStage[]>;
  readonly skillGaps$: Observable<SkillGap[]>;
  readonly promotionCriteria$: Observable<PromotionCriterion[]>;
  readonly promotionReadiness$: Observable<number>;

  constructor(private storage: StorageService) {
    const initialPlan = this.storage.get<CareerPlan>(CAREER_PLAN_KEY, DEFAULT_CAREER_PLAN);
    this.careerPlanSubject = new BehaviorSubject<CareerPlan>(initialPlan);
    this.careerPlan$ = this.careerPlanSubject.asObservable();

    const initialCriteriaMap = this.storage.get<Record<string, PromotionCriterion[]>>(
      PROMOTION_CRITERIA_KEY,
      {}
    );
    this.criteriaByRoleSubject = new BehaviorSubject(initialCriteriaMap);

    this.roadmap$ = this.careerPlan$.pipe(
      map((plan) => buildRoadmap(plan.currentRole, plan.targetRole))
    );

    this.skillGaps$ = this.careerPlan$.pipe(
      map((plan) => this.computeSkillGaps(plan.targetRole))
    );

    this.promotionCriteria$ = combineLatest([this.careerPlan$, this.criteriaByRoleSubject]).pipe(
      map(([plan, map_]) => this.resolveCriteriaFor(plan.targetRole, map_))
    );

    this.promotionReadiness$ = this.promotionCriteria$.pipe(
      map((criteria) => this.computeReadiness(criteria))
    );

    // Keep the plan's stored `progress` field (used on KPI cards / summaries)
    // in sync with the real, calculated skill-gap closure - never hand-edited.
    this.skillGaps$.subscribe((gaps) => this.syncProgressFromGaps(gaps));
  }

  private computeSkillGaps(targetRole: string): SkillGap[] {
    const required = REQUIRED_SKILL_LEVELS_BY_TARGET[targetRole] ?? {};
    return Object.keys(required).map((skill) => ({
      skill,
      current: CURRENT_SKILL_LEVELS[skill] ?? 0,
      required: required[skill]
    }));
  }

  private resolveCriteriaFor(
    targetRole: string,
    map_: Record<string, PromotionCriterion[]>
  ): PromotionCriterion[] {
    if (map_[targetRole]) {
      return map_[targetRole];
    }
    const template = buildPromotionCriteriaTemplate(targetRole);
    // Lazily persist the generated template so toggles have somewhere to land.
    const next = { ...map_, [targetRole]: template };
    queueMicrotask(() => this.criteriaByRoleSubject.next(next));
    return template;
  }

  private computeReadiness(criteria: PromotionCriterion[]): number {
    if (criteria.length === 0) {
      return 0;
    }
    const completed = criteria.filter((c) => c.completed).length;
    return Math.round((completed / criteria.length) * 100);
  }

  private syncProgressFromGaps(gaps: SkillGap[]): void {
    const plan = this.careerPlanSubject.value;
    if (gaps.length === 0) {
      return;
    }
    const ratios = gaps.map((g) => Math.min(g.current / g.required, 1));
    const progress = Math.round((ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100);
    if (progress !== plan.progress) {
      const updated = { ...plan, progress };
      this.careerPlanSubject.next(updated);
      this.storage.set(CAREER_PLAN_KEY, updated);
    }
  }

  updateCareerPlan(partial: Partial<CareerPlan>): void {
    const current = this.careerPlanSubject.value;
    const updated: CareerPlan = { ...current, ...partial };
    this.careerPlanSubject.next(updated);
    this.storage.set(CAREER_PLAN_KEY, updated);
  }

  toggleCriterion(id: string): void {
    const plan = this.careerPlanSubject.value;
    const map_ = this.criteriaByRoleSubject.value;
    const list = map_[plan.targetRole] ?? buildPromotionCriteriaTemplate(plan.targetRole);
    const updatedList = list.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c));
    const nextMap = { ...map_, [plan.targetRole]: updatedList };
    this.criteriaByRoleSubject.next(nextMap);
    this.storage.set(PROMOTION_CRITERIA_KEY, nextMap);
  }

  getCurrentPlan(): CareerPlan {
    return this.careerPlanSubject.value;
  }

  resetDemoData(): void {
    this.careerPlanSubject.next(DEFAULT_CAREER_PLAN);
    this.storage.set(CAREER_PLAN_KEY, DEFAULT_CAREER_PLAN);
    this.criteriaByRoleSubject.next({});
    this.storage.remove(PROMOTION_CRITERIA_KEY);
  }
}
