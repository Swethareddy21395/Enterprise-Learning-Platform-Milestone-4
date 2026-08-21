import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, startWith } from 'rxjs/operators';
import { JobStateService } from '../../core/services/job-state.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-internal-jobs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './internal-jobs.html',
  styleUrl: './internal-jobs.scss'
})
export class InternalJobsComponent {
  private fb = inject(FormBuilder);
  private jobState = inject(JobStateService);
  private notifications = inject(NotificationService);

  filteredJobs$ = this.jobState.filteredJobs$;
  allJobs$ = this.jobState.allJobs$;

  departmentOptions = ['Engineering', 'Technology', 'Cloud', 'Data', 'Security'];
  locationOptions = ['Hyderabad', 'Bengaluru', 'Pune', 'Chennai', 'Remote'];
  experienceOptions = ['0-2 years', '2-4 years', '4-6 years', '6+ years'];
  skillOptions = ['Java', 'Angular', 'Spring Boot', 'Cloud Architecture', 'DevOps', 'Leadership', 'Kafka'];
  jobTypeOptions = ['Full-time', 'Contract', 'Internal Transfer'];

  filterForm = this.fb.group({
    search: [''],
    department: [''],
    location: [''],
    experience: [''],
    skill: [''],
    jobType: ['']
  });

  constructor() {
    this.filterForm.valueChanges.pipe(debounceTime(150), startWith(this.filterForm.value)).subscribe((v) => {
      this.jobState.updateFilters({
        search: v.search ?? '',
        department: v.department ?? '',
        location: v.location ?? '',
        experience: v.experience ?? '',
        skill: v.skill ?? '',
        jobType: v.jobType ?? ''
      });
    });
  }

  clearFilters(): void {
    this.filterForm.reset({ search: '', department: '', location: '', experience: '', skill: '', jobType: '' });
    this.jobState.clearFilters();
    this.notifications.info('Filters cleared.');
  }

  isSaved(jobId: string): boolean {
    return this.jobState.isSaved(jobId);
  }

  isApplied(jobId: string): boolean {
    return this.jobState.isApplied(jobId);
  }

  toggleSave(jobId: string, title: string): void {
    const nowSaved = this.jobState.toggleSaveJob(jobId);
    this.notifications.success(nowSaved ? `Saved "${title}" to Saved Jobs.` : `Removed "${title}" from Saved Jobs.`);
  }

  apply(jobId: string, title: string): void {
    const applied = this.jobState.applyToJob(jobId);
    if (applied) {
      this.notifications.success(`Application submitted for "${title}".`);
    } else {
      this.notifications.info(`You have already applied to "${title}".`);
    }
  }

  matchClass(pct: number): string {
    if (pct >= 80) return 'badge-success';
    if (pct >= 50) return 'badge-warning';
    return 'badge-neutral';
  }
}
