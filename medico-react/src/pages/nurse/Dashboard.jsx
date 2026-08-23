import { useNavigate } from "react-router-dom"

import Topbar from "../../components/layout/Topbar"

import Counter from "../../components/ui/Counter"


/*
    Nurse Dashboard — faithful port of pages/nurse/dashboard.html.

    Pure display: the four stat counters animate on mount (the
    original leaned on global.js's counter animation, reproduced
    here by Counter), and every button that carried a
    data-nurse-action navigates to the matching /nurse route
    (ports nurse.js handleNurseAction, which did
    window.location.href = "<action>.html").

    The waiting-room widget + "Today's Patients" list use this
    page's own static mock set (JD / EM / MK, MC-xxxx) and stay
    inline exactly as authored — distinct from the PT-xxxx
    patients used on the other nurse pages. The hero greets
    "Hadi." while the profile chrome reads "Sarah", an
    inconsistency carried over verbatim.
*/

export default function Dashboard() {

    const navigate = useNavigate()


    return (
        <>

            <Topbar title="Dashboard" />


            {/* =================================================
                 WELCOME CARD
            ================================================== */}

            <section className="page-hero">

                <div className="page-hero-content">

                    <span className="page-eyebrow">
                        <i className="fa-solid fa-user-nurse"></i>
                        NURSE WORKSPACE
                    </span>

                    <h1>
                        Good morning,{" "}
                        <span>Hadi.</span>
                    </h1>

                    <p>
                        Manage patients, monitor vital signs,
                        organize the waiting room and keep
                        today's clinical workflow running smoothly.
                    </p>

                    <button
                        className="primary-btn"
                        onClick={() => navigate("/nurse/waiting-room")}
                    >

                        Open Waiting Room

                        <i className="fa-solid fa-arrow-right"></i>

                    </button>

                </div>

                <div className="page-hero-visual">
                    <i className="fa-solid fa-user-nurse page-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 NURSE STATISTICS
            ================================================== */}

            <section className="stats-grid nurse-stats">

                {/* Patients Today */}

                <div className="stat-card premium-glass">

                    <div className="stat-icon nurse-patients">
                        <i className="fa-solid fa-users"></i>
                    </div>

                    <div className="stat-info">

                        <Counter
                            as="h2"
                            className="nurse-counter"
                            target={24}
                        />

                        <h4>
                            Patients Today
                        </h4>

                        <p>
                            Registered Patients
                        </p>

                    </div>

                    <span className="badge">
                        Today
                    </span>

                </div>


                {/* Waiting */}

                <div className="stat-card premium-glass">

                    <div className="stat-icon nurse-waiting">
                        <i className="fa-solid fa-clock"></i>
                    </div>

                    <div className="stat-info">

                        <Counter
                            as="h2"
                            className="nurse-counter"
                            target={7}
                        />

                        <h4>
                            Waiting
                        </h4>

                        <p>
                            Patients in Queue
                        </p>

                    </div>

                    <span className="badge">
                        Now
                    </span>

                </div>


                {/* Vitals */}

                <div className="stat-card premium-glass">

                    <div className="stat-icon nurse-vitals">
                        <i className="fa-solid fa-heart-pulse"></i>
                    </div>

                    <div className="stat-info">

                        <Counter
                            as="h2"
                            className="nurse-counter"
                            target={18}
                        />

                        <h4>
                            Vitals Recorded
                        </h4>

                        <p>
                            Today's Measurements
                        </p>

                    </div>

                    <span className="badge positive">
                        +6
                    </span>

                </div>


                {/* Completed */}

                <div className="stat-card premium-glass">

                    <div className="stat-icon nurse-completed">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>

                    <div className="stat-info">

                        <Counter
                            as="h2"
                            className="nurse-counter"
                            target={15}
                        />

                        <h4>
                            Completed
                        </h4>

                        <p>
                            Patients Processed
                        </p>

                    </div>

                    <span className="badge positive">
                        Today
                    </span>

                </div>

            </section>


            {/* =================================================
                 WORKSPACE GRID
            ================================================== */}

            <section className="dashboard-grid nurse-dashboard-grid">

                {/* WAITING ROOM */}

                <div className="appointment-card premium-glass">

                    <div className="widget-header">

                        <div>

                            <span>
                                WAITING ROOM
                            </span>

                            <h2>
                                Patients Waiting
                            </h2>

                        </div>

                        <div className="doctor-icon">
                            <i className="fa-solid fa-users"></i>
                        </div>

                    </div>


                    <div className="waiting-summary">

                        <div className="queue-number">

                            <strong>
                                7
                            </strong>

                            <span>
                                patients waiting
                            </span>

                        </div>

                        <div className="queue-status">

                            <i className="fa-solid fa-circle"></i>

                            Active Queue

                        </div>

                    </div>


                    <div className="mini-patients">

                        <div className="mini-patient">

                            <div className="patient-avatar">
                                JD
                            </div>

                            <div>

                                <strong>
                                    John Doe
                                </strong>

                                <p>
                                    Waiting · 08 min
                                </p>

                            </div>

                        </div>


                        <div className="mini-patient">

                            <div className="patient-avatar">
                                EM
                            </div>

                            <div>

                                <strong>
                                    Emma Miller
                                </strong>

                                <p>
                                    Waiting · 14 min
                                </p>

                            </div>

                        </div>


                        <div className="mini-patient">

                            <div className="patient-avatar">
                                MK
                            </div>

                            <div>

                                <strong>
                                    Michael King
                                </strong>

                                <p>
                                    Waiting · 21 min
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        className="primary-btn"
                        onClick={() => navigate("/nurse/waiting-room")}
                    >

                        View Waiting Room

                        <i className="fa-solid fa-arrow-right"></i>

                    </button>

                </div>


                {/* QUICK ACTIONS */}

                <div className="ai-card nurse-quick-actions">

                    <div className="ai-top">

                        <div className="ai-icon">
                            <i className="fa-solid fa-bolt"></i>
                        </div>

                        <span>
                            QUICK ACTIONS
                        </span>

                    </div>


                    <h2>
                        What do you need?
                    </h2>

                    <p>
                        Quickly access the most common
                        nursing tasks.
                    </p>


                    <div className="quick-action-list">

                        <button
                            className="nurse-action"
                            onClick={() => navigate("/nurse/register-patient")}
                        >

                            <i className="fa-solid fa-user-plus"></i>

                            Register Patient

                            <i className="fa-solid fa-arrow-right"></i>

                        </button>


                        <button
                            className="nurse-action"
                            onClick={() => navigate("/nurse/vitals")}
                        >

                            <i className="fa-solid fa-heart-pulse"></i>

                            Record Vitals

                            <i className="fa-solid fa-arrow-right"></i>

                        </button>


                        <button
                            className="nurse-action"
                            onClick={() => navigate("/nurse/patients")}
                        >

                            <i className="fa-solid fa-users"></i>

                            View Patients

                            <i className="fa-solid fa-arrow-right"></i>

                        </button>

                    </div>

                </div>

            </section>


            {/* =================================================
                 TODAY'S PATIENTS
            ================================================== */}

            <section className="health-overview premium-glass nurse-patients-section">

                <div className="health-header">

                    <div>

                        <span>
                            PATIENT MANAGEMENT
                        </span>

                        <h2>
                            Today's Patients
                        </h2>

                    </div>

                    <button
                        className="primary-btn"
                        onClick={() => navigate("/nurse/patients")}
                    >

                        View All

                        <i className="fa-solid fa-arrow-right"></i>

                    </button>

                </div>


                <div className="nurse-patient-list">

                    {/* Patient 1 */}

                    <div className="nurse-patient-row">

                        <div className="patient-info">

                            <div className="patient-avatar large">
                                JD
                            </div>

                            <div>

                                <h3>
                                    John Doe
                                </h3>

                                <p>
                                    Patient #MC-1024
                                </p>

                            </div>

                        </div>


                        <div className="patient-status waiting">

                            <i className="fa-solid fa-clock"></i>

                            Waiting

                        </div>


                        <div className="patient-time">
                            10:05 AM
                        </div>


                        <button
                            className="nurse-view-link"
                            onClick={() => navigate("/nurse/vitals")}
                        >

                            Vitals

                            <i className="fa-solid fa-arrow-right"></i>

                        </button>

                    </div>


                    {/* Patient 2 */}

                    <div className="nurse-patient-row">

                        <div className="patient-info">

                            <div className="patient-avatar large">
                                EM
                            </div>

                            <div>

                                <h3>
                                    Emma Miller
                                </h3>

                                <p>
                                    Patient #MC-1025
                                </p>

                            </div>

                        </div>


                        <div className="patient-status completed">

                            <i className="fa-solid fa-circle-check"></i>

                            Vitals Recorded

                        </div>


                        <div className="patient-time">
                            09:42 AM
                        </div>


                        <button
                            className="nurse-view-link"
                            onClick={() => navigate("/nurse/vitals")}
                        >

                            View

                            <i className="fa-solid fa-arrow-right"></i>

                        </button>

                    </div>


                    {/* Patient 3 */}

                    <div className="nurse-patient-row">

                        <div className="patient-info">

                            <div className="patient-avatar large">
                                MK
                            </div>

                            <div>

                                <h3>
                                    Michael King
                                </h3>

                                <p>
                                    Patient #MC-1026
                                </p>

                            </div>

                        </div>


                        <div className="patient-status processing">

                            <i className="fa-solid fa-spinner"></i>

                            With Doctor

                        </div>


                        <div className="patient-time">
                            09:25 AM
                        </div>


                        <button
                            className="nurse-view-link"
                            onClick={() => navigate("/nurse/patients")}
                        >

                            View

                            <i className="fa-solid fa-arrow-right"></i>

                        </button>

                    </div>

                </div>

            </section>

        </>
    )

}
