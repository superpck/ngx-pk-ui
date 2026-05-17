import {
  Component,
  input,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
  forwardRef,
  inject,
  ElementRef,
  HostListener,
} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { AutocompleteOption, AutocompleteFetchFn } from './pk-autocomplete.interface';

@Component({
  selector: 'pk-autocomplete',
  standalone: true,
  imports: [FormsModule, NgClass, NgStyle],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PkAutocompleteComponent),
      multi: true,
    },
  ],
  template: `
    <div class="pk-autocomplete" [ngClass]="customClass()" [ngStyle]="customStyle()">
      <!-- Input -->
      <div class="pk-autocomplete__input-wrap" [class.pk-autocomplete__input-wrap--multi]="multi()">
        <!-- Chips (multi mode) -->
        @if (multi()) {
          @for (opt of selectedValues(); track opt.value) {
            <span class="pk-autocomplete__chip">
              {{ opt.label }}
              <button type="button" (click)="removeOption(opt); $event.stopPropagation()" class="pk-autocomplete__chip-remove">×</button>
            </span>
          }
        }

        <input
          #inputElement
          type="text"
          [value]="displayValue()"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (keydown)="onKeyDown($event)"
          [placeholder]="multi() && selectedValues().length > 0 ? '' : placeholder()"
          [disabled]="disabled()"
          [ngStyle]="multi() ? null : customStyle()"
          class="pk-autocomplete__input"
          [class.pk-autocomplete__input--seamless]="multi()"
          [class.pk-autocomplete__input--with-action]="!multi() && (loading() || (searchTerm() && !loading()))"
        />

        <!-- Single-select: spinner / clear -->
        @if (!multi()) {
          @if (loading()) {
            <div class="pk-autocomplete__action">
              <div class="pk-spinner pk-spinner-sm"></div>
            </div>
          } @else if (searchTerm() && !disabled()) {
            <button type="button" (click)="clear()" class="pk-autocomplete__clear-btn">
              <svg class="pk-autocomplete__clear-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          }
        }

        <!-- Multi-select: clear-all button -->
        @if (multi() && (selectedValues().length > 0 || searchTerm()) && !disabled()) {
          <button type="button" (click)="clear()" class="pk-autocomplete__clear-btn pk-autocomplete__clear-btn--multi">
            <svg class="pk-autocomplete__clear-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        }
      </div>

      <!-- Dropdown -->
      @if (isOpen() && !disabled()) {
        <div class="pk-autocomplete__dropdown">
          @if (loading()) {
            <div class="pk-autocomplete__state">
              <div class="pk-spinner pk-spinner-sm"></div>
              <p>กำลังค้นหา...</p>
            </div>
          } @else if (filteredOptions().length === 0) {
            <div class="pk-autocomplete__state">
              <svg class="pk-autocomplete__empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p>ไม่พบข้อมูล</p>
              @if (searchTerm()) {
                <p class="pk-autocomplete__subtext">ลองค้นหาด้วยคำอื่น</p>
              }
            </div>
          } @else {
            @for (option of filteredOptions(); track option.value; let idx = $index) {
              <button
                type="button"
                (mousedown)="$event.preventDefault()"
                (click)="selectOption(option)"
                [disabled]="option.disabled"
                class="pk-autocomplete__option"
                [class.pk-autocomplete__option--active]="highlightedIndex() === idx"
                [class.pk-autocomplete__option--selected]="isSelected(option)">
                {{ option.label }}
                @if (isSelected(option)) {
                  <span class="pk-autocomplete__check">✓</span>
                }
              </button>
            }
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .pk-autocomplete {
        position: relative;
        width: 100%;
      }

      .pk-autocomplete__input-wrap {
        position: relative;
      }

      .pk-autocomplete__input {
        width: 100%;
        height: 40px;
        padding: 0 14px;
        border: 1px solid #d5d9e0;
        border-radius: 10px;
        background: #ffffff;
        color: #1f2937;
        font-size: 14px;
        line-height: 1;
        transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
      }

      .pk-autocomplete__input::placeholder {
        color: #9aa3af;
      }

      .pk-autocomplete__input:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
      }

      .pk-autocomplete__input:disabled {
        background: #f4f6f8;
        color: #9aa3af;
        cursor: not-allowed;
      }

      .pk-autocomplete__input--with-action {
        padding-right: 40px;
      }

      .pk-autocomplete__action,
      .pk-autocomplete__clear-btn {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .pk-autocomplete__clear-btn {
        width: 24px;
        height: 24px;
        border: none;
        border-radius: 999px;
        background: transparent;
        color: #98a2b3;
        cursor: pointer;
        transition: background-color 0.15s ease, color 0.15s ease;
      }

      .pk-autocomplete__clear-btn:hover {
        background: #eef2f7;
        color: #4b5563;
      }

      .pk-autocomplete__clear-icon {
        width: 16px;
        height: 16px;
      }

      .pk-autocomplete__dropdown {
        position: absolute;
        z-index: 50;
        width: 100%;
        margin-top: 6px;
        background: #ffffff;
        border: 1px solid #dbe1e8;
        border-radius: 12px;
        box-shadow: 0 14px 30px rgba(15, 23, 42, 0.14);
        max-height: 260px;
        overflow: auto;
      }

      .pk-autocomplete__state {
        min-height: 110px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #6b7280;
        font-size: 13px;
      }

      .pk-autocomplete__empty-icon {
        width: 34px;
        height: 34px;
        color: #c2cad4;
      }

      .pk-autocomplete__subtext {
        margin: 0;
        color: #9aa3af;
        font-size: 12px;
      }

      .pk-autocomplete__option {
        width: 100%;
        padding: 10px 14px;
        border: none;
        background: transparent;
        color: #1f2937;
        font-size: 14px;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        transition: background-color 0.12s ease;
      }

      .pk-autocomplete__option:hover {
        background: #f1f5ff;
      }

      .pk-autocomplete__option--active {
        background: #e7efff;
      }

      .pk-autocomplete__option--selected {
        font-weight: 600;
      }

      .pk-autocomplete__option:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .pk-autocomplete__check {
        color: #2563eb;
      }

      /* ── Multi-select chips ─────────────────────────────── */
      .pk-autocomplete__input-wrap--multi {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px;
        padding: 4px 6px 4px 10px;
        min-height: 40px;
        height: auto;
        border: 1px solid #d5d9e0;
        border-radius: 10px;
        background: #ffffff;
        cursor: text;
        transition: border-color 0.18s ease, box-shadow 0.18s ease;
      }

      .pk-autocomplete__input-wrap--multi:focus-within {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
      }

      .pk-autocomplete__input--seamless {
        border: none !important;
        box-shadow: none !important;
        background: transparent !important;
        padding: 0 4px !important;
        height: 28px !important;
        min-width: 80px;
        flex: 1;
      }

      .pk-autocomplete__input--seamless:focus {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
      }

      .pk-autocomplete__clear-btn--multi {
        position: relative;
        right: auto;
        top: auto;
        transform: none;
        flex-shrink: 0;
        margin-left: auto;
      }

      .pk-autocomplete__chip {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 2px 6px 2px 10px;
        background: #e7efff;
        color: #1d4ed8;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
      }

      .pk-autocomplete__chip-remove {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border: none;
        background: transparent;
        color: #3b82f6;
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        padding: 0;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .pk-autocomplete__chip-remove:hover {
        background: #bfdbfe;
        color: #1d4ed8;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PkAutocompleteComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);

  // Inputs
  options = input<(string | AutocompleteOption)[]>([]);
  fetchFn = input<AutocompleteFetchFn | null>(null);
  placeholder = input<string>('ค้นหา...');
  minChars = input<number>(1);
  debounceTime = input<number>(300);
  disabled = input<boolean>(false);
  multi = input<boolean>(false);
  multiWord = input<boolean>(false);
  displayKey = input<string>('label');
  customClass = input<string>('');
  customStyle = input<Record<string, string> | null>(null);

  // State
  searchTerm = signal<string>('');
  isOpen = signal<boolean>(false);
  loading = signal<boolean>(false);
  highlightedIndex = signal<number>(-1);
  selectedValue = signal<any>(null);
  selectedValues = signal<AutocompleteOption[]>([]);
  fetchedOptions = signal<AutocompleteOption[]>([]);

  private debounceTimer: any = null;
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Auto-fetch when search term changes
    effect(() => {
      const term = this.searchTerm();
      const fn = this.fetchFn();
      const min = this.minChars();

      if (fn && term.length >= min) {
        this.performSearch(term);
      }
    });
  }

  // Computed
  readonly normalizedOptions = computed<AutocompleteOption[]>(() =>
    this.options().map(o =>
      typeof o === 'string' ? { label: o, value: o } : o
    )
  );

  readonly currentQuerySignal = computed(() => {
    if (!this.multiWord()) return this.searchTerm();
    const s = this.searchTerm();
    const idx = s.lastIndexOf(' ');
    return idx >= 0 ? s.substring(idx + 1) : s;
  });

  filteredOptions = computed(() => {
    const fetchFn = this.fetchFn();
    const term = (this.multiWord() ? this.currentQuerySignal() : this.searchTerm()).toLowerCase().trim();

    // If using fetchFn, return fetched options
    if (fetchFn) {
      return this.fetchedOptions();
    }

    // Otherwise filter local options
    const opts = this.normalizedOptions();
    if (!term) return opts;

    return opts.filter(opt =>
      opt.label.toLowerCase().includes(term)
    );
  });

  displayValue = computed(() => {
    if (this.multi() || this.multiWord()) return this.searchTerm();
    const selected = this.selectedValue();
    if (!selected) return this.searchTerm();
    const opts = this.fetchFn() ? this.fetchedOptions() : this.normalizedOptions();
    const option = opts.find(opt => opt.value === selected);
    return option ? option.label : this.searchTerm();
  });

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.searchTerm.set(value);
    this.highlightedIndex.set(-1);

    if (this.multiWord()) {
      // Compute current word (text after last space) inline to avoid stale computed
      const spaceIdx = value.lastIndexOf(' ');
      const currentWord = spaceIdx >= 0 ? value.substring(spaceIdx + 1) : value;
      this.isOpen.set(currentWord.length >= this.minChars());
      if (!value) this.onChange('');
    } else {
      this.isOpen.set(true);
      // Clear selection if input is cleared
      if (!value && !this.multi()) {
        this.selectedValue.set(null);
        this.onChange(null);
      }
    }

    // Debounce search
    if (this.fetchFn()) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      if (value.length >= this.minChars()) {
        this.debounceTimer = setTimeout(() => {
          this.performSearch(value);
        }, this.debounceTime());
      }
    }
  }

  onFocus() {
    if (!this.disabled()) {
      if (this.multiWord()) {
        // In multiWord mode let onInput control the dropdown — do not open on focus
        return;
      }
      this.isOpen.set(true);
      // If no search term, fetch or show all options
      if (!this.searchTerm() && this.fetchFn()) {
        this.performSearch('');
      }
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const opts = this.filteredOptions();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        } else {
          const newIndex = Math.min(this.highlightedIndex() + 1, opts.length - 1);
          this.highlightedIndex.set(newIndex);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        const newIndex = Math.max(this.highlightedIndex() - 1, 0);
        this.highlightedIndex.set(newIndex);
        break;

      case 'Enter':
        event.preventDefault();
        const idx = this.highlightedIndex();
        if (idx >= 0 && idx < opts.length) {
          this.selectOption(opts[idx]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  async performSearch(term: string) {
    const fn = this.fetchFn();
    if (!fn) return;

    this.loading.set(true);
    try {
      const results = await fn(term);
      this.fetchedOptions.set(results);
    } catch (error) {
      console.error('Autocomplete fetch error:', error);
      this.fetchedOptions.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  selectOption(option: AutocompleteOption) {
    if (option.disabled) return;

    if (this.multiWord()) {
      const s = this.searchTerm();
      const idx = s.lastIndexOf(' ');
      const prefix = idx >= 0 ? s.substring(0, idx + 1) : '';
      const newValue = prefix + option.label;
      this.searchTerm.set(newValue);
      this.selectedValue.set(null);
      this.onChange(newValue);
      this.onTouched();
      this.close();
    } else if (this.multi()) {
      const current = this.selectedValues();
      const existingIdx = current.findIndex(o => o.value === option.value);
      if (existingIdx >= 0) {
        this.selectedValues.set(current.filter((_, i) => i !== existingIdx));
      } else {
        this.selectedValues.set([...current, option]);
      }
      this.searchTerm.set('');
      this.isOpen.set(true);
      this.highlightedIndex.set(-1);
      this.onChange(this.selectedValues().map(o => o.label).join(' '));
      this.onTouched();
    } else {
      this.selectedValue.set(option.value);
      this.searchTerm.set(option.label);
      this.onChange(option.value);
      this.onTouched();
      this.close();
    }
  }

  removeOption(option: AutocompleteOption) {
    this.selectedValues.set(this.selectedValues().filter(o => o.value !== option.value));
    this.onChange(this.selectedValues().map(o => o.label).join(' '));
  }

  clear() {
    this.searchTerm.set('');
    this.selectedValue.set(null);
    if (this.multi()) {
      this.selectedValues.set([]);
      this.onChange('');
    } else {
      this.onChange(null);
    }
    this.isOpen.set(false);
  }

  close() {
    this.isOpen.set(false);
    this.highlightedIndex.set(-1);
  }

  isSelected(option: AutocompleteOption): boolean {
    if (this.multi()) {
      return this.selectedValues().some(o => o.value === option.value);
    }
    return this.selectedValue() === option.value;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (this.multi()) {
      // In multi mode value is a space-separated label string
      // We reset; chips are built by user selections
      this.selectedValues.set([]);
      this.searchTerm.set('');
      return;
    }
    if (this.multiWord()) {
      this.searchTerm.set(value || '');
      this.selectedValue.set(null);
      return;
    }
    this.selectedValue.set(value);
    // Find and set display text
    if (value) {
      const opts = this.fetchFn() ? this.fetchedOptions() : this.normalizedOptions();
      const option = opts.find(opt => opt.value === value);
      if (option) {
        this.searchTerm.set(option.label);
      }
    } else {
      this.searchTerm.set('');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled by input() signal
  }
}
