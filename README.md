# MathsBridge

Phase 1 foundation for the approved MathsBridge responsive web app.

## Local setup

Requirements: Node.js 24.x, npm 11.x, Git, Docker Desktop and the repository-pinned Supabase CLI 3.0.0.

```sh
npm ci
npm run dev
```

To use local environment variables, copy `.env.example` to `.env` and set only the development Supabase URL and public anon key. Keep real values in the ignored `.env`; never add service-role keys to browser variables. Phase 1 does not connect the app to Supabase. The original MathsBridge project is production-reserved; local Supabase work must use the separate MathsBridge-Dev project.

Verify the pinned CLI and local stack with:

```sh
npx supabase --version
npx supabase status
```

The local stack can be started with `npx supabase start` when needed. Do not run database resets or migrations until the database phase.

## Project commands

```sh
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run build
```

Installed direct development tooling is pinned in `package.json` and `package-lock.json`. ESLint uses the flat config with `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-x`, `eslint-plugin-react-hooks` and `globals` for JavaScript, TypeScript, React and browser globals. Tailwind CSS 4 is integrated through its official Vite plugin. The npm install-script allowlist is pinned to esbuild 0.28.2, which Vite requires to run and build.

## Phase 1 routing boundary

Routing uses the browser History API; no routing package is installed. Internal links call `history.pushState`, and back/forward updates from `popstate`. Vite serves the app entry point for direct route loads and refreshes during local development and preview. S1 is the only implemented screen: the approved `/sign-up` and `/login` destinations retain their URL and display S1 as the Phase 1 fallback until those later-phase screens are implemented. Other unknown paths use the same fallback without invented copy. A production static host must be configured to serve `index.html` for app paths; deployment and auth route guards are outside Phase 1.

## Design tokens

Approved PRD and harmonised Stitch tokens are in `src/styles/tokens.css`. S1 art-specific sampled colors are named separately. Contrast checks cover the rendered button, badge and text combinations in `tests/unit/design-tokens.test.ts`. Inter is used when available, with the PRD-approved system sans-serif fallback; no remote font or font download is used.

## Human Phase 1 checks

- Compare S1 with `docs/designs/S1.png` at 360px mobile, tablet and desktop widths.
- Navigate using Tab and Shift+Tab; check visible focus, link activation by Enter and minimum 44px targets.
- Switch the browser offline and online; verify the S1 offline banner appears and clears.
- Open `/`, `/login`, `/sign-up` and an unknown path directly, then refresh; verify S1 remains usable and the URL behavior matches the Phase 1 routing boundary above.
