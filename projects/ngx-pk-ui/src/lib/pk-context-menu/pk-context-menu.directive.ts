import { Directive, HostListener, inject, input, output } from '@angular/core';
import type {
  PkContextMenuItem,
  PkContextMenuLayout,
  PkContextMenuSelectEvent,
  PkContextMenuTheme,
} from './pk-context-menu.model';
import { PkContextMenuService } from './pk-context-menu.service';

/**
 * Attach this directive to any element to enable a right-click context menu.
 * On desktop: right-click (contextmenu event).
 * On mobile: long-press (500 ms hold, cancels if finger moves > 10 px).
 *
 * ```html
 * <div [pkContextMenu]="items" pkContextMenuTheme="dark" (pkContextMenuSelected)="onSelect($event)">
 *   Right-click / long-press here
 * </div>
 * ```
 */
@Directive({
  selector: '[pkContextMenu]',
  standalone: true,
  host: {
    // Suppress iOS native callout (link preview / text selection bubble) during long-press.
    style: '-webkit-touch-callout: none;',
  },
})
export class PkContextMenuDirective {
  /** Menu items to display. */
  readonly pkContextMenu = input<PkContextMenuItem[]>([]);

  /** Panel layout: `'vertical'` (default) or `'horizontal'`. */
  readonly pkContextMenuLayout = input<PkContextMenuLayout>('vertical');

  /** Color theme. */
  readonly pkContextMenuTheme = input<PkContextMenuTheme>('light');

  /** When `true`, the context menu will not open. */
  readonly pkContextMenuDisabled = input<boolean>(false);

  /** Emits when the user selects a menu item. */
  readonly pkContextMenuSelected = output<PkContextMenuSelectEvent>();

  /** Emits when the context menu is about to open (right-click received). */
  readonly pkContextMenuOpen = output<MouseEvent>();

  private readonly _service = inject(PkContextMenuService);

  private _longPressTimer: ReturnType<typeof setTimeout> | null = null;
  /** Set to true when the menu was already shown via long-press timer.
   *  Used to suppress the duplicate `contextmenu` event that Android fires
   *  after the long-press gesture completes. */
  private _longPressTriggered = false;
  private _touchStartX = 0;
  private _touchStartY = 0;

  private static readonly _LONG_PRESS_MS = 500;
  private static readonly _MOVE_THRESHOLD_PX = 10;

  // ── Desktop: right-click ─────────────────────────────────────────────────

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    // Android fires a contextmenu event after the long-press; suppress the duplicate.
    if (this._longPressTriggered) {
      this._longPressTriggered = false;
      return;
    }
    if (this.pkContextMenuDisabled()) return;
    this.pkContextMenuOpen.emit(event);
    this._service.show({
      items: this.pkContextMenu(),
      layout: this.pkContextMenuLayout(),
      theme: this.pkContextMenuTheme(),
      x: event.clientX,
      y: event.clientY,
      onSelectedFn: (e) => this.pkContextMenuSelected.emit(e),
    });
  }

  // ── Mobile: long-press ────────────────────────────────────────────────────

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (this.pkContextMenuDisabled()) return;
    const touch = event.touches[0];
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
    this._longPressTimer = setTimeout(() => {
      this._longPressTimer = null;
      this._longPressTriggered = true;
      this._service.show({
        items: this.pkContextMenu(),
        layout: this.pkContextMenuLayout(),
        theme: this.pkContextMenuTheme(),
        x: this._touchStartX,
        y: this._touchStartY,
        onSelectedFn: (e) => this.pkContextMenuSelected.emit(e),
      });
    }, PkContextMenuDirective._LONG_PRESS_MS);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (this._longPressTimer === null) return;
    const touch = event.touches[0];
    const dx = touch.clientX - this._touchStartX;
    const dy = touch.clientY - this._touchStartY;
    if (Math.sqrt(dx * dx + dy * dy) > PkContextMenuDirective._MOVE_THRESHOLD_PX) {
      this._clearTimer();
    }
  }

  @HostListener('touchend')
  onTouchEnd(): void {
    this._clearTimer();
  }

  @HostListener('touchcancel')
  onTouchCancel(): void {
    this._clearTimer();
  }

  private _clearTimer(): void {
    if (this._longPressTimer !== null) {
      clearTimeout(this._longPressTimer);
      this._longPressTimer = null;
    }
  }
}
