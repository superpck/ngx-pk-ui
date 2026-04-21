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
        [placeholder]="'เลือกจังหวัด'"
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
    { label: 'กรุงเทพมหานคร', value: 'bangkok' },
    { label: 'เชียงใหม่', value: 'chiangmai' },
    { label: 'ภูเก็ต', value: 'phuket' },
    { label: 'ขอนแก่น', value: 'khonkaen' },
    { label: 'สงขลา', value: 'songkhla' },
    { label: 'นครราชสีมา', value: 'nakhonratchasima' },
    { label: 'อุบลราชธานี', value: 'ubonratchathani' },
  ]);

  onSelectionChange(value: any): void {
    this.selectedValue.set(String(value));
  }
}
