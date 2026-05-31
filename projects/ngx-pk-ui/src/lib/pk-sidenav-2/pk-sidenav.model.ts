export type PkSidenavPosition = 'left' | 'right';
export type PkSidenavMode = 'full' | 'icon' | 'auto';
export type PkSidenavTheme = 'light' | 'dark' | 'primary' | 'green-dark' | 'custom';
export type PkSidenavType = 'flat' | 'tree';

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

// Model interfaces for data-driven API (groups input)
export interface PkSidenavItemModel {
  key: string;
  label: string;
  icon?: string;
  route?: string | any[];
  href?: string;
  hrefTarget?: '_blank' | '_self';
  badge?: string | number;
  disabled?: boolean;
  children?: PkSidenavItemModel[];
  fn?: () => void;
}

export interface PkSidenavGroup {
  heading?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  items: PkSidenavItemModel[];
}
