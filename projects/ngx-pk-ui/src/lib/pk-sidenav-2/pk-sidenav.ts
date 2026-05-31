import {
  Component,
  input,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { NgStyle, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PkIcon } from '../pk-icon/pk-icon';
import {
  PkSidenavMode,
  PkSidenavPosition,
  PkSidenavTheme,
  PkSidenavType,
  PkSidenavThemeConfig,
  PkSidenavGroup,
  PkSidenavItemModel,
} from './pk-sidenav.model';

@Component({
  selector: 'pk-sidenav',
  standalone: true,
  imports: [NgStyle, NgClass, RouterModule, PkIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pk-sidenav.html',
  styleUrl: './pk-sidenav.css',
  host: {
    '[class]': 'hostClass()',
    '[style]': 'hostStyle()',
  },
})
export class PkSidenav implements OnDestroy {
  // ── Inputs (data-driven API) ────────────────────────────────────────
  /** Groups of menu items — data-driven API (backwards compatible) */
  groups = input<PkSidenavGroup[]>([]);
  /** Active item key — for data-driven API */
  activeKey = input<string>('');
  /** Show user footer slot — for data-driven API */
  showUser = input<boolean>(true);

  // ── Inputs (appearance & behavior) ──────────────────────────────────
  position = input<PkSidenavPosition>('left');
  mode = input<PkSidenavMode>('full');
  type = input<PkSidenavType>('flat');
  theme = input<PkSidenavTheme>('light');
  themeConfig = input<PkSidenavThemeConfig>({});
  width = input<string>('220px');
  iconWidth = input<string>('64px');
  /** Breakpoint px below which sidenav becomes floating overlay (0 = always static) */
  breakpoint = input<number>(768);
  /** Custom CSS class on sidenav container */
  customClass = input<string>('');
  /** Custom inline styles on sidenav container */
  customStyle = input<Record<string, string>>({});

  // ── Outputs ─────────────────────────────────────────────────────────
  modeChange = output<PkSidenavMode>();
  /** Emits when collapsed state changes */
  collapsedChange = output<boolean>();
  /** Emits when item is clicked (data-driven API) */
  itemClick = output<PkSidenavItemModel>();

  // ── Internal state ───────────────────────────────────────────────────
  readonly collapsed = signal<boolean>(false);
  readonly mobileOpen = signal<boolean>(false);
  /** Whether current viewport is mobile (< breakpoint) */
  readonly isMobile = signal<boolean>(false);

  // ── Computed ─────────────────────────────────────────────────────────
  readonly isIconOnly = computed(() =>
    this.mode() === 'icon' || (this.mode() === 'auto' && this.collapsed())
  );

  /** Whether sidenav is visible (for mobile overlay) */
  readonly isVisible = computed(() => {
    if (!this.isMobile()) return true; // Always visible on desktop
    return this.mobileOpen(); // Only visible when open on mobile
  });

  /** Whether this is data-driven mode (has groups input) */
  readonly isDataDriven = computed(() => this.groups().length > 0);

  readonly hostClass = computed(() => ({
    'pk-sidenav': true,
    [`pk-sidenav--${this.position()}`]: true,
    [`pk-sidenav--${this.theme()}`]: true,
    'pk-sidenav--icon': this.isIconOnly(),
    'pk-sidenav--collapsed': this.collapsed(),
    'pk-sidenav--mobile': this.isMobile(),
    'pk-sidenav--mobile-open': this.isMobile() && this.mobileOpen(),
    [this.customClass()]: !!this.customClass(),
  }));

  readonly hostStyle = computed(() => {
    const cfg = this.themeConfig();
    const custom = this.customStyle();
    const styles: Record<string, string> = {
      '--pk-snv-width': this.width(),
      '--pk-snv-icon-width': this.iconWidth(),
      ...custom,
    };
    if (cfg.bg) styles['--pk-snv-bg'] = cfg.bg;
    if (cfg.color) styles['--pk-snv-color'] = cfg.color;
    if (cfg.activeColor) styles['--pk-snv-active-color'] = cfg.activeColor;
    if (cfg.activeBg) styles['--pk-snv-active-bg'] = cfg.activeBg;
    if (cfg.activeBorder) styles['--pk-snv-active-border'] = cfg.activeBorder;
    if (cfg.hoverBg) styles['--pk-snv-hover-bg'] = cfg.hoverBg;
    if (cfg.hoverColor) styles['--pk-snv-hover-color'] = cfg.hoverColor;
    if (cfg.headingColor) styles['--pk-snv-heading-color'] = cfg.headingColor;
    if (cfg.dividerColor) styles['--pk-snv-divider-color'] = cfg.dividerColor;
    if (cfg.iconBg) styles['--pk-snv-icon-bg'] = cfg.iconBg;
    if (cfg.iconColor) styles['--pk-snv-icon-color'] = cfg.iconColor;
    return styles;
  });

  // ── Lifecycle ────────────────────────────────────────────────────────
  private resizeObserver?: ResizeObserver;

  constructor() {
    // Initial mobile state check
    this.isMobile.set(window.innerWidth < this.breakpoint());

    // Setup resize observer for responsive behavior
    if (typeof window !== 'undefined' && this.breakpoint() > 0) {
      this.resizeObserver = new ResizeObserver(() => {
        const mobile = window.innerWidth < this.breakpoint();
        this.isMobile.set(mobile);

        // Auto-collapse in auto mode
        if (this.mode() === 'auto') {
          this.collapsed.set(mobile);
        }

        // Close mobile overlay when resizing to desktop
        if (!mobile && this.mobileOpen()) {
          this.mobileOpen.set(false);
        }
      });
      this.resizeObserver.observe(document.body);

      // Initial collapse state for auto mode
      if (this.mode() === 'auto') {
        this.collapsed.set(window.innerWidth < this.breakpoint());
      }
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  // ── Public methods ───────────────────────────────────────────────────
  /** Toggle sidebar collapse (desktop) or overlay (mobile) */
  toggle(): void {
    if (this.isMobile()) {
      // In mobile mode, toggle overlay open/close
      this.mobileOpen.set(!this.mobileOpen());
    } else {
      // In desktop mode, toggle collapsed state
      const next = !this.collapsed();
      this.collapsed.set(next);
      this.modeChange.emit(next ? 'icon' : 'full');
      this.collapsedChange.emit(next);
    }
  }

  /** Open mobile overlay */
  open(): void {
    if (this.isMobile()) {
      this.mobileOpen.set(true);
    }
  }

  /** Close mobile overlay */
  close(): void {
    this.mobileOpen.set(false);
  }

  /** Close overlay on backdrop click */
  onBackdropClick(): void {
    this.close();
  }

  /** Internal: handle item click from data-driven template */
  onItemClick(item: PkSidenavItemModel): void {
    // Execute callback if exists
    if (item.fn) {
      item.fn();
    }

    // Close mobile overlay on item click
    if (this.isMobile()) {
      this.close();
    }

    // Emit event
    this.itemClick.emit(item);
  }
}
