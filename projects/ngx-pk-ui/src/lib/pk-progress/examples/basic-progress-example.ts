import { Component, signal } from '@angular/core';
import { PkProgressComponent } from '../pk-progress.component';
import { ProgressConfig } from '../pk-progress.interface';

@Component({
  selector: 'basic-progress-example',
  imports: [PkProgressComponent],
  template: `
    <div class="example-container">
      <h3>Basic Progress Bar</h3>
      <p>แสดง progress bar แบบต่างๆ</p>

      <div class="progress-group">
        <h4>Default Progress</h4>
        <pk-progress [config]="config1()" />
      </div>

      <div class="progress-group">
        <h4>With Label</h4>
        <pk-progress [config]="config2()" />
      </div>

      <div class="progress-group">
        <h4>Without Info</h4>
        <pk-progress [config]="config3()" />
      </div>

      <div class="progress-group">
        <h4>Different Sizes</h4>
        <pk-progress [config]="{ percent: 60, strokeWidth: 4 }" />
        <pk-progress [config]="{ percent: 60, strokeWidth: 8 }" />
        <pk-progress [config]="{ percent: 60, strokeWidth: 12 }" />
        <pk-progress [config]="{ percent: 60, strokeWidth: 16 }" />
      </div>

      <div class="progress-group">
        <h4>Custom Color</h4>
        <pk-progress [config]="{ percent: 70, color: '#9333ea' }" />
        <pk-progress [config]="{ percent: 85, color: '#ec4899' }" />
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 1rem;
    }

    h3 {
      margin-top: 0;
      color: #313131;
    }

    p {
      color: #565656;
      margin-bottom: 1.5rem;
    }

    .progress-group {
      margin-bottom: 2rem;
    }

    .progress-group h4 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #565656;
      font-size: 1rem;
    }

    .progress-group pk-progress {
      display: block;
      margin-bottom: 1rem;
    }

    .progress-group pk-progress:last-child {
      margin-bottom: 0;
    }
  `],
})
export class BasicProgressExample {
  config1 = signal<ProgressConfig>({
    percent: 45,
    showInfo: true,
  });

  config2 = signal<ProgressConfig>({
    percent: 75,
    label: 'Uploading',
    showInfo: true,
  });

  config3 = signal<ProgressConfig>({
    percent: 90,
    showInfo: false,
  });
}
