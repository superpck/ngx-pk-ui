import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PkTooltip } from './pk-tooltip.directive';

@Component({
  imports: [PkTooltip],
  template: `
    <button pkTooltip="Hello world" pkTooltipPosition="top" pkTooltipType="primary">Hover me</button>
  `,
})
class TestHost {}

@Component({
  imports: [PkTooltip],
  template: `<span pkTooltip="Bottom tip" pkTooltipPosition="bottom" pkTooltipType="success">text</span>`,
})
class TestHostBottom {}

@Component({
  imports: [PkTooltip],
  template: `<span pkTooltip="Danger!" pkTooltipPosition="right" pkTooltipType="danger">text</span>`,
})
class TestHostRight {}

describe('PkTooltip directive', () => {
  afterEach(() => {
    document.querySelectorAll('.pk-tooltip-box').forEach(el => el.remove());
  });

  describe('default (top / primary)', () => {
    let btnEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      btnEl = fixture.debugElement.query(By.directive(PkTooltip)).nativeElement as HTMLElement;
    });

    it('should not render tooltip initially', () => {
      expect(document.querySelector('.pk-tooltip-box')).toBeNull();
    });

    it('should show tooltip on mouseenter', () => {
      btnEl.dispatchEvent(new Event('mouseenter'));
      const tip = document.querySelector('.pk-tooltip-box');
      expect(tip).not.toBeNull();
      expect(tip?.textContent).toBe('Hello world');
    });

    it('should apply position class --top', () => {
      btnEl.dispatchEvent(new Event('mouseenter'));
      expect(document.querySelector('.pk-tooltip-box--top')).not.toBeNull();
    });

    it('should apply type class --primary', () => {
      btnEl.dispatchEvent(new Event('mouseenter'));
      expect(document.querySelector('.pk-tooltip-box--primary')).not.toBeNull();
    });

    it('should hide tooltip on mouseleave', () => {
      btnEl.dispatchEvent(new Event('mouseenter'));
      expect(document.querySelector('.pk-tooltip-box')).not.toBeNull();
      btnEl.dispatchEvent(new Event('mouseleave'));
      expect(document.querySelector('.pk-tooltip-box')).toBeNull();
    });

    it('should show tooltip on focusin and hide on focusout', () => {
      btnEl.dispatchEvent(new Event('focusin'));
      expect(document.querySelector('.pk-tooltip-box')).not.toBeNull();
      btnEl.dispatchEvent(new Event('focusout'));
      expect(document.querySelector('.pk-tooltip-box')).toBeNull();
    });

    it('should not create duplicate tooltips on repeated mouseenter', () => {
      btnEl.dispatchEvent(new Event('mouseenter'));
      btnEl.dispatchEvent(new Event('mouseenter'));
      expect(document.querySelectorAll('.pk-tooltip-box').length).toBe(1);
    });
  });

  describe('bottom / success', () => {
    let spanEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHostBottom);
      fixture.detectChanges();
      spanEl = fixture.debugElement.query(By.directive(PkTooltip)).nativeElement as HTMLElement;
    });

    it('should apply position class --bottom', () => {
      spanEl.dispatchEvent(new Event('mouseenter'));
      expect(document.querySelector('.pk-tooltip-box--bottom')).not.toBeNull();
    });

    it('should apply type class --success', () => {
      spanEl.dispatchEvent(new Event('mouseenter'));
      expect(document.querySelector('.pk-tooltip-box--success')).not.toBeNull();
    });
  });

  describe('right / danger', () => {
    let spanEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHostRight);
      fixture.detectChanges();
      spanEl = fixture.debugElement.query(By.directive(PkTooltip)).nativeElement as HTMLElement;
    });

    it('should apply position class --right', () => {
      spanEl.dispatchEvent(new Event('mouseenter'));
      expect(document.querySelector('.pk-tooltip-box--right')).not.toBeNull();
    });

    it('should apply type class --danger', () => {
      spanEl.dispatchEvent(new Event('mouseenter'));
      expect(document.querySelector('.pk-tooltip-box--danger')).not.toBeNull();
    });
  });
});
