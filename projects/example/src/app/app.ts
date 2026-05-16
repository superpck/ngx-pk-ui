import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { version } from '../../../../package.json';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  mobileMenuOpen = signal(false);
  version = version;

  readonly componentsList = [
    { label: 'accordion', link: '/pk-accordion' },
    { label: 'alert', link: '/pk-alert' },
    { label: 'autocomplete', link: '/pk-autocomplete' },
    { label: 'calendar', link: '/pk-calendar' },
    { label: 'datagrid', link: '/pk-datagrid' },
    { label: 'datepicker', link: '/pk-datepicker' },
    { label: 'file upload', link: '/pk-file-upload' },
    { label: 'heatmap', link: '/pk-heatmap' },
    { label: 'icon', link: '/pk-icon' },
    { label: 'markdown viewer', link: '/pk-markdown-viewer' },
    { label: 'modal', link: '/pk-modal' },
    { label: 'progress', link: '/pk-progress' },
    { label: 'select', link: '/pk-select' },
    { label: 'sidenav', link: '/pk-sidenav' },
    { label: 'tabs', link: '/pk-tabs' },
    { label: 'timeline', link: '/pk-timeline' },
    { label: 'toastr', link: '/pk-toastr' },
    { label: 'tooltip', link: '/pk-tooltip' },
    { label: 'treeview', link: '/pk-treeview' },
    { label: 'typeahead', link: '/pk-typeahead' },
  ];

  readonly examplesList = [
    { label: 'login page', link: '/examples/login' },
    { label: 'chat app', link: '/examples/chat' },
    { label: 'dashboard template', link: '/examples/dashboard' },
  ];

  readonly cssClassList = [
    { label: 'badge', link: '/pk-badge' },
    { label: 'breadcrumb', link: '/pk-breadcrumb' },
    { label: 'button', link: '/pk-btn' },
    { label: 'card', link: '/pk-card' },
    { label: 'font', link: '/pk-font' },
    { label: 'form', link: '/pk-form' },
    { label: 'grid', link: '/pk-grid' },
    { label: 'layout', link: '/pk-layout' },
    { label: 'spinner', link: '/pk-spinner' },
    { label: 'table', link: '/pk-table' },
    { label: 'toggle switch', link: '/pk-toggle' },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  onSidebarClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('.pk-sidebar__link')) {
      this.closeMobileMenu();
    }
  }
}
