import { useEffect, useState } from "react"

import { Outlet, useLocation } from "react-router-dom"

import { RoleProvider } from "../../context/RoleContext"

import { AccountProvider } from "../../context/AccountContext"

import { useSidebarCollapse } from "../../hooks/useSidebarCollapse"

import { useGlassGlow } from "../../hooks/useGlassGlow"

import AuroraBackground from "./AuroraBackground"

import Sidebar from "./Sidebar"


/*
    AppLayout — the persistent chrome for a role area.

    Reproduces the original body structure:

        .aurora
        .dashboard#dashboard
            aside.sidebar
            main.main-content   (topbar + page are rendered here)

    Each page renders its own <Topbar/> as the first child of
    the Outlet, exactly as the original hand-authored it at the
    top of every page's main area.

    Global behaviours from global.js live here:
      - sidebar collapse (.collapsed on sidebar + main-content)
      - glass mouse-glow (delegated, all .premium-glass/.ai-card)
      - card entrance stagger (re-run per navigation)

    Mobile drawer (React-specific, not in the original):
      the original responsive.css slides the sidebar off-canvas
      at <=900px and reveals it with a ".mobile-open" class — but
      the port never had anything that added that class, so
      navigation was unreachable on phones/tablets. We add the
      missing piece here: a floating hamburger + backdrop toggle
      ".mobile-open", the drawer closes on route change or backdrop
      tap, and body scroll is locked while it is open. On desktop
      (>900px) the hamburger/backdrop are display:none, so the
      original layout is untouched.
*/

export default function AppLayout({ role }) {

    const { collapsed, toggle } = useSidebarCollapse()

    const [mobileOpen, setMobileOpen] = useState(false)

    const { pathname } = useLocation()


    useGlassGlow()


    /* close the mobile drawer whenever the route changes */

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])


    /* lock background scroll while the mobile drawer is open */

    useEffect(() => {

        if (!mobileOpen) {
            return
        }

        const previous = document.body.style.overflow

        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = previous
        }

    }, [mobileOpen])


    /* CARD ENTRANCE ANIMATION (global.js, re-run per page) */

    useEffect(() => {

        const cards = document.querySelectorAll(
            ".stat-card, " +
            ".appointment-card, " +
            ".ai-card, " +
            ".health-overview"
        )

        const timers = []

        cards.forEach((card, index) => {

            card.style.opacity = "0"
            card.style.transform = "translateY(30px)"

            const timer = window.setTimeout(() => {

                card.style.transition =
                    "opacity .7s ease, transform .7s ease"

                card.style.opacity = "1"
                card.style.transform = "translateY(0)"

            }, index * 100)

            timers.push(timer)

        })

        return () => timers.forEach(window.clearTimeout)

    }, [pathname])


    return (
        <RoleProvider role={role}>
            <AccountProvider role={role}>

                <AuroraBackground />

                <div className="dashboard" id="dashboard">

                    <button
                        className={"mobile-menu-btn" + (mobileOpen ? " hidden" : "")}
                        aria-label="Open navigation menu"
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen(true)}
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                    <div
                        className={"sidebar-backdrop" + (mobileOpen ? " show" : "")}
                        onClick={() => setMobileOpen(false)}
                        aria-hidden="true"
                    ></div>

                    <Sidebar
                        role={role}
                        collapsed={collapsed}
                        onToggleCollapse={toggle}
                        mobileOpen={mobileOpen}
                        onCloseMobile={() => setMobileOpen(false)}
                    />

                    <main className={"main-content" + (collapsed ? " collapsed" : "")}>
                        <Outlet />
                    </main>

                </div>

            </AccountProvider>
        </RoleProvider>
    )

}
