import { useCallback } from "react"

import { useRole } from "../context/RoleContext"

import { useToast } from "../context/ToastContext"


/*
    Role-aware toast helper.

    The shared account pages (My Profile / Settings) run inside
    all three chrome areas, but each area has its OWN toast skin
    with its own method + signature (see ToastContext):

      doctor -> showDoctorToast(title, message, icon)
      nurse  -> showNurseMessage(message, type)
      admin  -> showAdminMessage(message, type)

    Rather than fork the pages per role, this hook exposes one
    call — notify({ title, message, icon, type }) — and routes it
    to the correct method for the current role, so a page fires
    the right-looking toast without knowing which area it is in.

    - `title` / `icon` are used only by the doctor skin (the
      nurse / admin skins have no title line or custom icon).
    - `type` ("success" | "error" | ...) is used only by the
      nurse / admin skins; the doctor skin has no type.
*/

export function useRoleToast() {

    const role = useRole()

    const {
        showDoctorToast,
        showNurseMessage,
        showAdminMessage,
    } = useToast()


    return useCallback((options) => {

        const {
            title = "",
            message = "",
            icon = "fa-circle-check",
            type = "success",
        } = options || {}


        if (role === "doctor") {
            showDoctorToast(title, message, icon)
            return
        }

        if (role === "nurse") {
            showNurseMessage(message, type)
            return
        }

        showAdminMessage(message, type)

    }, [role, showDoctorToast, showNurseMessage, showAdminMessage])

}
