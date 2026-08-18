# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Medico** — a static, multi-role healthcare UI prototype. Pure HTML/CSS/vanilla JS with **no build step, no package manager, no framework, no tests, and no backend**. Data is hardcoded in the HTML; forms "submit" by running a `setTimeout` and `console.log` (see `initAppointmentModal` in `assets/js/doctor.js`). `assets/js/api.js` is an empty placeholder — there is no API layer yet.

## Running it

There is nothing to build, lint, or test. Serve the folder over HTTP and open a page:

```bash
python -m http.server 8000     # then open http://localhost:8000/pages/doctor/dashboard.html
# or: npx serve   |   VS Code "Live Server"
```

A static server is required for `index.html` (the landing page uses ES-module `<script type="importmap">` + Three.js, which `file://` blocks). Role pages use classic scripts and would also open via `file://`, but use the server for consistency.

## Two overlapping layers (important)

The repo contains **two generations of the app**, and cross-references between them are frequently stale:

1. **Root-level flat prototype** (original): `index.html`, `main.js` (Three.js DNA scene for the landing hero), `landing.css`, `login.js/css`, `register.js/css`, `dashboard.js`, `patient.css`, `forgot-password.html`.
2. **Structured app** (current work): `pages/{auth,patient,doctor,nurse,admin}/*.html` + `assets/{css,js,models,images}/`.

**Asset and navigation paths are not reliable — verify every path resolves to a file that actually exists before trusting it.** Concrete examples currently in the tree:
- `index.html` links `assets/css/landing.css` and `assets/js/main.js`, but those files live at the repo root, not under `assets/`.
- `pages/auth/login.html` links `assets/css/auth/login.css` and `assets/js/login.js`; the real files are `assets/css/auth.css` and root `login.js`.
- `pages/patient/*.html` link `../assets/js/patient/dashboard.js` (wrong depth and wrong name).

The **doctor** and **nurse** areas are the most complete and correctly wired (`../../assets/js/global.js` + `../../assets/js/<role>.js`); **admin** is under active development; **patient** and **auth** wiring is partially broken.

## Architecture

**Every page is fully self-contained HTML.** The sidebar, topbar, profile menu, and modals are hand-authored inline in each page. The files in `components/` (`sidebar.html`, `topbar.html`, `profile-menu.html`, `modals.html`) are **empty stubs** — no runtime partial/fetch system exists. Editing shared chrome means editing it in each page, or in the per-role JS that generates it.

**Per-role split.** Each role has one CSS and one JS file named after it: `assets/css/<role>.css` + `assets/js/<role>.js` (`doctor`, `nurse`, `admin`, `patient`, `auth`, plus feature scripts like `consultation.js`, `lab-analysis.js`, `radiology-analysis.js`, `medication.js`, `patient-profile.js`, `waiting-room.js`). A structured page loads `global.js` first, then its role/feature script.

**Shared behaviors — use `global.js`.** `assets/js/global.js` provides the shared UI: sidebar collapse, dark/light theme (persisted in `localStorage` key `"theme"`), profile dropdown, counter animations (`.counter`/`data-target`), card entrance animations, and `.premium-glass` mouse-glow tracking (`--mouse-x`/`--mouse-y`). `assets/js/dashboard.js` is a near-duplicate older copy of these behaviors and is **not referenced by any page** — treat it as dead code; put shared changes in `global.js`.

**Navigation is per-role and inconsistent** (there is no shared router):
- `doctor.js` maps a sidebar `<li>`'s `<span>` text to a filename via a `doctorPages` dictionary.
- `nurse.js` dispatches on `[data-nurse-action]` attributes.
- Some HTML also uses `data-page="file.html"` attributes.

Role scripts often **re-implement** the sidebar/theme/profile handlers that `global.js` already provides. When both run on a page they double-bind; prefer extending `global.js` over adding another copy.

## Design system

`assets/css/global.css` defines the tokens; every page also imports **Inter** (Google Fonts) and **Font Awesome** (CDN). Dark-first, glassmorphism aesthetic:
- Colors: `--bg:#020617`, `--primary:#17afa2` (teal), `--purple:#8b5cf6`, `--blue:#2563eb`; glass surfaces via `--glass`, `--glass-strong`, `--glass-border`; `.premium-glass` + `.aurora` animated background.
- **Light mode is toggled by adding a class to `<body>`.** `global.css` (and `global.js`, `nurse`, `patient`) use **`.light-mode`**, but **`doctor.js`/`doctor.css` use `.light-theme`** and the doctor toggle does not persist to `localStorage`. This mismatch is a live inconsistency — match whichever class the file you're editing already uses, and prefer `.light-mode` for new work.
- `assets/css/responsive.css` holds breakpoints; note the typo filename `consultaion.css`.

## Code style

The codebase uses a **highly vertical formatting style**: 4-space indentation, one argument/value per line, and generous blank lines between statements and blocks (see `assets/js/doctor.js`, `global.js`). Match it — conventionally-formatted code will look wildly out of place. Scripts are browser globals (no modules/imports) except the landing `main.js`, which is an ES module.
