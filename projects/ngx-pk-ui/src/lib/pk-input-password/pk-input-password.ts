import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PkIcon } from '../pk-icon/pk-icon';
import { PkProgressComponent } from '../pk-progress/pk-progress.component';
import type { ProgressConfig } from '../pk-progress/pk-progress.interface';

let _pkPwdCounter = 0;

@Component({
  selector: 'pk-input-password',
  standalone: true,
  imports: [PkIcon, PkProgressComponent],
  templateUrl: './pk-input-password.html',
  styleUrl: './pk-input-password.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PkInputPassword),
      multi: true,
    },
  ],
})
export class PkInputPassword implements ControlValueAccessor {
  /** Floating label text */
  readonly label = input<string>('Password');
  /** `id` for the input — auto-generated if not provided */
  readonly inputId = input<string>('');
  /** `autocomplete` attribute */
  readonly autocomplete = input<string>('current-password');
  /** Show a 4-bar strength indicator below the field */
  readonly showStrength = input<boolean>(false);
  /** Extra CSS class on the host wrapper */
  readonly customClass = input<string>('');
  /** Inline styles on the host wrapper */
  readonly customStyle = input<Record<string, string>>({});

  protected readonly _value    = signal<string>('');
  protected readonly _visible  = signal<boolean>(false);
  protected readonly _disabled = signal<boolean>(false);

  /** Auto-generated uid, used when `inputId` is empty */
  private readonly _uid = `pk-pwd-${++_pkPwdCounter}`;
  protected readonly _id = computed(() => this.inputId() || this._uid);

  // ── Strength ─────────────────────────────────────────────────────────────

  protected readonly _strength = computed<number>(() => {
    const v = this._value();
    if (!v) return 0;
    let s = 0;
    if (v.length >= 8)           s += 25;
    if (/[A-Z]/.test(v))         s += 25;
    if (/[0-9]/.test(v))         s += 25;
    if (/[^A-Za-z0-9]/.test(v))  s += 25;
    return s;
  });

  protected readonly _strengthStatus = computed<'error' | 'warning' | 'normal' | 'success'>(() => {
    const s = this._strength();
    if (s <= 25) return 'error';
    if (s <= 50) return 'warning';
    if (s <= 75) return 'normal';
    return 'success';
  });

  protected readonly _strengthLabel = computed<string>(() => {
    const s = this._strength();
    if (s === 0)  return '';
    if (s <= 25)  return 'Weak';
    if (s <= 50)  return 'Fair';
    if (s <= 75)  return 'Good';
    return 'Strong';
  });

  protected readonly _progressConfig = computed<ProgressConfig>(() => ({
    type:        'line',
    percent:     this._strength(),
    status:      this._strengthStatus(),
    showInfo:    false,
    strokeWidth: 5,
  }));

  // ── Event handlers ────────────────────────────────────────────────────────

  toggleVisibility(): void {
    this._visible.update(v => !v);
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value.set(value);
    this._onChange(value);
    this._onTouch();
  }

  onBlur(): void {
    this._onTouch();
  }

  // ── ControlValueAccessor ─────────────────────────────────────────────────

  private _onChange: (v: string) => void = () => {};
  private _onTouch:  () => void          = () => {};

  writeValue(value: string): void              { this._value.set(value ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void         { this._onTouch  = fn; }
  setDisabledState(isDisabled: boolean): void     { this._disabled.set(isDisabled); }
}
