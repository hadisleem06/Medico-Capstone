import { useEffect } from "react"


/*
    Calls `handler` when a click (or touch) lands
    outside the element referenced by `ref`.

    Mirrors the document-level "click outside closes"
    behaviour used by the profile dropdown and the
    filter menus in the original global.js / admin.js.
*/

export function useClickOutside(ref, handler, active = true) {

    useEffect(() => {

        if (!active) {
            return
        }

        function onClick(event) {

            if (
                ref.current &&
                !ref.current.contains(event.target)
            ) {
                handler(event)
            }

        }

        document.addEventListener("click", onClick)

        return () => {
            document.removeEventListener("click", onClick)
        }

    }, [ref, handler, active])

}
