# Repository Guidelines

## Project Structure & Module Organization

This is a Vite-powered React 18 ERP frontend. Feature pages live under `src/app/`, grouped by role (`admin`, `seller`, and `warehouse`); route definitions and access rules belong in `src/routes/`. Keep reusable UI in `src/components/`, state in `src/context/` or `src/app/store.js`, hooks in `src/hooks/`, and helpers in `src/helpers/` or `src/utils/`. API setup is in `src/services/`, with authenticated endpoints in `src/services/authenticateendpoint/`. Assets and SCSS are under `src/assets/`; static files belong in `public/`. Never edit generated `dist/` output.

## Build, Test, and Development Commands

- `npm ci` installs the exact dependencies recorded in `package-lock.json`.
- `npm run dev` starts Vite with hot reload (`npm start` is equivalent).
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production bundle for a smoke test.
- `npm run lint` runs the configured ESLint checks.
- `npm run format` formats JavaScript, JSX, TypeScript, and TSX files in `src/`.

Use one package manager per change; do not update `package-lock.json`, `yarn.lock`, and `bun.lockb` together unless dependency synchronization is intentional.

## Coding Style & Naming Conventions

Prettier is the source of truth: two-space indentation, single quotes, no semicolons, trailing commas, and a 150-character line width. Prefer the `@/` alias for `src` imports. Name components in PascalCase (`DeleteConfirmModal.jsx`), hooks with a `use` prefix (`useAuth.js`), and route pages `page.jsx`. Use camelCase for services and utilities. Follow existing RTK Query endpoint-injection patterns.

## Testing Guidelines

No automated test framework or coverage threshold is currently configured. For every change, run `npm run lint` and `npm run build`, then manually exercise affected role, route, form, and API error states. If tests are introduced, colocate `*.test.jsx` or `*.test.js` files with the feature and add the corresponding npm script.

## Commit & Pull Request Guidelines

History favors short, descriptive messages such as `Add pagination` or `Fix sales dashboard dropdown`. Use imperative, focused commit subjects and avoid vague messages like `test`. Pull requests should summarize the behavior change, list verification performed, link the relevant issue, and include before/after screenshots for UI changes. Call out changes to routes, permissions, API contracts, or environment variables.

## Security & Configuration

The frontend reads `VITE_API_URL` and optionally `VITE_GRAPHQL_URL`. Vite exposes `VITE_*` values to browsers, so never place secrets or private tokens in them. Keep authentication handling centralized in `src/services/authapi.js`.
