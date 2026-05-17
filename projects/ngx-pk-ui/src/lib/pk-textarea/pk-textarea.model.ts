export interface PkTextareaValue {
  html: string;
  text: string;
}

export type PkTextareaMode = 'edit' | 'html' | 'text';
export type PkTextareaTheme = 'light' | 'dark';
export type PkTextareaFontSize = 'small' | 'normal' | 'large' | 'h1' | 'h2' | 'h3';

export const PK_TEXTAREA_FONTS: { label: string; fontClass: string }[] = [
  { label: 'Default',             fontClass: '' },
  { label: 'Bai Jamjuree',        fontClass: 'pk-font-bai-jamjuree' },
  { label: 'Chakra Petch',        fontClass: 'pk-font-chakra-petch' },
  { label: 'Charm',               fontClass: 'pk-font-charm' },
  { label: 'Charmonman',          fontClass: 'pk-font-charmonman' },
  { label: 'Kanit',               fontClass: 'pk-font-kanit' },
  { label: 'Mitr',                fontClass: 'pk-font-mitr' },
  { label: 'Noto Sans Thai',      fontClass: 'pk-font-noto-sans-thai' },
  { label: 'Pattaya',             fontClass: 'pk-font-pattaya' },
  { label: 'Prompt',              fontClass: 'pk-font-prompt' },
  { label: 'Sarabun',             fontClass: 'pk-font-sarabun' },
  { label: 'Sriracha',            fontClass: 'pk-font-sriracha' },
  { label: 'Srisakdi',            fontClass: 'pk-font-srisakdi' },
  { label: 'Thasadith',           fontClass: 'pk-font-thasadith' },
  { label: 'Trirong',             fontClass: 'pk-font-trirong' },
  { label: 'Noto Sans Lao',       fontClass: 'pk-font-noto-sans-lao' },
  { label: 'Noto Sans Lao Looped',fontClass: 'pk-font-noto-sans-lao-looped' },
  { label: 'Noto Serif Lao',      fontClass: 'pk-font-noto-serif-lao' },
  { label: 'Phetsarath',          fontClass: 'pk-font-phetsarath' },
];
