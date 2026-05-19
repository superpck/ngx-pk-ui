import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PkTruncatePipe, PkTimeAgoPipe, PkFileSizePipe, PkHighlightPipe, PkDatePipe, parseBEDate } from 'ngx-pk-ui';

@Component({
  selector: 'pk-pipes-page',
  standalone: true,
  imports: [FormsModule, PkTruncatePipe, PkTimeAgoPipe, PkFileSizePipe, PkHighlightPipe, PkDatePipe],
  templateUrl: './pk-pipes-page.html',
  styleUrl: './pk-pipes-page.css',
})
export class PkPipesPage {
  // pkTruncate
  truncateText = signal('The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.');
  truncateLimit = signal(40);

  // pkTimeAgo
  timeAgoDate = signal(new Date(Date.now() - 3 * 60 * 1000)); // 3 min ago
  readonly timePresets: { label: string; ms: number }[] = [
    { label: '2 seconds ago',  ms: 2_000 },
    { label: '30 seconds ago', ms: 30_000 },
    { label: '3 minutes ago',  ms: 3 * 60_000 },
    { label: '2 hours ago',    ms: 2 * 3600_000 },
    { label: '1 day ago',      ms: 86_400_000 },
    { label: '2 weeks ago',    ms: 14 * 86_400_000 },
    { label: '3 months ago',   ms: 90 * 86_400_000 },
    { label: '2 years ago',    ms: 730 * 86_400_000 },
  ];
  setTimeAgo(ms: number): void {
    this.timeAgoDate.set(new Date(Date.now() - ms));
  }

  // pkFileSize
  fileSizeBytes = signal(1_500_000);
  fileSizeDecimals = signal(1);

  // pkHighlight
  highlightText = signal('The quick brown fox jumps over the lazy dog');
  highlightQuery = signal('fox');

  readonly code1 = `import { PkTruncatePipe, PkTimeAgoPipe, PkFileSizePipe, PkHighlightPipe } from 'ngx-pk-ui';

@Component({
  imports: [PkTruncatePipe, PkTimeAgoPipe, PkFileSizePipe, PkHighlightPipe],
})`;

  readonly code2 = `<!-- Truncate to 40 chars (default ellipsis '…') -->
{{ longText | pkTruncate: 40 }}

<!-- Custom ellipsis -->
{{ longText | pkTruncate: 40 : ' ...' }}

<!-- Relative time -->
{{ createdAt | pkTimeAgo }}

<!-- File size -->
{{ file.size | pkFileSize }}          <!-- "1.4 MB" -->
{{ file.size | pkFileSize: 2 }}       <!-- "1.44 MB" -->

<!-- Highlight — use [innerHTML] binding -->
<span [innerHTML]="item.name | pkHighlight: searchQuery"></span>`;

  readonly codeTruncate = `{{ longText | pkTruncate: 40 }}\n{{ longText | pkTruncate: 40 : ' ...' }}`;
  readonly codeTimeAgo = `{{ createdAt | pkTimeAgo }}`;
  readonly codeFileSize = `{{ file.size | pkFileSize }}       // "1.4 MB"\n{{ file.size | pkFileSize: 2 }}   // "1.44 MB"`;
  readonly codeHighlight = `<span [innerHTML]="item.name | pkHighlight: searchQuery"></span>`;

  // pkDate
  // January 31, 2025 CE  →  BE 2568  (2025 + 543 = 2568)
  readonly demoDate = new Date(2025, 0, 31);
  readonly demoDateBE = parseBEDate('31/01/2568');
  dateLocale = signal<'en' | 'th' | 'es' | 'it' | 'fr' | 'de' | 'ja' | 'ar'>('th');
  dateFormat = signal('d m yyyy');
  dateStyle  = signal<'numeric' | 'abbr' | 'full'>('abbr');
  dateEra    = signal<'CE' | 'BE'>('BE');

  readonly codeDateImport = `import { PkDatePipe, parseBEDate } from 'ngx-pk-ui';

@Component({ imports: [PkDatePipe] })`;

  readonly codeDateUsage = `{{ date | pkDate:'d m yyyy':'abbr':'th':'BE' }}  <!-- 31 ม.ค. 2568 -->
{{ date | pkDate:'d m yy':'abbr':'th':'BE' }}   <!-- 31 ม.ค. 68  -->
{{ date | pkDate:'d-m-yyyy':'abbr':'es' }}       <!-- 31-Ene-2025 -->
{{ date | pkDate:'m, d yyyy':'full':'it' }}      <!-- Gennaio, 31 2025 -->
{{ date | pkDate:'dd/mm/yyyy' }}                 <!-- 31/01/2025 (numeric, no locale) -->`;

  readonly codeParseBE = `// Convert a BE string → CE Date, then pipe
const date = parseBEDate('31/01/2568');           // new Date(2025, 0, 31)
{{ date | pkDate:'d/m/yyyy':'abbr':'th':'BE' }}  // 31 ม.ค. 2568

// Custom separator / order:
parseBEDate('2568-01-31', '-', 'ymd')            // new Date(2025, 0, 31)`;
}
