import { Component, signal, effect } from '@angular/core';
import { PkProgressComponent } from '../pk-progress.component';
import { ProgressConfig } from '../pk-progress.interface';

@Component({
  selector: 'circle-progress-example',
  imports: [PkProgressComponent],
  template: `
    <div class="example-container">
      <h3>Circle Progress</h3>
      <p>แสดง progress bar แบบวงกลม</p>

      <div class="circles-row">
        <div class="circle-item">
          <pk-progress [config]="circle1()" />
          <div class="circle-label">Normal</div>
        </div>

        <div class="circle-item">
          <pk-progress [config]="circle2()" />
          <div class="circle-label">Success</div>
        </div>

        <div class="circle-item">
          <pk-progress [config]="circle3()" />
          <div class="circle-label">Error</div>
        </div>

        <div class="circle-item">
          <pk-progress [config]="circle4()" />
          <div class="circle-label">Warning</div>
        </div>
      </div>

      <div class="progress-group">
        <h4>Different Stroke Width</h4>
        <div class="circles-row">
          <pk-progress [config]="{ type: 'circle', percent: 75, strokeWidth: 4 }" />
          <pk-progress [config]="{ type: 'circle', percent: 75, strokeWidth: 6 }" />
          <pk-progress [config]="{ type: 'circle', percent: 75, strokeWidth: 8 }" />
          <pk-progress [config]="{ type: 'circle', percent: 75, strokeWidth: 10 }" />
        </div>
      </div>

      <div class="progress-group">
        <h4>Dynamic Progress</h4>
        <div class="dynamic-section">
          <pk-progress [config]="dynamicConfig()" />
          <div class="button-group">
            <button (click)="decrease()">-10%</button>
            <button (click)="increase()">+10%</button>
            <button (click)="reset()">Reset</button>
          </div>
        </div>
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

    .circles-row {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .circle-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .circle-label {
      color: #565656;
      font-size: 0.875rem;
    }

    .progress-group {
      margin-top: 2rem;
    }

    .progress-group h4 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #565656;
      font-size: 1rem;
    }

    .dynamic-section {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .button-group {
      display: flex;
      gap: 0.5rem;
    }

    .button-group button {
      padding: 0.5rem 1rem;
      background: #0072a3;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .button-group button:hover {
      background: #005f86;
    }
  `],
})
export class CircleProgressExample {
  circle1 = signal<ProgressConfig>({
    type: 'circle',
    percent: 45,
    status: 'normal',
  });

  circle2 = signal<ProgressConfig>({
    type: 'circle',
    percent: 100,
    status: 'success',
  });

  circle3 = signal<ProgressConfig>({
    type: 'circle',
    percent: 60,
    status: 'error',
  });

  circle4 = signal<ProgressConfig>({
    type: 'circle',
    percent: 85,
    status: 'warning',
  });

  dynamicPercent = signal(50);

  dynamicConfig = signal<ProgressConfig>({
    type: 'circle',
    percent: 50,
  });

  constructor() {
    effect(() => {
      this.dynamicConfig.update(c => ({ ...c, percent: this.dynamicPercent() }));
    });
  }

  increase() {
    this.dynamicPercent.update(p => Math.min(100, p + 10));
  }

  decrease() {
    this.dynamicPercent.update(p => Math.max(0, p - 10));
  }

  reset() {
    this.dynamicPercent.set(50);
  }
}
