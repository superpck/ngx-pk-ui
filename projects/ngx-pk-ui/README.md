# ngx-pk-ui (Library Package)

Angular 21 UI component library and CSS utilities.

License: MIT

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

- Tabs: `PkTabs`, `PkTab`
- Toastr: `PkToastr`, `PkToastrService`
- Alert: `PkAlert`, `PkAlertService`
- Modal: `PkModal`, `PkModalHeader`, `PkModalBody`, `PkModalFooter`
- Icon: `PkIcon`, icon model types
- Datagrid: `PkDatagridModule` and datagrid subcomponents/directives
- Datepicker: `PkDatepickerComponent`, services
- Progress: `PkProgressComponent`
- Treeview: `PkTreeviewComponent`, `PkTreeviewModule`
- Select: `PkSelectComponent`
- Autocomplete: `PkAutocompleteComponent`
- Typeahead: `PkTypeaheadComponent`

## CSS utility files

- `styles/pk-ui.css` (all-in-one)
- `styles/pk-grid.css`
- `styles/pk-btn.css`
- `styles/pk-spinner.css`
- `styles/pk-badge.css`
- `styles/pk-card.css`
- `styles/pk-icon-font.css`

## Consumer setup example

```json
"styles": ["node_modules/ngx-pk-ui/styles/pk-ui.css"]
```

```ts
import { PkModal, PkModalHeader, PkModalBody, PkModalFooter } from 'ngx-pk-ui';
```
