import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job, JobApplicationRecord, JobFilters } from '../models/job.model';
import { StorageService } from './storage.service';
import { DEMO_JOBS, calculateMatchPercent, calculateSkillGaps } from './job-data';

const SAVED_JOBS_KEY = 'savedJobs';
const APPLICATIONS_KEY = 'jobApplications';

export const EMPTY_FILTERS: JobFilters = {
  search: '',
  department: '',
  location: '',
  experience: '',
  skill: '',
  jobType: ''
};

export interface JobWithMeta extends Job {
  matchPercent: number;
  skillGaps: string[];
}

@Injectable({ providedIn: 'root' })
export class JobStateService {
  private readonly jobsSubject = new BehaviorSubject<JobWithMeta[]>(
    DEMO_JOBS.map((job) => ({
      ...job,
      matchPercent: calculateMatchPercent(job),
      skillGaps: calculateSkillGaps(job)
    }))
  );
  private readonly filtersSubject = new BehaviorSubject<JobFilters>({ ...EMPTY_FILTERS });
  private readonly savedJobIdsSubject: BehaviorSubject<string[]>;
  private readonly applicationsSubject: BehaviorSubject<JobApplicationRecord[]>;

  readonly allJobs$ = this.jobsSubject.asObservable();
  readonly filters$ = this.filtersSubject.asObservable();
  readonly savedJobIds$: Observable<string[]>;
  readonly applications$: Observable<JobApplicationRecord[]>;
  readonly filteredJobs$: Observable<JobWithMeta[]>;
  readonly savedJobs$: Observable<JobWithMeta[]>;

  constructor(private storage: StorageService) {
    this.savedJobIdsSubject = new BehaviorSubject<string[]>(
      this.storage.get<string[]>(SAVED_JOBS_KEY, [])
    );
    this.applicationsSubject = new BehaviorSubject<JobApplicationRecord[]>(
      this.storage.get<JobApplicationRecord[]>(APPLICATIONS_KEY, [])
    );
    this.savedJobIds$ = this.savedJobIdsSubject.asObservable();
    this.applications$ = this.applicationsSubject.asObservable();

    this.filteredJobs$ = combineLatest([this.allJobs$, this.filters$]).pipe(
      map(([jobs, filters]) => this.applyFilters(jobs, filters))
    );

    this.savedJobs$ = combineLatest([this.allJobs$, this.savedJobIds$]).pipe(
      map(([jobs, savedIds]) => jobs.filter((j) => savedIds.includes(j.id)))
    );
  }

  private applyFilters(jobs: JobWithMeta[], filters: JobFilters): JobWithMeta[] {
    const search = filters.search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(search)) ||
        job.preferredSkills.some((s) => s.toLowerCase().includes(search));
      const matchesDept = !filters.department || job.department === filters.department;
      const matchesLocation = !filters.location || job.location === filters.location;
      const matchesExperience = !filters.experience || job.experience === filters.experience;
      const matchesSkill = !filters.skill || job.requiredSkills.includes(filters.skill);
      const matchesType = !filters.jobType || job.jobType === filters.jobType;
      return (
        matchesSearch && matchesDept && matchesLocation && matchesExperience && matchesSkill && matchesType
      );
    });
  }

  updateFilters(partial: Partial<JobFilters>): void {
    this.filtersSubject.next({ ...this.filtersSubject.value, ...partial });
  }

  clearFilters(): void {
    this.filtersSubject.next({ ...EMPTY_FILTERS });
  }

  getJobById(id: string): JobWithMeta | undefined {
    return this.jobsSubject.value.find((j) => j.id === id);
  }

  isSaved(jobId: string): boolean {
    return this.savedJobIdsSubject.value.includes(jobId);
  }

  toggleSaveJob(jobId: string): boolean {
    const current = this.savedJobIdsSubject.value;
    const isSaved = current.includes(jobId);
    const next = isSaved ? current.filter((id) => id !== jobId) : [...current, jobId];
    this.savedJobIdsSubject.next(next);
    this.storage.set(SAVED_JOBS_KEY, next);
    return !isSaved;
  }

  removeSavedJob(jobId: string): void {
    const next = this.savedJobIdsSubject.value.filter((id) => id !== jobId);
    this.savedJobIdsSubject.next(next);
    this.storage.set(SAVED_JOBS_KEY, next);
  }

  isApplied(jobId: string): boolean {
    return this.applicationsSubject.value.some((a) => a.jobId === jobId);
  }

  applyToJob(jobId: string): boolean {
    if (this.isApplied(jobId)) {
      return false; // duplicate application prevented
    }
    const record: JobApplicationRecord = { jobId, appliedDate: new Date().toISOString() };
    const next = [...this.applicationsSubject.value, record];
    this.applicationsSubject.next(next);
    this.storage.set(APPLICATIONS_KEY, next);
    return true;
  }

  resetDemoData(): void {
    this.savedJobIdsSubject.next([]);
    this.applicationsSubject.next([]);
    this.filtersSubject.next({ ...EMPTY_FILTERS });
    this.storage.remove(SAVED_JOBS_KEY);
    this.storage.remove(APPLICATIONS_KEY);
  }
}
