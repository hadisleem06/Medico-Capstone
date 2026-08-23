/* =========================================================
   MEDICO
   PATIENT PROFILE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       TABS
    ===================================================== */

    const tabs =
        document.querySelectorAll(
            ".profile-tab"
        );


    const panels =
        document.querySelectorAll(
            ".profile-panel"
        );


    if (tabs.length && panels.length) {

        tabs.forEach(tab => {

            tab.addEventListener(
                "click",
                () => {

                    const target =
                        tab.dataset.tab;


                    tabs.forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                    tab.classList.add(
                        "active"
                    );


                    panels.forEach(panel => {

                        panel.classList.toggle(
                            "active",
                            panel.dataset.panel === target
                        );

                    });

                }
            );

        });

    }


    /* =====================================================
       MESSAGE PATIENT
    ===================================================== */

    const messageButton =
        document.querySelector(
            "#messagePatientBtn"
        );


    if (messageButton) {

        messageButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                console.log(
                    "Message patient requested"
                );

                showDoctorToast(
                    "Message sent",
                    "Your secure message has been delivered to the patient.",
                    "fa-comment-medical"
                );

            }
        );

    }

});
