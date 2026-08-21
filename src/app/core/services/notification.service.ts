import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppNotification, NotificationType } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private idCounter = 0;
  private readonly notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  private readonly historySubject = new BehaviorSubject<AppNotification[]>([]);
  readonly notifications$ = this.notificationsSubject.asObservable();
  /** Non-expiring log of recent notifications, newest first - powers the header bell. */
  readonly history$ = this.historySubject.asObservable();

  show(message: string, type: NotificationType = 'success', durationMs = 3500): void {
    const notification: AppNotification = { id: ++this.idCounter, message, type };
    this.notificationsSubject.next([...this.notificationsSubject.value, notification]);
    this.historySubject.next([notification, ...this.historySubject.value].slice(0, 8));
    setTimeout(() => this.dismiss(notification.id), durationMs);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 5000);
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this.notificationsSubject.next(this.notificationsSubject.value.filter((n) => n.id !== id));
  }
}
