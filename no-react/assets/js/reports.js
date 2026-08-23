/* =========================================================
   MEDICO
   CLINICAL REPORTS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const list =
        document.querySelector(
            "#reportsList"
        );


    /* =====================================================
       GUARD

       doctor.js already wires the .admin-filter open/close
       and active-state behaviour. This module only reads
       the current selection and re-filters the list, and
       owns its own report-generator modal.
    ===================================================== */

    if (!list) {
        return;
    }


    const cards =
        list.querySelectorAll(
            ".report-card"
        );


    const searchInput =
        document.querySelector(
            "#reportSearch"
        );


    const typeFilter =
        document.querySelector(
            "#reportTypeFilter"
        );


    const statusFilter =
        document.querySelector(
            "#reportStatusFilter"
        );


    const emptyState =
        document.querySelector(
            "#reportsEmpty"
        );


    /* =====================================================
       FILTER STATE
    ===================================================== */

    const state = {

        search: "",

        type: "",

        status: ""

    };


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                state.search =
                    searchInput.value
                        .trim()
                        .toLowerCase();

                applyFilters();

            }
        );

    }


    /* =====================================================
       TYPE FILTER
    ===================================================== */

    bindFilter(
        typeFilter,
        value => {

            state.type = value;

            applyFilters();

        }
    );


    /* =====================================================
       STATUS FILTER
    ===================================================== */

    bindFilter(
        statusFilter,
        value => {

            state.status = value;

            applyFilters();

        }
    );


    /* =====================================================
       REPORT GENERATOR MODAL
    ===================================================== */

    const modal =
        document.querySelector(
            "#reportModal"
        );


    const openButton =
        document.querySelector(
            "#newReportBtn"
        );


    const closeButton =
        document.querySelector(
            "#closeReportModal"
        );


    const cancelButton =
        document.querySelector(
            "#cancelReportModal"
        );


    const form =
        document.querySelector(
            "#reportForm"
        );


    function openModal() {

        if (!modal) {
            return;
        }

        modal.classList.add("active");

        document.body.style.overflow =
            "hidden";

    }


    function closeModal() {

        if (!modal) {
            return;
        }

        modal.classList.remove("active");

        document.body.style.overflow = "";

    }


    if (openButton) {

        openButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openModal();

            }
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (event.target === modal) {

                    closeModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal &&
                modal.classList.contains("active")
            ) {

                closeModal();

            }

        }
    );


    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const type =
                    document.querySelector(
                        "#reportType"
                    );


                if (
                    type &&
                    !type.value
                ) {

                    showDoctorToast(
                        "Report type required",
                        "Choose a report type to continue.",
                        "fa-triangle-exclamation"
                    );

                    return;

                }


                console.log(
                    "Generating report:",
                    type ? type.value : ""
                );


                closeModal();

                form.reset();


                showDoctorToast(
                    "Report generated",
                    "The new report has been added to the library.",
                    "fa-file-medical"
                );

            }
        );

    }


    /* =====================================================
       VIEW REPORT
    ===================================================== */

    list.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".report-view"
                );


            if (!button) {
                return;
            }


            const card =
                button.closest(
                    ".report-card"
                );


            const title =
                card
                    ? card.querySelector(
                        ".report-card-body strong"
                    )?.textContent || "Report"
                    : "Report";


            console.log(
                "Opening report:",
                title
            );


            showDoctorToast(
                "Opening report",
                `Loading ${title} in the preview.`,
                "fa-eye"
            );

        }
    );


    /* =====================================================
       DOWNLOAD
    ===================================================== */

    const downloadButton =
        document.querySelector(
            "#downloadReportBtn"
        );


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                console.log(
                    "Report PDF download requested"
                );

                showDoctorToast(
                    "Download started",
                    "Preparing the report PDF.",
                    "fa-download"
                );

            }
        );

    }


    /* =====================================================
       BIND FILTER

       Adds a per-option listener that reports the clicked
       option's data-value back to the caller, without
       touching the open/active state doctor.js manages.
    ===================================================== */

    function bindFilter(filter, onSelect) {

        if (!filter) {
            return;
        }


        const options =
            filter.querySelectorAll(
                ".filter-option"
            );


        options.forEach(option => {

            option.addEventListener(
                "click",
                () => {

                    onSelect(
                        option.dataset.value || ""
                    );

                }
            );

        });

    }


    /* =====================================================
       APPLY FILTERS
    ===================================================== */

    function applyFilters() {

        let visibleCount = 0;


        cards.forEach(card => {

            const title =
                (card.dataset.title || "")
                    .toLowerCase();


            const type =
                card.dataset.type || "";


            const status =
                card.dataset.status || "";


            const searchMatch =
                !state.search ||
                title.includes(state.search);


            const typeMatch =
                !state.type ||
                type === state.type;


            const statusMatch =
                !state.status ||
                status === state.status;


            if (
                searchMatch &&
                typeMatch &&
                statusMatch
            ) {

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });


        if (emptyState) {

            emptyState.hidden =
                visibleCount !== 0;

        }

    }

});
