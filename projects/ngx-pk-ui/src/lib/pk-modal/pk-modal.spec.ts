import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { By } from '@angular/platform-browser';
import { PkModal } from './pk-modal';
import { PkModalHeader } from './pk-modal-header';
import { PkModalBody } from './pk-modal-body';
import { PkModalFooter } from './pk-modal-footer';
import type { PkModalSize } from './pk-modal.model';

@Component({
  selector: 'test-host',
  imports: [PkModal, PkModalHeader, PkModalBody, PkModalFooter],
  template: `
    <pk-modal
      [openModal]="open()"
      [closeMarker]="closeable()"
      [closeAny]="closeable()"
      [blur]="blur()"
      [size]="size()"
      [customClass]="customClass()"
      [lockScroll]="lockScroll()"
      (onClose)="handleClose()"
    >
      <pk-modal-header>Test Header</pk-modal-header>
      <pk-modal-body>Test Body</pk-modal-body>
      <pk-modal-footer>Test Footer</pk-modal-footer>
    </pk-modal>
  `,
})
class TestHost {
  open        = signal(false);
  closeable   = signal(true);
  blur        = signal(true);
  size        = signal<PkModalSize>('md');
  customClass = signal<string | null>(null);
  lockScroll  = signal(true);
  closeCount  = signal(0);
  handleClose() { this.closeCount.update(n => n + 1); }
}

describe('PkModal', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let doc: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host    = fixture.componentInstance;
    doc     = TestBed.inject(DOCUMENT);
    fixture.detectChanges();
  });

  afterEach(() => {
    // clean up scroll-lock side effects between tests
    doc.body.style.overflow = '';
    doc.body.style.paddingRight = '';
  });

  it('should not render overlay when openModal is false', () => {
    expect(fixture.debugElement.query(By.css('.pk-modal-overlay'))).toBeNull();
  });

  it('should render overlay when openModal is true', () => {
    host.open.set(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pk-modal-overlay'))).not.toBeNull();
  });

  it('should render all projected slots', () => {
    host.open.set(true);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Test Header');
    expect(text).toContain('Test Body');
    expect(text).toContain('Test Footer');
  });

  it('should show close button when closeAble is true', () => {
    host.open.set(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pk-modal-close-btn'))).not.toBeNull();
  });

  it('should hide close button when closeAble is false', () => {
    host.open.set(true);
    host.closeable.set(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pk-modal-close-btn'))).toBeNull();
  });

  it('should emit onClose when close button is clicked', () => {
    host.open.set(true);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.pk-modal-close-btn')).triggerEventHandler('click', {});
    expect(host.closeCount()).toBe(1);
  });

  it('should emit onClose when overlay is clicked and closeAble is true', () => {
    host.open.set(true);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.pk-modal-overlay')).triggerEventHandler('click', {});
    expect(host.closeCount()).toBe(1);
  });

  it('should NOT emit onClose when overlay clicked and closeAble is false', () => {
    host.open.set(true);
    host.closeable.set(false);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.pk-modal-overlay')).triggerEventHandler('click', {});
    expect(host.closeCount()).toBe(0);
  });

  it('should apply blur class when blur is true', () => {
    host.open.set(true);
    fixture.detectChanges();
    const overlay = fixture.debugElement.query(By.css('.pk-modal-overlay')).nativeElement as HTMLElement;
    expect(overlay.classList).toContain('pk-modal-overlay--blur');
  });

  it('should NOT apply blur class when blur is false', () => {
    host.open.set(true);
    host.blur.set(false);
    fixture.detectChanges();
    const overlay = fixture.debugElement.query(By.css('.pk-modal-overlay')).nativeElement as HTMLElement;
    expect(overlay.classList).not.toContain('pk-modal-overlay--blur');
  });

  it('should apply correct size class to dialog', () => {
    host.open.set(true);
    host.size.set('lg');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pk-modal-dialog--lg'))).not.toBeNull();
  });

  it('should apply customClass to dialog', () => {
    host.open.set(true);
    host.customClass.set('my-modal');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.my-modal'))).not.toBeNull();
  });

  // ── Scroll lock ───────────────────────────────────────────

  it('should set body overflow:hidden when modal opens (lockScroll=true)', () => {
    host.open.set(true);
    fixture.detectChanges();
    expect(doc.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow when modal closes', () => {
    host.open.set(true);
    fixture.detectChanges();
    host.open.set(false);
    fixture.detectChanges();
    expect(doc.body.style.overflow).toBe('');
  });

  it('should NOT lock body when lockScroll=false', () => {
    host.lockScroll.set(false);
    host.open.set(true);
    fixture.detectChanges();
    expect(doc.body.style.overflow).not.toBe('hidden');
  });

  it('should restore body if component is destroyed while modal is open', () => {
    host.open.set(true);
    fixture.detectChanges();
    expect(doc.body.style.overflow).toBe('hidden');
    fixture.destroy();
    expect(doc.body.style.overflow).toBe('');
  });
});
