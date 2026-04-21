import { Component, input, output, signal, computed, forwardRef, ElementRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { SelectOption, SelectMode } from './pk-select.interface';

@Component({
  selector: 'pk-select',
  standalone: true,
  imports: [NgStyle],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PkSelectComponent),
      multi: true
    }
  ],
  host: {
    '(document:click)': 'onDocumentClick($event)'
  },
  template: `
    <div class="pk-select-container" [class]="customClass()">
      <div 
        class="pk-select-trigger"
        [class.pk-select-trigger-open]="isOpen()"
        [class.pk-select-trigger-disabled]="disabled()"
        [ngStyle]="customStyle()"
        (click)="toggleDropdown()">
        <span class="pk-select-value">
          @if (displayValue()) {
            {{ displayValue() }}
          } @else {
            <span class="pk-select-placeholder">{{ placeholder() }}</span>
          }
        </span>
        <span class="pk-select-arrow" [class.pk-select-arrow-open]="isOpen()">▼</span>
      </div>

      @if (isOpen()) {
        <div class="pk-select-dropdown">
          @if (searchable()) {
            <div class="pk-select-search">
              <input 
                type="text"
                class="pk-select-search-input"
                [value]="searchQuery()"
                (input)="onSearchInput($event)"
                (click)="$event.stopPropagation()"
                placeholder="ค้นหา..." />
            </div>
          }

          <div class="pk-select-options">
            @if (filteredOptions().length === 0) {
              <div class="pk-select-no-options">ไม่พบข้อมูล</div>
            }

            @for (option of filteredOptions(); track getOptionValue(option)) {
              <div 
                class="pk-select-option"
                [class.pk-select-option-selected]="isSelected(getOptionValue(option))"
                [class.pk-select-option-disabled]="option.disabled"
                (click)="!option.disabled && selectOption(option)">
                
                @if (mode() === 'multi') {
                  <input 
                    type="checkbox"
                    class="pk-select-checkbox"
                    [checked]="isSelected(getOptionValue(option))"
                    [disabled]="option.disabled"
                    (click)="onCheckboxClick(option, $event)"
                    (change)="$event.stopPropagation()" />
                }
                
                <span class="pk-select-option-label">{{ option.label }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .pk-select-container {
      position: relative;
      width: 100%;
    }

    .pk-select-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background-color: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pk-select-trigger:hover:not(.pk-select-trigger-disabled) {
      border-color: #3b82f6;
    }

    .pk-select-trigger-open {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .pk-select-trigger-disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .pk-select-value {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pk-select-placeholder {
      color: #9ca3af;
    }

    .pk-select-arrow {
      margin-left: 8px;
      font-size: 12px;
      color: #6b7280;
      transition: transform 0.2s;
    }

    .pk-select-arrow-open {
      transform: rotate(180deg);
    }

    .pk-select-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background-color: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      z-index: 1000;
      max-height: 300px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .pk-select-search {
      padding: 8px;
      border-bottom: 1px solid #e5e7eb;
    }

    .pk-select-search-input {
      width: 100%;
      padding: 6px 10px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
      outline: none;
    }

    .pk-select-search-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .pk-select-options {
      overflow-y: auto;
      max-height: 250px;
    }

    .pk-select-option {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .pk-select-option:hover:not(.pk-select-option-disabled) {
      background-color: #f3f4f6;
    }

    .pk-select-option-selected {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .pk-select-option-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pk-select-checkbox {
      margin-right: 8px;
      cursor: pointer;
    }

    .pk-select-option-label {
      flex: 1;
    }

    .pk-select-no-options {
      padding: 16px 12px;
      text-align: center;
      color: #9ca3af;
      font-size: 14px;
    }
  `
})
export class PkSelectComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);
  
  options = input.required<SelectOption[]>();
  mode = input<SelectMode>('single');
  placeholder = input<string>('เลือก...');
  searchable = input<boolean>(false);
  disabled = input<boolean>(false);
  labelField = input<string>('label');
  valueField = input<string>('value');
  returnObjects = input<boolean>(false);
  customClass = input<string | null>(null);
  customStyle = input<Record<string, string> | null>(null);

  change = output<any>();

  isOpen = signal<boolean>(false);
  searchQuery = signal<string>('');
  selectedValues = signal<(string | number)[]>([]);

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.options();
    
    return this.options().filter(option => 
      this.getOptionLabel(option).toLowerCase().includes(query)
    );
  });

  displayValue = computed(() => {
    const selected = this.selectedValues();
    const opts = this.options();
    if (selected.length === 0) return '';

    if (this.mode() === 'single') {
      const option = opts.find(o => this.getOptionValue(o) === selected[0]);
      return option ? this.getOptionLabel(option) : '';
    } else {
      const labels = selected
        .map(val => {
          const option = opts.find(o => this.getOptionValue(o) === val);
          return option ? this.getOptionLabel(option) : '';
        })
        .filter(Boolean);
      return labels.join(', ');
    }
  });

  toggleDropdown(): void {
    if (this.disabled()) return;
    this.isOpen.update(open => !open);
    if (!this.isOpen()) {
      this.searchQuery.set('');
    }
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;
    const optionValue = this.getOptionValue(option);

    if (this.mode() === 'single') {
      this.selectedValues.set([optionValue]);
      this.isOpen.set(false);
      this.searchQuery.set('');
      this.emitValue();
    } else {
      const current = [...this.selectedValues()];
      const index = current.indexOf(optionValue);
      
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(optionValue);
      }
      this.selectedValues.set(current);
      this.emitValue();
    }
  }

  isSelected(value: string | number): boolean {
    return this.selectedValues().includes(value);
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onDocumentClick(event: MouseEvent): void {
    // Close dropdown when clicking outside
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isOpen()) {
      this.isOpen.set(false);
      this.searchQuery.set('');
    }
  }

  onCheckboxClick(option: SelectOption, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (option.disabled) {
      return;
    }

    this.selectOption(option);
  }

  private emitValue(): void {
    const selected = this.selectedValues();
    let value: any;

    if (this.returnObjects()) {
      const selectedOptions = selected
        .map(selectedValue => this.options().find(option => this.getOptionValue(option) === selectedValue))
        .filter(Boolean);

      value = this.mode() === 'single'
        ? selectedOptions[0] ?? null
        : selectedOptions;
    } else {
      value = this.mode() === 'single'
        ? selected[0] ?? null
        : selected;
    }
    
    this.onChange(value);
    this.onTouched();
    this.change.emit(value);
  }

  writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.selectedValues.set([]);
    } else if (Array.isArray(value)) {
      this.selectedValues.set(value.map(item => this.extractIncomingValue(item)));
    } else {
      this.selectedValues.set([this.extractIncomingValue(value)]);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled by disabled input
  }

  private getOptionLabel(option: SelectOption): string {
    const field = this.labelField();
    const fallbackField = this.valueField();
    const value = option?.[field] ?? option?.label ?? option?.[fallbackField] ?? option?.value ?? '';
    return `${value}`;
  }

  getOptionValue(option: SelectOption): string | number {
    const field = this.valueField();
    const fallbackField = this.labelField();
    return option?.[field] ?? option?.value ?? option?.[fallbackField] ?? option?.label ?? '';
  }

  private extractIncomingValue(value: any): string | number {
    if (value !== null && typeof value === 'object') {
      return value?.[this.valueField()] ?? value?.value ?? value?.[this.labelField()] ?? value?.label ?? '';
    }
    return value;
  }
}
