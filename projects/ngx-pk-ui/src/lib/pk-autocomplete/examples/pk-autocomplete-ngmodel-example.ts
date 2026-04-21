import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkAutocompleteComponent } from '../pk-autocomplete.component';
import { AutocompleteOption } from '../pk-autocomplete.interface';

@Component({
  selector: 'pk-autocomplete-ngmodel-example',
  imports: [PkAutocompleteComponent, FormsModule],
  template: `
    <div class="space-y-4">
      <h4 class="text-lg font-medium mb-3 text-gray-800">With ngModel</h4>
      <p class="text-gray-600 mb-4">
        Two-way data binding with [(ngModel)].
      </p>

      <div class="max-w-md">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          เลือกจังหวัด
        </label>
        <pk-autocomplete
          [options]="provinces()"
          [(ngModel)]="selectedProvince"
          placeholder="ค้นหาจังหวัด..." />
        
        <div class="mt-4 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-700">Selected Value:</p>
          <pre class="mt-2 text-xs text-gray-600">{{ selectedProvince || 'null' }}</pre>
        </div>

        <button
          type="button"
          (click)="selectedProvince = 10"
          class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
          Set to "กรุงเทพมหานคร" (value: 10)
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PkAutocompleteNgmodelExample {
  selectedProvince: number | null = null;

  provinces = signal<AutocompleteOption[]>([
    { label: 'กรุงเทพมหานคร', value: 10 },
    { label: 'เชียงใหม่', value: 50 },
    { label: 'นครราชสีมา', value: 30 },
    { label: 'ขอนแก่น', value: 40 },
    { label: 'สงขลา', value: 90 },
    { label: 'ระยอง', value: 21 },
    { label: 'ภูเก็ต', value: 83 },
    { label: 'สมุทรปราการ', value: 11 },
    { label: 'นนทบุรี', value: 12 },
    { label: 'ปทุมธานี', value: 13 },
    { label: 'นครปฐม', value: 73 },
    { label: 'สมุทรสาคร', value: 74 },
    { label: 'ชลบุรี', value: 20 },
    { label: 'อุบลราชธานี', value: 34 },
    { label: 'อุดรธานี', value: 41 },
  ]);
}
