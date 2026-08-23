import { useEffect, useRef, useState } from "react"

import Topbar from "../../components/layout/Topbar"

import { useToast } from "../../context/ToastContext"

import { soapService } from "../../api/soapService"


/*
    SOAP Notes — faithful port of pages/doctor/soap.html.

    The aurora / sidebar / profile chrome comes from AppLayout;
    this renders the topbar plus the topline controls and the
    four-section SOAP grid.

    Behaviours ported from soap.js:
      - autosave indicator: typing in any .soap-textarea flips
        #soapAutosave to "Saving..." and back to "Draft saved"
        after 800ms (debounced).
      - patient switch: changing #soapPatient logs + fires a
        "Patient loaded" doctor toast.
      - save note: the Save Note button disables + swaps to a
        spinner (now via soapService.save, same 900ms delay),
        then fires the "SOAP note saved" doctor toast.

    The Template select had no handler in the original, so it
    stays uncontrolled / inert. The four SOAP textareas are only
    watched for the autosave ping (their values are never read
    back), so they stay uncontrolled too. The original had no
    validation, so none is added.
*/

export default function Soap() {

    const { showDoctorToast } = useToast()


    /* ---- patient (read back in the toast + save) ---- */

    const [patient, setPatient] = useState("Amelia Morgan")


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


    /* ---- patient switch ---- */

    function handlePatientChange(event) {

        const value = event.target.value

        setPatient(value)

        console.log(
            "SOAP patient switched to",
            value
        )

        showDoctorToast(
            "Patient loaded",
            `Now documenting for ${value}.`,
            "fa-user"
        )

    }


    /* ---- save note ---- */

    const [saving, setSaving] = useState(false)


    function handleSave() {

        setSaving(true)

        soapService
            .save({ patient })
            .then(() => {

                setSaving(false)

                showDoctorToast(
                    "SOAP note saved",
                    `Note added to ${patient}'s record.`,
                    "fa-notes-medical"
                )

            })

    }


    return (
        <>

            <Topbar title="SOAP Notes" />


            {/* =================================================
                 TOPLINE
            ================================================== */}

            <section className="soap-topline premium-glass">

                <div className="soap-topline-title">
                    <span className="section-kicker">CLINICAL DOCUMENTATION</span>
                    <h2>New SOAP Note</h2>
                    <p>Structured Subjective · Objective · Assessment · Plan</p>
                </div>

                <div className="soap-topline-controls">

                    <div className="soap-select">
                        <label htmlFor="soapPatient">Patient</label>
                        <select
                            id="soapPatient"
                            value={patient}
                            onChange={handlePatientChange}
                        >
                            <option value="Amelia Morgan">Amelia Morgan</option>
                            <option value="James Miller">James Miller</option>
                            <option value="Robert Brooks">Robert Brooks</option>
                            <option value="Olivia Lewis">Olivia Lewis</option>
                        </select>
                    </div>

                    <div className="soap-select">
                        <label htmlFor="soapTemplate">Template</label>
                        <select id="soapTemplate">
                            <option value="general">General</option>
                            <option value="cardiology">Cardiology</option>
                            <option value="followup">Follow-up</option>
                        </select>
                    </div>

                    <span className="consult-autosave" id="soapAutosave">
                        {autosaveState === "saving" ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-cloud"></i>
                                Draft saved
                            </>
                        )}
                    </span>

                    <button
                        className="primary-btn"
                        id="saveSoapBtn"
                        disabled={saving}
                        onClick={handleSave}
                    >
                        <i
                            className={
                                "fa-solid " +
                                (saving
                                    ? "fa-spinner fa-spin"
                                    : "fa-floppy-disk")
                            }
                        ></i>
                        {saving ? "Saving..." : "Save Note"}
                    </button>

                </div>

            </section>


            {/* =================================================
                 SOAP SECTIONS
            ================================================== */}

            <section className="soap-grid">

                <div className="soap-section premium-glass">
                    <div className="soap-section-head">
                        <span className="soap-letter teal">S</span>
                        <div>
                            <h3>Subjective</h3>
                            <p>Symptoms in the patient's own words</p>
                        </div>
                    </div>
                    <textarea
                        className="soap-textarea"
                        rows="6"
                        placeholder="Chief complaint, history of present illness, review of systems..."
                        onChange={handleEditorInput}
                    ></textarea>
                </div>

                <div className="soap-section premium-glass">
                    <div className="soap-section-head">
                        <span className="soap-letter purple">O</span>
                        <div>
                            <h3>Objective</h3>
                            <p>Measurable findings and vitals</p>
                        </div>
                    </div>
                    <textarea
                        className="soap-textarea"
                        rows="6"
                        placeholder="Vitals, physical examination, lab and imaging results..."
                        onChange={handleEditorInput}
                    ></textarea>
                </div>

                <div className="soap-section premium-glass">
                    <div className="soap-section-head">
                        <span className="soap-letter blue">A</span>
                        <div>
                            <h3>Assessment</h3>
                            <p>Diagnosis and clinical impression</p>
                        </div>
                    </div>
                    <textarea
                        className="soap-textarea"
                        rows="6"
                        placeholder="Primary and differential diagnoses, clinical reasoning..."
                        onChange={handleEditorInput}
                    ></textarea>
                </div>

                <div className="soap-section premium-glass">
                    <div className="soap-section-head">
                        <span className="soap-letter orange">P</span>
                        <div>
                            <h3>Plan</h3>
                            <p>Treatment and next steps</p>
                        </div>
                    </div>
                    <textarea
                        className="soap-textarea"
                        rows="6"
                        placeholder="Medications, investigations, referrals, follow-up..."
                        onChange={handleEditorInput}
                    ></textarea>
                </div>

            </section>

        </>
    )

}
