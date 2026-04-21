import { Component, inject, signal } from '@angular/core';
import { PkAlertService } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-alert-page',
  imports: [],
  templateUrl: './pk-alert-page.html',
})
export class PkAlertPage {
  alert = inject(PkAlertService);
  result = signal('—');

  async onSuccess() { await this.alert.success('Operation completed.', 'Success'); this.result.set('success → OK'); }
  async onWarn() { await this.alert.warn('This may have side effects.', 'Warning'); this.result.set('warn → OK'); }
  async onError() { await this.alert.error('Something went wrong.', 'Error'); this.result.set('error → OK'); }
  async onConfirm() { const ok = await this.alert.confirm('Delete this item?', 'Confirm Delete'); this.result.set(`confirm → ${ok}`); }
  async onInputString() { const v = await this.alert.input('Enter your name:', 'string', 'Name', 'Alice'); this.result.set(`string → ${v}`); }
  async onInputNumber() { const v = await this.alert.input('Enter your age:', 'number', 'Age', 25); this.result.set(`number → ${v}`); }
  async onInputDate() { const v = await this.alert.input('Pick a date:', 'date', 'Date'); this.result.set(`date → ${v}`); }
  async onInputBoolean() { const v = await this.alert.input('Agree to terms?', 'boolean', 'Agreement'); this.result.set(`boolean → ${v}`); }
}
