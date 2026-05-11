import { Component, signal, viewChild } from '@angular/core';
import { PkFileUpload, type PkUploadFile } from 'ngx-pk-ui';

@Component({
  selector: 'app-pk-file-upload-page',
  imports: [PkFileUpload],
  templateUrl: './pk-file-upload-page.html',
})
export class PkFileUploadPage {
  readonly uploader = viewChild<PkFileUpload>('uploader');

  isUploading = signal(false);
  lastUploadedFiles = signal<PkUploadFile[]>([]);
  filesChangedCount = signal(0);

  onFilesChange(files: PkUploadFile[]): void {
    this.filesChangedCount.update(n => n + 1);
  }

  async onUpload(files: PkUploadFile[]): Promise<void> {
    this.isUploading.set(true);
    // Simulate HTTP upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.lastUploadedFiles.set(files);
    this.isUploading.set(false);
    this.uploader()?.clear();
  }
}
