# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` / `npm start` — Vite dev server (HMR)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run lint` — ESLint over the repo
- `npm run format` — Prettier write over `src/**/*.{ts,tsx,js,jsx}`

There is **no test runner configured**. The `eslint.config.js` is scoped to `**/*.{ts,tsx}`, but actual source is `.jsx`/`.js` (the TS configs are vestigial template scaffolding) — `npm run lint` will not flag much. Type-check with `tsc --noEmit -p tsconfig.app.json` if you want to lean on the strict TS settings against `.js`/`.jsx` via `allowJs` (not enabled by default — you'd need to add it).

Required env var: `VITE_GRAPHQL_URL` (the backend GraphQL endpoint). Place in `.env`. All RTK Query traffic is POSTed to this URL.

## Architecture

This is a React 18 + Vite SPA built on top of the **Larkon admin template** (`package.json` name: `larkonreact`). The app is an ERP frontend (warehouses, projects, products, inventory, purchases, sellers, sales, accounts/ledger). Source is JSX/JS — TypeScript configs exist but aren't actively used.

### Entry & providers

`src/main.jsx` → `App.jsx` → `AppProvidersWrapper` → `AppRouter`. `AppProvidersWrapper` (`src/components/wrappers/AppProvidersWrapper.jsx`) nests, in order: Redux `Provider` → `HelmetProvider` → `AuthProvider` → `LayoutProvider` → `TitleProvider` → `NotificationProvider` → children + `ToastContainer`.

`App.jsx` still calls `configureFakeBackend()` from the Larkon template — this mocks `/login` via `axios-mock-adapter` but is **not the real auth path**. Real auth goes through GraphQL (see below). Leave the call in place unless you also tear out the template wiring.

### Routing & role gating

- All routes live in `src/routes/index.jsx`, lazy-loaded via `React.lazy()` and grouped into per-module arrays (`WareHouseRoutes`, `SalesRoutes`, etc.) that get spread into the exported `appRoutes` and `authRoutes`.
- `src/routes/router.jsx` renders `authRoutes` inside `OtherLayout` (public/auth pages) and `appRoutes` inside `AdminLayout` (top nav + vertical nav + `page-content`). If `!isAuthenticated`, app routes redirect to `/auth/sign-in?redirectTo=<path>`.
- Role gating: `src/routes/roleAccess.js` defines `ROLE_ALLOWED_PATHS` keyed by role (from `src/assets/data/roles.js`: `ADMIN`, `WAREHOUSE`, `SELLER`, `MANAGER`, `SALES`). **Roles without an entry are unrestricted** (admins fall through). When adding a new route, decide whether non-admin roles should see it and update `ROLE_ALLOWED_PATHS[ROLES.X]` accordingly. Patterns are matched with `matchPath`, so `:param` placeholders work.
- Route convention: `src/app/admin/<module>/<feature>/page.jsx` is the route entry; co-located UI lives in a sibling `Components/` folder. Dynamic segments use Next.js-style `[paramId]` directories (despite this being a pure Vite SPA, not Next.js).

### Data layer — two RTK Query slices

There are **two separate `createApi` slices**, both hitting `VITE_GRAPHQL_URL`:

- `src/services/api.js` — `reducerPath: 'api'`. **Public/unauthenticated**. Used only for endpoints in `src/services/publicendpoint/` (currently just `login`).
- `src/services/authapi.js` — `reducerPath: 'authapi'`. **Authenticated**. `prepareHeaders` reads cookie `_LARKON_AUTH_KEY_`, extracts `token` from the JSON session, strips any `Bearer ` prefix/quotes, and sets it as the raw `Authorization` header (no `Bearer` prefix added back). Used by everything in `src/services/authenticateendpoint/`.

Both slices use a custom base query that **normalizes GraphQL errors** — a 200 OK response containing `data.errors` is rewritten into an RTK Query `error` so `isError`/`error` work in components. When writing new endpoints, expect this and pull payloads via `transformResponse: (r) => r?.data?.YourQuery ?? <empty shape>`.

Endpoints are split per-domain in `src/services/authenticateendpoint/` (sales, purchases, products, warehouse, stock, stockTransfer, sellers, courier, category, project, productvariant, dashboard, users). Each file calls `api.injectEndpoints({ endpoints: (build) => ({ ... }) })` against the **authapi** slice and exports auto-generated hooks (`useXxxQuery`, `useXxxMutation`).

Cache `tagTypes` registered on `authapi` (use these for `providesTags`/`invalidatesTags`):
`User`, `Project`, `Sales`, `Category`, `SubCategory`, `Courier`, `Products`, `Variants`, `Purchases`, `Sellers`, `Warehouses`, `WarehouseStock`, `Stock`, `StockTransfer`.

The store (`src/app/store.js`) wires both reducers and middleware. Adding a third slice requires updating both `reducer` and `middleware.concat(...)` there.

### Auth session

`src/context/useAuthContext.jsx` stores the session in cookie `_LARKON_AUTH_KEY_` as JSON `{ user: { _id, name, email, role }, token }`. Reads use `cookies-next`. The `useAuth` hook (`src/hooks/useAuth.js`) is the canonical accessor — it unwraps `user.user`, `user.token`, `user.user.role`, etc., and exposes `hasRole(roleOrRoles)`. Prefer `useAuth()` over reading the cookie directly.

## Conventions worth knowing

- **Path alias:** `@/` → `src/` (configured in both `vite.config.js` and `tsconfig.json`). Route definitions mix `@/` and relative `../app/...` imports — both work, prefer `@/`.
- **Styles:** SCSS via `sass` with `api: 'modern-compiler'`. Several deprecation categories are silenced in `vite.config.js` (`import`, `color-functions`, `global-builtin`, `if-function`) because Bootstrap 5 SCSS still uses the legacy API.
- **Forms:** Both Formik+Yup and react-hook-form+`@hookform/resolvers` are present — match whatever the surrounding feature already uses rather than introducing the other.
- **UI kits:** Bootstrap 5 (`react-bootstrap`) is the dominant kit; MUI (`@mui/material`, `@mui/icons-material`) is also installed and used in newer screens. Icons are typically `lucide-react`. Toasts via `react-toastify`; modals/alerts via `sweetalert2` / `react-sweetalert2`.
- **GraphQL queries** are written as inline template strings inside each endpoint's `query` function — there's no codegen, no `.graphql` files, and no fragment registry. When changing a query, update the local string and the `transformResponse` shape together.
