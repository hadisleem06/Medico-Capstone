import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"

import { createPortal } from "react-dom"


/*
    Toasts / messages.

    Unifies the three original toast systems into one
    provider while keeping each skin's EXACT markup, class
    names, timings and lifecycle so styling is identical:

      - doctor : showDoctorToast(title, message, icon)
                 .appointment-success-toast (single instance,
                 4500ms, .show enter class)   [doctor.css]
      - nurse  : showNurseMessage(message, type)
                 .nurse-message in .nurse-message-container
                 (3000ms, .show enter class)  [nurse.css]
      - admin  : showAdminMessage(message, type)
                 .admin-message in .admin-message-container
                 (3500ms, CSS-animated in, .hide on exit)
                 [styles moved to app-extras.css]

    Page code calls the same-named method it used before,
    so ports are a 1:1 swap of `showXToast(...)` for
    `const { showXToast } = useToast()`.
*/

const ToastContext = createContext(null)


/* per-variant lifecycle timings (ms) */

const AUTO_DISMISS = {
    doctor: 4500,
    nurse: 3000,
    admin: 3500,
}

const EXIT_DELAY = {
    doctor: 300,
    nurse: 300,
    admin: 250,
}


function adminIcon(type) {

    if (type === "error") {
        return "fa-circle-exclamation"
    }

    if (type === "warning") {
        return "fa-triangle-exclamation"
    }

    if (type === "info") {
        return "fa-circle-info"
    }

    return "fa-circle-check"
}


function ToastItem({ toast, onRemove }) {

    /* mounting -> shown -> leaving */
    const [phase, setPhase] = useState("mounting")

    const variant = toast.variant


    /* enter: flip to shown on the next frame so the
       .show transition (doctor / nurse) plays */

    useEffect(() => {

        const raf = requestAnimationFrame(() => {
            setPhase("shown")
        })

        return () => cancelAnimationFrame(raf)

    }, [])


    const dismiss = useCallback(() => {

        setPhase("leaving")

        window.setTimeout(
            () => onRemove(toast.id),
            EXIT_DELAY[variant]
        )

    }, [onRemove, toast.id, variant])


    /* auto dismiss */

    useEffect(() => {

        const timer = window.setTimeout(
            dismiss,
            AUTO_DISMISS[variant]
        )

        return () => window.clearTimeout(timer)

    }, [dismiss, variant])


    if (variant === "doctor") {

        const shown =
            phase === "shown" ? " show" : ""

        return (
            <div className={"appointment-success-toast" + shown}>

                <div className="success-icon">
                    <i className={"fa-solid " + (toast.icon || "fa-check")}></i>
                </div>

                <div className="success-content">
                    <strong>{toast.title}</strong>
                    <span>{toast.message}</span>
                </div>

                <button
                    type="button"
                    className="success-close"
                    onClick={dismiss}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

            </div>
        )

    }


    if (variant === "nurse") {

        const shown =
            phase === "shown" ? " show" : ""

        const icon =
            toast.type === "success"
                ? "fa-circle-check"
                : "fa-circle-exclamation"

        return (
            <div className={"nurse-message " + toast.type + shown}>
                <i className={"fa-solid " + icon}></i>
                <span>{toast.message}</span>
            </div>
        )

    }


    /* admin */

    const hide =
        phase === "leaving" ? " hide" : ""

    return (
        <div className={"admin-message " + toast.type + hide}>
            <i className={"fa-solid " + adminIcon(toast.type)}></i>
            <span>{toast.message}</span>
            <button
                type="button"
                className="admin-message-close"
                onClick={dismiss}
            >
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    )

}


export function ToastProvider({ children }) {

    const [toasts, setToasts] = useState([])

    const idRef = useRef(0)


    const nextId = () => {
        idRef.current += 1
        return idRef.current
    }


    const remove = useCallback((id) => {
        setToasts(list => list.filter(t => t.id !== id))
    }, [])


    /* doctor toast is single-instance: adding one clears
       any existing doctor toast (matches doctor.js) */

    const showDoctorToast = useCallback((title, message, icon) => {
        setToasts(list => [
            ...list.filter(t => t.variant !== "doctor"),
            { id: nextId(), variant: "doctor", title, message, icon },
        ])
    }, [])


    const showNurseMessage = useCallback((message, type = "success") => {
        setToasts(list => [
            ...list,
            { id: nextId(), variant: "nurse", message, type },
        ])
    }, [])


    const showAdminMessage = useCallback((message, type = "success") => {
        setToasts(list => [
            ...list,
            { id: nextId(), variant: "admin", message, type },
        ])
    }, [])


    const value = {
        showDoctorToast,
        showNurseMessage,
        showAdminMessage,
    }


    const doctorToasts = toasts.filter(t => t.variant === "doctor")
    const nurseToasts = toasts.filter(t => t.variant === "nurse")
    const adminToasts = toasts.filter(t => t.variant === "admin")


    const overlay = (
        <>
            {doctorToasts.map(toast => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onRemove={remove}
                />
            ))}

            {nurseToasts.length > 0 && (
                <div className="nurse-message-container">
                    {nurseToasts.map(toast => (
                        <ToastItem
                            key={toast.id}
                            toast={toast}
                            onRemove={remove}
                        />
                    ))}
                </div>
            )}

            {adminToasts.length > 0 && (
                <div className="admin-message-container">
                    {adminToasts.map(toast => (
                        <ToastItem
                            key={toast.id}
                            toast={toast}
                            onRemove={remove}
                        />
                    ))}
                </div>
            )}
        </>
    )


    return (
        <ToastContext.Provider value={value}>
            {children}
            {createPortal(overlay, document.body)}
        </ToastContext.Provider>
    )

}


export function useToast() {

    const ctx = useContext(ToastContext)

    if (!ctx) {
        throw new Error("useToast must be used within a ToastProvider")
    }

    return ctx

}
