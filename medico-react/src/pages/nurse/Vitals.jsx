import { useEffect, useState } from "react"

import Topbar from "../../components/layout/Topbar"

import CustomFilter from "../../components/ui/CustomFilter"

import { useToast } from "../../context/ToastContext"

import {
    vitalsPatients,
    vitalsPatientOptions,
} from "../../data/nursePatients"


/*
    Record Vitals — faithful port of pages/nurse/vitals.html +
    the vitals half of assets/js/nurse.js.

    Behaviour (ports nurse.js):
      - the patient CustomFilter (#vitalsPatientDropdown) selects a
        patient; the .selected-patient card mirrors it (avatar
        initials, name, "<age> · Ready for vitals", id) or falls back
        to the "No patient selected" placeholder. On mount, a patient
        id left in sessionStorage("selectedPatient") by the waiting
        room / patients "take vitals" buttons preselects it and is
        then cleared.
      - BMI is recomputed from height + weight exactly as the original
        (kg / m², one decimal; the same <18.5 / <25 / <30 thresholds);
        empty or non-positive inputs show "--" / "Waiting for height
        and weight".
      - Save (submit) is synchronous: no patient → "Please select a
        patient first."; any of the eight measurements missing →
        "Please complete all vital measurements."; otherwise it logs
        the assembled vitalsData and toasts success. It does NOT reset
        the form (the original didn't).
      - Clear (reset) empties every field + the patient selector and
        toasts "Vitals form cleared."

    The original also poked a `.vitals-status` element in several
    places, but that element never existed in vitals.html — those
    were dead no-ops and are omitted here.

    height + weight are controlled so BMI updates live; the other six
    measurements and the notes stay uncontrolled (read on submit,
    cleared by the native reset), matching the source.
*/


function computeBmi(heightStr, weightStr) {

    const height = parseFloat(heightStr)

    const weight = parseFloat(weightStr)


    if (!height || !weight || height <= 0 || weight <= 0) {

        return {
            value: "--",
            status: "Waiting for height and weight",
        }

    }


    const heightMeters = height / 100

    const bmi = weight / (heightMeters * heightMeters)


    let status

    if (bmi < 18.5) {
        status = "Underweight"
    }
    else if (bmi < 25) {
        status = "Normal weight"
    }
    else if (bmi < 30) {
        status = "Overweight"
    }
    else {
        status = "Obesity"
    }


    return {
        value: bmi.toFixed(1),
        status: status,
    }

}


export default function Vitals() {

    const { showNurseMessage } = useToast()


    /* ---- selection + the two BMI-driving fields ---- */

    const [patientValue, setPatientValue] = useState("")

    const [height, setHeight] = useState("")

    const [weight, setWeight] = useState("")


    /* ---- preselect from the waiting room / patients handoff ---- */

    useEffect(
        () => {

            const stored = sessionStorage.getItem("selectedPatient")

            if (stored && vitalsPatients[stored]) {

                setPatientValue(stored)

                sessionStorage.removeItem("selectedPatient")

            }

        },
        []
    )


    const patient =
        patientValue
            ? vitalsPatients[patientValue]
            : null

    const bmi = computeBmi(height, weight)


    /* ---- save vitals (synchronous) ---- */

    function handleSave(event) {

        event.preventDefault()


        if (!patientValue) {

            showNurseMessage(
                "Please select a patient first.",
                "error"
            )

            return

        }


        const form = event.currentTarget

        const field = name =>
            (form.elements[name] ? form.elements[name].value : "")


        const systolic = field("systolic")

        const diastolic = field("diastolic")

        const heartRate = field("heartRate")

        const temperature = field("temperature")

        const oxygen = field("oxygen")

        const respiratoryRate = field("respiratoryRate")

        const weightValue = field("weight")

        const heightValue = field("height")


        if (
            !systolic ||
            !diastolic ||
            !heartRate ||
            !temperature ||
            !oxygen ||
            !respiratoryRate ||
            !weightValue ||
            !heightValue
        ) {

            showNurseMessage(
                "Please complete all vital measurements.",
                "error"
            )

            return

        }


        const selected = vitalsPatients[patientValue]


        if (!selected) {

            showNurseMessage(
                "Selected patient could not be found.",
                "error"
            )

            return

        }


        const vitalsData = {

            patientId: selected.id,

            patientName: selected.name,

            bloodPressure: `${systolic}/${diastolic}`,

            heartRate: heartRate,

            temperature: temperature,

            oxygen: oxygen,

            respiratoryRate: respiratoryRate,

            weight: weightValue,

            height: heightValue,

            bmi: bmi.value,

            notes: field("vitalsNotes") || "",

            savedAt: new Date().toISOString(),

        }


        console.log(
            "Vitals saved:",
            vitalsData
        )


        showNurseMessage(
            `Vitals saved successfully for ${selected.name}.`,
            "success"
        )

    }


    /* ---- clear vitals (reset) ---- */

    function handleClear() {

        setPatientValue("")

        setHeight("")

        setWeight("")


        showNurseMessage(
            "Vitals form cleared.",
            "success"
        )

    }


    return (
        <>

            <Topbar title="Record Vitals" />


            {/* =================================================
                 PAGE HEADER
            ================================================== */}

            <section className="page-hero">

                <div className="page-hero-content">

                    <span className="page-eyebrow">
                        <i className="fa-solid fa-heart-pulse"></i>
                        PATIENT MONITORING
                    </span>

                    <h1>
                        Record accurate{" "}
                        <span>vitals.</span>
                    </h1>

                    <p>
                        Record and monitor the patient's
                        vital signs before consultation.
                    </p>

                </div>

                <div className="page-hero-visual">
                    <i className="fa-solid fa-heart-pulse page-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 PATIENT SELECT
            ================================================== */}

            <section className="vitals-patient-card premium-glass">

                <div className="vitals-card-header">

                    <div>

                        <span className="section-label">
                            PATIENT
                        </span>

                        <h2>
                            Select Patient
                        </h2>

                    </div>

                    <div className="patient-selection-icon">
                        <i className="fa-solid fa-user"></i>
                    </div>

                </div>


                <div className="patient-selector">

                    <label>
                        Patient
                    </label>

                    <CustomFilter
                        id="vitalsPatientDropdown"
                        className="patient-custom-filter"
                        options={vitalsPatientOptions}
                        value={patientValue}
                        onChange={setPatientValue}
                    />

                    <input
                        type="hidden"
                        id="vitalsPatient"
                        name="patient"
                        value={patientValue}
                        readOnly
                    />

                </div>


                <div
                    className={"selected-patient" + (patient ? " active" : "")}
                    id="selectedPatient"
                >

                    <div className="patient-avatar">
                        {patient ? patient.initials : "--"}
                    </div>

                    <div className="patient-details">

                        <h3>
                            {patient ? patient.name : "No patient selected"}
                        </h3>

                        <p>
                            {patient
                                ? `${patient.age} · Ready for vitals`
                                : "Select a patient to begin recording vitals."}
                        </p>

                    </div>

                    <div className="patient-meta">

                        <span>
                            Patient ID
                        </span>

                        <strong>
                            {patient ? patient.id : "--"}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                 VITALS FORM
            ================================================== */}

            <form
                className="vitals-form"
                id="vitalsForm"
                onSubmit={handleSave}
                onReset={handleClear}
            >

                <section className="vitals-main-card premium-glass">

                    <div className="vitals-card-header">

                        <div>

                            <span className="section-label">
                                MEASUREMENTS
                            </span>

                            <h2>
                                Vital Signs
                            </h2>

                        </div>

                        <div className="vitals-main-icon">
                            <i className="fa-solid fa-heart-pulse"></i>
                        </div>

                    </div>


                    <div className="vitals-grid">

                        {/* BLOOD PRESSURE */}

                        <div className="vital-input-card">

                            <div className="vital-input-header">

                                <div className="vital-icon blood-pressure">
                                    <i className="fa-solid fa-droplet"></i>
                                </div>

                                <div>

                                    <h3>
                                        Blood Pressure
                                    </h3>

                                    <span>
                                        mmHg
                                    </span>

                                </div>

                            </div>


                            <div className="blood-pressure-inputs">

                                <div>

                                    <label htmlFor="systolic">
                                        Systolic
                                    </label>

                                    <input
                                        type="number"
                                        id="systolic"
                                        name="systolic"
                                        placeholder="120"
                                        min="50"
                                        max="250"
                                    />

                                </div>


                                <span className="bp-separator">
                                    /
                                </span>


                                <div>

                                    <label htmlFor="diastolic">
                                        Diastolic
                                    </label>

                                    <input
                                        type="number"
                                        id="diastolic"
                                        name="diastolic"
                                        placeholder="80"
                                        min="30"
                                        max="150"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* HEART RATE */}

                        <div className="vital-input-card">

                            <div className="vital-input-header">

                                <div className="vital-icon heart-rate">
                                    <i className="fa-solid fa-heart-pulse"></i>
                                </div>

                                <div>

                                    <h3>
                                        Heart Rate
                                    </h3>

                                    <span>
                                        BPM
                                    </span>

                                </div>

                            </div>


                            <div className="single-vital-input">

                                <input
                                    type="number"
                                    id="heartRate"
                                    name="heartRate"
                                    placeholder="72"
                                    min="20"
                                    max="250"
                                />

                                <span>
                                    bpm
                                </span>

                            </div>

                        </div>


                        {/* TEMPERATURE */}

                        <div className="vital-input-card">

                            <div className="vital-input-header">

                                <div className="vital-icon temperature">
                                    <i className="fa-solid fa-temperature-half"></i>
                                </div>

                                <div>

                                    <h3>
                                        Temperature
                                    </h3>

                                    <span>
                                        Celsius
                                    </span>

                                </div>

                            </div>


                            <div className="single-vital-input">

                                <input
                                    type="number"
                                    id="temperature"
                                    name="temperature"
                                    placeholder="36.7"
                                    step="0.1"
                                    min="30"
                                    max="45"
                                />

                                <span>
                                    °C
                                </span>

                            </div>

                        </div>


                        {/* OXYGEN */}

                        <div className="vital-input-card">

                            <div className="vital-input-header">

                                <div className="vital-icon oxygen">
                                    <i className="fa-solid fa-lungs"></i>
                                </div>

                                <div>

                                    <h3>
                                        Oxygen Saturation
                                    </h3>

                                    <span>
                                        SpO₂
                                    </span>

                                </div>

                            </div>


                            <div className="single-vital-input">

                                <input
                                    type="number"
                                    id="oxygen"
                                    name="oxygen"
                                    placeholder="98"
                                    min="50"
                                    max="100"
                                />

                                <span>
                                    %
                                </span>

                            </div>

                        </div>


                        {/* RESPIRATORY RATE */}

                        <div className="vital-input-card">

                            <div className="vital-input-header">

                                <div className="vital-icon respiratory">
                                    <i className="fa-solid fa-wind"></i>
                                </div>

                                <div>

                                    <h3>
                                        Respiratory Rate
                                    </h3>

                                    <span>
                                        breaths/min
                                    </span>

                                </div>

                            </div>


                            <div className="single-vital-input">

                                <input
                                    type="number"
                                    id="respiratoryRate"
                                    name="respiratoryRate"
                                    placeholder="16"
                                    min="5"
                                    max="80"
                                />

                                <span>
                                    /min
                                </span>

                            </div>

                        </div>


                        {/* WEIGHT */}

                        <div className="vital-input-card">

                            <div className="vital-input-header">

                                <div className="vital-icon weight">
                                    <i className="fa-solid fa-weight-scale"></i>
                                </div>

                                <div>

                                    <h3>
                                        Weight
                                    </h3>

                                    <span>
                                        Kilograms
                                    </span>

                                </div>

                            </div>


                            <div className="single-vital-input">

                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    placeholder="70"
                                    step="0.1"
                                    min="1"
                                    max="400"
                                    value={weight}
                                    onChange={event => setWeight(event.target.value)}
                                />

                                <span>
                                    kg
                                </span>

                            </div>

                        </div>


                        {/* HEIGHT */}

                        <div className="vital-input-card">

                            <div className="vital-input-header">

                                <div className="vital-icon height">
                                    <i className="fa-solid fa-ruler-vertical"></i>
                                </div>

                                <div>

                                    <h3>
                                        Height
                                    </h3>

                                    <span>
                                        Centimeters
                                    </span>

                                </div>

                            </div>


                            <div className="single-vital-input">

                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    placeholder="175"
                                    step="0.1"
                                    min="30"
                                    max="250"
                                    value={height}
                                    onChange={event => setHeight(event.target.value)}
                                />

                                <span>
                                    cm
                                </span>

                            </div>

                        </div>


                        {/* BMI */}

                        <div className="vital-input-card bmi-card">

                            <div className="vital-input-header">

                                <div className="vital-icon bmi">
                                    <i className="fa-solid fa-calculator"></i>
                                </div>

                                <div>

                                    <h3>
                                        BMI
                                    </h3>

                                    <span>
                                        Calculated
                                    </span>

                                </div>

                            </div>


                            <div className="bmi-result">

                                <strong id="bmiValue">
                                    {bmi.value}
                                </strong>

                                <span id="bmiStatus">
                                    {bmi.status}
                                </span>

                            </div>

                        </div>

                    </div>

                </section>


                <section className="vitals-notes-card premium-glass">

                    <div className="vitals-card-header">

                        <div>

                            <span className="section-label">
                                CLINICAL NOTES
                            </span>

                            <h2>
                                Additional Notes
                            </h2>

                        </div>

                        <div className="notes-icon">
                            <i className="fa-solid fa-notes-medical"></i>
                        </div>

                    </div>


                    <textarea
                        id="vitalsNotes"
                        name="vitalsNotes"
                        rows="5"
                        placeholder="Add any observations or relevant notes..."
                    ></textarea>

                </section>


                <div className="vitals-actions">

                    <button
                        type="reset"
                        className="secondary-btn"
                        id="clearVitals"
                    >

                        <i className="fa-solid fa-rotate-left"></i>

                        Clear

                    </button>


                    <button
                        type="submit"
                        className="primary-btn"
                    >

                        <i className="fa-solid fa-floppy-disk"></i>

                        Save Vitals

                    </button>

                </div>

            </form>

        </>
    )

}
