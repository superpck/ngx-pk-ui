import { Component, Input, Output, EventEmitter, OnInit, ContentChild, AfterContentInit } from '@angular/core';
import { PkDgPageSizeComponent } from './pk-dg-page-size.component';

@Component({
  selector: 'pk-dg-pagination',
  templateUrl: './pk-dg-pagination.component.html',
  styleUrls: ['./pk-dg-pagination.component.scss'],
  standalone: false
})
export class PkDgPaginationComponent implements OnInit, AfterContentInit {
  @ContentChild(PkDgPageSizeComponent) pageSize?: PkDgPageSizeComponent;

  @Input() pkDgPageSize: number = 10;
  @Input() rowCount: number = 0;
  
  @Output() pkDgPageChange = new EventEmitter<number>();
  @Output() pkDgPageSizeChange = new EventEmitter<number>();
  
  currentPage: number = 1;
  firstItem: number = 0;
  lastItem: number = 0;
  
  ngOnInit() {
    this.updatePagination();
  }

  ngAfterContentInit() {
    if (this.pageSize) {
      this.pageSize.setPagination(this);
    }
  }
  
  ngOnChanges() {
    this.updatePagination();
  }
  
  updatePagination() {
    this.firstItem = (this.currentPage - 1) * this.pkDgPageSize;
    this.lastItem = Math.min(this.firstItem + this.pkDgPageSize, this.rowCount);
  }
  
  get totalPages(): number {
    return Math.ceil(this.rowCount / this.pkDgPageSize);
  }
  
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      this.pkDgPageChange.emit(page);
    }
  }
  
  onPageSizeChange(size: number) {
    this.pkDgPageSize = size;
    this.currentPage = 1;
    this.updatePagination();
    this.pkDgPageSizeChange.emit(size);
  }
  
  get pages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
