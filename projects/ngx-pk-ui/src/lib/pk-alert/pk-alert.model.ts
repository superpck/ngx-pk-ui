export type AlertType = 'success' | 'warn' | 'error' | 'confirm' | 'input';
export type AlertInputType = 'string' | 'number' | 'date' | 'boolean';

export interface AlertConfig {
  type: AlertType;
  title?: string;
  message: string;
  /** Only relevant when type === 'input' */
  inputType?: AlertInputType;
  /** Pre-filled value for input dialogs */
  defaultValue?: string | number | boolean | null;
  confirmLabel?: string;
  cancelLabel?: string;
}

/** Resolved value of an alert:
 *  - success / warn / error  → void (undefined)
 *  - confirm                 → boolean
 *  - input                   → string | number | boolean | null  (null = cancelled)
 */
export type AlertResult = void | boolean | string | number | null;

/** Internal slot kept in the service signal */
export interface AlertSlot {
  config: AlertConfig;
  resolve: (value: AlertResult) => void;
}
