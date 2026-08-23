import { useMemo, useState } from "react"

import Topbar from "../../components/layout/Topbar"

import Modal from "../../components/ui/Modal"

import FilterDropdown from "../../components/ui/FilterDropdown"

import { useToast } from "../../context/ToastContext"

import { appointmentService } from "../../api/appointmentService"

import {
    doctorAppointments,
    appointmentStatusBadge,
    appointmentDotClass,
    appointmentStatusOptions,
    appointmentDateOptions,
    appointmentPatientOptions,
    appointmentTypeOptions,
    appointmentDurationOptions,
} from "../../data/appointments"


/* =========================================================
   DATE / TIME FORMATTING
   ( ports formatAppointmentDate / formatAppointmentTime )
========================================================= */

function formatAppointmentDate(dateString) {

    if (!dateString) {
        return ""
    }

    const date =
        new Date(dateString + "T00:00:00")

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    )

}


function formatAppointmentTime(timeString) {

    if (!timeString) {
        return ""
    }

    const [hours, minutes] =
        timeString.split(":")

    const date = new Date()

    date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    )

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit",
        }
    )

}


/* =========================================================
   APPOINTMENTS PAGE
========================================================= */

export default function Appointments() {

    const { showDoctorToast } = useToast()


    /* ---- filters ---- */

    const [statusValue, setStatusValue] = useState("")

    const [dateValue, setDateValue] = useState("")


    /* ---- per-card "start consultation" state ---- */

    const [startState, setStartState] = useState({})


    /* ---- modal + form ---- */

    const [modalOpen, setModalOpen] = useState(false)

    const [patient, setPatient] = useState("")

    const [date, setDate] = useState("")

    const [time, setTime] = useState("")

    const [type, setType] = useState("")

    const [duration, setDuration] = useState("30")

    const [notes, setNotes] = useState("")

    const [scheduling, setScheduling] = useState(false)


    /* minimum selectable date = today (ports the dateInput.min) */

    const todayISO = useMemo(
        () => {

            const today = new Date()

            const year = today.getFullYear()

            const month =
                String(today.getMonth() + 1).padStart(2, "0")

            const day =
                String(today.getDate()).padStart(2, "0")

            return `${year}-${month}-${day}`

        },
        []
    )


    /* ---- derived: visible cards (ports applyAppointmentFilters) ---- */

    const visible = doctorAppointments.filter(appointment =>

        (!statusValue || appointment.status === statusValue) &&
        (!dateValue || appointment.date === dateValue)

    )


    /* ---- derived: live modal summary (ports updateAppointmentSummary) ---- */

    const summary = (() => {

        if (!patient && !date && !time) {
            return "Select a patient, date and time"
        }

        const parts = []

        if (patient) {
            parts.push(patient)
        }

        if (date) {
            parts.push(formatAppointmentDate(date))
        }

        if (time) {
            parts.push(formatAppointmentTime(time))
        }

        if (type) {
            parts.push(type)
        }

        if (duration) {
            parts.push(`${duration} min`)
        }

        return parts.join(" · ")

    })()


    /* ---- start consultation (ports initAppointmentStartButtons) ---- */

    function handleStart(appointment) {

        setStartState(current => ({
            ...current,
            [appointment.id]: "starting",
        }))

        setTimeout(
            () => {

                setStartState(current => ({
                    ...current,
                    [appointment.id]: "started",
                }))

                console.log(
                    "Starting consultation for:",
                    appointment.patient
                )

            },
            800
        )

    }


    /* ---- submit (ports the appointmentForm submit) ---- */

    function handleSubmit(event) {

        event.preventDefault()

        const form = event.currentTarget

        if (!patient || !type || !date || !time) {
            form.reportValidity()
            return
        }

        setScheduling(true)

        appointmentService
            .create({ patient, type, date, time, duration, notes })
            .then(() => {

                setScheduling(false)

                /* reset (ports form.reset) */

                setPatient("")
                setDate("")
                setTime("")
                setType("")
                setDuration("30")
                setNotes("")

                setModalOpen(false)

                showDoctorToast(
                    "Appointment scheduled",
                    `${patient} · ` +
                        `${formatAppointmentDate(date)} · ` +
                        `${formatAppointmentTime(time)}`,
                    "fa-check"
                )

            })

    }


    return (
        <>

            <Topbar title="Appointments" />


            {/* =================================================
                 APPOINTMENT HERO
            ================================================== */}

            <section className="doctor-page-hero appointments-hero">

                <div className="appointments-hero-content">

                    <span className="doctor-eyebrow">
                        <i className="fa-solid fa-calendar-day"></i>
                        TODAY'S CLINICAL SCHEDULE
                    </span>

                    <h1>
                        Your day,{" "}
                        <span>
                            under control.
                        </span>
                    </h1>

                    <p>
                        Manage consultations, monitor patient flow,
                        and keep your clinical schedule organized
                        from one intelligent workspace.
                    </p>

                    <div className="hero-actions">

                        <button
                            className="primary-btn"
                            id="newAppointmentBtn"
                            onClick={() => setModalOpen(true)}
                        >
                            <i className="fa-solid fa-plus"></i>
                            New Appointment
                        </button>

                        <button
                            className="doctor-secondary-btn"
                            id="todayBtn"
                            onClick={() => setDateValue("today")}
                        >
                            <i className="fa-solid fa-calendar-day"></i>
                            Today
                        </button>

                    </div>

                </div>


                {/* CREATIVE SCHEDULE VISUAL */}

                <div className="schedule-orbit">

                    <div className="orbit-glow"></div>

                    <div className="orbit-ring orbit-ring-outer"></div>

                    <div className="orbit-ring orbit-ring-middle"></div>

                    <div className="orbit-ring orbit-ring-inner"></div>

                    <div className="orbit-center">
                        <i className="fa-solid fa-calendar-check"></i>
                        <strong>08</strong>
                        <small>
                            Appointments
                        </small>
                    </div>

                    <div className="orbit-point point-one">
                        <i className="fa-solid fa-user"></i>
                    </div>

                    <div className="orbit-point point-two">
                        <i className="fa-solid fa-stethoscope"></i>
                    </div>

                    <div className="orbit-point point-three">
                        <i className="fa-solid fa-clock"></i>
                    </div>

                </div>

            </section>


            {/* =================================================
                 APPOINTMENT STATS
            ================================================== */}

            <section className="appointment-stats">

                <div className="appointment-stat-card">
                    <div className="appointment-stat-icon teal">
                        <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <div>
                        <span>
                            Total Today
                        </span>
                        <strong>
                            08
                        </strong>
                        <small>
                            Scheduled appointments
                        </small>
                    </div>
                </div>

                <div className="appointment-stat-card">
                    <div className="appointment-stat-icon purple">
                        <i className="fa-solid fa-hourglass-half"></i>
                    </div>
                    <div>
                        <span>
                            Waiting
                        </span>
                        <strong>
                            02
                        </strong>
                        <small>
                            Patients waiting
                        </small>
                    </div>
                </div>

                <div className="appointment-stat-card">
                    <div className="appointment-stat-icon blue">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <div>
                        <span>
                            Completed
                        </span>
                        <strong>
                            04
                        </strong>
                        <small>
                            Consultations finished
                        </small>
                    </div>
                </div>

                <div className="appointment-stat-card">
                    <div className="appointment-stat-icon orange">
                        <i className="fa-solid fa-clock"></i>
                    </div>
                    <div>
                        <span>
                            Next Patient
                        </span>
                        <strong>
                            14:30
                        </strong>
                        <small>
                            In 25 minutes
                        </small>
                    </div>
                </div>

            </section>


            {/* =================================================
                 APPOINTMENT WORKSPACE
            ================================================== */}

            <section className="appointments-workspace">

                {/* TOOLBAR */}

                <div className="appointments-toolbar">

                    <div className="appointments-toolbar-title">
                        <span className="doctor-eyebrow">
                            CLINICAL WORKSPACE
                        </span>
                        <h2>
                            Today's appointments
                        </h2>
                    </div>


                    {/* FILTERS */}

                    <div className="appointments-filters">

                        <FilterDropdown
                            id="appointmentStatusFilter"
                            options={appointmentStatusOptions}
                            value={statusValue}
                            onChange={setStatusValue}
                        />

                        <FilterDropdown
                            id="appointmentDateFilter"
                            options={appointmentDateOptions}
                            value={dateValue}
                            onChange={setDateValue}
                        />

                    </div>

                </div>


                {/* TIMELINE */}

                <div className="appointment-timeline">

                    {visible.map(appointment => {

                        const badge =
                            appointmentStatusBadge[appointment.status]

                        const dot =
                            appointmentDotClass[appointment.status]

                        const state =
                            startState[appointment.id]

                        return (

                            <article
                                key={appointment.id}
                                className={
                                    "doctor-appointment-card " +
                                    appointment.status
                                }
                                data-status={appointment.status}
                                data-date={appointment.date}
                                data-patient={appointment.patient}
                            >

                                <div className="appointment-time">
                                    <strong>
                                        {appointment.time}
                                    </strong>
                                    <span>
                                        {appointment.duration}
                                    </span>
                                </div>


                                <div className="timeline-line">
                                    <div className={"timeline-dot" + dot}></div>
                                </div>


                                <div className="appointment-patient">

                                    <div className={"patient-avatar " + appointment.avatar}>
                                        {appointment.initials}
                                    </div>

                                    <div className="patient-details">

                                        <h3>
                                            {appointment.patient}
                                        </h3>

                                        <p>
                                            <i className="fa-solid fa-user"></i>
                                            {appointment.age} years · {appointment.gender}
                                        </p>

                                        <span className="appointment-condition">
                                            {appointment.condition}
                                        </span>

                                    </div>

                                </div>


                                <div className="appointment-status">
                                    <span className={"status-badge " + badge.cls}>
                                        <i className={"fa-solid " + badge.icon}></i>
                                        {badge.label}
                                    </span>
                                </div>


                                <div className="appointment-actions">

                                    {appointment.status === "completed" ? (

                                        <>
                                            <button
                                                className="icon-btn"
                                                title="Medical record"
                                            >
                                                <i className="fa-solid fa-file-medical"></i>
                                            </button>

                                            <button
                                                className="icon-btn"
                                                title="More"
                                            >
                                                <i className="fa-solid fa-ellipsis"></i>
                                            </button>

                                            <button className="doctor-secondary-btn">
                                                View Notes
                                            </button>
                                        </>

                                    ) : (

                                        <>
                                            <button
                                                className="icon-btn"
                                                title="View patient"
                                            >
                                                <i className="fa-solid fa-user"></i>
                                            </button>

                                            <button
                                                className="icon-btn"
                                                title="More"
                                            >
                                                <i className="fa-solid fa-ellipsis"></i>
                                            </button>

                                            <button
                                                className="primary-btn appointment-start"
                                                disabled={state === "starting"}
                                                onClick={() => handleStart(appointment)}
                                            >
                                                <i
                                                    className={
                                                        "fa-solid " +
                                                        (state === "starting"
                                                            ? "fa-spinner fa-spin"
                                                            : "fa-stethoscope")
                                                    }
                                                ></i>
                                                {state === "starting"
                                                    ? "Starting..."
                                                    : state === "started"
                                                    ? "Consultation"
                                                    : "Start"}
                                            </button>
                                        </>

                                    )}

                                </div>

                            </article>

                        )

                    })}


                    {visible.length === 0 && (

                        <div className="appointment-empty-state">

                            <div className="empty-state-icon">
                                <i className="fa-solid fa-calendar-xmark"></i>
                            </div>

                            <h3>
                                No appointments found
                            </h3>

                            <p>
                                There are no appointments
                                matching the selected filters.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* =================================================
                 NEW APPOINTMENT MODAL
            ================================================== */}

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                variant="doctor"
            >

                <div className="appointment-modal">

                    {/* MODAL HEADER */}

                    <div className="appointment-modal-header">

                        <div>

                            <span className="doctor-eyebrow">
                                <i className="fa-solid fa-calendar-plus"></i>
                                APPOINTMENT MANAGEMENT
                            </span>

                            <h2>
                                New Appointment
                            </h2>

                            <p>
                                Schedule a consultation for a patient.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="modal-close"
                            id="closeAppointmentModal"
                            onClick={() => setModalOpen(false)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                    </div>


                    {/* MODAL BODY */}

                    <form
                        className="appointment-form"
                        id="appointmentForm"
                        onSubmit={handleSubmit}
                    >

                        {/* PATIENT */}

                        <div className="form-group">

                            <label htmlFor="appointmentPatient">
                                <i className="fa-solid fa-user"></i>
                                Patient
                            </label>

                            <div className="form-input-wrapper">

                                <i className="fa-solid fa-user"></i>

                                <select
                                    id="appointmentPatient"
                                    required
                                    value={patient}
                                    onChange={event => setPatient(event.target.value)}
                                >
                                    <option value="">
                                        Select patient
                                    </option>

                                    {appointmentPatientOptions.map(name => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}

                                </select>

                            </div>

                        </div>


                        {/* DATE + TIME */}

                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="appointmentDate">
                                    <i className="fa-solid fa-calendar"></i>
                                    Date
                                </label>

                                <div className="form-input-wrapper">

                                    <i className="fa-solid fa-calendar-day"></i>

                                    <input
                                        type="date"
                                        id="appointmentDate"
                                        required
                                        min={todayISO}
                                        value={date}
                                        onChange={event => setDate(event.target.value)}
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label htmlFor="appointmentTime">
                                    <i className="fa-solid fa-clock"></i>
                                    Time
                                </label>

                                <div className="form-input-wrapper">

                                    <i className="fa-solid fa-clock"></i>

                                    <input
                                        type="time"
                                        id="appointmentTime"
                                        required
                                        value={time}
                                        onChange={event => setTime(event.target.value)}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* APPOINTMENT TYPE */}

                        <div className="form-group">

                            <label htmlFor="appointmentType">
                                <i className="fa-solid fa-stethoscope"></i>
                                Appointment Type
                            </label>

                            <div className="form-input-wrapper">

                                <i className="fa-solid fa-stethoscope"></i>

                                <select
                                    id="appointmentType"
                                    required
                                    value={type}
                                    onChange={event => setType(event.target.value)}
                                >
                                    <option value="">
                                        Select appointment type
                                    </option>

                                    {appointmentTypeOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}

                                </select>

                            </div>

                        </div>


                        {/* DURATION */}

                        <div className="form-group">

                            <label htmlFor="appointmentDuration">
                                <i className="fa-solid fa-hourglass-half"></i>
                                Duration
                            </label>

                            <div className="form-input-wrapper">

                                <i className="fa-solid fa-clock"></i>

                                <select
                                    id="appointmentDuration"
                                    required
                                    value={duration}
                                    onChange={event => setDuration(event.target.value)}
                                >
                                    {appointmentDurationOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}

                                </select>

                            </div>

                        </div>


                        {/* NOTES */}

                        <div className="form-group">

                            <label htmlFor="appointmentNotes">
                                <i className="fa-solid fa-notes-medical"></i>
                                Clinical Notes
                                <span className="optional">
                                    Optional
                                </span>
                            </label>

                            <textarea
                                id="appointmentNotes"
                                placeholder="Add a short note about the appointment..."
                                rows="4"
                                value={notes}
                                onChange={event => setNotes(event.target.value)}
                            ></textarea>

                        </div>


                        {/* SUMMARY */}

                        <div className="appointment-modal-summary">

                            <div className="summary-icon">
                                <i className="fa-solid fa-calendar-check"></i>
                            </div>

                            <div>
                                <strong>
                                    Appointment Summary
                                </strong>
                                <span id="appointmentSummary">
                                    {summary}
                                </span>
                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="appointment-modal-actions">

                            <button
                                type="button"
                                className="doctor-secondary-btn"
                                id="cancelAppointmentModal"
                                onClick={() => setModalOpen(false)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={scheduling}
                            >
                                <i
                                    className={
                                        "fa-solid " +
                                        (scheduling
                                            ? "fa-spinner fa-spin"
                                            : "fa-calendar-plus")
                                    }
                                ></i>
                                {scheduling ? "Scheduling..." : "Create Appointment"}
                            </button>

                        </div>

                    </form>

                </div>

            </Modal>

        </>
    )

}
