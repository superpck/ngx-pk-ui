import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PkIcon } from 'ngx-pk-ui';
import { VERSION } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [RouterLink, PkIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './home.html',
})
export class Home {
  angularVersion = VERSION;
}
