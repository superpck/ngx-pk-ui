import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PkTabsModule } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-tabs-page',
  imports: [PkTabsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pk-tabs-page.html',
})
export class PkTabsPage {}
