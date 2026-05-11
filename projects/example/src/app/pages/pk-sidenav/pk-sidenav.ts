import { Component, signal } from '@angular/core';
import { PkSidenav, type PkSidenavGroup, type PkSidenavTheme, type PkSidenavThemeConfig } from 'ngx-pk-ui';

const DEMO_GROUPS: PkSidenavGroup[] = [
  {
    heading: 'Dashboard',
    collapsible: true,
    items: [
      { key: 'overview',      label: 'Overview',      icon: 'home' },
      { key: 'notifications', label: 'Notifications', icon: 'notifications', badge: 10 },
      { key: 'analytics',     label: 'Analytics',     icon: 'bar_chart' },
    ],
  },
  {
    heading: 'Reports',
    collapsible: true,
    items: [
      {
        key: 'orders', label: 'Orders', icon: 'shopping_cart',
        children: [
          { key: 'orders-all',     label: 'All orders',     icon: 'list' },
          { key: 'orders-pending', label: 'Pending',        icon: 'pending' },
          { key: 'orders-paid',    label: 'Paid',           icon: 'check_circle' },
        ],
      },
      { key: 'saved',   label: 'Saved reports', icon: 'bookmark' },
      { key: 'user-rp', label: 'User reports',  icon: 'person' },
    ],
  },
  {
    heading: 'Settings',
    items: [
      { key: 'manage-notif', label: 'Manage notifications', icon: 'tune' },
      { key: 'settings',     label: 'Settings',             icon: 'settings' },
    ],
  },
];

type ModeOption = 'full' | 'icon' | 'auto';

@Component({
  selector: 'app-pk-sidenav',
  standalone: true,
  imports: [PkSidenav],
  templateUrl: './pk-sidenav.html',
  styleUrl: './pk-sidenav.css',
})
export class PkSidenavPage {
  readonly groups = DEMO_GROUPS;

  activeKey  = signal('overview');
  theme      = signal<PkSidenavTheme>('light');
  mode       = signal<ModeOption>('full');
  position   = signal<'left' | 'right'>('left');

  readonly modes: { label: string; value: ModeOption }[] = [
    { label: 'Full',               value: 'full' },
    { label: 'Icon only',          value: 'icon' },
    { label: 'Auto (responsive)',  value: 'auto' },
  ];

  readonly themes: { label: string; value: PkSidenavTheme; cfg?: PkSidenavThemeConfig }[] = [
    { label: 'Light',    value: 'light' },
    { label: 'Dark',     value: 'dark' },
    { label: 'Primary (Green)', value: 'primary' },
    {
      label: 'Custom (Blue)',
      value: 'custom',
      cfg: {
        bg: '#3730a3', color: '#c7d2fe',
        activeColor: '#fff', activeBg: 'rgba(255,255,255,0.15)', activeBorder: '#fff',
        hoverBg: 'rgba(255,255,255,0.1)', headingColor: '#a5b4fc',
        dividerColor: 'rgba(255,255,255,0.1)',
      },
    },
  ];

  get activeThemeCfg(): PkSidenavThemeConfig {
    return this.themes.find(t => t.value === this.theme())?.cfg ?? {};
  }

  setTheme(v: PkSidenavTheme) { this.theme.set(v); }
  setMode(v: ModeOption)       { this.mode.set(v); }
  setPosition(v: 'left'|'right') { this.position.set(v); }
  onItemClick(item: any)       { this.activeKey.set(item.key); }
}
