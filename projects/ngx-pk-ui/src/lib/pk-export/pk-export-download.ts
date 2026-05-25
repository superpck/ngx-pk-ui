/**
 * Trigger a file download in the browser.
 * Uses Blob → URL.createObjectURL → hidden <a> click pattern.
 */
export function downloadFile(
  content: string | Uint8Array,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content as unknown as BlobPart], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
