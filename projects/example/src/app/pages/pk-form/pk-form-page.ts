import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-pk-form-page',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pk-form-page.html',
})
export class PkFormPage {
  showPwd  = signal(false);
  showPwd2 = signal(false);
}
