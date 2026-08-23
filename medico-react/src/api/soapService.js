// import { client } from "./client"


/*
    SOAP service — the backend seam for SOAP notes.

    Today the body resolves after the same fake delay the
    original used (the setTimeout in soap.js's "Save Note"
    handler), so the UX is identical. When the backend is
    ready, the body swaps to a `client` call (commented import
    above) with no change to the page.
*/

const SAVE_DELAY = 900


export const soapService = {

    /*
        save — the "Save Note" button.

        Mock: resolves the saved note after SAVE_DELAY,
        mirroring the original 900ms fake save + console.log.
        Later: return client.post("/soap-notes", note).
    */

    save(note) {

        return new Promise(resolve => {

            setTimeout(
                () => {

                    console.log(
                        "SOAP note saved for",
                        note.patient
                    )

                    resolve({ ...note })

                },
                SAVE_DELAY
            )

        })

    },

}
