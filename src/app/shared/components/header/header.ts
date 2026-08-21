import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CareerStateService } from '../../../core/services/career-state.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AppResetService } from '../../../core/services/app-reset.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  private careerState = inject(CareerStateService);
  private notificationService = inject(NotificationService);
  private appReset = inject(AppResetService);

  profileMenuOpen = false;
  notificationsOpen = false;

  employeeName$ = this.careerState.careerPlan$;
  history$ = this.notificationService.history$;

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
    this.notificationsOpen = false;
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    this.profileMenuOpen = false;
  }

  closeMenus(): void {
    this.profileMenuOpen = false;
    this.notificationsOpen = false;
  }

  onResetDemoData(): void {
    this.closeMenus();
    const confirmed = window.confirm(
      'Reset all Milestone 4 demo data? This clears your career plan edits, saved jobs, applications and dashboard filters, and restores the original values.'
    );
    if (confirmed) {
      this.appReset.resetAll();
    }
  }

  onLogout(): void {
    this.closeMenus();
    this.notificationService.info('You have been logged out (demo session only).');
  }
}
