import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { PkAutocompleteComponent } from '../pk-autocomplete.component';
import { AutocompleteOption, AutocompleteFetchFn } from '../pk-autocomplete.interface';

@Component({
  selector: 'pk-autocomplete-async-example',
  imports: [PkAutocompleteComponent],
  template: `
    <div class="space-y-4">
      <h4 class="text-lg font-medium mb-3 text-gray-800">Async Data Fetching</h4>
      <p class="text-gray-600 mb-4">
        Fetch data from API with debounce. Simulates async search with 500ms delay.
      </p>

      <div class="max-w-md">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ค้นหาผู้ใช้งาน (พิมพ์อย่างน้อย 2 ตัวอักษร)
        </label>
        <pk-autocomplete
          [fetchFn]="searchUsers"
          [minChars]="2"
          [debounceTime]="500"
          placeholder="ค้นหาชื่อผู้ใช้..."
          (change)="onUserSelect($event)" />
        
        @if (selectedUser()) {
          <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm font-medium text-blue-900">ผู้ใช้ที่เลือก:</p>
            <p class="text-sm text-blue-700 mt-1">{{ selectedUser() }}</p>
          </div>
        }
      </div>

      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <p class="text-xs text-gray-600">
          💡 <strong>Tip:</strong> ข้อมูลทดสอบ: somchai, somjai, narong, nattaya, preecha, panida, 
          wichai, wilaiporn, surasak, suda
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PkAutocompleteAsyncExample {
  selectedUser = signal<string>('');

  // Mock database
  private mockUsers = [
    { id: 1, name: 'สมชาย ใจดี', email: 'somchai@example.com' },
    { id: 2, name: 'สมหญิง รักสงบ', email: 'somjai@example.com' },
    { id: 3, name: 'ณรงค์ ขยัน', email: 'narong@example.com' },
    { id: 4, name: 'ณัฐยา สวย', email: 'nattaya@example.com' },
    { id: 5, name: 'พรีชา มั่งคั่ง', email: 'preecha@example.com' },
    { id: 6, name: 'พนิดา งาม', email: 'panida@example.com' },
    { id: 7, name: 'วิชัย เก่ง', email: 'wichai@example.com' },
    { id: 8, name: 'วิไลพร รุ่งเรือง', email: 'wilaiporn@example.com' },
    { id: 9, name: 'สุรศักดิ์ แกร่ง', email: 'surasak@example.com' },
    { id: 10, name: 'สุดา อ่อนหวาน', email: 'suda@example.com' },
  ];

  // Async search function
  searchUsers: AutocompleteFetchFn = async (searchTerm: string): Promise<AutocompleteOption[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const term = searchTerm.toLowerCase();
    const filtered = this.mockUsers.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );

    return filtered.map(user => ({
      label: `${user.name} (${user.email})`,
      value: user.id,
    }));
  };

  onUserSelect(event: Event) {
    const autocomplete = event.target as any;
    const user = this.mockUsers.find(u => u.id === autocomplete.value);
    if (user) {
      this.selectedUser.set(`${user.name} - ${user.email}`);
    }
  }
}
