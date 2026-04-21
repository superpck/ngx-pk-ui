import { NgModule } from '@angular/core';
import { PkTreeviewComponent } from './pk-treeview.component';
import { PkTreeviewNodeComponent } from './pk-treeview-node.component';

@NgModule({
  imports: [PkTreeviewComponent, PkTreeviewNodeComponent],
  exports: [PkTreeviewComponent, PkTreeviewNodeComponent]
})
export class PkTreeviewModule { }
