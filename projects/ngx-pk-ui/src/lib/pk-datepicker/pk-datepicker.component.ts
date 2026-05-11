/*
  pk-datepicker is a component used as a replacement for input type="date"

  Usage:
    <pk-datepicker [..] ..></pk-datepicker>

  Input parameters:
    disabled: true | false (default false) - prevents the user from selecting a date
    setNull: true | false (default true) - allows the value to be set to null
    dateInput: true | false (default true) - allows manual text input of a date
    locale: TH | EN (default TH)
    startOfWeek: 'monday' | 'sunday' = 'monday'
    minDate: Date | null - defines the earliest selectable date
    maxDate: Date | null - defines the latest selectable date
    [(ngModel)]="dateInput: Date" - sets the initial date value
    style= "width: 140px;"

  Output:
    (onDateChange): Date

  Features:
    1. If minDate is not specified, the year picker allows going back 20 years; if maxDate is not specified, it allows going forward 10 years.
    2. Holidays are displayed using data from mainService.getHoliday.
*/

import { Component, Input, Output, EventEmitter, forwardRef, OnInit, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { NgStyle } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DatepickerService } from './datepicker.service';
import { HolidayService } from './holiday.service';
import { Subscription } from 'rxjs';

interface Holiday {
  date: Date;
  title: string;
}

@Component({
  selector: 'pk-datepicker',
  templateUrl: './pk-datepicker.component.html',
  styleUrls: ['./pk-datepicker.component.scss'],
  imports: [FormsModule, NgStyle],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PkDatepickerComponent),
      multi: true
    }
  ],
  standalone: true
})
export class PkDatepickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() disabled: boolean = false;
  @Input() setNull: boolean = true;
  @Input() dateInput: boolean = true;
  @Input() locale: string = 'TH';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() startOfWeek: 'monday' | 'sunday' = 'monday';
  @Input() style: string | null = null;
  @Input() placeholder: string = '';
  @Output() onDateChange = new EventEmitter<Date | null>();

  private holidays: Holiday[] = [];
  private innerValue: Date | null = null;
  public isOpen: boolean = false;
  public currentMonth: Date = new Date();
  public daysInMonth: Date[] = [];
  public weekdays: string[] = [];
  public months: { name: string, value: number }[] = [];
  public years: number[] = [];
  public selectedMonth: number = new Date().getMonth();
  public selectedYear: number = new Date().getFullYear();
  public dropdownStyles: Record<string, string> = {};

  private onChange: (value: Date | null) => void = () => { };
  private onTouched: () => void = () => { };
  private subscription?: Subscription;

  get localeMode(): 'TH' | 'EN' {
    return String(this.locale || '').trim().toUpperCase() === 'TH' ? 'TH' : 'EN';
  }

  constructor(
    private elementRef: ElementRef,
    private datepickerService: DatepickerService,
    private holidayService: HolidayService
  ) { }

  ngOnInit(): void {
    this.currentMonth = this.innerValue ? new Date(this.innerValue) : new Date();
    this.currentMonth.setDate(1);
    this.adjustCurrentMonthToRange();
    this.selectedMonth = this.currentMonth.getMonth();
    this.selectedYear = this.localeMode === 'TH'
      ? this.currentMonth.getFullYear() + 543
      : this.currentMonth.getFullYear();
    this.fetchHolidays(this.currentMonth.getFullYear());
    this.updateCalendar();
    this.generateMonths();
    this.generateYears();

    this.subscription = this.datepickerService.getActiveDatepicker().subscribe(activeComponent => {
      if (activeComponent !== this && this.isOpen) {
        this.isOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isOpen) {
      this.updateDropdownPosition();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.isOpen) {
      this.updateDropdownPosition();
    }
  }

  get value(): Date | null {
    return this.innerValue;
  }

  set value(val: Date | null) {
    if (val !== this.innerValue && this.isDateInRange(val)) {
      this.innerValue = val;
      this.onChange(val);
      this.onDateChange.emit(val);
      this.currentMonth = new Date(val || new Date());
      this.currentMonth.setDate(1);
      this.adjustCurrentMonthToRange();
      this.selectedMonth = this.currentMonth.getMonth();
      this.selectedYear = this.localeMode === 'TH'
        ? this.currentMonth.getFullYear() + 543
        : this.currentMonth.getFullYear();
      this.fetchHolidays(this.currentMonth.getFullYear());
      this.updateCalendar();
    }
  }

  get formattedDate(): string {
    if (!this.innerValue) return '';

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };

    return this.localeMode === 'TH'
      ? this.innerValue.toLocaleDateString('th-TH', { ...options, year: 'numeric' })
      : this.innerValue.toLocaleDateString('en-US', options);
  }

  get currentMonthYear(): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    };
    return this.localeMode === 'TH'
      ? this.currentMonth.toLocaleDateString('th-TH', options)
      : this.currentMonth.toLocaleDateString('en-US', options);
  }

  get isTodayDisabled(): boolean {
    return this.disabled || !this.isDateInRange(new Date());
  }

  get canGoPrevMonth(): boolean {
    if (this.disabled || !this.minDate) return true;
    const prevMonth = new Date(this.currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return prevMonth.getTime() >= this.minDate.getTime();
  }

  get canGoNextMonth(): boolean {
    if (this.disabled || !this.maxDate) return true;
    const nextMonth = new Date(this.currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.getTime() <= this.maxDate.getTime();
  }

  updateCalendar(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);

    if (this.startOfWeek === 'monday') {
      this.weekdays = this.localeMode === 'TH'
        ? ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else {
      this.weekdays = this.localeMode === 'TH'
        ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }

    this.daysInMonth = [];
    const firstDayOfMonth = this.currentMonth.getDay();
    const daysInMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0).getDate();
    const startOffset = this.startOfWeek === 'monday' ? (firstDayOfMonth + 6) % 7 : firstDayOfMonth;

    for (let i = startOffset - 1; i >= 0; i--) {
      const prevDate = new Date(this.currentMonth);
      prevDate.setDate(this.currentMonth.getDate() - i - 1);
      this.daysInMonth.push(prevDate);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const newDate = new Date(this.currentMonth);
      newDate.setDate(i);
      this.daysInMonth.push(newDate);
    }

    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    for (let i = daysInMonth + 1; this.daysInMonth.length < totalCells; i++) {
      const nextDate = new Date(this.currentMonth);
      nextDate.setDate(i);
      this.daysInMonth.push(nextDate);
    }
  }

  generateMonths(): void {
    this.months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2000, i, 1);
      return {
        name: date.toLocaleString(this.localeMode === 'TH' ? 'th-TH' : 'en-US', { month: 'long' }),
        value: i
      };
    });
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    let minYear: number;
    let maxYear: number;

    if (this.minDate && this.maxDate) {
      minYear = this.minDate.getFullYear();
      maxYear = this.maxDate.getFullYear();
    } else {
      minYear = currentYear - 20;
      maxYear = currentYear + 10;
    }

    this.years = [];
    for (let i = minYear; i <= maxYear; i++) {
      this.years.push(this.localeMode === 'TH' ? i + 543 : i);
    }
  }

  fetchHolidays(year: number): void {
    // No adjustment needed, year is already Gregorian
    this.holidayService.getHolidays(year).subscribe(holidays => {
      this.holidays = holidays;
      this.updateCalendar();
    });
  }

  onMonthChange(month: number): void {
    this.selectedMonth = month;
    this.currentMonth = new Date(this.currentMonth.getFullYear(), month, 1);
    this.adjustCurrentMonthToRange();
    this.selectedYear = this.localeMode === 'TH'
      ? this.currentMonth.getFullYear() + 543
      : this.currentMonth.getFullYear();
    this.fetchHolidays(this.currentMonth.getFullYear());
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    const adjustedYear = this.localeMode === 'TH' ? year - 543 : year;
    this.currentMonth = new Date(adjustedYear, this.currentMonth.getMonth(), 1);
    this.adjustCurrentMonthToRange();
    this.fetchHolidays(adjustedYear);
  }

  onChangeDate(event: any): void {
    let inputValue = event.target.value;

    // Convert Buddhist Era (B.E.) year to Common Era (C.E.) when locale is TH
    if (this.localeMode === 'TH' && inputValue) {
      // Validate DD/MM/YYYY format (TH locale format)
      const thaiDatePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const match = inputValue.match(thaiDatePattern);

      if (match) {
        const day = match[1];
        const month = match[2];
        const year = parseInt(match[3]);

        // Convert B.E. to C.E. if year is greater than 2400
        if (year > 2400) {
          inputValue = `${year - 543}-${month}-${day}`;
        }
      }
    }

    const date = new Date(inputValue);
    if (!date || isNaN(date.getTime())) {
      return;
    }

    if (this.isDateInRange(date)) {
      // this.onDateChange.emit(date);
      this.value = date;
      // this.currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      // this.selectedMonth = this.currentMonth.getMonth();
      // this.selectedYear = this.locale === 'TH'
      //   ? this.currentMonth.getFullYear() + 543
      //   : this.currentMonth.getFullYear();
      // this.fetchHolidays(this.currentMonth.getFullYear());
      // this.updateCalendar();
      this.isOpen = false;
      this.onTouched();
    } else {
      event.target.value = this.formattedDate; // Reset to formatted date if out of range
    }
  }
  resetDate(): void {
    this.value = null;
    this.isOpen = false;
    this.onTouched();
  }

  prevMonth(): void {
    if (this.canGoPrevMonth) {
      this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
      this.selectedMonth = this.currentMonth.getMonth();
      this.selectedYear = this.localeMode === 'TH'
        ? this.currentMonth.getFullYear() + 543
        : this.currentMonth.getFullYear();
      this.adjustCurrentMonthToRange();
      this.fetchHolidays(this.currentMonth.getFullYear());
    }
  }

  nextMonth(): void {
    if (this.canGoNextMonth) {
      this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
      this.selectedMonth = this.currentMonth.getMonth();
      this.selectedYear = this.localeMode === 'TH'
        ? this.currentMonth.getFullYear() + 543
        : this.currentMonth.getFullYear();
      this.adjustCurrentMonthToRange();
      this.fetchHolidays(this.currentMonth.getFullYear());
    }
  }

  selectToday(): void {
    const today = new Date();
    if (this.isDateInRange(today)) {
      this.value = today;
      this.currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      this.selectedMonth = this.currentMonth.getMonth();
      this.selectedYear = this.localeMode === 'TH'
        ? this.currentMonth.getFullYear() + 543
        : this.currentMonth.getFullYear();
      this.fetchHolidays(this.currentMonth.getFullYear());
      this.updateCalendar();
      this.isOpen = false;
      this.onTouched();
    }
  }

  writeValue(value: Date | null): void {
    if (this.isDateInRange(value)) {
      this.innerValue = value;
      if (value) {
        this.currentMonth = new Date(value.getFullYear(), value.getMonth(), 1);
      } else {
        this.currentMonth = new Date();
        this.currentMonth.setDate(1);
        this.adjustCurrentMonthToRange();
      }
      this.selectedMonth = this.currentMonth.getMonth();
      this.selectedYear = this.localeMode === 'TH'
        ? this.currentMonth.getFullYear() + 543
        : this.currentMonth.getFullYear();
      this.fetchHolidays(this.currentMonth.getFullYear());
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDateSelect(date: Date): void {
    if (this.isDateInRange(date)) {
      this.value = date;
      this.isOpen = false;
      this.onTouched();
    }
  }

  togglePicker(event: Event): void {
    if (!this.disabled) {
      if (!this.isOpen) {
        this.datepickerService.openDatepicker(this);
      }
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        setTimeout(() => this.updateDropdownPosition(), 0);
      }
      event.stopPropagation();
    }
  }

  private updateDropdownPosition(): void {
    const inputEl = this.elementRef.nativeElement.querySelector('.datepicker-input') as HTMLElement | null;
    if (!inputEl) return;

    const rect = inputEl.getBoundingClientRect();
    const margin = 8;
    const dropdownWidth = 270;
    const dropdownHeight = 360;

    let left = rect.left;
    let top = rect.bottom + 4;

    if (left + dropdownWidth + margin > window.innerWidth) {
      left = window.innerWidth - dropdownWidth - margin;
    }
    if (left < margin) {
      left = margin;
    }

    if (top + dropdownHeight + margin > window.innerHeight && rect.top - dropdownHeight > margin) {
      top = rect.top - dropdownHeight - 4;
    }
    if (top < margin) {
      top = margin;
    }

    this.dropdownStyles = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: '2147483647'
    };
  }

  isSelected(date: Date): boolean {
    return this.innerValue?.toDateString() === date.toDateString();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth.getMonth() &&
      date.getFullYear() === this.currentMonth.getFullYear();
  }

  isDateInRange(date: Date | null): boolean {
    if (!date) return true;
    const time = date.getTime();
    const minTime = this.minDate
      ? new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate(), 0, 0, 0, 0).getTime()
      : null;
    const maxTime = this.maxDate
      ? new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), this.maxDate.getDate(), 23, 59, 59, 999).getTime()
      : null;

    return (minTime === null || time >= minTime) &&
      (maxTime === null || time <= maxTime);
  }

  isMonthDisabled(month: number): boolean {
    if (!this.minDate && !this.maxDate) return false;
    const year = this.localeMode === 'TH' ? this.selectedYear - 543 : this.selectedYear;
    const startOfMonth = new Date(year, month, 1).getTime();
    const endOfMonth = new Date(year, month + 1, 0).getTime();

    const beforeMin = this.minDate ? endOfMonth < this.minDate.getTime() : false;
    const afterMax = this.maxDate ? startOfMonth > this.maxDate.getTime() : false;
    return beforeMin || afterMax;
  }

  isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  isExplicitHoliday(date: Date): boolean {
    return this.holidays.some(holiday =>
      holiday.date.getFullYear() === date.getFullYear() &&
      holiday.date.getMonth() === date.getMonth() &&
      holiday.date.getDate() === date.getDate()
    );
  }

  getHolidayTitle(date: Date): string {
    const holiday = this.holidays.find(h =>
      h.date.getFullYear() === date.getFullYear() &&
      h.date.getMonth() === date.getMonth() &&
      h.date.getDate() === date.getDate()
    );
    return holiday ? holiday.title : '';
  }

  adjustCurrentMonthToRange(): void {
    if (this.minDate && this.currentMonth.getTime() < this.minDate.getTime()) {
      this.currentMonth = new Date(this.minDate);
      this.currentMonth.setDate(1);
    }
    if (this.maxDate && this.currentMonth.getTime() > this.maxDate.getTime()) {
      this.currentMonth = new Date(this.maxDate);
      this.currentMonth.setDate(1);
    }
  }
}