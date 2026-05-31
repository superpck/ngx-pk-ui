import {
  Component, ChangeDetectionStrategy, input, output, signal, computed,
  contentChildren, effect, inject, Optional, SkipSelf
} from '@angular/core';
import { NgStyle, NgClass, NgTemplateOutlet } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PkIcon } from '../pk-icon/pk-icon';
import { PkSidenav } from './pk-sidenav';

/**
 * PkSidenavItem — individual menu item with support for:
 * - 3-level nesting (mainmenu > submenu > submenu)
 * - icon, label, badge
 * - route, href, or callback (fn)
 * - expand/collapse for parent items
 */
@Component({
  selector: 'pk-sidenav-item',
  standalone: true,
  imports: [NgStyle, NgClass, NgTemplateOutlet, RouterModule, PkIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pk-sidenav-item.html',
  styleUrl: './pk-sidenav-item.css',
})
export class PkSidenavItem {
  // ── Inputs ──────────────────────────────────────────────────────────
  /** Unique key for this item */
  key = input.required<string>();
  /** Label text */
  label = input.required<string>();
  /** Material Symbols icon name */
  icon = input<string>('');
  /** Angular Router commands */
  route = input<string | any[]>();
  /** External/internal URL */
  href = input<string>();
  /** Link target (_blank or _self) */
  hrefTarget = input<'_blank' | '_self'>('_self');
  /** Badge count */
  badge = input<string | number>();
  /** Disabled state */
  disabled = input<boolean>(false);
  /** Active state (for non-router usage) */
  active = input<boolean>(false);
  /** Level (0 = main, 1 = sub, 2 = sub-sub) — max 3 levels (0, 1, 2) */
  level = input<number>(0);
  /** Custom CSS class */
  customClass = input<string>('');
  /** Custom inline styles */
  customStyle = input<Record<string, string>>({});

  // ── Outputs ─────────────────────────────────────────────────────────
  /** Emits when item is clicked */
  itemClick = output<string>();

  // ── Child items (for nested structure) ──────────────────────────────
  readonly children = contentChildren(PkSidenavItem, { descendants: false });

  // ── Internal state ──────────────────────────────────────────────────
  readonly expanded = signal<boolean>(false);
  private readonly router = inject(Router, { optional: true });
  private readonly parent = inject(PkSidenavItem, { optional: true, skipSelf: true });
  private readonly sidenav = inject(PkSidenav, { optional: true });

  // ── Computed ────────────────────────────────────────────────────────
  readonly hasChildren = computed(() => this.children().length > 0);
  readonly isIconOnly = computed(() => this.sidenav?.isIconOnly() ?? false);
  readonly isTreeType = computed(() => this.sidenav?.type() === 'tree');
  readonly maxLevel = 2; // 0-indexed, so 0, 1, 2 = 3 levels

  readonly paddingLeft = computed(() => {
    if (this.isIconOnly()) return 0;
    // Tree mode: เพิ่ม indent ให้ชัดเจน
    if (this.isTreeType()) {
      return 14 + this.level() * 20;
    }
    return 16 + this.level() * 14;
  });

  readonly iconSize = computed(() => {
    // Parent items (level 0) ใช้ icon ใหญ่กว่า
    if (this.level() === 0) return 20;
    // Child items ใช้ icon เล็กกว่า
    return 16;
  });

  readonly hostClass = computed(() => ({
    'pk-snv-item-wrapper': true,
    [`pk-snv-item-wrapper--level-${this.level()}`]: true,
    [this.customClass()]: !!this.customClass(),
  }));

  readonly itemClass = computed(() => ({
    'pk-snv-item': true,
    'pk-snv-item--active': this.active(),
    'pk-snv-item--disabled': this.disabled(),
    'pk-snv-item--has-children': this.hasChildren(),
    'pk-snv-item--expanded': this.expanded(),
  }));

  readonly hostStyle = computed(() => this.customStyle());

  constructor() {
    // Auto-expand if any child is active
    effect(() => {
      if (this.hasChildren()) {
        const anyChildActive = this.children().some(c => c.active());
        if (anyChildActive) {
          this.expanded.set(true);
        }
      }
    });
  }

  // ── Event handlers ──────────────────────────────────────────────────
  onClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }

    // If has children, toggle expand/collapse
    if (this.hasChildren()) {
      event.preventDefault();
      this.toggle();
      return;
    }

    // Emit click event
    this.itemClick.emit(this.key());

    // If no route/href, prevent default
    if (!this.route() && !this.href()) {
      event.preventDefault();
    }
  }

  toggle(): void {
    if (!this.hasChildren()) return;
    this.expanded.set(!this.expanded());
  }

  iconName(): string {
    return this.icon() || 'circle';
  }

  chevronIcon(): string {
    if (this.isTreeType()) {
      return this.expanded() ? 'expand_more' : 'chevron_right';
    }
    return this.expanded() ? 'expand_less' : 'expand_more';
  }
}
