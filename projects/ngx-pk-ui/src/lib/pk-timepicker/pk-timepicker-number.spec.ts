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
      inputType="number"
      [format]="format()"
      [type]="timeType()"
      (onTimeChange)="lastChange = $event"
    />
  `,
  imports: [PkTimepicker, FormsModule],
})
class TestHostNumber {
  value      = '';
  format     = signal<PkTimeFormat>('hm');
  timeType   = signal<PkTimeType>('24H');
  lastChange = '';
}

describe('PkTimepicker — number mode', () => {
  let fixture: ComponentFixture<TestHostNumber>;
  let host: TestHostNumber;

  function getComp(): PkTimepicker {
    return fixture.debugElement.query(By.directive(PkTimepicker)).componentInstance as PkTimepicker;
  }
  function getInputs(): HTMLInputElement[] {
    return fixture.debugElement.queryAll(By.css('.pk-tp__input'))
      .map(d => d.nativeElement as HTMLInputElement);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostNumber] }).compileComponents();
    fixture = TestBed.createComponent(TestHostNumber);
    host    = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders text inputs instead of spinner columns', () => {
    expect(getInputs().length).toBe(2);
    expect(fixture.debugElement.queryAll(By.css('.pk-tp__col')).length).toBe(0);
  });

  it('inputs show "00" by default', () => {
    const inputs = getInputs();
    expect(inputs[0].value).toBe('00');
    expect(inputs[1].value).toBe('00');
  });

  it('writeValue updates both inputs', () => {
    getComp().writeValue('09:45');
    fixture.detectChanges();
    const inputs = getInputs();
    expect(inputs[0].value).toBe('09');
    expect(inputs[1].value).toBe('45');
  });

  it('shows only hours input for format="h"', () => {
    host.format.set('h');
    fixture.detectChanges();
    expect(getInputs().length).toBe(1);
  });

  it('shows three inputs for format="hms"', () => {
    host.format.set('hms');
    fixture.detectChanges();
    expect(getInputs().length).toBe(3);
  });

  it('typing in hours input and blurring emits correct value', () => {
    const input = getInputs()[0];
    input.value = '14';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(host.lastChange).toBe('14:00');
  });

  it('typing in minutes input and blurring emits correct value', () => {
    getComp().writeValue('08:00');
    fixture.detectChanges();
    const input = getInputs()[1];
    input.value = '30';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(host.lastChange).toBe('08:30');
  });

  it('reverts hours to previous value when input is out of range (e.g. 25)', () => {
    const comp = getComp();
    comp.writeValue('10:00');
    fixture.detectChanges();
    const input = getInputs()[0];
    input.value = '25';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(comp._h()).toBe(10); // reverted to original
  });

  it('reverts minutes to previous value when input is out of range (e.g. 61)', () => {
    const comp = getComp();
    comp.writeValue('00:30');
    fixture.detectChanges();
    const input = getInputs()[1];
    input.value = '61';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(comp._m()).toBe(30); // reverted to 30, not clamped to 59
  });

  it('shows AM/PM button in 12H mode', () => {
    host.timeType.set('12H');
    fixture.detectChanges();
    const ampm = fixture.debugElement.query(By.css('.pk-tp__ampm'));
    expect(ampm).toBeTruthy();
  });
});
