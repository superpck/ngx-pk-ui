import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgStyle } from '@angular/common';
import type { PkTimeFormat, PkTimeType, PkTimeInputType } from './pk-timepicker.model';

function clamp(v: number, min: number, max: number): number {
  return isNaN(v) ? min : Math.min(max, Math.max(min, v));
}

@Component({
  selector: 'pk-timepicker',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './pk-timepicker.html',
  styleUrl: './pk-timepicker.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PkTimepicker),
      multi: true,
    },
  ],
})
export class PkTimepicker implements ControlValueAccessor {
  readonly format     = input<PkTimeFormat>('hm');
  readonly type       = input<PkTimeType>('24H');
  readonly inputType  = input<PkTimeInputType>('number');
  readonly customClass  = input<string>('');
  readonly customStyle  = input<Record<string, string>>({});
  readonly onTimeChange = output<string>();

  readonly _h        = signal<number>(0);
  readonly _m        = signal<number>(0);
  readonly _s        = signal<number>(0);
  readonly _disabled = signal<boolean>(false);

  // raw editing state for number-input mode (null = use display computed)
  readonly _editH    = signal<string | null>(null);
  readonly _editM    = signal<string | null>(null);
  readonly _editS    = signal<string | null>(null);

  readonly _displayH = computed(() => {
    if (this.type() === '12H') {
      const h = this._h() % 12;
      return String(h === 0 ? 12 : h).padStart(2, '0');
    }
    return String(this._h()).padStart(2, '0');
  });
  readonly _displayM = computed(() => String(this._m()).padStart(2, '0'));
  readonly _displayS = computed(() => String(this._s()).padStart(2, '0'));
  readonly _ampm     = computed<'AM' | 'PM'>(() => (this._h() < 12 ? 'AM' : 'PM'));

  // display values for number-input fields (raw while editing, padded once committed)
  readonly _numH     = computed(() => this._editH() ?? this._displayH());
  readonly _numM     = computed(() => this._editM() ?? this._displayM());
  readonly _numS     = computed(() => this._editS() ?? this._displayS());

  // dropdown options
  readonly _hoursOptions = computed<string[]>(() =>
    this.type() === '12H'
      ? Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))  // 01-12
      : Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))      // 00-23
  );
  readonly _minutesOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  readonly _secondsOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  private _buildValue(): string {
    const h = String(this._h()).padStart(2, '0');
    const m = String(this._m()).padStart(2, '0');
    const s = String(this._s()).padStart(2, '0');
    if (this.format() === 'hms') return `${h}:${m}:${s}`;
    if (this.format() === 'hm')  return `${h}:${m}`;
    return h;
  }

  private _emit(): void {
    const v = this._buildValue();
    this._onChange(v);
    this.onTimeChange.emit(v);
  }

  writeValue(val: string | null): void {
    this._editH.set(null); this._editM.set(null); this._editS.set(null);
    if (!val) { this._h.set(0); this._m.set(0); this._s.set(0); return; }
    const parts = val.split(':');
    this._h.set(clamp(parseInt(parts[0] ?? '0', 10), 0, 23));
    this._m.set(clamp(parseInt(parts[1] ?? '0', 10), 0, 59));
    this._s.set(clamp(parseInt(parts[2] ?? '0', 10), 0, 59));
  }

  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._disabled.set(isDisabled); }

  incrementH(): void {
    if (this._disabled()) return;
    this._h.set((this._h() + 1) % 24);
    this._emit();
  }
  decrementH(): void {
    if (this._disabled()) return;
    this._h.set((this._h() - 1 + 24) % 24);
    this._emit();
  }
  onWheelH(e: WheelEvent): void {
    e.preventDefault();
    e.deltaY < 0 ? this.incrementH() : this.decrementH();
  }

  incrementM(): void {
    if (this._disabled()) return;
    this._m.set((this._m() + 1) % 60);
    this._emit();
  }
  decrementM(): void {
    if (this._disabled()) return;
    this._m.set((this._m() - 1 + 60) % 60);
    this._emit();
  }
  onWheelM(e: WheelEvent): void {
    e.preventDefault();
    e.deltaY < 0 ? this.incrementM() : this.decrementM();
  }

  incrementS(): void {
    if (this._disabled()) return;
    this._s.set((this._s() + 1) % 60);
    this._emit();
  }
  decrementS(): void {
    if (this._disabled()) return;
    this._s.set((this._s() - 1 + 60) % 60);
    this._emit();
  }
  onWheelS(e: WheelEvent): void {
    e.preventDefault();
    e.deltaY < 0 ? this.incrementS() : this.decrementS();
  }

  toggleAmPm(): void {
    if (this._disabled()) return;
    const h = this._h();
    this._h.set(h < 12 ? h + 12 : h - 12);
    this._emit();
  }

  onBlur(): void {
    this._onTouched();
  }

  // ── number-input mode handlers ────────────────────────────────────────────

  onInputH(e: Event): void {
    if (this._disabled()) return;
    this._editH.set((e.target as HTMLInputElement).value);
  }
  onBlurH(): void {
    const raw = this._editH();
    if (raw !== null) {
      const v = parseInt(raw, 10);
      const is12H = this.type() === '12H';
      const valid = !isNaN(v) && (is12H ? v >= 1 && v <= 12 : v >= 0 && v <= 23);
      if (valid) {
        this._h.set(is12H
          ? (this._ampm() === 'AM' ? v % 12 : (v % 12) + 12)
          : v);
        this._emit();
      }
      // if invalid: _h stays unchanged → display reverts to old value
      this._editH.set(null);
    }
  }

  onInputM(e: Event): void {
    if (this._disabled()) return;
    this._editM.set((e.target as HTMLInputElement).value);
  }
  onBlurM(): void {
    const raw = this._editM();
    if (raw !== null) {
      const v = parseInt(raw, 10);
      if (!isNaN(v) && v >= 0 && v <= 59) {
        this._m.set(v);
        this._emit();
      }
      // if invalid: _m stays unchanged → display reverts
      this._editM.set(null);
    }
  }

  onInputS(e: Event): void {
    if (this._disabled()) return;
    this._editS.set((e.target as HTMLInputElement).value);
  }
  onBlurS(): void {
    const raw = this._editS();
    if (raw !== null) {
      const v = parseInt(raw, 10);
      if (!isNaN(v) && v >= 0 && v <= 59) {
        this._s.set(v);
        this._emit();
      }
      // if invalid: _s stays unchanged → display reverts
      this._editS.set(null);
    }
  }

  // ── dropdown mode handlers ────────────────────────────────────────────────

  onSelectH(e: Event): void {
    if (this._disabled()) return;
    const v = parseInt((e.target as HTMLSelectElement).value, 10);
    this._h.set(this.type() === '12H'
      ? (this._ampm() === 'AM' ? v % 12 : (v % 12) + 12)
      : v);
    this._emit();
  }

  onSelectM(e: Event): void {
    if (this._disabled()) return;
    this._m.set(parseInt((e.target as HTMLSelectElement).value, 10));
    this._emit();
  }

  onSelectS(e: Event): void {
    if (this._disabled()) return;
    this._s.set(parseInt((e.target as HTMLSelectElement).value, 10));
    this._emit();
  }
}
