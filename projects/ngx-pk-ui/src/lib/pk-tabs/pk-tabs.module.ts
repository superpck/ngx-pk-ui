import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PkTabComponent } from './pk-tab/pk-tab.component';
import { PkTabBodyComponent } from './pk-tab/pk-tab-body.component';
import { PkTabsComponent } from './pk-tabs/pk-tabs.component';
import { PkTabTitleComponent } from './pk-tab/pk-tab-title.component';

@NgModule({
  declarations: [
    PkTabsComponent,
    PkTabComponent,
    PkTabTitleComponent,
    PkTabBodyComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PkTabsComponent,
    PkTabComponent,
    PkTabTitleComponent,
    PkTabBodyComponent
  ]
})
export class PkTabsModule { }