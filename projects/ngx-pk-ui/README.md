# ngx-pk-ui (Library Package)

Angular 22 UI component library and CSS utilities.

License: MIT

npm: https://www.npmjs.com/package/ngx-pk-ui

Repository: https://github.com/superpck/ngx-pk-ui

Demo & Usage: https://superpck.github.io/ngx-pk-ui/

## Angular Version Compatibility

| ngx-pk-ui version | Angular version |
|-------------------|-----------------|
| **v3.x**          | Angular 22      |
| **v2.x**          | Angular 21      |

Source path:

- `projects/ngx-pk-ui/src/lib` for components
- `projects/ngx-pk-ui/src/styles` for CSS utilities

## Build

```bash
ng build ngx-pk-ui
```

Output:

- `dist/ngx-pk-ui`

## Test

```bash
ng test ngx-pk-ui --no-watch
```

Run one spec:

```bash
npx vitest run projects/ngx-pk-ui/src/lib/pk-tabs/pk-tabs.spec.ts
```

## Publish

```bash
ng build ngx-pk-ui
npm publish dist/ngx-pk-ui
```

## Exported API groups

- Accordion: `PkAccordion`, `PkAccordionItem`
- Timeline: `PkTimeline`, `PkTimelineItem`
- Tabs: `PkTabsModule` → `PkTabsComponent`, `PkTabComponent`, `PkTabTitleComponent`, `PkTabBodyComponent`
- Toastr: `PkToastr`, `PkToastrService`
- Alert: `PkAlert`, `PkAlertService`
- Modal: `PkModal`, `PkModalHeader`, `PkModalBody`, `PkModalFooter`, `PkModalModule`
- Icon: `PkIcon`, `PkIconModel`
- Datagrid: `PkDatagridModule` and datagrid subcomponents/directives
- Datepicker: `PkDatepickerComponent`, services
- Progress: `PkProgressComponent`
- Treeview: `PkTreeviewComponent`, `PkTreeviewModule`
- Select: `PkSelectComponent`
- Autocomplete: `PkAutocompleteComponent`
- Typeahead: `PkTypeaheadComponent`
- Calendar: `PkCalendar`, `PkCalendarEvent`, `PkCalendarView`, `PkEventType`, `PkEventPriority`, `PkCalendarAttachment`, `PkEventMoveResult`
- File Upload: `PkFileUpload`, `PkUploadFile`, `PkUploadPreviewType`, `PkFileUploadPreviewSize`
- Sidenav: `PkSidenav`, `PkSidenavGroup`, `PkSidenavItem`, `PkSidenavTheme`, `PkSidenavMode`, `PkSidenavPosition`, `PkSidenavThemeConfig`
- Heatmap: `PkHeatmap`, `PkHeatmapDay`, `PkHeatmapColorScheme`, `PkHeatmapLocale`
- Markdown Viewer: `PkMarkdownViewer`, `PkMarkdownTheme`, `parseMarkdown`, `buildHtmlDocument`
- Locale: `PkLocale`, `PkLocaleData`, `PK_LOCALE_DATA`, `getPkLocaleData`
- Input Password: `PkInputPassword`
- Export: `PkExportService`, `PkExportButton`, `PkExportFormat`, `PkCsvOptions`, `PkTsvOptions`, `PkJsonOptions`, `PkXmlOptions`, `PkHtmlOptions`, `PkTextOptions`, `PkXlsxOptions`, `toCsv`, `toTsv`, `toJson`, `toXml`, `toHtml`, `toText`, `toXlsx`, `downloadFile`

## CSS utility files

- `styles/pk-ui.css` (all-in-one — includes grid, btn, form, layout, spinner, badge, card, table, toggle, breadcrumb, tooltip, icon-font)
- `styles/pk-font.css` *(opt-in — Thai & Lao Google Fonts, NOT included in pk-ui.css)*

## Consumer setup example

```json
CSS Class
"styles": ["node_modules/ngx-pk-ui/styles/pk-ui.css"]

Font Class
"styles": ["node_modules/ngx-pk-ui/styles/pk-font.css"]
```

```ts
// Standalone components (preferred — tree-shakeable)
import { PkAccordion, PkAccordionItem } from 'ngx-pk-ui';
import { PkTimeline, PkTimelineItem } from 'ngx-pk-ui';
import { PkModal, PkModalHeader, PkModalBody, PkModalFooter } from 'ngx-pk-ui';
import { PkToastrService } from 'ngx-pk-ui';
import { PkAlertService } from 'ngx-pk-ui';

// NgModule imports (required for NgModule-based components)
import { PkTabsModule } from 'ngx-pk-ui';      // pk-tabs
import { PkModalModule } from 'ngx-pk-ui';     // pk-modal (convenience)
import { PkDatagridModule } from 'ngx-pk-ui';  // pk-datagrid
import { PkTreeviewModule } from 'ngx-pk-ui';  // pk-treeview
import { PkSidenav } from 'ngx-pk-ui';         // pk-sidenav
import { PkHeatmap } from 'ngx-pk-ui';          // pk-heatmap
import { PkMarkdownViewer } from 'ngx-pk-ui';   // pk-markdown-viewer
import { getPkLocaleData } from 'ngx-pk-ui';    // pk-locale util
import { PkExportService, PkExportButton } from 'ngx-pk-ui'; // pk-export
```