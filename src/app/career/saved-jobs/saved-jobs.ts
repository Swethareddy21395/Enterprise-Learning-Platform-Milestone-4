import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobStateService } from '../../core/services/job-state.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './saved-jobs.html',
  styleUrl: './saved-jobs.scss'
})
export class SavedJobsComponent {
  private jobState = inject(JobStateService);
  private notifications = inject(NotificationService);

  savedJobs$ = this.jobState.savedJobs$;

  remove(jobId: string, title: string): void {
    this.jobState.removeSavedJob(jobId);
    this.notifications.success(`Job removed from saved jobs.`);
  }

  isApplied(jobId: string): boolean {
    return this.jobState.isApplied(jobId);
  }

  apply(jobId: string, title: string): void {
    const applied = this.jobState.applyToJob(jobId);
    if (applied) {
      this.notifications.success(`Application submitted for "${title}".`);
    } else {
      this.notifications.info(`You have already applied to "${title}".`);
    }
  }
}
