import { Component, signal } from '@angular/core';
import { PkSelectComponent, SelectOption } from '../index';

@Component({
  selector: 'pk-select-multi-example',
  imports: [PkSelectComponent],
  template: `
    <div style="max-width: 400px;">
      <h4 style="margin-bottom: 12px;">Multi Select with Checkboxes</h4>
      
      <pk-select
        [options]="options()"
        [mode]="'multi'"
        [searchable]="true"
        [placeholder]="'เลือกหลายจังหวัด'"
        (change)="onSelectionChange($event)" />
      
      <p style="margin-top: 12px; color: #6b7280;">
        Selected ({{ selectedValues()?.length || 0 }}): {{ selectedValues()?.join(', ') || 'None' }}
      </p>
    </div>
  `
})
export class PkSelectMultiExample {
  selectedValues = signal<string[] | null>(null);

  options = signal<SelectOption[]>([
    { label: 'กรุงเทพมหานคร', value: 'bangkok' },
    { label: 'เชียงใหม่', value: 'chiangmai' },
    { label: 'ภูเก็ต', value: 'phuket' },
    { label: 'ขอนแก่น', value: 'khonkaen' },
    { label: 'สงขลา', value: 'songkhla' },
    { label: 'นครราชสีมา', value: 'nakhonratchasima' },
    { label: 'อุบลราชธานี', value: 'ubonratchathani' },
    { label: 'สุราษฎร์ธานี', value: 'suratthani' },
  ]);

  onSelectionChange(values: any): void {
    this.selectedValues.set(Array.isArray(values) ? values : []);
  }
}
