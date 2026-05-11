# ngx-pk-ui (Library Package)

Angular 21 UI component library and CSS utilities.

License: MIT

npm: https://www.npmjs.com/package/ngx-pk-ui

Repository: https://github.com/superpck/ngx-pk-ui

Demo & Usage: https://superpck.github.io/ngx-pk-ui/

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

## CSS utility files

- `styles/pk-ui.css` (all-in-one — includes grid, btn, form, layout, spinner, badge, card, table, toggle, breadcrumb, tooltip, icon-font)
- `styles/pk-grid.css`
- `styles/pk-btn.css`
- `styles/pk-spinner.css`
- `styles/pk-badge.css`
- `styles/pk-card.css`
- `styles/pk-table.css`
- `styles/pk-toggle.css`
- `styles/pk-breadcrumb.css`
- `styles/pk-form.css`
- `styles/pk-layout.css`
- `styles/pk-tooltip.css`
- `styles/pk-icon-font.css`
- `styles/pk-font.css` *(opt-in — Thai & Lao Google Fonts, NOT included in pk-ui.css)*

## Consumer setup example

```json
"styles": ["node_modules/ngx-pk-ui/styles/pk-ui.css"]
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
```

## pk-calendar quick start

```ts
import { PkCalendar } from 'ngx-pk-ui';
import type { PkCalendarEvent, PkCalendarView, PkEventMoveResult } from 'ngx-pk-ui';

@Component({
  imports: [PkCalendar],
})
export class MyComponent {
  events: PkCalendarEvent[] = [
    {
      id: 1,
      title: 'Team Meeting',
      type: 'meeting',
      start: new Date(),
      priority: 'high',
    },
  ];

  onMove(result: PkEventMoveResult) {
    // update events array with result.newStart / result.newEnd
  }
}
```

```html
<pk-calendar
  [events]="events"
  locale="EN"
  startOfWeek="monday"
  (onEventCreate)="onCreate($event)"
  (onEventUpdate)="onUpdate($event)"
  (onEventDelete)="onDelete($event)"
  (onEventMove)="onMove($event)"
/>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `events` | `PkCalendarEvent[]` | `[]` | Events to display |
| `view` | `'year'\|'month'\|'week'\|'day'\|'agenda'` | `'month'` | Active view |
| `currentDate` | `Date` | `new Date()` | Initial navigation date |
| `locale` | `'EN'\|'TH'` | `'EN'` | Language for labels |
| `startOfWeek` | `'sunday'\|'monday'` | `'sunday'` | First day of the week |
| `readonly` | `boolean` | `false` | Disable create/edit actions |
| `showWeekNumbers` | `boolean` | `false` | Show week number column |

**Outputs:** `(onEventCreate)`, `(onEventUpdate)`, `(onEventDelete)`, `(onEventMove)`, `(onEventClick)`, `(onDateClick)`, `(onViewChange)`, `(onNavigate)`

**`PkEventType` values:** `meeting` · `appointment` · `birthday` · `holiday` · `festival` · `event` · `task` · `reminder` · `other`

**`PkEventPriority` values:** `low` · `medium` · `high` · `urgent`

## pk-timeline quick start

```html
<!-- Vertical (default) -->
<pk-timeline>
  <pk-timeline-item label="16 Oct" sublabel="09:15" icon="check_circle" [active]="true" dotColor="#10b981">
    <p>Event content here</p>
  </pk-timeline-item>
  <pk-timeline-item label="15 Oct" image="https://example.com/avatar.jpg">
    <p>Event with avatar</p>
  </pk-timeline-item>
</pk-timeline>

<!-- Horizontal + dashed -->
<pk-timeline direction="horizontal" lineStyle="dashed">
  <pk-timeline-item label="Step 1" icon="shopping_cart" [active]="true">...</pk-timeline-item>
  <pk-timeline-item label="Step 2" icon="local_shipping">...</pk-timeline-item>
  <pk-timeline-item label="Step 3" icon="check_circle">...</pk-timeline-item>
</pk-timeline>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `direction` | `'vertical'\|'horizontal'` | `'vertical'` | Layout direction |
| `lineStyle` | `'solid'\|'dashed'` | `'solid'` | Connecting line style |

| Item Input | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `''` | Date / step name beside dot |
| `sublabel` | `string` | `''` | Secondary label line |
| `icon` | `string` | `''` | Material Symbols icon name |
| `image` | `string` | `''` | Avatar/photo URL (circular) |
| `dotColor` | `string` | `''` | CSS color override |
| `active` | `boolean` | `false` | Filled dot; icon turns white |

## pk-datagrid quick start

```ts
import { PkDatagridModule } from 'ngx-pk-ui';

@Component({
  imports: [PkDatagridModule],
})
export class MyPage {
  rows = [
    { name: 'Alice', role: 'Admin' },
    { name: 'Bob',   role: 'Developer' },
  ];
  selected: any[] = [];
}
```

```html
<!-- Basic -->
<pk-datagrid [pkDgLoading]="loading">
  <pk-dg-header [pkDgSort]="'name'" [pkDgFilter]="'name'" [style.width.px]="200">Name</pk-dg-header>
  <pk-dg-header [pkDgSort]="'role'" [style.width.px]="140">Role</pk-dg-header>

  <pk-dg-rows *pkDgRows="let row of rows" [pkDgRow]="row">
    <pk-dg-column>{{ row.name }}</pk-dg-column>
    <pk-dg-column>{{ row.role }}</pk-dg-column>
  </pk-dg-rows>

  <pk-dg-footer>
    <pk-dg-pagination #p [pkDgPageSize]="10" [rowCount]="rows.length">
      {{ p.firstItem + 1 }} - {{ p.lastItem + 1 }} of {{ rows.length }} rows
    </pk-dg-pagination>
  </pk-dg-footer>
</pk-datagrid>

<!-- Single row selection -->
<pk-datagrid pkDgSelect="single" (pkDgSelectionChange)="selected = $event">
  ...
</pk-datagrid>

<!-- Multiple row selection -->
<pk-datagrid pkDgSelect="multiple" (pkDgSelectionChange)="selected = $event">
  ...
</pk-datagrid>
```

**`<pk-datagrid>` inputs / outputs:**

| Input/Output | Type | Default | Description |
|---|---|---|---|
| `pkDgLoading` | `boolean` | `false` | Show loading overlay |
| `pkDgSelect` | `'none'\|'single'\|'multiple'` | `'none'` | Row selection mode |
| `(pkDgSelectionChange)` | `any[]` | — | Emits selected row objects |

- **`single`** — radio input per row; click again to deselect. Emits `any[]` of 0 or 1 item.
- **`multiple`** — checkbox per row + indeterminate "select all" header checkbox. Emits all selected items.
- Selected rows highlighted with light-blue background.
