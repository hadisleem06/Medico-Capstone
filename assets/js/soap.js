/* =========================================================
   MEDICO
   SOAP NOTES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const sections =
        document.querySelectorAll(
            ".soap-textarea"
        );


    if (!sections.length) {
        return;
    }


    /* =====================================================
       AUTOSAVE INDICATOR
    ===================================================== */

    const autosave =
        document.querySelector(
            "#soapAutosave"
        );


    let saveTimeout = null;


    sections.forEach(section => {

        section.addEventListener(
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
                                Draft saved
                            `;

                        },
                        800
                    );

            }
        );

    });


    /* =====================================================
       PATIENT SWITCH
    ===================================================== */

    const patientSelect =
        document.querySelector(
            "#soapPatient"
        );


    if (patientSelect) {

        patientSelect.addEventListener(
            "change",
            () => {

                console.log(
                    "SOAP patient switched to",
                    patientSelect.value
                );

                showDoctorToast(
                    "Patient loaded",
                    `Now documenting for ${patientSelect.value}.`,
                    "fa-user"
                );

            }
        );

    }


    /* =====================================================
       SAVE NOTE
    ===================================================== */

    const saveBtn =
        document.querySelector(
            "#saveSoapBtn"
        );


    if (saveBtn) {

        saveBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const patient =
                    patientSelect
                        ? patientSelect.value
                        : "the patient";


                const originalHTML =
                    saveBtn.innerHTML;


                saveBtn.disabled = true;


                saveBtn.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Saving...
                `;


                setTimeout(
                    () => {

                        saveBtn.disabled = false;

                        saveBtn.innerHTML =
                            originalHTML;


                        console.log(
                            "SOAP note saved for",
                            patient
                        );


                        showDoctorToast(
                            "SOAP note saved",
                            `Note added to ${patient}'s record.`,
                            "fa-notes-medical"
                        );

                    },
                    900
                );

            }
        );

    }

});
