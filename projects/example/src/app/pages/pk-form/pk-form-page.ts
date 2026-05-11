import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-pk-form-page',
  imports: [],
  templateUrl: './pk-form-page.html',
})
export class PkFormPage {
  showPwd  = signal(false);
  showPwd2 = signal(false);
}
