import { Directive, TemplateRef, ViewContainerRef, Input, Inject, forwardRef, Host, Optional, AfterViewInit, DoCheck, OnInit } from '@angular/core';
import { PkDgRowComponent } from './pk-dg-row.component';
import { PkDatagridComponent } from './pk-datagrid.component';

@Directive({
  selector: '[pkDgRows]',
  standalone: false
})
export class PkDgRowsDirective implements DoCheck {
  private _items: any[] = [];
  private _lastVersion: number = -1;
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Optional() @Inject(forwardRef(() => PkDatagridComponent)) private datagrid?: PkDatagridComponent
  ) {}
  
  ngDoCheck() {
    if (this.datagrid) {
      // Use version counter to detect real changes only
      const version = this.datagrid.displayedItemsVersion;
      if (version !== this._lastVersion) {
        this._lastVersion = version;
        this.renderItems();
      }
    }
  }
  
  @Input()
  set pkDgRowsOf(items: any[]) {
    this._items = items || [];
    // Push items to parent datagrid so it can handle pagination/sorting
    if (this.datagrid) {
      this.datagrid.items = this._items;
      if (this.datagrid.pagination) {
        this.datagrid.pagination.rowCount = this._items.length;
        this.datagrid.pagination.updatePagination();
      }
      this.datagrid.updateDisplayedItems();
    }
  }
  
  private renderItems() {
    this.viewContainer.clear();
    
    const items = this.datagrid ? this.datagrid.displayedItems : this._items;
    
    if (items && items.length > 0) {
      items.forEach((item, index) => {
        this.viewContainer.createEmbeddedView(this.templateRef, {
          $implicit: item,
          index: index,
          count: items.length
        });
      });
    }
  }
}


@Directive({
  selector: '[pkDgRowIsExpand]',
  standalone: false
})
export class PkDgRowIsExpandDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Host() @Optional() private row?: PkDgRowComponent
  ) {
    // Mark row as having detail as soon as this directive is instantiated
    if (this.row) {
      this.row.hasDetail = true;
    }
  }
  
  ngAfterViewInit() {
    this.updateView();
  }
  
  ngDoCheck() {
    this.updateView();
  }
  
  private updateView() {
    if (this.row && this.row.isExpanded) {
      if (this.viewContainer.length === 0) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.viewContainer.clear();
    }
  }
}

@Directive({
  selector: '[nowrap]',
  standalone: false,
  host: {
    '[style.white-space]': 'nowrap ? "nowrap" : "normal"'
  }
})
export class NowrapDirective {
  nowrap: boolean = true;
}
