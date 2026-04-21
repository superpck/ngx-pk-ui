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
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { AutocompleteOption, AutocompleteFetchFn } from './pk-autocomplete.interface';

@Component({
  selector: 'pk-autocomplete',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PkAutocompleteComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative w-full">
      <!-- Input -->
      <div class="relative">
        <input
          #inputElement
          type="text"
          [value]="displayValue()"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (keydown)="onKeyDown($event)"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          [class.pr-10]="loading() || (searchTerm() && !loading())"
        />
        
        <!-- Loading Spinner or Clear Button -->
        @if (loading()) {
          <div class="absolute right-3 top-1/2 -translate-y-1/2">
            <div class="pk-spinner pk-spinner-sm"></div>
          </div>
        } @else if (searchTerm() && !disabled()) {
          <button
            type="button"
            (click)="clear()"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        }
      </div>

      <!-- Dropdown -->
      @if (isOpen() && !disabled()) {
        <div class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          @if (loading()) {
            <div class="px-4 py-8 text-center text-gray-500">
              <div class="pk-spinner pk-spinner-sm mx-auto mb-2"></div>
              <p class="text-sm">กำลังค้นหา...</p>
            </div>
          } @else if (filteredOptions().length === 0) {
            <div class="px-4 py-8 text-center text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-sm">ไม่พบข้อมูล</p>
              @if (searchTerm()) {
                <p class="text-xs mt-1">ลองค้นหาด้วยคำอื่น</p>
              }
            </div>
          } @else {
            @for (option of filteredOptions(); track option.value; let idx = $index) {
              <button
                type="button"
                (click)="selectOption(option)"
                [disabled]="option.disabled"
                class="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                [class.bg-blue-100]="highlightedIndex() === idx"
                [class.font-medium]="isSelected(option)">
                {{ option.label }}
                @if (isSelected(option)) {
                  <span class="float-right text-blue-600">✓</span>
                }
              </button>
            }
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PkAutocompleteComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);

  // Inputs
  options = input<AutocompleteOption[]>([]);
  fetchFn = input<AutocompleteFetchFn | null>(null);
  placeholder = input<string>('ค้นหา...');
  minChars = input<number>(1);
  debounceTime = input<number>(300);
  disabled = input<boolean>(false);
  displayKey = input<string>('label');

  // State
  searchTerm = signal<string>('');
  isOpen = signal<boolean>(false);
  loading = signal<boolean>(false);
  highlightedIndex = signal<number>(-1);
  selectedValue = signal<any>(null);
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
  filteredOptions = computed(() => {
    const fetchFn = this.fetchFn();
    const term = this.searchTerm().toLowerCase().trim();

    // If using fetchFn, return fetched options
    if (fetchFn) {
      return this.fetchedOptions();
    }

    // Otherwise filter local options
    const opts = this.options();
    if (!term) return opts;

    return opts.filter(opt =>
      opt.label.toLowerCase().includes(term)
    );
  });

  displayValue = computed(() => {
    const selected = this.selectedValue();
    if (!selected) return this.searchTerm();

    const opts = this.fetchFn() ? this.fetchedOptions() : this.options();
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
    this.isOpen.set(true);
    this.highlightedIndex.set(-1);

    // Clear selection if input is cleared
    if (!value) {
      this.selectedValue.set(null);
      this.onChange(null);
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

    this.selectedValue.set(option.value);
    this.searchTerm.set(option.label);
    this.onChange(option.value);
    this.onTouched();
    this.close();
  }

  clear() {
    this.searchTerm.set('');
    this.selectedValue.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  close() {
    this.isOpen.set(false);
    this.highlightedIndex.set(-1);
  }

  isSelected(option: AutocompleteOption): boolean {
    return this.selectedValue() === option.value;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.selectedValue.set(value);
    
    // Find and set display text
    if (value) {
      const opts = this.fetchFn() ? this.fetchedOptions() : this.options();
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
