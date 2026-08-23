import { useRef, useState } from "react"

import Topbar from "../../components/layout/Topbar"

import { useRole } from "../../context/RoleContext"

import { useAccount } from "../../context/AccountContext"

import { useRoleToast } from "../../hooks/useRoleToast"

import { buildDefaultProfile, titleLabel } from "../../data/account"


/*
    My Profile — view / edit the signed-in identity.

    There was no such page in the original static demo (the
    profile-menu "My Profile" item was inert), so this has no
    original file to mirror. It is shared by all three chrome
    areas: the current role comes from context, the field labels
    adapt (titleLabel), and saves fire the role-correct toast.

    It reads and writes the SAME AccountContext the topbar profile
    menu reads, so editing your name / photo / title here updates
    the menu the moment the save resolves.

    Field mapping onto the profile object (see data/account.js):
      full name -> name + header.name
      title     -> header.sub   (+ sub as well for the doctor,
                   whose topbar shows a specialty line)
      email / phone / location / bio -> the contact extras

    The form is controlled so Cancel can snap every field back to
    the last-saved context values. Save goes through the async
    accountService seam (via saveProfile) and drives the button
    spinner off the returned promise, matching the app's other
    fake-latency writes.
*/


/* full name allows a leading title dot ("Dr. Sarah Mitchell"),
   so this is the register-patient name rule plus "." */

const NAME_PATTERN = /^[A-Za-zÀ-ÿ.\s'-]+$/

const PHONE_PATTERN = /^\+?[0-9\s()-]{8,20}$/

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


/* DOM order of the validated fields — drives which errors focus */

const ERROR_ORDER = [
    "fullName",
    "email",
    "phone",
]


/* up to ~2 MB of image; larger files risk the localStorage quota
   once base64-encoded, and the guarded write would drop silently */

const MAX_AVATAR_BYTES = 2 * 1024 * 1024


function assetUrl(path) {

    if (!path) {
        return ""
    }

    if (path.startsWith("http") || path.startsWith("data:")) {
        return path
    }

    return (
        import.meta.env.BASE_URL +
        path.replace(/^\//, "")
    )

}


export default function Profile() {

    const role = useRole()

    const { profile, saveProfile } = useAccount()

    const notify = useRoleToast()


    /* the app-default avatar this role reverts to on "Remove" */

    const defaultAvatar =
        (buildDefaultProfile(role) || {}).avatar || "/images/avatar.png"


    /* ---- build the editable form state from the live profile ---- */

    function buildInitial() {

        return {
            avatar: profile.avatar,
            fullName: profile.name || profile.header.name || "",
            title: profile.sub || profile.header.sub || "",
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            bio: profile.bio || "",
        }

    }


    const [form, setForm] = useState(buildInitial)

    const [errors, setErrors] = useState({})

    const [saving, setSaving] = useState(false)

    const formRef = useRef(null)


    /* ---- one setter for every text field ---- */

    function setField(name, value) {

        setForm(current => ({ ...current, [name]: value }))

        /* clear this field's error live while editing */

        setErrors(current => {

            if (!current[name]) {
                return current
            }

            const next = { ...current }

            delete next[name]

            return next

        })

    }


    /* ---- avatar: read the picked file into a data URL ---- */

    function handleAvatarChange(event) {

        const file =
            event.target.files && event.target.files[0]

        /* let the same file be re-picked later */

        event.target.value = ""

        if (!file) {
            return
        }

        if (!file.type.startsWith("image/")) {

            notify({
                title: "Unsupported file",
                message: "Please choose an image file.",
                icon: "fa-triangle-exclamation",
                type: "error",
            })

            return

        }

        if (file.size > MAX_AVATAR_BYTES) {

            notify({
                title: "Image too large",
                message: "Choose an image up to 2 MB.",
                icon: "fa-triangle-exclamation",
                type: "error",
            })

            return

        }


        const reader = new FileReader()

        reader.onload = () => {
            setForm(current => ({ ...current, avatar: reader.result }))
        }

        reader.readAsDataURL(file)

    }


    /* ---- avatar: drop back to the role default ---- */

    function handleAvatarRemove() {

        setForm(current => ({ ...current, avatar: defaultAvatar }))

    }


    /* ---- validate + save (async seam drives the spinner) ---- */

    function handleSubmit(event) {

        event.preventDefault()

        if (saving) {
            return
        }


        const next = {}


        const fullName = form.fullName.trim()

        if (!fullName) {
            next.fullName = "Full name is required."
        }
        else if (!NAME_PATTERN.test(fullName)) {
            next.fullName = "Please enter a valid name."
        }


        const email = form.email.trim()

        if (!email) {
            next.email = "Email is required."
        }
        else if (!EMAIL_PATTERN.test(email)) {
            next.email = "Please enter a valid email address."
        }


        const phone = form.phone.trim()

        if (phone && !PHONE_PATTERN.test(phone)) {
            next.phone = "Please enter a valid phone number."
        }


        setErrors(next)


        const firstError = ERROR_ORDER.find(name => next[name])

        if (firstError) {

            const field =
                formRef.current &&
                formRef.current.elements[firstError]

            if (field) {
                field.focus()
            }

            notify({
                title: "Check your details",
                message: "Please correct the highlighted fields.",
                icon: "fa-triangle-exclamation",
                type: "error",
            })

            return

        }


        const title = form.title.trim()


        /* preserve everything not edited here (variant, menu, ...)
           and fold the edited fields on top */

        const updated = {
            ...profile,
            avatar: form.avatar,
            name: fullName,
            email,
            phone,
            location: form.location.trim(),
            bio: form.bio.trim(),
            header: {
                ...profile.header,
                name: fullName,
                sub: title,
            },
        }

        if (role === "doctor") {
            updated.sub = title
        }


        setSaving(true)

        saveProfile(updated)
            .then(() => {

                setSaving(false)

                notify({
                    title: "Profile updated",
                    message: "Your profile changes have been saved.",
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


    /* ---- Cancel: snap every field back to the saved values ---- */

    function handleCancel() {

        setForm(buildInitial())

        setErrors({})

    }


    const avatarSrc = assetUrl(form.avatar)


    return (
        <>

            <Topbar title="My Profile" />


            {/* =================================================
                 HERO
            ================================================== */}

            <section className="page-hero account-hero">

                <div className="page-hero-content">

                    <span className="page-eyebrow">
                        <i className="fa-solid fa-id-badge"></i>
                        ACCOUNT
                    </span>

                    <h1>
                        Manage your{" "}
                        <span>profile.</span>
                    </h1>

                    <p>
                        Update your photo, contact details and the
                        title that shows across your workspace.
                    </p>

                </div>

                <div className="page-hero-visual">
                    <i className="fa-solid fa-id-badge page-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 PROFILE FORM
            ================================================== */}

            <form
                className="account-form"
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
            >

                {/* -------- PHOTO -------- */}

                <section className="premium-glass account-card">

                    <div className="account-card-head">

                        <div className="account-card-icon">
                            <i className="fa-solid fa-camera"></i>
                        </div>

                        <div>

                            <span className="account-card-kicker">
                                PROFILE PHOTO
                            </span>

                            <h2>
                                Your photo
                            </h2>

                            <p>
                                Shown in the top bar and profile menu.
                            </p>

                        </div>

                    </div>


                    <div className="account-avatar-row">

                        <img
                            className="account-avatar"
                            src={avatarSrc}
                            alt="Profile photo"
                        />

                        <div className="account-avatar-actions">

                            <label className="primary-btn account-upload">

                                <i className="fa-solid fa-arrow-up-from-bracket"></i>

                                Change photo

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    hidden
                                />

                            </label>

                            <button
                                type="button"
                                className="account-ghost-btn"
                                onClick={handleAvatarRemove}
                            >
                                <i className="fa-solid fa-trash-can"></i>
                                Remove
                            </button>

                            <p className="account-hint">
                                JPG or PNG, up to 2&nbsp;MB.
                            </p>

                        </div>

                    </div>

                </section>


                {/* -------- PERSONAL INFORMATION -------- */}

                <section className="premium-glass account-card">

                    <div className="account-card-head">

                        <div className="account-card-icon">
                            <i className="fa-solid fa-user"></i>
                        </div>

                        <div>

                            <span className="account-card-kicker">
                                PERSONAL INFORMATION
                            </span>

                            <h2>
                                Your details
                            </h2>

                            <p>
                                These appear on your account and across
                                the workspace chrome.
                            </p>

                        </div>

                    </div>


                    <div className="account-field-grid">

                        {/* FULL NAME */}

                        <div className={"account-field full" + (errors.fullName ? " has-error" : "")}>

                            <label htmlFor="fullName">
                                Full Name
                            </label>

                            <div className="account-input">

                                <i className="fa-solid fa-user"></i>

                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    value={form.fullName}
                                    onChange={event => setField("fullName", event.target.value)}
                                />

                            </div>

                            <small className="field-error">
                                {errors.fullName || ""}
                            </small>

                        </div>


                        {/* TITLE / SPECIALTY (label adapts per role) */}

                        <div className="account-field full">

                            <label htmlFor="title">
                                {titleLabel(role)}
                            </label>

                            <div className="account-input">

                                <i className="fa-solid fa-briefcase-medical"></i>

                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder={`Enter your ${titleLabel(role).toLowerCase()}`}
                                    value={form.title}
                                    onChange={event => setField("title", event.target.value)}
                                />

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className={"account-field" + (errors.email ? " has-error" : "")}>

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className="account-input">

                                <i className="fa-solid fa-envelope"></i>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@medico.health"
                                    value={form.email}
                                    onChange={event => setField("email", event.target.value)}
                                />

                            </div>

                            <small className="field-error">
                                {errors.email || ""}
                            </small>

                        </div>


                        {/* PHONE */}

                        <div className={"account-field" + (errors.phone ? " has-error" : "")}>

                            <label htmlFor="phone">
                                Phone Number
                            </label>

                            <div className="account-input">

                                <i className="fa-solid fa-phone"></i>

                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="+961 XX XXX XXX"
                                    value={form.phone}
                                    onChange={event => setField("phone", event.target.value)}
                                />

                            </div>

                            <small className="field-error">
                                {errors.phone || ""}
                            </small>

                        </div>


                        {/* LOCATION */}

                        <div className="account-field full">

                            <label htmlFor="location">
                                Location
                            </label>

                            <div className="account-input">

                                <i className="fa-solid fa-location-dot"></i>

                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    placeholder="City, Country"
                                    value={form.location}
                                    onChange={event => setField("location", event.target.value)}
                                />

                            </div>

                        </div>


                        {/* BIO */}

                        <div className="account-field full">

                            <label htmlFor="bio">
                                About
                            </label>

                            <textarea
                                id="bio"
                                name="bio"
                                rows="4"
                                maxLength="500"
                                placeholder="A short line about your work..."
                                value={form.bio}
                                onChange={event => setField("bio", event.target.value)}
                            ></textarea>

                        </div>

                    </div>

                </section>


                {/* -------- ACTIONS -------- */}

                <div className="account-actions">

                    <button
                        type="button"
                        className="account-ghost-btn"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-btn"
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

            </form>

        </>
    )

}
