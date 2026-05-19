import { describe, it, expect, beforeEach, vi } from 'vitest';
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
      [format]="format()"
      [type]="timeType()"
      [customClass]="customClass()"
      (onTimeChange)="lastChange = $event"
    />
  `,
  imports: [PkTimepicker, FormsModule],
})
class TestHost {
  value      = '';
  format     = signal<PkTimeFormat>('hm');
  timeType   = signal<PkTimeType>('24H');
  customClass = signal('');
  lastChange = '';
}

function getComp(f: ComponentFixture<TestHost>): PkTimepicker {
  return f.debugElement.query(By.directive(PkTimepicker)).componentInstance as PkTimepicker;
}

function getVals(f: ComponentFixture<TestHost>): string[] {
  return f.debugElement.queryAll(By.css('.pk-tp__val'))
    .map(d => (d.nativeElement as HTMLElement).textContent?.trim() ?? '');
}

function clickArrow(f: ComponentFixture<TestHost>, index: number): void {
  const btns = f.debugElement.queryAll(By.css('.pk-tp__arrow'));
  (btns[index].nativeElement as HTMLButtonElement).click();
  f.detectChanges();
}

describe('PkTimepicker', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host    = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders hours and minutes with default "00" values', () => {
    const vals = getVals(fixture);
    expect(vals.length).toBe(2);
    expect(vals[0]).toBe('00');
    expect(vals[1]).toBe('00');
  });

  it('shows minutes column for format="hm" (default)', () => {
    const sep = fixture.debugElement.queryAll(By.css('.pk-tp__sep'));
    expect(sep.length).toBe(1);
  });

  it('hides seconds for format="hm"', () => {
    host.format.set('hm');
    fixture.detectChanges();
    expect(getVals(fixture).length).toBe(2);
  });

  it('shows seconds column for format="hms"', () => {
    host.format.set('hms');
    fixture.detectChanges();
    const vals = getVals(fixture);
    expect(vals.length).toBe(3);
    const seps = fixture.debugElement.queryAll(By.css('.pk-tp__sep'));
    expect(seps.length).toBe(2);
  });

  it('shows only hours for format="h"', () => {
    host.format.set('h');
    fixture.detectChanges();
    expect(getVals(fixture).length).toBe(1);
    expect(fixture.debugElement.queryAll(By.css('.pk-tp__sep')).length).toBe(0);
  });

  it('writeValue("14:30") sets hours=14, minutes=30', () => {
    getComp(fixture).writeValue('14:30');
    fixture.detectChanges();
    const vals = getVals(fixture);
    expect(vals[0]).toBe('14');
    expect(vals[1]).toBe('30');
  });

  it('writeValue("14:30:45") for hms sets all three columns', () => {
    host.format.set('hms');
    fixture.detectChanges();
    getComp(fixture).writeValue('14:30:45');
    fixture.detectChanges();
    const vals = getVals(fixture);
    expect(vals[0]).toBe('14');
    expect(vals[1]).toBe('30');
    expect(vals[2]).toBe('45');
  });

  it('writeValue("") resets all to "00"', () => {
    const comp = getComp(fixture);
    comp.writeValue('10:20');
    fixture.detectChanges();
    comp.writeValue('');
    fixture.detectChanges();
    const vals = getVals(fixture);
    expect(vals[0]).toBe('00');
    expect(vals[1]).toBe('00');
  });

  it('incrementH: clicking up-arrow on hours increments from 00 to 01', () => {
    // arrow index 0 = hours up
    clickArrow(fixture, 0);
    expect(getVals(fixture)[0]).toBe('01');
  });

  it('decrementH: wraps from 00 to 23', () => {
    // arrow index 1 = hours down
    clickArrow(fixture, 1);
    expect(getVals(fixture)[0]).toBe('23');
  });

  it('incrementM wraps from 59 to 00', () => {
    getComp(fixture)._m.set(59);
    fixture.detectChanges();
    // arrow index 2 = minutes up
    clickArrow(fixture, 2);
    expect(getVals(fixture)[1]).toBe('00');
  });

  it('12H mode: hour 0 displays as 12', async () => {
    host.timeType.set('12H');
    fixture.detectChanges();
    const vals = getVals(fixture);
    expect(vals[0]).toBe('12');
  });

  it('12H mode: hour 13 displays as 01', () => {
    host.timeType.set('12H');
    fixture.detectChanges();
    getComp(fixture).writeValue('13:00');
    fixture.detectChanges();
    expect(getVals(fixture)[0]).toBe('01');
  });

  it('12H mode: shows AM/PM button', () => {
    host.timeType.set('12H');
    fixture.detectChanges();
    const ampm = fixture.debugElement.query(By.css('.pk-tp__ampm'));
    expect(ampm).toBeTruthy();
    expect((ampm.nativeElement as HTMLElement).textContent?.trim()).toBe('AM');
  });

  it('toggleAmPm: switches h from AM zone to PM zone', () => {
    host.timeType.set('12H');
    fixture.detectChanges();
    getComp(fixture).writeValue('02:00'); // 2 AM
    fixture.detectChanges();
    const ampmBtn = fixture.debugElement.query(By.css('.pk-tp__ampm'));
    expect((ampmBtn.nativeElement as HTMLElement).textContent?.trim()).toBe('AM');
    (ampmBtn.nativeElement as HTMLButtonElement).click();
    fixture.detectChanges();
    expect((ampmBtn.nativeElement as HTMLElement).textContent?.trim()).toBe('PM');
  });

  it('setDisabledState(true) disables all buttons', () => {
    getComp(fixture).setDisabledState(true);
    fixture.detectChanges();
    const btns = fixture.debugElement.queryAll(By.css('.pk-tp__arrow'));
    btns.forEach(b => expect((b.nativeElement as HTMLButtonElement).disabled).toBe(true));
  });

  it('emits onTimeChange with hm value on increment', () => {
    clickArrow(fixture, 0); // increment hours
    expect(host.lastChange).toBe('01:00');
  });

  it('emits hms value for format="hms"', () => {
    host.format.set('hms');
    fixture.detectChanges();
    clickArrow(fixture, 0); // increment hours
    expect(host.lastChange).toBe('01:00:00');
  });

  it('emits just hours for format="h"', () => {
    host.format.set('h');
    fixture.detectChanges();
    clickArrow(fixture, 0); // increment hours
    expect(host.lastChange).toBe('01');
  });

  it('customClass is applied to container', () => {
    host.customClass.set('my-time');
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.pk-tp'));
    expect((container.nativeElement as HTMLElement).classList).toContain('my-time');
  });
});
