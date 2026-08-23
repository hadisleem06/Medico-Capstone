/*
    Account seed data + storage helpers.

    Backs the (new) My Profile and Settings pages. There were no
    such pages in the original static demo — the profile-menu
    "My Profile" / "Settings" items were inert — so this is the
    one place in the app without an original file to mirror. It
    still follows the project's data/seam split:

      - the DEFAULTS below are seed data (the profile identity is
        derived from ROLES so the topbar / profile menu and this
        page always agree), and
      - reads are SYNCHRONOUS for initial render (no loading
        state), merging any persisted overrides from localStorage
        on top of the defaults — matching how every other page
        reads src/data.

    Only writes go through the async seam (see api/accountService.js),
    which calls the persist helpers here after its fake delay. All
    localStorage access lives here so the storage shape is defined
    in exactly one place, and every access is guarded (private
    mode / quota / disabled storage all throw).
*/

import { ROLES } from "./roles"


/* per-role contact / bio fields the ROLES identity does not carry */

const PROFILE_EXTRAS = {

    doctor: {
        email: "sarah.mitchell@medico.health",
        phone: "+961 71 234 567",
        location: "Beirut, Lebanon",
        bio: "Board-certified cardiologist focused on preventive care and AI-assisted diagnostics.",
    },

    nurse: {
        email: "sarah.n@medico.health",
        phone: "+961 76 000 002",
        location: "Beirut, Lebanon",
        bio: "Registered nurse coordinating triage, vitals and the daily patient queue.",
    },

    admin: {
        email: "hadi@medico.health",
        phone: "+961 70 100 100",
        location: "Beirut, Lebanon",
        bio: "Platform administrator managing users, access and system audit trails.",
    },

}


/* the field on this page labelled "professional title" maps to the
   profile-menu header sub-line, so a saved title shows up there too */

const TITLE_LABEL = {
    doctor: "Specialty",
    nurse: "Role / Title",
    admin: "Title",
}


/* the editable subset that is persisted — everything else on the
   profile object (variant, menu, ...) always comes fresh from ROLES
   so code changes to the chrome are never shadowed by old storage */

const PERSISTED_PROFILE_KEYS = [
    "avatar",
    "name",
    "sub",
    "header",
    "email",
    "phone",
    "location",
    "bio",
]


/* =========================================================
   SETTINGS DEFAULTS + OPTION LISTS
========================================================= */

/* theme is intentionally NOT stored here — it is owned by
   ThemeContext (localStorage["theme"]) and applied live, exactly
   as the sidebar toggle already does */

export const defaultSettings = {

    language: "en",

    timezone: "Asia/Beirut",

    compactMode: false,

    soundAlerts: true,

    twoFactor: false,

    notifications: {
        email: true,
        sms: false,
        push: true,
        criticalAlerts: true,
    },

}


export const languageOptions = [
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "ar", label: "العربية" },
    { value: "es", label: "Español" },
]


export const timezoneOptions = [
    { value: "Asia/Beirut",      label: "Beirut · GMT+3" },
    { value: "Europe/London",    label: "London · GMT+0" },
    { value: "Europe/Paris",     label: "Paris · GMT+1" },
    { value: "America/New_York", label: "New York · GMT−5" },
    { value: "Asia/Dubai",       label: "Dubai · GMT+4" },
    { value: "Asia/Kolkata",     label: "Kolkata · GMT+5:30" },
]


/* =========================================================
   DEFAULT PROFILE (ROLES identity + contact extras)
========================================================= */

export function titleLabel(role) {
    return TITLE_LABEL[role] || "Title"
}


export function buildDefaultProfile(role) {

    const base = ROLES[role] ? ROLES[role].profile : null

    if (!base) {
        return null
    }

    const extras = PROFILE_EXTRAS[role] || {}


    /* clone the nested header so callers never mutate ROLES */

    return {
        ...base,
        header: { ...base.header },
        ...extras,
    }

}


/* =========================================================
   STORAGE KEYS + GUARDED ACCESS
========================================================= */

function profileKey(role) {
    return `medico:account:${role}:profile`
}


function settingsKey(role) {
    return `medico:account:${role}:settings`
}


function readJson(key) {

    try {

        const raw = localStorage.getItem(key)

        return raw ? JSON.parse(raw) : null

    }
    catch {

        return null

    }

}


function writeJson(key, value) {

    try {

        localStorage.setItem(key, JSON.stringify(value))

        return true

    }
    catch {

        return false

    }

}


/* =========================================================
   PROFILE READ / WRITE
========================================================= */

export function readStoredProfile(role) {

    const base = buildDefaultProfile(role)

    if (!base) {
        return null
    }

    const stored = readJson(profileKey(role))

    if (!stored) {
        return base
    }


    /* merge the persisted editable subset over the fresh default,
       merging the nested header explicitly */

    return {
        ...base,
        ...stored,
        header: {
            ...base.header,
            ...(stored.header || {}),
        },
    }

}


export function writeStoredProfile(role, profile) {

    const subset = {}

    PERSISTED_PROFILE_KEYS.forEach(key => {

        if (profile[key] !== undefined) {
            subset[key] = profile[key]
        }

    })

    return writeJson(profileKey(role), subset)

}


/* =========================================================
   SETTINGS READ / WRITE
========================================================= */

export function readStoredSettings(role) {

    const stored = readJson(settingsKey(role))

    if (!stored) {
        return { ...defaultSettings, notifications: { ...defaultSettings.notifications } }
    }


    /* deep-merge notifications so a new default toggle is never
       lost just because older storage predates it */

    return {
        ...defaultSettings,
        ...stored,
        notifications: {
            ...defaultSettings.notifications,
            ...(stored.notifications || {}),
        },
    }

}


export function writeStoredSettings(role, settings) {

    return writeJson(settingsKey(role), settings)

}
