import { useCallback, useState } from "react"


/*
    Sidebar collapse state.

    Replaces global.js's sidebar-toggle handler:
    the ".collapsed" class is applied to both the
    sidebar and the main-content by AppLayout.
*/

export function useSidebarCollapse() {

    const [collapsed, setCollapsed] = useState(false)

    const toggle = useCallback(() => {
        setCollapsed(value => !value)
    }, [])

    return {
        collapsed,
        toggle,
    }

}
