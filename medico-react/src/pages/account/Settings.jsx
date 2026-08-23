import { useRef, useState } from "react"

import Topbar from "../../components/layout/Topbar"

import { useAccount } from "../../context/AccountContext"

import { useTheme } from "../../context/ThemeContext"

import { useRoleToast } from "../../hooks/useRoleToast"

import { languageOptions, timezoneOptions } from "../../data/account"


/*
    Settings — manage workspace preferences.

    Like My Profile this has no original-demo equivalent (the
    menu item was inert) and is shared across all three chrome
    areas via context; the role only decides which toast skin a
    save fires.

    Two independent save paths, matching how the concerns differ:

      - Preferences (appearance / notifications / language /
        two-factor) are STAGED in a local draft and committed as
        one batch through the async saveSettings seam, off which
        the Save button spins.

      - Theme is deliberately NOT part of that batch: it is owned
        by ThemeContext (localStorage["theme"]) and applies LIVE
        the instant you pick it, exactly like the sidebar toggle.

      - Password change is a self-contained mock form with its own
        validation and button — there is no password in the data
        model to persist, so it validates and toasts only (the
        same synchronous-mock pattern the ported pages use).
*/


const MIN_PASSWORD = 8


/* DOM order of the password fields — drives which error focuses */

const PW_ORDER = [
    "current",
    "next",
    "confirm",
]


/* --------------------------------------------------------------
   Switch — accessible on/off control (styled in account.css)
-------------------------------------------------------------- */

function Switch({ id, checked, onChange }) {

    return (
        <button
            type="button"
            role="switch"
            id={id}
            aria-checked={checked}
            className={"account-switch" + (checked ? " on" : "")}
            onClick={() => onChange(!checked)}
        >
            <span className="account-switch-knob"></span>
        </button>
    )

}


export default function Settings() {

    const { settings, saveSettings } = useAccount()

    const { isLight, toggleTheme } = useTheme()

    const notify = useRoleToast()


    /* ---- staged preference draft ---- */

    function buildDraft() {

        return {
            ...settings,
            notifications: { ...settings.notifications },
        }

    }


    const [draft, setDraft] = useState(buildDraft)

    const [saving, setSaving] = useState(false)


    function setSetting(key, value) {
        setDraft(current => ({ ...current, [key]: value }))
    }


    function setNotification(key, value) {

        setDraft(current => ({
            ...current,
            notifications: {
                ...current.notifications,
                [key]: value,
            },
        }))

    }


    /* ---- save the whole preference batch (async seam) ---- */

    function handleSave() {

        if (saving) {
            return
        }

        setSaving(true)

        saveSettings(draft)
            .then(() => {

                setSaving(false)

                notify({
                    title: "Settings saved",
                    message: "Your preferences have been updated.",
                    icon: "fa-circle-check",
                    type: "success",
                })

            })
            .catch(() => {

                setSaving(false)

                notify({
                    title: "Save failed",
                    message: "Something went wrong. Please try again.",
                    icon: "fa-triangle-exclamation",
                    type: "error",
                })

            })

    }


    /* ---- reset staged prefs back to the saved values ---- */

    function handleReset() {

        setDraft(buildDraft())

    }


    /* ---- password change (self-contained mock form) ---- */

    const [pw, setPw] = useState({
        current: "",
        next: "",
        confirm: "",
    })

    const [pwErrors, setPwErrors] = useState({})

    const pwFormRef = useRef(null)


    function setPwField(name, value) {

        setPw(current => ({ ...current, [name]: value }))

        setPwErrors(current => {

            if (!current[name]) {
                return current
            }

            const next = { ...current }

            delete next[name]

            return next

        })

    }


    function handlePasswordSubmit(event) {

        event.preventDefault()


        const next = {}


        if (!pw.current) {
            next.current = "Enter your current password."
        }


        if (!pw.next) {
            next.next = "Enter a new password."
        }
        else if (pw.next.length < MIN_PASSWORD) {
            next.next = `Use at least ${MIN_PASSWORD} characters.`
        }
        else if (pw.next === pw.current) {
            next.next = "Choose a password different from the current one."
        }


        if (!pw.confirm) {
            next.confirm = "Confirm your new password."
        }
        else if (pw.next && pw.confirm !== pw.next) {
            next.confirm = "Passwords do not match."
        }


        setPwErrors(next)


        const firstError = PW_ORDER.find(name => next[name])

        if (firstError) {

            const field =
                pwFormRef.current &&
                pwFormRef.current.elements[firstError]

            if (field) {
                field.focus()
            }

            notify({
                title: "Check your password",
                message: "Please correct the highlighted fields.",
                icon: "fa-triangle-exclamation",
                type: "error",
            })

            return

        }


        setPw({ current: "", next: "", confirm: "" })

        setPwErrors({})

        notify({
            title: "Password updated",
            message: "Your password has been changed.",
            icon: "fa-circle-check",
            type: "success",
        })

    }


    return (
        <>

            <Topbar title="Settings" />


            {/* =================================================
                 HERO
            ================================================== */}

            <section className="page-hero account-hero">

                <div className="page-hero-content">

                    <span className="page-eyebrow">
                        <i className="fa-solid fa-gear"></i>
                        PREFERENCES
                    </span>

                    <h1>
                        Tune your{" "}
                        <span>workspace.</span>
                    </h1>

                    <p>
                        Choose how the app looks, when it notifies you
                        and how your account stays secure.
                    </p>

                </div>

                <div className="page-hero-visual">
                    <i className="fa-solid fa-sliders page-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 APPEARANCE
            ================================================== */}

            <section className="premium-glass account-card">

                <div className="account-card-head">

                    <div className="account-card-icon">
                        <i className="fa-solid fa-palette"></i>
                    </div>

                    <div>

                        <span className="account-card-kicker">
                            APPEARANCE
                        </span>

                        <h2>
                            Look & feel
                        </h2>

                        <p>
                            Theme changes apply instantly.
                        </p>

                    </div>

                </div>


                {/* THEME (live via ThemeContext) */}

                <div className="account-toggle-row">

                    <div className="account-toggle-copy">
                        <strong>Theme</strong>
                        <span>Switch between the dark and light interface.</span>
                    </div>

                    <div className="account-segment">

                        <button
                            type="button"
                            className={"account-segment-btn" + (!isLight ? " active" : "")}
                            onClick={() => { if (isLight) toggleTheme() }}
                        >
                            <i className="fa-solid fa-moon"></i>
                            Dark
                        </button>

                        <button
                            type="button"
                            className={"account-segment-btn" + (isLight ? " active" : "")}
                            onClick={() => { if (!isLight) toggleTheme() }}
                        >
                            <i className="fa-solid fa-sun"></i>
                            Light
                        </button>

                    </div>

                </div>


                {/* COMPACT MODE (staged) */}

                <div className="account-toggle-row">

                    <div className="account-toggle-copy">
                        <strong>Compact mode</strong>
                        <span>Tighten spacing to fit more on screen.</span>
                    </div>

                    <Switch
                        id="compactMode"
                        checked={draft.compactMode}
                        onChange={value => setSetting("compactMode", value)}
                    />

                </div>


                {/* SOUND ALERTS (staged) */}

                <div className="account-toggle-row">

                    <div className="account-toggle-copy">
                        <strong>Sound alerts</strong>
                        <span>Play a chime for important events.</span>
                    </div>

                    <Switch
                        id="soundAlerts"
                        checked={draft.soundAlerts}
                        onChange={value => setSetting("soundAlerts", value)}
                    />

                </div>

            </section>


            {/* =================================================
                 NOTIFICATIONS
            ================================================== */}

            <section className="premium-glass account-card">

                <div className="account-card-head">

                    <div className="account-card-icon">
                        <i className="fa-solid fa-bell"></i>
                    </div>

                    <div>

                        <span className="account-card-kicker">
                            NOTIFICATIONS
                        </span>

                        <h2>
                            How we reach you
                        </h2>

                        <p>
                            Pick the channels you want to hear from.
                        </p>

                    </div>

                </div>


                <div className="account-toggle-row">

                    <div className="account-toggle-copy">
                        <strong>Email</strong>
                        <span>Summaries and account updates by email.</span>
                    </div>

                    <Switch
                        id="notifyEmail"
                        checked={draft.notifications.email}
                        onChange={value => setNotification("email", value)}
                    />

                </div>


                <div className="account-toggle-row">

                    <div className="account-toggle-copy">
                        <strong>SMS</strong>
                        <span>Text messages for time-sensitive items.</span>
                    </div>

                    <Switch
                        id="notifySms"
                        checked={draft.notifications.sms}
                        onChange={value => setNotification("sms", value)}
                    />

                </div>


                <div className="account-toggle-row">

                    <div className="account-toggle-copy">
                        <strong>Push</strong>
                        <span>In-app and browser push notifications.</span>
                    </div>

                    <Switch
                        id="notifyPush"
                        checked={draft.notifications.push}
                        onChange={value => setNotification("push", value)}
                    />

                </div>


                <div className="account-toggle-row">

                    <div className="account-toggle-copy">
                        <strong>Critical alerts</strong>
                        <span>Always notify me for urgent clinical events.</span>
                    </div>

                    <Switch
                        id="notifyCritical"
                        checked={draft.notifications.criticalAlerts}
                        onChange={value => setNotification("criticalAlerts", value)}
                    />

                </div>

            </section>


            {/* =================================================
                 LANGUAGE & REGION
            ================================================== */}

            <section className="premium-glass account-card">

                <div className="account-card-head">

                    <div className="account-card-icon">
                        <i className="fa-solid fa-globe"></i>
                    </div>

                    <div>

                        <span className="account-card-kicker">
                            LANGUAGE & REGION
                        </span>

                        <h2>
                            Locale
                        </h2>

                        <p>
                            Set your language and time zone.
                        </p>

                    </div>

                </div>


                <div className="account-field-grid">

                    {/* LANGUAGE */}

                    <div className="account-field">

                        <label htmlFor="language">
                            Language
                        </label>

                        <div className="account-input">

                            <i className="fa-solid fa-language"></i>

                            <select
                                id="language"
                                value={draft.language}
                                onChange={event => setSetting("language", event.target.value)}
                            >

                                {languageOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}

                            </select>

                            <i className="fa-solid fa-chevron-down account-select-caret"></i>

                        </div>

                    </div>


                    {/* TIMEZONE */}

                    <div className="account-field">

                        <label htmlFor="timezone">
                            Time Zone
                        </label>

                        <div className="account-input">

                            <i className="fa-solid fa-clock"></i>

                            <select
                                id="timezone"
                                value={draft.timezone}
                                onChange={event => setSetting("timezone", event.target.value)}
                            >

                                {timezoneOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}

                            </select>

                            <i className="fa-solid fa-chevron-down account-select-caret"></i>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                 SECURITY
            ================================================== */}

            <section className="premium-glass account-card">

                <div className="account-card-head">

                    <div className="account-card-icon">
                        <i className="fa-solid fa-shield-halved"></i>
                    </div>

                    <div>

                        <span className="account-card-kicker">
                            SECURITY
                        </span>

                        <h2>
                            Account security
                        </h2>

                        <p>
                            Add a second factor and keep your password
                            fresh.
                        </p>

                    </div>

                </div>


                {/* TWO-FACTOR (staged) */}

                <div className="account-toggle-row">

                    <div className="account-toggle-copy">
                        <strong>Two-factor authentication</strong>
                        <span>Require a one-time code at sign in.</span>
                    </div>

                    <Switch
                        id="twoFactor"
                        checked={draft.twoFactor}
                        onChange={value => setSetting("twoFactor", value)}
                    />

                </div>


                <hr className="account-divider" />


                {/* CHANGE PASSWORD (own mock form + button) */}

                <form
                    className="account-password"
                    ref={pwFormRef}
                    onSubmit={handlePasswordSubmit}
                    noValidate
                >

                    <span className="account-subhead">
                        Change password
                    </span>


                    <div className="account-field-grid">

                        {/* CURRENT */}

                        <div className={"account-field full" + (pwErrors.current ? " has-error" : "")}>

                            <label htmlFor="current">
                                Current Password
                            </label>

                            <div className="account-input">

                                <i className="fa-solid fa-lock"></i>

                                <input
                                    type="password"
                                    id="current"
                                    name="current"
                                    autoComplete="current-password"
                                    placeholder="Enter current password"
                                    value={pw.current}
                                    onChange={event => setPwField("current", event.target.value)}
                                />

                            </div>

                            <small className="field-error">
                                {pwErrors.current || ""}
                            </small>

                        </div>


                        {/* NEW */}

                        <div className={"account-field" + (pwErrors.next ? " has-error" : "")}>

                            <label htmlFor="next">
                                New Password
                            </label>

                            <div className="account-input">

                                <i className="fa-solid fa-key"></i>

                                <input
                                    type="password"
                                    id="next"
                                    name="next"
                                    autoComplete="new-password"
                                    placeholder="At least 8 characters"
                                    value={pw.next}
                                    onChange={event => setPwField("next", event.target.value)}
                                />

                            </div>

                            <small className="field-error">
                                {pwErrors.next || ""}
                            </small>

                        </div>


                        {/* CONFIRM */}

                        <div className={"account-field" + (pwErrors.confirm ? " has-error" : "")}>

                            <label htmlFor="confirm">
                                Confirm New Password
                            </label>

                            <div className="account-input">

                                <i className="fa-solid fa-key"></i>

                                <input
                                    type="password"
                                    id="confirm"
                                    name="confirm"
                                    autoComplete="new-password"
                                    placeholder="Re-enter new password"
                                    value={pw.confirm}
                                    onChange={event => setPwField("confirm", event.target.value)}
                                />

                            </div>

                            <small className="field-error">
                                {pwErrors.confirm || ""}
                            </small>

                        </div>

                    </div>


                    <div className="account-password-actions">

                        <button
                            type="submit"
                            className="account-ghost-btn"
                        >
                            <i className="fa-solid fa-key"></i>
                            Update password
                        </button>

                    </div>

                </form>

            </section>


            {/* =================================================
                 SAVE (preferences batch)
            ================================================== */}

            <div className="account-actions">

                <button
                    type="button"
                    className="account-ghost-btn"
                    onClick={handleReset}
                    disabled={saving}
                >
                    Reset
                </button>

                <button
                    type="button"
                    className="primary-btn"
                    onClick={handleSave}
                    disabled={saving}
                >

                    {saving ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-floppy-disk"></i>
                            Save changes
                        </>
                    )}

                </button>

            </div>

        </>
    )

}
