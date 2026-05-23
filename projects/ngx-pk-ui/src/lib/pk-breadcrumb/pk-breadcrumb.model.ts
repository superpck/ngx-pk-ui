export interface PkBreadcrumbItem {
  /** Display label */
  label: string;
  /** Unique key (used with (itemClick) to identify which item was clicked) */
  key?: string;
  /** Angular Router commands — renders item as <a [routerLink]> */
  route?: string | any[];
  /** External / internal URL — renders item as <a [href]> */
  href?: string;
  /** Link target. Default '_self' */
  hrefTarget?: '_blank' | '_self';
  /** Disabled state — prevents click/dblclick */
  disabled?: boolean;
}

export type PkBreadcrumbSeparator = 'default' | 'slash' | 'dot' | 'arrow';
export type PkBreadcrumbSize = 'sm' | 'md' | 'lg';
