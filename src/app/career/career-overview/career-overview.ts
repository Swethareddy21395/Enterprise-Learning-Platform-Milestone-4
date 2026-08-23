import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // 1. इसे इम्पोर्ट करना जरूरी था
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CareerStateService } from '../../core/services/career-state.service';
import { NotificationService } from '../../core/services/notification.service';
import { JobStateService } from '../../core/services/job-state.service';
import { ROLE_LADDER, CAREER_API_CONFIG } from '../../core/services/career-data';

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
  private http = inject(HttpClient); // 2. HttpClient को यहाँ इंजेक्ट कर दिया है

  readonly roleLadder = ROLE_LADDER;
  private readonly destroy$ = new Subject<void>();

  careerPlan$ = this.careerState.careerPlan$;
  skillGaps$ = this.careerState.skillGaps$;
  promotionReadiness$ = this.careerState.promotionReadiness$;
  jobMatchCount$ = this.jobState.allJobs$.pipe(
    map((jobs) => jobs.filter((j) => j.matchPercent >= 50).length)
  );

  // 3. डेटाबेस की लाइव वैल्यू होल्ड करने के लिए वेरिएबल डिक्लेअर कर दिया है
  careerData: any = null;

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
    this.http.get(CAREER_API_CONFIG.endpoints.roadmap('EMP101'))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.careerData = data;
          console.log("Database Connected Live!", data);

          // अगर आप चाहें तो फॉर्म में सीधे डेटाबेस की वैल्यूज पैच कर सकते हैं:
          if (data) {
            this.form.patchValue({
              currentRole: data.currentRole,
              targetRole: data.targetRole,
              mentor: data.mentor,
              notes: data.status
            }, { emitEvent: false });
          }
        },
        error: (err) => {
          console.error("Backend Connection Warning:", err);
        }
      });

    this.careerPlan$.pipe(takeUntil(this.destroy$)).subscribe((plan) => {
      if (this.form.pristine && !this.careerData) {
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
    const rawValue = this.form.getRawValue();
    this.careerState.updateCareerPlan(rawValue as any);

    const body = {
      employeeId: 'EMP101',
      currentRole: rawValue.currentRole,
      targetRole: rawValue.targetRole,
      mentor: rawValue.mentor,
      progress: this.careerData?.progress || 67,
      status: rawValue.notes || 'IN_PROGRESS'
    };

    this.http.post(CAREER_API_CONFIG.baseUrl, body)
      .subscribe({
        next: (res: any) => {
          console.log('Saved to backend database successfully!', res);
          this.careerData = res;
        },
        error: (err) => {
          console.error('Error saving to backend:', err);
        }
      });

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
