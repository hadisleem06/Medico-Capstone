import { createContext, useContext } from "react"


/*
    Exposes the current area's role ("doctor" | "nurse" |
    "admin" | "patient") to the chrome components (Topbar,
    ProfileMenu) that pages render inside the layout Outlet.
*/

const RoleContext = createContext(null)


export function RoleProvider({ role, children }) {
    return (
        <RoleContext.Provider value={role}>
            {children}
        </RoleContext.Provider>
    )
}


export function useRole() {
    return useContext(RoleContext)
}
