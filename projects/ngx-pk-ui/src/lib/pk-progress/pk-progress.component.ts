import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressConfig } from './pk-progress.interface';

@Component({
  selector: 'pk-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (config().type === 'circle') {
      <!-- Circle Progress -->
      <div class="pk-progress-circle" [style.width.px]="circleSize()" [style.height.px]="circleSize()">
        <svg [attr.viewBox]="'0 0 ' + circleSize() + ' ' + circleSize()">
          <!-- Background circle -->
          <circle
            class="pk-progress-circle-bg"
            [attr.cx]="circleSize() / 2"
            [attr.cy]="circleSize() / 2"
            [attr.r]="radius()"
            [attr.stroke-width]="config().strokeWidth || 6"
            fill="none" />
          
          <!-- Progress circle -->
          <circle
            class="pk-progress-circle-path"
            [class.pk-progress-success]="config().status === 'success'"
            [class.pk-progress-error]="config().status === 'error'"
            [class.pk-progress-warning]="config().status === 'warning'"
            [attr.cx]="circleSize() / 2"
            [attr.cy]="circleSize() / 2"
            [attr.r]="radius()"
            [attr.stroke-width]="config().strokeWidth || 6"
            [attr.stroke-dasharray]="circumference()"
            [attr.stroke-dashoffset]="offset()"
            [style.stroke]="config().color || null"
            fill="none" />
        </svg>
        
        @if (config().showInfo) {
          <div class="pk-progress-circle-text">
            @if (config().status === 'success') {
              <span class="pk-progress-icon">✓</span>
            } @else if (config().status === 'error') {
              <span class="pk-progress-icon">✕</span>
            } @else {
              <span>{{ config().percent }}%</span>
            }
          </div>
        }
      </div>
    } @else {
      <!-- Line Progress -->
      <div class="pk-progress-line">
        @if (config().label) {
          <div class="pk-progress-label">{{ config().label }}</div>
        }
        
        <div class="pk-progress-outer">
          <div 
            class="pk-progress-inner"
            [class.pk-progress-striped]="config().striped"
            [class.pk-progress-animated]="config().animated"
            [class.pk-progress-indeterminate]="config().indeterminate"
            [style.height.px]="config().strokeWidth || 8">
            <div 
              class="pk-progress-bg"
              [class.pk-progress-success]="config().status === 'success'"
              [class.pk-progress-error]="config().status === 'error'"
              [class.pk-progress-warning]="config().status === 'warning'"
              [style.width.%]="config().indeterminate ? 30 : config().percent"
              [style.background]="config().color || null">
            </div>
          </div>
        </div>
        
        @if (config().showInfo) {
          <div class="pk-progress-text">
            @if (config().status === 'success') {
              <span class="pk-progress-icon">✓</span>
            } @else if (config().status === 'error') {
              <span class="pk-progress-icon">✕</span>
            } @else {
              {{ config().percent }}%
            }
          </div>
        }
      </div>
    }
  `,
  styles: [`
    /* Line Progress */
    .pk-progress-line {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .pk-progress-label {
      flex-shrink: 0;
      color: #565656;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .pk-progress-outer {
      flex: 1;
      background: #e8e8e8;
      border-radius: 100px;
      overflow: hidden;
    }

    .pk-progress-inner {
      width: 100%;
      position: relative;
      background: transparent;
      border-radius: 100px;
      overflow: hidden;
    }

    .pk-progress-bg {
      height: 100%;
      background: #0072a3;
      border-radius: 100px;
      transition: width 0.3s ease;
    }

    .pk-progress-success {
      background: #00A651 !important;
    }

    .pk-progress-error {
      background: #E62700 !important;
    }

    .pk-progress-warning {
      background: #FFC600 !important;
    }

    .pk-progress-striped .pk-progress-bg {
      background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      );
      background-size: 1rem 1rem;
    }

    .pk-progress-animated .pk-progress-bg {
      animation: progress-stripes 1s linear infinite;
    }

    @keyframes progress-stripes {
      0% {
        background-position: 1rem 0;
      }
      100% {
        background-position: 0 0;
      }
    }

    .pk-progress-indeterminate .pk-progress-bg {
      animation: progress-indeterminate 2s linear infinite;
    }

    @keyframes progress-indeterminate {
      0% {
        margin-left: 0;
      }
      50% {
        margin-left: 70%;
      }
      100% {
        margin-left: 0;
      }
    }

    .pk-progress-text {
      flex-shrink: 0;
      min-width: 2.5rem;
      text-align: right;
      color: #565656;
      font-size: 0.875rem;
    }

    /* Circle Progress */
    .pk-progress-circle {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .pk-progress-circle svg {
      transform: rotate(-90deg);
    }

    .pk-progress-circle-bg {
      stroke: #e8e8e8;
    }

    .pk-progress-circle-path {
      stroke: #0072a3;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.3s ease;
    }

    .pk-progress-circle-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #565656;
      font-size: 1rem;
      font-weight: 600;
    }

    .pk-progress-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .pk-progress-success + .pk-progress-text .pk-progress-icon,
    .pk-progress-circle.pk-progress-success .pk-progress-icon {
      color: white;
      background: #00A651;
    }

    .pk-progress-error + .pk-progress-text .pk-progress-icon,
    .pk-progress-circle.pk-progress-error .pk-progress-icon {
      color: white;
      background: #E62700;
    }

    .pk-progress-warning + .pk-progress-text .pk-progress-icon,
    .pk-progress-circle.pk-progress-warning .pk-progress-icon {
      color: white;
      background: #FFC600;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PkProgressComponent {
  config = input<ProgressConfig>({
    type: 'line',
    percent: 0,
    status: 'normal',
    showInfo: true,
    strokeWidth: 8,
    striped: false,
    animated: false,
    indeterminate: false,
  });

  // Circle calculations
  circleSize = computed(() => {
    const strokeWidth = this.config().strokeWidth || 6;
    return 120; // Fixed size for circle
  });

  radius = computed(() => {
    const size = this.circleSize();
    const strokeWidth = this.config().strokeWidth || 6;
    return (size - strokeWidth) / 2;
  });

  circumference = computed(() => {
    return 2 * Math.PI * this.radius();
  });

  offset = computed(() => {
    const percent = this.config().percent || 0;
    return this.circumference() * (1 - percent / 100);
  });
}
