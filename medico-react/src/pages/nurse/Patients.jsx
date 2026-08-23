import { useState } from "react"

import { useNavigate } from "react-router-dom"

import Topbar from "../../components/layout/Topbar"

import CustomFilter from "../../components/ui/CustomFilter"

import { useToast } from "../../context/ToastContext"

import { nurseService } from "../../api/nurseService"

import { nursePatients } from "../../data/nursePatients"


/*
    Patients — faithful port of pages/nurse/patients.html + the
    patients half of assets/js/nurse.js.

    Behaviour (ports nurse.js):
      - #patientsSearch + the #patientsFilter .custom-filter filter
        the list: a row shows when (name OR patient id contains the
        search term) AND (gender filter is "all" OR the row's gender
        matches). Matching is against the bare id ("pt-1024"), not the
        "#PT-1024" display string — exactly as the original read
        data-patient-id. When nothing matches, the .patients-empty
        placeholder shows.
      - "View patient" (.view-patient) toasts "<name> — #<id>".
        Synchronous — no service.
      - "Take vitals" (.take-vitals) stores the patient id in
        sessionStorage("selectedPatient") and routes to /nurse/vitals,
        where the Vitals page preselects it on mount.
      - "Refresh" (#refreshPatients) spins for 600ms via
        nurseService.refreshPatients() then toasts "Patients list
        refreshed successfully."

    The original also called updatePatientsCount(), but its target
    (`.patients-count span`) never existed in patients.html — that was
    a dead no-op and is omitted here.
*/


const genderOptions = [

    {
        value: "all",
        label: "All Patients",
    },

    {
        value: "male",
        label: "Male",
    },

    {
        value: "female",
        label: "Female",
    },

]


export default function Patients() {

    const navigate = useNavigate()

    const { showNurseMessage } = useToast()


    /* ---- search + filter + refresh state ---- */

    const [search, setSearch] = useState("")

    const [genderValue, setGenderValue] = useState("all")

    const [refreshing, setRefreshing] = useState(false)


    /* ---- filter (ports filterPatients — name/id search + gender) ---- */

    const term = search.trim().toLowerCase()

    const visible = nursePatients.filter(patient => {

        const matchesSearch =
            patient.name.toLowerCase().includes(term) ||
            patient.id.toLowerCase().includes(term)

        const matchesGender =
            genderValue === "all" ||
            patient.gender === genderValue

        return matchesSearch && matchesGender

    })


    /* ---- view patient (synchronous) ---- */

    function handleView(patient) {

        showNurseMessage(
            `${patient.name} — #${patient.id}`,
            "success"
        )

    }


    /* ---- take vitals (hand off through sessionStorage) ---- */

    function handleVitals(patient) {

        sessionStorage.setItem(
            "selectedPatient",
            patient.id
        )

        navigate("/nurse/vitals")

    }


    /* ---- refresh patients (600ms via nurseService) ---- */

    function handleRefresh() {

        setRefreshing(true)

        nurseService
            .refreshPatients()
            .then(() => {

                setRefreshing(false)

                showNurseMessage(
                    "Patients list refreshed successfully.",
                    "success"
                )

            })

    }


    return (
        <>

            <Topbar title="Patients" />


            {/* =================================================
                 PAGE HEADER
            ================================================== */}

            <section className="page-hero">

                <div className="page-hero-content">

                    <span className="page-eyebrow">
                        <i className="fa-solid fa-hospital-user"></i>
                        PATIENT MANAGEMENT
                    </span>

                    <h1>
                        Care for every{" "}
                        <span>patient.</span>
                    </h1>

                    <p>
                        Search and manage registered patients.
                    </p>

                </div>

                <div className="page-hero-visual">
                    <i className="fa-solid fa-hospital-user page-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 TOOLBAR
            ================================================== */}

            <section className="patients-toolbar premium-glass">

                <div className="patients-search">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        id="patientsSearch"
                        placeholder="Search by name or patient ID..."
                        autoComplete="off"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                    />

                </div>


                <CustomFilter
                    id="patientsFilter"
                    className="patients-filter"
                    options={genderOptions}
                    value={genderValue}
                    onChange={setGenderValue}
                />


                <button
                    type="button"
                    className={"refresh-patients" + (refreshing ? " refreshing" : "")}
                    id="refreshPatients"
                    title="Refresh patients"
                    onClick={handleRefresh}
                >

                    <i className="fa-solid fa-rotate"></i>

                </button>

            </section>


            {/* =================================================
                 PATIENT LIST
            ================================================== */}

            <section className="patients-card premium-glass">

                <div className="patients-card-header">

                    <div>

                        <span className="section-label">
                            REGISTERED PATIENTS
                        </span>

                        <h2>
                            Patient List
                        </h2>

                    </div>

                    <div className="patients-card-icon">
                        <i className="fa-solid fa-users"></i>
                    </div>

                </div>


                <div
                    className="patients-list"
                    id="patientsList"
                >

                    {visible.map(patient => (

                        <article
                            key={patient.id}
                            className="patient-row"
                            data-gender={patient.gender}
                            data-patient-id={patient.id}
                        >

                            <div className="patient-row-avatar">
                                {patient.initials}
                            </div>


                            <div className="patient-row-info">

                                <h3>
                                    {patient.name}
                                </h3>

                                <p>
                                    {"#" + patient.id}
                                </p>

                            </div>


                            <div className="patient-row-detail">

                                <span>
                                    Age
                                </span>

                                <strong>
                                    {patient.age}
                                </strong>

                            </div>


                            <div className="patient-row-detail">

                                <span>
                                    Gender
                                </span>

                                <strong>
                                    {patient.genderLabel}
                                </strong>

                            </div>


                            <div className="patient-row-status">

                                <span className="patient-status active-status">
                                    Active
                                </span>

                            </div>


                            <div className="patient-row-actions">

                                <button
                                    type="button"
                                    className="patient-action view-patient"
                                    title="View patient"
                                    onClick={() => handleView(patient)}
                                >

                                    <i className="fa-solid fa-eye"></i>

                                </button>


                                <button
                                    type="button"
                                    className="patient-action take-vitals"
                                    title="Take vitals"
                                    onClick={() => handleVitals(patient)}
                                >

                                    <i className="fa-solid fa-heart-pulse"></i>

                                </button>

                            </div>

                        </article>

                    ))}


                    {visible.length === 0 && (

                        <div
                            className="patients-empty"
                            id="patientsEmpty"
                        >

                            <i className="fa-solid fa-user-slash"></i>

                            <h3>
                                No patients found
                            </h3>

                            <p>
                                Try changing your search or filter.
                            </p>

                        </div>

                    )}

                </div>

            </section>

        </>
    )

}
