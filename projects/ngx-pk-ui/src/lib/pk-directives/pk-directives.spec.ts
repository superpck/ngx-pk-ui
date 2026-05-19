import { Component } from '@angular/core';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { PkClickOutsideDirective } from './pk-click-outside.directive';
import { PkCopyToClipboardDirective } from './pk-copy-to-clipboard.directive';
import { PkAutoFocusDirective } from './pk-auto-focus.directive';
import { PkDebounceClickDirective } from './pk-debounce-click.directive';
import { PkNumberOnlyDirective } from './pk-number-only.directive';

// ---------------------------------------------------------------------------
// PkClickOutsideDirective
// ---------------------------------------------------------------------------

describe('PkClickOutsideDirective', () => {
  @Component({
    template: `<div pkClickOutside (pkClickOutside)="onOutside()"><span id="inner">inner</span></div>`,
    imports: [PkClickOutsideDirective],
  })
  class TestHost {
    calls = 0;
    onOutside() { this.calls++; }
  }

  it('emits when clicking outside the host', () => {
    const fix = TestBed.createComponent(TestHost);
    fix.detectChanges();
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(fix.componentInstance.calls).toBe(1);
  });

  it('does NOT emit when clicking inside the host', () => {
    const fix = TestBed.createComponent(TestHost);
    fix.detectChanges();
    const inner = fix.nativeElement.querySelector('#inner') as HTMLElement;
    inner.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(fix.componentInstance.calls).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// PkCopyToClipboardDirective
// ---------------------------------------------------------------------------

describe('PkCopyToClipboardDirective', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });

  @Component({
    template: `<button pkCopyToClipboard="hello" (pkCopied)="onCopied($event)">Copy</button>`,
    imports: [PkCopyToClipboardDirective],
  })
  class TestHost {
    result: boolean | undefined;
    onCopied(v: boolean) { this.result = v; }
  }

  it('calls clipboard.writeText with the correct text', async () => {
    const fix = TestBed.createComponent(TestHost);
    fix.detectChanges();
    const btn = fix.nativeElement.querySelector('button') as HTMLElement;
    btn.click();
    await Promise.resolve(); // flush micro-task
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello');
  });

  it('emits true on successful copy', async () => {
    const fix = TestBed.createComponent(TestHost);
    fix.detectChanges();
    const btn = fix.nativeElement.querySelector('button') as HTMLElement;
    btn.click();
    await Promise.resolve();
    fix.detectChanges();
    expect(fix.componentInstance.result).toBe(true);
  });

  it('emits false on clipboard failure', async () => {
    (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('denied'));
    const fix = TestBed.createComponent(TestHost);
    fix.detectChanges();
    const btn = fix.nativeElement.querySelector('button') as HTMLElement;
    btn.click();
    await Promise.resolve();
    fix.detectChanges();
    expect(fix.componentInstance.result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// PkAutoFocusDirective
// ---------------------------------------------------------------------------

describe('PkAutoFocusDirective', () => {
  @Component({
    template: `<input [pkAutoFocus]="true" />`,
    imports: [PkAutoFocusDirective],
  })
  class TestHostEnabled {}

  @Component({
    template: `<input [pkAutoFocus]="false" />`,
    imports: [PkAutoFocusDirective],
  })
  class TestHostDisabled {}

  it('focuses the element after view init', () => {
    vi.useFakeTimers();
    const fix = TestBed.createComponent(TestHostEnabled);
    const input = fix.nativeElement.querySelector('input') as HTMLElement;
    const spy = vi.spyOn(input, 'focus');
    fix.detectChanges();
    vi.advanceTimersByTime(0);
    expect(spy).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('does not focus when pkAutoFocus is false', () => {
    vi.useFakeTimers();
    const fix = TestBed.createComponent(TestHostDisabled);
    const input = fix.nativeElement.querySelector('input') as HTMLElement;
    const spy = vi.spyOn(input, 'focus');
    fix.detectChanges();
    vi.advanceTimersByTime(0);
    expect(spy).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});

// ---------------------------------------------------------------------------
// PkDebounceClickDirective
// ---------------------------------------------------------------------------

describe('PkDebounceClickDirective', () => {
  @Component({
    template: `<button [pkDebounceClick]="300" (pkDebounceClicked)="onClicked()">Click</button>`,
    imports: [PkDebounceClickDirective],
  })
  class TestHostDefault {
    count = 0;
    onClicked() { this.count++; }
  }

  @Component({
    template: `<button [pkDebounceClick]="500" (pkDebounceClicked)="onClicked()">Click</button>`,
    imports: [PkDebounceClickDirective],
  })
  class TestHost500 {
    count = 0;
    onClicked() { this.count++; }
  }

  it('does not emit before 300 ms', () => {
    vi.useFakeTimers();
    const fix = TestBed.createComponent(TestHostDefault);
    fix.detectChanges();
    const btn = fix.nativeElement.querySelector('button') as HTMLElement;
    btn.click();
    vi.advanceTimersByTime(299);
    expect(fix.componentInstance.count).toBe(0);
    vi.useRealTimers();
  });

  it('emits once after 300 ms for multiple rapid clicks', () => {
    vi.useFakeTimers();
    const fix = TestBed.createComponent(TestHostDefault);
    fix.detectChanges();
    const btn = fix.nativeElement.querySelector('button') as HTMLElement;
    btn.click();
    btn.click();
    btn.click();
    vi.advanceTimersByTime(300);
    expect(fix.componentInstance.count).toBe(1);
    vi.useRealTimers();
  });

  it('respects custom delay', () => {
    vi.useFakeTimers();
    const fix = TestBed.createComponent(TestHost500);
    fix.detectChanges();
    const btn = fix.nativeElement.querySelector('button') as HTMLElement;
    btn.click();
    vi.advanceTimersByTime(499);
    expect(fix.componentInstance.count).toBe(0);
    vi.advanceTimersByTime(1);
    expect(fix.componentInstance.count).toBe(1);
    vi.useRealTimers();
  });
});

// ---------------------------------------------------------------------------
// PkNumberOnlyDirective
// ---------------------------------------------------------------------------

describe('PkNumberOnlyDirective', () => {
  @Component({
    template: `<input type="text" [pkNumberOnly]="true" />`,
    imports: [PkNumberOnlyDirective],
  })
  class TestHostIntegers {}

  @Component({
    template: `<input type="text" [pkNumberOnly]="true" [pkAllowDecimal]="true" />`,
    imports: [PkNumberOnlyDirective],
  })
  class TestHostDecimals {}

  function keydown(el: HTMLElement, key: string, extra: Partial<KeyboardEventInit> = {}): boolean {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...extra });
    el.dispatchEvent(event);
    return !event.defaultPrevented;
  }

  function paste(el: HTMLInputElement, text: string): boolean {
    const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent;
    Object.defineProperty(event, 'clipboardData', {
      value: { getData: (_: string) => text },
      configurable: true,
    });
    el.dispatchEvent(event);
    return !event.defaultPrevented;
  }

  it('allows digit keys', () => {
    const fix = TestBed.createComponent(TestHostIntegers);
    fix.detectChanges();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    expect(keydown(input, '5')).toBe(true);
  });

  it('blocks letter keys', () => {
    const fix = TestBed.createComponent(TestHostIntegers);
    fix.detectChanges();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    expect(keydown(input, 'a')).toBe(false);
  });

  it('allows Backspace', () => {
    const fix = TestBed.createComponent(TestHostIntegers);
    fix.detectChanges();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    expect(keydown(input, 'Backspace')).toBe(true);
  });

  it('allows Ctrl+A', () => {
    const fix = TestBed.createComponent(TestHostIntegers);
    fix.detectChanges();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    expect(keydown(input, 'a', { ctrlKey: true })).toBe(true);
  });

  it('blocks decimal when pkAllowDecimal is false', () => {
    const fix = TestBed.createComponent(TestHostIntegers);
    fix.detectChanges();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    expect(keydown(input, '.')).toBe(false);
  });

  it('allows decimal when pkAllowDecimal is true', () => {
    const fix = TestBed.createComponent(TestHostDecimals);
    fix.detectChanges();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '3';
    expect(keydown(input, '.')).toBe(true);
  });

  it('blocks second decimal point', () => {
    const fix = TestBed.createComponent(TestHostDecimals);
    fix.detectChanges();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '3.';
    expect(keydown(input, '.')).toBe(false);
  });

  it('allows pasting valid integer string', () => {
    const fix = TestBed.createComponent(TestHostIntegers);
    fix.detectChanges();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    expect(paste(input, '123')).toBe(true);
  });

  it('blocks pasting non-numeric string', () => {
    const fix = TestBed.createComponent(TestHostIntegers);
    fix.detectChanges();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    expect(paste(input, 'abc')).toBe(false);
  });

  it('allows pasting valid decimal string when pkAllowDecimal is true', () => {
    const fix = TestBed.createComponent(TestHostDecimals);
    fix.detectChanges();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    expect(paste(input, '3.14')).toBe(true);
  });
});
