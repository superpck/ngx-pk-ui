export type PkUploadPreviewType = 'image' | 'pdf' | 'text' | 'none';

export type PkFileUploadPreviewSize = 'sm' | 'md' | 'lg';

export interface PkUploadFile {
  id: number;
  file: File;
  previewType: PkUploadPreviewType;
  /** Blob URL for image/pdf previews. Must be revoked when no longer needed. */
  previewUrl: string | null;
  /** First 300 characters for text previews. */
  textContent: string | null;
  /** Validation error message (e.g. file too large). */
  error: string | null;
}
