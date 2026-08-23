import { useState } from "react"

import { useNavigate } from "react-router-dom"

import Topbar from "../../components/layout/Topbar"

import Counter from "../../components/ui/Counter"

import CustomFilter from "../../components/ui/CustomFilter"

import { useToast } from "../../context/ToastContext"

import { nurseService } from "../../api/nurseService"

import { waitingQueue } from "../../data/nursePatients"


/*
    Waiting Room — faithful port of pages/nurse/waiting-room.html
    + the waiting-room half of assets/js/nurse.js.

    Behaviour (ports nurse.js):
      - #patientSearch + the #statusFilter .custom-filter filter the
        live queue: a row shows when its name contains the search
        term AND (status filter is "all" OR the row's CURRENT status
        matches). Calling a patient flips its status to "called", so
        it then follows the "called" filter — exactly as the original
        read the mutated data-status.
      - "Call" (.queue-action.call) marks the row called: badge →
        "Called", the button disables and swaps to a check, the row
        gains .patient-called, and showNurseMessage("<name> has been
        called."). Synchronous — no service.
      - "Take Vitals" (.queue-action.vitals) stores the patient id in
        sessionStorage("selectedPatient") and routes to /nurse/vitals,
        where the Vitals page preselects it on mount.
      - "Refresh Queue" spins for 600ms via nurseService.refreshQueue()
        then toasts "Queue refreshed successfully."

    priority-number / priority-time styling is fixed to the row that
    began as "priority" (nurse.js never moved it when calling), so it
    is derived once from the initial data, independent of status.
*/


function badgeClass(status) {

    if (status === "priority") {
        return "priority-badge"
    }

    if (status === "called") {
        return "called-badge"
    }

    return "waiting-badge"

}


function badgeLabel(status) {

    if (status === "priority") {
        return "Priority"
    }

    if (status === "called") {
        return "Called"
    }

    return "Waiting"

}


const statusOptions = [

    {
        value: "all",
        label: "All Patients",
    },

    {
        value: "waiting",
        label: "Waiting",
    },

    {
        value: "priority",
        label: "Priority",
    },

    {
        value: "called",
        label: "Called",
    },

]


export default function WaitingRoom() {

    const navigate = useNavigate()

    const { showNurseMessage } = useToast()


    /* ---- queue + filter + refresh state ---- */

    const [queue, setQueue] = useState(
        waitingQueue.map(patient => ({
            ...patient,
            priorityStyle: patient.status === "priority",
            calledAtRuntime: false,
        }))
    )

    const [search, setSearch] = useState("")

    const [statusValue, setStatusValue] = useState("all")

    const [refreshing, setRefreshing] = useState(false)


    /* ---- filter (ports filterQueue — search + current status) ---- */

    const term = search.trim().toLowerCase()

    const visible = queue.filter(patient => {

        const matchesSearch =
            patient.name.toLowerCase().includes(term)

        const matchesStatus =
            statusValue === "all" ||
            patient.status === statusValue

        return matchesSearch && matchesStatus

    })


    /* ---- call patient (synchronous) ---- */

    function handleCall(patient) {

        setQueue(list =>
            list.map(entry =>
                entry.id === patient.id
                    ? { ...entry, status: "called", calledAtRuntime: true }
                    : entry
            )
        )

        showNurseMessage(
            `${patient.name} has been called.`,
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


    /* ---- refresh queue (600ms via nurseService) ---- */

    function handleRefresh() {

        setRefreshing(true)

        nurseService
            .refreshQueue()
            .then(() => {

                setRefreshing(false)

                showNurseMessage(
                    "Queue refreshed successfully.",
                    "success"
                )

            })

    }


    return (
        <>

            <Topbar title="Waiting Room" />


            {/* =================================================
                 PAGE HEADER
            ================================================== */}

            <section className="page-hero">

                <div className="page-hero-content">

                    <span className="page-eyebrow">
                        <i className="fa-solid fa-users-line"></i>
                        PATIENT FLOW
                    </span>

                    <h1>
                        Keep the queue{" "}
                        <span>moving.</span>
                    </h1>

                    <p>
                        Manage patients currently waiting
                        for their consultation.
                    </p>

                    <button
                        className={"primary-btn" + (refreshing ? " refreshing" : "")}
                        id="refreshQueue"
                        onClick={handleRefresh}
                    >

                        <i className="fa-solid fa-rotate"></i>

                        Refresh Queue

                    </button>

                </div>

                <div className="page-hero-visual">
                    <i className="fa-solid fa-users-line page-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 QUEUE STATS
            ================================================== */}

            <section className="nurse-stats-grid">

                <div className="nurse-stat-card premium-glass">

                    <div className="nurse-stat-icon waiting">
                        <i className="fa-solid fa-users"></i>
                    </div>

                    <div>

                        <Counter
                            as="h2"
                            className="counter"
                            target={8}
                        />

                        <p>
                            Waiting Patients
                        </p>

                    </div>

                    <span className="stat-status">
                        Current
                    </span>

                </div>


                <div className="nurse-stat-card premium-glass">

                    <div className="nurse-stat-icon priority">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>

                    <div>

                        <Counter
                            as="h2"
                            className="counter"
                            target={2}
                        />

                        <p>
                            Priority Cases
                        </p>

                    </div>

                    <span className="stat-status priority-status">
                        Attention
                    </span>

                </div>


                <div className="nurse-stat-card premium-glass">

                    <div className="nurse-stat-icon called">
                        <i className="fa-solid fa-bullhorn"></i>
                    </div>

                    <div>

                        <Counter
                            as="h2"
                            className="counter"
                            target={3}
                        />

                        <p>
                            Called Today
                        </p>

                    </div>

                    <span className="stat-status">
                        Today
                    </span>

                </div>


                <div className="nurse-stat-card premium-glass">

                    <div className="nurse-stat-icon completed">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>

                    <div>

                        <Counter
                            as="h2"
                            className="counter"
                            target={14}
                        />

                        <p>
                            Completed
                        </p>

                    </div>

                    <span className="stat-status">
                        Today
                    </span>

                </div>

            </section>


            {/* =================================================
                 WAITING ROOM MAIN CARD
            ================================================== */}

            <section className="waiting-room-card premium-glass">

                {/* HEADER */}

                <div className="waiting-header">

                    <div>

                        <span className="section-label">
                            LIVE QUEUE
                        </span>

                        <h2>
                            Patients Waiting
                        </h2>

                    </div>

                    <div className="queue-live">

                        <span className="live-dot"></span>

                        Live Queue

                    </div>

                </div>


                {/* CONTROLS */}

                <div className="queue-controls">

                    <div className="search-box">

                        <i className="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="text"
                            id="patientSearch"
                            placeholder="Search patient..."
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                        />

                    </div>


                    <CustomFilter
                        id="statusFilter"
                        options={statusOptions}
                        value={statusValue}
                        onChange={setStatusValue}
                    />

                </div>


                {/* =================================================
                     PATIENT QUEUE
                ================================================== */}

                <div
                    className="patient-queue"
                    id="patientQueue"
                >

                    {visible.map(patient => (

                        <div
                            key={patient.id}
                            className={"queue-patient" + (patient.calledAtRuntime ? " patient-called" : "")}
                            data-status={patient.status}
                        >

                            <div className={"queue-number" + (patient.priorityStyle ? " priority-number" : "")}>
                                {patient.number}
                            </div>


                            <div className="patient-avatar">
                                {patient.initials}
                            </div>


                            <div className="patient-details">

                                <h3>
                                    {patient.name}
                                </h3>

                                <p>
                                    {patient.meta}
                                </p>

                            </div>


                            <div className="patient-doctor">

                                <span>
                                    Doctor
                                </span>

                                <strong>
                                    {patient.doctor}
                                </strong>

                            </div>


                            <div className={"waiting-time" + (patient.priorityStyle ? " priority-time" : "")}>

                                <i className="fa-regular fa-clock"></i>

                                <span>
                                    {patient.time}
                                </span>

                            </div>


                            <span className={"patient-status " + badgeClass(patient.status)}>
                                {badgeLabel(patient.status)}
                            </span>


                            <div className="patient-actions">

                                <button
                                    className={"queue-action call" + (patient.status === "called" ? " disabled" : "")}
                                    disabled={patient.status === "called"}
                                    title={patient.status === "called" ? undefined : "Call Patient"}
                                    onClick={patient.status === "called" ? undefined : () => handleCall(patient)}
                                >

                                    <i className={"fa-solid " + (patient.calledAtRuntime ? "fa-check" : "fa-bullhorn")}></i>

                                </button>


                                <button
                                    className="queue-action vitals"
                                    title="Take Vitals"
                                    onClick={() => handleVitals(patient)}
                                >

                                    <i className="fa-solid fa-heart-pulse"></i>

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </>
    )

}
