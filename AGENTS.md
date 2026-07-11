# ngx-pk-ui — OpenCode Instructions

## What this repo is

Angular 22 UI component library (`ngx-pk-ui`) published to npm. Two projects:
- `projects/ngx-pk-ui/` — the library (source in `projects/ngx-pk-ui/src/lib/`)
- `projects/example/` — local dev app for visual testing (gitignored)

Public API is declared in `projects/ngx-pk-ui/src/public-api.ts`.

## Commands

```bash
# Build library (outputs to dist/ngx-pk-ui)
ng build ngx-pk-ui
npm run build:lib

# Serve example app (builds lib first, then opens browser)
npm run start:example

# Run all tests (Vitest, headless)
ng test ngx-pk-ui --no-watch

# Run single test file
npx vitest run projects/ngx-pk-ui/src/lib/<component>/<component>.spec.ts

# Publish to npm (after build)
npm publish dist/ngx-pk-ui
```

## Architecture

- **Standalone components** (preferred) — use `signal()`, `input()`, `contentChildren()`, `viewChild()`, `inject()`
- **NgModule exceptions** — `pk-tabs`, `pk-datagrid`, `pk-treeview` use `*Module` pattern
- **CSS** — co-located `.css` files, BEM naming (`.pk-component__part--modifier`)
- **Tests** — Vitest (no `fakeAsync`/`tick`; use `vi.useFakeTimers()` / `vi.advanceTimersByTime()`)
- **No preprocessors** — plain CSS only

## Adding a new component

1. `ng generate component <name> --project=ngx-pk-ui`
2. Change selector from `lib-<name>` to `pk-<name>`
3. Export from `projects/ngx-pk-ui/src/public-api.ts`
4. Write `<component>.spec.ts` with Vitest

## Versioning & publishing

- Library version is in `projects/ngx-pk-ui/package.json` (bump before publishing)
- `peerDependencies` must match Angular workspace version (`package.json` → `@angular/core`)
- Angular 22 = ngx-pk-ui v3.x

## Important references

- Copilot instructions: `.github/copilot-instructions.md` (detailed component API docs)
- Changelog: `CHANGELOG.md`
- Demo: https://superpck.github.io/ngx-pk-ui/