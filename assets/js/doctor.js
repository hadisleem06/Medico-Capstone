/* =========================================================
   MEDICO
   DOCTOR JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DOCTOR SIDEBAR NAVIGATION
    ===================================================== */

    const sidebarItems = document.querySelectorAll(
        ".sidebar ul li"
    );

    const doctorPages = {

        "Dashboard":
            "dashboard.html",

        "Appointments":
            "appointments.html",

        "Consultation":
            "consultation.html",

        "Patients":
            "patients.html",

        "Patient Profile":
            "patient-profile.html",

        "ICD-10":
            "icd10.html",

        "Investigation":
            "investigation.html",

        "Lab Analysis":
            "lab-analysis.html",

        "Radiology":
            "radiology-analysis.html",

        "Medication AI":
            "medication-assistant.html",

        "Reports":
            "reports.html",

        "SOAP Notes":
            "soap.html"

    };


    sidebarItems.forEach(item => {

        item.addEventListener("click", () => {

            const span = item.querySelector("span");

            if (!span) {
                return;
            }

            const page = span.textContent.trim();

            if (doctorPages[page]) {

                window.location.href =
                    doctorPages[page];

            }

        });

    });


    /* =====================================================
       QUICK NAVIGATION

       Powers the dashboard command CTAs and the
       quick-action tiles across the doctor workspace.

           [data-page]           -> navigate to that page
           [data-doctor-action]  -> mapped clinical shortcut
    ===================================================== */

    const doctorActionPages = {

        "start-consultation":
            "consultation.html",

        "view-appointments":
            "appointments.html",

        "view-patients":
            "patients.html",

        "view-patient":
            "patient-profile.html",

        "open-ai":
            "lab-analysis.html"

    };


    document.addEventListener(
        "click",
        event => {

            const pageTarget =
                event.target.closest("[data-page]");

            if (pageTarget) {

                const page =
                    pageTarget.dataset.page;

                if (page) {

                    window.location.href = page;

                    return;

                }

            }


            const actionTarget =
                event.target.closest(
                    "[data-doctor-action]"
                );

            if (actionTarget) {

                const action =
                    actionTarget.dataset.doctorAction;

                if (doctorActionPages[action]) {

                    window.location.href =
                        doctorActionPages[action];

                }

            }

        }
    );


    /* =====================================================
       SIDEBAR REFERENCE

       Collapse + chevron handling lives in global.js
       (single source of truth). We keep only the sidebar
       reference here for the mobile toggle below.
    ===================================================== */

    const sidebar = document.querySelector(".sidebar");


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    const mobileToggle =
        document.querySelector(
            ".mobile-sidebar-toggle"
        );


    if (mobileToggle && sidebar) {

        mobileToggle.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                sidebar.classList.toggle(
                    "mobile-open"
                );

            }
        );

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logoutButtons =
        document.querySelectorAll(
            ".logout, .logout-item"
        );


    logoutButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                window.location.href =
                    "../../index.html";

            }
        );

    });


    /* =====================================================
       PROFILE DROPDOWN

       Handled globally in global.js via
       .profile-menu.show (the only selector any
       stylesheet reveals). Kept out of here so the
       menu is not double-bound.
    ===================================================== */


    /* =====================================================
       THEME TOGGLE

       Handled globally in global.js through the
       .light-mode body class + localStorage("theme").
       No doctor-specific theme handling (the old
       .light-theme toggle matched no stylesheet).
    ===================================================== */


    /* =====================================================
       APPOINTMENT MODAL
       
       IMPORTANT:
       The modal already exists in HTML.
       We DO NOT create another one.
    ===================================================== */

    initAppointmentModal();


    /* =====================================================
       APPOINTMENT FILTERS
    ===================================================== */

    initAppointmentFilters();


    /* =====================================================
       TODAY BUTTON
    ===================================================== */

    const todayBtn =
        document.querySelector("#todayBtn");


    if (todayBtn) {

        todayBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const dateFilter =
                    document.querySelector(
                        "#appointmentDateFilter"
                    );


                if (!dateFilter) {
                    return;
                }


                const todayOption =
                    dateFilter.querySelector(
                        '[data-value="today"]'
                    );


                if (todayOption) {

                    todayOption.click();

                }

            }
        );

    }


    /* =====================================================
       START APPOINTMENT
    ===================================================== */

    initAppointmentStartButtons();


    /* =====================================================
       APPOINTMENT ICON BUTTONS
    ===================================================== */

    initAppointmentIconButtons();


    /* =====================================================
       INITIAL FILTER STATE
    ===================================================== */

    applyAppointmentFilters();

});


/* =========================================================
   APPOINTMENT MODAL
========================================================= */

function initAppointmentModal() {

    const modal =
        document.querySelector(
            "#appointmentModal"
        );


    const openButton =
        document.querySelector(
            "#newAppointmentBtn"
        );


    if (!modal) {
        return;
    }


    const closeButton =
        modal.querySelector(
            "#closeAppointmentModal"
        );


    const cancelButton =
        modal.querySelector(
            "#cancelAppointmentModal"
        );


    const form =
        modal.querySelector(
            "#appointmentForm"
        );


    /* =====================================================
       OPEN
    ===================================================== */

    if (openButton) {

        openButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openAppointmentModal();

            }
        );

    }


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeAppointmentModal();

            }
        );

    }


    /* =====================================================
       CANCEL BUTTON
    ===================================================== */

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeAppointmentModal();

            }
        );

    }


    /* =====================================================
       OVERLAY CLICK
    ===================================================== */

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeAppointmentModal();

            }

        }
    );


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeAppointmentModal();

            }

        }
    );


    /* =====================================================
       SUMMARY INPUTS
    ===================================================== */

    const summaryInputs =
        modal.querySelectorAll(
            "#appointmentPatient, " +
            "#appointmentDate, " +
            "#appointmentTime, " +
            "#appointmentType, " +
            "#appointmentDuration"
        );


    summaryInputs.forEach(input => {

        input.addEventListener(
            "change",
            updateAppointmentSummary
        );

        input.addEventListener(
            "input",
            updateAppointmentSummary
        );

    });


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const patient =
                    document.querySelector(
                        "#appointmentPatient"
                    )?.value;


                const type =
                    document.querySelector(
                        "#appointmentType"
                    )?.value;


                const date =
                    document.querySelector(
                        "#appointmentDate"
                    )?.value;


                const time =
                    document.querySelector(
                        "#appointmentTime"
                    )?.value;


                const notes =
                    document.querySelector(
                        "#appointmentNotes"
                    )?.value || "";


                const duration =
                    document.querySelector(
                        "#appointmentDuration"
                    )?.value || "30";


                if (
                    !patient ||
                    !type ||
                    !date ||
                    !time
                ) {

                    form.reportValidity();

                    return;

                }


                const submitButton =
                    form.querySelector(
                        'button[type="submit"]'
                    );


                if (!submitButton) {
                    return;
                }


                const originalHTML =
                    submitButton.innerHTML;


                submitButton.disabled = true;


                submitButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Scheduling...
                `;


                setTimeout(
                    () => {

                        console.log(
                            "New appointment:",
                            {
                                patient,
                                type,
                                date,
                                time,
                                duration,
                                notes
                            }
                        );


                        submitButton.disabled =
                            false;


                        submitButton.innerHTML =
                            originalHTML;


                        form.reset();


                        updateAppointmentSummary();


                        closeAppointmentModal();


                        showAppointmentSuccess(
                            patient,
                            date,
                            time
                        );

                    },
                    900
                );

            }
        );

    }


    /* =====================================================
       MINIMUM DATE
    ===================================================== */

    const dateInput =
        modal.querySelector(
            "#appointmentDate"
        );


    if (dateInput) {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );


        dateInput.min =
            `${year}-${month}-${day}`;

    }


    /* =====================================================
       INITIAL SUMMARY
    ===================================================== */

    updateAppointmentSummary();

}


/* =========================================================
   OPEN APPOINTMENT MODAL
========================================================= */

function openAppointmentModal() {

    const modal =
        document.querySelector(
            "#appointmentModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.add("active");


    document.body.classList.add(
        "modal-open"
    );


    document.body.style.overflow =
        "hidden";


    const firstInput =
        modal.querySelector(
            "#appointmentPatient"
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


/* =========================================================
   CLOSE APPOINTMENT MODAL
========================================================= */

function closeAppointmentModal() {

    const modal =
        document.querySelector(
            "#appointmentModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove("active");


    document.body.classList.remove(
        "modal-open"
    );


    document.body.style.overflow = "";


    const form =
        modal.querySelector(
            "#appointmentForm"
        );


    if (form) {

        form.classList.remove(
            "submitted"
        );

    }

}


/* =========================================================
   APPOINTMENT SUMMARY
========================================================= */

function updateAppointmentSummary() {

    const summary =
        document.querySelector(
            "#appointmentSummary"
        );


    if (!summary) {
        return;
    }


    const patient =
        document.querySelector(
            "#appointmentPatient"
        )?.value;


    const date =
        document.querySelector(
            "#appointmentDate"
        )?.value;


    const time =
        document.querySelector(
            "#appointmentTime"
        )?.value;


    const type =
        document.querySelector(
            "#appointmentType"
        )?.value;


    const duration =
        document.querySelector(
            "#appointmentDuration"
        )?.value || "30";


    if (
        !patient &&
        !date &&
        !time
    ) {

        summary.textContent =
            "Select a patient, date and time";

        return;

    }


    const parts = [];


    if (patient) {

        parts.push(patient);

    }


    if (date) {

        const formattedDate =
            formatAppointmentDate(date);

        parts.push(
            formattedDate
        );

    }


    if (time) {

        parts.push(
            formatAppointmentTime(time)
        );

    }


    if (type) {

        parts.push(type);

    }


    if (duration) {

        parts.push(
            `${duration} min`
        );

    }


    summary.textContent =
        parts.join(" · ");

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatAppointmentDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatAppointmentTime(timeString) {

    if (!timeString) {
        return "";
    }


    const [hours, minutes] =
        timeString.split(":");


    const date =
        new Date();


    date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );


    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   APPOINTMENT FILTERS
========================================================= */

function initAppointmentFilters() {

    const filters =
        document.querySelectorAll(
            ".admin-filter"
        );


    filters.forEach(filter => {

        const trigger =
            filter.querySelector(
                ".filter-trigger"
            );


        const menu =
            filter.querySelector(
                ".filter-menu"
            );


        const options =
            filter.querySelectorAll(
                ".filter-option"
            );


        if (
            !trigger ||
            !menu
        ) {

            return;

        }


        trigger.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                document
                    .querySelectorAll(
                        ".admin-filter.open"
                    )
                    .forEach(
                        otherFilter => {

                            if (
                                otherFilter !==
                                filter
                            ) {

                                otherFilter.classList.remove(
                                    "open"
                                );

                            }

                        }
                    );


                filter.classList.toggle(
                    "open"
                );

            }
        );


        options.forEach(option => {

            option.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    options.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    option.classList.add(
                        "active"
                    );


                    const triggerText =
                        trigger.querySelector(
                            "span"
                        );


                    if (triggerText) {

                        const span =
                            option.querySelector(
                                "span"
                            );


                        if (span) {

                            triggerText.textContent =
                                span.textContent.trim();

                        } else {

                            triggerText.textContent =
                                option.textContent.trim();

                        }

                    }


                    filter.classList.remove(
                        "open"
                    );


                    applyAppointmentFilters();

                }
            );

        });

    });


    /* =====================================================
       CLOSE FILTERS OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(
                    ".admin-filter.open"
                )
                .forEach(filter => {

                    filter.classList.remove(
                        "open"
                    );

                });

        }
    );

}


/* =========================================================
   APPLY APPOINTMENT FILTERS
========================================================= */

function applyAppointmentFilters() {

    const statusFilter =
        document.querySelector(
            "#appointmentStatusFilter"
        );


    const dateFilter =
        document.querySelector(
            "#appointmentDateFilter"
        );


    const cards =
        document.querySelectorAll(
            ".doctor-appointment-card"
        );


    if (!cards.length) {
        return;
    }


    let selectedStatus = "";

    let selectedDate = "";


    /* =====================================================
       STATUS
    ===================================================== */

    if (statusFilter) {

        const activeStatus =
            statusFilter.querySelector(
                ".filter-option.active"
            );


        if (activeStatus) {

            selectedStatus =
                activeStatus.dataset.value || "";

        }

    }


    /* =====================================================
       DATE
    ===================================================== */

    if (dateFilter) {

        const activeDate =
            dateFilter.querySelector(
                ".filter-option.active"
            );


        if (activeDate) {

            selectedDate =
                activeDate.dataset.value || "";

        }

    }


    /* =====================================================
       FILTER CARDS
    ===================================================== */

    cards.forEach(card => {

        const cardStatus =
            card.dataset.status || "";


        const cardDate =
            card.dataset.date || "";


        const statusMatch =
            !selectedStatus ||
            cardStatus === selectedStatus;


        const dateMatch =
            !selectedDate ||
            cardDate === selectedDate;


        if (
            statusMatch &&
            dateMatch
        ) {

            card.style.display = "";

            card.classList.remove(
                "filter-hidden"
            );

        } else {

            card.classList.add(
                "filter-hidden"
            );

            card.style.display =
                "none";

        }

    });


    updateEmptyAppointmentsState();

}


/* =========================================================
   EMPTY APPOINTMENT STATE
========================================================= */

function updateEmptyAppointmentsState() {

    const timeline =
        document.querySelector(
            ".appointment-timeline"
        );


    if (!timeline) {
        return;
    }


    const cards =
        timeline.querySelectorAll(
            ".doctor-appointment-card"
        );


    const visibleCards =
        Array.from(cards).filter(
            card =>
                card.style.display !== "none"
        );


    let emptyState =
        timeline.querySelector(
            ".appointment-empty-state"
        );


    if (
        visibleCards.length === 0
    ) {

        if (!emptyState) {

            emptyState =
                document.createElement(
                    "div"
                );


            emptyState.className =
                "appointment-empty-state";


            emptyState.innerHTML = `
                <div class="empty-state-icon">
                    <i class="fa-solid fa-calendar-xmark"></i>
                </div>

                <h3>
                    No appointments found
                </h3>

                <p>
                    There are no appointments
                    matching the selected filters.
                </p>
            `;


            timeline.appendChild(
                emptyState
            );

        }

    } else {

        if (emptyState) {

            emptyState.remove();

        }

    }

}


/* =========================================================
   START APPOINTMENT BUTTONS
========================================================= */

function initAppointmentStartButtons() {

    const buttons =
        document.querySelectorAll(
            ".appointment-start"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const card =
                    button.closest(
                        ".doctor-appointment-card"
                    );


                if (!card) {
                    return;
                }


                const patient =
                    card.dataset.patient ||
                    "Patient";


                button.disabled = true;


                button.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Starting...
                `;


                setTimeout(
                    () => {

                        button.disabled =
                            false;


                        button.innerHTML = `
                            <i class="fa-solid fa-stethoscope"></i>
                            Consultation
                        `;


                        console.log(
                            "Starting consultation for:",
                            patient
                        );

                    },
                    800
                );

            }
        );

    });

}


/* =========================================================
   APPOINTMENT ICON BUTTONS
========================================================= */

function initAppointmentIconButtons() {

    const buttons =
        document.querySelectorAll(
            ".appointment-actions .icon-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const card =
                    button.closest(
                        ".doctor-appointment-card"
                    );


                if (!card) {
                    return;
                }


                const patient =
                    card.dataset.patient ||
                    "Patient";


                const icon =
                    button.querySelector("i");


                if (
                    icon &&
                    icon.classList.contains(
                        "fa-user"
                    )
                ) {

                    console.log(
                        "Opening patient profile:",
                        patient
                    );

                } else {

                    console.log(
                        "More actions:",
                        patient
                    );

                }

            }
        );

    });

}


/* =========================================================
   SUCCESS TOAST
========================================================= */

function showDoctorToast(
    title,
    message,
    icon
) {

    const iconClass =
        icon || "fa-check";


    const oldToast =
        document.querySelector(
            ".appointment-success-toast"
        );


    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "appointment-success-toast";


    toast.innerHTML = `

        <div class="success-icon">

            <i class="fa-solid ${iconClass}"></i>

        </div>


        <div class="success-content">

            <strong>
                ${title}
            </strong>

            <span>
                ${message}
            </span>

        </div>


        <button
            type="button"
            class="success-close"
        >

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {

            toast.classList.add(
                "show"
            );

        }
    );


    const close =
        toast.querySelector(
            ".success-close"
        );


    if (close) {

        close.addEventListener(
            "click",
            () => {

                removeToast(
                    toast
                );

            }
        );

    }


    setTimeout(
        () => {

            removeToast(
                toast
            );

        },
        4500
    );

}


/* =========================================================
   APPOINTMENT SUCCESS TOAST
========================================================= */

function showAppointmentSuccess(
    patient,
    date,
    time
) {

    showDoctorToast(
        "Appointment scheduled",
        `${patient} · ` +
        `${formatAppointmentDate(date)} · ` +
        `${formatAppointmentTime(time)}`,
        "fa-check"
    );

}


/* =========================================================
   REMOVE TOAST
========================================================= */

function removeToast(toast) {

    if (!toast) {
        return;
    }


    toast.classList.remove(
        "show"
    );


    setTimeout(
        () => {

            if (
                toast.parentElement
            ) {

                toast.remove();

            }

        },
        300
    );

}