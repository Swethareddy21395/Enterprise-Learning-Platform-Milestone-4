import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CareerStateService } from '../../core/services/career-state.service';
import { NotificationService } from '../../core/services/notification.service';
import { JobStateService } from '../../core/services/job-state.service';
import { ROLE_LADDER } from '../../core/services/career-data';

function roleLadderValidator(): ValidatorFn {
  return (control): ValidationErrors | null => {
    const targetRole = control.value;
    const currentRole = control.parent?.get('currentRole')?.value;
    if (!targetRole || !currentRole) {
      return null;
    }
    const targetIdx = ROLE_LADDER.indexOf(targetRole);
    const currentIdx = ROLE_LADDER.indexOf(currentRole);
    if (targetIdx < currentIdx) {
      return { belowCurrentRole: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-career-overview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './career-overview.html',
  styleUrl: './career-overview.scss'
})
export class CareerOverviewComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private careerState = inject(CareerStateService);
  private jobState = inject(JobStateService);
  private notifications = inject(NotificationService);

  readonly roleLadder = ROLE_LADDER;
  private readonly destroy$ = new Subject<void>();

  careerPlan$ = this.careerState.careerPlan$;
  skillGaps$ = this.careerState.skillGaps$;
  promotionReadiness$ = this.careerState.promotionReadiness$;
  jobMatchCount$ = this.jobState.allJobs$.pipe(
    map((jobs) => jobs.filter((j) => j.matchPercent >= 50).length)
  );

  readonly kpis = {
    careerPlans: '2,847',
    promotions: '247',
    skillCoverage: '87%'
  };

  form = this.fb.group({
    currentRole: ['', Validators.required],
    targetRole: ['', [Validators.required, roleLadderValidator()]],
    careerGoal: ['', [Validators.required, Validators.minLength(10)]],
    mentor: ['', Validators.required],
    targetDate: ['', Validators.required],
    developmentPriority: ['', Validators.required],
    notes: ['']
  });

  ngOnInit(): void {
    this.careerPlan$.pipe(takeUntil(this.destroy$)).subscribe((plan) => {
      if (this.form.pristine) {
        this.form.patchValue(plan, { emitEvent: false });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.form.controls;
  }

  saveCareerPlan(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notifications.error('Please fix the highlighted fields before saving.');
      return;
    }
    this.careerState.updateCareerPlan(this.form.getRawValue() as any);
    this.form.markAsPristine();
    this.notifications.success('Career plan updated successfully.');
  }

  resetForm(): void {
    this.form.markAsPristine();
    this.form.patchValue(this.careerState.getCurrentPlan());
  }

  skillBarClass(current: number, required: number): string {
    const ratio = current / required;
    if (ratio >= 1) return 'success';
    if (ratio >= 0.75) return '';
    return 'warn';
  }
}
