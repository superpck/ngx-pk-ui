import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from './pk-toastr.model';

@Injectable({ providedIn: 'root' })
export class PkToastrService {
  private _counter = 0;
  toasts = signal<Toast[]>([]);

  show(type: ToastType, message: string, title?: string, duration = 4000): void {
    const toast: Toast = { id: ++this._counter, type, message, title, duration };
    this.toasts.update((list) => [...list, toast]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(toast.id), duration);
    }
  }

  success(message: string, title?: string, duration?: number): void {
    this.show('success', message, title, duration);
  }

  error(message: string, title?: string, duration?: number): void {
    this.show('error', message, title, duration);
  }

  info(message: string, title?: string, duration?: number): void {
    this.show('info', message, title, duration);
  }

  warning(message: string, title?: string, duration?: number): void {
    this.show('warning', message, title, duration);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
