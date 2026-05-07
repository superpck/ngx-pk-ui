import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PkToastr, PkAlert } from 'ngx-pk-ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PkToastr, PkAlert],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  mobileMenuOpen = signal(false);

  readonly componentsList = [
    { label: 'alert', link: '/pk-alert' },
    { label: 'autocomplete', link: '/pk-autocomplete' },
    { label: 'datagrid', link: '/pk-datagrid' },
    { label: 'datepicker', link: '/pk-datepicker' },
    { label: 'icon', link: '/pk-icon' },
    { label: 'modal', link: '/pk-modal' },
    { label: 'progress', link: '/pk-progress' },
    { label: 'select', link: '/pk-select' },
    { label: 'tabs', link: '/pk-tabs' },
    { label: 'toastr', link: '/pk-toastr' },
    { label: 'treeview', link: '/pk-treeview' },
    { label: 'typeahead', link: '/pk-typeahead' },
  ];

  readonly cssClassList = [
    { label: 'badge', link: '/pk-badge' },
    { label: 'breadcrumb', link: '/pk-breadcrumb' },
    { label: 'btn', link: '/pk-btn' },
    { label: 'card', link: '/pk-card' },
    { label: 'grid', link: '/pk-grid' },
    { label: 'spinner', link: '/pk-spinner' },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  onSidebarClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('.sidebar-link')) {
      this.closeMobileMenu();
    }
  }
}
