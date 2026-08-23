import { useState } from "react"

import Topbar from "../../components/layout/Topbar"

import FilterDropdown from "../../components/ui/FilterDropdown"

import { useToast } from "../../context/ToastContext"

import { labService } from "../../api/labService"


/*
    Lab Analysis — faithful port of
    pages/doctor/lab-analysis.html + assets/js/lab-analysis.js.

    Behaviour (ports lab-analysis.js):
      - one soap-select FilterDropdown picks the report; changing it
        logs "Lab report switched to <value>" and toasts "Report loaded"
        (the original logged on change — the radiology page did not).
      - "Re-run AI Analysis" runs through labService.analyze() which
        resolves after the original's 900ms fake delay; the button
        shows the spinner + "Analyzing..." while pending, then toasts.
      - the labs table and the AI INTERPRETATION list are static,
        exactly as authored. The <, >, – glyphs are written as HTML
        entities / literal characters to match the source.
*/


/* ---- soap-select options (id="labReportFilter") ---- */

const labReportOptions = [
    { value: "Lipid Panel — Aug 15",     label: "Lipid Panel — Aug 15",     icon: "fa-flask" },
    { value: "Metabolic Panel — Aug 12", label: "Metabolic Panel — Aug 12", icon: "fa-flask" },
    { value: "CBC — Aug 10",             label: "CBC — Aug 10",             icon: "fa-flask" },
]


export default function LabAnalysis() {

    const { showDoctorToast } = useToast()


    /* ---- report selection + spinner state ---- */

    const [report, setReport] = useState("Lipid Panel — Aug 15")

    const [analyzing, setAnalyzing] = useState(false)


    /* ---- change handler (ports labReportFilter change listener) ---- */

    function handleReportChange(value) {

        setReport(value)

        console.log(
            "Lab report switched to",
            value
        )

        showDoctorToast(
            "Report loaded",
            `Showing ${value}.`,
            "fa-vials"
        )

    }


    /* ---- re-run analysis (ports analyzeLabBtn — 900ms setTimeout) ---- */

    function handleAnalyze() {

        setAnalyzing(true)

        labService
            .analyze({ report })
            .then(() => {

                setAnalyzing(false)

                showDoctorToast(
                    "Analysis complete",
                    "AI interpretation has been updated.",
                    "fa-wand-magic-sparkles"
                )

            })

    }


    return (
        <>

            <Topbar title="Lab Analysis" />


            {/* =================================================
                 HERO
            ================================================== */}

            <section className="doctor-page-hero">

                <div className="doctor-hero-content">

                    <span className="doctor-eyebrow">
                        <i className="fa-solid fa-vials"></i>
                        AI LAB ANALYSIS
                    </span>

                    <h1>
                        Understand every{" "}
                        <span>result.</span>
                    </h1>

                    <p>
                        Upload a report and let the assistant flag abnormal
                        values, surface trends and summarise the clinical
                        picture in seconds.
                    </p>

                </div>

                <div className="doctor-hero-visual">
                    <i className="fa-solid fa-vials doctor-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 WORKSPACE
            ================================================== */}

            <section className="consult-layout lab-layout">

                {/* LAB REPORT */}

                <div className="doctor-panel premium-glass">

                    <span className="section-kicker">LAB REPORT</span>

                    <div className="soap-select">
                        <label>Report</label>
                        <FilterDropdown
                            id="labReportFilter"
                            options={labReportOptions}
                            value={report}
                            onChange={handleReportChange}
                        />
                    </div>

                    <div id="labResults">

                        <div className="profile-labs-table">

                            <div className="profile-labs-row profile-labs-head">
                                <span>Test</span>
                                <span>Result</span>
                                <span>Range</span>
                                <span>Flag</span>
                            </div>

                            <div className="profile-labs-row">
                                <span>Total Cholesterol</span>
                                <span>214 mg/dL</span>
                                <span>&lt; 200</span>
                                <span className="risk-tag moderate">High</span>
                            </div>

                            <div className="profile-labs-row">
                                <span>LDL</span>
                                <span>142 mg/dL</span>
                                <span>&lt; 100</span>
                                <span className="risk-tag high">High</span>
                            </div>

                            <div className="profile-labs-row">
                                <span>HDL</span>
                                <span>48 mg/dL</span>
                                <span>&gt; 40</span>
                                <span className="risk-tag stable">Normal</span>
                            </div>

                            <div className="profile-labs-row">
                                <span>Triglycerides</span>
                                <span>168 mg/dL</span>
                                <span>&lt; 150</span>
                                <span className="risk-tag moderate">High</span>
                            </div>

                            <div className="profile-labs-row">
                                <span>Glucose (fasting)</span>
                                <span>94 mg/dL</span>
                                <span>70 – 100</span>
                                <span className="risk-tag stable">Normal</span>
                            </div>

                        </div>

                    </div>

                    <button
                        className="primary-btn"
                        id="analyzeLabBtn"
                        onClick={handleAnalyze}
                        disabled={analyzing}
                    >
                        <i
                            className={
                                "fa-solid " +
                                (analyzing ? "fa-spinner fa-spin" : "fa-wand-magic-sparkles")
                            }
                        ></i>
                        {analyzing ? "Analyzing..." : "Re-run AI Analysis"}
                    </button>

                </div>


                {/* AI INTERPRETATION */}

                <aside className="doctor-panel premium-glass">

                    <span className="section-kicker">AI INTERPRETATION</span>

                    <div className="lab-ring-wrap">
                        <div className="population-ring">
                            <strong>92%</strong>
                            <span>AI confidence</span>
                        </div>
                    </div>

                    <ul className="profile-list profile-list-lg">

                        <li>
                            <i className="fa-solid fa-arrow-trend-up"></i>
                            <div>
                                <strong>LDL cholesterol elevated</strong>
                                <span>142 mg/dL — above target for cardiovascular risk</span>
                            </div>
                            <span className="risk-tag high">Action</span>
                        </li>

                        <li>
                            <i className="fa-solid fa-droplet"></i>
                            <div>
                                <strong>Triglycerides borderline</strong>
                                <span>168 mg/dL — lifestyle modification advised</span>
                            </div>
                            <span className="risk-tag moderate">Watch</span>
                        </li>

                        <li>
                            <i className="fa-solid fa-heart-pulse"></i>
                            <div>
                                <strong>HDL within range</strong>
                                <span>48 mg/dL — protective level maintained</span>
                            </div>
                            <span className="risk-tag stable">Normal</span>
                        </li>

                        <li>
                            <i className="fa-solid fa-notes-medical"></i>
                            <div>
                                <strong>Overall cardiovascular risk</strong>
                                <span>Moderate — consider statin optimisation and recheck in 12 weeks</span>
                            </div>
                            <span className="risk-tag moderate">Moderate</span>
                        </li>

                    </ul>

                </aside>

            </section>

        </>
    )

}
