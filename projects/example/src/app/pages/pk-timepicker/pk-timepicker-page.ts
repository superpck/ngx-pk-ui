import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { PkTimepicker } from 'ngx-pk-ui';
import type { PkTimeFormat, PkTimeType, PkTimeInputType } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-timepicker-page',
  standalone: true,
  imports: [PkTimepicker, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pk-timepicker-page.html',
})
export class PkTimepickerPage {
  value24h      = '09:30';
  value12h      = '14:45';
  valueHms      = '08:05:00';
  valueH        = '14';
  valueNum      = '10:30';
  disabledCtrl  = new FormControl({ value: '10:30', disabled: true });
  lastEmit      = signal('—');

  onTimeChange(v: string): void {
    this.lastEmit.set(v);
  }

  readonly codeImport = `import { PkTimepicker } from 'ngx-pk-ui';
import type { PkTimeFormat, PkTimeType } from 'ngx-pk-ui';

@Component({
  imports: [PkTimepicker, FormsModule],
})`;

  readonly codeBasic = `<pk-timepicker [(ngModel)]="time" />`;

  readonly codeFormats = `<!-- Hours and minutes (default) -->
<pk-timepicker [(ngModel)]="time" format="hm" />

<!-- Hours, minutes and seconds -->
<pk-timepicker [(ngModel)]="time" format="hms" />

<!-- Hours only -->
<pk-timepicker [(ngModel)]="time" format="h" />`;

  readonly code12h = `<pk-timepicker [(ngModel)]="time" type="12H" />`;

  readonly codeEvent = `<pk-timepicker
  [(ngModel)]="time"
  (onTimeChange)="onTimeChange($event)"
/>`;

  readonly codeDisabled = `<!-- via attribute -->
<pk-timepicker [(ngModel)]="time" [disabled]="true" />

<!-- via FormControl -->
control.disable();`;

  readonly codeInputType = `<!-- number — (default) direct text inputs (invalid values revert to previous) -->
<pk-timepicker [(ngModel)]="time" inputType="number" />
  
<!-- spinner — up/down arrows -->
<pk-timepicker [(ngModel)]="time" inputType="spinner" />

<!-- dropdown — native <select> for each field -->
<pk-timepicker [(ngModel)]="time" inputType="dropdown" />`;
}
