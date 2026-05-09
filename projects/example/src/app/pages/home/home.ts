import { Component } from '@angular/core';
import { PkIcon } from 'ngx-pk-ui';
import { VERSION } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [PkIcon],
  templateUrl: './home.html',
})
export class Home {
  angularVersion = VERSION;
}
