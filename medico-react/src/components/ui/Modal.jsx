import { useEffect, useRef } from "react"

import { createPortal } from "react-dom"


/*
    Modal — shared open/close behaviour for the app's modals.

    Reproduces the original vanilla modal lifecycle
    (initAppointmentModal / admin modals):

      - the overlay stays mounted and toggles `.active`, so the
        CSS enter/exit transition plays exactly as before
      - opening locks the body (`.modal-open` + overflow hidden)
      - closes on backdrop click (only the overlay itself),
        and on Escape
      - focuses the first field ~150ms after opening

    It renders ONLY the overlay (portaled to <body>); the page
    supplies the inner `.appointment-modal` / `.admin-modal`
    markup as children, so each modal keeps its exact structure.

      variant="doctor" -> .appointment-modal-overlay
      variant="admin"  -> .admin-modal-overlay
*/

const OVERLAY_CLASS = {
    doctor: "appointment-modal-overlay",
    admin: "admin-modal-overlay",
}


export default function Modal({ open, onClose, variant = "doctor", children }) {

    const overlayRef = useRef(null)


    useEffect(() => {

        if (!open) {
            return
        }


        document.body.classList.add("modal-open")

        document.body.style.overflow = "hidden"


        const onKeyDown = (event) => {

            if (event.key === "Escape") {
                onClose()
            }

        }

        document.addEventListener("keydown", onKeyDown)


        const focusTimer = window.setTimeout(() => {

            const field =
                overlayRef.current?.querySelector(
                    "input, select, textarea"
                )

            if (field) {
                field.focus()
            }

        }, 150)


        return () => {

            document.removeEventListener("keydown", onKeyDown)

            document.body.classList.remove("modal-open")

            document.body.style.overflow = ""

            window.clearTimeout(focusTimer)

        }

    }, [open, onClose])


    const overlayClass =
        OVERLAY_CLASS[variant] || OVERLAY_CLASS.doctor


    return createPortal(

        <div
            ref={overlayRef}
            className={overlayClass + (open ? " active" : "")}
            onClick={(event) => {

                if (event.target === event.currentTarget) {
                    onClose()
                }

            }}
        >
            {children}
        </div>,

        document.body
    )

}
