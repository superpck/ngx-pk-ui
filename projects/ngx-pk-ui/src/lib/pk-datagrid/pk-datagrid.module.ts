import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PkIcon } from '../pk-icon/pk-icon';

import { PkDatagridComponent } from './pk-datagrid.component';
import { PkDgHeaderComponent } from './pk-dg-header.component';
import { PkDgRowComponent } from './pk-dg-row.component';
import { PkDgCellComponent } from './pk-dg-cell.component';
import { PkDgFooterComponent } from './pk-dg-footer.component';
import { PkDgPaginationComponent } from './pk-dg-pagination.component';
import { PkDgPageSizeComponent } from './pk-dg-page-size.component';
import { PkDgRowExpandComponent } from './pk-dg-row-expand.component';
import { PkDgActionComponent } from './pk-dg-action.component';
import { PkDgRowsDirective, PkDgRowIsExpandDirective, NowrapDirective } from './pk-datagrid.directives';

@NgModule({
  declarations: [
    PkDatagridComponent,
    PkDgHeaderComponent,
    PkDgRowComponent,
    PkDgCellComponent,
    PkDgFooterComponent,
    PkDgPaginationComponent,
    PkDgPageSizeComponent,
    PkDgRowExpandComponent,
    PkDgActionComponent,
    PkDgRowsDirective,
    PkDgRowIsExpandDirective,
    NowrapDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    PkIcon
  ],
  exports: [
    PkDatagridComponent,
    PkDgHeaderComponent,
    PkDgRowComponent,
    PkDgCellComponent,
    PkDgFooterComponent,
    PkDgPaginationComponent,
    PkDgPageSizeComponent,
    PkDgRowExpandComponent,
    PkDgActionComponent,
    PkDgRowsDirective,
    PkDgRowIsExpandDirective,
    NowrapDirective,
    PkIcon
  ]
})
export class PkDatagridModule { }
