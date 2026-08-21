import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'career', pathMatch: 'full' },
  {
    path: 'career',
    loadComponent: () =>
      import('./career/career-overview/career-overview').then((m) => m.CareerOverviewComponent)
  },
  {
    path: 'career/roadmaps',
    loadComponent: () =>
      import('./career/career-roadmaps/career-roadmaps').then((m) => m.CareerRoadmapsComponent)
  },
  {
    path: 'career/promotion-criteria',
    loadComponent: () =>
      import('./career/promotion-criteria/promotion-criteria').then(
        (m) => m.PromotionCriteriaComponent
      )
  },
  {
    path: 'career/jobs',
    loadComponent: () =>
      import('./career/internal-jobs/internal-jobs').then((m) => m.InternalJobsComponent)
  },
  {
    path: 'career/jobs/:id',
    loadComponent: () => import('./career/job-details/job-details').then((m) => m.JobDetailsComponent)
  },
  {
    path: 'career/saved-jobs',
    loadComponent: () => import('./career/saved-jobs/saved-jobs').then((m) => m.SavedJobsComponent)
  },
  {
    path: 'career/training-analytics',
    loadComponent: () =>
      import('./career/training-analytics/training-analytics').then(
        (m) => m.TrainingAnalyticsComponent
      )
  },
  {
    path: 'career/executive-dashboard',
    loadComponent: () =>
      import('./career/executive-dashboard/executive-dashboard').then(
        (m) => m.ExecutiveDashboardComponent
      )
  },
  { path: '**', redirectTo: 'career' }
];
