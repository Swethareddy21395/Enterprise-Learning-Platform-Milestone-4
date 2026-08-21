import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class ToastComponent {
  private notificationService = inject(NotificationService);

  notifications$ = this.notificationService.notifications$;

  dismiss(id: number): void {
    this.notificationService.dismiss(id);
  }

  iconFor(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '!';
      default: return 'i';
    }
  }
}
