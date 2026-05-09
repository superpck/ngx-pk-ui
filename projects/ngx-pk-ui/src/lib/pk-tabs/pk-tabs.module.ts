import { NgModule } from '@angular/core';
import { PkTabs } from './pk-tabs';
import { PkTab } from './pk-tab';

const TABS_COMPONENTS = [PkTabs, PkTab];

@NgModule({ imports: TABS_COMPONENTS, exports: TABS_COMPONENTS })
export class PkTabsModule {}
