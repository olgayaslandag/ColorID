# Project Summary: ColorID (Laravel Inertia Vue → React Conversion)

## Goal
Convert a Laravel Inertia project from Vue to React (no TypeScript).

## Constraints & Preferences
- No TypeScript — all files must be `.jsx` or `.js`
- Use `@inertiajs/react` for Inertia bindings
- Keep Bootstrap 5 CSS classes and existing design

## Done
- Removed all `.vue` files (13 Components, 2 Layouts, 6 Auth pages, 4 Profile pages, Dashboard/Welcome/Visualize)
- Removed all `.tsx` / `.ts` files, `tsconfig.json`, `resources/js/types/`, `resources/js/composables/`
- Converted every page/component/layout to plain `.jsx`/`.js`
- Rewritten `resources/js/app.jsx` (React Inertia entry)
- Updated `resources/views/app.blade.php`
- Production build (`npm run build`) succeeds

### Fix 1: React Refresh preamble not injected by `laravel-vite-plugin`
- **Root cause**: `laravel-vite-plugin` bypasses Vite's HTML pipeline, so `transformIndexHtml` never runs. React plugin's preamble never reaches the browser → `"can't detect preamble"` thrown by every page component.
- **Fix**: Import `@vitejs/plugin-react-swc/preamble` virtual module in `app.jsx`. Vite resolves it as a real module, and the refresh setup runs during static import evaluation.
- Also switched `import.meta.glob` from `eager: true` to lazy (default) so preamble executes before any page component code. Bonus: code splitting.

### Fix 2: `TypeError: null is not an object (evaluating 'initialPage.component')`
- **Root cause**: `@inertiajs/react` v3.4.0's `getInitialPageFromDOM()` reads page data from `<script data-page="app" type="application/json">`. But inertia-laravel v2.0.24's `@inertia` Blade directive defaults to `<div id="app" data-page="...">` format → `getInitialPageFromDOM` returns `null`.
- **Fix**: Set `INERTIA_USE_SCRIPT_ELEMENT_FOR_INITIAL_PAGE=true` in `.env`, which changes `@inertia` output to the `<script>` format that Inertia v3 client expects.

### Infra: Missing rolldown native binding
- **Root cause**: `@rolldown/binding-linux-arm64-gnu` optional dependency missing on ARM64 Linux.
- **Fix**: `npm install @rolldown/binding-linux-arm64-gnu`

## In Progress
- Need to test `npm run dev` after both fixes
- WebSocket/HMR errors (`WebSocket is closed due to suspension`) may be a separate Docker/IPv6 issue

## Key Decisions
- Used `@vitejs/plugin-react-swc` v4.3.1 (lightning-fast SWC-based transform)
- Dashboard.jsx conditionally selects `RootLayout` (admin, `/admin` path) vs `AuthenticatedLayout` (user, `/dashboard`)
- No global layout in `app.jsx`
- Lazy page loading via `import.meta.glob` (non-eager) for code splitting and preamble safety

## Relevant Files
- `vite.config.js`: `react()` + `laravel()` plugins; `server.host: '0.0.0.0'` + `server.hmr.host: 'localhost'`
- `resources/js/app.jsx`: React Inertia entry; imports `@vitejs/plugin-react-swc/preamble`; lazy-loads `./pages/**/*.jsx`
- `resources/views/app.blade.php`: `@vite('resources/js/app.jsx')` + `@inertia` / `@inertiaHead`
- `.env`: `INERTIA_USE_SCRIPT_ELEMENT_FOR_INITIAL_PAGE=true`
- `resources/js/layouts/AuthenticatedLayout.jsx`, `GuestLayout.jsx`, `RootLayout.jsx`
- `resources/js/pages/Dashboard.jsx` (dual-purpose admin/user)
- `resources/js/hooks/useTranslation.js`: plain JS (no TS)
