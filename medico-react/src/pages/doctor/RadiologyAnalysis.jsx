import { useState } from "react"

import Topbar from "../../components/layout/Topbar"

import FilterDropdown from "../../components/ui/FilterDropdown"

import { useToast } from "../../context/ToastContext"

import { radiologyService } from "../../api/radiologyService"


/*
    Radiology Analysis — faithful port of
    pages/doctor/radiology-analysis.html + assets/js/radiology-analysis.js.

    Behaviour (ports radiology-analysis.js):
      - two soap-select FilterDropdowns pick modality + study; each
        change toasts "Study loaded" (the original re-rendered the
        viewer label text, but the authored .radiology-viewer span is
        static "Chest X-Ray · PA view" and stays static here).
      - "Generate Report" runs through radiologyService.generateReport()
        which resolves after the original's 900ms fake delay; the button
        shows the spinner + "Generating..." while pending, then toasts.
      - "Download" toasts synchronously.
      - the AI FINDINGS list is static, exactly as authored.
*/


/* ---- soap-select options (id="radModality" / id="radStudy") ---- */

const radModalityOptions = [
    { value: "Chest X-Ray",  label: "Chest X-Ray",  icon: "fa-x-ray" },
    { value: "CT Head",      label: "CT Head",      icon: "fa-x-ray" },
    { value: "MRI Brain",    label: "MRI Brain",    icon: "fa-x-ray" },
    { value: "Abdominal US", label: "Abdominal US", icon: "fa-x-ray" },
]


const radStudyOptions = [
    { value: "#A-2291", label: "Study #A-2291", icon: "fa-images" },
    { value: "#A-2288", label: "Study #A-2288", icon: "fa-images" },
    { value: "#A-2280", label: "Study #A-2280", icon: "fa-images" },
]


export default function RadiologyAnalysis() {

    const { showDoctorToast } = useToast()


    /* ---- study selection + spinner state ---- */

    const [modality, setModality] = useState("Chest X-Ray")

    const [study, setStudy] = useState("#A-2291")

    const [generating, setGenerating] = useState(false)


    /* ---- change handlers (ports the select change listeners) ---- */

    function handleModalityChange(value) {

        setModality(value)

        showDoctorToast(
            "Study loaded",
            `Showing ${value} · ${study}.`,
            "fa-x-ray"
        )

    }


    function handleStudyChange(value) {

        setStudy(value)

        showDoctorToast(
            "Study loaded",
            `Showing ${modality} · ${value}.`,
            "fa-x-ray"
        )

    }


    /* ---- generate report (ports genRadReportBtn — 900ms setTimeout) ---- */

    function handleGenerate() {

        setGenerating(true)

        radiologyService
            .generateReport({ modality, study })
            .then(() => {

                setGenerating(false)

                showDoctorToast(
                    "Report generated",
                    "Radiology report is ready to review.",
                    "fa-file-medical"
                )

            })

    }


    /* ---- download (ports downloadRadBtn — synchronous) ---- */

    function handleDownload() {

        showDoctorToast(
            "Download started",
            "Preparing the imaging report PDF.",
            "fa-download"
        )

    }


    return (
        <>

            <Topbar title="Radiology Analysis" />


            {/* =================================================
                 HERO
            ================================================== */}

            <section className="doctor-page-hero">

                <div className="doctor-hero-content">

                    <span className="doctor-eyebrow">
                        <i className="fa-solid fa-x-ray"></i>
                        AI RADIOLOGY
                    </span>

                    <h1>
                        Read imaging with{" "}
                        <span>confidence.</span>
                    </h1>

                    <p>
                        Load a study and review AI-detected findings with
                        severity flags, then generate a structured
                        radiology report in one click.
                    </p>

                </div>

                <div className="doctor-hero-visual">
                    <i className="fa-solid fa-x-ray doctor-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 WORKSPACE
            ================================================== */}

            <section className="consult-layout rad-layout">

                {/* STUDY */}

                <div className="doctor-panel premium-glass">

                    <span className="section-kicker">STUDY</span>

                    <div className="rad-controls">

                        <div className="soap-select">
                            <label>Modality</label>
                            <FilterDropdown
                                id="radModality"
                                options={radModalityOptions}
                                value={modality}
                                onChange={handleModalityChange}
                            />
                        </div>

                        <div className="soap-select">
                            <label>Study</label>
                            <FilterDropdown
                                id="radStudy"
                                options={radStudyOptions}
                                value={study}
                                onChange={handleStudyChange}
                            />
                        </div>

                    </div>

                    <div className="radiology-viewer">
                        <i className="fa-solid fa-x-ray radiology-viewer-icon"></i>
                        <span>Chest X-Ray · PA view</span>
                    </div>

                </div>


                {/* AI FINDINGS */}

                <aside className="doctor-panel premium-glass">

                    <span className="section-kicker">AI FINDINGS</span>

                    <ul className="profile-list profile-list-lg">

                        <li>
                            <i className="fa-solid fa-circle-check"></i>
                            <div>
                                <strong>No acute cardiopulmonary process</strong>
                                <span>Overall impression within normal limits</span>
                            </div>
                            <span className="risk-tag stable">Normal</span>
                        </li>

                        <li>
                            <i className="fa-solid fa-heart"></i>
                            <div>
                                <strong>Mild cardiomegaly</strong>
                                <span>Cardiothoracic ratio slightly increased</span>
                            </div>
                            <span className="risk-tag moderate">Watch</span>
                        </li>

                        <li>
                            <i className="fa-solid fa-lungs"></i>
                            <div>
                                <strong>Clear lung fields</strong>
                                <span>No consolidation or infiltrate detected</span>
                            </div>
                            <span className="risk-tag stable">Normal</span>
                        </li>

                        <li>
                            <i className="fa-solid fa-droplet-slash"></i>
                            <div>
                                <strong>No pleural effusion</strong>
                                <span>Costophrenic angles preserved bilaterally</span>
                            </div>
                            <span className="risk-tag stable">Normal</span>
                        </li>

                    </ul>

                    <div className="rad-actions">

                        <button
                            className="primary-btn"
                            id="genRadReportBtn"
                            onClick={handleGenerate}
                            disabled={generating}
                        >
                            <i
                                className={
                                    "fa-solid " +
                                    (generating ? "fa-spinner fa-spin" : "fa-file-medical")
                                }
                            ></i>
                            {generating ? "Generating..." : "Generate Report"}
                        </button>

                        <button
                            className="doctor-secondary-btn"
                            id="downloadRadBtn"
                            onClick={handleDownload}
                        >
                            <i className="fa-solid fa-download"></i>
                            Download
                        </button>

                    </div>

                </aside>

            </section>

        </>
    )

}
