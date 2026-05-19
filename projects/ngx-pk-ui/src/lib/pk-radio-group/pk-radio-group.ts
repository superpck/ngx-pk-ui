import { Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let _pkRadioCounter = 0;

export interface PkRadioOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export type PkRadioLayout = 'vertical' | 'horizontal';

@Component({
  selector: 'pk-radio-group',
  standalone: true,
  imports: [],
  templateUrl: './pk-radio-group.html',
  styleUrl: './pk-radio-group.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PkRadioGroup),
      multi: true,
    },
  ],
})
export class PkRadioGroup implements ControlValueAccessor {
  /** Array of radio options */
  readonly options = input.required<PkRadioOption[]>();
  /** Layout direction — vertical (default) or horizontal */
  readonly layout = input<PkRadioLayout>('vertical');
  /** Extra CSS class on the host wrapper */
  readonly customClass = input<string>('');
  /** Inline styles on the host wrapper */
  readonly customStyle = input<Record<string, string>>({});

  /** Emits the newly selected value */
  readonly onChange = output<any>();

  protected readonly _value    = signal<any>(null);
  protected readonly _disabled = signal<boolean>(false);

  protected readonly _groupName: string;

  constructor() {
    this._groupName = `pk-rg-${++_pkRadioCounter}`;
  }

  protected select(value: any, optionDisabled: boolean | undefined): void {
    if (this._disabled() || optionDisabled) return;
    this._value.set(value);
    this._cvOnChange(value);
    this._onTouch();
    this.onChange.emit(value);
  }

  protected isSelected(value: any): boolean {
    return this._value() === value;
  }

  // ── ControlValueAccessor ─────────────────────────────────────────────────

  private _cvOnChange: (v: any) => void = () => {};
  private _onTouch:   () => void        = () => {};

  writeValue(value: any): void                    { this._value.set(value ?? null); }
  registerOnChange(fn: (v: any) => void): void    { this._cvOnChange = fn; }
  registerOnTouched(fn: () => void): void         { this._onTouch = fn; }
  setDisabledState(isDisabled: boolean): void     { this._disabled.set(isDisabled); }
}
