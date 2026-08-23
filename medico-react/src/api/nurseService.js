// import { client } from "./client"


/*
    Nurse service — the backend seam for the nurse workspace.

    Only the two "refresh" actions were asynchronous in the
    original (assets/js/nurse.js): #refreshQueue and #refreshPatients
    each spun for 600ms before toasting. They resolve after that
    same fake delay here so the refresh-spinner UX is identical.
    When the backend is ready each body swaps to a `client` call
    (commented import above) with no change to the page.

    Register / save-vitals / call-patient were synchronous in the
    original and stay synchronous in their pages — no seam needed.
*/

const REFRESH_DELAY = 600


export const nurseService = {

    refreshQueue() {

        return new Promise(resolve => {

            setTimeout(
                resolve,
                REFRESH_DELAY
            )

        })

    },


    refreshPatients() {

        return new Promise(resolve => {

            setTimeout(
                resolve,
                REFRESH_DELAY
            )

        })

    },

}
