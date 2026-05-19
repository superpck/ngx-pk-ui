import { Component } from '@angular/core';
import { VERSION } from '@angular/core';

@Component({
  selector: 'app-installation',
  standalone: true,
  imports: [],
  templateUrl: './installation.html',
})
export class Installation {
  angularVersion = VERSION;
}
