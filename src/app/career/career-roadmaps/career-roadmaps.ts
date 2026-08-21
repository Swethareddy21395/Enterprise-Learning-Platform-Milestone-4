import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CareerStateService } from '../../core/services/career-state.service';

@Component({
  selector: 'app-career-roadmaps',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './career-roadmaps.html',
  styleUrl: './career-roadmaps.scss'
})
export class CareerRoadmapsComponent {
  private careerState = inject(CareerStateService);

  careerPlan$ = this.careerState.careerPlan$;
  roadmap$ = this.careerState.roadmap$;
}
