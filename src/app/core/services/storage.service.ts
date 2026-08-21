import { Injectable } from '@angular/core';

/**
 * Central persistence gateway. Every read/write to browser storage goes
 * through here so that swapping localStorage for a REST API later only
 * requires changing this one service.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly prefix = 'elpscgs:';

  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (raw === null || raw === undefined) {
        return fallback;
      }
      const parsed = JSON.parse(raw);
      if (parsed === null || parsed === undefined) {
        return fallback;
      }
      return parsed as T;
    } catch {
      // Corrupted/invalid JSON in storage - fall back safely rather than throw.
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch {
      // Storage may be full or unavailable (e.g. private browsing) - fail silently,
      // the in-memory state still works for the current session.
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch {
      /* no-op */
    }
  }

  has(key: string): boolean {
    try {
      return localStorage.getItem(this.prefix + key) !== null;
    } catch {
      return false;
    }
  }
}
