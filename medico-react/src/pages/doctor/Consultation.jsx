import { useEffect, useRef, useState } from "react"

import { useNavigate } from "react-router-dom"

import Topbar from "../../components/layout/Topbar"

import { useToast } from "../../context/ToastContext"


/* =========================================================
   DURATION FORMAT  (ports formatDuration)
========================================================= */

function formatDuration(total) {

    const minutes =
        Math.floor(total / 60)

    const secs =
        total % 60

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    )

}


/* =========================================================
   LIVE CONSULTATION
========================================================= */

export default function Consultation() {

    const navigate = useNavigate()

    const { showDoctorToast } = useToast()


    /* ---- session timer ---- */

    const [seconds, setSeconds] = useState(0)

    const [running, setRunning] = useState(true)


    useEffect(
        () => {

            if (!running) {
                return
            }

            const timerId =
                setInterval(
                    () => setSeconds(current => current + 1),
                    1000
                )

            return () => clearInterval(timerId)

        },
        [running]
    )


    /* ---- autosave indicator ---- */

    const [autosaveState, setAutosaveState] = useState("saved")

    const saveTimeoutRef = useRef(null)


    useEffect(
        () => () => clearTimeout(saveTimeoutRef.current),
        []
    )


    function handleEditorInput() {

        setAutosaveState("saving")

        clearTimeout(saveTimeoutRef.current)

        saveTimeoutRef.current =
            setTimeout(
                () => setAutosaveState("saved"),
                800
            )

    }


    /* ---- save draft ---- */

    function handleSaveDraft() {

        console.log("Consultation draft saved")

        showDoctorToast(
            "Draft saved",
            "Your consultation notes have been saved.",
            "fa-floppy-disk"
        )

    }


    /* ---- complete consultation ---- */

    function handleComplete() {

        setRunning(false)

        console.log(
            "Consultation completed at",
            formatDuration(seconds)
        )

        showDoctorToast(
            "Consultation complete",
            "Encounter closed and saved to the patient record.",
            "fa-circle-check"
        )

    }


    return (
        <>

            <Topbar title="Live Consultation" />


            {/* =================================================
                 CONSULTATION HEADER
            ================================================== */}

            <section className="consultation-header premium-glass">

                <div className="patient-banner-main">

                    <div className="patient-banner-avatar avatar-purple">
                        JM
                    </div>

                    <div className="patient-banner-info">

                        <div className="patient-banner-name">
                            <h1>James Miller</h1>
                            <span className="risk-tag moderate">Moderate</span>
                        </div>

                        <p className="patient-banner-meta">
                            52 years · Male · MRN #10255 · Chest pain
                        </p>

                    </div>

                </div>

                <div className="consult-session">

                    <div className="consult-timer" id="consultTimer">
                        <i className="fa-solid fa-circle consult-live-dot"></i>
                        <span id="consultTimerValue">
                            {formatDuration(seconds)}
                        </span>
                    </div>

                    <button
                        className="primary-btn"
                        id="completeConsultBtn"
                        onClick={handleComplete}
                    >
                        <i className="fa-solid fa-circle-check"></i>
                        Complete Consultation
                    </button>

                </div>

            </section>


            {/* =================================================
                 VITALS
            ================================================== */}

            <section className="profile-vitals">

                <div className="vital-card">
                    <span className="vital-label">Blood Pressure</span>
                    <strong className="vital-value">146/94</strong>
                    <span className="vital-unit">mmHg</span>
                </div>

                <div className="vital-card">
                    <span className="vital-label">Heart Rate</span>
                    <strong className="vital-value">92</strong>
                    <span className="vital-unit">bpm</span>
                </div>

                <div className="vital-card">
                    <span className="vital-label">Temperature</span>
                    <strong className="vital-value">37.1</strong>
                    <span className="vital-unit">°C</span>
                </div>

                <div className="vital-card">
                    <span className="vital-label">SpO₂</span>
                    <strong className="vital-value">96</strong>
                    <span className="vital-unit">%</span>
                </div>

            </section>


            {/* =================================================
                 WORKSPACE
            ================================================== */}

            <section className="consult-layout">

                {/* EDITOR */}

                <div className="consult-editor premium-glass">

                    <span className="section-kicker">CONSULTATION NOTES</span>

                    <div className="consult-field">
                        <label htmlFor="chiefComplaint">Chief complaint</label>
                        <textarea
                            id="chiefComplaint"
                            rows="3"
                            placeholder="Reason for visit..."
                            defaultValue="Intermittent chest tightness on exertion for the past week."
                            onChange={handleEditorInput}
                        ></textarea>
                    </div>

                    <div className="consult-field">
                        <label htmlFor="clinicalNotes">Clinical notes</label>
                        <textarea
                            id="clinicalNotes"
                            rows="8"
                            placeholder="History, examination findings, assessment..."
                            onChange={handleEditorInput}
                        ></textarea>
                    </div>

                    <div className="consult-editor-actions">

                        <button
                            className="doctor-secondary-btn"
                            id="saveDraftBtn"
                            onClick={handleSaveDraft}
                        >
                            <i className="fa-solid fa-floppy-disk"></i>
                            Save Draft
                        </button>

                        <span className="consult-autosave" id="consultAutosave">
                            {autosaveState === "saving" ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-cloud"></i>
                                    All changes saved
                                </>
                            )}
                        </span>

                    </div>

                </div>


                {/* QUICK LINKS */}

                <aside className="consult-side">

                    <div className="consult-quicklinks premium-glass">

                        <span className="section-kicker">CLINICAL TOOLS</span>

                        <button
                            className="quicklink"
                            onClick={() => navigate("/doctor/soap")}
                        >
                            <div className="quicklink-icon teal">
                                <i className="fa-solid fa-notes-medical"></i>
                            </div>
                            <div className="quicklink-text">
                                <strong>SOAP Note</strong>
                                <span>Structured documentation</span>
                            </div>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>

                        <button
                            className="quicklink"
                            onClick={() => navigate("/doctor/icd10")}
                        >
                            <div className="quicklink-icon purple">
                                <i className="fa-solid fa-code"></i>
                            </div>
                            <div className="quicklink-text">
                                <strong>ICD-10 Codes</strong>
                                <span>Assign diagnoses</span>
                            </div>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>

                        <button
                            className="quicklink"
                            onClick={() => navigate("/doctor/investigation")}
                        >
                            <div className="quicklink-icon blue">
                                <i className="fa-solid fa-microscope"></i>
                            </div>
                            <div className="quicklink-text">
                                <strong>Investigations</strong>
                                <span>Order tests</span>
                            </div>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>

                        <button
                            className="quicklink"
                            onClick={() => navigate("/doctor/medication-assistant")}
                        >
                            <div className="quicklink-icon orange">
                                <i className="fa-solid fa-pills"></i>
                            </div>
                            <div className="quicklink-text">
                                <strong>Medication AI</strong>
                                <span>Prescribe safely</span>
                            </div>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>

                    </div>

                </aside>

            </section>

        </>
    )

}
