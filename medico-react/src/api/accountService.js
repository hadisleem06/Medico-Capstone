// import { client } from "./client"


/*
    Account service — the backend seam for the My Profile and
    Settings pages.

    Saving a profile / settings block is the only asynchronous
    action these pages perform, so — like the other services —
    each method resolves after a fake delay (so the Save button's
    spinner UX is real) and then persists through the storage
    helpers in src/data/account.js. When the backend exists each
    body swaps its persist call for a `client.put(...)` (commented
    import above) with no change to the page or context.

    Reads stay synchronous (AccountContext seeds straight from
    src/data/account.js on mount), matching the project's rule
    that only writes cross the async seam.
*/

import {
    writeStoredProfile,
    writeStoredSettings,
} from "../data/account"


const SAVE_DELAY = 700


export const accountService = {

    saveProfile(role, profile) {

        return new Promise(resolve => {

            setTimeout(() => {

                writeStoredProfile(role, profile)

                resolve(profile)

            }, SAVE_DELAY)

        })

    },


    saveSettings(role, settings) {

        return new Promise(resolve => {

            setTimeout(() => {

                writeStoredSettings(role, settings)

                resolve(settings)

            }, SAVE_DELAY)

        })

    },

}
