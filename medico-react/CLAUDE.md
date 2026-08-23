# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server (default http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # serve the built dist/ locally
```

There is **no test runner and no linter configured** — `package.json` defines only `dev`, `build`, and `preview`. Don't reference `npm test`/`npm run lint`; they don't exist.

## What this project is

`medico-react` is a React 18 + Vite SPA that is a **faithful 1:1 port of a pre-existing static multi-page HTML/CSS/JS demo** ("Medico AI Healthcare" — a doctor/nurse/admin workspace UI). Fidelity to that original is a hard design constraint that shapes nearly every decision below: markup, class names, DOM structure, fake async delays, and per-page stylesheet loading are all reproduced deliberately. Most source files carry a header comment naming the original file they port (e.g. "ports lab-analysis.js") and explaining any React-specific deviation. **Preserve this fidelity** — when changing a page, match the original's markup/classes/timing rather than "improving" it, unless asked.

No TypeScript; everything is `.js`/`.jsx` ES modules. The code uses a distinctive airy formatting style (blank lines between imports and logical blocks) and long explanatory header comments — match it in new files.

## Architecture

### Styling is route-injected, not imported (`src/components/StyleManager.jsx`)
**No component imports CSS.** All stylesheets live in `public/styles/*.css` and are served verbatim. `StyleManager` (mounted once in `main.jsx`) watches the current route and keeps `<head>` holding exactly the stylesheet set the matching original page linked, reconciling add-before-remove so styling never drops between navigations. This is why auth/landing pages deliberately lack the chrome CSS.

Consequences:
- To change appearance, **edit `public/styles/*.css`** — not JS.
- Adding a page in a new area means updating `AREA_STYLES` and `areaFromPath()` in `StyleManager.jsx`.

### Backend/AI "service seam" (`src/api/`)
The app currently runs entirely on in-memory mock data but is pre-wired for a future backend/AI API:
- `src/api/*Service.js` are the seam. Each method today resolves seed data from `src/data/*` after the **same fake `setTimeout` delay the original used** (e.g. 900ms) so spinner/loading UX is byte-identical. The intent is that each body later swaps to a `client` call **with no page/component change**.
- `src/api/client.js` is a thin `fetch` wrapper (`get/post/put/del`) reading `import.meta.env.VITE_API_BASE_URL` (see `.env.example`). It is intentionally **unused** today — its import is commented out at the top of every service. Wire it in per-method when the backend exists.
- `src/data/*` holds seed data extracted verbatim from the original markup, plus dropdown/option lists. Reads are **synchronous** for initial render (no loading state), matching the original; only writes/refreshes go through the async service seam.

### Role-based chrome, config-driven (`src/data/roles.js`)
Three role areas — `doctor`, `nurse`, `admin` — served under `/doctor`, `/nurse`, `/admin`. The `ROLES` config object is the **single source** driving the shared `Sidebar`, `Topbar`, and `ProfileMenu`: nav items (label/icon/route/tooltip), breadcrumb workspace label, topbar variant, and profile identity/menu. To change navigation or profile chrome for a role, edit `roles.js`, not the components.

- `AppLayout` (`components/layout/`) is the persistent shell for a role area: it provides `RoleProvider` (role read via `useRole()`), renders `AuroraBackground` + `Sidebar` + `<main>` with the page in React Router's `<Outlet/>`.
- **Each page renders its own `<Topbar/>` as its first child** — the layout does not render it. This mirrors the original, where every page hand-authored its topbar.
- Global behaviors ported from the original `global.js` live in `AppLayout` + hooks: sidebar collapse (`useSidebarCollapse`), delegated glass mouse-glow setting `--mouse-x/--mouse-y` on `.premium-glass`/`.ai-card` (`useGlassGlow`), and a **card entrance stagger** that directly mutates `opacity`/`transform` on `.stat-card, .appointment-card, .ai-card, .health-overview` on every navigation — beware if adding those classes.

### Routing (`src/App.jsx`)
React Router v6 with nested layout routes. Standalone pages (`Landing`, `Login`, `Register`, `ForgotPassword`) render bare; each role area is a parent `<Route element={<AppLayout role="..."/>}>` with child routes in the Outlet. Route paths mirror the original HTML filenames minus `.html`. Unknown paths redirect to `/`.

### Contexts (`src/context/`, wired in `main.jsx`)
- `ThemeContext` — dark/light via the `.light-mode` body class, persisted at `localStorage["theme"]`.
- `ToastContext` — unifies the original's **three** separate toast systems into one provider while keeping each skin's exact markup/classes/timing: `showDoctorToast(title, message, icon)`, `showNurseMessage(message, type)`, `showAdminMessage(message, type)`. Rendered via `createPortal` to `document.body`. Use the role-appropriate method.
- `RoleContext` — the current area's role, provided by `AppLayout`.

### Three.js landing scene (`src/components/DnaScene.jsx`)
Renders the landing hero's rotating DNA helix from `public/models/*.glb`. Entire scene/loop/WebGL context is created and torn down inside one `useEffect` with a `disposed` guard, making it StrictMode-double-invoke safe.

### Assets & base URL
Everything in `public/` (`images/`, `models/`, `styles/`) is referenced through `import.meta.env.BASE_URL` (see `StyleManager`, `DnaScene`, `ProfileMenu`'s `assetUrl`) so the app works under any deploy base path. Follow this pattern for new public asset references rather than hardcoding leading-slash paths.
