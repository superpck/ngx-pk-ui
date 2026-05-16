import { Component, computed, inject, input, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PkHeatmapCell, PkHeatmapColorScheme, PkHeatmapDay, PkHeatmapLocale } from './pk-heatmap.model';
import { getPkLocaleData } from '../pk-locale/pk-locale.model';

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

@Component({
  selector: 'pk-heatmap',
  standalone: true,
  imports: [],
  templateUrl: './pk-heatmap.html',
  styleUrl: './pk-heatmap.css',
})
export class PkHeatmap implements OnDestroy {

  // ── Inputs ────────────────────────────────────────────────────────────────
  data          = input.required<PkHeatmapDay[]>();
  startDate     = input<Date | string | null>(null);
  endDate       = input<Date | string | null>(null);
  colorScheme   = input<PkHeatmapColorScheme>('green');
  locale        = input<PkHeatmapLocale>('en');
  showLegend    = input<boolean>(true);
  showTooltip   = input<boolean>(true);
  tooltipFormat = input<((day: PkHeatmapDay) => string) | null>(null);
  dayLabels     = input<boolean>(true);
  monthLabels   = input<boolean>(true);

  readonly _localeData  = computed(() => getPkLocaleData(this.locale()));
  readonly _monthNames  = computed(() => this._localeData().monthNamesShort);
  readonly _dayNames    = computed(() => this._localeData().dayNamesShort);

  /** Maximum `no` value in the data — used for the legend upper bound. */
  readonly _maxNo       = computed(() => this.data().reduce((m, d) => Math.max(m, d.no), 0));
  /** Total week columns in the current grid — used for %-based month label positioning. */
  readonly _totalWeeks  = computed(() => this._grid().length);

  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private _tipEl: HTMLDivElement | null = null;

  /** px per week column = 11px cell + 3px gap */
  readonly _CELL_STEP = 14;

  // ── Resolved date range ───────────────────────────────────────────────────
  readonly _start = computed<Date>(() => {
    const s = this.startDate();
    if (s) {
      const d = s instanceof Date ? new Date(s) : new Date(s);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  readonly _end = computed<Date>(() => {
    const e = this.endDate();
    if (e) {
      const d = e instanceof Date ? new Date(e) : new Date(e);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // ── Grid ─────────────────────────────────────────────────────────────────
  readonly _grid = computed<PkHeatmapCell[][]>(() => {
    const data  = this.data();
    const start = this._start();
    const end   = this._end();

    // Build date→no lookup
    const map        = new Map<string, number>();
    const holidayMap = new Map<string, string>();
    for (const entry of data) {
      const dt = entry.date instanceof Date ? entry.date : new Date(entry.date);
      map.set(dateKey(dt), entry.no);
      if (entry.holiday) holidayMap.set(dateKey(dt), entry.holiday);
    }

    // Percentile thresholds (quartiles of non-zero values)
    const nonZero = [...map.values()].filter(v => v > 0).sort((a, b) => a - b);
    const thresh = (pct: number): number => {
      if (nonZero.length === 0) return 0;
      return nonZero[Math.min(Math.floor(nonZero.length * pct), nonZero.length - 1)];
    };
    const t = [thresh(0.25), thresh(0.5), thresh(0.75)];

    const level = (no: number): 0 | 1 | 2 | 3 | 4 => {
      if (no <= 0) return 0;
      if (t[0] >= t[2]) return 4;   // single value or all-same → max intensity
      if (no <= t[0]) return 1;
      if (no <= t[1]) return 2;
      if (no <= t[2]) return 3;
      return 4;
    };

    // Align to week boundaries (week starts Sunday)
    const startSun = new Date(start);
    startSun.setDate(startSun.getDate() - startSun.getDay());
    startSun.setHours(0, 0, 0, 0);

    const endSat = new Date(end);
    endSat.setDate(endSat.getDate() + (6 - endSat.getDay()));
    endSat.setHours(0, 0, 0, 0);

    const weeks: PkHeatmapCell[][] = [];
    const cur = new Date(startSun);

    while (cur <= endSat) {
      const week: PkHeatmapCell[] = [];
      for (let i = 0; i < 7; i++) {
        const key     = dateKey(cur);
        const no      = map.get(key) ?? 0;
        const isEmpty = cur < start || cur > end;
        week.push({ date: new Date(cur), no, level: isEmpty ? 0 : level(no), isEmpty, holiday: holidayMap.get(key) ?? '' });
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(week);
    }

    return weeks;
  });

  // ── Month labels ──────────────────────────────────────────────────────────
  readonly _monthLabels = computed<Array<{ label: string; colIndex: number }>>(() => {
    const grid   = this._grid();
    const labels: Array<{ label: string; colIndex: number }> = [];
    let lastMonth = -1;

    for (let i = 0; i < grid.length; i++) {
      const cell = grid[i].find(c => !c.isEmpty) ?? grid[i][0];
      const m = cell.date.getMonth();
      if (m !== lastMonth) {
        labels.push({ label: this._monthNames()[m], colIndex: i });
        lastMonth = m;
      }
    }
    return labels;
  });

  // ── Tooltip ───────────────────────────────────────────────────────────────
  onCellEnter(event: MouseEvent, cell: PkHeatmapCell): void {
    if (!this._isBrowser || !this.showTooltip() || cell.isEmpty) return;
    this._removeTip();

    const fmt  = this.tooltipFormat();
    const text = fmt ? fmt({ date: cell.date, no: cell.no }) : this._defaultLabel(cell);

    const tip = document.createElement('div');
    tip.textContent = text;
    tip.style.cssText = [
      'position:fixed',
      'z-index:9999',
      'padding:6px 10px',
      'background:#24292f',
      'color:#e6edf3',
      'font-size:11px',
      'border-radius:6px',
      'white-space:nowrap',
      'pointer-events:none',
      'visibility:hidden',
    ].join(';');
    document.body.appendChild(tip);
    this._tipEl = tip;

    const rect    = (event.target as HTMLElement).getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    tip.style.left = `${rect.left + rect.width / 2 - tipRect.width / 2}px`;
    tip.style.top  = `${rect.top - tipRect.height - 8}px`;
    tip.style.visibility = '';
  }

  onCellLeave(): void {
    this._removeTip();
  }

  ngOnDestroy(): void {
    this._removeTip();
  }

  private _removeTip(): void {
    if (this._tipEl) {
      this._tipEl.remove();
      this._tipEl = null;
    }
  }

  private _defaultLabel(cell: PkHeatmapCell): string {
    const d     = cell.date;
    const day   = this._dayNames()[d.getDay()];
    const month = this._monthNames()[d.getMonth()];
    let label = `${cell.no} contribution${cell.no !== 1 ? 's' : ''} on ${day}, ${d.getDate()} ${month} ${d.getFullYear()}`;
    if (cell.holiday) label += ` — ${cell.holiday}`;
    return label;
  }
}
