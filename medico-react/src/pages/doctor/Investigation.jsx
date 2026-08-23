import { useState } from "react"

import Topbar from "../../components/layout/Topbar"

import { useToast } from "../../context/ToastContext"

import { investigationCatalog } from "../../data/investigations"


/*
    Investigation — faithful port of pages/doctor/investigation.html
    + assets/js/investigation.js.

    The aurora / sidebar / profile chrome comes from AppLayout; this
    renders the topbar and the page body (hero + catalog / selected
    workspace) that lived inside <main>.

    Behaviour (ports investigation.js):
      - controlled search query -> filtered `matches`, grouped by
        category in first-appearance order (renderCatalog)
      - clicking a catalog test toggles it in `selected`; the button
        flips to a check + "selected" style
      - each selected test renders as a removable chip; the empty
        state shows while nothing is selected (renderSelected)
      - Send Orders toasts synchronously — a warning when the order
        set is empty, otherwise a success. The original had NO
        setTimeout, so there is no service seam here.
*/

export default function Investigation() {

    const { showDoctorToast } = useToast()


    /* ---- search + selection state ---- */

    const [query, setQuery] = useState("")

    const [selected, setSelected] = useState([])


    /* ---- derived: filtered results (ports renderCatalog's filter) ---- */

    const term = query.trim().toLowerCase()

    const matches = investigationCatalog.filter(test => {

        if (!term) {
            return true
        }

        return (
            test.name.toLowerCase().includes(term) ||
            test.category.toLowerCase().includes(term)
        )

    })


    /* ---- derived: categories in first-appearance order ---- */

    const categories = []

    matches.forEach(test => {

        if (!categories.includes(test.category)) {
            categories.push(test.category)
        }

    })


    /* ---- toggle / remove (ports the delegated click handlers) ---- */

    function handleToggle(test) {

        setSelected(current => {

            if (current.some(item => item.name === test.name)) {
                return current.filter(item => item.name !== test.name)
            }

            return [...current, test]

        })

    }


    function handleRemove(name) {

        setSelected(current =>
            current.filter(item => item.name !== name)
        )

    }


    /* ---- send orders (ports the sendOrdersBtn click) ---- */

    function handleSend() {

        if (!selected.length) {

            showDoctorToast(
                "No tests selected",
                "Add at least one test to send orders.",
                "fa-triangle-exclamation"
            )

            return

        }

        console.log(
            "Sending investigation orders:",
            selected.map(item => item.name)
        )

        showDoctorToast(
            "Orders sent",
            `${selected.length} investigation(s) sent to the lab.`,
            "fa-paper-plane"
        )

    }


    return (
        <>

            <Topbar title="Investigation" />


            {/* =================================================
                 HERO
            ================================================== */}

            <section className="doctor-page-hero">

                <div className="doctor-hero-content">

                    <span className="doctor-eyebrow">
                        <i className="fa-solid fa-microscope"></i>
                        INVESTIGATIONS
                    </span>

                    <h1>
                        Order the right{" "}
                        <span>tests.</span>
                    </h1>

                    <p>
                        Browse the catalog, build an order set and send
                        lab and imaging investigations for the current
                        encounter in a single step.
                    </p>

                </div>

                <div className="doctor-hero-visual">
                    <i className="fa-solid fa-microscope doctor-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 WORKSPACE
            ================================================== */}

            <section className="consult-layout inv-layout">

                {/* CATALOG */}

                <div className="doctor-panel premium-glass">

                    <span className="section-kicker">TEST CATALOG</span>

                    <div className="doctor-search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            id="invSearch"
                            placeholder="Search tests..."
                            value={query}
                            onChange={event => setQuery(event.target.value)}
                        />
                    </div>

                    <div className="inv-catalog" id="invCatalog">

                        {matches.length === 0 ? (

                            <p className="inv-no-results">
                                No tests match "{term}".
                            </p>

                        ) : (

                            categories.map(category => (

                                <div className="inv-group" key={category}>

                                    <div className="inv-group-title">
                                        {category}
                                    </div>

                                    {matches
                                        .filter(test => test.category === category)
                                        .map(test => {

                                            const isSelected =
                                                selected.some(
                                                    item => item.name === test.name
                                                )

                                            return (

                                                <button
                                                    type="button"
                                                    className={
                                                        "inv-test" +
                                                        (isSelected ? " selected" : "")
                                                    }
                                                    data-test={test.name}
                                                    key={test.name}
                                                    onClick={() => handleToggle(test)}
                                                >

                                                    <span className="inv-test-check">
                                                        <i
                                                            className={
                                                                "fa-solid " +
                                                                (isSelected ? "fa-check" : "fa-plus")
                                                            }
                                                        ></i>
                                                    </span>

                                                    <span className="inv-test-name">
                                                        {test.name}
                                                    </span>

                                                    <span className="inv-test-meta">
                                                        {test.turnaround}
                                                    </span>

                                                </button>

                                            )

                                        })}

                                </div>

                            ))

                        )}

                    </div>

                </div>


                {/* SELECTED */}

                <aside className="doctor-panel premium-glass">

                    <span className="section-kicker">SELECTED ORDERS</span>

                    <div className="inv-selected" id="invSelected">

                        {selected.map(test => (

                            <div className="inv-chip" key={test.name}>

                                <div>
                                    <strong>{test.name}</strong>
                                    <span>{test.category}</span>
                                </div>

                                <button
                                    type="button"
                                    className="inv-chip-remove"
                                    data-test={test.name}
                                    aria-label="Remove test"
                                    onClick={() => handleRemove(test.name)}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>

                            </div>

                        ))}

                    </div>


                    {selected.length === 0 && (

                        <div className="doctor-empty-state inv-empty" id="invEmpty">
                            <div className="empty-state-icon">
                                <i className="fa-solid fa-flask"></i>
                            </div>
                            <h3>No tests selected</h3>
                            <p>Pick tests from the catalog to build this order set.</p>
                        </div>

                    )}


                    <button
                        className="primary-btn inv-send"
                        id="sendOrdersBtn"
                        onClick={handleSend}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                        Send Orders
                    </button>

                </aside>

            </section>

        </>
    )

}
