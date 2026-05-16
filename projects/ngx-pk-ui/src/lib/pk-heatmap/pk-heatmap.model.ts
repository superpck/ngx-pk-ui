import type { PkLocale } from '../pk-locale/pk-locale.model';

export interface PkHeatmapDay {
  date: string | Date;
  no: number;
  holiday?: string;
}

export type PkHeatmapColorScheme = 'green' | 'blue' | 'purple' | 'orange';
/** @deprecated Use `PkLocale` from `ngx-pk-ui` directly. Kept for backward compatibility. */
export type PkHeatmapLocale = PkLocale;

/** Internal cell — not part of the public API. */
export interface PkHeatmapCell {
  date: Date;
  no: number;
  level: 0 | 1 | 2 | 3 | 4;
  isEmpty: boolean;
  holiday: string;
}
