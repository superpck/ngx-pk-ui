import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PkTimepicker } from './pk-timepicker';
import type { PkTimeFormat, PkTimeType } from './pk-timepicker.model';

@Component({
  template: `
    <pk-timepicker
      [(ngModel)]="value"
      inputType="dropdown"
      [format]="format()"
      [type]="timeType()"
      (onTimeChange)="lastChange = $event"
    />
  `,
  imports: [PkTimepicker, FormsModule],
})
class TestHostDropdown {
  value      = '';
  format     = signal<PkTimeFormat>('hm');
  timeType   = signal<PkTimeType>('24H');
  lastChange = '';
}

describe('PkTimepicker — dropdown mode', () => {
  let fixture: ComponentFixture<TestHostDropdown>;
  let host: TestHostDropdown;

  function getComp(): PkTimepicker {
    return fixture.debugElement.query(By.directive(PkTimepicker)).componentInstance as PkTimepicker;
  }
  function getSelects(): HTMLSelectElement[] {
    return fixture.debugElement.queryAll(By.css('.pk-tp__select'))
      .map(d => d.nativeElement as HTMLSelectElement);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostDropdown] }).compileComponents();
    fixture = TestBed.createComponent(TestHostDropdown);
    host    = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders select elements instead of spinner columns', () => {
    expect(getSelects().length).toBe(2);
    expect(fixture.debugElement.queryAll(By.css('.pk-tp__col')).length).toBe(0);
  });

  it('hours select has 24 options in 24H mode', () => {
    const select = getSelects()[0];
    expect(select.options.length).toBe(24);
    expect(select.options[0].value).toBe('00');
    expect(select.options[23].value).toBe('23');
  });

  it('hours select has 12 options in 12H mode', () => {
    host.timeType.set('12H');
    fixture.detectChanges();
    const select = getSelects()[0];
    expect(select.options.length).toBe(12);
    expect(select.options[0].value).toBe('01');
    expect(select.options[11].value).toBe('12');
  });

  it('minutes select has 60 options', () => {
    const select = getSelects()[1];
    expect(select.options.length).toBe(60);
    expect(select.options[0].value).toBe('00');
    expect(select.options[59].value).toBe('59');
  });

  it('shows only hours select for format="h"', () => {
    host.format.set('h');
    fixture.detectChanges();
    expect(getSelects().length).toBe(1);
  });

  it('shows three selects for format="hms"', () => {
    host.format.set('hms');
    fixture.detectChanges();
    expect(getSelects().length).toBe(3);
  });

  it('writeValue pre-selects correct options', () => {
    getComp().writeValue('14:30');
    fixture.detectChanges();
    const selects = getSelects();
    const selectedH = Array.from(selects[0].options).find(o => o.selected)?.value;
    const selectedM = Array.from(selects[1].options).find(o => o.selected)?.value;
    expect(selectedH).toBe('14');
    expect(selectedM).toBe('30');
  });

  it('changing hours select emits correct value', () => {
    const select = getSelects()[0];
    select.value = '09';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(host.lastChange).toBe('09:00');
  });

  it('changing minutes select emits correct value', () => {
    getComp().writeValue('08:00');
    fixture.detectChanges();
    const select = getSelects()[1];
    select.value = '45';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(host.lastChange).toBe('08:45');
  });
});
