import { Component, signal } from '@angular/core';
import { PkSelectComponent, SelectOption } from '../index';

@Component({
  selector: 'pk-select-basic-example',
  imports: [PkSelectComponent],
  template: `
    <div style="max-width: 400px;">
      <h4 style="margin-bottom: 12px;">Basic Single Select</h4>
      
      <pk-select
        [options]="options()"
        [placeholder]="'Select province...'"
        (change)="onSelectionChange($event)" />
      
      <p style="margin-top: 12px; color: #6b7280;">
        Selected: {{ selectedValue() || 'None' }}
      </p>
    </div>
  `
})
export class PkSelectBasicExample {
  selectedValue = signal<string>('');

  options = signal<SelectOption[]>([
    { label: 'Bangkok', value: 'bangkok' },
    { label: 'Chiang Mai', value: 'chiangmai' },
    { label: 'Phuket', value: 'phuket' },
    { label: 'Khon Kaen', value: 'khonkaen' },
    { label: 'Songkhla', value: 'songkhla' },
    { label: 'Nakhon Ratchasima', value: 'nakhonratchasima' },
    { label: 'Ubon Ratchathani', value: 'ubonratchathani' },
  ]);

  onSelectionChange(value: any): void {
    this.selectedValue.set(String(value));
  }
}
