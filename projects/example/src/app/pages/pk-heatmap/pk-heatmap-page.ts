import { Component, signal } from '@angular/core';
import { PkHeatmap } from 'ngx-pk-ui';
import type { PkHeatmapColorScheme, PkHeatmapDay, PkHeatmapLocale } from 'ngx-pk-ui';

// Thai public holidays (within a rolling 1-year window)
const THAI_HOLIDAYS: Record<string, string> = {
  '2025-05-01': 'วันแรงงาน',
  '2025-05-04': 'วันฉัตรมงคล',
  '2025-07-28': 'วันเฉลิมพระชนมพรรษา ร.10',
  '2025-08-12': 'วันแม่แห่งชาติ',
  '2025-10-13': 'วันนวมินทรมหาราช',
  '2025-10-23': 'วันปิยมหาราช',
  '2025-12-05': 'วันพ่อแห่งชาติ',
  '2025-12-10': 'วันรัฐธรรมนูญ',
  '2025-12-31': 'วันสิ้นปี',
  '2026-01-01': 'วันขึ้นปีใหม่',
  '2026-04-06': 'วันจักรี',
  '2026-04-13': 'วันสงกรานต์',
  '2026-04-14': 'วันสงกรานต์',
  '2026-04-15': 'วันสงกรานต์',
  '2026-05-01': 'วันแรงงาน',
  '2026-05-04': 'วันฉัตรมงคล',
};

// Generate random 1-year data once
function makeData(): PkHeatmapDay[] {
  const result: PkHeatmapDay[] = [];
  const end   = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  const cur = new Date(start);
  while (cur <= end) {
    if (Math.random() > 0.45) {
        const key = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`;
        result.push({ date: new Date(cur), no: Math.ceil(Math.random() * 12), holiday: THAI_HOLIDAYS[key] });
      }
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

@Component({
  selector: 'app-pk-heatmap-page',
  standalone: true,
  imports: [PkHeatmap],
  templateUrl: './pk-heatmap-page.html',
})
export class PkHeatmapPage {
  readonly data: PkHeatmapDay[] = makeData();

  scheme      = signal<PkHeatmapColorScheme>('green');
  locale      = signal<PkHeatmapLocale>('en');
  showLegend  = signal(true);
  showDays    = signal(true);
  showMonths  = signal(true);
  useCustomFmt = signal(false);

  readonly customFmt = (day: PkHeatmapDay): string => {
    const d = day.date instanceof Date ? day.date : new Date(day.date);
    return `📅 ${d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}: ${day.no} commits`;
  };

  readonly schemes: PkHeatmapColorScheme[] = ['green', 'blue', 'purple', 'orange'];
}
