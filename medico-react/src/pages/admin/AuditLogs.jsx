import { useState } from "react"

import Topbar from "../../components/layout/Topbar"

import FilterDropdown from "../../components/ui/FilterDropdown"

import { useToast } from "../../context/ToastContext"

import { adminService } from "../../api/adminService"

import {
    auditLogs,
    logActionOptions,
    logDateOptions,
} from "../../data/auditLogs"


/*
    Audit Logs — faithful port of pages/admin/audit-logs.html +
    the log half of assets/js/admin.js.

    Behaviour (ports admin.js):
      - #logSearch + the action / date FilterDropdowns filter the
        list: a row shows when its data-search (lowercased) contains
        the search term AND (action filter is "" OR the row's action
        matches) AND (date filter is "" OR the row's date matches) —
        exactly filterAdminLogs().
      - #logCount shows "<n> Event(s)"; the .admin-empty-state gains
        .visible when nothing matches (kept always-rendered, class
        toggled, mirroring the original DOM).
      - #refreshLogs (page-hero button) spins for 700ms via
        adminService.refreshLogs() then toasts "Audit logs refreshed."
        The original toggled `.loading` on the button while spinning.

    The four stat cards are static plain <h2> numbers (no count-up).
*/

export default function AuditLogs() {

    const { showAdminMessage } = useToast()


    /* ---- search + filter + refresh state ---- */

    const [search, setSearch] = useState("")

    const [actionValue, setActionValue] = useState("")

    const [dateValue, setDateValue] = useState("")

    const [refreshing, setRefreshing] = useState(false)


    /* ---- filter (ports filterAdminLogs) ---- */

    const term = search.trim().toLowerCase()

    const visible = auditLogs.filter(log => {

        const matchesSearch =
            log.search.toLowerCase().includes(term)

        const matchesAction =
            !actionValue ||
            log.action === actionValue

        const matchesDate =
            !dateValue ||
            log.date === dateValue

        return matchesSearch && matchesAction && matchesDate

    })


    const count = visible.length


    /* ---- refresh logs (700ms via adminService) ---- */

    function handleRefresh() {

        setRefreshing(true)

        adminService
            .refreshLogs()
            .then(() => {

                setRefreshing(false)

                showAdminMessage(
                    "Audit logs refreshed.",
                    "success"
                )

            })

    }


    return (
        <>

            <Topbar title="Audit Logs" />


            {/* =================================================
                 PAGE HERO
            ================================================== */}

            <section className="page-hero">

                <div className="page-hero-content">

                    <span className="page-eyebrow">
                        <i className="fa-solid fa-clipboard-list"></i>
                        SYSTEM MONITORING
                    </span>

                    <h1>
                        Track every{" "}
                        <span>action.</span>
                    </h1>

                    <p>
                        Monitor important activity across the
                        Medico platform.
                    </p>


                    <button
                        type="button"
                        className={"primary-btn" + (refreshing ? " loading" : "")}
                        id="refreshLogs"
                        onClick={handleRefresh}
                    >

                        <i className="fa-solid fa-rotate"></i>

                        Refresh Logs

                    </button>

                </div>


                <div className="page-hero-visual">
                    <i className="fa-solid fa-clipboard-list page-hero-glyph"></i>
                </div>

            </section>


            {/* =================================================
                 AUDIT STATISTICS
            ================================================== */}

            <section className="stats-grid admin-log-stats">


                <div className="stat-card premium-glass">

                    <div className="stat-icon admin-users">

                        <i className="fa-solid fa-list-check"></i>

                    </div>

                    <div className="stat-info">

                        <h2>
                            248
                        </h2>

                        <h4>
                            Total Events
                        </h4>

                        <p>
                            Recorded system activity
                        </p>

                    </div>

                </div>


                <div className="stat-card premium-glass">

                    <div className="stat-icon admin-patients">

                        <i className="fa-solid fa-user-plus"></i>

                    </div>

                    <div className="stat-info">

                        <h2>
                            32
                        </h2>

                        <h4>
                            User Actions
                        </h4>

                        <p>
                            Account activity today
                        </p>

                    </div>

                </div>


                <div className="stat-card premium-glass">

                    <div className="stat-icon admin-doctors">

                        <i className="fa-solid fa-shield-halved"></i>

                    </div>

                    <div className="stat-info">

                        <h2>
                            12
                        </h2>

                        <h4>
                            Admin Actions
                        </h4>

                        <p>
                            Administrative events
                        </p>

                    </div>

                </div>


                <div className="stat-card premium-glass">

                    <div className="stat-icon admin-nurses">

                        <i className="fa-solid fa-triangle-exclamation"></i>

                    </div>

                    <div className="stat-info">

                        <h2>
                            3
                        </h2>

                        <h4>
                            Warnings
                        </h4>

                        <p>
                            Events requiring attention
                        </p>

                    </div>

                </div>


            </section>


            {/* =================================================
                 AUDIT LOG CARD
            ================================================== */}

            <section className="health-overview premium-glass admin-logs-card">


                {/* Header */}

                <div className="health-header">

                    <div>

                        <span>
                            SYSTEM ACTIVITY
                        </span>

                        <h2>
                            Recent Events
                        </h2>

                    </div>


                    <span
                        className="admin-log-count"
                        id="logCount"
                    >
                        {count} {count === 1 ? "Event" : "Events"}
                    </span>

                </div>


                {/* =================================================
                     TOOLBAR
                ================================================== */}

                <div className="admin-logs-toolbar">


                    {/* Search */}

                    <div className="search-box">

                        <i className="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="text"
                            id="logSearch"
                            placeholder="Search activity..."
                            autoComplete="off"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                        />

                    </div>


                    {/* Action Filter */}

                    <FilterDropdown
                        id="logActionFilter"
                        options={logActionOptions}
                        value={actionValue}
                        onChange={setActionValue}
                    />


                    {/* Date Filter */}

                    <FilterDropdown
                        id="logDateFilter"
                        options={logDateOptions}
                        value={dateValue}
                        onChange={setDateValue}
                    />


                </div>


                {/* =================================================
                     AUDIT LOG LIST
                ================================================== */}

                <div
                    className="admin-logs-list"
                    id="logsList"
                >

                    {visible.map(log => (

                        <div
                            key={log.title}
                            className="admin-log-row"
                            data-action={log.action}
                            data-date={log.date}
                            data-search={log.search}
                        >

                            <div className={"admin-log-icon " + log.icon}>

                                <i className={"fa-solid " + log.iconName}></i>

                            </div>


                            <div className="admin-log-info">

                                <h3>
                                    {log.title}
                                </h3>

                                <p>
                                    {log.sub}
                                </p>

                            </div>


                            <div className="admin-log-meta">

                                <span className={"admin-log-status " + log.statusClass}>
                                    {log.statusLabel}
                                </span>

                                <span>
                                    {log.time}
                                </span>

                            </div>

                        </div>

                    ))}


                    {/* Empty State */}

                    <div
                        className={"admin-empty-state" + (count === 0 ? " visible" : "")}
                        id="emptyLogs"
                    >

                        <i className="fa-solid fa-clock-rotate-left"></i>

                        <h3>
                            No activity found
                        </h3>

                        <p>
                            Try changing your search or filters.
                        </p>

                    </div>

                </div>

            </section>

        </>
    )

}
