export type PkIconName =
  | 'search' | 'menu' | 'user' | 'users' | 'profile' | 'close' | 'sort'
  | 'login' | 'logout' | 'map' | 'map-point' | 'folder-close' | 'folder-open'
  | 'document' | 'report' | 'chart-pie' | 'chart-bar' | 'dashboard' | 'database'
  | 'cog' | 'setting' | 'email' | 'upload' | 'download' | 'export' | 'import'
  | 'csv' | 'xls' | 'pdf' | 'text' | 'link' | 'unlink' | 'reload' | 'phone' | 'tag' | 'tags'
  | 'check-mark' | 'check-mark-circle' | 'shield' | 'server' | 'eye' | 'eye-off'
  | 'plus' | 'pencil' | 'save' | 'trash' | 'list' | 'clock' | 'calendar' | 'venn' | 'venn3'
  | 'chevron-right' | 'chevron-left' | 'chevron-up' | 'chevron-down'
  | 'ambulance' | 'car' | 'car-crash' | 'car-crash2' | 'bed' | 'xray' | 'lab' | 'print'
  | 'time' | 'wait' | 'success' | 'warning' | 'error' | 'question' | 'question-circle' | 'info'
  | 'youtube' | 'facebook' | 'line' | 'telegram' | 'wechat' | 'linkedin'
  | 'phone-ring' | 'qr-code' | 'barcode' | 'barcode-reader'
  | 'person-smile' | 'person-sad' | 'person-cry' | 'person-sneez'
  | 'face-smile' | 'face-sad' | 'face-cry' | 'face-sneez'
  | 'patient' | 'bed-patient' | 'wheelchair';

export type PkIconSet = 'pk' | 'material-symbols' | 'google' | 'mat';

/** All aliases that render via Material Symbols font (google / mat = material-symbols) */
export const PK_MATERIAL_ICON_SETS: PkIconSet[] = ['material-symbols', 'google', 'mat'];

export type PkMaterialSymbolVariant = 'outlined' | 'rounded' | 'sharp';

export type PkMaterialSymbolWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700;

export type PkMaterialSymbolGrade = -25 | 0 | 200;

export type PkMaterialSymbolOpticalSize = 20 | 24 | 40 | 48;

export const PK_ICONS: Record<PkIconName, string> = {

  // ── Navigation & UI ──────────────────────────────────────────────────────
  'search': `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
  'menu': `<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>`,
  'close': `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  'sort': `<line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/>`,
  'plus': `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  'list': `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>`,
  'reload': `<polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>`,
  'chevron-right': `<polyline points="9 18 15 12 9 6"/>`,
  'chevron-left': `<polyline points="15 18 9 12 15 6"/>`,
  'chevron-up': `<polyline points="18 15 12 9 6 15"/>`,
  'chevron-down': `<polyline points="6 9 12 15 18 9"/>`,


  // ── Users & Auth ─────────────────────────────────────────────────────────
  'user': `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  'users': `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  'profile': `<rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 20v-1a5 5 0 0 1 10 0v1"/>`,
  'login': `<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>`,
  'logout': `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`,

  // ── Location ─────────────────────────────────────────────────────────────
  'map': `<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>`,
  'map-point': `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`,

  // ── Files & Documents ────────────────────────────────────────────────────
  'folder-close': `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>`,
  'folder-open': `<path d="M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1"/><path d="M3 11h18l-1.5 8H4.5z"/>`,
  'document': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>`,
  'report': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="9" y2="18"/><line x1="12" y1="12" x2="12" y2="18"/><line x1="15" y1="13" x2="15" y2="18"/>`,
  'csv': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="8" y1="18" x2="16" y2="18"/><line x1="12" y1="10" x2="12" y2="20"/>`,
  'xls': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><rect x="8" y="11" width="8" height="7"/><line x1="12" y1="11" x2="12" y2="18"/><line x1="8" y1="14.5" x2="16" y2="14.5"/>`,
  'pdf': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="8" y1="18" x2="12" y2="18"/>`,
  'text': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="17" x2="14" y2="17"/>`,

  // ── Charts & Analytics ───────────────────────────────────────────────────
  'chart-pie': `<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>`,
  'chart-bar': `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>`,
  'dashboard': `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>`,
  'venn': `<circle cx="9" cy="12" r="7"/><circle cx="15" cy="12" r="7"/>`,
  'venn3': `<circle cx="12" cy="7.5" r="6.5"/><circle cx="8" cy="15.5" r="6.5"/><circle cx="16" cy="15.5" r="6.5"/>`,

  // ── System & Infrastructure ──────────────────────────────────────────────
  'database': `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>`,
  'cog': `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,
  'setting': `<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>`,
  'server': `<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>`,
  'shield': `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,

  // ── Communication ────────────────────────────────────────────────────────
  'email': `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`,
  'phone': `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`,
  'phone-ring': `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M15.05 5A5 5 0 0 1 19 8.95"/><path d="M15.07 1A9 9 0 0 1 23 8.93"/>`,

  // ── Transfer ─────────────────────────────────────────────────────────────
  'upload': `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>`,
  'download': `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
  'export': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="12" x2="15" y2="12"/><polyline points="12.5 9.5 15 12 12.5 14.5"/>`,
  'import': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="15" y1="12" x2="9" y2="12"/><polyline points="11.5 9.5 9 12 11.5 14.5"/>`,

  // ── Labels ──────────────────────────────────────────────────────────────
  'tag': `<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>`,
  'tags': `<path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5z"/><line x1="6" y1="9" x2="6.01" y2="9"/><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/>`,

  // ── Links ────────────────────────────────────────────────────────────────
  'link': `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
  'unlink': `<path d="M18.84 12.25l1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.004 5.004 0 0 0-7.07.12l-1.72 1.71"/><path d="M5.17 11.75l-1.72 1.71a5.004 5.004 0 0 0 .12 7.07 5.004 5.004 0 0 0 7.07-.12l1.71-1.71"/><line x1="8" y1="2" x2="8" y2="5"/><line x1="2" y1="8" x2="5" y2="8"/><line x1="16" y1="19" x2="16" y2="22"/><line x1="19" y1="16" x2="22" y2="16"/>`,

  // ── Editing & Actions ────────────────────────────────────────────────────
  'pencil': `<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>`,
  'save': `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>`,
  'trash': `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>`,
  'eye': `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
  'eye-off': `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`,
  'print': `<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>`,

  // ── Status ───────────────────────────────────────────────────────────────
  'check-mark': `<polyline points="20 6 9 17 4 12"/>`,
  'check-mark-circle': `<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>`,
  'success': `<circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/>`,
  'warning': `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
  'error': `<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`,
  'question': `<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
  'question-circle': `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
  'info': `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,

  // ── Time ─────────────────────────────────────────────────────────────────
  'clock': `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  'calendar': `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  'time': `<circle cx="12" cy="13" r="8"/><polyline points="12 9 12 13 15 13"/><line x1="9" y1="3" x2="15" y2="3"/><line x1="12" y1="3" x2="12" y2="5"/>`,
  'wait': `<path d="M5 22h14M5 2h14M17 2v4l-5 4 5 4v4H7v-4l5-4-5-4V2"/>`,

  // ── Medical & Transport ──────────────────────────────────────────────────
  'ambulance': `<rect x="2" y="7" width="14" height="10" rx="1"/><path d="M16 10l5 1v5h-5"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M6 10h4M8 8v4"/>`,
  'car': `<rect x="2" y="10" width="20" height="7" rx="2"/><path d="M6 10l2-4h8l2 4"/><circle cx="6.5" cy="17" r="1.5"/><circle cx="17.5" cy="17" r="1.5"/>`,
  'car-crash2': `<rect x="2" y="10" width="14" height="7" rx="2"/><path d="M5 10l2-4h6l2 4"/><circle cx="5.5" cy="17" r="1.5"/><circle cx="12.5" cy="17" r="1.5"/><line x1="19" y1="4" x2="23" y2="8"/><line x1="23" y1="4" x2="19" y2="8"/>`,
  'car-crash': `<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/><polygon points="19,6.5 20,10.6 23.6,8.4 21.4,12 25.5,13 21.4,14 23.6,17.6 20,15.4 19,19.5 18,15.4 14.4,17.6 16.6,14 12.5,13 16.6,12 14.4,8.4 18,10.6"/>`,
  'bed': `<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v4H2"/><path d="M2 17h20"/><circle cx="6" cy="8" r="2"/>`,
  'xray': `<rect x="3" y="2" width="18" height="20" rx="2"/><line x1="12" y1="6" x2="12" y2="18"/><path d="M9 8c0 0 3 2 3 4s-3 4-3 4"/><path d="M15 8c0 0-3 2-3 4s3 4 3 4"/>`,
  'lab': `<path d="M9 3h6"/><path d="M9 3v7l-5 9a1 1 0 0 0 .9 1.5h12.2a1 1 0 0 0 .9-1.5L15 10V3"/><circle cx="11" cy="16" r="1"/>`,
  'patient': `<circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/>`,
  'bed-patient': `<rect x="2" y="12" width="20" height="9" rx="2"/><path d="M2 16h20"/><circle cx="7" cy="14" r="1.5"/><path d="M9 14h9"/>`,
  'wheelchair': `<circle cx="12" cy="4" r="2"/><path d="M10 7l-2 6h7l1.5 4.5"/><circle cx="8" cy="19.5" r="2.5"/><circle cx="17" cy="19.5" r="2.5"/><line x1="8" y1="13" x2="8" y2="17"/>`,

  // ── Social ───────────────────────────────────────────────────────────────
  'youtube': `<path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.48z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>`,
  'facebook': `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`,
  'line': `<path d="M20 12c0-4.4-3.58-8-8-8S4 7.6 4 12c0 3.74 2.7 6.9 6.41 7.6.25.05.59.16.68.36.08.18.05.47.02.66l-.11.67c-.03.2-.17.8.64.43 4.8-2.57 7.36-6.23 7.36-9.72z"/><line x1="9" y1="11" x2="9" y2="13"/><line x1="11.25" y1="11" x2="11.25" y2="13"/><line x1="13.5" y1="11" x2="13.5" y2="13"/><line x1="15" y1="11" x2="15" y2="13"/>`,
  'telegram': `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
  'wechat': `<path d="M9 3C5.1 3 2 5.9 2 9.5c0 2 1 3.8 2.6 5l-.6 2 2.4-1.1c.8.3 1.7.5 2.6.5 4.4 0 7-2.9 7-6.4C16 5.9 12.9 3 9 3z"/><path d="M16 9.2c.5-.1 1-.1 1.5-.1C21.1 9.1 24 11.6 24 14.7c0 1.5-.7 2.9-1.9 3.9l.5 1.8-2-1c-.6.2-1.3.3-2 .3-3 0-5.5-2-5.5-4.5 0-.4.1-.8.2-1.2"/>`,
  'linkedin': `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>`,

  // ── Person & Expressions ────────────────────────────────────────────────
  'person-smile': `<circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><path d="M10 8.5a2 2 0 0 0 4 0"/>`,
  'person-sad': `<circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><path d="M10 7.5a2 2 0 0 1 4 0"/>`,
  'person-cry': `<circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><path d="M10 8.5a2 2 0 0 0 4 0"/><path d="M10 9l-1.5 2.5"/><path d="M14 9l1.5 2.5"/>`,
  'person-sneez': `<circle cx="9" cy="5" r="3"/><path d="M5 21v-3a4 4 0 0 1 4-4h3"/><path d="M14 8l2-1 2-1"/><path d="M13 11h3h3"/><path d="M14 14l2 1 2 1"/>`,
  'face-smile': `<circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 3 4 3 4-3 4-3"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>`,
  'face-sad': `<circle cx="12" cy="12" r="10"/><path d="M8 15s1.5-3 4-3 4 3 4 3"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>`,
  'face-cry': `<circle cx="12" cy="12" r="10"/><path d="M8 15s1.5-3 4-3 4 3 4 3"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><path d="M9 10l-1 3"/><path d="M15 10l1 3"/>`,
  'face-sneez': `<circle cx="12" cy="12" r="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M9 9l6 0"/><path d="M10 12c1-2 3-2 4 0"/>`,

  // ── Code ─────────────────────────────────────────────────────────────────
  'qr-code': `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="5" y="5" width="3" height="3"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="16" y="5" width="3" height="3"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="5" y="16" width="3" height="3"/><line x1="14" y1="14" x2="14" y2="14.01"/><line x1="18" y1="14" x2="18" y2="14.01"/><line x1="21" y1="14" x2="21" y2="16"/><line x1="14" y1="17" x2="16" y2="17"/><line x1="18" y1="17" x2="18" y2="21"/><line x1="14" y1="20" x2="14" y2="21"/><line x1="21" y1="19" x2="21" y2="21"/>`,
  'barcode': `<path d="M3 5v14"/><path d="M7 5v14"/><path d="M11 5v14"/><path d="M13 5v14"/><path d="M17 5v14"/><path d="M19 5v14"/><rect x="1" y="4" width="22" height="16" rx="2" fill="none"/>`,
  'barcode-reader': `<path d="M3 5v14"/><path d="M7 5v14"/><path d="M11 5v14"/><path d="M13 5v14"/><path d="M17 5v14"/><path d="M19 5v14"/><path d="M1 4h4"/><path d="M1 20h4"/><path d="M19 4h4"/><path d="M19 20h4"/><line x1="1" y1="12" x2="23" y2="12" stroke-width="2"/>`,
};
