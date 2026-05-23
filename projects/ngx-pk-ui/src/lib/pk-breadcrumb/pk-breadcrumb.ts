import {
  Component, input, output, computed, ChangeDetectionStrategy
} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  PkBreadcrumbItem, PkBreadcrumbSeparator, PkBreadcrumbSize
} from './pk-breadcrumb.model';

@Component({
  selector: 'pk-breadcrumb',
  standalone: true,
  imports: [NgClass, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pk-breadcrumb.html',
  styleUrl: './pk-breadcrumb.css',
})
export class PkBreadcrumb {

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

  // ── Handlers ─────────────────────────────────────────────────────────
  onItemClick(item: PkBreadcrumbItem, event: Event): void {
    if (item.disabled) { event.preventDefault(); return; }
    if (!item.route && !item.href) event.preventDefault();
    this.itemClick.emit(item);
  }

  onItemDblClick(item: PkBreadcrumbItem, event: Event): void {
    if (item.disabled) { event.preventDefault(); return; }
    this.itemDblClick.emit(item);
  }
}
