import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PkQrcode } from './pk-qrcode';
import type { PkQrEcLevel } from './pk-qrcode.model';
import { encodeQr } from './pk-qrcode-encoder';

@Component({
  template: `<pk-qrcode [value]="value()" [ecLevel]="ecLevel()" [logo]="logo()" [size]="200" />`,
  imports: [PkQrcode],
})
class TestHost {
  value   = signal('Hello World');
  ecLevel = signal<PkQrEcLevel>('M');
  logo    = signal<string | null>(null);
}

function getComp(f: ComponentFixture<TestHost>): PkQrcode {
  return f.debugElement.query(By.directive(PkQrcode)).componentInstance;
}

describe('encodeQr — matrix structure', () => {
  it('produces 21×21 matrix for version 1', () => {
    const m = encodeQr('Hi', 'L');
    expect(m.length).toBe(21);
    expect(m[0].length).toBe(21);
  });

  it('produces 21×21 matrix for "Hello World" at M (version 1)', () => {
    const m = encodeQr('Hello World', 'M');
    expect(m.length).toBe(21);
  });

  it('top-left finder: (0,0) is dark', () => {
    const m = encodeQr('A', 'L');
    expect(m[0][0]).toBe(true);
  });

  it('top-left finder: (1,1) is light (inner separator)', () => {
    const m = encodeQr('A', 'L');
    expect(m[1][1]).toBe(false);
  });

  it('H level produces larger matrix than L for same text', () => {
    const mL = encodeQr('Hello', 'L');
    const mH = encodeQr('Hello', 'H');
    expect(mH.length).toBeGreaterThanOrEqual(mL.length);
  });

  it('dark module at (size-8, 8) is always dark', () => {
    const m = encodeQr('TEST', 'M');
    expect(m[m.length - 8][8]).toBe(true);
  });

  it('throws for data exceeding version 40 capacity', () => {
    const huge = 'A'.repeat(3000);
    expect(() => encodeQr(huge, 'H')).toThrow();
  });
});

describe('PkQrcode — component', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders SVG', () => {
    expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
  });

  it('SVG has a <path> with non-empty d attribute', () => {
    const path = fixture.nativeElement.querySelector('path');
    expect(path).toBeTruthy();
    expect(path.getAttribute('d').length).toBeGreaterThan(0);
  });

  it('shows error for empty value', () => {
    host.value.set('');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.pk-qr__error')).toBeTruthy();
  });

  it('adds <image> element when logo is set', () => {
    host.logo.set('https://example.com/logo.png');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('image')).toBeTruthy();
  });

  it('auto-upgrades ecLevel to Q when logo is set', () => {
    host.logo.set('https://example.com/logo.png');
    host.ecLevel.set('L');
    fixture.detectChanges();
    const comp = getComp(fixture);
    expect(comp._effectiveEcLevel()).toBe('Q');
  });
});
