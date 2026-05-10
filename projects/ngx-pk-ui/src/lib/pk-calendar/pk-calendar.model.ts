export type PkEventType =
  | 'meeting'
  | 'appointment'
  | 'birthday'
  | 'holiday'
  | 'festival'
  | 'event'
  | 'task'
  | 'reminder'
  | 'work out'
  | 'other';

export type PkEventPriority = 'low' | 'medium' | 'high' | 'urgent';

export type PkCalendarView = 'year' | 'month' | 'week' | 'day' | 'agenda';

export interface PkCalendarAttachment {
  label: string;
  url: string;
}

export interface PkCalendarEvent {
  id: string | number;
  title: string;
  type: PkEventType;
  priority?: PkEventPriority;
  start: Date;
  end?: Date;
  allDay?: boolean;
  color?: string;
  description?: string;
  location?: string;
  image?: string;
  attachments?: PkCalendarAttachment[];
  tags?: string[];
  attendees?: string[];
  /** If false, the Edit button is hidden in the detail form. Default true. */
  canEdit?: boolean;
  /** If false, the Delete button is hidden in the detail form. Default true. */
  canDelete?: boolean;
}

export interface PkEventMoveResult {
  event: PkCalendarEvent;
  newStart: Date;
  newEnd?: Date;
}

// ─── Internal grid helpers (not exported from public-api) ─────────────────────

export interface PkDayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

/** A resolved multi-day bar for month-view rendering */
export interface PkEventBar {
  event: PkCalendarEvent;
  /** 0-based column index where the bar starts in this week row */
  colStart: number;
  /** number of columns the bar spans (1–7) */
  colSpan: number;
  /** slot row (0 = top bar, 1 = second, …) */
  slotRow: number;
  /** bar starts on this day (clipped to row start) */
  startDate: Date;
  /** bar ends on this day (clipped to row end) */
  endDate: Date;
  isStart: boolean;
  isEnd: boolean;
}

/** Timed event with computed overlap position for week/day view */
export interface PkEventBlock {
  event: PkCalendarEvent;
  top: number;       // % from top of day column
  height: number;    // % height
  left: number;      // % from left
  width: number;     // %
}

/** A week-row used in month view */
export interface PkWeekRow {
  days: PkDayCell[];
  bars: PkEventBar[];
  /** events that overflow the max visible slots per day, keyed by date ISO string */
  overflow: Record<string, number>;
}
