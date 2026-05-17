export type PkBarcodeFormat = 'code128' | 'code39' | 'ean13' | 'ean8';

/** @internal */
export interface PkBarcodeBar {
  width: number;   // in modules (unit widths)
  dark: boolean;
}
