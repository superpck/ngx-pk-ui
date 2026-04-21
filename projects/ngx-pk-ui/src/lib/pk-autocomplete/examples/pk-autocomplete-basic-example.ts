import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { PkAutocompleteComponent } from '../pk-autocomplete.component';
import { AutocompleteOption } from '../pk-autocomplete.interface';

@Component({
  selector: 'pk-autocomplete-basic-example',
  imports: [PkAutocompleteComponent],
  template: `
    <div class="space-y-4">
      <h4 class="text-lg font-medium mb-3 text-gray-800">Basic Autocomplete</h4>
      <p class="text-gray-600 mb-4">
        Simple autocomplete with static data.
      </p>

      <div class="max-w-md">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          เลือกประเทศ
        </label>
        <pk-autocomplete
          [options]="countries()"
          placeholder="ค้นหาประเทศ..."
          (change)="onCountryChange($event)" />
        
        @if (selectedCountry()) {
          <p class="mt-2 text-sm text-gray-600">
            คุณเลือก: <span class="font-semibold">{{ selectedCountry() }}</span>
          </p>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PkAutocompleteBasicExample {
  selectedCountry = signal<string>('');

  countries = signal<AutocompleteOption[]>([
    { label: 'ไทย', value: 'TH' },
    { label: 'สหรัฐอเมริกา', value: 'US' },
    { label: 'สหราชอาณาจักร', value: 'GB' },
    { label: 'ญี่ปุ่น', value: 'JP' },
    { label: 'เกาหลีใต้', value: 'KR' },
    { label: 'จีน', value: 'CN' },
    { label: 'สингคโปร์', value: 'SG' },
    { label: 'มาเลเซีย', value: 'MY' },
    { label: 'อินโดนีเซีย', value: 'ID' },
    { label: 'เวียดนาม', value: 'VN' },
    { label: 'ฟิลิปปินส์', value: 'PH' },
    { label: 'เมียนมาร์', value: 'MM' },
    { label: 'ลาว', value: 'LA' },
    { label: 'กัมพูชา', value: 'KH' },
    { label: 'อินเดีย', value: 'IN' },
    { label: 'ออสเตรเลีย', value: 'AU' },
    { label: 'นิวซีแลนด์', value: 'NZ' },
    { label: 'เยอรมนี', value: 'DE' },
    { label: 'ฝรั่งเศส', value: 'FR' },
    { label: 'อิตาลี', value: 'IT' },
  ]);

  onCountryChange(event: Event) {
    const select = event.target as any;
    const country = this.countries().find(c => c.value === select.value);
    if (country) {
      this.selectedCountry.set(country.label);
    }
  }
}
