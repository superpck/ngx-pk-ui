import { NgModule } from '@angular/core';
import { PkSidenav } from './pk-sidenav';
import { PkSidenavHeader } from './pk-sidenav-header';
import { PkSidenavMenu } from './pk-sidenav-menu';
import { PkSidenavFooter } from './pk-sidenav-footer';
import { PkSidenavItem } from './pk-sidenav-item';

@NgModule({
  imports: [
    PkSidenav,
    PkSidenavHeader,
    PkSidenavMenu,
    PkSidenavFooter,
    PkSidenavItem,
  ],
  exports: [
    PkSidenav,
    PkSidenavHeader,
    PkSidenavMenu,
    PkSidenavFooter,
    PkSidenavItem,
  ],
})
export class PkSidenavModule {}

// Re-export components for direct use
export { PkSidenav, PkSidenavHeader, PkSidenavMenu, PkSidenavFooter, PkSidenavItem };
