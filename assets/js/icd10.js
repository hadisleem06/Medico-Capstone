/* =========================================================
   MEDICO
   ICD-10 CODING
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const resultsBox =
        document.querySelector(
            "#icdResults"
        );


    const selectedBox =
        document.querySelector(
            "#icdSelected"
        );


    if (
        !resultsBox ||
        !selectedBox
    ) {

        return;

    }


    const searchInput =
        document.querySelector(
            "#icdSearch"
        );


    const emptyState =
        document.querySelector(
            "#icdEmpty"
        );


    const saveButton =
        document.querySelector(
            "#saveIcdBtn"
        );


    /* =====================================================
       MOCK ICD-10 DATASET
    ===================================================== */

    const codes = [

        { code: "I10",    label: "Essential (primary) hypertension" },
        { code: "I25.10", label: "Atherosclerotic heart disease" },
        { code: "I48.91", label: "Atrial fibrillation, unspecified" },
        { code: "I50.9",  label: "Heart failure, unspecified" },
        { code: "E11.9",  label: "Type 2 diabetes without complications" },
        { code: "E78.5",  label: "Hyperlipidemia, unspecified" },
        { code: "R07.9",  label: "Chest pain, unspecified" },
        { code: "R00.2",  label: "Palpitations" },
        { code: "J45.909",label: "Unspecified asthma, uncomplicated" },
        { code: "N18.3",  label: "Chronic kidney disease, stage 3" }

    ];


    /* =====================================================
       SELECTED STATE
    ===================================================== */

    const selected = [];


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
            codes.filter(entry => {

                if (!term) {
                    return true;
                }

                return (
                    entry.code
                        .toLowerCase()
                        .includes(term) ||
                    entry.label
                        .toLowerCase()
                        .includes(term)
                );

            });


        resultsBox.innerHTML = "";


        if (!matches.length) {

            resultsBox.innerHTML = `
                <p class="icd-no-results">
                    No codes match "${term}".
                </p>
            `;

            return;

        }


        matches.forEach(entry => {

            const isAdded =
                selected.some(
                    item =>
                        item.code === entry.code
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "icd-result";


            row.innerHTML = `
                <div class="icd-code">
                    ${entry.code}
                </div>

                <div class="icd-desc">
                    ${entry.label}
                </div>

                <button
                    type="button"
                    class="icd-add"
                    data-code="${entry.code}"
                    ${isAdded ? "disabled" : ""}
                >
                    <i class="fa-solid ${isAdded ? "fa-check" : "fa-plus"}"></i>
                    ${isAdded ? "Added" : "Add"}
                </button>
            `;


            resultsBox.appendChild(row);

        });

    }


    /* =====================================================
       RENDER SELECTED
    ===================================================== */

    function renderSelected() {

        selectedBox.innerHTML = "";


        if (emptyState) {

            emptyState.style.display =
                selected.length
                    ? "none"
                    : "";

        }


        selected.forEach(entry => {

            const chip =
                document.createElement(
                    "div"
                );


            chip.className =
                "icd-chip";


            chip.innerHTML = `
                <div>
                    <strong>${entry.code}</strong>
                    <span>${entry.label}</span>
                </div>

                <button
                    type="button"
                    class="icd-chip-remove"
                    data-code="${entry.code}"
                    aria-label="Remove code"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;


            selectedBox.appendChild(chip);

        });

    }


    /* =====================================================
       ADD / REMOVE
    ===================================================== */

    resultsBox.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".icd-add"
                );


            if (!button) {
                return;
            }


            const code =
                button.dataset.code;


            const entry =
                codes.find(
                    item =>
                        item.code === code
                );


            if (
                !entry ||
                selected.some(
                    item =>
                        item.code === code
                )
            ) {

                return;

            }


            selected.push(entry);

            renderSelected();

            renderResults();

        }
    );


    selectedBox.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".icd-chip-remove"
                );


            if (!button) {
                return;
            }


            const code =
                button.dataset.code;


            const index =
                selected.findIndex(
                    item =>
                        item.code === code
                );


            if (index > -1) {

                selected.splice(index, 1);

                renderSelected();

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
       SAVE
    ===================================================== */

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                if (!selected.length) {

                    showDoctorToast(
                        "No codes selected",
                        "Add at least one ICD-10 code before saving.",
                        "fa-triangle-exclamation"
                    );

                    return;

                }


                console.log(
                    "Saved ICD-10 codes:",
                    selected.map(item => item.code)
                );


                showDoctorToast(
                    "Codes saved",
                    `${selected.length} diagnosis code(s) added to the encounter.`,
                    "fa-check"
                );

            }
        );

    }


    /* =====================================================
       INITIAL RENDER
    ===================================================== */

    renderResults();

    renderSelected();

});
