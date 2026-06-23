# vue-parkir — Agent Guide

## Stack
Vue 3.5 + TypeScript 6.0 + Vite 8 + Bootstrap 5.3 + vue-router 5 (beta).

## Commands

| Purpose | Command |
|---|---|
| Install | `bun install` |
| Dev server | `bun dev` |
| Full build | `bun run build` — runs `vue-tsc --build` then `vite build` in parallel (via `npm-run-all2` / `run-p`) |
| Type-check only | `bun run type-check` |
| Build only | `bun run build-only` |
| Preview build | `bun preview` |
| Single-file type-check | `bunx vue-tsc --build path/to/file.ts` |

No linter, formatter, or test runner is configured. No CI pipeline.

## Project Structure

```
src/
├── main.ts            # Entry: imports Bootstrap CSS/JS, mounts app with router
├── App.vue            # Root layout: sidebar + router-view
├── router/index.ts    # 5 routes: / /dashboard, /streaming, /login, /register (memory history)
├── composables/       # useAuth — login, register, JWT management, authFetch wrapper
├── views/             # TheDashboard, TheStreaming, TheLoginForm, TheRegister
└── components/        # TheSideBar, icons/
```

## Notable Details

- **Router uses `createMemoryHistory()`** — URL bar does not change on navigation.
- **`@/` path alias** maps to `./src/*` (configured in both Vite and tsconfig).
- **Bootstrap** is imported globally in `main.ts` (`bootstrap.css`, `bootstrap.bundle.js`, `bootstrap-icons`).
- **`noUncheckedIndexedAccess: true`** in `tsconfig.app.json` — array/object lookups may return `undefined`.
- **`vue-tsc --build`** uses project references (`tsconfig.json` → `tsconfig.app.json` + `tsconfig.node.json`). Build artifacts go to `node_modules/.tmp/`.
- Type checking runs on all `src/**/*` (excluding `__tests__/*`).
- **Hardcoded API URLs** in views point to `http://127.0.0.1:3000` (dashboard fetches `/history`, streaming uses `/stream-in`, `/stream-out`).
- **Auth composable** (`src/composables/useAuth.ts`) manages JWT in localStorage, provides `login()`, `register()`, `logout()`, and `authFetch()` (wraps `fetch` with `Authorization: Bearer` header).
- **All routes except `/login` and `/register` are protected** by a `beforeEach` navigation guard — unauthenticated users are redirected to `/login`.
- **Sidebar** shows Dashboard/Camera links only when logged in, and toggles between Login/Logout button at the bottom.
- No generated code, migrations, or build artifacts aside from `dist/` and `.tsbuildinfo`.
