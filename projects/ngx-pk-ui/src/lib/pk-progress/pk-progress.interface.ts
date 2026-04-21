export type ProgressType = 'line' | 'circle';
export type ProgressStatus = 'normal' | 'success' | 'error' | 'warning';

export interface ProgressConfig {
  type?: ProgressType;
  percent?: number;
  status?: ProgressStatus;
  showInfo?: boolean;
  strokeWidth?: number;
  striped?: boolean;
  animated?: boolean;
  indeterminate?: boolean;
  label?: string;
  color?: string;
}
