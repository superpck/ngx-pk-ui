import { Component, ChangeDetectionStrategy } from '@angular/core';
import { VERSION } from '@angular/core';

@Component({
  selector: 'app-installation',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './installation.html',
})
export class Installation {
  angularVersion = VERSION;
}
