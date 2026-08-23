import { useState } from "react"

import Topbar from "../../components/layout/Topbar"

import { useToast } from "../../context/ToastContext"


/*
    Register Patient — faithful port of
    pages/nurse/register-patient.html + the register half of
    assets/js/nurse.js.

    Validation is reproduced byte-for-byte: the same six checked
    fields, the same regexes, the same messages, and the same
    flow — on submit, clear every field error, re-run the checks,
    and on any failure focus the first errored field (DOM order:
    first name → last name → DOB → gender → phone → email) and
    toast "Please correct the highlighted fields."; on success mint
    a random "PT-####" id, toast the confirmation, reset the form
    and clear errors. Editing a field clears its own error live
    (the original bound input + change; React's onChange covers
    both). The whole thing is synchronous — no service seam.

    The form stays uncontrolled (native reset clears it, exactly
    like the original) — only the six field errors live in state.
    The `required` attributes are kept where the original had them,
    so the browser's native validation fires first for empty
    required fields, identical to the source.
*/


const NAME_PATTERN = /^[A-Za-zÀ-ÿ\s'-]+$/

const PHONE_PATTERN = /^\+?[0-9\s()-]{8,20}$/

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


/* DOM order of the checked fields — drives which one gets focus */

const ERROR_ORDER = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "gender",
    "phone",
    "email",
]


export default function RegisterPatient() {

    const { showNurseMessage } = useToast()

    const [errors, setErrors] = useState({})


    /* ---- submit (ports the validation block) ---- */

    function handleSubmit(event) {

        event.preventDefault()

        const form = event.currentTarget

        const value = name =>
            (form.elements[name] ? form.elements[name].value : "")


        const next = {}


        const firstName = value("firstName").trim()

        if (!firstName) {
            next.firstName = "First name is required."
        }
        else if (!NAME_PATTERN.test(firstName)) {
            next.firstName = "Please enter a valid first name."
        }


        const lastName = value("lastName").trim()

        if (!lastName) {
            next.lastName = "Last name is required."
        }
        else if (!NAME_PATTERN.test(lastName)) {
            next.lastName = "Please enter a valid last name."
        }


        const dateOfBirth = value("dateOfBirth")

        if (!dateOfBirth) {
            next.dateOfBirth = "Date of birth is required."
        }
        else {

            const selectedDate = new Date(dateOfBirth)

            const today = new Date()

            today.setHours(0, 0, 0, 0)

            if (selectedDate > today) {
                next.dateOfBirth = "Date of birth cannot be in the future."
            }

        }


        const gender = value("gender")

        if (!gender) {
            next.gender = "Please select a gender."
        }


        const phoneValue = value("phone").trim()

        if (!phoneValue) {
            next.phone = "Phone number is required."
        }
        else if (!PHONE_PATTERN.test(phoneValue)) {
            next.phone = "Please enter a valid phone number."
        }


        const emailValue = value("email").trim()

        if (emailValue && !EMAIL_PATTERN.test(emailValue)) {
            next.email = "Please enter a valid email address."
        }


        setErrors(next)


        const firstErrorField = ERROR_ORDER.find(name => next[name])

        if (firstErrorField) {

            const field = form.elements[firstErrorField]

            if (field) {
                field.focus()
            }

            showNurseMessage(
                "Please correct the highlighted fields.",
                "error"
            )

            return

        }


        const patientId =
            "PT-" +
            Math.floor(
                1000 +
                Math.random() * 9000
            )


        showNurseMessage(
            `${firstName} ${lastName} registered successfully. Patient ID: #${patientId}`,
            "success"
        )


        form.reset()

        setErrors({})

    }


    /* ---- clear one field's error while editing (live validation) ---- */

    function clearError(name) {

        setErrors(current => {

            if (!current[name]) {
                return current
            }

            const next = { ...current }

            delete next[name]

            return next

        })

    }


    /* ---- clear all errors when the form is reset ---- */

    function handleReset() {

        setErrors({})

    }


    return (
        <>

            <Topbar title="Register Patient" />


            {/* =================================================
                 PAGE HEADER
            ================================================== */}

            <section className="page-hero">

                <div className="page-hero-content">

                    <span className="page-eyebrow">
                        <i className="fa-solid fa-user-plus"></i>
                        PATIENT MANAGEMENT
                    </span>

                    <h1>
                        Welcome new{" "}
                        <span>patients.</span>
                    </h1>

                    <p>
                        Create a new patient record and
                        add them to the clinic system.
                    </p>

                </div>

                <div className="page-hero-visual">
                    <i className="fa-solid fa-user-plus page-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 REGISTRATION FORM
            ================================================== */}

            <section className="patient-register-card premium-glass">

                {/* FORM HEADER */}

                <div className="form-section-header">

                    <div className="form-section-icon">
                        <i className="fa-solid fa-user-plus"></i>
                    </div>

                    <div>

                        <span className="section-label">
                            PATIENT INFORMATION
                        </span>

                        <h2>
                            Personal Details
                        </h2>

                        <p>
                            Enter the patient's information
                            carefully before submitting.
                        </p>

                    </div>

                </div>


                {/* FORM */}

                <form
                    id="registerPatientForm"
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                >

                    {/* =================================================
                         PERSONAL INFORMATION
                    ================================================== */}

                    <div className="form-section">

                        <div className="form-section-title">

                            <i className="fa-solid fa-id-card"></i>

                            <h3>
                                Personal Information
                            </h3>

                        </div>


                        <div className="form-grid">

                            {/* FIRST NAME */}

                            <div className={"form-group" + (errors.firstName ? " has-error" : "")}>

                                <label htmlFor="firstName">
                                    First Name
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-user"></i>

                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Enter first name"
                                        required
                                        onChange={() => clearError("firstName")}
                                    />

                                </div>

                                <small className="field-error">
                                    {errors.firstName || ""}
                                </small>

                            </div>


                            {/* LAST NAME */}

                            <div className={"form-group" + (errors.lastName ? " has-error" : "")}>

                                <label htmlFor="lastName">
                                    Last Name
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-user"></i>

                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Enter last name"
                                        required
                                        onChange={() => clearError("lastName")}
                                    />

                                </div>

                                <small className="field-error">
                                    {errors.lastName || ""}
                                </small>

                            </div>


                            {/* DATE OF BIRTH */}

                            <div className={"form-group" + (errors.dateOfBirth ? " has-error" : "")}>

                                <label htmlFor="dateOfBirth">
                                    Date of Birth
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-calendar"></i>

                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        required
                                        onChange={() => clearError("dateOfBirth")}
                                    />

                                </div>

                                <small className="field-error">
                                    {errors.dateOfBirth || ""}
                                </small>

                            </div>


                            {/* GENDER */}

                            <div className={"form-group" + (errors.gender ? " has-error" : "")}>

                                <label htmlFor="gender">
                                    Gender
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-venus-mars"></i>

                                    <select
                                        id="gender"
                                        name="gender"
                                        required
                                        defaultValue=""
                                        onChange={() => clearError("gender")}
                                    >

                                        <option
                                            value=""
                                            disabled
                                        >
                                            Select gender
                                        </option>

                                        <option value="male">
                                            Male
                                        </option>

                                        <option value="female">
                                            Female
                                        </option>

                                    </select>

                                </div>

                                <small className="field-error">
                                    {errors.gender || ""}
                                </small>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                         CONTACT INFORMATION
                    ================================================== */}

                    <div className="form-section">

                        <div className="form-section-title">

                            <i className="fa-solid fa-address-book"></i>

                            <h3>
                                Contact Information
                            </h3>

                        </div>


                        <div className="form-grid">

                            {/* PHONE */}

                            <div className={"form-group" + (errors.phone ? " has-error" : "")}>

                                <label htmlFor="phone">
                                    Phone Number
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-phone"></i>

                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="+961 XX XXX XXX"
                                        required
                                        onChange={() => clearError("phone")}
                                    />

                                </div>

                                <small className="field-error">
                                    {errors.phone || ""}
                                </small>

                            </div>


                            {/* EMAIL */}

                            <div className={"form-group" + (errors.email ? " has-error" : "")}>

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-envelope"></i>

                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="patient@email.com"
                                        onChange={() => clearError("email")}
                                    />

                                </div>

                                <small className="field-error">
                                    {errors.email || ""}
                                </small>

                            </div>


                            {/* ADDRESS */}

                            <div className="form-group full-width">

                                <label htmlFor="address">
                                    Address
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-location-dot"></i>

                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        placeholder="Enter patient's address"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                         EMERGENCY CONTACT
                    ================================================== */}

                    <div className="form-section">

                        <div className="form-section-title">

                            <i className="fa-solid fa-triangle-exclamation"></i>

                            <h3>
                                Emergency Contact
                            </h3>

                        </div>


                        <div className="form-grid">

                            {/* CONTACT NAME */}

                            <div className="form-group">

                                <label htmlFor="emergencyName">
                                    Contact Name
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-user-shield"></i>

                                    <input
                                        type="text"
                                        id="emergencyName"
                                        name="emergencyName"
                                        placeholder="Full name"
                                    />

                                </div>

                            </div>


                            {/* CONTACT PHONE */}

                            <div className="form-group">

                                <label htmlFor="emergencyPhone">
                                    Contact Phone
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-phone"></i>

                                    <input
                                        type="tel"
                                        id="emergencyPhone"
                                        name="emergencyPhone"
                                        placeholder="+961 XX XXX XXX"
                                    />

                                </div>

                            </div>


                            {/* RELATIONSHIP */}

                            <div className="form-group">

                                <label htmlFor="relationship">
                                    Relationship
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-people-arrows"></i>

                                    <select
                                        id="relationship"
                                        name="relationship"
                                        defaultValue=""
                                    >

                                        <option
                                            value=""
                                            disabled
                                        >
                                            Select relationship
                                        </option>

                                        <option value="parent">
                                            Parent
                                        </option>

                                        <option value="spouse">
                                            Spouse
                                        </option>

                                        <option value="sibling">
                                            Sibling
                                        </option>

                                        <option value="child">
                                            Child
                                        </option>

                                        <option value="relative">
                                            Relative
                                        </option>

                                        <option value="friend">
                                            Friend
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                         MEDICAL INFORMATION
                    ================================================== */}

                    <div className="form-section">

                        <div className="form-section-title">

                            <i className="fa-solid fa-notes-medical"></i>

                            <h3>
                                Medical Information
                            </h3>

                        </div>


                        <div className="form-grid">

                            {/* BLOOD TYPE */}

                            <div className="form-group">

                                <label htmlFor="bloodType">
                                    Blood Type
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-droplet"></i>

                                    <select
                                        id="bloodType"
                                        name="bloodType"
                                        defaultValue=""
                                    >

                                        <option value="">
                                            Select blood type
                                        </option>

                                        <option value="A+">
                                            A+
                                        </option>

                                        <option value="A-">
                                            A-
                                        </option>

                                        <option value="B+">
                                            B+
                                        </option>

                                        <option value="B-">
                                            B-
                                        </option>

                                        <option value="AB+">
                                            AB+
                                        </option>

                                        <option value="AB-">
                                            AB-
                                        </option>

                                        <option value="O+">
                                            O+
                                        </option>

                                        <option value="O-">
                                            O-
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* ALLERGIES */}

                            <div className="form-group">

                                <label htmlFor="allergies">
                                    Known Allergies
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-hand-dots"></i>

                                    <input
                                        type="text"
                                        id="allergies"
                                        name="allergies"
                                        placeholder="e.g. Penicillin"
                                    />

                                </div>

                            </div>


                            {/* MEDICAL HISTORY */}

                            <div className="form-group full-width">

                                <label htmlFor="medicalHistory">
                                    Medical History
                                </label>

                                <textarea
                                    id="medicalHistory"
                                    name="medicalHistory"
                                    rows="4"
                                    placeholder="Enter relevant medical history..."
                                ></textarea>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                         FORM ACTIONS
                    ================================================== */}

                    <div className="form-actions">

                        <button
                            type="reset"
                            className="secondary-btn"
                        >

                            <i className="fa-solid fa-rotate-left"></i>

                            Clear Form

                        </button>


                        <button
                            type="submit"
                            className="primary-btn"
                        >

                            <i className="fa-solid fa-user-plus"></i>

                            Register Patient

                        </button>

                    </div>

                </form>

            </section>

        </>
    )

}
