import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { JobStateService } from '../../core/services/job-state.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-details.html',
  styleUrl: './job-details.scss'
})
export class JobDetailsComponent {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  jobState = inject(JobStateService);
  private notifications = inject(NotificationService);

  job$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((id) => this.jobState.allJobs$.pipe(map((jobs) => jobs.find((j) => j.id === id))))
  );

  goBack(): void {
    this.location.back();
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
}
