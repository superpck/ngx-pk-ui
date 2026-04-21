import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkProgressComponent } from 'ngx-pk-ui';
import type { ProgressConfig, ProgressStatus } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-progress-page',
  imports: [FormsModule, PkProgressComponent],
  templateUrl: './pk-progress-page.html',
})
export class PkProgressPage {
  linePercent = signal(45);
  lineStatus = signal<ProgressStatus>('normal');
  lineStriped = signal(false);
  lineAnimated = signal(false);

  circlePercent = signal(68);
  circleStatus = signal<ProgressStatus>('normal');

  get lineConfig(): ProgressConfig {
    return {
      type: 'line',
      percent: this.linePercent(),
      status: this.lineStatus(),
      showInfo: true,
      strokeWidth: 10,
      striped: this.lineStriped(),
      animated: this.lineAnimated(),
    };
  }

  get circleConfig(): ProgressConfig {
    return {
      type: 'circle',
      percent: this.circlePercent(),
      status: this.circleStatus(),
      showInfo: true,
      strokeWidth: 8,
    };
  }

  setLinePercent(e: Event) {
    this.linePercent.set(+(e.target as HTMLInputElement).value);
  }

  setCirclePercent(e: Event) {
    this.circlePercent.set(+(e.target as HTMLInputElement).value);
  }

  setLineStatus(e: Event) {
    this.lineStatus.set((e.target as HTMLSelectElement).value as ProgressStatus);
  }

  setCircleStatus(e: Event) {
    this.circleStatus.set((e.target as HTMLSelectElement).value as ProgressStatus);
  }

  setLineStriped(e: Event) {
    this.lineStriped.set((e.target as HTMLInputElement).checked);
  }

  setLineAnimated(e: Event) {
    this.lineAnimated.set((e.target as HTMLInputElement).checked);
  }
}
