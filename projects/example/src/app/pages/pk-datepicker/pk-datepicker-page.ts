import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PkDatepickerComponent } from 'ngx-pk-ui';
import type { PkLocale } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-datepicker-page',
  imports: [FormsModule, DatePipe, PkDatepickerComponent],
  templateUrl: './pk-datepicker-page.html',
})
export class PkDatepickerPage {
  dateValue = signal<Date | null>(new Date());
  maxDate = new Date();
  minDate = new Date(this.maxDate.getFullYear() - 1, this.maxDate.getMonth(), this.maxDate.getDate());

  localeDate: Date | null = new Date();

  readonly localeShowcase: { locale: PkLocale; label: string }[] = [
    { locale: 'th', label: 'ไทย (th)' },
    { locale: 'en', label: 'English (en)' },
    { locale: 'lo', label: 'ລາວ (lo)' },
    { locale: 'ja', label: '日本語 (ja)' },
    { locale: 'zh', label: '中文 (zh)' },
    { locale: 'fr', label: 'Français (fr)' },
    { locale: 'de', label: 'Deutsch (de)' },
    { locale: 'ar', label: 'عربي (ar)' },
  ];

  readonly codeBasic =
`import { FormsModule } from '@angular/forms';
import { PkDatepickerComponent } from 'ngx-pk-ui';

@Component({ imports: [FormsModule, PkDatepickerComponent] })
export class AnyPage {
  dateValue: Date | null = null;
}`;

  readonly codeLocale =
`<pk-datepicker [(ngModel)]="date" locale="th" />  <!-- Thai Buddhist Era -->
<pk-datepicker [(ngModel)]="date" locale="en" />  <!-- English -->
<pk-datepicker [(ngModel)]="date" locale="ja" />  <!-- Japanese -->
<pk-datepicker [(ngModel)]="date" locale="fr" />  <!-- French -->`;

  onDateChange(date: Date | null) {
    this.dateValue.set(date);
  }
}
