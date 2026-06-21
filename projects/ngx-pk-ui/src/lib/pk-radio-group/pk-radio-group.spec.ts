import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PkRadioGroup } from './pk-radio-group';
import type { PkRadioOption, PkRadioLayout } from './pk-radio-group';

const OPTIONS: PkRadioOption[] = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
];

@Component({
  template: `
    <pk-radio-group
      [options]="options()"
      [layout]="layout()"
      [customClass]="customClass()"
      (onChange)="last = $event"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [PkRadioGroup],
})
class TestHost {
  options     = signal<PkRadioOption[]>(OPTIONS);
  layout      = signal<PkRadioLayout>('vertical');
  customClass = signal('');
  last: any   = undefined;
}

function getComp(f: ComponentFixture<TestHost>): PkRadioGroup {
  return f.debugElement.query(By.directive(PkRadioGroup)).componentInstance as PkRadioGroup;
}

function getItems(f: ComponentFixture<TestHost>): HTMLElement[] {
  return f.debugElement.queryAll(By.css('.pk-rg__item')).map(d => d.nativeElement as HTMLElement);
}

describe('PkRadioGroup', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders correct number of items', () => {
    expect(getItems(fixture).length).toBe(3);
  });

  it('renders labels', () => {
    const labels = fixture.debugElement.queryAll(By.css('.pk-rg__label')).map(d => d.nativeElement.textContent.trim());
    expect(labels).toEqual(['Option A', 'Option B', 'Option C']);
  });

  it('selects an option on click', () => {
    getItems(fixture)[0].click();
    fixture.detectChanges();
    const comp = getComp(fixture);
    expect((comp as any)._value()).toBe('a');
  });

  it('adds --selected class to selected item', () => {
    getItems(fixture)[1].click();
    fixture.detectChanges();
    expect(getItems(fixture)[1].classList).toContain('pk-rg__item--selected');
    expect(getItems(fixture)[0].classList).not.toContain('pk-rg__item--selected');
  });

  it('emits onChange with selected value', () => {
    getItems(fixture)[1].click();
    fixture.detectChanges();
    expect(host.last).toBe('b');
  });

  it('calls registered CVA onChange fn', () => {
    const comp = getComp(fixture);
    const spy = vi.fn();
    comp.registerOnChange(spy);
    getItems(fixture)[0].click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('a');
  });

  it('calls onTouched on click', () => {
    const comp = getComp(fixture);
    const spy = vi.fn();
    comp.registerOnTouched(spy);
    getItems(fixture)[0].click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('writeValue sets selected value', () => {
    const comp = getComp(fixture);
    comp.writeValue('b');
    fixture.detectChanges();
    expect((comp as any)._value()).toBe('b');
    expect(getItems(fixture)[1].classList).toContain('pk-rg__item--selected');
  });

  it('writeValue with null/undefined sets null', () => {
    const comp = getComp(fixture);
    comp.writeValue(null);
    expect((comp as any)._value()).toBeNull();
    comp.writeValue(undefined);
    expect((comp as any)._value()).toBeNull();
  });

  it('setDisabledState disables all options', () => {
    const comp = getComp(fixture);
    comp.setDisabledState(true);
    fixture.detectChanges();
    expect((comp as any)._disabled()).toBe(true);
    expect(fixture.debugElement.query(By.css('.pk-rg--disabled'))).not.toBeNull();
  });

  it('disabled group: click does not change value', () => {
    const comp = getComp(fixture);
    comp.setDisabledState(true);
    fixture.detectChanges();
    // pointer-events: none prevents clicks in DOM, simulate directly
    (comp as any).select('a', false);
    expect((comp as any)._value()).toBeNull();
  });

  it('disabled option: click does not change value', () => {
    getItems(fixture)[2].click(); // option C is disabled
    fixture.detectChanges();
    expect((getComp(fixture) as any)._value()).toBeNull();
  });

  it('disabled option has --disabled class', () => {
    expect(getItems(fixture)[2].classList).toContain('pk-rg__item--disabled');
  });

  it('applies horizontal layout class', () => {
    host.layout.set('horizontal');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pk-rg--horizontal'))).not.toBeNull();
  });

  it('applies customClass', () => {
    host.customClass.set('my-custom');
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.pk-rg'));
    expect(container.nativeElement.classList).toContain('my-custom');
  });
});
