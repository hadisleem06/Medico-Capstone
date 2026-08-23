/* =========================================================
   MEDICO
   LIVE CONSULTATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SESSION TIMER
    ===================================================== */

    const timerValue =
        document.querySelector(
            "#consultTimerValue"
        );


    let seconds = 0;

    let timerId = null;


    if (timerValue) {

        timerId =
            setInterval(
                () => {

                    seconds++;

                    timerValue.textContent =
                        formatDuration(seconds);

                },
                1000
            );

    }


    function formatDuration(total) {

        const minutes =
            Math.floor(total / 60);


        const secs =
            total % 60;


        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(secs).padStart(2, "0")
        );

    }


    /* =====================================================
       AUTOSAVE INDICATOR
    ===================================================== */

    const autosave =
        document.querySelector(
            "#consultAutosave"
        );


    const editors =
        document.querySelectorAll(
            "#chiefComplaint, #clinicalNotes"
        );


    let saveTimeout = null;


    editors.forEach(editor => {

        editor.addEventListener(
            "input",
            () => {

                if (!autosave) {
                    return;
                }


                autosave.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Saving...
                `;


                clearTimeout(saveTimeout);


                saveTimeout =
                    setTimeout(
                        () => {

                            autosave.innerHTML = `
                                <i class="fa-solid fa-cloud"></i>
                                All changes saved
                            `;

                        },
                        800
                    );

            }
        );

    });


    /* =====================================================
       SAVE DRAFT
    ===================================================== */

    const saveDraftBtn =
        document.querySelector(
            "#saveDraftBtn"
        );


    if (saveDraftBtn) {

        saveDraftBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                console.log(
                    "Consultation draft saved"
                );

                showDoctorToast(
                    "Draft saved",
                    "Your consultation notes have been saved.",
                    "fa-floppy-disk"
                );

            }
        );

    }


    /* =====================================================
       COMPLETE CONSULTATION
    ===================================================== */

    const completeBtn =
        document.querySelector(
            "#completeConsultBtn"
        );


    if (completeBtn) {

        completeBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();


                if (timerId) {

                    clearInterval(timerId);

                }


                console.log(
                    "Consultation completed at",
                    timerValue
                        ? timerValue.textContent
                        : "00:00"
                );


                showDoctorToast(
                    "Consultation complete",
                    "Encounter closed and saved to the patient record.",
                    "fa-circle-check"
                );

            }
        );

    }

});
