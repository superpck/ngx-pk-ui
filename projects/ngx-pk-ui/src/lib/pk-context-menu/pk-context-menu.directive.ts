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
 *
 * ```html
 * <div [pkContextMenu]="items" pkContextMenuTheme="dark" (pkContextMenuSelected)="onSelect($event)">
 *   Right-click here
 * </div>
 * ```
 */
@Directive({
  selector: '[pkContextMenu]',
  standalone: true,
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

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
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
}
