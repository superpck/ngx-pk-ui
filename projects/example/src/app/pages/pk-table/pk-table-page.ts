import { Component, ChangeDetectionStrategy } from '@angular/core';
import { VERSION } from '@angular/core';
import { version } from '../../../../../../package.json';
@Component({
  selector: 'app-pk-table-page',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pk-table-page.html',
})
export class PkTablePage {
  version = version;
  angularVersion = VERSION.full;
}
