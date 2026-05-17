import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pk-typeahead',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './pk-typeahead.component.html',
  styleUrls: ['./pk-typeahead.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PkTypeaheadComponent),
      multi: true
    }
  ]
})
export class PkTypeaheadComponent implements ControlValueAccessor {
  @Input() items: any[] = [];
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() style: string = '';
  @Input() customClass: string = '';
  @Input() customStyle: { [key: string]: string } = { width: '100%' };
  @Input() labelField: string = 'label';
  @Input() valueField: string = 'value';
  @Input() allowCustomValue: boolean = true;
  @Input() maxItems: number = 12;
  @Input() minChars: number = 0;
  @Output() itemSelected = new EventEmitter<any>();

  value: string = '';
  isOpen: boolean = false;
  highlightedIndex: number = -1;

  onChange: (value: any) => void = () => {};
  onTouch: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  /** Text before (and including) the last space — kept intact on selection */
  private get prefix(): string {
    const idx = this.value.lastIndexOf(' ');
    return idx >= 0 ? this.value.substring(0, idx + 1) : '';
  }

  /** The word currently being typed (after the last space) */
  private get currentQuery(): string {
    const idx = this.value.lastIndexOf(' ');
    return idx >= 0 ? this.value.substring(idx + 1) : this.value;
  }

  get filteredItems(): any[] {
    const keyword = this.currentQuery.toLowerCase();
    const normalizedItems = this.items || [];
    if (keyword.length < this.minChars) {
      return normalizedItems.slice(0, this.maxItems);
    }

    return normalizedItems
      .filter(item => this.getItemLabel(item).toLowerCase().includes(keyword))
      .slice(0, this.maxItems);
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.isOpen = true;
    this.highlightedIndex = this.filteredItems.length ? 0 : -1;
  }

  onFocus(): void {
    if (this.disabled) {
      return;
    }
    this.isOpen = true;
    this.highlightedIndex = this.filteredItems.length ? 0 : -1;
  }

  onBlur(): void {
    this.onTouch();
    if (!this.allowCustomValue) {
      const exactMatch = (this.items || []).find(item => this.getItemLabel(item) === this.value);
      if (!exactMatch) {
        this.value = '';
        this.onChange(this.value);
      }
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      this.isOpen = true;
    }

    if (!this.filteredItems.length) {
      if (event.key === 'Escape') {
        this.isOpen = false;
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedIndex = (this.highlightedIndex + 1) % this.filteredItems.length;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex = this.highlightedIndex <= 0 ? this.filteredItems.length - 1 : this.highlightedIndex - 1;
    }

    if (event.key === 'Enter' && this.highlightedIndex >= 0) {
      event.preventDefault();
      this.selectItem(this.filteredItems[this.highlightedIndex]);
    }

    if (event.key === 'Escape') {
      this.isOpen = false;
    }
  }

  selectItem(item: any): void {
    this.value = this.prefix + this.getItemValue(item);
    this.onChange(this.value);
    this.itemSelected.emit(item);
    this.isOpen = false;
    this.highlightedIndex = -1;
  }

  getItemLabel(item: any): string {
    if (item == null) {
      return '';
    }
    if (typeof item === 'string' || typeof item === 'number') {
      return `${item}`;
    }
    return `${item[this.labelField] ?? item[this.valueField] ?? ''}`;
  }

  getItemValue(item: any): string {
    if (item == null) {
      return '';
    }
    if (typeof item === 'string' || typeof item === 'number') {
      return `${item}`;
    }
    return `${item[this.valueField] ?? item[this.labelField] ?? ''}`;
  }

  trackByItem(_: number, item: any): string {
    return this.getItemValue(item);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.highlightedIndex = -1;
    }
  }
}