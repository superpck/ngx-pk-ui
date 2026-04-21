import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PkIcon } from '../pk-icon/pk-icon';

import { PkDatagridComponent } from './pk-datagrid.component';
import { PkDgColumnComponent } from './pk-dg-column.component';
import { PkDgRowComponent } from './pk-dg-row.component';
import { PkDgCellComponent } from './pk-dg-cell.component';
import { PkDgFooterComponent } from './pk-dg-footer.component';
import { PkDgPaginationComponent } from './pk-dg-pagination.component';
import { PkDgPageSizeComponent } from './pk-dg-page-size.component';
import { PkDgRowDetailComponent } from './pk-dg-row-detail.component';
import { PkDgItemsDirective, PkIfExpandedDirective, NowrapDirective } from './pk-datagrid.directives';

@NgModule({
  declarations: [
    PkDatagridComponent,
    PkDgColumnComponent,
    PkDgRowComponent,
    PkDgCellComponent,
    PkDgFooterComponent,
    PkDgPaginationComponent,
    PkDgPageSizeComponent,
    PkDgRowDetailComponent,
    PkDgItemsDirective,
    PkIfExpandedDirective,
    NowrapDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    PkIcon
  ],
  exports: [
    PkDatagridComponent,
    PkDgColumnComponent,
    PkDgRowComponent,
    PkDgCellComponent,
    PkDgFooterComponent,
    PkDgPaginationComponent,
    PkDgPageSizeComponent,
    PkDgRowDetailComponent,
    PkDgItemsDirective,
    PkIfExpandedDirective,
    NowrapDirective,
    PkIcon
  ]
})
export class PkDatagridModule { }
