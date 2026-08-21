import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs/operators';
import { ExecutiveDashboardService } from '../../core/services/executive-dashboard.service';
import { TrainingAnalyticsService } from '../../core/services/training-analytics.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-executive-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './executive-dashboard.html',
  styleUrl: './executive-dashboard.scss'
})
export class ExecutiveDashboardComponent {
  private fb = inject(FormBuilder);
  private dashboardService = inject(ExecutiveDashboardService);
  private trainingService = inject(TrainingAnalyticsService);
  private notifications = inject(NotificationService);

  metrics$ = this.dashboardService.filteredMetrics$;
  deptCoverage$ = this.dashboardService.filteredDeptCoverage$;
  skillGaps$ = this.dashboardService.filteredSkillGaps$;
  pipeline$ = this.dashboardService.promotionPipeline$;
  programs$ = this.trainingService.programs$;

  departmentOptions = this.dashboardService.departmentOptions;
  roleOptions = this.dashboardService.roleOptions;
  locationOptions = this.dashboardService.locationOptions;
  skillOptions = this.dashboardService.skillOptions;
  timePeriodOptions = this.dashboardService.timePeriodOptions;

  filterForm = this.fb.group({
    department: [''],
    role: [''],
    location: [''],
    skill: [''],
    timePeriod: ['This Quarter']
  });

  constructor() {
    this.dashboardService.filters$.subscribe((f) => this.filterForm.patchValue(f, { emitEvent: false }));
    this.filterForm.valueChanges.pipe(debounceTime(120), startWith(this.filterForm.value)).subscribe((v) => {
      this.dashboardService.updateFilters({
        department: v.department ?? '',
        role: v.role ?? '',
        location: v.location ?? '',
        skill: v.skill ?? '',
        timePeriod: v.timePeriod ?? 'This Quarter'
      });
    });
  }

  clearFilters(): void {
    this.dashboardService.clearFilters();
    this.notifications.info('Filters cleared.');
  }

  pipelineClass(label: string): string {
    if (label === 'Ready') return 'success';
    if (label === 'Almost Ready') return 'warn';
    return 'danger';
  }

  pipelinePercent(count: number, total: number): number {
    return total === 0 ? 0 : Math.round((count / total) * 100);
  }

  totalPipeline(stages: { count: number }[]): number {
    return stages.reduce((a, b) => a + b.count, 0);
  }
}
