import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { PkExportButton } from './pk-export-button';
import { PkExportService } from './pk-export.service';
import { PkExportFormat } from './pk-export.model';

// ─── TestHost ────────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [PkExportButton],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <pk-export-button
      [data]="data"
      [formats]="formats"
      filename="test"
      [disabled]="disabled()"
      (beforeExport)="lastBefore = $event"
      (afterExport)="lastAfter = $event"
    />
  `,
})
class TestHost {
  data: any[] = [{ name: 'Alice', age: 30 }];
  formats: PkExportFormat[] = ['csv', 'json', 'xml'];
  disabled = signal(false);
  lastBefore: PkExportFormat | null = null;
  lastAfter: PkExportFormat | null = null;
}

// ─── Specs ───────────────────────────────────────────────────────────────────

describe('PkExportButton', () => {
  let host: TestHost;
  let fixture: ComponentFixture<TestHost>;
  let svcSpy: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    svcSpy = {
      csv: vi.fn(), tsv: vi.fn(), json: vi.fn(), xml: vi.fn(),
      xlsx: vi.fn(), html: vi.fn(), text: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [{ provide: PkExportService, useValue: svcSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getTrigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.pk-export-btn__trigger');
  }

  function getDropdown(): HTMLUListElement | null {
    return fixture.nativeElement.querySelector('.pk-export-btn__dropdown');
  }

  function getItems(): NodeListOf<HTMLLIElement> {
    return fixture.nativeElement.querySelectorAll('.pk-export-btn__item');
  }

  it('renders the trigger button', () => {
    expect(getTrigger()).toBeTruthy();
  });

  it('shows "Export" as default label', () => {
    expect(getTrigger().textContent).toContain('Export');
  });

  it('dropdown is hidden initially', () => {
    expect(getDropdown()).toBeNull();
  });

  it('opens dropdown on trigger click', () => {
    getTrigger().click();
    fixture.detectChanges();
    expect(getDropdown()).toBeTruthy();
  });

  it('closes dropdown when trigger is clicked again', () => {
    getTrigger().click();
    fixture.detectChanges();
    getTrigger().click();
    fixture.detectChanges();
    expect(getDropdown()).toBeNull();
  });

  it('renders format items matching the formats input', () => {
    getTrigger().click();
    fixture.detectChanges();
    const items = getItems();
    expect(items.length).toBe(3);
    expect(items[0].textContent?.trim()).toBe('CSV');
    expect(items[1].textContent?.trim()).toBe('JSON');
    expect(items[2].textContent?.trim()).toBe('XML');
  });

  it('calls service.csv() when CSV item is clicked', () => {
    getTrigger().click();
    fixture.detectChanges();
    getItems()[0].click();
    fixture.detectChanges();
    expect(svcSpy['csv']).toHaveBeenCalledWith(host.data, 'test.csv', undefined);
  });

  it('calls service.json() when JSON item is clicked', () => {
    getTrigger().click();
    fixture.detectChanges();
    getItems()[1].click();
    fixture.detectChanges();
    expect(svcSpy['json']).toHaveBeenCalledWith(host.data, 'test.json', undefined);
  });

  it('closes dropdown after selecting a format', () => {
    getTrigger().click();
    fixture.detectChanges();
    getItems()[0].click();
    fixture.detectChanges();
    expect(getDropdown()).toBeNull();
  });

  it('emits beforeExport before downloading', () => {
    getTrigger().click();
    fixture.detectChanges();
    getItems()[0].click();
    fixture.detectChanges();
    expect(host.lastBefore).toBe('csv');
  });

  it('emits afterExport after downloading', () => {
    getTrigger().click();
    fixture.detectChanges();
    getItems()[0].click();
    fixture.detectChanges();
    expect(host.lastAfter).toBe('csv');
  });

  it('trigger is disabled when disabled=true', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    expect(getTrigger().disabled).toBe(true);
  });

  it('does not open dropdown when disabled', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    getTrigger().click();
    fixture.detectChanges();
    expect(getDropdown()).toBeNull();
  });
});
