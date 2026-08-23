import { Injectable } from '@angular/core';
import { CareerStateService } from './career-state.service';
import { JobStateService } from './job-state.service';
import { ExecutiveDashboardService } from './executive-dashboard.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AppResetService {
  constructor(
    private careerState: CareerStateService,
    private jobState: JobStateService,
    private dashboardState: ExecutiveDashboardService,
    private notifications: NotificationService
  ) {}

  resetAll(): void {
    this.careerState.resetDemoData();
    this.jobState.resetDemoData();
    this.dashboardState.resetDemoData();
    this.notifications.success('Demo data has been reset to the original Milestone 4 values.');
  }
}
