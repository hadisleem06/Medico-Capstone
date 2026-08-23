// import { client } from "./client"


/*
    Admin service — the backend seam for the admin workspace.

    Only the two "refresh" actions were asynchronous in the
    original (assets/js/admin.js): #refreshUsers and #refreshLogs
    each spun for 700ms before toasting. They resolve after that
    same fake delay here so the refresh-spinner UX is identical.
    When the backend is ready each body swaps to a `client` call
    (commented import above) with no change to the page.

    Create / edit / activate / deactivate were synchronous in the
    original and stay synchronous in the Users page — no seam needed.
*/

const REFRESH_DELAY = 700


export const adminService = {

    refreshUsers() {

        return new Promise(resolve => {

            setTimeout(
                resolve,
                REFRESH_DELAY
            )

        })

    },


    refreshLogs() {

        return new Promise(resolve => {

            setTimeout(
                resolve,
                REFRESH_DELAY
            )

        })

    },

}
