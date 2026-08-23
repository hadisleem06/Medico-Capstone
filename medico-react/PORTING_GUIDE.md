# Medico → React — Porting Guide

This is the single source of truth for porting the original static Medico
pages into this React app **faithfully**. Read it fully before porting a page.

## The golden rule

**Reproduce the UI and behaviour exactly. Do not redesign anything.**
- Reproduce each page's markup as JSX with **identical `className`s** (verbatim).
  The CSS is reused unchanged from `public/styles/*` — we never edit styles, so
  a wrong/missing class silently breaks the visual.
- Keep the same text, icons (`<i className="fa-solid fa-...">`), structure and
  order. Keep unusual characters as-is (e.g. `SpO₂`, `°C`, the `🩺` logo).
- The only behaviour changes allowed are the ones already decided (see below:
  navigation, counters, login routing). Everything else behaves as the original.

## What the layout already provides — DO NOT put these in a page

Pages render **inside** `AppLayout` (via `<Outlet/>`). The layout already renders:
- `AuroraBackground` (`.aurora` + 3 layers)
- the `.dashboard` wrapper and `<main className="main-content">`
- the `Sidebar` (nav, collapse toggle, theme toggle, logout)

So a ported page must **NOT** render `.aurora`, `.dashboard`, `.sidebar`, or
`<main>`. It renders **only** what lived inside `<main class="main-content">` in
the original file, and its **first element is `<Topbar .../>`**.

## Page skeleton

```jsx
import Topbar from "../../components/layout/Topbar"
// + hooks/components/services this page needs

export default function PageName() {

    // state + handlers

    return (
        <>
            <Topbar title="Exact <h2> text from the original topbar" />

            {/* each <section> that lived inside <main>, in order,
                with identical classNames and markup */}
        </>
    )
}
```

- `Topbar` reads the role from context and renders the correct chrome
  automatically (doctor → breadcrumb variant; nurse/admin → page variant).
  **Pass only `title`.** Add `status` (boolean) ONLY where the original had the
  doctor "Available" pill (that is the dashboard only).
- Do **not** hand-author the topbar profile/menu — `Topbar` + `ProfileMenu` do it.

## Shared pieces and their exact APIs

Import paths below are from a page in `src/pages/<role>/`.

- **`Topbar`** — `../../components/layout/Topbar` — `<Topbar title="..." status={false} actions={null} />`
- **`Modal`** — `../../components/ui/Modal` —
  `<Modal open={bool} onClose={fn} variant="doctor">{inner}</Modal>`
  Renders only the overlay (portaled, toggles `.active`, locks body, closes on
  Escape / backdrop, focuses first field). **You provide the inner modal markup**
  as children — e.g. the original `<div className="appointment-modal">…</div>`
  (doctor) or `<div className="admin-modal">…</div>` (admin). `variant`:
  `"doctor"` → `.appointment-modal-overlay`, `"admin"` → `.admin-modal-overlay`.
- **`FilterDropdown`** — `../../components/ui/FilterDropdown` —
  `<FilterDropdown id="..." options={[{value,label,icon}]} value={v} onChange={setV} />`
  Reproduces the `.admin-filter/.filter-trigger/.filter-menu/.filter-option`
  dropdown. Controlled: parent owns the value; derive filtered lists from it.
- **`Counter`** — `../../components/ui/Counter` —
  `<Counter target={124} className="doctor-counter" />` renders an animated
  `<span className="...">` counting up to `target` (900ms). Use it wherever the
  original had a counter span (`.counter`, `.doctor-counter`, `.nurse-counter`,
  `.admin-counter`). Any suffix (`+`, `%`) is plain text next to it.
- **`useToast()`** — `../../context/ToastContext` — returns
  `{ showDoctorToast(title, message, icon), showNurseMessage(message, type), showAdminMessage(message, type) }`.
  Use the one matching the page's role. Icons are FA names e.g. `"fa-check"`.
- **`useRole()`** — `../../context/RoleContext` — returns the role string
  (rarely needed in a page; Topbar uses it).
- Hooks in `src/hooks/`: `useClickOutside(ref, handler, active)`,
  `useCountUp(target)`. Reuse them; don't reimplement.

## Navigation (decided)

The originals navigated via `data-page` / `data-<role>-action` document
listeners + `window.location`. Port these to **`useNavigate()` + explicit
`onClick`**, and drop the now-dead data attributes:

```jsx
import { useNavigate } from "react-router-dom"
const navigate = useNavigate()
<button className="quicklink" onClick={() => navigate("/doctor/soap")}>…</button>
```

Route = original filename minus `.html`, under the role: `soap.html` →
`/doctor/soap`, `lab-analysis.html` → `/doctor/lab-analysis`, etc.

**Inert buttons stay inert.** If a control had no handler (or only a
`console.log` with no visible/navigation effect), render it with **no `onClick`**
— it produces the same (no) UX. Do not invent navigation the original lacked.
Sidebar nav is the layout's job — never wire it from a page.

## The backend/AI seam (decided)

Initial render data is read **synchronously** from `src/data/*` (no spinners —
identical UX). **Writes / submits / AI "generate/analyze" actions go through a
service** in `src/api/`, whose mock body resolves after the **same fake delay
the original used** (its `setTimeout` ms), then the page shows the same toast /
result. See `src/api/appointmentService.js` for the pattern. This lets the
backend team swap a body for a real request with no page change.

- Extract the page's hardcoded dataset(s) into a **uniquely-named**
  `src/data/<page>.js` (e.g. `icd10.js`, `investigations.js`, `reports.js`,
  `patientsDirectory.js`) and `.map()` it in JSX. Keep values verbatim.
- Give the page its **own** service file if it submits / analyses, uniquely
  named (e.g. `labService.js`, `medicationService.js`, `reportService.js`).
  Do not create/edit a shared service another page might also create.

## Feature-script → React mapping (behaviour must match)

- **Timers / intervals** → `useState` + `useEffect(setInterval, [deps])` that
  **returns a cleanup** clearing it. (See `Consultation.jsx`.)
- **Debounced autosave indicator** → state `"saving"|"saved"`, a `useRef` for the
  timeout, cleared on unmount. (See `Consultation.jsx`.)
- **Tabs** → `useState(activeTab)`; toggle the original active class.
- **Search + multi-select + chips** → controlled query state → filtered list;
  `selected[]` state; render the chips with the **exact** chip markup from the
  source; add/remove updates `selected`.
- **List filters** → `FilterDropdown` (or the original's control) drives value
  state → derive the filtered array; render the original **empty-state** markup
  when nothing matches.
- **Forms / fake submit** → controlled inputs; keep the same validation
  (required, regex, min-length), the same error classes
  (`.has-error`/`.field-error`/`.error-message`), focus-first-error, spinner
  label swap on the submit button, then the service call → toast → reset.
  (See `Appointments.jsx`.)
- Values the original never reads back (e.g. a textarea only watched for an
  autosave ping) can stay **uncontrolled** (`defaultValue` + `onChange` for the
  side-effect) — simpler and faithful.

## Formatting style (match it exactly)

Highly vertical: **4-space indent, one attribute/value per line for multi-prop
elements, generous blank lines** between blocks. Browser-global mindset (no TS).
Look at `Dashboard.jsx`, `Appointments.jsx`, `Consultation.jsx` and match them.

## Reference implementations to read first

- `src/pages/doctor/Dashboard.jsx` — sections, `Counter`, `useNavigate`, inert buttons
- `src/pages/doctor/Appointments.jsx` — `FilterDropdown`, `Modal`, form + summary,
  service submit + toast, filtered list + empty state, data module
- `src/pages/doctor/Consultation.jsx` — timer + autosave effects, quicklink nav

## Do NOT touch (the main agent owns these)

`App.jsx`, `main.jsx`, `StyleManager.jsx`, anything in `components/`,
`context/`, `hooks/`, `data/roles.js`, `data/users.js`, `api/client.js`, and any
**other** page's files. Create only your page + its own `data/`/`api/` files.
Wiring the route into `App.jsx` is done by the main agent.

## Verify before finishing

Your JSX must compile (valid JSX, all imports resolve, one default export).
Report: the file(s) you created, the sections/behaviours ported, and any
decision or deviation you made.
