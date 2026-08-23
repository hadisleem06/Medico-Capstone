import { useLocation, useNavigate } from "react-router-dom"

import { useTheme } from "../../context/ThemeContext"

import { ROLES } from "../../data/roles"


/*
    Sidebar — shared chrome for every role area.

    Markup is identical across the original doctor / nurse /
    admin pages:

        aside.sidebar
          button.sidebar-toggle   (chevron-left / -right)
          button.theme-toggle     (moon / sun)
          .logo  "🩺 Medico"
          ul > li (icon + span)   first .active
          button.logout

    The original nav items were clickable <li>s (no <a>) with
    ".active" applied to the <li>; we keep that exact DOM and
    derive "active" from the current route, navigating on click.
    Only nurse / admin / patient carried data-tooltip, so it is
    emitted only when present in the role config.

    Some nav items were inert (no destination) in the
    original; those omit "to", so we render them without an
    active state and do not navigate on click.

    A nav item may also carry an optional "match" list of extra
    path prefixes that should still light it up — used where an
    original hard-coded a parent item active on an orphan
    sub-page.
*/

export default function Sidebar({ role, collapsed, onToggleCollapse, mobileOpen = false, onCloseMobile }) {

    const config = ROLES[role]

    const { isLight, toggleTheme } = useTheme()

    const navigate = useNavigate()

    const { pathname } = useLocation()


    const matches = (to) =>
        pathname === to || pathname.startsWith(to + "/")


    const isActive = (item) => {

        if (item.to && matches(item.to)) {
            return true
        }

        if (item.match) {
            return item.match.some(matches)
        }

        return false

    }


    /* navigate and, on mobile, close the drawer — calling the
       close handler directly also covers tapping the already
       active item (where the route, and thus the auto-close
       route effect, would not change) */

    const go = (to) => {
        navigate(to)
        onCloseMobile?.()
    }


    return (
        <aside
            className={
                "sidebar" +
                (collapsed ? " collapsed" : "") +
                (mobileOpen ? " mobile-open" : "")
            }
        >

            <button
                className="sidebar-toggle"
                aria-label="Toggle sidebar"
                onClick={onToggleCollapse}
            >
                <i className={"fa-solid " + (collapsed ? "fa-chevron-right" : "fa-chevron-left")}></i>
            </button>

            <button
                className="theme-toggle"
                aria-label="Toggle theme"
                onClick={toggleTheme}
            >
                <i className={"fa-solid " + (isLight ? "fa-sun" : "fa-moon")}></i>
            </button>


            <div className="logo">
                🩺 Medico
            </div>


            <ul>

                {config.nav.map(item => (
                    <li
                        key={item.to || item.label}
                        className={isActive(item) ? "active" : undefined}
                        data-tooltip={item.tooltip}
                        onClick={item.to ? () => go(item.to) : undefined}
                    >
                        <i className={"fa-solid " + item.icon}></i>
                        <span>{item.label}</span>
                    </li>
                ))}

            </ul>


            <button
                className="logout"
                onClick={() => go("/login")}
            >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Logout</span>
            </button>

        </aside>
    )

}
