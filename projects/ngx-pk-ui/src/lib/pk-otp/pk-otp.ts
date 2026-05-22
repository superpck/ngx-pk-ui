import {
  Component, input, output, signal, computed,
  viewChildren, ElementRef, effect, OnDestroy, forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { PkOtpType, PkOtpSize } from './pk-otp.model';

@Component({
  selector: 'pk-otp',
  standalone: true,
  imports: [],
  templateUrl: './pk-otp.html',
  styleUrl: './pk-otp.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PkOtp),
    multi: true,
  }],
})
export class PkOtp implements ControlValueAccessor, OnDestroy {

  // ─── Inputs ────────────────────────────────────────────────────────────────
  readonly length      = input<number>(6);
  readonly type        = input<PkOtpType>('number');
  /** Uppercase letters — applies only when type='char' */
  readonly capital     = input<boolean>(false);
  readonly size        = input<PkOtpSize>('md');
  readonly title       = input<string>('');
  /** Sub-text below the title, e.g. "ref: ABC123" */
  readonly text        = input<string>('');
  /** Mask character (e.g. '*'). null = show actual input. */
  readonly showString  = input<string | null>(null);
  /** ms to briefly show the actual char before masking. 0 = mask immediately. */
  readonly showTime    = input<number>(1000);
  readonly customClass = input<string>('');
  readonly customStyle = input<Record<string, string>>({});
  readonly disabled    = input<boolean>(false);

  // ─── Outputs ───────────────────────────────────────────────────────────────
  readonly onComplete = output<string>();
  readonly onChange   = output<string>();

  // ─── Internal state ────────────────────────────────────────────────────────
  readonly _values        = signal<string[]>([]);
  readonly _displayValues = signal<string[]>([]);
  readonly _focused       = signal<number>(-1);

  private _maskTimers: ReturnType<typeof setTimeout>[] = [];
  private _cvOnChange: (v: string) => void = () => {};
  private _cvOnTouched: () => void = () => {};

  readonly _inputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');

  readonly cells = computed(() => {
    const n = Math.max(1, Math.min(16, this.length()));
    return Array.from({ length: n }, (_, i) => i);
  });

  readonly _hostClass = computed(() => {
    const parts = ['pk-otp'];
    if (this.size() === 'sm') parts.push('pk-otp--sm');
    if (this.size() === 'lg') parts.push('pk-otp--lg');
    if (this.customClass()) parts.push(this.customClass());
    return parts.join(' ');
  });

  constructor() {
    effect(() => {
      const len = Math.max(1, Math.min(16, this.length()));
      this._values.set(Array(len).fill(''));
      this._displayValues.set(Array(len).fill(''));
    });
  }

  ngOnDestroy(): void {
    this._maskTimers.forEach(t => clearTimeout(t));
  }

  // ─── ControlValueAccessor ──────────────────────────────────────────────────

  writeValue(value: string | null): void {
    const len = Math.max(1, Math.min(16, this.length()));
    const str = (value ?? '').substring(0, len);
    const vals: string[] = Array.from({ length: len }, (_, i) => str[i] ?? '');
    this._values.set(vals);
    const mask = this.showString();
    const displays = vals.map(v => (v ? (mask !== null ? mask : v) : ''));
    this._displayValues.set(displays);
    setTimeout(() => {
      const els = this._inputs();
      displays.forEach((d, i) => { if (els[i]) els[i].nativeElement.value = d; });
    });
  }

  registerOnChange(fn: (v: string) => void): void { this._cvOnChange = fn; }
  registerOnTouched(fn: () => void): void { this._cvOnTouched = fn; }
  setDisabledState(_: boolean): void {}

  // ─── Event Handlers ────────────────────────────────────────────────────────

  onFocus(index: number): void {
    this._focused.set(index);
    const el = this._inputs()[index]?.nativeElement;
    if (el) el.select();
  }

  onBlur(): void {
    this._focused.set(-1);
    this._cvOnTouched();
  }

  onKeyDown(event: Event, index: number): void {
    const e = event as KeyboardEvent;
    const len = this.cells().length;

    switch (e.key) {
      case 'Backspace': {
        e.preventDefault();
        const vals = [...this._values()];
        if (vals[index]) {
          vals[index] = '';
          this._values.set(vals);
          this._clearDisplay(index);
          this._emit(vals);
        } else if (index > 0) {
          vals[index - 1] = '';
          this._values.set(vals);
          this._clearDisplay(index - 1);
          this._emit(vals);
          this._focusAt(index - 1);
        }
        break;
      }
      case 'Delete': {
        e.preventDefault();
        const vals = [...this._values()];
        vals[index] = '';
        this._values.set(vals);
        this._clearDisplay(index);
        this._emit(vals);
        break;
      }
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) this._focusAt(index - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (index < len - 1) this._focusAt(index + 1);
        break;
    }
  }

  onInput(event: Event, index: number): void {
    const inputEl = event.target as HTMLInputElement;
    const raw = inputEl.value;

    if (!raw) {
      const vals = [...this._values()];
      vals[index] = '';
      this._values.set(vals);
      this._clearDisplay(index);
      this._emit(vals);
      return;
    }

    // Multi-char: autofill / browser OTP suggestion / IME
    if (raw.length > 1) {
      inputEl.value = '';
      this._fillFrom(raw, index);
      return;
    }

    if (!this._isValid(raw)) {
      inputEl.value = this._displayValues()[index] || '';
      return;
    }

    const finalChar = (this.capital() && this.type() !== 'number')
      ? raw.toUpperCase() : raw;

    const vals = [...this._values()];
    vals[index] = finalChar;
    this._values.set(vals);
    this._setDisplay(index, finalChar);
    this._emit(vals);

    if (index < this.cells().length - 1) {
      this._focusAt(index + 1);
    }
  }

  onPaste(event: ClipboardEvent, startIndex: number): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (pasted) this._fillFrom(pasted, startIndex);
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private _isValid(char: string): boolean {
    if (!char || char.length !== 1) return false;
    switch (this.type()) {
      case 'number': return /^\d$/.test(char);
      case 'char':   return /^[a-zA-Z]$/.test(char);
      default:       return true;
    }
  }

  private _clearDisplay(index: number): void {
    const d = [...this._displayValues()];
    d[index] = '';
    this._displayValues.set(d);
    const el = this._inputs()[index]?.nativeElement;
    if (el) el.value = '';
  }

  private _setDisplay(index: number, char: string): void {
    const mask = this.showString();
    const d = [...this._displayValues()];

    if (mask === null) {
      d[index] = char;
      this._displayValues.set(d);
      const el = this._inputs()[index]?.nativeElement;
      if (el) el.value = char;
      return;
    }

    if (this.showTime() === 0) {
      d[index] = mask;
      this._displayValues.set(d);
      const el = this._inputs()[index]?.nativeElement;
      if (el) el.value = mask;
      return;
    }

    // Temporarily show actual char, then mask
    d[index] = char;
    this._displayValues.set(d);
    const el = this._inputs()[index]?.nativeElement;
    if (el) el.value = char;

    const timer = setTimeout(() => {
      if (this._values()[index] === char) {
        const d2 = [...this._displayValues()];
        d2[index] = mask;
        this._displayValues.set(d2);
        const el2 = this._inputs()[index]?.nativeElement;
        if (el2) el2.value = mask;
      }
    }, this.showTime());
    this._maskTimers.push(timer);
  }

  private _fillFrom(str: string, startIndex: number): void {
    const vals = [...this._values()];
    const len = this.cells().length;
    let offset = 0;
    let lastSet = startIndex - 1;

    for (let i = startIndex; i < len && offset < str.length; i++) {
      while (offset < str.length && !this._isValid(str[offset])) offset++;
      if (offset >= str.length) break;
      let char = str[offset++];
      if (this.capital() && this.type() !== 'number') char = char.toUpperCase();
      vals[i] = char;
      this._setDisplay(i, char);
      lastSet = i;
    }

    this._values.set(vals);
    this._emit(vals);

    const nextEmpty = vals.indexOf('', startIndex);
    this._focusAt(nextEmpty !== -1 ? nextEmpty : Math.min(lastSet + 1, len - 1));
  }

  private _emit(vals: string[]): void {
    const value = vals.join('');
    this._cvOnChange(value);
    this.onChange.emit(value);
    if (vals.length === this.cells().length && vals.every(v => v !== '')) {
      this.onComplete.emit(value);
    }
  }

  private _focusAt(index: number): void {
    setTimeout(() => {
      const el = this._inputs()[index]?.nativeElement;
      if (el) { el.focus(); el.select(); }
    });
  }
}
