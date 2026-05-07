import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  AlertConfig,
  AlertInputType,
  AlertResult,
  AlertSlot,
} from './pk-alert.model';

@Injectable({ providedIn: 'root' })
export class PkAlertService {
  /** The component reads this signal to know what (if anything) to display. */
  readonly slot = signal<AlertSlot | null>(null);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    const appRef   = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);

    import('./pk-alert').then(({ PkAlert }) => {
      try {
        if (document.querySelector('pk-alert')) return; // already in DOM (manual tag)
        const ref = createComponent(PkAlert, { environmentInjector: injector });
        appRef.attachView(ref.hostView);
        document.body.appendChild(ref.location.nativeElement);
      } catch {
        // Injector was destroyed before the dynamic import resolved (e.g., during tests).
      }
    });
  }

  private _open(config: AlertConfig): Promise<AlertResult> {
    return new Promise<AlertResult>((resolve) => {
      this.slot.set({ config, resolve });
    });
  }

  success(message: string, title = 'Success'): Promise<void> {
    return this._open({ type: 'success', title, message }) as Promise<void>;
  }

  warn(message: string, title = 'Warning'): Promise<void> {
    return this._open({ type: 'warn', title, message }) as Promise<void>;
  }

  error(message: string, title = 'Error'): Promise<void> {
    return this._open({ type: 'error', title, message }) as Promise<void>;
  }

  confirm(
    message: string,
    title = 'Confirm',
    confirmLabel = 'Yes',
    cancelLabel = 'No',
  ): Promise<boolean> {
    return this._open({
      type: 'confirm',
      title,
      message,
      confirmLabel,
      cancelLabel,
    }) as Promise<boolean>;
  }

  input(
    message: string,
    inputType: AlertInputType = 'string',
    title = 'Input',
    defaultValue?: string | number | boolean | null,
  ): Promise<string | number | boolean | null> {
    return this._open({
      type: 'input',
      title,
      message,
      inputType,
      defaultValue,
    }) as Promise<string | number | boolean | null>;
  }

  /** Called by the component after the user makes a choice. */
  _resolve(value: AlertResult): void {
    const current = this.slot();
    if (current) {
      this.slot.set(null);
      current.resolve(value);
    }
  }
}
