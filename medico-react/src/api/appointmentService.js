import { doctorAppointments } from "../data/appointments"

// import { client } from "./client"


/*
    Appointment service — the backend seam for appointments.

    Today the bodies resolve from the in-memory seed data after
    the same fake delay the original used (setTimeout in
    initAppointmentModal), so the UX is identical. When the
    backend is ready, each body swaps to a `client` call
    (commented import above) with no change to the pages.
*/

const CREATE_DELAY = 900


export const appointmentService = {

    /* read — synchronous seed, used for the initial render */

    list() {
        return doctorAppointments
    },


    /*
        create — the New Appointment form submit.

        Mock: resolves the new appointment after CREATE_DELAY,
        mirroring the original 900ms fake submit + console.log.
        Later: return client.post("/appointments", appointment).
    */

    create(appointment) {

        return new Promise(resolve => {

            setTimeout(
                () => {

                    console.log(
                        "New appointment:",
                        appointment
                    )

                    resolve({ ...appointment })

                },
                CREATE_DELAY
            )

        })

    },

}
