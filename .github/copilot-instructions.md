# ngx-pk-ui — Copilot Instructions

## What this repo is

An **Angular 21 component library** (`ngx-pk-ui`) published to npm for other teams to install and use.
All library source lives under `projects/ngx-pk-ui/src/lib/`. The public API is declared in `projects/ngx-pk-ui/src/public-api.ts`.

## Commands

```bash
# Build the library (outputs to dist/ngx-pk-ui)
ng build ngx-pk-ui

# Run all tests (Vitest, headless)
ng test ngx-pk-ui --no-watch

# Run a single test file
npx vitest run projects/ngx-pk-ui/src/lib/pk-tabs/pk-tabs.spec.ts

# Publish to npm (run after build)
npm publish dist/ngx-pk-ui
```

## Architecture

```
projects/ngx-pk-ui/
  src/
    public-api.ts          ← everything exported from here is part of the public API
    lib/
      pk-tabs/
        pk-tab.ts          ← child component: one tab item (used via content projection)
        pk-tabs.ts         ← parent container: manages active tab with signals
        pk-tabs.html / .css
        pk-tabs.spec.ts
      pk-toastr/
        pk-toastr.model.ts ← Toast interface and ToastType
        pk-toastr.service.ts ← injectable service: success/error/info/warning/dismiss/clear
        pk-toastr.ts       ← component that renders the toast container (add once to AppComponent)
        pk-toastr.html / .css
        pk-toastr.spec.ts
```

`dist/ngx-pk-ui/` is the build output consumed by npm. Never edit files there.

## Key conventions

### Angular 21 patterns used throughout
- **Signals** (`signal()`, `input()`, `contentChildren()`, `viewChild()`) — no `@Input`/`@Output` decorators.
- **`input.required<T>()`** for required component inputs.
- **`contentChildren(Token)`** (not `@ContentChildren`) for querying projected content.
- **Standalone components only** — no NgModules.
- **`inject()`** instead of constructor injection.
- **`@for` / `@if` control flow blocks** — not `*ngFor` / `*ngIf` directives.

### Adding a new component
1. `ng generate component <name> --project=ngx-pk-ui`
2. Change the selector from `lib-<name>` to `pk-<name>`.
3. Export it from `public-api.ts`.
4. Write a `.spec.ts` alongside the component (Vitest, no `fakeAsync` — use `vi.useFakeTimers()` instead).

### Tests
- Test runner is **Vitest** (Angular 21 default). Do **not** use `fakeAsync`/`tick` from `@angular/core/testing` — import `vi` from `vitest` and use `vi.useFakeTimers()` / `vi.advanceTimersByTime()` instead.
- DOM tests use a `TestHostComponent` wrapper to test components through real content projection.

### CSS
- Each component has a co-located `.css` file (no global styles, no preprocessor).
- Class names follow BEM: `.pk-tabs__nav-item--active`.

### Versioning & publishing
- The library's own `package.json` is at `projects/ngx-pk-ui/package.json`. Bump version there before publishing.
- `peerDependencies` must stay in sync with the Angular version of the workspace (`package.json` → `@angular/core`).
- When Angular releases a new major version, update `peerDependencies` in `projects/ngx-pk-ui/package.json` and rebuild.
