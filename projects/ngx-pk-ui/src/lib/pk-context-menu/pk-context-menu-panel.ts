import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import type {
  PkContextMenuItem,
  PkContextMenuLayout,
  PkContextMenuSelectEvent,
  PkContextMenuTheme,
} from './pk-context-menu.model';

/**
 * Internal panel component — created once by PkContextMenuService and appended to <body>.
 * Never import or use this directly; use the [pkContextMenu] directive instead.
 */
@Component({
  selector: 'pk-ctx-panel',
  standalone: true,
  templateUrl: './pk-context-menu-panel.html',
  styleUrl: './pk-context-menu-panel.css',
})
export class PkContextMenuPanel {
  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _router = inject(Router, { optional: true });

  // ── State (set by service via show()) ─────────────────────────────────────
  readonly _visible   = signal(false);
  readonly _items     = signal<PkContextMenuItem[]>([]);
  readonly _layout    = signal<PkContextMenuLayout>('vertical');
  readonly _theme     = signal<PkContextMenuTheme>('light');
  readonly _top       = signal(0);
  readonly _left      = signal(0);
  readonly _onSelectedFn = signal<((e: PkContextMenuSelectEvent) => void) | null>(null);

  // ── Keyboard navigation ────────────────────────────────────────────────────
  readonly _highlightIndex = signal(-1);

  /** All navigable items (index in full array) — skips separators and disabled */
  private readonly _navIndexes = computed(() =>
    this._items()
      .map((item, i) => ({ item, i }))
      .filter(({ item }) => !item.separator && !item.disabled)
      .map(({ i }) => i)
  );

  /** Full CSS class string for the panel div */
  readonly _panelClass = computed(
    () => `pk-cm pk-cm--${this._layout()} pk-cm--${this._theme()}`
  );

  // ── Global listeners ───────────────────────────────────────────────────────

  @HostListener('document:mousedown', ['$event'])
  onDocumentMousedown(event: MouseEvent): void {
    if (!this._visible()) return;
    const panel = this._el.nativeElement.querySelector('.pk-cm') as HTMLElement | null;
    if (panel && !panel.contains(event.target as Node)) {
      this.hide();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this._visible()) this.hide();
  }

  @HostListener('document:keydown.arrowdown', ['$event'])
  onArrowDown(e: Event): void {
    if (!this._visible()) return;
    e.preventDefault();
    const navIdxs = this._navIndexes();
    const cur = navIdxs.indexOf(this._highlightIndex());
    const next = Math.min(navIdxs.length - 1, cur + 1);
    if (navIdxs[next] !== undefined) this._highlightIndex.set(navIdxs[next]);
  }

  @HostListener('document:keydown.arrowup', ['$event'])
  onArrowUp(e: Event): void {
    if (!this._visible()) return;
    e.preventDefault();
    const navIdxs = this._navIndexes();
    const cur = navIdxs.indexOf(this._highlightIndex());
    const prev = Math.max(0, cur - 1);
    if (navIdxs[prev] !== undefined) this._highlightIndex.set(navIdxs[prev]);
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnter(e: Event): void {
    if (!this._visible()) return;
    const idx = this._highlightIndex();
    if (idx < 0) return;
    const item = this._items()[idx];
    if (item && !item.separator && !item.disabled) {
      this._executeItem(item, e as unknown as MouseEvent);
    }
  }

  // ── Item interaction ───────────────────────────────────────────────────────

  onItemClick(item: PkContextMenuItem, event: MouseEvent): void {
    if (item.disabled || item.separator) return;
    this._executeItem(item, event);
  }

  private _executeItem(item: PkContextMenuItem, event: MouseEvent | KeyboardEvent): void {
    const notifyFn = this._onSelectedFn();
    if (notifyFn) notifyFn({ item, originalEvent: event });
    if (item.fn) item.fn();
    else if (item.route) this._router?.navigate(item.route);
    else if (item.href) window.open(item.href, item.hrefTarget ?? '_blank');
    this.hide();
  }

  // ── Public API (called by service) ─────────────────────────────────────────

  show(
    x: number,
    y: number,
    items: PkContextMenuItem[],
    layout: PkContextMenuLayout,
    theme: PkContextMenuTheme,
    onSelectedFn: ((e: PkContextMenuSelectEvent) => void) | null,
  ): void {
    this._items.set(items);
    this._layout.set(layout);
    this._theme.set(theme);
    this._onSelectedFn.set(onSelectedFn);
    this._top.set(y);
    this._left.set(x);
    this._highlightIndex.set(-1);
    this._visible.set(true);
    // Adjust position after the panel has been rendered
    setTimeout(() => this._adjustPosition());
  }

  hide(): void {
    this._visible.set(false);
    this._highlightIndex.set(-1);
  }

  private _adjustPosition(): void {
    const panel = this._el.nativeElement.querySelector('.pk-cm') as HTMLElement | null;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let top  = this._top();
    let left = this._left();
    if (left + rect.width  > vw) left = Math.max(0, vw - rect.width  - 4);
    if (top  + rect.height > vh) top  = Math.max(0, vh - rect.height - 4);
    this._top.set(top);
    this._left.set(left);
  }
}
