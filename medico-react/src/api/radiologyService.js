// import { client } from "./client"


/*
    Radiology service — the backend seam for radiology analysis.

    Today generateReport() resolves after the same fake delay the
    original used (the 900ms setTimeout in radiology-analysis.js),
    so the "Generating..." spinner UX is identical. When the AI
    radiology-report endpoint is ready, the body swaps to a `client`
    call (commented import above) with no change to the page.
*/

const GENERATE_DELAY = 900


export const radiologyService = {

    generateReport(study) {

        return new Promise(resolve => {

            setTimeout(
                () => {

                    console.log(
                        "Radiology report generated"
                    )

                    resolve({ ...study })

                },
                GENERATE_DELAY
            )

        })

    },

}
