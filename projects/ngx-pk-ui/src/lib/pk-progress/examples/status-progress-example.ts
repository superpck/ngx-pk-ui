import { Component, signal } from '@angular/core';
import { PkProgressComponent } from '../pk-progress.component';
import { ProgressConfig } from '../pk-progress.interface';

@Component({
  selector: 'status-progress-example',
  imports: [PkProgressComponent],
  template: `
    <div class="example-container">
      <h3>Progress Status</h3>
      <p>แสดงสถานะต่างๆ ของ progress bar</p>

      <div class="progress-group">
        <h4>Normal Status</h4>
        <pk-progress [config]="normalConfig()" />
      </div>

      <div class="progress-group">
        <h4>Success Status</h4>
        <pk-progress [config]="successConfig()" />
      </div>

      <div class="progress-group">
        <h4>Error Status</h4>
        <pk-progress [config]="errorConfig()" />
      </div>

      <div class="progress-group">
        <h4>Warning Status</h4>
        <pk-progress [config]="warningConfig()" />
      </div>

      <div class="progress-group">
        <h4>Striped Progress</h4>
        <pk-progress [config]="stripedConfig()" />
      </div>

      <div class="progress-group">
        <h4>Striped + Animated</h4>
        <pk-progress [config]="animatedConfig()" />
      </div>

      <div class="progress-group">
        <h4>Indeterminate Progress</h4>
        <pk-progress [config]="indeterminateConfig()" />
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
  `],
})
export class StatusProgressExample {
  normalConfig = signal<ProgressConfig>({
    percent: 60,
    status: 'normal',
    label: 'Processing',
  });

  successConfig = signal<ProgressConfig>({
    percent: 100,
    status: 'success',
    label: 'Completed',
  });

  errorConfig = signal<ProgressConfig>({
    percent: 45,
    status: 'error',
    label: 'Failed',
  });

  warningConfig = signal<ProgressConfig>({
    percent: 80,
    status: 'warning',
    label: 'Warning',
  });

  stripedConfig = signal<ProgressConfig>({
    percent: 65,
    striped: true,
    label: 'Striped',
  });

  animatedConfig = signal<ProgressConfig>({
    percent: 75,
    striped: true,
    animated: true,
    label: 'Animated',
  });

  indeterminateConfig = signal<ProgressConfig>({
    indeterminate: true,
    label: 'Loading...',
    showInfo: false,
  });
}
