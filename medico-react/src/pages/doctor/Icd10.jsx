import { useState } from "react"

import Topbar from "../../components/layout/Topbar"

import { useToast } from "../../context/ToastContext"

import { icd10Codes } from "../../data/icd10"


/*
    ICD-10 Coding — faithful port of pages/doctor/icd10.html
    + assets/js/icd10.js.

    The aurora / sidebar / profile chrome comes from AppLayout;
    this renders the topbar and the page body (hero + search /
    selected workspace) that lived inside <main>.

    Behaviour (ports icd10.js):
      - controlled search query -> filtered `matches` list
        (matches when the code OR label includes the trimmed,
        lower-cased term; empty term shows everything)
      - `selected[]` multi-select state; adding a code disables
        its "Add" button and flips it to "Added"; each selected
        code renders as a removable chip
      - the no-results and "no codes yet" empty states reproduce
        the original markup
      - Save fires a doctor toast (a warning when nothing is
        selected, otherwise a success). The original save had NO
        setTimeout — it toasted synchronously — so there is no
        service seam here; the toast fires inline as before.
*/

export default function Icd10() {

    const { showDoctorToast } = useToast()


    /* ---- search + selection state ---- */

    const [query, setQuery] = useState("")

    const [selected, setSelected] = useState([])


    /* ---- derived: filtered results (ports renderResults' filter) ---- */

    const term = query.trim().toLowerCase()

    const matches = icd10Codes.filter(entry => {

        if (!term) {
            return true
        }

        return (
            entry.code.toLowerCase().includes(term) ||
            entry.label.toLowerCase().includes(term)
        )

    })


    /* ---- add / remove (ports the delegated click handlers) ---- */

    function handleAdd(entry) {

        setSelected(current => {

            if (current.some(item => item.code === entry.code)) {
                return current
            }

            return [...current, entry]

        })

    }


    function handleRemove(code) {

        setSelected(current =>
            current.filter(item => item.code !== code)
        )

    }


    /* ---- save (ports the saveIcdBtn click) ---- */

    function handleSave() {

        if (!selected.length) {

            showDoctorToast(
                "No codes selected",
                "Add at least one ICD-10 code before saving.",
                "fa-triangle-exclamation"
            )

            return

        }

        console.log(
            "Saved ICD-10 codes:",
            selected.map(item => item.code)
        )

        showDoctorToast(
            "Codes saved",
            `${selected.length} diagnosis code(s) added to the encounter.`,
            "fa-check"
        )

    }


    return (
        <>

            <Topbar title="ICD-10 Coding" />


            {/* =================================================
                 HERO
            ================================================== */}

            <section className="doctor-page-hero">

                <div className="doctor-hero-content">

                    <span className="doctor-eyebrow">
                        <i className="fa-solid fa-code"></i>
                        DIAGNOSIS CODING
                    </span>

                    <h1>
                        Find the right{" "}
                        <span>ICD-10 code.</span>
                    </h1>

                    <p>
                        Search the classification, review descriptions
                        and build a clean, billable problem list for
                        the current encounter.
                    </p>

                </div>

                <div className="doctor-hero-visual">
                    <i className="fa-solid fa-code doctor-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 WORKSPACE
            ================================================== */}

            <section className="consult-layout icd-layout">

                {/* SEARCH */}

                <div className="doctor-panel premium-glass">

                    <span className="section-kicker">CODE SEARCH</span>

                    <div className="doctor-search icd-search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            id="icdSearch"
                            placeholder="Search by code or description..."
                            value={query}
                            onChange={event => setQuery(event.target.value)}
                        />
                    </div>

                    <div className="icd-results" id="icdResults">

                        {matches.length === 0 ? (

                            <p className="icd-no-results">
                                No codes match "{term}".
                            </p>

                        ) : (

                            matches.map(entry => {

                                const isAdded =
                                    selected.some(
                                        item => item.code === entry.code
                                    )

                                return (

                                    <div
                                        className="icd-result"
                                        key={entry.code}
                                    >

                                        <div className="icd-code">
                                            {entry.code}
                                        </div>

                                        <div className="icd-desc">
                                            {entry.label}
                                        </div>

                                        <button
                                            type="button"
                                            className="icd-add"
                                            data-code={entry.code}
                                            disabled={isAdded}
                                            onClick={() => handleAdd(entry)}
                                        >
                                            <i
                                                className={
                                                    "fa-solid " +
                                                    (isAdded ? "fa-check" : "fa-plus")
                                                }
                                            ></i>
                                            {isAdded ? "Added" : "Add"}
                                        </button>

                                    </div>

                                )

                            })

                        )}

                    </div>

                </div>


                {/* SELECTED */}

                <aside className="doctor-panel premium-glass">

                    <span className="section-kicker">SELECTED CODES</span>

                    <div className="icd-selected" id="icdSelected">

                        {selected.map(entry => (

                            <div
                                className="icd-chip"
                                key={entry.code}
                            >

                                <div>
                                    <strong>{entry.code}</strong>
                                    <span>{entry.label}</span>
                                </div>

                                <button
                                    type="button"
                                    className="icd-chip-remove"
                                    data-code={entry.code}
                                    aria-label="Remove code"
                                    onClick={() => handleRemove(entry.code)}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>

                            </div>

                        ))}

                    </div>


                    {selected.length === 0 && (

                        <div className="doctor-empty-state icd-empty" id="icdEmpty">
                            <div className="empty-state-icon">
                                <i className="fa-solid fa-list-check"></i>
                            </div>
                            <h3>No codes yet</h3>
                            <p>Add codes from the search results to build your problem list.</p>
                        </div>

                    )}


                    <button
                        className="primary-btn icd-save"
                        id="saveIcdBtn"
                        onClick={handleSave}
                    >
                        <i className="fa-solid fa-check"></i>
                        Save to Encounter
                    </button>

                </aside>

            </section>

        </>
    )

}
