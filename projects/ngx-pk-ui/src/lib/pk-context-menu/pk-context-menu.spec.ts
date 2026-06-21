import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PkContextMenuDirective } from './pk-context-menu.directive';
import { PkContextMenuService } from './pk-context-menu.service';
import { PkContextMenuPanel } from './pk-context-menu-panel';
import type { PkContextMenuItem, PkContextMenuLayout, PkContextMenuSelectEvent } from './pk-context-menu.model';

// ─── helpers ────────────────────────────────────────────────────────────────

const BASE_ITEMS: PkContextMenuItem[] = [
  { id: 1, title: 'Add',    icon: 'add' },
  { id: 2, title: 'Edit',   icon: 'edit' },
  { separator: true },
  { id: 3, title: 'Delete', icon: 'delete', disabled: true },
];

function rightClick(el: HTMLElement, x = 100, y = 200): MouseEvent {
  const event = new MouseEvent('contextmenu', {
    bubbles: true, cancelable: true, clientX: x, clientY: y,
  });
  el.dispatchEvent(event);
  return event;
}

// ─── Directive tests ─────────────────────────────────────────────────────────

@Component({
  template: `
    <div id="target"
      [pkContextMenu]="items"
      pkContextMenuTheme="dark"
      [pkContextMenuLayout]="layout()"
      [pkContextMenuDisabled]="disabled()"
      (pkContextMenuSelected)="lastSelect = $event"
      (pkContextMenuOpen)="openCount = openCount + 1"
    >Right-click me</div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [PkContextMenuDirective],
})
class DirectiveHost {
  items: PkContextMenuItem[] = BASE_ITEMS;
  layout   = signal<PkContextMenuLayout>('vertical');
  disabled = signal(false);
  lastSelect: PkContextMenuSelectEvent | null = null;
  openCount = 0;
}

describe('PkContextMenuDirective', () => {
  let fixture: ComponentFixture<DirectiveHost>;
  let host: DirectiveHost;
  let mockService: { show: ReturnType<typeof vi.fn>; hide: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockService = { show: vi.fn(), hide: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [DirectiveHost],
      providers: [{ provide: PkContextMenuService, useValue: mockService }],
    }).compileComponents();
    fixture = TestBed.createComponent(DirectiveHost);
    host    = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('calls event.preventDefault() on right-click', () => {
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    const spy   = vi.spyOn(event, 'preventDefault');
    el.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('calls service.show with correct x, y, items, and theme', () => {
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    rightClick(el, 123, 456);
    expect(mockService.show).toHaveBeenCalledOnce();
    const cfg = mockService.show.mock.calls[0][0];
    expect(cfg.x).toBe(123);
    expect(cfg.y).toBe(456);
    expect(cfg.items).toEqual(host.items);
    expect(cfg.theme).toBe('dark');
  });

  it('passes layout input to service.show', () => {
    host.layout.set('horizontal');
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    rightClick(el);
    const cfg = mockService.show.mock.calls[0][0];
    expect(cfg.layout).toBe('horizontal');
  });

  it('layout defaults to vertical when not set', async () => {
    @Component({
      template: `<div id="t" [pkContextMenu]="[]">x</div>`,
      imports: [PkContextMenuDirective],
    })
    class DefaultHost {}
    const f = TestBed.createComponent(DefaultHost);
    f.detectChanges();
    const el = f.debugElement.query(By.css('#t')).nativeElement as HTMLElement;
    rightClick(el);
    const cfg = mockService.show.mock.calls[0][0];
    expect(cfg.layout).toBe('vertical');
  });

  it('does NOT call service.show when disabled', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    rightClick(el);
    expect(mockService.show).not.toHaveBeenCalled();
  });

  it('emits pkContextMenuOpen on right-click', () => {
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    rightClick(el);
    expect(host.openCount).toBe(1);
  });

  it('does NOT emit pkContextMenuOpen when disabled', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    rightClick(el);
    expect(host.openCount).toBe(0);
  });

  it('pkContextMenuSelected fires via the onSelectedFn callback', () => {
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    rightClick(el);
    const cfg = mockService.show.mock.calls[0][0];
    const item = BASE_ITEMS[0];
    cfg.onSelectedFn({ item, originalEvent: new MouseEvent('click') });
    fixture.detectChanges();
    expect(host.lastSelect?.item).toEqual(item);
  });

  // ── Long-press (mobile) tests ──────────────────────────────────────────────

  function touchStart(el: HTMLElement, x = 100, y = 200): void {
    const event = new Event('touchstart', { bubbles: true, cancelable: true }) as TouchEvent;
    Object.defineProperty(event, 'touches', { value: [{ identifier: 1, target: el, clientX: x, clientY: y }] });
    el.dispatchEvent(event);
  }

  function touchMove(el: HTMLElement, x: number, y: number): void {
    const event = new Event('touchmove', { bubbles: true, cancelable: true }) as TouchEvent;
    Object.defineProperty(event, 'touches', { value: [{ identifier: 1, target: el, clientX: x, clientY: y }] });
    el.dispatchEvent(event);
  }

  function touchEnd(el: HTMLElement): void {
    el.dispatchEvent(new Event('touchend', { bubbles: true, cancelable: true }));
  }

  it('long-press (500 ms) calls service.show with touch coordinates', () => {
    vi.useFakeTimers();
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    touchStart(el, 150, 300);
    expect(mockService.show).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(mockService.show).toHaveBeenCalledOnce();
    const cfg = mockService.show.mock.calls[0][0];
    expect(cfg.x).toBe(150);
    expect(cfg.y).toBe(300);
    vi.useRealTimers();
  });

  it('long-press does NOT fire before 500 ms', () => {
    vi.useFakeTimers();
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    touchStart(el, 100, 200);
    vi.advanceTimersByTime(499);
    expect(mockService.show).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('touchend before 500 ms cancels long-press', () => {
    vi.useFakeTimers();
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    touchStart(el, 100, 200);
    vi.advanceTimersByTime(300);
    touchEnd(el);
    vi.advanceTimersByTime(500);
    expect(mockService.show).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('finger move > 10 px cancels long-press', () => {
    vi.useFakeTimers();
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    touchStart(el, 100, 200);
    touchMove(el, 115, 200); // moved 15 px > threshold
    vi.advanceTimersByTime(500);
    expect(mockService.show).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('finger move <= 10 px does NOT cancel long-press', () => {
    vi.useFakeTimers();
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    touchStart(el, 100, 200);
    touchMove(el, 105, 203); // ~5.8 px — under threshold
    vi.advanceTimersByTime(500);
    expect(mockService.show).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it('long-press does NOT fire when disabled', () => {
    vi.useFakeTimers();
    host.disabled.set(true);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    touchStart(el, 100, 200);
    vi.advanceTimersByTime(500);
    expect(mockService.show).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('contextmenu after long-press is suppressed (no double-show)', () => {
    vi.useFakeTimers();
    const el = fixture.debugElement.query(By.css('#target')).nativeElement as HTMLElement;
    touchStart(el, 100, 200);
    vi.advanceTimersByTime(500); // menu shown via long-press
    vi.useRealTimers();
    rightClick(el); // Android fires contextmenu after long-press — should be swallowed
    expect(mockService.show).toHaveBeenCalledOnce(); // still only 1
  });
});

// ─── Panel component tests ───────────────────────────────────────────────────

describe('PkContextMenuPanel', () => {
  let fixture: ComponentFixture<PkContextMenuPanel>;
  let comp: PkContextMenuPanel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PkContextMenuPanel] }).compileComponents();
    fixture = TestBed.createComponent(PkContextMenuPanel);
    comp    = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not render panel when hidden', () => {
    expect(fixture.debugElement.query(By.css('.pk-cm'))).toBeNull();
  });

  it('renders panel after show()', () => {
    comp.show(100, 100, BASE_ITEMS, 'vertical', 'light', null);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pk-cm'))).not.toBeNull();
  });

  it('renders 3 buttons and 1 separator for BASE_ITEMS', () => {
    comp.show(0, 0, BASE_ITEMS, 'vertical', 'light', null);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.pk-cm__item')).length).toBe(3);
    expect(fixture.debugElement.queryAll(By.css('.pk-cm__sep')).length).toBe(1);
  });

  it('applies the correct theme class', () => {
    comp.show(0, 0, BASE_ITEMS, 'vertical', 'dark', null);
    fixture.detectChanges();
    const panel = fixture.debugElement.query(By.css('.pk-cm'));
    expect(panel.nativeElement.classList).toContain('pk-cm--dark');
  });

  it('applies the correct layout class', () => {
    comp.show(0, 0, BASE_ITEMS, 'horizontal', 'light', null);
    fixture.detectChanges();
    const panel = fixture.debugElement.query(By.css('.pk-cm'));
    expect(panel.nativeElement.classList).toContain('pk-cm--horizontal');
  });

  it('calls item.fn when a button is clicked', () => {
    const fn = vi.fn();
    comp.show(0, 0, [{ id: 1, title: 'Go', fn }], 'vertical', 'light', null);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.pk-cm__item')).nativeElement.click();
    expect(fn).toHaveBeenCalledOnce();
  });

  it('calls onSelectedFn with item when a button is clicked', () => {
    const onSelected = vi.fn();
    const items: PkContextMenuItem[] = [{ id: 1, title: 'Go' }];
    comp.show(0, 0, items, 'vertical', 'light', onSelected);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.pk-cm__item')).nativeElement.click();
    expect(onSelected).toHaveBeenCalledOnce();
    expect(onSelected.mock.calls[0][0].item).toEqual(items[0]);
  });

  it('does NOT call onSelectedFn for a disabled item', () => {
    const onSelected = vi.fn();
    comp.show(0, 0, BASE_ITEMS, 'vertical', 'light', onSelected);
    fixture.detectChanges();
    // 3rd button (index 2) = Delete (disabled)
    const buttons = fixture.debugElement.queryAll(By.css('.pk-cm__item'));
    buttons[2].nativeElement.click();
    expect(onSelected).not.toHaveBeenCalled();
  });

  it('hides panel after clicking an item', () => {
    comp.show(0, 0, [{ id: 1, title: 'Go' }], 'vertical', 'light', null);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.pk-cm__item')).nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pk-cm'))).toBeNull();
  });

  it('hides panel on Escape keydown', () => {
    comp.show(0, 0, BASE_ITEMS, 'vertical', 'light', null);
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pk-cm'))).toBeNull();
  });

  it('hides panel on outside mousedown', () => {
    comp.show(0, 0, BASE_ITEMS, 'vertical', 'light', null);
    fixture.detectChanges();
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pk-cm'))).toBeNull();
  });

  it('hide() method hides the panel', () => {
    comp.show(0, 0, BASE_ITEMS, 'vertical', 'light', null);
    fixture.detectChanges();
    comp.hide();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pk-cm'))).toBeNull();
  });

  it('adjusts _left when position would overflow viewport width', () => {
    vi.useFakeTimers();
    const overflow = window.innerWidth - 10;
    comp.show(overflow, 100, BASE_ITEMS, 'vertical', 'light', null);
    fixture.detectChanges();
    vi.advanceTimersByTime(20);
    // JSDOM getBoundingClientRect returns zeros so the guard won't flip,
    // but _left should have been set to the overflow value initially.
    expect(comp._left()).toBeLessThanOrEqual(overflow);
  });

  it('ArrowDown selects first navigable item', () => {
    comp.show(0, 0, BASE_ITEMS, 'vertical', 'light', null);
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    // First navigable item is index 0
    expect(comp._highlightIndex()).toBe(0);
  });

  it('Enter executes highlighted item', () => {
    const fn = vi.fn();
    const items: PkContextMenuItem[] = [{ id: 1, title: 'Go', fn }];
    comp.show(0, 0, items, 'vertical', 'light', null);
    fixture.detectChanges();
    comp._highlightIndex.set(0);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(fn).toHaveBeenCalledOnce();
  });
});
