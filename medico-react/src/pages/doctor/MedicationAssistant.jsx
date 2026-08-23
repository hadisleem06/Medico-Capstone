import { useState } from "react"

import Topbar from "../../components/layout/Topbar"

import { useToast } from "../../context/ToastContext"

import { medicationFormulary } from "../../data/medications"


/*
    Medication Assistant — faithful port of
    pages/doctor/medication-assistant.html + assets/js/medication.js.

    The aurora / sidebar / profile chrome comes from AppLayout; this
    renders the topbar and the page body (hero + drug-search /
    prescription-plan workspace) that lived inside <main>.

    Behaviour (ports medication.js):
      - controlled search query -> filtered `matches` (name OR class)
      - clicking a result toggles the drug in `plan`; the button
        flips to a check + "selected" style
      - each plan drug renders as a removable chip; the empty state
        shows while the plan is empty
      - "Add to Plan" toasts synchronously — a warning when the plan
        is empty, otherwise a success. No setTimeout in the original,
        so there is no service seam here.
      - the AI interactions list below is static, exactly as authored.
*/

export default function MedicationAssistant() {

    const { showDoctorToast } = useToast()


    /* ---- search + plan state ---- */

    const [query, setQuery] = useState("")

    const [plan, setPlan] = useState([])


    /* ---- derived: filtered results (ports renderResults' filter) ---- */

    const term = query.trim().toLowerCase()

    const matches = medicationFormulary.filter(drug => {

        if (!term) {
            return true
        }

        return (
            drug.name.toLowerCase().includes(term) ||
            drug.drugClass.toLowerCase().includes(term)
        )

    })


    /* ---- toggle / remove (ports the delegated click handlers) ---- */

    function handleToggle(drug) {

        setPlan(current => {

            if (current.some(item => item.name === drug.name)) {
                return current.filter(item => item.name !== drug.name)
            }

            return [...current, drug]

        })

    }


    function handleRemove(name) {

        setPlan(current =>
            current.filter(item => item.name !== name)
        )

    }


    /* ---- add to plan (ports the saveMedBtn click) ---- */

    function handleSave() {

        if (!plan.length) {

            showDoctorToast(
                "Plan is empty",
                "Add at least one medication first.",
                "fa-triangle-exclamation"
            )

            return

        }

        console.log(
            "Prescription plan saved:",
            plan.map(item => item.name)
        )

        showDoctorToast(
            "Plan updated",
            `${plan.length} medication(s) added to the care plan.`,
            "fa-pills"
        )

    }


    return (
        <>

            <Topbar title="Medication Assistant" />


            {/* =================================================
                 HERO
            ================================================== */}

            <section className="doctor-page-hero">

                <div className="doctor-hero-content">

                    <span className="doctor-eyebrow">
                        <i className="fa-solid fa-pills"></i>
                        MEDICATION AI
                    </span>

                    <h1>
                        Prescribe with{" "}
                        <span>precision.</span>
                    </h1>

                    <p>
                        Search the formulary, build a prescription plan
                        and let the assistant screen for interactions and
                        dosing issues before you sign.
                    </p>

                </div>

                <div className="doctor-hero-visual">
                    <i className="fa-solid fa-pills doctor-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 WORKSPACE
            ================================================== */}

            <section className="consult-layout med-layout">

                {/* DRUG SEARCH */}

                <div className="doctor-panel premium-glass">

                    <span className="section-kicker">DRUG SEARCH</span>

                    <div className="doctor-search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            id="medSearch"
                            placeholder="Search medications by name or class..."
                            value={query}
                            onChange={event => setQuery(event.target.value)}
                        />
                    </div>

                    <div className="med-results" id="medResults">

                        {matches.length === 0 ? (

                            <p className="med-no-results">
                                No medications match "{term}".
                            </p>

                        ) : (

                            matches.map(drug => {

                                const isAdded =
                                    plan.some(item => item.name === drug.name)

                                return (

                                    <button
                                        type="button"
                                        className={
                                            "med-result" +
                                            (isAdded ? " selected" : "")
                                        }
                                        data-drug={drug.name}
                                        key={drug.name}
                                        onClick={() => handleToggle(drug)}
                                    >

                                        <span className="med-result-info">
                                            <strong>{drug.name}</strong>
                                            <span>{drug.drugClass} · {drug.dose}</span>
                                        </span>

                                        <span className="med-result-add">
                                            <i
                                                className={
                                                    "fa-solid " +
                                                    (isAdded ? "fa-check" : "fa-plus")
                                                }
                                            ></i>
                                        </span>

                                    </button>

                                )

                            })

                        )}

                    </div>

                </div>


                {/* PRESCRIPTION PLAN */}

                <aside className="doctor-panel premium-glass">

                    <span className="section-kicker">PRESCRIPTION PLAN</span>

                    <div className="med-plan" id="medPlan">

                        {plan.map(drug => (

                            <div className="inv-chip" key={drug.name}>

                                <div>
                                    <strong>{drug.name}</strong>
                                    <span>{drug.dose}</span>
                                </div>

                                <button
                                    type="button"
                                    className="inv-chip-remove"
                                    data-drug={drug.name}
                                    aria-label="Remove medication"
                                    onClick={() => handleRemove(drug.name)}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>

                            </div>

                        ))}

                    </div>


                    {plan.length === 0 && (

                        <div className="doctor-empty-state med-empty" id="medEmpty">
                            <div className="empty-state-icon">
                                <i className="fa-solid fa-prescription"></i>
                            </div>
                            <p>No medications added yet.</p>
                        </div>

                    )}


                    <button
                        className="primary-btn"
                        id="saveMedBtn"
                        onClick={handleSave}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                        Add to Plan
                    </button>


                    <div className="med-divider"></div>


                    <span className="section-kicker">AI INTERACTIONS</span>

                    <ul className="profile-list profile-list-lg">

                        <li>
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <div>
                                <strong>Warfarin + Aspirin</strong>
                                <span>Increased bleeding risk — monitor INR closely</span>
                            </div>
                            <span className="risk-tag high">Major</span>
                        </li>

                        <li>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <div>
                                <strong>Metformin renal check</strong>
                                <span>Confirm eGFR before continuing at current dose</span>
                            </div>
                            <span className="risk-tag moderate">Caution</span>
                        </li>

                        <li>
                            <i className="fa-solid fa-circle-check"></i>
                            <div>
                                <strong>Atorvastatin + Amlodipine</strong>
                                <span>Compatible — no dose adjustment required</span>
                            </div>
                            <span className="risk-tag stable">Safe</span>
                        </li>

                    </ul>

                </aside>

            </section>

        </>
    )

}
