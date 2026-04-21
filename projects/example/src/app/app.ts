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
    { label: 'tabs', link: '/pk-tabs' },
    { label: 'toastr', link: '/pk-toastr' },
    { label: 'alert', link: '/pk-alert' },
    { label: 'modal', link: '/pk-modal' },
    { label: 'icon', link: '/pk-icon' },
    { label: 'datagrid', link: '/pk-datagrid' },
    { label: 'datepicker', link: '/pk-datepicker' },
    { label: 'progress', link: '/pk-progress' },
    { label: 'treeview', link: '/pk-treeview' },
    { label: 'select', link: '/pk-select' },
    { label: 'autocomplete', link: '/pk-autocomplete' },
    { label: 'typeahead', link: '/pk-typeahead' },
  ];

  readonly cssClassList = [
    { label: 'grid', link: '/pk-grid' },
    { label: 'btn', link: '/pk-btn' },
    { label: 'spinner', link: '/pk-spinner' },
    { label: 'badge', link: '/pk-badge' },
    { label: 'card', link: '/pk-card' },
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
