import {
  Component, input, output, computed, ChangeDetectionStrategy, inject, OnDestroy
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import {
  PkBreadcrumbItem, PkBreadcrumbSeparator, PkBreadcrumbSize
} from './pk-breadcrumb.model';

@Component({
  selector: 'pk-breadcrumb',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pk-breadcrumb.html',
  styleUrl: './pk-breadcrumb.css',
})
export class PkBreadcrumb implements OnDestroy {
  private router = inject(Router, { optional: true });
  private _dblTimer?: ReturnType<typeof setTimeout>;

  // ── Inputs ──────────────────────────────────────────────────────────
  items     = input<PkBreadcrumbItem[]>([]);
  separator = input<PkBreadcrumbSeparator>('default');
  size      = input<PkBreadcrumbSize>('md');
  bg        = input<boolean>(false);

  // ── Outputs ─────────────────────────────────────────────────────────
  itemClick    = output<PkBreadcrumbItem>();
  itemDblClick = output<PkBreadcrumbItem>();

  // ── Computed ─────────────────────────────────────────────────────────
  readonly navClass = computed(() => ({
    'pk-breadcrumb':         true,
    'pk-breadcrumb--slash':  this.separator() === 'slash',
    'pk-breadcrumb--dot':    this.separator() === 'dot',
    'pk-breadcrumb--arrow':  this.separator() === 'arrow',
    'pk-breadcrumb--sm':     this.size() === 'sm',
    'pk-breadcrumb--lg':     this.size() === 'lg',
    'pk-breadcrumb--bg':     this.bg(),
  }));

  ngOnDestroy(): void {
    clearTimeout(this._dblTimer);
  }

  /** Returns a serialized URL string for route items (used as href so the browser shows the target). */
  getRouteUrl(item: PkBreadcrumbItem): string | null {
    if (!item.route || !this.router) return null;
    const commands = Array.isArray(item.route) ? item.route : [item.route];
    return this.router.serializeUrl(this.router.createUrlTree(commands));
  }

  // ── Handlers ─────────────────────────────────────────────────────────
  onItemClick(item: PkBreadcrumbItem, event: Event): void {
    if (item.disabled) { event.preventDefault(); return; }

    if (item.route || item.href) {
      // Prevent immediate browser/router navigation so dblclick has a chance to fire
      event.preventDefault();
      clearTimeout(this._dblTimer);
      this._dblTimer = setTimeout(() => {
        this.itemClick.emit(item);
        if (item.route && this.router) {
          const commands = Array.isArray(item.route) ? item.route : [item.route];
          this.router.navigate(commands);
        } else if (item.href) {
          window.open(item.href, item.hrefTarget ?? '_self');
        }
      }, 250);
    } else {
      event.preventDefault();
      this.itemClick.emit(item);
    }
  }

  onItemDblClick(item: PkBreadcrumbItem, event: Event): void {
    if (item.disabled) { event.preventDefault(); return; }
    clearTimeout(this._dblTimer); // cancel pending single-click navigation
    this.itemDblClick.emit(item);
  }
}
