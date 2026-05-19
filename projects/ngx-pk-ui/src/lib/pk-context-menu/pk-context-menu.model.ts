export type PkContextMenuLayout = 'vertical' | 'horizontal';

export type PkContextMenuTheme =
  | 'light'
  | 'dark'
  | 'green'
  | 'blue'
  | 'orange'
  | 'red'
  | 'magenta';

export interface PkContextMenuItem {
  /** Unique identifier — used for tracking in @for loops. */
  id?: string | number;
  /** Display label. */
  title?: string;
  /** Material Symbols icon name. */
  icon?: string;
  /** Prevent the item from being selected. */
  disabled?: boolean;
  /** Render a horizontal (vertical layout) or vertical (horizontal layout) divider line.
   *  Other fields are ignored when `separator: true`. */
  separator?: boolean;
  /** Angular Router commands — calls `router.navigate(route)`. */
  route?: any[];
  /** External URL — opened via `window.open()`. */
  href?: string;
  /** Target for `href`. Defaults to `'_blank'`. */
  hrefTarget?: '_blank' | '_self';
  /** Callback function executed when the item is selected. */
  fn?: () => void;
}

export interface PkContextMenuSelectEvent {
  /** The menu item that was selected. */
  item: PkContextMenuItem;
  /** The originating DOM event. */
  originalEvent: MouseEvent | KeyboardEvent;
}
