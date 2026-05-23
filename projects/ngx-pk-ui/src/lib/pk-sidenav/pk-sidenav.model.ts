export type PkSidenavPosition = 'left' | 'right';
export type PkSidenavMode = 'full' | 'icon' | 'auto';
export type PkSidenavTheme = 'light' | 'dark' | 'primary' | 'custom';

export interface PkSidenavItem {
  /** Unique key for this item */
  key: string;
  /** Label text shown in full mode */
  label: string;
  /** Material Symbols icon name */
  icon?: string;
  /** Angular Router commands — renders item as <a [routerLink]> */
  route?: string | any[];
  /** External / internal URL — renders item as <a [href]> */
  href?: string;
  /** Link target: '_blank' opens in new tab, '_self' opens in same tab (default) */
  hrefTarget?: '_blank' | '_self';
  /** Badge count shown on icon / label */
  badge?: number | string;
  /** Disabled state */
  disabled?: boolean;
  /** Child items (multi-level) */
  children?: PkSidenavItem[];
  /** Callback executed on selection */
  fn?: () => void;
}

export interface PkSidenavGroup {
  /** Group heading label */
  heading?: string;
  /** Whether group is collapsible */
  collapsible?: boolean;
  /** Whether group starts collapsed */
  collapsed?: boolean;
  items: PkSidenavItem[];
}

export interface PkSidenavThemeConfig {
  bg?: string;
  color?: string;
  activeColor?: string;
  activeBg?: string;
  activeBorder?: string;
  hoverBg?: string;
  hoverColor?: string;
  headingColor?: string;
  dividerColor?: string;
  iconBg?: string;
  iconColor?: string;
}
