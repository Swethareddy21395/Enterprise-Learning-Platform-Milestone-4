import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TrainingAnalyticsService } from '../../core/services/training-analytics.service';

@Component({
  selector: 'app-training-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './training-analytics.html',
  styleUrl: './training-analytics.scss'
})
export class TrainingAnalyticsComponent {
  private trainingService = inject(TrainingAnalyticsService);

  programs$ = this.trainingService.programs$;
  completion$ = this.trainingService.completion$;
  skillImprovement$ = this.trainingService.skillImprovement$;

  effectivenessClass(pct: number): string {
    if (pct >= 88) return 'success';
    if (pct >= 78) return '';
    return 'warn';
  }

  donutStyle(completed: number, inProgress: number): string {
    const c = completed;
    const p = completed + inProgress;
    return `conic-gradient(var(--color-success) 0% ${c}%, var(--color-warning) ${c}% ${p}%, var(--color-border) ${p}% 100%)`;
  }
}
