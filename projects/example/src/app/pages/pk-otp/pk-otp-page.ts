import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkOtp } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-otp-page',
  standalone: true,
  imports: [FormsModule, PkOtp],
  templateUrl: './pk-otp-page.html',
})
export class PkOtpPage {
  basicValue    = signal('');
  charValue     = signal('');
  maskValue     = signal('');
  timedValue    = signal('');
  sm4Value      = signal('');
  lg8Value      = signal('');
  noneValue     = signal('');
  lastComplete  = signal('—');
  lastChange    = signal('—');

  onComplete(v: string) { this.lastComplete.set(v); }
  onChangeEvt(v: string) { this.lastChange.set(v); }

  readonly codeImport = `import { FormsModule } from '@angular/forms';
import { PkOtp } from 'ngx-pk-ui';
import type { PkOtpType, PkOtpSize } from 'ngx-pk-ui';

@Component({ imports: [FormsModule, PkOtp] })
export class MyComponent {
  otp = '';
}`;

  readonly codeBasic = `<!-- 6-digit OTP (default) -->
<pk-otp [(ngModel)]="otp" (onComplete)="submit($event)" />

<!-- 4-digit PIN, sm size -->
<pk-otp [length]="4" size="sm" [(ngModel)]="pin" />

<!-- 8-char alphanumeric, uppercase, lg size -->
<pk-otp [length]="8" type="char" [capital]="true" size="lg" [(ngModel)]="code" />`;

  readonly codeMask = `<!-- Mask immediately (like a password field) -->
<pk-otp showString="*" [showTime]="0" [(ngModel)]="otp" />

<!-- Show char for 600 ms then mask -->
<pk-otp showString="•" [showTime]="600" [(ngModel)]="otp" />`;

  readonly codeTitleText = `<pk-otp
  title="Verification Code"
  text="ref: TXN-20260522"
  [(ngModel)]="otp"
/>`;
}
