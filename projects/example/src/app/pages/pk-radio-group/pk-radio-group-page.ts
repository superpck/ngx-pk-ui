import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkRadioGroup } from 'ngx-pk-ui';
import type { PkRadioOption } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-radio-group-page',
  imports: [FormsModule, PkRadioGroup],
  templateUrl: './pk-radio-group-page.html',
})
export class PkRadioGroupPage {
  basicValue   = 'b';
  horzValue    = '';
  disableValue = 'a';
  lastEmit     = signal<string>('—');

  readonly basicOptions: PkRadioOption[] = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
  ];

  readonly horzOptions: PkRadioOption[] = [
    { value: 'xs', label: 'XS' },
    { value: 's',  label: 'S'  },
    { value: 'm',  label: 'M'  },
    { value: 'l',  label: 'L'  },
    { value: 'xl', label: 'XL' },
  ];

  readonly mixedOptions: PkRadioOption[] = [
    { value: 'free',  label: 'Free'       },
    { value: 'pro',   label: 'Pro'        },
    { value: 'ent',   label: 'Enterprise', disabled: true },
  ];

  readonly codeBasic = `import { FormsModule } from '@angular/forms';
import { PkRadioGroup } from 'ngx-pk-ui';

@Component({ imports: [FormsModule, PkRadioGroup] })
export class MyComponent {
  value = 'a';
  options: PkRadioOption[] = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
  ];
}`;

  readonly codeTemplate = `<pk-radio-group
  [options]="options"
  [(ngModel)]="value"
/>

<!-- Horizontal -->
<pk-radio-group
  [options]="options"
  layout="horizontal"
  [(ngModel)]="value"
/>

<!-- With onChange event -->
<pk-radio-group
  [options]="options"
  [(ngModel)]="value"
  (onChange)="onSelect($event)"
/>

<!-- Disabled -->
<pk-radio-group
  [options]="options"
  [(ngModel)]="value"
  [disabled]="true"
/>`;

  onSelect(val: string): void {
    this.lastEmit.set(val);
  }
}
