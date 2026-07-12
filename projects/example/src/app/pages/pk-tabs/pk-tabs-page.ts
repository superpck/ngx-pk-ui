import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkTabsModule } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-tabs-page',
  imports: [
    PkTabsModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pk-tabs-page.html',
})
export class PkTabsPage {
  activeTab = signal<string>('profile');
}
