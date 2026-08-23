/* =========================================================
   MEDICO
   AI RADIOLOGY ANALYSIS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       STUDY SWITCH

       doctor.js wires the .admin-filter open/close, label
       and active state. We track the current modality/study
       from each clicked option's data-value, so we never
       depend on the order our listener runs relative to it.
    ===================================================== */

    const modalityFilter =
        document.querySelector(
            "#radModalityFilter"
        );


    const studyFilter =
        document.querySelector(
            "#radStudyFilter"
        );


    let modality = "Chest X-Ray";

    let study = "#A-2291";


    function announceStudy() {

        console.log(
            "Radiology study loaded:",
            modality,
            study
        );


        showDoctorToast(
            "Study loaded",
            `Showing ${modality} · ${study}.`,
            "fa-x-ray"
        );

    }


    bindStudyFilter(
        modalityFilter,
        value => {

            modality = value;

            announceStudy();

        }
    );


    bindStudyFilter(
        studyFilter,
        value => {

            study = value;

            announceStudy();

        }
    );


    function bindStudyFilter(filter, onSelect) {

        if (!filter) {
            return;
        }


        filter
            .querySelectorAll(".filter-option")
            .forEach(option => {

                option.addEventListener(
                    "click",
                    () => {

                        onSelect(
                            option.dataset.value ||
                            option.textContent.trim()
                        );

                    }
                );

            });

    }


    /* =====================================================
       GENERATE REPORT
    ===================================================== */

    const generateButton =
        document.querySelector(
            "#genRadReportBtn"
        );


    if (generateButton) {

        generateButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const originalHTML =
                    generateButton.innerHTML;


                generateButton.disabled = true;


                generateButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Generating...
                `;


                setTimeout(
                    () => {

                        generateButton.disabled = false;

                        generateButton.innerHTML =
                            originalHTML;


                        console.log(
                            "Radiology report generated"
                        );


                        showDoctorToast(
                            "Report generated",
                            "Radiology report is ready to review.",
                            "fa-file-medical"
                        );

                    },
                    900
                );

            }
        );

    }


    /* =====================================================
       DOWNLOAD
    ===================================================== */

    const downloadButton =
        document.querySelector(
            "#downloadRadBtn"
        );


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                console.log(
                    "Radiology report download requested"
                );


                showDoctorToast(
                    "Download started",
                    "Preparing the imaging report PDF.",
                    "fa-download"
                );

            }
        );

    }

});
