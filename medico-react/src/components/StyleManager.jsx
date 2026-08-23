import { useLayoutEffect } from "react"

import { useLocation } from "react-router-dom"


/*
    StyleManager

    The original app loaded a DIFFERENT set of stylesheets on
    each page, and the standalone pages (login / landing) did
    NOT load global.css at all. Importing every stylesheet
    globally in React would (a) pollute the auth / landing
    pages with chrome styles they never had and (b) risk
    cross-role collisions on shared generic class names.

    To stay pixel-faithful we reproduce the original loading
    model exactly: this component watches the route and keeps
    the <head> holding precisely the stylesheet set the
    matching original page linked — nothing more.

    Reconciliation is add-before-remove so there is never a
    frame with no CSS while navigating between areas. CSS is
    served verbatim from /public/styles.

    Per-area sets mirror the originals (including link order):
      doctor : global, responsive, doctor        (dashboard.html)
      nurse  : global, nurse, responsive          (dashboard.html)
      admin  : global, admin, responsive          (dashboard.html)
      login  : login                              (login.html — no global)
      landing: landing                            (index.html)
    app-extras.css (arrow nudge + relocated admin toast styles)
    is added on the chrome areas, matching where global.js ran.
*/

const BASE = import.meta.env.BASE_URL


function href(name) {
    return `${BASE}styles/${name}`
}


const CHROME_EXTRAS = "app-extras.css"

const ACCOUNT = "account.css"


const AREA_STYLES = {

    doctor: [
        "global.css",
        "responsive.css",
        "doctor.css",
        CHROME_EXTRAS,
        ACCOUNT,
    ],

    nurse: [
        "global.css",
        "nurse.css",
        "responsive.css",
        CHROME_EXTRAS,
        ACCOUNT,
    ],

    admin: [
        "global.css",
        "admin.css",
        "responsive.css",
        CHROME_EXTRAS,
        ACCOUNT,
    ],

    login: [
        "login.css",
    ],

    register: [
        "login.css",
    ],

    landing: [
        "landing.css",
    ],

    none: [],

}


function areaFromPath(pathname) {

    if (pathname.startsWith("/doctor")) {
        return "doctor"
    }

    if (pathname.startsWith("/nurse")) {
        return "nurse"
    }

    if (pathname.startsWith("/admin")) {
        return "admin"
    }

    if (pathname.startsWith("/login")) {
        return "login"
    }

    if (pathname.startsWith("/register")) {
        return "register"
    }

    if (pathname.startsWith("/forgot-password")) {
        return "login"
    }

    if (pathname === "/") {
        return "landing"
    }

    return "none"

}


export default function StyleManager() {

    const { pathname } = useLocation()


    useLayoutEffect(() => {

        const area = areaFromPath(pathname)

        const wanted = (AREA_STYLES[area] || []).map(href)


        /* add any wanted sheet that is not already present,
           preserving the intended order by appending */

        wanted.forEach(url => {

            const exists = document.querySelector(
                `link[data-managed="true"][href="${url}"]`
            )

            if (!exists) {

                const link = document.createElement("link")

                link.rel = "stylesheet"
                link.href = url
                link.dataset.managed = "true"

                document.head.appendChild(link)

            }

        })


        /* remove managed sheets no longer wanted (after the
           new ones are in, so styling never drops out) */

        const managed = document.querySelectorAll(
            'link[data-managed="true"]'
        )

        managed.forEach(link => {

            if (!wanted.includes(link.getAttribute("href"))) {
                link.remove()
            }

        })

    }, [pathname])


    return null

}
