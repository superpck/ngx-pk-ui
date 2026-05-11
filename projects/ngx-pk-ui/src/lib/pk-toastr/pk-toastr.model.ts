export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastPosition =
  | 'top-left'     | 'top-center'    | 'top-right'
  | 'center-left'  | 'center-center' | 'center-right'
  | 'bottom-left'  | 'bottom-center' | 'bottom-right'
  | 'top-full'     | 'bottom-full';

export interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
  progress?: boolean;
}

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  title?: string;
  duration: number;
  position: ToastPosition;
  progress: boolean;
}
