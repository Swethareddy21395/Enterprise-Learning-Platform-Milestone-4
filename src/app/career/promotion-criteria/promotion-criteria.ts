import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CareerStateService } from '../../core/services/career-state.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-promotion-criteria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promotion-criteria.html',
  styleUrl: './promotion-criteria.scss'
})
export class PromotionCriteriaComponent {
  private careerState = inject(CareerStateService);
  private notifications = inject(NotificationService);

  careerPlan$ = this.careerState.careerPlan$;
  criteria$ = this.careerState.promotionCriteria$;
  readiness$ = this.careerState.promotionReadiness$;

  toggle(id: string, name: string, wasCompleted: boolean): void {
    this.careerState.toggleCriterion(id);
    this.notifications.info(
      wasCompleted ? `Marked "${name}" as pending.` : `Marked "${name}" as complete.`
    );
  }

  eligibilityLabel(readiness: number): string {
    if (readiness >= 100) return 'Eligible now';
    if (readiness >= 75) return 'Approximately 3 months';
    if (readiness >= 50) return 'Approximately 6 months';
    return 'Approximately 12 months';
  }
}
