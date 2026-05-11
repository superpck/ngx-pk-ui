import {
  ApplicationRef,
  computed,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Toast, ToastOptions, ToastPosition, ToastType } from './pk-toastr.model';

const ALL_POSITIONS: ToastPosition[] = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center-center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right',
  'top-full', 'bottom-full',
];

const DEFAULT_DURATION = 4000;
const DEFAULT_POSITION: ToastPosition = 'top-right';

@Injectable({ providedIn: 'root' })
export class PkToastrService {
  private _counter = 0;
  toasts = signal<Toast[]>([]);

  /** Toasts grouped by position — consumed by the template. */
  readonly toastsByPos = computed(() => {
    const map = Object.fromEntries(ALL_POSITIONS.map(p => [p, [] as Toast[]])) as Record<ToastPosition, Toast[]>;
    for (const t of this.toasts()) map[t.position].push(t);
    return map;
  });

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    const appRef   = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);

    // Lazily import PkToastr to break the circular-reference at parse time.
    import('./pk-toastr').then(({ PkToastr }) => {
      try {
        if (document.querySelector('pk-toastr')) return; // already in DOM (manual tag)
        const ref = createComponent(PkToastr, { environmentInjector: injector });
        appRef.attachView(ref.hostView);
        document.body.appendChild(ref.location.nativeElement);
      } catch {
        // Injector was destroyed before the dynamic import resolved (e.g., during tests).
      }
    });
  }

  show(type: ToastType, message: string, title?: string, options?: ToastOptions): void {
    const duration = options?.duration ?? DEFAULT_DURATION;
    const position = options?.position ?? DEFAULT_POSITION;
    const progress = options?.progress ?? true;
    const toast: Toast = { id: ++this._counter, type, message, title, duration, position, progress };
    this.toasts.update((list) => [...list, toast]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(toast.id), duration);
    }
  }

  success(message: string, title?: string, options?: ToastOptions): void {
    this.show('success', message, title, options);
  }

  error(message: string, title?: string, options?: ToastOptions): void {
    this.show('error', message, title, options);
  }

  info(message: string, title?: string, options?: ToastOptions): void {
    this.show('info', message, title, options);
  }

  warning(message: string, title?: string, options?: ToastOptions): void {
    this.show('warning', message, title, options);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
