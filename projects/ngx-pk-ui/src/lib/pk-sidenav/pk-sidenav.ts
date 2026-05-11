import {
  Component, input, output, signal, computed, ChangeDetectionStrategy,
  OnInit, effect
} from '@angular/core';
import { NgStyle, NgClass, NgTemplateOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PkIcon } from '../pk-icon/pk-icon';
import {
  PkSidenavGroup, PkSidenavItem, PkSidenavMode,
  PkSidenavPosition, PkSidenavTheme, PkSidenavThemeConfig
} from './pk-sidenav.model';

@Component({
  selector: 'pk-sidenav',
  standalone: true,
  imports: [NgStyle, NgClass, NgTemplateOutlet, RouterModule, PkIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pk-sidenav.html',
  styleUrl: './pk-sidenav.css',
})
export class PkSidenav implements OnInit {

  // ── Inputs ──────────────────────────────────────────────────────────
  groups     = input<PkSidenavGroup[]>([]);
  position   = input<PkSidenavPosition>('left');
  mode       = input<PkSidenavMode>('full');
  theme      = input<PkSidenavTheme>('light');
  themeConfig = input<PkSidenavThemeConfig>({});
  width      = input<string>('220px');
  iconWidth  = input<string>('64px');
  /** Breakpoint px below which sidenav collapses to icon-only (0 = never auto-collapse) */
  breakpoint = input<number>(768);
  /** Active item key (for router-less usage) */
  activeKey  = input<string>('');
  /** Show user slot (project via ng-content select="[pkSidenavUser]") */
  showUser   = input<boolean>(true);

  // ── Outputs ─────────────────────────────────────────────────────────
  itemClick    = output<PkSidenavItem>();
  modeChange   = output<PkSidenavMode>();

  // ── Internal state ───────────────────────────────────────────────────
  readonly collapsed     = signal<boolean>(false);
  readonly openedKeys    = signal<Set<string>>(new Set());
  readonly _activeKey    = signal<string>('');

  // ── Computed ─────────────────────────────────────────────────────────
  readonly isIconOnly = computed(() =>
    this.mode() === 'icon' || (this.mode() === 'auto' && this.collapsed())
  );

  readonly hostClass = computed(() => ({
    'pk-sidenav': true,
    [`pk-sidenav--${this.position()}`]: true,
    [`pk-sidenav--${this.theme()}`]: true,
    'pk-sidenav--icon': this.isIconOnly(),
    'pk-sidenav--collapsed': this.collapsed(),
  }));

  readonly hostStyle = computed(() => {
    const cfg = this.themeConfig();
    const styles: Record<string, string> = {
      '--pk-snv-width': this.width(),
      '--pk-snv-icon-width': this.iconWidth(),
    };
    if (cfg.bg)           styles['--pk-snv-bg']            = cfg.bg;
    if (cfg.color)        styles['--pk-snv-color']         = cfg.color;
    if (cfg.activeColor)  styles['--pk-snv-active-color']  = cfg.activeColor;
    if (cfg.activeBg)     styles['--pk-snv-active-bg']     = cfg.activeBg;
    if (cfg.activeBorder) styles['--pk-snv-active-border'] = cfg.activeBorder;
    if (cfg.hoverBg)      styles['--pk-snv-hover-bg']      = cfg.hoverBg;
    if (cfg.hoverColor)   styles['--pk-snv-hover-color']   = cfg.hoverColor;
    if (cfg.headingColor) styles['--pk-snv-heading-color'] = cfg.headingColor;
    if (cfg.dividerColor) styles['--pk-snv-divider-color'] = cfg.dividerColor;
    if (cfg.iconBg)       styles['--pk-snv-icon-bg']       = cfg.iconBg;
    if (cfg.iconColor)    styles['--pk-snv-icon-color']    = cfg.iconColor;
    return styles;
  });

  // ── Lifecycle ────────────────────────────────────────────────────────
  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      this._activeKey.set(this.activeKey());
    });
  }

  ngOnInit(): void {
    if (this.mode() === 'auto' && this.breakpoint() > 0) {
      this.resizeObserver = new ResizeObserver(() => {
        const narrow = window.innerWidth < this.breakpoint();
        this.collapsed.set(narrow);
      });
      this.resizeObserver.observe(document.body);
      this.collapsed.set(window.innerWidth < this.breakpoint());
    }
    // Open groups that contain the active item
    for (const g of this.groups()) {
      for (const item of g.items) {
        if (this._hasActive(item, this.activeKey())) {
          this._openKey(item.key);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  // ── Public toggle ────────────────────────────────────────────────────
  toggle(): void {
    const next = !this.collapsed();
    this.collapsed.set(next);
    this.modeChange.emit(next ? 'icon' : 'full');
  }

  // ── Item interaction ─────────────────────────────────────────────────
  onItemClick(item: PkSidenavItem): void {
    if (item.disabled) return;
    // Expand first when in icon-only mode (mode='icon' or auto+collapsed)
    if (this.isIconOnly()) {
      if (this.mode() === 'auto') {
        this.collapsed.set(false);
        this.modeChange.emit('full');
      } else if (this.mode() === 'icon') {
        // For fixed icon mode, just emit the item — consumer decides
      }
      // If has children, open the submenu after expanding
      if (item.children?.length) {
        this._openKey(item.key);
      } else {
        this._activeKey.set(item.key);
        this.itemClick.emit(item);
      }
      return;
    }
    if (item.children?.length) {
      this._toggleKey(item.key);
      return;
    }
    this._activeKey.set(item.key);
    this.itemClick.emit(item);
  }

  isOpen(key: string): boolean {
    return this.openedKeys().has(key);
  }

  isActive(item: PkSidenavItem): boolean {
    return this._activeKey() === item.key;
  }

  toggleGroup(group: { collapsed?: boolean }): void {
    group.collapsed = !group.collapsed;
  }

  iconName(item: PkSidenavItem): string {
    return item.icon ?? 'circle';
  }

  // ── Private helpers ──────────────────────────────────────────────────
  private _toggleKey(key: string): void {
    const s = new Set(this.openedKeys());
    s.has(key) ? s.delete(key) : s.add(key);
    this.openedKeys.set(s);
  }

  private _openKey(key: string): void {
    const s = new Set(this.openedKeys());
    s.add(key);
    this.openedKeys.set(s);
  }

  private _hasActive(item: PkSidenavItem, activeKey: string): boolean {
    if (item.key === activeKey) return true;
    return item.children?.some(c => this._hasActive(c, activeKey)) ?? false;
  }
}
