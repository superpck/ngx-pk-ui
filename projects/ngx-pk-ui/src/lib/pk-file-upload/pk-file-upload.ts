import {
  Component,
  ElementRef,
  OnDestroy,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { PkFileUploadPreviewSize, PkUploadFile } from './pk-file-upload.model';

let _nextId = 0;

const TEXT_MIME_PREFIXES = ['text/'];
const TEXT_EXTENSIONS = ['.json', '.xml', '.csv', '.md', '.ts', '.js', '.html', '.css', '.sh', '.yaml', '.yml', '.toml'];
const TEXT_PREVIEW_CHARS = 300;

function detectPreviewType(file: File): PkUploadFile['previewType'] {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'pdf';
  if (TEXT_MIME_PREFIXES.some(p => file.type.startsWith(p))) return 'text';
  const name = file.name.toLowerCase();
  if (TEXT_EXTENSIONS.some(ext => name.endsWith(ext))) return 'text';
  return 'none';
}

function iconForFile(file: File): string {
  const type = file.type;
  const name = file.name.toLowerCase();
  if (type.startsWith('video/')) return 'videocam';
  if (type.startsWith('audio/')) return 'audio_file';
  if (name.endsWith('.zip') || name.endsWith('.tar') || name.endsWith('.gz') || name.endsWith('.rar')) return 'folder_zip';
  if (name.endsWith('.docx') || name.endsWith('.doc')) return 'description';
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return 'table_chart';
  if (name.endsWith('.pptx') || name.endsWith('.ppt')) return 'slideshow';
  return 'insert_drive_file';
}

@Component({
  selector: 'pk-file-upload',
  imports: [],
  templateUrl: './pk-file-upload.html',
  styleUrl: './pk-file-upload.css',
})
export class PkFileUpload implements OnDestroy {
  // ── Inputs ────────────────────────────────────────────────────────────────
  accept      = input<string>('');
  multiple    = input<boolean>(true);
  maxSize     = input<number>(0);
  maxFiles    = input<number>(0);
  disabled    = input<boolean>(false);
  uploading   = input<boolean>(false);
  previewSize = input<PkFileUploadPreviewSize>('md');
  uploadLabel = input<string>('Upload');
  browseLabel = input<string>('Browse files');
  dropLabel   = input<string>('Drag & drop files here, or');

  // ── Outputs ───────────────────────────────────────────────────────────────
  /** Emits the full list of PkUploadFile every time a file is added or removed. */
  filesChange = output<PkUploadFile[]>();
  /** Emits when the user clicks the Upload button. Contains only files without errors. */
  onUpload = output<PkUploadFile[]>();

  // ── Internal state ────────────────────────────────────────────────────────
  readonly files    = signal<PkUploadFile[]>([]);
  readonly isDragging = signal(false);

  readonly hasFiles = computed(() => this.files().length > 0);
  readonly validFiles = computed(() => this.files().filter(f => !f.error));
  readonly canUpload = computed(() => this.validFiles().length > 0 && !this.uploading() && !this.disabled());

  /** Human-readable max size label used in the template. */
  readonly maxSizeLabel = computed(() => {
    const v = this.maxSize();
    if (!v) return '';
    if (v >= 1_048_576) return `${(v / 1_048_576).toFixed(1)} MB`;
    if (v >= 1_024)     return `${(v / 1_024).toFixed(0)} KB`;
    return `${v} B`;
  });

  readonly zoneClass = computed(() => {
    const classes = ['pk-file-upload__zone'];
    if (this.isDragging()) classes.push('pk-file-upload__zone--drag');
    if (this.disabled())   classes.push('pk-file-upload__zone--disabled');
    return classes.join(' ');
  });

  readonly cardSizeClass = computed(() => `pk-file-upload__card--${this.previewSize()}`);

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  // ── Public API ────────────────────────────────────────────────────────────
  /** Resets all files. Call from parent after a successful upload. */
  clear(): void {
    this.files().forEach(f => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl); });
    this.files.set([]);
    this.filesChange.emit([]);
  }

  // ── Template handlers ─────────────────────────────────────────────────────
  openFilePicker(): void {
    if (this.disabled()) return;
    this.fileInput().nativeElement.click();
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
      input.value = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.disabled()) this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (this.disabled() || !event.dataTransfer?.files) return;
    this.addFiles(event.dataTransfer.files);
  }

  removeFile(id: number): void {
    const entry = this.files().find(f => f.id === id);
    if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl);
    const updated = this.files().filter(f => f.id !== id);
    this.files.set(updated);
    this.filesChange.emit(updated);
  }

  submitUpload(): void {
    if (!this.canUpload()) return;
    this.onUpload.emit(this.validFiles());
  }

  // ── Internal helpers ───────────────────────────────────────────────────────
  private addFiles(fileList: FileList): void {
    const incoming = Array.from(fileList);
    let current = this.multiple() ? [...this.files()] : [];

    // if single mode, revoke existing blob URLs
    if (!this.multiple()) {
      this.files().forEach(f => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl); });
    }

    for (const file of incoming) {
      const max = this.maxFiles();
      if (max > 0 && current.length >= max) break;

      const previewType = detectPreviewType(file);
      const error = this.validateFile(file);

      const entry: PkUploadFile = {
        id: ++_nextId,
        file,
        previewType,
        previewUrl: (previewType === 'image' || previewType === 'pdf') && !error
          ? URL.createObjectURL(file)
          : null,
        textContent: null,
        error,
      };

      if (previewType === 'text' && !error) {
        this.readTextPreview(entry);
      }

      current = [...current, entry];
    }

    this.files.set(current);
    this.filesChange.emit(current);
  }

  private validateFile(file: File): string | null {
    const maxSize = this.maxSize();
    if (maxSize > 0 && file.size > maxSize) {
      return `File exceeds ${this.formatSize(maxSize)}`;
    }
    return null;
  }

  private readTextPreview(entry: PkUploadFile): void {
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const updated = this.files().map(f =>
        f.id === entry.id ? { ...f, textContent: text.slice(0, TEXT_PREVIEW_CHARS) } : f
      );
      this.files.set(updated);
    };
    reader.readAsText(entry.file);
  }

  private formatSize(bytes: number): string {
    if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
    if (bytes >= 1_024)     return `${(bytes / 1_024).toFixed(0)} KB`;
    return `${bytes} B`;
  }

  // ── Template helpers (called from template) ───────────────────────────────
  getIcon(file: PkUploadFile): string {
    return iconForFile(file.file);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnDestroy(): void {
    this.files().forEach(f => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl); });
  }
}
