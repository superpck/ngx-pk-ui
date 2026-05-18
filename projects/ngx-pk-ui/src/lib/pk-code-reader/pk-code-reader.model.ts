export type PkCodeFormat =
  | 'qr_code'
  | 'micro_qr_code'
  | 'code_128'
  | 'code_39'
  | 'code_93'
  | 'ean_13'
  | 'ean_8'
  | 'upc_a'
  | 'upc_e'
  | 'itf'
  | 'pdf417'
  | 'aztec'
  | 'data_matrix'
  | 'codabar';

export interface PkCodeScanResult {
  value: string;
  format: PkCodeFormat;
  /** Input source that produced this result */
  source: 'camera' | 'upload' | 'paste';
  boundingBox?: DOMRectReadOnly;
  cornerPoints?: ReadonlyArray<{ x: number; y: number }>;
}

export type PkCodeReaderError =
  | 'not-supported'
  | 'permission-denied'
  | 'no-camera'
  | 'decode-error';

// ---------------------------------------------------------------------------
// Ambient declarations — BarcodeDetector is not yet in TypeScript's lib.dom
// ---------------------------------------------------------------------------
declare global {
  interface BarcodeDetectorResult {
    rawValue: string;
    format: string;
    boundingBox: DOMRectReadOnly;
    cornerPoints: ReadonlyArray<{ x: number; y: number }>;
  }

  class BarcodeDetector {
    constructor(options?: { formats: string[] });
    static getSupportedFormats(): Promise<string[]>;
    detect(
      image:
        | HTMLImageElement
        | SVGImageElement
        | HTMLVideoElement
        | HTMLCanvasElement
        | ImageBitmap
        | ImageData
        | Blob,
    ): Promise<BarcodeDetectorResult[]>;
  }
}
