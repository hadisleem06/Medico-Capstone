import {
    createContext,
    useCallback,
    useContext,
    useState,
} from "react"

import { accountService } from "../api/accountService"

import {
    readStoredProfile,
    readStoredSettings,
} from "../data/account"


/*
    Account state for the current role area.

    Provided once per chrome area by AppLayout (inside RoleProvider),
    so both the account pages (My Profile / Settings) and the shared
    ProfileMenu read the SAME live identity — editing your name or
    photo on the profile page updates the topbar menu immediately.

    Seeding is synchronous (readStored* merges persisted overrides
    over the ROLES-derived defaults), matching the project's rule
    that reads never show a loading state. Saves go through the
    async accountService seam: saveProfile / saveSettings return the
    service promise (so a page can drive a Save spinner) and fold the
    result back into state once it resolves.

    State is keyed by role via the initializer; each role area mounts
    its own provider, so navigating between areas re-seeds cleanly.
*/

const AccountContext = createContext(null)


export function AccountProvider({ role, children }) {

    const [profile, setProfile] = useState(
        () => readStoredProfile(role)
    )

    const [settings, setSettings] = useState(
        () => readStoredSettings(role)
    )


    const saveProfile = useCallback((next) => {

        return accountService
            .saveProfile(role, next)
            .then(saved => {

                setProfile(prev => ({
                    ...prev,
                    ...saved,
                    header: {
                        ...prev.header,
                        ...(saved.header || {}),
                    },
                }))

                return saved

            })

    }, [role])


    const saveSettings = useCallback((next) => {

        return accountService
            .saveSettings(role, next)
            .then(saved => {

                setSettings(saved)

                return saved

            })

    }, [role])


    const value = {
        role,
        profile,
        settings,
        saveProfile,
        saveSettings,
    }


    return (
        <AccountContext.Provider value={value}>
            {children}
        </AccountContext.Provider>
    )

}


export function useAccount() {

    const ctx = useContext(AccountContext)

    if (!ctx) {
        throw new Error("useAccount must be used within an AccountProvider")
    }

    return ctx

}
