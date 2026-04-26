import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { PkDgPaginationComponent } from './pk-dg-pagination.component';

@Component({
  selector: 'pk-dg-page-size',
  templateUrl: './pk-dg-page-size.component.html',
  styleUrls: ['./pk-dg-page-size.component.css'],
  standalone: false
})
export class PkDgPageSizeComponent {
  @Input() pkPageSizeList: number[] = [10, 20, 50, 100];

  pagination: PkDgPaginationComponent | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  setPagination(p: PkDgPaginationComponent) {
    this.pagination = p;
    this.cdr.detectChanges();
  }

  get currentSize(): number {
    return this.pagination?.pkDgPageSize ?? this.pkPageSizeList[0];
  }

  onChange(event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.pagination?.onPageSizeChange(value);
  }
}
