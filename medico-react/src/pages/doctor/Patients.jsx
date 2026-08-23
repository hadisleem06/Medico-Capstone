import { useState } from "react"

import { useNavigate } from "react-router-dom"

import Topbar from "../../components/layout/Topbar"

import Modal from "../../components/ui/Modal"

import FilterDropdown from "../../components/ui/FilterDropdown"

import { useToast } from "../../context/ToastContext"

import {
    doctorPatients,
    patientRiskOptions,
    patientStatusOptions,
} from "../../data/doctorPatients"


/* =========================================================
   HELPERS ( port patients.js getInitials / riskLabel /
   the avatar-colour rotation )
========================================================= */

const avatarColors = [
    "avatar-teal",
    "avatar-purple",
    "avatar-pink",
    "avatar-blue",
    "avatar-orange",
]


function getInitials(name) {

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0))
        .join("")
        .toUpperCase()

}


function riskLabel(risk) {

    if (risk === "high") {
        return "High"
    }

    if (risk === "moderate") {
        return "Moderate"
    }

    return "Stable"

}


/* =========================================================
   PATIENTS PAGE
========================================================= */

export default function Patients() {

    const navigate = useNavigate()

    const { showDoctorToast } = useToast()


    /* ---- directory + filters ---- */

    const [patients, setPatients] = useState(doctorPatients)

    const [added, setAdded] = useState(0)

    const [search, setSearch] = useState("")

    const [riskValue, setRiskValue] = useState("")

    const [statusValue, setStatusValue] = useState("")


    /* ---- add-patient modal + form ---- */

    const [modalOpen, setModalOpen] = useState(false)

    const [name, setName] = useState("")

    const [age, setAge] = useState("")

    const [sex, setSex] = useState("Female")

    const [condition, setCondition] = useState("")

    const [risk, setRisk] = useState("stable")

    const [status, setStatus] = useState("active")


    /* ---- derived: visible cards (ports applyFilters) ---- */

    const term = search.trim().toLowerCase()

    const visible = patients.filter(patient => {

        const matchesSearch =
            !term ||
            patient.name.toLowerCase().includes(term) ||
            patient.condition.toLowerCase().includes(term)

        const matchesRisk =
            !riskValue || patient.risk === riskValue

        const matchesStatus =
            !statusValue || patient.status === statusValue

        return matchesSearch && matchesRisk && matchesStatus

    })


    /* ---- export (ports exportPatientsBtn) ---- */

    function handleExport() {

        showDoctorToast(
            "Export started",
            "Your patient list is being prepared.",
            "fa-file-export"
        )

    }


    /* ---- add patient (ports createPatient — synchronous) ---- */

    function handleAddSubmit(event) {

        event.preventDefault()

        const form = event.currentTarget

        if (!name.trim() || !age.trim() || !condition.trim()) {
            form.reportValidity()
            return
        }

        const nextAdded = added + 1

        const color =
            avatarColors[
                (doctorPatients.length + nextAdded - 1) % avatarColors.length
            ]

        const newPatient = {
            name: name.trim(),
            initials: getInitials(name),
            avatarClass: color,
            risk,
            riskLabel: riskLabel(risk),
            status,
            meta: `${age.trim()} yrs · ${sex}`,
            condition: condition.trim(),
            conditionIcon: "fa-heart-pulse",
            lastVisit: "Today",
            mrn: "#" + (10300 + nextAdded),
        }

        setPatients([newPatient, ...patients])

        setAdded(nextAdded)


        /* reset the form (ports form.reset) */

        setName("")
        setAge("")
        setSex("Female")
        setCondition("")
        setRisk("stable")
        setStatus("active")

        setModalOpen(false)

        showDoctorToast(
            "Patient added",
            `${newPatient.name} is now in your directory.`,
            "fa-user-plus"
        )

    }


    return (
        <>

            <Topbar title="Patient Directory" />


            {/* =================================================
                 HERO
            ================================================== */}

            <section className="doctor-page-hero patients-hero">

                <div className="doctor-hero-content">

                    <span className="doctor-eyebrow">
                        <i className="fa-solid fa-users"></i>
                        PATIENT POPULATION
                    </span>

                    <h1>
                        Every patient,{" "}
                        <span>one clear view.</span>
                    </h1>

                    <p>
                        Browse, search and triage your entire
                        patient population. Open a chart, review
                        risk and jump straight into a consultation.
                    </p>

                    <div className="hero-actions">

                        <button
                            className="primary-btn"
                            id="addPatientBtn"
                            onClick={() => setModalOpen(true)}
                        >
                            <i className="fa-solid fa-user-plus"></i>
                            Add Patient
                        </button>

                        <button
                            className="doctor-secondary-btn"
                            id="exportPatientsBtn"
                            onClick={handleExport}
                        >
                            <i className="fa-solid fa-file-export"></i>
                            Export
                        </button>

                    </div>

                </div>

                <div className="patients-hero-visual">

                    <div className="population-ring">
                        <strong>124</strong>
                        <span>Active patients</span>
                    </div>

                </div>

            </section>


            {/* =================================================
                 STATS
            ================================================== */}

            <section className="appointment-stats">

                <div className="appointment-stat-card">
                    <div className="appointment-stat-icon teal">
                        <i className="fa-solid fa-user-group"></i>
                    </div>
                    <div>
                        <span>Total Patients</span>
                        <strong>124</strong>
                        <small>Across all clinics</small>
                    </div>
                </div>

                <div className="appointment-stat-card">
                    <div className="appointment-stat-icon blue">
                        <i className="fa-solid fa-heart-pulse"></i>
                    </div>
                    <div>
                        <span>Active Cases</span>
                        <strong>98</strong>
                        <small>Under current care</small>
                    </div>
                </div>

                <div className="appointment-stat-card">
                    <div className="appointment-stat-icon orange">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                        <span>High Risk</span>
                        <strong>08</strong>
                        <small>Require close review</small>
                    </div>
                </div>

                <div className="appointment-stat-card">
                    <div className="appointment-stat-icon purple">
                        <i className="fa-solid fa-user-plus"></i>
                    </div>
                    <div>
                        <span>New This Month</span>
                        <strong>12</strong>
                        <small>Recently registered</small>
                    </div>
                </div>

            </section>


            {/* =================================================
                 WORKSPACE
            ================================================== */}

            <section className="patients-workspace premium-glass">

                <div className="patients-toolbar">

                    <div className="patients-toolbar-title">
                        <span className="section-kicker">PATIENT RECORDS</span>
                        <h2>All patients</h2>
                    </div>

                    <div className="patients-controls">

                        <div className="patients-search">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                id="patientSearch"
                                placeholder="Search by name or condition..."
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                            />
                        </div>

                        <FilterDropdown
                            id="patientRiskFilter"
                            options={patientRiskOptions}
                            value={riskValue}
                            onChange={setRiskValue}
                        />

                        <FilterDropdown
                            id="patientStatusFilter"
                            options={patientStatusOptions}
                            value={statusValue}
                            onChange={setStatusValue}
                        />

                    </div>

                </div>


                {/* PATIENT GRID */}

                <div className="patients-grid" id="patientsGrid">

                    {visible.map(patient => (

                        <article
                            className="patient-directory-card"
                            data-name={patient.name}
                            data-risk={patient.risk}
                            data-status={patient.status}
                            key={patient.mrn}
                        >

                            <div className="patient-card-top">
                                <div className={"patient-card-avatar " + patient.avatarClass}>
                                    {patient.initials}
                                </div>
                                <span className={"risk-tag " + patient.risk}>
                                    {patient.riskLabel}
                                </span>
                            </div>

                            <h3 className="patient-card-name">{patient.name}</h3>

                            <p className="patient-card-meta">{patient.meta}</p>

                            <div className="patient-card-condition">
                                <i className={"fa-solid " + patient.conditionIcon}></i>
                                {patient.condition}
                            </div>

                            <div className="patient-card-stats">
                                <div><span>Last visit</span><strong>{patient.lastVisit}</strong></div>
                                <div><span>MRN</span><strong>{patient.mrn}</strong></div>
                            </div>

                            <div className="patient-card-actions">

                                <button
                                    className="doctor-secondary-btn"
                                    onClick={() => navigate("/doctor/patient-profile")}
                                >
                                    <i className="fa-solid fa-folder-open"></i>
                                    Open Profile
                                </button>

                                <button className="icon-btn" title="Message">
                                    <i className="fa-solid fa-comment-medical"></i>
                                </button>

                            </div>

                        </article>

                    ))}

                </div>


                {/* EMPTY STATE */}

                {visible.length === 0 && (

                    <div className="patients-empty" id="patientsEmpty">
                        <div className="empty-state-icon">
                            <i className="fa-solid fa-user-slash"></i>
                        </div>
                        <h3>No patients found</h3>
                        <p>No patients match the current search and filters.</p>
                    </div>

                )}

            </section>


            {/* =================================================
                 ADD PATIENT MODAL
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
                                <i className="fa-solid fa-user-plus"></i>
                                PATIENT REGISTRATION
                            </span>

                            <h2>
                                Add Patient
                            </h2>

                            <p>
                                Register a new patient into your directory.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="modal-close"
                            id="closeAddPatient"
                            onClick={() => setModalOpen(false)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                    </div>


                    {/* MODAL BODY */}

                    <form
                        className="appointment-form"
                        id="addPatientForm"
                        onSubmit={handleAddSubmit}
                    >

                        {/* NAME */}

                        <div className="form-group">

                            <label htmlFor="newPatientName">
                                <i className="fa-solid fa-user"></i>
                                Full name
                            </label>

                            <div className="form-input-wrapper">

                                <i className="fa-solid fa-user"></i>

                                <input
                                    type="text"
                                    id="newPatientName"
                                    placeholder="e.g. Amelia Morgan"
                                    required
                                    value={name}
                                    onChange={event => setName(event.target.value)}
                                />

                            </div>

                        </div>


                        {/* AGE + SEX */}

                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="newPatientAge">
                                    <i className="fa-solid fa-cake-candles"></i>
                                    Age
                                </label>

                                <div className="form-input-wrapper">

                                    <i className="fa-solid fa-hashtag"></i>

                                    <input
                                        type="number"
                                        id="newPatientAge"
                                        min="0"
                                        max="120"
                                        placeholder="e.g. 45"
                                        required
                                        value={age}
                                        onChange={event => setAge(event.target.value)}
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label htmlFor="newPatientSex">
                                    <i className="fa-solid fa-venus-mars"></i>
                                    Sex
                                </label>

                                <div className="form-input-wrapper">

                                    <i className="fa-solid fa-venus-mars"></i>

                                    <select
                                        id="newPatientSex"
                                        required
                                        value={sex}
                                        onChange={event => setSex(event.target.value)}
                                    >
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>

                                </div>

                            </div>

                        </div>


                        {/* CONDITION */}

                        <div className="form-group">

                            <label htmlFor="newPatientCondition">
                                <i className="fa-solid fa-heart-pulse"></i>
                                Primary condition
                            </label>

                            <div className="form-input-wrapper">

                                <i className="fa-solid fa-notes-medical"></i>

                                <input
                                    type="text"
                                    id="newPatientCondition"
                                    placeholder="e.g. Hypertension"
                                    required
                                    value={condition}
                                    onChange={event => setCondition(event.target.value)}
                                />

                            </div>

                        </div>


                        {/* RISK + STATUS */}

                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="newPatientRisk">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    Risk level
                                </label>

                                <div className="form-input-wrapper">

                                    <i className="fa-solid fa-gauge-high"></i>

                                    <select
                                        id="newPatientRisk"
                                        required
                                        value={risk}
                                        onChange={event => setRisk(event.target.value)}
                                    >
                                        <option value="stable">Stable</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High</option>
                                    </select>

                                </div>

                            </div>


                            <div className="form-group">

                                <label htmlFor="newPatientStatus">
                                    <i className="fa-solid fa-circle-check"></i>
                                    Status
                                </label>

                                <div className="form-input-wrapper">

                                    <i className="fa-solid fa-clipboard-check"></i>

                                    <select
                                        id="newPatientStatus"
                                        required
                                        value={status}
                                        onChange={event => setStatus(event.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="followup">Follow-up</option>
                                        <option value="discharged">Discharged</option>
                                    </select>

                                </div>

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="appointment-modal-actions">

                            <button
                                type="button"
                                className="doctor-secondary-btn"
                                id="cancelAddPatient"
                                onClick={() => setModalOpen(false)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-btn"
                            >
                                <i className="fa-solid fa-user-plus"></i>
                                Add Patient
                            </button>

                        </div>

                    </form>

                </div>

            </Modal>

        </>
    )

}
