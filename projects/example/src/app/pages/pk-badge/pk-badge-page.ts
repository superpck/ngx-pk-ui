import { Component, ChangeDetectionStrategy } from '@angular/core';
import { version } from '../../../../../../package.json';

@Component({
  selector: 'app-pk-badge-page',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pk-badge-page.html',
})
export class PkBadgePage {
  version = version;
}
