import {
  Component, input, output, signal, computed, effect, OnChanges, SimpleChanges,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { PkCalendarForm } from './pk-calendar-form';
import type {
  PkCalendarEvent, PkCalendarView, PkEventMoveResult,
  PkDayCell, PkWeekRow, PkEventBar, PkEventBlock,
} from './pk-calendar.model';

// ─── Type colours (default palette) ──────────────────────────────────────────
export const PK_EVENT_COLORS: Record<string, string> = {
  meeting:     '#4f46e5',
  appointment: '#0891b2',
  birthday:    '#ec4899',
  holiday:     '#10b981',
  festival:    '#f59e0b',
  event:       '#8b5cf6',
  task:        '#3b82f6',
  reminder:    '#f97316',
  other:       '#6b7280',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: '#10b981', medium: '#f59e0b', high: '#f97316', urgent: '#ef4444',
};

const MAX_BAR_SLOTS = 3; // max visible bars per day in month view

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate()  === b.getDate();
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function diffDays(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000);
}

@Component({
  selector: 'pk-calendar',
  standalone: true,
  imports: [NgStyle, PkCalendarForm],
  templateUrl: './pk-calendar.html',
  styleUrl: './pk-calendar.css',
})
export class PkCalendar implements OnChanges {
  // ─── Public inputs ──────────────────────────────────────────────────────────
  events      = input<PkCalendarEvent[]>([]);
  view        = input<PkCalendarView>('month');
  currentDate = input<Date>(new Date());
  locale      = input<'TH' | 'EN'>('EN');
  startOfWeek = input<'monday' | 'sunday'>('sunday');
  readonly    = input<boolean>(false);
  showWeekNumbers = input<boolean>(false);

  // ─── Public outputs ─────────────────────────────────────────────────────────
  onEventClick  = output<PkCalendarEvent>();
  onDateClick   = output<Date>();
  onEventCreate = output<PkCalendarEvent>();
  onEventUpdate = output<PkCalendarEvent>();
  onEventDelete = output<PkCalendarEvent>();
  onEventMove   = output<PkEventMoveResult>();
  onViewChange  = output<PkCalendarView>();
  onNavigate    = output<Date>();

  // ─── Internal state ──────────────────────────────────────────────────────────
  _view        = signal<PkCalendarView>('month');
  _currentDate = signal<Date>(new Date());

  _showForm    = signal(false);
  _editingEvent = signal<PkCalendarEvent | null>(null);
  _formDate    = signal<Date>(new Date());

  // drag state
  private _draggingEvent: PkCalendarEvent | null = null;
  private _dragOffsetDays = 0;

  // ─── Lifecycle ───────────────────────────────────────────────────────────────
  constructor() {
    effect(() => { this._view.set(this.view()); });
    effect(() => { this._currentDate.set(new Date(this.currentDate())); });
  }

  ngOnChanges(_: SimpleChanges): void {}

  // ─── Computed: locale helpers ────────────────────────────────────────────────
  readonly _weekdays = computed<string[]>(() => {
    const th = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    const en = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const labels = this.locale() === 'TH' ? th : en;
    if (this.startOfWeek() === 'monday') {
      return [...labels.slice(1), labels[0]];
    }
    return labels;
  });

  readonly _monthNames = computed<string[]>(() =>
    this.locale() === 'TH'
      ? ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
         'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']
      : ['January','February','March','April','May','June',
         'July','August','September','October','November','December']
  );

  readonly _monthNamesShort = computed<string[]>(() =>
    this.locale() === 'TH'
      ? ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
         'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
      : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  );

  // ─── Computed: toolbar title ─────────────────────────────────────────────────
  readonly _toolbarTitle = computed<string>(() => {
    const d = this._currentDate();
    const v = this._view();
    const months = this._monthNames();
    const year = this.locale() === 'TH' ? d.getFullYear() + 543 : d.getFullYear();
    if (v === 'year')  return String(year);
    if (v === 'month') return `${months[d.getMonth()]} ${year}`;
    if (v === 'week') {
      const [first, last] = this._weekRange();
      const y1 = this.locale() === 'TH' ? first.getFullYear() + 543 : first.getFullYear();
      const y2 = this.locale() === 'TH' ? last.getFullYear()  + 543 : last.getFullYear();
      const m  = this._monthNamesShort();
      if (first.getMonth() === last.getMonth())
        return `${first.getDate()} – ${last.getDate()} ${m[last.getMonth()]} ${y1}`;
      return `${first.getDate()} ${m[first.getMonth()]} – ${last.getDate()} ${m[last.getMonth()]} ${y2}`;
    }
    // day
    const m = this._monthNamesShort();
    return `${d.getDate()} ${m[d.getMonth()]} ${year}`;
  });

  // ─── Computed: month grid ────────────────────────────────────────────────────
  readonly _monthGrid = computed<PkWeekRow[]>(() => {
    const d = this._currentDate();
    const firstOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const lastOfMonth  = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const offset = this._startOffset(firstOfMonth.getDay());
    const firstCell = addDays(firstOfMonth, -offset);

    const today = startOfDay(new Date());
    const cells: PkDayCell[] = [];
    for (let i = 0; i < 42; i++) {
      const dt = addDays(firstCell, i);
      cells.push({
        date: dt,
        isCurrentMonth: dt.getMonth() === d.getMonth(),
        isToday: sameDay(dt, today),
        isWeekend: dt.getDay() === 0 || dt.getDay() === 6,
      });
    }

    const weeks: PkWeekRow[] = [];
    for (let w = 0; w < 6; w++) {
      const weekDays = cells.slice(w * 7, w * 7 + 7);
      if (w > 0 && !weekDays.some(c => c.isCurrentMonth)) continue; // trim trailing empty weeks
      weeks.push({
        days: weekDays,
        bars: this._barsForWeek(weekDays),
        overflow: this._overflowForWeek(weekDays, this._barsForWeek(weekDays)),
      });
    }
    return weeks;
  });

  private _startOffset(dayOfWeek: number): number {
    if (this.startOfWeek() === 'monday') return (dayOfWeek + 6) % 7;
    return dayOfWeek;
  }

  private _barsForWeek(days: PkDayCell[]): PkEventBar[] {
    const rowStart = days[0].date;
    const rowEnd   = days[6].date;
    const events   = this.events();

    const candidates = events.filter(ev => {
      const evStart = startOfDay(new Date(ev.start));
      const evEnd   = ev.end ? startOfDay(new Date(ev.end)) : evStart;
      return evEnd >= rowStart && evStart <= rowEnd;
    });

    // Sort: longest first, then by start
    candidates.sort((a, b) => {
      const dA = diffDays(a.end ? new Date(a.end) : new Date(a.start), new Date(a.start));
      const dB = diffDays(b.end ? new Date(b.end) : new Date(b.start), new Date(b.start));
      if (dB !== dA) return dB - dA;
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });

    const bars: PkEventBar[] = [];
    // slot occupation: slot[col] = last event end col in that slot row
    const slotOccupied: number[][] = []; // slotOccupied[slotRow][col] = true

    for (const ev of candidates) {
      const evStart = startOfDay(new Date(ev.start));
      const evEnd   = ev.end ? startOfDay(new Date(ev.end)) : evStart;

      const barStart = evStart < rowStart ? rowStart : evStart;
      const barEnd   = evEnd   > rowEnd   ? rowEnd   : evEnd;

      const colStart = diffDays(barStart, rowStart);
      const colEnd   = diffDays(barEnd,   rowStart);
      const colSpan  = colEnd - colStart + 1;

      // find first available slot row
      let slotRow = 0;
      while (true) {
        if (!slotOccupied[slotRow]) slotOccupied[slotRow] = [];
        const occupied = slotOccupied[slotRow].slice(colStart, colStart + colSpan).some(Boolean);
        if (!occupied) break;
        slotRow++;
      }
      for (let c = colStart; c < colStart + colSpan; c++) {
        slotOccupied[slotRow][c] = 1 as any;
      }

      bars.push({
        event: ev,
        colStart, colSpan, slotRow,
        startDate: barStart, endDate: barEnd,
        isStart: sameDay(evStart, barStart),
        isEnd:   sameDay(evEnd,   barEnd),
      });
    }

    return bars;
  }

  private _overflowForWeek(days: PkDayCell[], bars: PkEventBar[]): Record<string, number> {
    const overflow: Record<string, number> = {};
    for (const day of days) {
      const key = day.date.toISOString().slice(0, 10);
      const col = diffDays(day.date, days[0].date);
      const count = bars.filter(b => col >= b.colStart && col < b.colStart + b.colSpan && b.slotRow >= MAX_BAR_SLOTS).length;
      if (count > 0) overflow[key] = count;
    }
    return overflow;
  }

  // ─── Computed: week range ────────────────────────────────────────────────────
  readonly _weekRange = computed<[Date, Date]>(() => {
    const d    = this._currentDate();
    const dow  = d.getDay();
    const off  = this.startOfWeek() === 'monday' ? (dow + 6) % 7 : dow;
    const first = addDays(d, -off);
    return [startOfDay(first), startOfDay(addDays(first, 6))];
  });

  readonly _weekDays = computed<Date[]>(() => {
    const [first] = this._weekRange();
    return Array.from({ length: 7 }, (_, i) => addDays(first, i));
  });

  // ─── Computed: week/day timed event blocks ───────────────────────────────────
  readonly _weekBlocks = computed<Map<string, PkEventBlock[]>>(() => {
    const days = this._weekDays();
    const result = new Map<string, PkEventBlock[]>();
    for (const day of days) {
      result.set(day.toISOString().slice(0, 10), this._blocksForDay(day));
    }
    return result;
  });

  readonly _dayBlocks = computed<PkEventBlock[]>(() =>
    this._blocksForDay(this._currentDate())
  );

  // All-day events for week view header
  readonly _weekAllDay = computed<Map<string, PkCalendarEvent[]>>(() => {
    const days = this._weekDays();
    const result = new Map<string, PkCalendarEvent[]>();
    for (const day of days) {
      const key = day.toISOString().slice(0, 10);
      result.set(key, this.events().filter(ev => {
        if (!ev.allDay) return false;
        const s = startOfDay(new Date(ev.start));
        const e = ev.end ? startOfDay(new Date(ev.end)) : s;
        return s <= day && day <= e;
      }));
    }
    return result;
  });

  private _blocksForDay(day: Date): PkEventBlock[] {
    const dayStart = startOfDay(day);
    const dayEnd   = addDays(dayStart, 1);
    const timed    = this.events().filter(ev => {
      if (ev.allDay) return false;
      const s = new Date(ev.start);
      const e = ev.end ? new Date(ev.end) : new Date(s.getTime() + 3_600_000);
      return s < dayEnd && e > dayStart;
    });

    timed.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    // overlap: assign column indices
    const cols: Array<{ event: PkCalendarEvent; colIdx: number; totalCols: number; top: number; height: number }> = [];
    const clusters: PkCalendarEvent[][] = [];

    for (const ev of timed) {
      const s = Math.max(new Date(ev.start).getTime(), dayStart.getTime());
      const e = Math.min(ev.end ? new Date(ev.end).getTime() : s + 3_600_000, dayEnd.getTime());
      const top    = ((s - dayStart.getTime()) / 86_400_000) * 100;
      const height = Math.max(((e - s) / 86_400_000) * 100, 2);

      // find cluster to join
      let placed = false;
      for (const cluster of clusters) {
        const last = cluster[cluster.length - 1];
        const lastEnd = last.end ? new Date(last.end) : new Date(new Date(last.start).getTime() + 3_600_000);
        if (new Date(ev.start) < lastEnd) {
          cluster.push(ev);
          placed = true;
          break;
        }
      }
      if (!placed) clusters.push([ev]);

      cols.push({ event: ev, colIdx: 0, totalCols: 1, top, height });
    }

    // resolve column indices within each cluster
    for (const cluster of clusters) {
      const n = cluster.length;
      cluster.forEach((ev, i) => {
        const col = cols.find(c => c.event === ev);
        if (col) { col.colIdx = i; col.totalCols = n; }
      });
    }

    return cols.map(c => ({
      event:  c.event,
      top:    c.top,
      height: c.height,
      left:   (c.colIdx / c.totalCols) * 100,
      width:  (1 / c.totalCols) * 100,
    }));
  }

  // ─── Computed: year view ─────────────────────────────────────────────────────
  readonly _yearMonths = computed<Array<{ month: number; year: number; dots: string[] }>>(() => {
    const d     = this._currentDate();
    const year  = d.getFullYear();
    const evs   = this.events();
    return Array.from({ length: 12 }, (_, m) => {
      const monthEvs = evs.filter(ev => {
        const s = new Date(ev.start);
        return s.getFullYear() === year && s.getMonth() === m;
      });
      const colors = [...new Set(monthEvs.map(ev => ev.color ?? PK_EVENT_COLORS[ev.type] ?? '#6b7280'))].slice(0, 4);
      return { month: m, year, dots: colors };
    });
  });

  // ─── Computed: agenda view ───────────────────────────────────────────────────
  readonly _agendaDays = computed<Array<{ date: Date; events: PkCalendarEvent[] }>>(() => {
    const d   = this._currentDate();
    const result: Array<{ date: Date; events: PkCalendarEvent[] }> = [];
    for (let i = 0; i < 60; i++) {
      const day = addDays(startOfDay(d), i);
      const dayEvs = this.events().filter(ev => {
        const s = startOfDay(new Date(ev.start));
        const e = ev.end ? startOfDay(new Date(ev.end)) : s;
        return s <= day && day <= e;
      });
      if (dayEvs.length) result.push({ date: day, events: dayEvs });
    }
    return result;
  });

  // ─── Navigation ──────────────────────────────────────────────────────────────
  prev(): void {
    this._currentDate.update(d => {
      const n = new Date(d);
      const v = this._view();
      if (v === 'year')  n.setFullYear(n.getFullYear() - 1);
      else if (v === 'month') n.setMonth(n.getMonth() - 1);
      else if (v === 'week')  n.setDate(n.getDate() - 7);
      else                     n.setDate(n.getDate() - 1);
      this.onNavigate.emit(new Date(n));
      return n;
    });
  }

  next(): void {
    this._currentDate.update(d => {
      const n = new Date(d);
      const v = this._view();
      if (v === 'year')  n.setFullYear(n.getFullYear() + 1);
      else if (v === 'month') n.setMonth(n.getMonth() + 1);
      else if (v === 'week')  n.setDate(n.getDate() + 7);
      else                     n.setDate(n.getDate() + 1);
      this.onNavigate.emit(new Date(n));
      return n;
    });
  }

  goToday(): void {
    const today = new Date();
    this._currentDate.set(today);
    this.onNavigate.emit(today);
  }

  setView(v: PkCalendarView): void {
    this._view.set(v);
    this.onViewChange.emit(v);
  }

  goToMonth(month: number, year: number): void {
    this._currentDate.set(new Date(year, month, 1));
    this.setView('month');
  }

  // ─── Form / event interaction ────────────────────────────────────────────────
  openCreate(date: Date): void {
    if (this.readonly()) return;
    this._editingEvent.set(null);
    this._formDate.set(date);
    this._showForm.set(true);
    this.onDateClick.emit(date);
  }

  openEdit(ev: PkCalendarEvent, $event: Event): void {
    $event.stopPropagation();
    this.onEventClick.emit(ev);
    this._editingEvent.set(ev);
    this._formDate.set(new Date(ev.start));
    this._showForm.set(true);
  }

  closeForm(): void {
    this._showForm.set(false);
    this._editingEvent.set(null);
  }

  handleSave(ev: PkCalendarEvent): void {
    if (this._editingEvent()) this.onEventUpdate.emit(ev);
    else                       this.onEventCreate.emit(ev);
    this.closeForm();
  }

  handleDelete(ev: PkCalendarEvent): void {
    this.onEventDelete.emit(ev);
    this.closeForm();
  }

  // ─── Drag & drop ────────────────────────────────────────────────────────────
  onDragStart(event: DragEvent, calEvent: PkCalendarEvent): void {
    if (this.readonly()) { event.preventDefault(); return; }
    this._draggingEvent = calEvent;
    this._dragOffsetDays = 0;
    event.dataTransfer?.setData('text/plain', String(calEvent.id));
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetDate: Date): void {
    event.preventDefault();
    const ev = this._draggingEvent;
    if (!ev) return;
    const origStart = startOfDay(new Date(ev.start));
    const delta     = diffDays(targetDate, origStart);
    if (delta === 0) { this._draggingEvent = null; return; }

    const newStart = addDays(new Date(ev.start), delta);
    const newEnd   = ev.end ? addDays(new Date(ev.end), delta) : undefined;
    this.onEventMove.emit({ event: ev, newStart, newEnd });
    this._draggingEvent = null;
  }

  // ─── Public helpers (used in template) ───────────────────────────────────────
  eventColor(ev: PkCalendarEvent): string {
    return ev.color ?? PK_EVENT_COLORS[ev.type] ?? '#6b7280';
  }

  priorityColor(ev: PkCalendarEvent): string {
    return ev.priority ? PRIORITY_COLORS[ev.priority] ?? 'transparent' : 'transparent';
  }

  eventTypeLabel(ev: PkCalendarEvent): string {
    const th: Record<string, string> = {
      meeting: 'ประชุม', appointment: 'นัดหมาย', birthday: 'วันเกิด',
      holiday: 'วันหยุด', festival: 'เทศกาล', event: 'กิจกรรม',
      task: 'งาน', reminder: 'แจ้งเตือน', other: 'อื่นๆ',
    };
    const en: Record<string, string> = {
      meeting: 'Meeting', appointment: 'Appointment', birthday: 'Birthday',
      holiday: 'Holiday', festival: 'Festival', event: 'Event',
      task: 'Task', reminder: 'Reminder', other: 'Other',
    };
    return (this.locale() === 'TH' ? th : en)[ev.type] ?? ev.type;
  }

  formatTime(ev: PkCalendarEvent): string {
    if (ev.allDay) return '';
    const d = new Date(ev.start);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  formatDateLabel(date: Date): string {
    const months = this._monthNamesShort();
    const year   = this.locale() === 'TH' ? date.getFullYear() + 543 : date.getFullYear();
    return `${date.getDate()} ${months[date.getMonth()]} ${year}`;
  }

  dayKey(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  timeHours(): number[] {
    return Array.from({ length: 24 }, (_, i) => i);
  }

  isToday(d: Date): boolean {
    return sameDay(d, new Date());
  }

  dayNumber(d: Date): number {
    return d.getDate();
  }

  weekDayLabel(d: Date): string {
    return this._weekdays()[this.startOfWeek() === 'monday' ? (d.getDay() + 6) % 7 : d.getDay()];
  }

  yearLabel(): number {
    return this.locale() === 'TH'
      ? this._currentDate().getFullYear() + 543
      : this._currentDate().getFullYear();
  }
}
