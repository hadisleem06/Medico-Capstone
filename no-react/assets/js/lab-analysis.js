/* =========================================================
   MEDICO
   AI LAB ANALYSIS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       REPORT SWITCH

       doctor.js wires the .admin-filter open/close, label
       and active state. We only attach to each option and
       read the clicked option's own data-value, so we never
       depend on the order our listener runs relative to it.
    ===================================================== */

    const reportFilter =
        document.querySelector(
            "#labReportFilter"
        );


    if (reportFilter) {

        reportFilter
            .querySelectorAll(".filter-option")
            .forEach(option => {

                option.addEventListener(
                    "click",
                    () => {

                        const value =
                            option.dataset.value ||
                            option.textContent.trim();


                        console.log(
                            "Lab report switched to",
                            value
                        );


                        showDoctorToast(
                            "Report loaded",
                            `Showing ${value}.`,
                            "fa-vials"
                        );

                    }
                );

            });

    }


    /* =====================================================
       RE-RUN ANALYSIS
    ===================================================== */

    const analyzeButton =
        document.querySelector(
            "#analyzeLabBtn"
        );


    if (analyzeButton) {

        analyzeButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const originalHTML =
                    analyzeButton.innerHTML;


                analyzeButton.disabled = true;


                analyzeButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Analyzing...
                `;


                setTimeout(
                    () => {

                        analyzeButton.disabled = false;

                        analyzeButton.innerHTML =
                            originalHTML;


                        console.log(
                            "AI lab analysis re-run complete"
                        );


                        showDoctorToast(
                            "Analysis complete",
                            "AI interpretation has been updated.",
                            "fa-wand-magic-sparkles"
                        );

                    },
                    900
                );

            }
        );

    }

});
