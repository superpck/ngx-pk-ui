import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PkSelectComponent,
  type SelectOption,
  type SelectMode,
} from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-select-page',
  imports: [FormsModule, PkSelectComponent],
  templateUrl: './pk-select-page.html',
})
export class PkSelectPage {
  mode = signal<SelectMode>('single');
  searchable = signal(true);
  disabled = signal(false);

  selectedSingle = signal<string | number | null>(null);
  selectedMulti = signal<Array<string | number>>([]);
  selectedNgModel: string | number | null = null;

  options = signal<SelectOption[]>([
    { label: 'กรุงเทพมหานคร', value: 'bangkok' },
    { label: 'เชียงใหม่', value: 'chiangmai' },
    { label: 'ภูเก็ต', value: 'phuket' },
    { label: 'ขอนแก่น', value: 'khonkaen' },
    { label: 'สงขลา', value: 'songkhla' },
    { label: 'นครราชสีมา', value: 'nakhonratchasima' },
    { label: 'อุบลราชธานี', value: 'ubonratchathani' },
    { label: 'สุราษฎร์ธานี', value: 'suratthani', disabled: true },
  ]);

  setMode(event: Event): void {
    this.mode.set((event.target as HTMLSelectElement).value as SelectMode);
  }

  setSearchable(event: Event): void {
    this.searchable.set((event.target as HTMLInputElement).checked);
  }

  setDisabled(event: Event): void {
    this.disabled.set((event.target as HTMLInputElement).checked);
  }

  onSelectChange(value: string | number | Array<string | number> | null): void {
    if (Array.isArray(value)) {
      this.selectedMulti.set(value);
      this.selectedSingle.set(null);
      return;
    }
    this.selectedSingle.set(value);
    this.selectedMulti.set([]);
  }
}
