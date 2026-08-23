import { useNavigate } from "react-router-dom"

import Topbar from "../../components/layout/Topbar"

import Counter from "../../components/ui/Counter"


/*
    Doctor Dashboard — "Doctor Command Center".

    Faithful port of pages/doctor/dashboard.html. The sidebar /
    aurora / profile chrome comes from AppLayout; this renders
    the topbar (with the dashboard-only "Available" pill) and
    the page body.

    Navigation that the original wired through document-level
    [data-page] / [data-doctor-action] listeners + window.location
    is now idiomatic router navigation to the same destinations:
        start-consultation / consultation.html -> /doctor/consultation
        view-appointments  / appointments.html -> /doctor/appointments
        view-patients      / patients.html     -> /doctor/patients
        open-ai            / lab-analysis.html  -> /doctor/lab-analysis
        + the quick-action tiles (soap, medication-assistant, radiology-analysis)
    The risk-panel "View patients" text button was inert in the
    original (no data-attribute) and stays inert here.

    The four .doctor-counter figures never animated in the original
    (global.js only animated .counter/.nurse-counter/.admin-counter);
    Counter animates them to their intended targets (18/124/3/7).
*/

export default function Dashboard() {

    const navigate = useNavigate()


    return (
        <>

            <Topbar title="Doctor Command Center" status />


            {/* COMMAND HEADER */}

            <section className="doctor-command-header premium-glass">

                <div className="command-copy">

                    <div className="command-eyebrow">
                        <span className="pulse-ring"></span>
                        AI-POWERED CLINICAL WORKSPACE
                    </div>

                    <h1>
                        Good evening,{" "}
                        <span>Dr. Mitchell.</span>
                    </h1>

                    <p>
                        Your clinical command center is ready.
                        Monitor today's patients, consultations and
                        AI-assisted clinical insights from one workspace.
                    </p>

                    <div className="command-actions">

                        <button
                            className="primary-btn"
                            onClick={() => navigate("/doctor/consultation")}
                        >
                            <i className="fa-solid fa-stethoscope"></i>
                            Start Consultation
                        </button>

                        <button
                            className="doctor-secondary-btn"
                            onClick={() => navigate("/doctor/appointments")}
                        >
                            <i className="fa-solid fa-calendar-days"></i>
                            View Schedule
                        </button>

                    </div>

                </div>


                <div className="command-visual">

                    <div className="clinical-orbit orbit-one"></div>
                    <div className="clinical-orbit orbit-two"></div>

                    <div className="doctor-core">

                        <div className="core-icon">
                            <i className="fa-solid fa-heart-pulse"></i>
                        </div>

                        <span>CLINICAL AI</span>

                        <strong>ONLINE</strong>

                    </div>

                </div>

            </section>


            {/* DOCTOR STATISTICS */}

            <section className="doctor-stats-grid">


                <article className="doctor-stat-card premium-glass">

                    <div className="doctor-stat-top">

                        <div className="doctor-stat-icon teal">
                            <i className="fa-solid fa-calendar-check"></i>
                        </div>

                        <span className="doctor-stat-label">
                            Today
                        </span>

                    </div>

                    <div className="doctor-stat-number">
                        <Counter target={18} className="doctor-counter" />
                    </div>

                    <h4>Appointments</h4>

                    <p>
                        6 remaining for today
                    </p>

                    <div className="stat-progress">
                        <span style={{ width: "67%" }}></span>
                    </div>

                </article>


                <article className="doctor-stat-card premium-glass">

                    <div className="doctor-stat-top">

                        <div className="doctor-stat-icon purple">
                            <i className="fa-solid fa-user-group"></i>
                        </div>

                        <span className="doctor-stat-label">
                            Active
                        </span>

                    </div>

                    <div className="doctor-stat-number">
                        <Counter target={124} className="doctor-counter" />
                    </div>

                    <h4>Patients</h4>

                    <p>
                        +12 this month
                    </p>

                    <div className="stat-progress purple-progress">
                        <span style={{ width: "78%" }}></span>
                    </div>

                </article>


                <article className="doctor-stat-card premium-glass">

                    <div className="doctor-stat-top">

                        <div className="doctor-stat-icon blue">
                            <i className="fa-solid fa-comments"></i>
                        </div>

                        <span className="doctor-stat-label">
                            Live
                        </span>

                    </div>

                    <div className="doctor-stat-number">
                        <Counter target={3} className="doctor-counter" />
                    </div>

                    <h4>Consultations</h4>

                    <p>
                        Currently active
                    </p>

                    <div className="stat-progress blue-progress">
                        <span style={{ width: "42%" }}></span>
                    </div>

                </article>


                <article className="doctor-stat-card premium-glass">

                    <div className="doctor-stat-top">

                        <div className="doctor-stat-icon warning">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>

                        <span className="doctor-stat-label warning-text">
                            Attention
                        </span>

                    </div>

                    <div className="doctor-stat-number">
                        <Counter target={7} className="doctor-counter" />
                    </div>

                    <h4>Clinical Alerts</h4>

                    <p>
                        Require review
                    </p>

                    <div className="alert-indicator">
                        <i className="fa-solid fa-arrow-up"></i>
                        2 new alerts
                    </div>

                </article>

            </section>


            {/* MAIN COMMAND GRID */}

            <section className="doctor-command-grid">


                {/* TODAY'S APPOINTMENTS */}

                <article className="clinical-card appointments-panel premium-glass">

                    <div className="clinical-card-header">

                        <div>

                            <span className="section-kicker">
                                CLINICAL SCHEDULE
                            </span>

                            <h2>Today's Appointments</h2>

                        </div>

                        <button
                            className="icon-action"
                            title="View all appointments"
                            onClick={() => navigate("/doctor/appointments")}
                        >
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </button>

                    </div>


                    <div className="appointment-list">


                        <div className="doctor-appointment">

                            <div className="appointment-time">
                                <strong>09:00</strong>
                                <span>AM</span>
                            </div>

                            <div className="appointment-line">
                                <span></span>
                            </div>

                            <div className="appointment-patient">

                                <div className="patient-mini-avatar avatar-teal">
                                    AM
                                </div>

                                <div>
                                    <strong>Amelia Morgan</strong>
                                    <span>Follow-up • Hypertension</span>
                                </div>

                            </div>

                            <span className="appointment-status completed">
                                Completed
                            </span>

                        </div>


                        <div className="doctor-appointment active-appointment">

                            <div className="appointment-time">
                                <strong>10:30</strong>
                                <span>AM</span>
                            </div>

                            <div className="appointment-line">
                                <span></span>
                            </div>

                            <div className="appointment-patient">

                                <div className="patient-mini-avatar avatar-purple">
                                    JM
                                </div>

                                <div>
                                    <strong>James Miller</strong>
                                    <span>Consultation • Chest pain</span>
                                </div>

                            </div>

                            <span className="appointment-status next">
                                Next
                            </span>

                        </div>


                        <div className="doctor-appointment">

                            <div className="appointment-time">
                                <strong>11:15</strong>
                                <span>AM</span>
                            </div>

                            <div className="appointment-line">
                                <span></span>
                            </div>

                            <div className="appointment-patient">

                                <div className="patient-mini-avatar avatar-blue">
                                    OL
                                </div>

                                <div>
                                    <strong>Olivia Lewis</strong>
                                    <span>Follow-up • Arrhythmia</span>
                                </div>

                            </div>

                            <span className="appointment-status waiting">
                                Waiting
                            </span>

                        </div>


                        <div className="doctor-appointment">

                            <div className="appointment-time">
                                <strong>01:30</strong>
                                <span>PM</span>
                            </div>

                            <div className="appointment-line">
                                <span></span>
                            </div>

                            <div className="appointment-patient">

                                <div className="patient-mini-avatar avatar-pink">
                                    RB
                                </div>

                                <div>
                                    <strong>Robert Brooks</strong>
                                    <span>Review • ECG results</span>
                                </div>

                            </div>

                            <span className="appointment-status upcoming">
                                Upcoming
                            </span>

                        </div>

                    </div>


                    <button
                        className="panel-footer-action"
                        onClick={() => navigate("/doctor/appointments")}
                    >
                        View full schedule
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>

                </article>


                {/* AI CLINICAL INTELLIGENCE */}

                <article className="clinical-card ai-command-panel premium-glass">

                    <div className="ai-panel-glow"></div>

                    <div className="clinical-card-header">

                        <div>

                            <span className="section-kicker ai-kicker">
                                MEDICO INTELLIGENCE
                            </span>

                            <h2>AI Clinical Insights</h2>

                        </div>

                        <div className="ai-live-badge">
                            <span></span>
                            LIVE
                        </div>

                    </div>


                    <div className="ai-score">

                        <div className="ai-score-ring">

                            <div>
                                <strong>94%</strong>
                                <span>confidence</span>
                            </div>

                        </div>

                        <div>

                            <strong>Clinical readiness</strong>

                            <p>
                                AI has reviewed today's
                                clinical workload.
                            </p>

                        </div>

                    </div>


                    <div className="ai-insight">

                        <div className="insight-icon">
                            <i className="fa-solid fa-lightbulb"></i>
                        </div>

                        <div>

                            <strong>
                                Priority insight
                            </strong>

                            <p>
                                2 patients have lab values
                                that may require review before
                                their scheduled consultations.
                            </p>

                        </div>

                    </div>


                    <div className="ai-insight purple-insight">

                        <div className="insight-icon">
                            <i className="fa-solid fa-brain"></i>
                        </div>

                        <div>

                            <strong>
                                Pattern detected
                            </strong>

                            <p>
                                Recent patient data shows
                                increased hypertension follow-ups
                                this month.
                            </p>

                        </div>

                    </div>


                    <button
                        className="ai-action"
                        onClick={() => navigate("/doctor/lab-analysis")}
                    >
                        Open Clinical AI
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>

                </article>


                {/* PATIENT RISK */}

                <article className="clinical-card risk-panel premium-glass">

                    <div className="clinical-card-header">

                        <div>

                            <span className="section-kicker">
                                PATIENT INTELLIGENCE
                            </span>

                            <h2>Risk Overview</h2>

                        </div>

                        <button className="text-action">
                            View patients
                        </button>

                    </div>


                    <div className="risk-overview">


                        <div className="risk-total">

                            <div className="risk-circle">
                                <strong>124</strong>
                                <span>Total</span>
                            </div>

                            <div>
                                <strong>Patient Population</strong>
                                <p>Current active records</p>
                            </div>

                        </div>


                        <div className="risk-bars">

                            <div className="risk-row">

                                <div>
                                    <span>High Risk</span>
                                    <strong>8</strong>
                                </div>

                                <div className="risk-bar">
                                    <span className="high-risk" style={{ width: "24%" }}></span>
                                </div>

                            </div>


                            <div className="risk-row">

                                <div>
                                    <span>Moderate</span>
                                    <strong>31</strong>
                                </div>

                                <div className="risk-bar">
                                    <span className="medium-risk" style={{ width: "46%" }}></span>
                                </div>

                            </div>


                            <div className="risk-row">

                                <div>
                                    <span>Stable</span>
                                    <strong>85</strong>
                                </div>

                                <div className="risk-bar">
                                    <span className="low-risk" style={{ width: "82%" }}></span>
                                </div>

                            </div>

                        </div>

                    </div>

                </article>


                {/* RECENT PATIENTS */}

                <article className="clinical-card recent-patients-panel premium-glass">

                    <div className="clinical-card-header">

                        <div>

                            <span className="section-kicker">
                                PATIENTS
                            </span>

                            <h2>Recent Patients</h2>

                        </div>

                        <button
                            className="icon-action"
                            onClick={() => navigate("/doctor/patients")}
                        >
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </button>

                    </div>


                    <div className="recent-patient-list">


                        <div className="recent-patient">

                            <div className="patient-mini-avatar avatar-teal">
                                AM
                            </div>

                            <div className="recent-patient-info">
                                <strong>Amelia Morgan</strong>
                                <span>Hypertension</span>
                            </div>

                            <span className="risk-tag stable">
                                Stable
                            </span>

                        </div>


                        <div className="recent-patient">

                            <div className="patient-mini-avatar avatar-purple">
                                JM
                            </div>

                            <div className="recent-patient-info">
                                <strong>James Miller</strong>
                                <span>Chest pain</span>
                            </div>

                            <span className="risk-tag moderate">
                                Moderate
                            </span>

                        </div>


                        <div className="recent-patient">

                            <div className="patient-mini-avatar avatar-blue">
                                OL
                            </div>

                            <div className="recent-patient-info">
                                <strong>Olivia Lewis</strong>
                                <span>Arrhythmia</span>
                            </div>

                            <span className="risk-tag stable">
                                Stable
                            </span>

                        </div>


                        <div className="recent-patient">

                            <div className="patient-mini-avatar avatar-pink">
                                RB
                            </div>

                            <div className="recent-patient-info">
                                <strong>Robert Brooks</strong>
                                <span>Cardiac monitoring</span>
                            </div>

                            <span className="risk-tag high">
                                High
                            </span>

                        </div>

                    </div>


                    <button
                        className="panel-footer-action"
                        onClick={() => navigate("/doctor/patients")}
                    >
                        Open patient directory
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>

                </article>


                {/* QUICK ACTIONS */}

                <article className="clinical-card quick-actions-panel premium-glass">

                    <div className="clinical-card-header">

                        <div>

                            <span className="section-kicker">
                                WORKSPACE
                            </span>

                            <h2>Quick Actions</h2>

                        </div>

                    </div>


                    <div className="quick-action-grid">


                        <button
                            className="quick-action"
                            onClick={() => navigate("/doctor/consultation")}
                        >
                            <span className="quick-action-icon teal">
                                <i className="fa-solid fa-stethoscope"></i>
                            </span>
                            <strong>Consultation</strong>
                            <small>Start clinical session</small>
                        </button>


                        <button
                            className="quick-action"
                            onClick={() => navigate("/doctor/patients")}
                        >
                            <span className="quick-action-icon purple">
                                <i className="fa-solid fa-user-group"></i>
                            </span>
                            <strong>Patients</strong>
                            <small>Browse patient records</small>
                        </button>


                        <button
                            className="quick-action"
                            onClick={() => navigate("/doctor/lab-analysis")}
                        >
                            <span className="quick-action-icon blue">
                                <i className="fa-solid fa-flask"></i>
                            </span>
                            <strong>Lab Analysis</strong>
                            <small>Analyze lab results</small>
                        </button>


                        <button
                            className="quick-action"
                            onClick={() => navigate("/doctor/medication-assistant")}
                        >
                            <span className="quick-action-icon pink">
                                <i className="fa-solid fa-pills"></i>
                            </span>
                            <strong>Medication AI</strong>
                            <small>Review medications</small>
                        </button>


                        <button
                            className="quick-action"
                            onClick={() => navigate("/doctor/radiology-analysis")}
                        >
                            <span className="quick-action-icon orange">
                                <i className="fa-solid fa-x-ray"></i>
                            </span>
                            <strong>Radiology</strong>
                            <small>Review imaging</small>
                        </button>


                        <button
                            className="quick-action"
                            onClick={() => navigate("/doctor/soap")}
                        >
                            <span className="quick-action-icon green">
                                <i className="fa-solid fa-notes-medical"></i>
                            </span>
                            <strong>SOAP Note</strong>
                            <small>Document consultation</small>
                        </button>

                    </div>

                </article>


                {/* CLINICAL ACTIVITY */}

                <article className="clinical-card activity-panel premium-glass">

                    <div className="clinical-card-header">

                        <div>

                            <span className="section-kicker">
                                LIVE WORKSPACE
                            </span>

                            <h2>Recent Activity</h2>

                        </div>

                        <span className="activity-live">
                            <span></span>
                            Live
                        </span>

                    </div>


                    <div className="activity-timeline">


                        <div className="activity-item">

                            <div className="activity-icon teal">
                                <i className="fa-solid fa-file-waveform"></i>
                            </div>

                            <div className="activity-content">

                                <strong>
                                    Lab report analyzed
                                </strong>

                                <p>
                                    James Miller's blood panel
                                    was reviewed by Clinical AI.
                                </p>

                                <span>8 minutes ago</span>

                            </div>

                        </div>


                        <div className="activity-item">

                            <div className="activity-icon purple">
                                <i className="fa-solid fa-user-check"></i>
                            </div>

                            <div className="activity-content">

                                <strong>
                                    Consultation completed
                                </strong>

                                <p>
                                    Amelia Morgan's follow-up
                                    consultation was finalized.
                                </p>

                                <span>24 minutes ago</span>

                            </div>

                        </div>


                        <div className="activity-item">

                            <div className="activity-icon blue">
                                <i className="fa-solid fa-file-medical"></i>
                            </div>

                            <div className="activity-content">

                                <strong>
                                    Report generated
                                </strong>

                                <p>
                                    Cardiology report generated
                                    for Robert Brooks.
                                </p>

                                <span>41 minutes ago</span>

                            </div>

                        </div>

                    </div>

                </article>


            </section>


            {/* FOOTER */}

            <footer className="doctor-footer">

                <span>
                    MEDICO AI HEALTHCARE
                </span>

                <span>
                    Doctor Command Center
                    <i className="fa-solid fa-circle"></i>
                    Clinical AI Online
                </span>

            </footer>

        </>
    )

}
