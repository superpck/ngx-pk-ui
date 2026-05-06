import { Component, ContentChildren, ContentChild, QueryList, AfterContentInit, AfterViewInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { PkDgHeaderComponent } from './pk-dg-header.component';
import { PkDgPaginationComponent } from './pk-dg-pagination.component';
import { PkDgRowExpandComponent } from './pk-dg-row-expand.component';
import { PkDgRowIsExpandDirective } from './pk-datagrid.directives';
import { PkDgActionComponent } from './pk-dg-action.component';

@Component({
  selector: 'pk-datagrid',
  templateUrl: './pk-datagrid.component.html',
  styleUrls: ['./pk-datagrid.component.scss'],
  standalone: false
})
export class PkDatagridComponent implements AfterContentInit, AfterViewInit, OnChanges, OnDestroy {
  @ContentChildren(PkDgHeaderComponent) columns!: QueryList<PkDgHeaderComponent>;
  @ContentChild(PkDgPaginationComponent, { descendants: true }) pagination?: PkDgPaginationComponent;
  @ContentChildren(PkDgRowExpandComponent, { descendants: true }) rowDetails!: QueryList<PkDgRowExpandComponent>;
  @ContentChildren(PkDgRowIsExpandDirective, { descendants: true }) expandDirectives!: QueryList<PkDgRowIsExpandDirective>;
  @ContentChildren(PkDgActionComponent, { descendants: true }) actionComponents!: QueryList<PkDgActionComponent>;

  get hasActionCol(): boolean {
    return this.actionComponents ? this.actionComponents.length > 0 : false;
  }

  get hasExpandCol(): boolean {
    if (this.expandDirectives && this.expandDirectives.length > 0) return true;
    return this.rowDetails ? this.rowDetails.length > 0 : false;
  }
  
  @Input() pkDgLoading: boolean = false;
  @Input() items: any[] = [];
  @Input() filterValues: Record<string, string> = {};

  @Output() pkDgRefresh = new EventEmitter<void>();
  @Output() filterChange = new EventEmitter<{ key: string; value: string }>();

  displayedItems: any[] = [];
  displayedItemsVersion = 0;
  expandedRows: Set<any> = new Set();
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  activeFilterCol: string | null = null;
  activeFilterHeader: string = '';
  filterPopupPos: { top: number; left: number } = { top: 0, left: 0 };

  // Column resize
  columnWidths: number[] = [];
  private _resizingIdx: number = -1;
  private _resizeStartX: number = 0;
  private _resizeStartWidth: number = 0;
  private _resizeMoveRef = (e: MouseEvent) => this._onResizeMove(e);
  private _resizeEndRef  = ()             => this._onResizeEnd();

  get totalWidth(): number {
    const sum = this.columnWidths.reduce((acc, w) => acc + w, 0);
    return sum + (this.hasExpandCol ? 32 : 0) + (this.hasActionCol ? 32 : 0);
  }

  private _initColumnWidths() {
    const cols = this.columns ? this.columns.toArray() : [];
    this.columnWidths = cols.map(c => c.widthPx ?? 120);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.activeFilterCol = null;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit() {
    // Listen to pagination changes first
    if (this.pagination) {
      this.pagination.pkDgPageChange.subscribe(() => this.updateDisplayedItems());
      this.pagination.pkDgPageSizeChange.subscribe(() => this.updateDisplayedItems());
    }
    
    // Update displayed items after pagination is set up
    this.updateDisplayedItems();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.updateDisplayedItems();
    }

    if (changes['filterValues']) {
      this.updateDisplayedItems();
    }
  }
  
  ngAfterViewInit() {
    // Force change detection after columns are fully initialized
    // Also re-update displayed items to ensure pagination is initialized
    setTimeout(() => {
      if (this.pagination) {
        this.pagination.rowCount = this.items.length;
        this.pagination.updatePagination();
      }
      this._initColumnWidths();
      this.updateDisplayedItems();
      // In zoneless mode, async callbacks do not automatically trigger a render pass.
      // Run one explicit change detection so initial pagination is reflected immediately.
      this.cdr.detectChanges();
    }, 0);
  }

  updateDisplayedItems() {
    // If no items, set empty array
    if (!this.items || this.items.length === 0) {
      this.displayedItems = [];
      return;
    }
    
    let result = [...this.items];

    // Apply column filters
    const filters = this.filterValues || {};
    const activeFilterKeys = Object.keys(filters).filter((key) => {
      const value = filters[key];
      return value !== undefined && value !== null && `${value}`.trim() !== '';
    });
    if (activeFilterKeys.length > 0) {
      result = result.filter((row: any) => {
        return activeFilterKeys.every((key) => {
          const raw = row?.[key];
          const source = raw === undefined || raw === null ? '' : `${raw}`;
          const target = `${filters[key]}`.trim();
          return source.toLowerCase().includes(target.toLowerCase());
        });
      });
    }

    // Keep pagination counts in sync with filtered result
    if (this.pagination) {
      this.pagination.rowCount = result.length;
      if (this.pagination.currentPage > this.pagination.totalPages && this.pagination.totalPages > 0) {
        this.pagination.currentPage = this.pagination.totalPages;
      }
      if (this.pagination.currentPage < 1) {
        this.pagination.currentPage = 1;
      }
      this.pagination.updatePagination();
    }
    
    // Apply sorting
    if (this.sortColumn && this.sortDirection) {
      result.sort((a, b) => {
        const aVal = a[this.sortColumn!];
        const bVal = b[this.sortColumn!];
        
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        
        if (typeof aVal === 'string') {
          const comparison = aVal.localeCompare(bVal);
          return this.sortDirection === 'asc' ? comparison : -comparison;
        }
        
        if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // Apply pagination
    if (this.pagination) {
      const start = this.pagination.firstItem;
      const end = this.pagination.lastItem;
      result = result.slice(start, end);
    }
    
    this.displayedItems = result;
    this.displayedItemsVersion++;
  }

  onSort(field: string) {
    if (this.sortColumn === field) {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortColumn = null;
        this.sortDirection = null;
      } else {
        this.sortDirection = 'asc';
      }
    } else {
      this.sortColumn = field;
      this.sortDirection = 'asc';
    }
    
    this.updateDisplayedItems();
  }

  getSortIcon(field: string): string {
    if (this.sortColumn !== field) return '';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  toggleRowExpansion(row: any) {
    if (this.expandedRows.has(row)) {
      this.expandedRows.delete(row);
    } else {
      this.expandedRows.add(row);
    }
  }

  isRowExpanded(row: any): boolean {
    return this.expandedRows.has(row);
  }

  openFilter(key: string, event: MouseEvent, headerText: string = '') {
    event.stopPropagation();
    if (this.activeFilterCol === key) {
      this.activeFilterCol = null;
      return;
    }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const popupWidth = 180;
    const margin = 8;
    let left = rect.left;
    if (left + popupWidth + margin > window.innerWidth) {
      left = rect.right - popupWidth;
    }
    if (left < margin) { left = margin; }
    this.filterPopupPos = { top: rect.bottom + 4, left };
    this.activeFilterHeader = headerText;
    this.activeFilterCol = key;
  }

  onFilterInput(key: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterValues = { ...this.filterValues, [key]: value };
    if (this.pagination) {
      this.pagination.currentPage = 1;
      this.pagination.updatePagination();
    }
    this.updateDisplayedItems();
    this.filterChange.emit({ key, value });
  }

  // ── Column resize ───────────────────────────────────────────────
  startResize(colIdx: number, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this._resizingIdx    = colIdx;
    this._resizeStartX   = event.clientX;
    this._resizeStartWidth = this.columnWidths[colIdx];
    document.addEventListener('mousemove', this._resizeMoveRef);
    document.addEventListener('mouseup',   this._resizeEndRef);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }

  private _onResizeMove(event: MouseEvent) {
    if (this._resizingIdx < 0) return;
    const delta = event.clientX - this._resizeStartX;
    this.columnWidths[this._resizingIdx] = Math.max(40, this._resizeStartWidth + delta);
  }

  private _onResizeEnd() {
    this._resizingIdx = -1;
    document.removeEventListener('mousemove', this._resizeMoveRef);
    document.removeEventListener('mouseup',   this._resizeEndRef);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }

  ngOnDestroy() {
    this._onResizeEnd();
  }
}
