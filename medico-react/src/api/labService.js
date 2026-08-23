// import { client } from "./client"


/*
    Lab service — the backend seam for lab analysis.

    Today analyze() resolves after the same fake delay the original
    used (the 900ms setTimeout in lab-analysis.js), so the
    "Analyzing..." spinner UX is identical. When the AI
    interpretation endpoint is ready, the body swaps to a `client`
    call (commented import above) with no change to the page.
*/

const ANALYZE_DELAY = 900


export const labService = {

    analyze(report) {

        return new Promise(resolve => {

            setTimeout(
                () => {

                    console.log(
                        "AI lab analysis re-run complete"
                    )

                    resolve({ ...report })

                },
                ANALYZE_DELAY
            )

        })

    },

}
