import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkSelectComponent, SelectOption } from '../index';

@Component({
  selector: 'pk-select-ngmodel-example',
  imports: [PkSelectComponent, FormsModule],
  template: `
    <div style="max-width: 400px;">
      <h4 style="margin-bottom: 12px;">Using ngModel (Single)</h4>
      
      <pk-select
        [options]="options()"
        [placeholder]="'เลือกสี'"
        [(ngModel)]="selectedColor" />
      
      <p style="margin-top: 12px; color: #6b7280;">
        ngModel value: {{ selectedColor || 'null' }}
      </p>

      <button 
        (click)="selectedColor = 'blue'"
        style="margin-top: 8px; padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Set to Blue
      </button>

      <button 
        (click)="selectedColor = null"
        style="margin-left: 8px; padding: 6px 12px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Clear
      </button>

      <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />

      <h4 style="margin-bottom: 12px;">Using ngModel (Multi)</h4>
      
      <pk-select
        [options]="options()"
        [mode]="'multi'"
        [placeholder]="'Select colors...'"
        [(ngModel)]="selectedColors" />
      
      <p style="margin-top: 12px; color: #6b7280;">
        ngModel value: {{ selectedColors.join(', ') || '[]' }}
      </p>

      <button 
        (click)="selectedColors = ['red', 'green']"
        style="margin-top: 8px; padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Set to Red & Green
      </button>

      <button 
        (click)="selectedColors = []"
        style="margin-left: 8px; padding: 6px 12px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Clear
      </button>
    </div>
  `
})
export class PkSelectNgmodelExample {
  selectedColor: string | null = null;
  selectedColors: string[] = [];

  options = signal<SelectOption[]>([
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Purple', value: 'purple' },
    { label: 'Orange', value: 'orange' },
    { label: 'Pink', value: 'pink' },
  ]);
}
