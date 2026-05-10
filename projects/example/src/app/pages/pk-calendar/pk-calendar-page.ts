import { Component, signal } from '@angular/core';
import { PkCalendar } from 'ngx-pk-ui';
import type { PkCalendarEvent, PkCalendarView, PkEventMoveResult } from 'ngx-pk-ui';

const today = new Date();
const d = (offsetDays: number, hours = 0, minutes = 0) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hours, minutes, 0, 0);
  return dt;
};

let nextId = 100;

const SAMPLE_EVENTS: PkCalendarEvent[] = [
  // Multi-day
  {
    id: 1, title: 'Product Summit', type: 'event',
    start: d(-1), end: d(2), allDay: true,
    priority: 'high', color: '#8b5cf6',
    description: 'Annual product strategy summit with all stakeholders.',
    location: 'Conference Center, Bangkok',
    tags: ['strategy', 'company'],
  },
  // Meeting with attachment
  {
    id: 2, title: 'Sprint Planning', type: 'meeting',
    start: d(0, 10, 0), end: d(0, 11, 30),
    priority: 'medium',
    description: 'Plan sprint backlog for the next two weeks.',
    attachments: [
      { label: 'Backlog Sheet', url: 'https://docs.google.com/spreadsheets/d/example' },
    ],
    canEdit: true, canDelete: true,
  },
  // Appointment
  {
    id: 3, title: 'Doctor Appointment', type: 'appointment',
    start: d(1, 14, 0), end: d(1, 15, 0),
    priority: 'urgent', color: '#0891b2',
    location: 'City Hospital',
    canEdit: true, canDelete: true,
  },
  // Birthday (allDay)
  {
    id: 4, title: '🎂 Alex\'s Birthday', type: 'birthday',
    start: d(3), allDay: true,
    color: '#ec4899',
    canDelete: false,
  },
  // Holiday
  {
    id: 5, title: 'National Day', type: 'holiday',
    start: d(5), allDay: true,
    color: '#10b981',
    canEdit: false, canDelete: false,
  },
  // Festival (multi-day)
  {
    id: 6, title: 'Songkran Festival', type: 'festival',
    start: d(7), end: d(10), allDay: true,
    color: '#f59e0b',
    canEdit: false, canDelete: false,
  },
  // Task with image
  {
    id: 7, title: 'Design Review', type: 'task',
    start: d(2, 9, 0), end: d(2, 10, 0),
    priority: 'high',
    image: 'https://picsum.photos/seed/design/80/80',
    description: 'Review UI mockups for the new dashboard.',
    attendees: ['alice@company.com', 'bob@company.com'],
    canEdit: true, canDelete: true,
  },
  // Reminder
  {
    id: 8, title: 'Submit Report', type: 'reminder',
    start: d(4, 17, 0), end: d(4, 17, 30),
    priority: 'medium', color: '#f97316',
    canEdit: true, canDelete: true,
  },
  // Overlapping timed events (same day)
  {
    id: 9, title: 'Stand-up', type: 'meeting',
    start: d(0, 9, 0), end: d(0, 9, 30),
    priority: 'low',
    canEdit: true, canDelete: true,
  },
  {
    id: 10, title: 'Code Review', type: 'task',
    start: d(0, 9, 0), end: d(0, 10, 30),
    priority: 'medium',
    canEdit: true, canDelete: true,
  },
  // Read-only event
  {
    id: 11, title: 'Board Meeting (read-only)', type: 'meeting',
    start: d(-3, 13, 0), end: d(-3, 15, 0),
    priority: 'urgent',
    canEdit: false, canDelete: false,
  },
  // Other
  {
    id: 12, title: 'Lunch with Team', type: 'other',
    start: d(6, 12, 0), end: d(6, 13, 0),
    color: '#6b7280',
    canEdit: true, canDelete: true,
  },
];

@Component({
  selector: 'pk-calendar-page',
  standalone: true,
  imports: [PkCalendar],
  templateUrl: './pk-calendar-page.html',
})
export class PkCalendarPage {
  events = signal<PkCalendarEvent[]>(SAMPLE_EVENTS);
  view   = signal<PkCalendarView>('month');
  locale = signal<'TH' | 'EN'>('EN');
  startOfWeek = signal<'monday' | 'sunday'>('sunday');

  onEventCreate(ev: PkCalendarEvent): void {
    this.events.update(list => [...list, { ...ev, id: nextId++ }]);
    console.log('[pk-calendar] created:', ev);
  }

  onEventUpdate(ev: PkCalendarEvent): void {
    this.events.update(list => list.map(e => e.id === ev.id ? ev : e));
    console.log('[pk-calendar] updated:', ev);
  }

  onEventDelete(ev: PkCalendarEvent): void {
    this.events.update(list => list.filter(e => e.id !== ev.id));
    console.log('[pk-calendar] deleted:', ev);
  }

  onEventMove(result: PkEventMoveResult): void {
    this.events.update(list => list.map(e => {
      if (e.id !== result.event.id) return e;
      return { ...e, start: result.newStart, end: result.newEnd ?? e.end };
    }));
    console.log('[pk-calendar] moved:', result);
  }

  onEventClick(ev: PkCalendarEvent): void {
    console.log('[pk-calendar] clicked:', ev);
  }

  onDateClick(date: Date): void {
    console.log('[pk-calendar] date clicked:', date);
  }

  onViewChange(v: PkCalendarView): void {
    this.view.set(v);
    console.log('[pk-calendar] view changed to:', v);
  }

  onNavigate(date: Date): void {
    console.log('[pk-calendar] navigated to:', date);
  }

  toggleLocale(): void {
    this.locale.update(v => v === 'EN' ? 'TH' : 'EN');
  }

  toggleStartOfWeek(): void {
    this.startOfWeek.update(v => v === 'sunday' ? 'monday' : 'sunday');
  }
}
