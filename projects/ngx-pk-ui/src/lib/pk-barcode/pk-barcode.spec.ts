import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PkBarcode } from './pk-barcode';
import type { PkBarcodeFormat } from './pk-barcode.model';
import { encodeBarcode } from './pk-barcode-encoder';

@Component({
  template: `<pk-barcode [value]="value()" [format]="format()" [showText]="showText()" />`,
  imports: [PkBarcode],
})
class TestHost {
  value   = signal('HELLO');
  format  = signal<PkBarcodeFormat>('code128');
  showText = signal(true);
}

function getComp(f: ComponentFixture<TestHost>): PkBarcode {
  return f.debugElement.query(By.directive(PkBarcode)).componentInstance;
}

describe('PkBarcode — encoder', () => {
  it('Code 128: encodes printable ASCII', () => {
    const bars = encodeBarcode('ABC', 'code128');
    expect(bars.length).toBeGreaterThan(0);
    expect(bars.some(b => b.dark)).toBe(true);
  });

  it('Code 128: throws on non-printable char', () => {
    expect(() => encodeBarcode('\x01', 'code128')).toThrow();
  });

  it('Code 39: auto-uppercases and encodes', () => {
    const bars = encodeBarcode('hello', 'code39');
    expect(bars.length).toBeGreaterThan(0);
    const bars2 = encodeBarcode('HELLO', 'code39');
    expect(bars.length).toBe(bars2.length);
  });

  it('Code 39: throws on unsupported char', () => {
    expect(() => encodeBarcode('hello!', 'code39')).toThrow();
  });

  it('EAN-13: accepts 13 valid digits', () => {
    const bars = encodeBarcode('5901234123457', 'ean13');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('EAN-13: auto-computes checksum for 12 digits', () => {
    const bars = encodeBarcode('590123412345', 'ean13');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('EAN-13: throws on invalid checksum', () => {
    expect(() => encodeBarcode('5901234123450', 'ean13')).toThrow();
  });

  it('EAN-8: accepts 8 valid digits', () => {
    const bars = encodeBarcode('96385074', 'ean8');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('EAN-8: auto-computes checksum for 7 digits', () => {
    const bars = encodeBarcode('9638507', 'ean8');
    expect(bars.length).toBeGreaterThan(0);
  });
});

describe('PkBarcode — component', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders SVG for valid value', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('has positive width and height', () => {
    const comp = getComp(fixture);
    expect(comp._svgWidth()).toBeGreaterThan(0);
    expect(comp._svgHeight()).toBeGreaterThan(0);
  });

  it('shows text element when showText=true', () => {
    const text = fixture.nativeElement.querySelector('text');
    expect(text).toBeTruthy();
  });

  it('hides text element when showText=false', () => {
    host.showText.set(false);
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('text');
    expect(text).toBeFalsy();
  });

  it('shows error for empty value', () => {
    host.value.set('');
    fixture.detectChanges();
    const err = fixture.nativeElement.querySelector('.pk-bc__error');
    expect(err).toBeTruthy();
  });

  it('EAN-13 format works', () => {
    host.value.set('5901234123457');
    host.format.set('ean13');
    fixture.detectChanges();
    const comp = getComp(fixture);
    expect(comp._error()).toBeNull();
  });
});
