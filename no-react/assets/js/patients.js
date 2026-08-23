/* =========================================================
   MEDICO
   PATIENT DIRECTORY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const grid =
        document.querySelector(
            "#patientsGrid"
        );


    /* =====================================================
       GUARD

       doctor.js already wires the .admin-filter open/close
       and active-state behaviour. This module only reads
       the current selection and re-filters the directory.
    ===================================================== */

    if (!grid) {
        return;
    }


    const cards =
        grid.querySelectorAll(
            ".patient-directory-card"
        );


    const searchInput =
        document.querySelector(
            "#patientSearch"
        );


    const riskFilter =
        document.querySelector(
            "#patientRiskFilter"
        );


    const statusFilter =
        document.querySelector(
            "#patientStatusFilter"
        );


    const emptyState =
        document.querySelector(
            "#patientsEmpty"
        );


    /* =====================================================
       FILTER STATE
    ===================================================== */

    const state = {

        search: "",

        risk: "",

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
       RISK FILTER

       We attach to each option and read the clicked
       option's own data-value, so we never depend on the
       order our listener runs relative to doctor.js.
    ===================================================== */

    bindFilter(
        riskFilter,
        value => {

            state.risk = value;

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
       ADD PATIENT
    ===================================================== */

    const addButton =
        document.querySelector(
            "#addPatientBtn"
        );


    const addModal =
        document.querySelector(
            "#addPatientModal"
        );


    const addForm =
        document.querySelector(
            "#addPatientForm"
        );


    const closeAddBtn =
        document.querySelector(
            "#closeAddPatient"
        );


    const cancelAddBtn =
        document.querySelector(
            "#cancelAddPatient"
        );


    /* avatar palette, rotated for each new patient */

    const avatarColors = [
        "avatar-teal",
        "avatar-purple",
        "avatar-pink",
        "avatar-blue",
        "avatar-orange"
    ];


    let addedCount = 0;


    /* --- OPEN --- */

    if (addButton && addModal) {

        addButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openAddModal();

            }
        );

    }


    /* --- CLOSE: button, cancel, overlay click, Escape --- */

    if (closeAddBtn) {

        closeAddBtn.addEventListener(
            "click",
            closeAddModal
        );

    }


    if (cancelAddBtn) {

        cancelAddBtn.addEventListener(
            "click",
            closeAddModal
        );

    }


    if (addModal) {

        addModal.addEventListener(
            "click",
            event => {

                if (event.target === addModal) {

                    closeAddModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                addModal &&
                addModal.classList.contains("active")
            ) {

                closeAddModal();

            }

        }
    );


    /* --- SUBMIT --- */

    if (addForm) {

        addForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                createPatient();

            }
        );

    }


    function openAddModal() {

        if (!addModal) {
            return;
        }


        addModal.classList.add("active");


        document.body.classList.add(
            "modal-open"
        );


        document.body.style.overflow =
            "hidden";


        const firstInput =
            addModal.querySelector(
                "#newPatientName"
            );


        setTimeout(
            () => {

                if (firstInput) {

                    firstInput.focus();

                }

            },
            150
        );

    }


    function closeAddModal() {

        if (!addModal) {
            return;
        }


        addModal.classList.remove("active");


        document.body.classList.remove(
            "modal-open"
        );


        document.body.style.overflow = "";


        if (addForm) {

            addForm.reset();

        }

    }


    /* =====================================================
       CREATE PATIENT

       Builds a directory card matching the hardcoded
       markup, prepends it and re-runs the active filters.
    ===================================================== */

    function createPatient() {

        if (!grid) {
            return;
        }


        const name =
            (
                document.querySelector(
                    "#newPatientName"
                )?.value || ""
            ).trim();


        const age =
            (
                document.querySelector(
                    "#newPatientAge"
                )?.value || ""
            ).trim();


        const sex =
            document.querySelector(
                "#newPatientSex"
            )?.value || "";


        const condition =
            (
                document.querySelector(
                    "#newPatientCondition"
                )?.value || ""
            ).trim();


        const risk =
            document.querySelector(
                "#newPatientRisk"
            )?.value || "stable";


        const status =
            document.querySelector(
                "#newPatientStatus"
            )?.value || "active";


        if (!name || !age || !condition) {
            return;
        }


        addedCount++;


        const color =
            avatarColors[
                (cards.length + addedCount - 1) %
                avatarColors.length
            ];


        const mrn =
            "#" + (10300 + addedCount);


        const card =
            document.createElement("article");

        card.className =
            "patient-directory-card";

        card.dataset.name = name;

        card.dataset.risk = risk;

        card.dataset.status = status;


        card.innerHTML =
            `
            <div class="patient-card-top">
                <div class="patient-card-avatar ${color}">${getInitials(name)}</div>
                <span class="risk-tag ${risk}">${riskLabel(risk)}</span>
            </div>
            <h3 class="patient-card-name">${escapeHtml(name)}</h3>
            <p class="patient-card-meta">${escapeHtml(age)} yrs · ${escapeHtml(sex)}</p>
            <div class="patient-card-condition">
                <i class="fa-solid fa-heart-pulse"></i>
                ${escapeHtml(condition)}
            </div>
            <div class="patient-card-stats">
                <div><span>Last visit</span><strong>Today</strong></div>
                <div><span>MRN</span><strong>${mrn}</strong></div>
            </div>
            <div class="patient-card-actions">
                <button class="doctor-secondary-btn" data-page="patient-profile.html">
                    <i class="fa-solid fa-folder-open"></i>
                    Open Profile
                </button>
                <button class="icon-btn" title="Message"><i class="fa-solid fa-comment-medical"></i></button>
            </div>
            `;


        grid.prepend(card);


        closeAddModal();


        applyFilters();


        if (typeof showDoctorToast === "function") {

            showDoctorToast(
                "Patient added",
                name + " is now in your directory.",
                "fa-user-plus"
            );

        }

    }


    /* build initials from a full name */

    function getInitials(name) {

        const parts =
            name
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (!parts.length) {
            return "?";
        }


        const first =
            parts[0][0] || "";


        const last =
            parts.length > 1
                ? parts[parts.length - 1][0]
                : "";


        return (first + last).toUpperCase();

    }


    /* map a risk value to its display label */

    function riskLabel(risk) {

        if (risk === "high") {
            return "High";
        }

        if (risk === "moderate") {
            return "Moderate";
        }

        return "Stable";

    }


    /* escape free-text before it enters innerHTML */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

    }


    /* =====================================================
       EXPORT
    ===================================================== */

    const exportButton =
        document.querySelector(
            "#exportPatientsBtn"
        );


    if (exportButton) {

        exportButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                console.log(
                    "Export patient list requested"
                );

                showDoctorToast(
                    "Export started",
                    "Your patient list is being prepared.",
                    "fa-file-export"
                );

            }
        );

    }


    /* =====================================================
       BIND FILTER

       Adds a per-option listener that reports the clicked
       option's data-value back to the caller.
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


        const liveCards =
            grid.querySelectorAll(
                ".patient-directory-card"
            );


        liveCards.forEach(card => {

            const name =
                (card.dataset.name || "")
                    .toLowerCase();


            const condition =
                (
                    card.querySelector(
                        ".patient-card-condition"
                    )?.textContent || ""
                )
                    .toLowerCase();


            const risk =
                card.dataset.risk || "";


            const status =
                card.dataset.status || "";


            const searchMatch =
                !state.search ||
                name.includes(state.search) ||
                condition.includes(state.search);


            const riskMatch =
                !state.risk ||
                risk === state.risk;


            const statusMatch =
                !state.status ||
                status === state.status;


            if (
                searchMatch &&
                riskMatch &&
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
