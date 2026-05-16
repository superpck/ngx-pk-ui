import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { PkHeatmap } from './pk-heatmap';
import { PkHeatmapCell, PkHeatmapColorScheme, PkHeatmapDay } from './pk-heatmap.model';

// ── Test host ─────────────────────────────────────────────────────────────
@Component({
  template: `
    <pk-heatmap
      [data]="data()"
      [startDate]="start()"
      [endDate]="end()"
      [colorScheme]="scheme()"
      [showLegend]="legend()"
      [dayLabels]="dayLabels()"
      [monthLabels]="monthLabels()"
      [showTooltip]="false"
      [tooltipFormat]="fmtFn()"
    />
  `,
  imports: [PkHeatmap],
})
class TestHost {
  data       = signal<PkHeatmapDay[]>([]);
  start      = signal<Date | null>(null);
  end        = signal<Date | null>(null);
  scheme     = signal<PkHeatmapColorScheme>('green');
  legend     = signal<boolean>(true);
  dayLabels  = signal<boolean>(true);
  monthLabels = signal<boolean>(true);
  fmtFn      = signal<((d: PkHeatmapDay) => string) | null>(null);
}

// Helper: same logic as the private dateKey in the component
function key(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getComp(fixture: ComponentFixture<TestHost>): PkHeatmap {
  return fixture.debugElement.query(By.directive(PkHeatmap)).componentInstance as PkHeatmap;
}

// ── Suite ─────────────────────────────────────────────────────────────────
describe('PkHeatmap', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let comp: PkHeatmap;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host    = fixture.componentInstance;
    fixture.detectChanges();
    comp    = getComp(fixture);
  });

  // ── Rendering ─────────────────────────────────────────────────────────
  it('renders the grid container', () => {
    expect(fixture.nativeElement.querySelector('.pk-hm')).toBeTruthy();
  });

  it('applies colorScheme class — green by default', () => {
    expect(fixture.nativeElement.querySelector('.pk-hm--green')).toBeTruthy();
  });

  it('switches colorScheme class reactively', () => {
    host.scheme.set('blue');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.pk-hm--blue')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.pk-hm--green')).toBeNull();
  });

  it('hides legend when showLegend = false', () => {
    host.legend.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.pk-hm__legend')).toBeNull();
  });

  it('shows legend by default', () => {
    expect(fixture.nativeElement.querySelector('.pk-hm__legend')).toBeTruthy();
  });

  it('hides day labels when dayLabels = false', () => {
    host.dayLabels.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.pk-hm__days')).toBeNull();
  });

  it('hides month labels when monthLabels = false', () => {
    host.monthLabels.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.pk-hm__months')).toBeNull();
  });

  // ── Grid logic ────────────────────────────────────────────────────────
  it('generates 52–54 week columns for the default 1-year range', () => {
    const grid = comp._grid();
    expect(grid.length).toBeGreaterThanOrEqual(52);
    expect(grid.length).toBeLessThanOrEqual(54);
  });

  it('each week column has exactly 7 cells', () => {
    const grid = comp._grid();
    expect(grid.every(w => w.length === 7)).toBe(true);
  });

  it('empty data → all non-empty cells have level 0', () => {
    const cells = comp._grid().flatMap(w => w).filter(c => !c.isEmpty);
    expect(cells.every(c => c.level === 0)).toBe(true);
  });

  it('respects startDate / endDate override — January has 31 non-empty cells', () => {
    host.start.set(new Date('2026-01-01'));
    host.end.set(new Date('2026-01-31'));
    fixture.detectChanges();
    const active = comp._grid().flatMap(w => w).filter(c => !c.isEmpty);
    expect(active.length).toBe(31);
  });

  it('assigns correct levels based on quartile thresholds', () => {
    host.start.set(new Date('2026-01-01'));
    host.end.set(new Date('2026-01-07'));
    // sorted nonZero: [1,2,3,4,5,6,7] → p25=2, p50=4, p75=6
    host.data.set([
      { date: '2026-01-01', no: 1 },   // ≤ p25 → level 1
      { date: '2026-01-02', no: 2 },   // ≤ p25 → level 1
      { date: '2026-01-03', no: 3 },   // ≤ p50 → level 2
      { date: '2026-01-04', no: 4 },   // ≤ p50 → level 2
      { date: '2026-01-05', no: 5 },   // ≤ p75 → level 3
      { date: '2026-01-06', no: 6 },   // ≤ p75 → level 3
      { date: '2026-01-07', no: 7 },   // > p75 → level 4
    ]);
    fixture.detectChanges();

    const cells = comp._grid().flatMap(w => w).filter(c => !c.isEmpty);
    const find  = (dateStr: string): PkHeatmapCell =>
      cells.find(c => key(c.date) === dateStr)!;

    expect(find('2026-01-01').level).toBe(1);
    expect(find('2026-01-02').level).toBe(1);
    expect(find('2026-01-03').level).toBe(2);
    expect(find('2026-01-05').level).toBe(3);
    expect(find('2026-01-07').level).toBe(4);
  });

  it('single non-zero value → level 4', () => {
    host.start.set(new Date('2026-03-01'));
    host.end.set(new Date('2026-03-31'));
    host.data.set([{ date: '2026-03-15', no: 5 }]);
    fixture.detectChanges();
    const cells = comp._grid().flatMap(w => w).filter(c => !c.isEmpty && c.no > 0);
    expect(cells.length).toBe(1);
    expect(cells[0].level).toBe(4);
  });

  // ── Month labels ──────────────────────────────────────────────────────
  it('emits at least one month label for any range', () => {
    expect(comp._monthLabels().length).toBeGreaterThanOrEqual(1);
  });

  it('first month label has colIndex 0', () => {
    // startSun always lands in week 0
    expect(comp._monthLabels()[0].colIndex).toBe(0);
  });

  // ── Custom tooltipFormat ──────────────────────────────────────────────
  it('calls the custom tooltipFormat function', () => {
    const fmt = vi.fn().mockReturnValue('custom text');
    host.fmtFn.set(fmt);
    fixture.detectChanges();

    // Access component and call onCellEnter with a fake cell and event
    const fakeCell: PkHeatmapCell = { date: new Date('2026-05-01'), no: 3, level: 2, isEmpty: false, holiday: '' };
    const fakeEvent = { target: document.createElement('div') } as unknown as MouseEvent;

    // Temporarily enable tooltip so the formatter runs
    (comp as unknown as { showTooltip: () => boolean }).showTooltip = () => true;
    (comp as unknown as { _isBrowser: boolean })._isBrowser = true;
    comp.onCellEnter(fakeEvent, fakeCell);

    expect(fmt).toHaveBeenCalledWith({ date: fakeCell.date, no: 3 });
    comp.onCellLeave(); // cleanup
  });
});
