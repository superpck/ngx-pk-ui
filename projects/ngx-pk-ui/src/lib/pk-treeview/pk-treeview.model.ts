export type TreeSelectionMode = 'none' | 'single' | 'multi';

export interface TreeNode {
  /** Unique key (auto-assigned if omitted) */
  key?: string;
  label: string;
  /** icon name for pk-icon */
  icon?: string;
  /** route for RouterLink */
  routerLink?: string | string[];
  data?: any;
  children?: TreeNode[];
  /** Runtime state — do not set manually */
  _selected?: boolean;
  _indeterminate?: boolean;
  _expanded?: boolean;
}
