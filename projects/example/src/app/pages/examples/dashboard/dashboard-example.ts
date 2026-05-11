import { Component, signal } from '@angular/core';
import { PkSidenav, type PkSidenavGroup, type PkSidenavItem } from 'ngx-pk-ui';

@Component({
  selector: 'app-dashboard-example',
  imports: [PkSidenav],
  templateUrl: './dashboard-example.html',
  styleUrl: './dashboard-example.css',
})
export class DashboardExample {
  activeNav = signal('dashboard');

  readonly navGroups: PkSidenavGroup[] = [
    {
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { key: 'analytics', label: 'Analytics',  icon: 'bar_chart' },
        { key: 'orders',    label: 'Orders',     icon: 'receipt_long' },
        { key: 'products',  label: 'Products',   icon: 'inventory_2' },
      ],
    },
    {
      heading: 'Settings',
      items: [
        { key: 'profile',     label: 'Profile',     icon: 'person' },
        { key: 'preferences', label: 'Preferences', icon: 'tune' },
      ],
    },
  ];

  setNav(key: string): void {
    this.activeNav.set(key);
  }
}
