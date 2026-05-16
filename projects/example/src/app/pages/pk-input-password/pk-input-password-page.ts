import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkInputPassword } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-input-password-page',
  imports: [FormsModule, PkInputPassword],
  templateUrl: './pk-input-password-page.html',
})
export class PkInputPasswordPage {
  value1 = '';
  value2 = '';
  value3 = '';
  value4 = '';

  readonly codeExample =
`import { PkInputPassword } from 'ngx-pk-ui';

@Component({
  imports: [FormsModule, PkInputPassword],
})

<pk-input-password
  [(ngModel)]="password"
  label="New password"
  [showStrength]="true"
/>`;
}
