import { Component } from '@angular/core';
import { version } from '../../../../../../package.json';

@Component({
  selector: 'app-pk-badge-page',
  imports: [],
  templateUrl: './pk-badge-page.html',
})
export class PkBadgePage {
  version = version;
}
