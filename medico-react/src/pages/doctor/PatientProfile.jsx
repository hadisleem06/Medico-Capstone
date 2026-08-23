import { useState } from "react"

import { useNavigate } from "react-router-dom"

import Topbar from "../../components/layout/Topbar"

import { useToast } from "../../context/ToastContext"


/*
    Patient Profile — faithful port of pages/doctor/patient-profile.html.

    The sidebar / aurora / profile chrome comes from AppLayout; this
    renders the topbar and the page body (banner, vitals, tabbed panels).

    Behaviours ported from patient-profile.js:
      - TABS: clicking a .profile-tab toggles the .active class on the
        tab and shows the matching .profile-panel. Default active tab is
        "overview" (as in the original markup). Ported to useState.
      - MESSAGE PATIENT: #messagePatientBtn logs + fires a doctor toast.

    Navigation the original wired through document-level [data-page] /
    [data-doctor-action] listeners + window.location is now router
    navigation to the same destinations:
        start-consultation / consultation.html -> /doctor/consultation
        soap.html                              -> /doctor/soap
        appointments.html                      -> /doctor/appointments
*/

export default function PatientProfile() {

    const navigate = useNavigate()

    const { showDoctorToast } = useToast()


    /* ---- tabs (default active = overview) ---- */

    const [activeTab, setActiveTab] = useState("overview")


    /* ---- message patient (ports #messagePatientBtn) ---- */

    function handleMessagePatient() {

        console.log(
            "Message patient requested"
        )

        showDoctorToast(
            "Message sent",
            "Your secure message has been delivered to the patient.",
            "fa-comment-medical"
        )

    }


    return (
        <>

            <Topbar title="Patient Profile" />


            {/* =================================================
                 PATIENT BANNER
            ================================================== */}

            <section className="patient-profile-banner premium-glass">

                <div className="patient-banner-main">

                    <div className="patient-banner-avatar avatar-teal">
                        AM
                    </div>

                    <div className="patient-banner-info">

                        <div className="patient-banner-name">
                            <h1>Amelia Morgan</h1>
                            <span className="risk-tag stable">Stable</span>
                            <span className="status-badge">Active</span>
                        </div>

                        <p className="patient-banner-meta">
                            34 years · Female · MRN #10241
                        </p>

                        <div className="patient-banner-chips">

                            <span className="patient-chip">
                                <i className="fa-solid fa-droplet"></i>
                                O+ Blood
                            </span>

                            <span className="patient-chip">
                                <i className="fa-solid fa-weight-scale"></i>
                                68 kg
                            </span>

                            <span className="patient-chip">
                                <i className="fa-solid fa-ruler-vertical"></i>
                                168 cm
                            </span>

                            <span className="patient-chip">
                                <i className="fa-solid fa-heart-pulse"></i>
                                Hypertension
                            </span>

                        </div>

                    </div>

                </div>

                <div className="patient-banner-actions">

                    <button
                        className="primary-btn"
                        onClick={() => navigate("/doctor/consultation")}
                    >
                        <i className="fa-solid fa-stethoscope"></i>
                        Start Consultation
                    </button>

                    <button
                        className="doctor-secondary-btn"
                        onClick={() => navigate("/doctor/soap")}
                    >
                        <i className="fa-solid fa-notes-medical"></i>
                        New SOAP Note
                    </button>

                    <button
                        className="icon-btn"
                        id="messagePatientBtn"
                        title="Message"
                        onClick={handleMessagePatient}
                    >
                        <i className="fa-solid fa-comment-medical"></i>
                    </button>

                </div>

            </section>


            {/* =================================================
                 VITALS
            ================================================== */}

            <section className="profile-vitals">

                <div className="vital-card">
                    <span className="vital-label">Blood Pressure</span>
                    <strong className="vital-value">128/82</strong>
                    <span className="vital-unit">mmHg</span>
                </div>

                <div className="vital-card">
                    <span className="vital-label">Heart Rate</span>
                    <strong className="vital-value">76</strong>
                    <span className="vital-unit">bpm</span>
                </div>

                <div className="vital-card">
                    <span className="vital-label">Temperature</span>
                    <strong className="vital-value">36.8</strong>
                    <span className="vital-unit">°C</span>
                </div>

                <div className="vital-card">
                    <span className="vital-label">SpO₂</span>
                    <strong className="vital-value">98</strong>
                    <span className="vital-unit">%</span>
                </div>

            </section>


            {/* =================================================
                 TABS
            ================================================== */}

            <section className="profile-tabs-wrap premium-glass">

                <div className="profile-tabs" role="tablist">

                    <button
                        className={
                            "profile-tab" +
                            (activeTab === "overview" ? " active" : "")
                        }
                        data-tab="overview"
                        onClick={() => setActiveTab("overview")}
                    >
                        <i className="fa-solid fa-clipboard-list"></i>
                        Overview
                    </button>

                    <button
                        className={
                            "profile-tab" +
                            (activeTab === "history" ? " active" : "")
                        }
                        data-tab="history"
                        onClick={() => setActiveTab("history")}
                    >
                        <i className="fa-solid fa-clock-rotate-left"></i>
                        History
                    </button>

                    <button
                        className={
                            "profile-tab" +
                            (activeTab === "medications" ? " active" : "")
                        }
                        data-tab="medications"
                        onClick={() => setActiveTab("medications")}
                    >
                        <i className="fa-solid fa-pills"></i>
                        Medications
                    </button>

                    <button
                        className={
                            "profile-tab" +
                            (activeTab === "allergies" ? " active" : "")
                        }
                        data-tab="allergies"
                        onClick={() => setActiveTab("allergies")}
                    >
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Allergies
                    </button>

                    <button
                        className={
                            "profile-tab" +
                            (activeTab === "labs" ? " active" : "")
                        }
                        data-tab="labs"
                        onClick={() => setActiveTab("labs")}
                    >
                        <i className="fa-solid fa-vials"></i>
                        Labs
                    </button>

                    <button
                        className={
                            "profile-tab" +
                            (activeTab === "timeline" ? " active" : "")
                        }
                        data-tab="timeline"
                        onClick={() => setActiveTab("timeline")}
                    >
                        <i className="fa-solid fa-timeline"></i>
                        Timeline
                    </button>

                </div>


                {/* OVERVIEW */}

                <div
                    className={
                        "profile-panel" +
                        (activeTab === "overview" ? " active" : "")
                    }
                    data-panel="overview"
                >

                    <div className="profile-grid">

                        <div className="clinical-card">
                            <span className="section-kicker">PRIMARY DIAGNOSIS</span>
                            <h3 className="profile-card-title">Essential Hypertension</h3>
                            <p className="profile-card-text">
                                Stage 1 hypertension, well controlled on current
                                regimen. Last reviewed Aug 12, 2026. Continue
                                lifestyle modification and monitoring.
                            </p>
                            <span className="risk-tag stable">Stable</span>
                        </div>

                        <div className="clinical-card">
                            <span className="section-kicker">CARE TEAM</span>
                            <ul className="profile-list">
                                <li>
                                    <i className="fa-solid fa-user-doctor"></i>
                                    Dr. Sarah Mitchell — Cardiology
                                </li>
                                <li>
                                    <i className="fa-solid fa-user-nurse"></i>
                                    Nurse J. Adams — Primary care
                                </li>
                                <li>
                                    <i className="fa-solid fa-flask"></i>
                                    Central Lab — Diagnostics
                                </li>
                            </ul>
                        </div>

                        <div className="clinical-card">
                            <span className="section-kicker">NEXT APPOINTMENT</span>
                            <h3 className="profile-card-title">Aug 24, 2026 · 10:30 AM</h3>
                            <p className="profile-card-text">
                                Follow-up consultation — blood pressure review
                                and medication adjustment.
                            </p>
                            <button
                                className="doctor-secondary-btn"
                                onClick={() => navigate("/doctor/appointments")}
                            >
                                <i className="fa-solid fa-calendar-check"></i>
                                View Appointments
                            </button>
                        </div>

                    </div>

                </div>


                {/* HISTORY */}

                <div
                    className={
                        "profile-panel" +
                        (activeTab === "history" ? " active" : "")
                    }
                    data-panel="history"
                >

                    <ul className="profile-list profile-list-lg">
                        <li>
                            <i className="fa-solid fa-notes-medical"></i>
                            <div>
                                <strong>Hypertension diagnosed</strong>
                                <span>Jan 2024 — Started on Amlodipine 5mg</span>
                            </div>
                        </li>
                        <li>
                            <i className="fa-solid fa-heart-pulse"></i>
                            <div>
                                <strong>Cardiac stress test</strong>
                                <span>Mar 2025 — Normal, no ischemia detected</span>
                            </div>
                        </li>
                        <li>
                            <i className="fa-solid fa-syringe"></i>
                            <div>
                                <strong>Appendectomy</strong>
                                <span>2016 — Uncomplicated, full recovery</span>
                            </div>
                        </li>
                    </ul>

                </div>


                {/* MEDICATIONS */}

                <div
                    className={
                        "profile-panel" +
                        (activeTab === "medications" ? " active" : "")
                    }
                    data-panel="medications"
                >

                    <ul className="profile-list profile-list-lg">
                        <li>
                            <i className="fa-solid fa-pills"></i>
                            <div>
                                <strong>Amlodipine 5 mg</strong>
                                <span>Once daily — morning</span>
                            </div>
                            <span className="status-badge">Active</span>
                        </li>
                        <li>
                            <i className="fa-solid fa-pills"></i>
                            <div>
                                <strong>Atorvastatin 10 mg</strong>
                                <span>Once daily — evening</span>
                            </div>
                            <span className="status-badge">Active</span>
                        </li>
                        <li>
                            <i className="fa-solid fa-pills"></i>
                            <div>
                                <strong>Aspirin 75 mg</strong>
                                <span>Once daily — with food</span>
                            </div>
                            <span className="status-badge">Active</span>
                        </li>
                    </ul>

                </div>


                {/* ALLERGIES */}

                <div
                    className={
                        "profile-panel" +
                        (activeTab === "allergies" ? " active" : "")
                    }
                    data-panel="allergies"
                >

                    <ul className="profile-list profile-list-lg">
                        <li>
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <div>
                                <strong>Penicillin</strong>
                                <span>Severe — rash, anaphylaxis risk</span>
                            </div>
                            <span className="risk-tag high">High</span>
                        </li>
                        <li>
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <div>
                                <strong>Pollen</strong>
                                <span>Mild — seasonal rhinitis</span>
                            </div>
                            <span className="risk-tag stable">Low</span>
                        </li>
                    </ul>

                </div>


                {/* LABS */}

                <div
                    className={
                        "profile-panel" +
                        (activeTab === "labs" ? " active" : "")
                    }
                    data-panel="labs"
                >

                    <div className="profile-labs-table">

                        <div className="profile-labs-row profile-labs-head">
                            <span>Test</span>
                            <span>Result</span>
                            <span>Range</span>
                            <span>Status</span>
                        </div>

                        <div className="profile-labs-row">
                            <span>Total Cholesterol</span>
                            <span>182 mg/dL</span>
                            <span>&lt; 200</span>
                            <span className="risk-tag stable">Normal</span>
                        </div>

                        <div className="profile-labs-row">
                            <span>LDL</span>
                            <span>118 mg/dL</span>
                            <span>&lt; 100</span>
                            <span className="risk-tag moderate">High</span>
                        </div>

                        <div className="profile-labs-row">
                            <span>HbA1c</span>
                            <span>5.4 %</span>
                            <span>&lt; 5.7</span>
                            <span className="risk-tag stable">Normal</span>
                        </div>

                        <div className="profile-labs-row">
                            <span>Creatinine</span>
                            <span>0.9 mg/dL</span>
                            <span>0.6 – 1.1</span>
                            <span className="risk-tag stable">Normal</span>
                        </div>

                    </div>

                </div>


                {/* TIMELINE */}

                <div
                    className={
                        "profile-panel" +
                        (activeTab === "timeline" ? " active" : "")
                    }
                    data-panel="timeline"
                >

                    <div className="profile-timeline">

                        <div className="profile-timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-body">
                                <strong>Consultation completed</strong>
                                <span>Aug 12, 2026 — BP reviewed, regimen unchanged</span>
                            </div>
                        </div>

                        <div className="profile-timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-body">
                                <strong>Lab results received</strong>
                                <span>Aug 10, 2026 — Lipid panel, metabolic panel</span>
                            </div>
                        </div>

                        <div className="profile-timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-body">
                                <strong>Prescription renewed</strong>
                                <span>Jul 28, 2026 — Amlodipine, Atorvastatin</span>
                            </div>
                        </div>

                    </div>

                </div>

            </section>

        </>
    )

}
