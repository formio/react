# @formio/react

## Identity

- **Path:** `packages/react`. **Published name:** `@formio/react`, version in [`package.json`](./package.json).
- **License:** MIT. **OSS sync:** YES — `ossRepo: { repo: github.com/formio/react, srcPath: "." }`. Everything in `src/` ships publicly.
- **Module/language:** TypeScript (CJS `main: lib/index.js`), mixed era. Targets React 17–19 (`peerDependencies: react/react-dom >=17`; `@types/react ^19`).
- **Purpose:** the React wrapper around the `@formio/js` renderer + `@formio/core` data engine. It owns the React surface (components, context, hooks) and the **lifecycle bridge** from React's re-render model to the imperative `@formio/js` instance — **not** rendering/validation/submission, which live in `@formio/js`.

## Floor — immutable musts

- **Never widen a create-effect's dependency array to react to a data prop.** Anything in `Form.tsx`'s `[formConstructor, formReadyCallback, formSource, options, url]` or `FormBuilder.tsx`'s `[Builder, initialForm, onBuilderReady, options]` triggers a full instance destroy+recreate. Apply data changes (`submission`) to the live instance in a separate `isEqual`-guarded effect instead. See [react/create-effect-deps-rebuild-02](../../docs/gotchas/react.md#reactcreate-effect-deps-rebuild-02--the-create-effect-dependency-array-rebuilds-the-whole-instance) (markers `G-RC03`/`G-RC04`).
- **Guard every `await instance.ready` against mount/unmount/redraw.** Keep the `isMounted` ref check after the await and destroy orphaned/pending instances (`G-RC01`/`G-RC02`). After `destroy(true)`, instance fields are _deleted_ — optional-chain in any continuation. See [react/async-create-race-01](../../docs/gotchas/react.md#reactasync-create-race-01--async-instance-creation-races-react-mountunmountredraw).
- **Clone shared default props before handing them to a builder/form.** Module-level `const DEFAULT_X = {}` defaults are a single shared reference; the builder mutates the form definition in place. Use `fastCloneDeep`. See [react/shared-mutable-default-props-03](../../docs/gotchas/react.md#reactshared-mutable-default-props-03--module-level-default-props-are-shared-and-the-builder-mutates-them-in-place) (marker `G-RC05`).
- **`form`/`forms` and `submission`/`submissions` are different Redux modules** (single-entity CRUD vs list+pagination). They're legacy `.js`; TS won't catch a mix-up. See [react/singular-plural-redux-modules-04](../../docs/gotchas/react.md#reactsingular-plural-redux-modules-04--formforms-and-submissionsubmissions-are-different-modules).
- **Keep nothing secret/license-gated in source** and keep `GOTCHA` markers opaque — `src/` is published to the public OSS repo.
- **Match the file's era.** New components/hooks → `.tsx`/`.ts`, function components, hooks. Preserve the legacy `.js` modules (`src/modules/`, `types.js`, `utils.js`) and the deprecated `ReactComponent.jsx` — don't TS-convert them. Adds to [`/STANDARDS.md`](../../STANDARDS.md); never overrides it.

## Ceiling — emerging patterns

- **Pattern: a wrapper component holds the instance in `useState`, a `renderElement` ref, and an `isMounted` ref; the create-effect `await`s `.ready`, guards liveness, destroys the previous instance, then `setInstance`. Example:** [`src/components/Form.tsx`](./src/components/Form.tsx) (lines 252–382) — the smallest reference bridge.
- **Pattern: data props are applied to the live instance in their own `isEqual`-guarded effect, never via the create-effect deps. Example:** [`src/components/Form.tsx`](./src/components/Form.tsx) submission-sync effect (lines 373–379).
- **Pattern: a prop that is only ever read or invoked — a callback, or the `handlers` rest-spread — goes through a ref refreshed in a post-commit effect, so its identity cannot drive a resubscribe or a rebuild. Example:** [`src/components/Form.tsx`](./src/components/Form.tsx) `handlersRef` (marker `G-RC01`).
- **Pattern: on redraw, destroy the not-yet-ready previous instance before creating the replacement via a `pendingBuilder` ref. Example:** [`src/components/FormBuilder.tsx`](./src/components/FormBuilder.tsx) (lines 189–209, marker `G-RC02`).

## Blast radius

**4 dependents, tier: medium** (`@formio/enterprise-form-builder-react`, `oss-portal`, `react-efb-demo`, `react-playground`). See [`/docs/dependencies/react.md`](../../docs/dependencies/react.md).

## Test & build

```sh
pnpm -F @formio/react build        # tsc --project tsconfig.json → lib/
pnpm -F @formio/react test         # jest (jsdom + Testing Library) — REAL runner
pnpm -F @formio/react lint         # eslint src — REAL
pnpm -F @formio/react check-types  # tsc --noEmit
```

- **The runner is `jest`, not mocha.** Root CLAUDE.md says "Mocha is primary" — that does **not** apply here; `test`/`lint` are real commands that run real tests (unlike `@formio/angular`/`@formio/bootstrap`, whose scripts are stubs).
- **"Green"** = `test` + `lint` + `check-types`. For any lifecycle change, behavioral green also means exercising the EFB + demo apps (`react-efb-demo`, `react-playground`, `oss-portal` in production mode) — that's where redraw/StrictMode bugs surface.
- Single test file: `cd packages/react && pnpm jest src/components/__tests__/<name>.test.tsx`.

## Hot paths & gotchas

See [`/docs/gotchas/react.md`](../../docs/gotchas/react.md). Entries: `react/async-create-race-01`, `react/create-effect-deps-rebuild-02`, `react/shared-mutable-default-props-03`, `react/singular-plural-redux-modules-04`.

## Cross-cutting triggers

- **Touching any create/redraw lifecycle** (create-effect, `isMounted`/`pendingBuilder` refs, instance recreation in `Form.tsx`/`FormBuilder.tsx`/`FormEdit.tsx`) → read [`/docs/cross-cutting/framework-wrapper-lifecycle.md`](../../docs/cross-cutting/framework-wrapper-lifecycle.md). This is the `@formio/js ↔ @formio/react` create/redraw contract (FIO-11128, FIO-11245, FIO-9944).
- **Touching `destroy()` / teardown / async continuations** → read [`/docs/cross-cutting/component-lifecycle.md`](../../docs/cross-cutting/component-lifecycle.md). After `destroy(true)`, instance fields are deleted; this is a 6-package contract (FIO-10902).
- **Any rendering/validation/submission behavior question** → it's almost certainly `@formio/js`, not here. Read [`/docs/architecture/formio.js.md`](../../docs/architecture/formio.js.md) and [`/docs/gotchas/formio.js.md`](../../docs/gotchas/formio.js.md) first.
- **Adding a new `@formio/js` import** → use a declared `exports` subpath only (`@formio/js` or `@formio/js/utils`); never `@formio/js/lib/...`. See [`/docs/dependencies/react.md`](../../docs/dependencies/react.md#formiojs-subpath-rule).
- **Changing a `FormBuilder`/`Form` callback signature** (`onSaveComponent`, `onDeleteComponent`, `onChange`, …) → these are a shared contract with `@formio/enterprise-form-builder-react`, which threads them into its conflict-change tracking. FIO-10763 widened `onSaveComponent` (`path`, `isNew`) across both packages + needed two changesets. See the EFB-wrapper-stack row in [`/docs/cross-cutting/README.md`](../../docs/cross-cutting/README.md).
- **`major` bump** → coordinate the OSS release (ships to `github.com/formio/react`); the planned major removes `ReactComponent`.

## References

- Repo-wide: [`/CLAUDE.md`](../../CLAUDE.md), [`/STANDARDS.md`](../../STANDARDS.md)
- Architecture: [`/docs/architecture/react.md`](../../docs/architecture/react.md)
- Dependencies: [`/docs/dependencies/react.md`](../../docs/dependencies/react.md)
- Gotchas: [`/docs/gotchas/react.md`](../../docs/gotchas/react.md)
- Renderer it wraps: [`/docs/architecture/formio.js.md`](../../docs/architecture/formio.js.md)
