/* =========================================================
   MEDICO
   INVESTIGATIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const catalogBox =
        document.querySelector(
            "#invCatalog"
        );


    const selectedBox =
        document.querySelector(
            "#invSelected"
        );


    if (
        !catalogBox ||
        !selectedBox
    ) {

        return;

    }


    const searchInput =
        document.querySelector(
            "#invSearch"
        );


    const emptyState =
        document.querySelector(
            "#invEmpty"
        );


    const sendButton =
        document.querySelector(
            "#sendOrdersBtn"
        );


    /* =====================================================
       MOCK TEST CATALOG
    ===================================================== */

    const catalog = [

        { name: "Complete Blood Count", category: "Hematology", turnaround: "2 hrs" },
        { name: "ESR",                  category: "Hematology", turnaround: "4 hrs" },
        { name: "Coagulation Profile",  category: "Hematology", turnaround: "3 hrs" },

        { name: "Basic Metabolic Panel",category: "Chemistry",  turnaround: "3 hrs" },
        { name: "Lipid Panel",          category: "Chemistry",  turnaround: "6 hrs" },
        { name: "HbA1c",                category: "Chemistry",  turnaround: "24 hrs" },
        { name: "Liver Function Test",  category: "Chemistry",  turnaround: "6 hrs" },

        { name: "Troponin I",           category: "Cardiac",    turnaround: "1 hr" },
        { name: "BNP",                  category: "Cardiac",    turnaround: "2 hrs" },

        { name: "Chest X-Ray",          category: "Imaging",    turnaround: "1 hr" },
        { name: "ECG",                  category: "Imaging",    turnaround: "30 min" }

    ];


    /* =====================================================
       SELECTED STATE
    ===================================================== */

    const selected = [];


    /* =====================================================
       RENDER CATALOG
    ===================================================== */

    function renderCatalog() {

        const term =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const matches =
            catalog.filter(test => {

                if (!term) {
                    return true;
                }

                return (
                    test.name
                        .toLowerCase()
                        .includes(term) ||
                    test.category
                        .toLowerCase()
                        .includes(term)
                );

            });


        catalogBox.innerHTML = "";


        if (!matches.length) {

            catalogBox.innerHTML = `
                <p class="inv-no-results">
                    No tests match "${term}".
                </p>
            `;

            return;

        }


        const categories =
            [];


        matches.forEach(test => {

            if (
                !categories.includes(
                    test.category
                )
            ) {

                categories.push(
                    test.category
                );

            }

        });


        categories.forEach(category => {

            const group =
                document.createElement(
                    "div"
                );


            group.className =
                "inv-group";


            let rows = "";


            matches
                .filter(
                    test =>
                        test.category === category
                )
                .forEach(test => {

                    const isSelected =
                        selected.some(
                            item =>
                                item.name === test.name
                        );


                    rows += `
                        <button
                            type="button"
                            class="inv-test ${isSelected ? "selected" : ""}"
                            data-test="${test.name}"
                        >
                            <span class="inv-test-check">
                                <i class="fa-solid ${isSelected ? "fa-check" : "fa-plus"}"></i>
                            </span>

                            <span class="inv-test-name">
                                ${test.name}
                            </span>

                            <span class="inv-test-meta">
                                ${test.turnaround}
                            </span>
                        </button>
                    `;

                });


            group.innerHTML = `
                <div class="inv-group-title">
                    ${category}
                </div>

                ${rows}
            `;


            catalogBox.appendChild(group);

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


        selected.forEach(test => {

            const chip =
                document.createElement(
                    "div"
                );


            chip.className =
                "inv-chip";


            chip.innerHTML = `
                <div>
                    <strong>${test.name}</strong>
                    <span>${test.category}</span>
                </div>

                <button
                    type="button"
                    class="inv-chip-remove"
                    data-test="${test.name}"
                    aria-label="Remove test"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;


            selectedBox.appendChild(chip);

        });

    }


    /* =====================================================
       TOGGLE FROM CATALOG
    ===================================================== */

    catalogBox.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".inv-test"
                );


            if (!button) {
                return;
            }


            const name =
                button.dataset.test;


            const test =
                catalog.find(
                    item =>
                        item.name === name
                );


            if (!test) {
                return;
            }


            const index =
                selected.findIndex(
                    item =>
                        item.name === name
                );


            if (index > -1) {

                selected.splice(index, 1);

            } else {

                selected.push(test);

            }


            renderSelected();

            renderCatalog();

        }
    );


    /* =====================================================
       REMOVE FROM SELECTED
    ===================================================== */

    selectedBox.addEventListener(
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
                button.dataset.test;


            const index =
                selected.findIndex(
                    item =>
                        item.name === name
                );


            if (index > -1) {

                selected.splice(index, 1);

                renderSelected();

                renderCatalog();

            }

        }
    );


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderCatalog
        );

    }


    /* =====================================================
       SEND ORDERS
    ===================================================== */

    if (sendButton) {

        sendButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                if (!selected.length) {

                    showDoctorToast(
                        "No tests selected",
                        "Add at least one test to send orders.",
                        "fa-triangle-exclamation"
                    );

                    return;

                }


                console.log(
                    "Sending investigation orders:",
                    selected.map(item => item.name)
                );


                showDoctorToast(
                    "Orders sent",
                    `${selected.length} investigation(s) sent to the lab.`,
                    "fa-paper-plane"
                );

            }
        );

    }


    /* =====================================================
       INITIAL RENDER
    ===================================================== */

    renderCatalog();

    renderSelected();

});
