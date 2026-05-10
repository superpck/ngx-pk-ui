import { Component, input, output, signal, computed, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import type { PkCalendarEvent, PkCalendarAttachment, PkEventType, PkEventPriority } from './pk-calendar.model';

const TYPE_COLORS: Record<string, string> = {
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

const PRESET_COLORS = [
  '#4f46e5', '#0891b2', '#ec4899', '#10b981',
  '#f59e0b', '#8b5cf6', '#3b82f6', '#f97316',
  '#ef4444', '#6b7280',
];

@Component({
  selector: 'pk-calendar-form',
  standalone: true,
  imports: [FormsModule, NgStyle],
  templateUrl: './pk-calendar-form.html',
  styleUrl: './pk-calendar-form.css',
})
export class PkCalendarForm implements OnChanges {
  event       = input<PkCalendarEvent | null>(null);
  initialDate = input<Date>(new Date());
  locale      = input<'TH' | 'EN'>('EN');
  readonly    = input<boolean>(false);

  onSave   = output<PkCalendarEvent>();
  onDelete = output<PkCalendarEvent>();
  onCancel = output<void>();

  // ─── Form fields ────────────────────────────────────────────────────────────
  id          = signal<string | number>(0);
  title       = signal('');
  type        = signal<PkEventType>('event');
  priority    = signal<PkEventPriority | ''>('');
  allDay      = signal(true);
  startDate   = signal('');
  startTime   = signal('09:00');
  endDate     = signal('');
  endTime     = signal('10:00');
  color       = signal('');
  customColor = signal('');
  description = signal('');
  location    = signal('');
  image       = signal('');
  attachments = signal<PkCalendarAttachment[]>([]);
  tags        = signal('');
  attendees   = signal('');

  // ─── Derived ────────────────────────────────────────────────────────────────
  isEditing   = computed(() => this.event() !== null);
  canEdit     = computed(() => this.event()?.canEdit !== false);
  canDelete   = computed(() => this.event()?.canDelete !== false);

  readonly presetColors = PRESET_COLORS;
  readonly eventTypes: PkEventType[] = [
    'meeting', 'appointment', 'birthday', 'holiday',
    'festival', 'event', 'task', 'reminder', 'other',
  ];
  readonly priorities: { value: PkEventPriority | ''; label: string }[] = [
    { value: '', label: this.locale() === 'TH' ? '— ไม่ระบุ —' : '— None —' },
    { value: 'low',    label: this.locale() === 'TH' ? 'ต่ำ'    : 'Low'    },
    { value: 'medium', label: this.locale() === 'TH' ? 'ปานกลาง': 'Medium' },
    { value: 'high',   label: this.locale() === 'TH' ? 'สูง'    : 'High'   },
    { value: 'urgent', label: this.locale() === 'TH' ? 'เร่งด่วน': 'Urgent' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event'] || changes['initialDate']) {
      this._populate();
    }
  }

  private _toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private _toTimeStr(d: Date): string {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  private _populate(): void {
    const ev = this.event();
    if (ev) {
      this.id.set(ev.id);
      this.title.set(ev.title);
      this.type.set(ev.type);
      this.priority.set(ev.priority ?? '');
      this.allDay.set(ev.allDay ?? false);
      this.startDate.set(this._toDateStr(new Date(ev.start)));
      this.startTime.set(this._toTimeStr(new Date(ev.start)));
      const end = ev.end ? new Date(ev.end) : new Date(ev.start);
      this.endDate.set(this._toDateStr(end));
      this.endTime.set(this._toTimeStr(end));
      this.color.set(ev.color ?? '');
      this.customColor.set(ev.color ?? '');
      this.description.set(ev.description ?? '');
      this.location.set(ev.location ?? '');
      this.image.set(ev.image ?? '');
      this.attachments.set(ev.attachments ? [...ev.attachments] : []);
      this.tags.set((ev.tags ?? []).join(', '));
      this.attendees.set((ev.attendees ?? []).join(', '));
    } else {
      const d = this.initialDate();
      this.id.set(0);
      this.title.set('');
      this.type.set('event');
      this.priority.set('');
      this.allDay.set(true);
      this.startDate.set(this._toDateStr(d));
      this.startTime.set('09:00');
      this.endDate.set(this._toDateStr(d));
      this.endTime.set('10:00');
      this.color.set('');
      this.customColor.set('');
      this.description.set('');
      this.location.set('');
      this.image.set('');
      this.attachments.set([]);
      this.tags.set('');
      this.attendees.set('');
    }
  }

  private _buildDate(dateStr: string, timeStr: string): Date {
    const [y, m, d]   = dateStr.split('-').map(Number);
    const [hr, min]   = timeStr.split(':').map(Number);
    return new Date(y, m - 1, d, hr, min);
  }

  private _buildEvent(): PkCalendarEvent {
    const startDt = this._buildDate(this.startDate(), this.allDay() ? '00:00' : this.startTime());
    const endDt   = this._buildDate(this.endDate()   || this.startDate(), this.allDay() ? '23:59' : this.endTime());
    const ev = this.event();
    return {
      id:          this.id() || Date.now(),
      title:       this.title().trim() || '(no title)',
      type:        this.type(),
      priority:    this.priority() || undefined,
      allDay:      this.allDay(),
      start:       startDt,
      end:         endDt,
      color:       this.color() || this.customColor() || TYPE_COLORS[this.type()],
      description: this.description().trim() || undefined,
      location:    this.location().trim() || undefined,
      image:       this.image().trim() || undefined,
      attachments: this.attachments().filter(a => a.url.trim()),
      tags:        this.tags().split(',').map(t => t.trim()).filter(Boolean),
      attendees:   this.attendees().split(',').map(a => a.trim()).filter(Boolean),
      canEdit:     ev?.canEdit,
      canDelete:   ev?.canDelete,
    };
  }

  save(): void {
    this.onSave.emit(this._buildEvent());
  }

  deleteSelf(): void {
    const ev = this.event();
    if (ev) this.onDelete.emit(ev);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  selectColor(c: string): void {
    this.color.set(c);
    this.customColor.set(c);
  }

  onCustomColorChange(val: string): void {
    this.customColor.set(val);
    this.color.set(val);
  }

  addAttachment(): void {
    this.attachments.update(list => [...list, { label: '', url: '' }]);
  }

  removeAttachment(i: number): void {
    this.attachments.update(list => list.filter((_, idx) => idx !== i));
  }

  updateAttachment(i: number, field: 'label' | 'url', val: string): void {
    this.attachments.update(list => {
      const copy = [...list];
      copy[i] = { ...copy[i], [field]: val };
      return copy;
    });
  }

  typeLabel(t: PkEventType): string {
    const map: Record<string, string> = {
      meeting: 'Meeting', appointment: 'Appointment', birthday: 'Birthday',
      holiday: 'Holiday', festival: 'Festival', event: 'Event',
      task: 'Task', reminder: 'Reminder', other: 'Other',
    };
    return map[t] ?? t;
  }

  colorOf(t: PkEventType): string {
    return TYPE_COLORS[t] ?? '#6b7280';
  }
}
