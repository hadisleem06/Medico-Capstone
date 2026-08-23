import { useEffect } from "react"


/*
    Glass card mouse-glow tracking.

    Faithful port of global.js's mousemove handler that
    sets --mouse-x / --mouse-y on ".premium-glass, .ai-card".

    Implemented as a single delegated document listener so
    it keeps working for cards on every route without having
    to attach a handler to each element individually.
*/

export function useGlassGlow() {

    useEffect(() => {

        function onMove(event) {

            const card =
                event.target.closest &&
                event.target.closest(".premium-glass, .ai-card")

            if (!card) {
                return
            }

            const rect = card.getBoundingClientRect()

            card.style.setProperty(
                "--mouse-x",
                `${event.clientX - rect.left}px`
            )

            card.style.setProperty(
                "--mouse-y",
                `${event.clientY - rect.top}px`
            )

        }

        document.addEventListener("mousemove", onMove)

        return () => {
            document.removeEventListener("mousemove", onMove)
        }

    }, [])

}
