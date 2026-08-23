import { useState } from "react"

import Topbar from "../../components/layout/Topbar"

import Modal from "../../components/ui/Modal"

import FilterDropdown from "../../components/ui/FilterDropdown"

import { useToast } from "../../context/ToastContext"

import {
    doctorReports,
    reportStatusBadge,
    reportTypeOptions,
    reportStatusOptions,
} from "../../data/reports"


/*
    Reports — faithful port of pages/doctor/reports.html +
    assets/js/reports.js.

    Behaviour (ports reports.js — all synchronous, no service):
      - search matches the report `title` (original data-title);
        type / status filters match `type` / `status`
      - "New Report" opens the generate modal; submit toasts
        synchronously and does NOT append to the library (exactly
        like the original). reportType + reportPatient keep their
        `required` (matching the source DOM); the type-required
        toast is the faithful fallback behind native validation.
      - each card's eye button toasts "Opening report"; the aside
        "Download PDF" toasts "Download started".
      - the PREVIEW aside is static, exactly as authored.
*/

export default function Reports() {

    const { showDoctorToast } = useToast()


    /* ---- search + filters ---- */

    const [search, setSearch] = useState("")

    const [typeValue, setTypeValue] = useState("")

    const [statusValue, setStatusValue] = useState("")


    /* ---- generate-report modal + form ---- */

    const [modalOpen, setModalOpen] = useState(false)

    const [reportType, setReportType] = useState("")

    const [reportPatient, setReportPatient] = useState("")

    const [reportTemplate, setReportTemplate] = useState("Standard")

    const [reportNotes, setReportNotes] = useState("")


    /* ---- derived: visible reports (ports applyFilters) ---- */

    const term = search.trim().toLowerCase()

    const visible = doctorReports.filter(report => {

        const matchesSearch =
            !term || report.title.includes(term)

        const matchesType =
            !typeValue || report.type === typeValue

        const matchesStatus =
            !statusValue || report.status === statusValue

        return matchesSearch && matchesType && matchesStatus

    })


    /* ---- view a report (ports the report-view click) ---- */

    function handleView(report) {

        showDoctorToast(
            "Opening report",
            `Loading ${report.name} in the preview.`,
            "fa-eye"
        )

    }


    /* ---- download the preview (ports downloadReportBtn) ---- */

    function handleDownload() {

        showDoctorToast(
            "Download started",
            "Preparing the report PDF.",
            "fa-download"
        )

    }


    /* ---- generate (ports the reportForm submit — synchronous) ---- */

    function handleSubmit(event) {

        event.preventDefault()

        if (!reportType) {

            showDoctorToast(
                "Report type required",
                "Choose a report type to continue.",
                "fa-triangle-exclamation"
            )

            return

        }

        console.log(
            "Generating report:",
            {
                type: reportType,
                patient: reportPatient,
                template: reportTemplate,
                notes: reportNotes,
            }
        )

        setModalOpen(false)


        /* reset the form (ports form.reset) */

        setReportType("")
        setReportPatient("")
        setReportTemplate("Standard")
        setReportNotes("")

        showDoctorToast(
            "Report generated",
            "The new report has been added to the library.",
            "fa-file-medical"
        )

    }


    return (
        <>

            <Topbar title="Clinical Reports" />


            {/* =================================================
                 HERO
            ================================================== */}

            <section className="doctor-page-hero">

                <div className="doctor-hero-content">

                    <span className="doctor-eyebrow">
                        <i className="fa-solid fa-file-medical"></i>
                        CLINICAL REPORTS
                    </span>

                    <h1>
                        Generate and track{" "}
                        <span>reports.</span>
                    </h1>

                    <p>
                        Browse every clinical document, filter by type
                        or status, preview the content and generate a
                        fresh report in a couple of clicks.
                    </p>

                </div>

                <div className="doctor-hero-visual">
                    <i className="fa-solid fa-file-medical doctor-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 WORKSPACE
            ================================================== */}

            <section className="consult-layout reports-layout">

                {/* REPORT LIBRARY */}

                <div className="reports-workspace premium-glass">

                    <div className="reports-toolbar">

                        <div className="reports-toolbar-title">
                            <span className="section-kicker">REPORT LIBRARY</span>
                            <h2>All reports</h2>
                        </div>

                        <div className="reports-controls">

                            <div className="doctor-search">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input
                                    type="text"
                                    id="reportSearch"
                                    placeholder="Search reports..."
                                    value={search}
                                    onChange={event => setSearch(event.target.value)}
                                />
                            </div>

                            <FilterDropdown
                                id="reportTypeFilter"
                                options={reportTypeOptions}
                                value={typeValue}
                                onChange={setTypeValue}
                            />

                            <FilterDropdown
                                id="reportStatusFilter"
                                options={reportStatusOptions}
                                value={statusValue}
                                onChange={setStatusValue}
                            />

                            <button
                                className="primary-btn"
                                id="newReportBtn"
                                onClick={() => setModalOpen(true)}
                            >
                                <i className="fa-solid fa-plus"></i>
                                New Report
                            </button>

                        </div>

                    </div>


                    {/* REPORT LIST */}

                    <div className="reports-list" id="reportsList">

                        {visible.map(report => {

                            const badge =
                                reportStatusBadge[report.status]

                            return (

                                <article
                                    className="report-card"
                                    data-title={report.title}
                                    data-type={report.type}
                                    data-status={report.status}
                                    key={report.title}
                                >

                                    <div className={"report-card-icon " + report.tint}>
                                        <i className={"fa-solid " + report.icon}></i>
                                    </div>

                                    <div className="report-card-body">
                                        <strong>{report.name}</strong>
                                        <span>{report.patient} · {report.date}</span>
                                    </div>

                                    <span className="report-card-type">
                                        {report.typeLabel}
                                    </span>

                                    <span className={"status-badge " + report.status}>
                                        <i className={"fa-solid " + badge.icon}></i>
                                        {badge.label}
                                    </span>

                                    <button
                                        type="button"
                                        className="icon-btn report-view"
                                        aria-label="View report"
                                        onClick={() => handleView(report)}
                                    >
                                        <i className="fa-solid fa-eye"></i>
                                    </button>

                                </article>

                            )

                        })}

                    </div>


                    {/* EMPTY STATE */}

                    {visible.length === 0 && (

                        <div className="doctor-empty-state reports-empty" id="reportsEmpty">
                            <div className="empty-state-icon">
                                <i className="fa-solid fa-folder-open"></i>
                            </div>
                            <p>No reports match your filters.</p>
                        </div>

                    )}

                </div>


                {/* PREVIEW */}

                <aside className="doctor-panel premium-glass">

                    <span className="section-kicker">PREVIEW</span>

                    <div className="report-preview">

                        <div className="report-preview-title">
                            <div className="report-card-icon teal">
                                <i className="fa-solid fa-stethoscope"></i>
                            </div>
                            <div>
                                <strong>Consultation Summary</strong>
                                <span>Amelia Morgan · Aug 16, 2026</span>
                            </div>
                        </div>

                        <ul className="report-preview-meta">
                            <li>
                                <span>Author</span>
                                <strong>Dr. Sarah Mitchell</strong>
                            </li>
                            <li>
                                <span>Department</span>
                                <strong>Cardiology</strong>
                            </li>
                            <li>
                                <span>Status</span>
                                <strong>Final</strong>
                            </li>
                        </ul>

                        <div className="report-preview-body">
                            <p>
                                <strong>Impression.</strong>
                                Stable angina, well controlled on current
                                therapy. No new ischaemic changes on ECG.
                            </p>
                            <p>
                                <strong>Plan.</strong>
                                Continue statin and beta blocker, review
                                lipid panel in 12 weeks and reinforce
                                lifestyle measures.
                            </p>
                        </div>

                    </div>

                    <button
                        className="doctor-secondary-btn"
                        id="downloadReportBtn"
                        onClick={handleDownload}
                    >
                        <i className="fa-solid fa-download"></i>
                        Download PDF
                    </button>

                </aside>

            </section>


            {/* =================================================
                 GENERATE REPORT MODAL
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
                                <i className="fa-solid fa-file-circle-plus"></i>
                                REPORT GENERATOR
                            </span>

                            <h2>
                                Generate Report
                            </h2>

                            <p>
                                Create a new clinical report for a patient.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="modal-close"
                            id="closeReportModal"
                            onClick={() => setModalOpen(false)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                    </div>


                    {/* MODAL BODY */}

                    <form
                        className="appointment-form"
                        id="reportForm"
                        onSubmit={handleSubmit}
                    >

                        {/* REPORT TYPE */}

                        <div className="form-group">

                            <label htmlFor="reportType">
                                <i className="fa-solid fa-file-lines"></i>
                                Report Type
                            </label>

                            <div className="form-input-wrapper">

                                <i className="fa-solid fa-file-lines"></i>

                                <select
                                    id="reportType"
                                    required
                                    value={reportType}
                                    onChange={event => setReportType(event.target.value)}
                                >
                                    <option value="">Select type</option>
                                    <option value="Consultation Summary">Consultation Summary</option>
                                    <option value="Lab Report">Lab Report</option>
                                    <option value="Radiology Report">Radiology Report</option>
                                    <option value="Discharge Summary">Discharge Summary</option>
                                </select>

                            </div>

                        </div>


                        {/* PATIENT */}

                        <div className="form-group">

                            <label htmlFor="reportPatient">
                                <i className="fa-solid fa-user"></i>
                                Patient
                            </label>

                            <div className="form-input-wrapper">

                                <i className="fa-solid fa-user"></i>

                                <select
                                    id="reportPatient"
                                    required
                                    value={reportPatient}
                                    onChange={event => setReportPatient(event.target.value)}
                                >
                                    <option value="">Select patient</option>
                                    <option value="Amelia Morgan">Amelia Morgan</option>
                                    <option value="James Carter">James Carter</option>
                                    <option value="Sophia Chen">Sophia Chen</option>
                                    <option value="Liam Patel">Liam Patel</option>
                                    <option value="Olivia Brooks">Olivia Brooks</option>
                                </select>

                            </div>

                        </div>


                        {/* TEMPLATE */}

                        <div className="form-group">

                            <label htmlFor="reportTemplate">
                                <i className="fa-solid fa-layer-group"></i>
                                Template
                            </label>

                            <div className="form-input-wrapper">

                                <i className="fa-solid fa-layer-group"></i>

                                <select
                                    id="reportTemplate"
                                    value={reportTemplate}
                                    onChange={event => setReportTemplate(event.target.value)}
                                >
                                    <option value="Standard">Standard</option>
                                    <option value="Detailed">Detailed</option>
                                    <option value="Brief">Brief</option>
                                </select>

                            </div>

                        </div>


                        {/* NOTES */}

                        <div className="form-group">

                            <label htmlFor="reportNotes">
                                <i className="fa-solid fa-pen"></i>
                                Notes
                            </label>

                            <textarea
                                id="reportNotes"
                                rows="4"
                                placeholder="Add any additional notes for this report..."
                                value={reportNotes}
                                onChange={event => setReportNotes(event.target.value)}
                            ></textarea>

                        </div>


                        {/* ACTIONS */}

                        <div className="appointment-modal-actions">

                            <button
                                type="button"
                                className="doctor-secondary-btn"
                                id="cancelReportModal"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-btn"
                            >
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                                Generate
                            </button>

                        </div>

                    </form>

                </div>

            </Modal>

        </>
    )

}
