/* =========================================================
   MEDICO
   MEDICATION ASSISTANT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const resultsBox =
        document.querySelector(
            "#medResults"
        );


    const planBox =
        document.querySelector(
            "#medPlan"
        );


    if (
        !resultsBox ||
        !planBox
    ) {

        return;

    }


    const searchInput =
        document.querySelector(
            "#medSearch"
        );


    const emptyState =
        document.querySelector(
            "#medEmpty"
        );


    const saveButton =
        document.querySelector(
            "#saveMedBtn"
        );


    /* =====================================================
       MOCK FORMULARY
    ===================================================== */

    const formulary = [

        { name: "Atorvastatin", drugClass: "Statin",         dose: "20 mg once daily" },
        { name: "Lisinopril",   drugClass: "ACE inhibitor",  dose: "10 mg once daily" },
        { name: "Metformin",    drugClass: "Biguanide",      dose: "500 mg twice daily" },
        { name: "Amlodipine",   drugClass: "Calcium blocker",dose: "5 mg once daily" },
        { name: "Aspirin",      drugClass: "Antiplatelet",   dose: "81 mg once daily" },
        { name: "Metoprolol",   drugClass: "Beta blocker",   dose: "50 mg twice daily" },
        { name: "Warfarin",     drugClass: "Anticoagulant",  dose: "5 mg once daily" },
        { name: "Omeprazole",   drugClass: "PPI",            dose: "20 mg once daily" }

    ];


    /* =====================================================
       PLAN STATE
    ===================================================== */

    const plan = [];


    /* =====================================================
       RENDER RESULTS
    ===================================================== */

    function renderResults() {

        const term =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const matches =
            formulary.filter(drug => {

                if (!term) {
                    return true;
                }

                return (
                    drug.name
                        .toLowerCase()
                        .includes(term) ||
                    drug.drugClass
                        .toLowerCase()
                        .includes(term)
                );

            });


        resultsBox.innerHTML = "";


        if (!matches.length) {

            resultsBox.innerHTML = `
                <p class="med-no-results">
                    No medications match "${term}".
                </p>
            `;

            return;

        }


        matches.forEach(drug => {

            const isAdded =
                plan.some(
                    item =>
                        item.name === drug.name
                );


            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";


            button.className =
                `med-result ${isAdded ? "selected" : ""}`;


            button.dataset.drug =
                drug.name;


            button.innerHTML = `
                <span class="med-result-info">
                    <strong>${drug.name}</strong>
                    <span>${drug.drugClass} · ${drug.dose}</span>
                </span>

                <span class="med-result-add">
                    <i class="fa-solid ${isAdded ? "fa-check" : "fa-plus"}"></i>
                </span>
            `;


            resultsBox.appendChild(button);

        });

    }


    /* =====================================================
       RENDER PLAN
    ===================================================== */

    function renderPlan() {

        planBox.innerHTML = "";


        if (emptyState) {

            emptyState.style.display =
                plan.length
                    ? "none"
                    : "";

        }


        plan.forEach(drug => {

            const chip =
                document.createElement(
                    "div"
                );


            chip.className =
                "inv-chip";


            chip.innerHTML = `
                <div>
                    <strong>${drug.name}</strong>
                    <span>${drug.dose}</span>
                </div>

                <button
                    type="button"
                    class="inv-chip-remove"
                    data-drug="${drug.name}"
                    aria-label="Remove medication"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;


            planBox.appendChild(chip);

        });

    }


    /* =====================================================
       ADD FROM RESULTS
    ===================================================== */

    resultsBox.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".med-result"
                );


            if (!button) {
                return;
            }


            const name =
                button.dataset.drug;


            const drug =
                formulary.find(
                    item =>
                        item.name === name
                );


            if (!drug) {
                return;
            }


            const index =
                plan.findIndex(
                    item =>
                        item.name === name
                );


            if (index > -1) {

                plan.splice(index, 1);

            } else {

                plan.push(drug);

            }


            renderPlan();

            renderResults();

        }
    );


    /* =====================================================
       REMOVE FROM PLAN
    ===================================================== */

    planBox.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".inv-chip-remove"
                );


            if (!button) {
                return;
            }


            const name =
                button.dataset.drug;


            const index =
                plan.findIndex(
                    item =>
                        item.name === name
                );


            if (index > -1) {

                plan.splice(index, 1);

                renderPlan();

                renderResults();

            }

        }
    );


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderResults
        );

    }


    /* =====================================================
       ADD TO PLAN
    ===================================================== */

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                if (!plan.length) {

                    showDoctorToast(
                        "Plan is empty",
                        "Add at least one medication first.",
                        "fa-triangle-exclamation"
                    );

                    return;

                }


                console.log(
                    "Prescription plan saved:",
                    plan.map(item => item.name)
                );


                showDoctorToast(
                    "Plan updated",
                    `${plan.length} medication(s) added to the care plan.`,
                    "fa-pills"
                );

            }
        );

    }


    /* =====================================================
       INITIAL RENDER
    ===================================================== */

    renderResults();

    renderPlan();

});
