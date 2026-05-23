import { Component, inject, signal } from '@angular/core';
import { PkBreadcrumb, PkToastrService, type PkBreadcrumbItem } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-breadcrumb-page',
  imports: [PkBreadcrumb],
  templateUrl: './pk-breadcrumb-page.html',
})
export class PkBreadcrumbPage {
  private toastr = inject(PkToastrService);

  lastClick    = signal('');
  lastDblClick = signal('');

  readonly clickItems: PkBreadcrumbItem[] = [
    { label: 'Home',     key: 'home' },
    { label: 'Products', key: 'products' },
    { label: 'Detail',   key: 'detail' },
  ];

  readonly mixedItems: PkBreadcrumbItem[] = [
    { label: 'Home',     key: 'home',     route: '/' },
    { label: 'Products', key: 'products', route: '/pk-accordion' },
    { label: 'Detail',   key: 'detail' },
  ];

  onItemClick(item: PkBreadcrumbItem): void {
    this.lastClick.set(item.label);
    this.toastr.info(`(itemClick) → "${item.label}"`);
  }

  onItemDblClick(item: PkBreadcrumbItem): void {
    this.lastDblClick.set(item.label);
    this.toastr.success(`(itemDblClick) → "${item.label}"`);
  }
}

