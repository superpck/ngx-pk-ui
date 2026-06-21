import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PkQrcode } from './pk-qrcode';
import type { PkQrEcLevel } from './pk-qrcode.model';
import { encodeQr } from './pk-qrcode-encoder';

@Component({
  template: `<pk-qrcode [value]="value()" [ecLevel]="ecLevel()" [logo]="logo()" [size]="200" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
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

  it('EC=L v6 (byte mode, >108 bytes): produces correct matrix size', () => {
    // 110 lowercase bytes forces byte mode → needs version 6 with EC=L (previously buggy)
    const text = 'a'.repeat(110);
    const m = encodeQr(text, 'L');
    expect(m.length).toBe(41); // version 6 → 6*4+17 = 41
    expect(m.every(row => row.length === 41)).toBe(true);
  });

  it('EC=L v9 (byte mode, >136 bytes): all modules are boolean', () => {
    // 200 lowercase bytes forces byte mode → needs version 9 with EC=L (previously buggy)
    const text = 'a'.repeat(200);
    const m = encodeQr(text, 'L');
    expect(m.length).toBe(53); // version 9 → 9*4+17 = 53
    // All modules must be true/false (no nulls left from truncated interleave)
    expect(m.every(row => row.every(cell => typeof cell === 'boolean'))).toBe(true);
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
