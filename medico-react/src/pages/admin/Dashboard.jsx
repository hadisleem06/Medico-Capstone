import { useNavigate } from "react-router-dom"

import Topbar from "../../components/layout/Topbar"

import Counter from "../../components/ui/Counter"


/*
    Admin Dashboard — faithful port of pages/admin/dashboard.html.

    The page is static: the hero button and the "Manage Users" /
    "View All" / "View Audit Logs" buttons routed via admin.js's
    data-admin-action dispatch, reproduced here with useNavigate.

    The four stat cards keep their `.admin-counter` count-up (the
    original animated them from 0 via global.js), so they render
    through <Counter>. Everything else is fixed markup.

    dashboard.html referenced no #adminCurrentDate, so admin.js's
    date-stamp init was a dead no-op and is omitted.
*/

export default function Dashboard() {

    const navigate = useNavigate()


    return (
        <>

            <Topbar title="Dashboard" />


            {/* =================================================
                 PAGE HERO
            ================================================== */}

            <section className="page-hero">


                <div className="page-hero-content">


                    <span className="page-eyebrow">
                        <i className="fa-solid fa-shield-halved"></i>
                        ADMIN WORKSPACE
                    </span>


                    <h1>
                        Good morning,{" "}
                        <span>Hadi.</span>
                    </h1>


                    <p>
                        Monitor the Medico platform, manage users,
                        review system activity and keep the healthcare
                        environment running smoothly.
                    </p>


                    <button
                        className="primary-btn"
                        onClick={() => navigate("/admin/users")}
                    >

                        Manage Users

                        <i className="fa-solid fa-arrow-right"></i>

                    </button>


                </div>


                <div className="page-hero-visual">
                    <i className="fa-solid fa-shield-halved page-hero-glyph"></i>
                </div>


            </section>


            {/* =================================================
                 ADMIN STATISTICS
            ================================================== */}

            <section className="stats-grid admin-stats">


                {/* Total Users */}

                <div className="stat-card premium-glass">


                    <div className="stat-icon admin-users">

                        <i className="fa-solid fa-users"></i>

                    </div>


                    <div className="stat-info">

                        <Counter
                            as="h2"
                            className="admin-counter"
                            target={156}
                        />

                        <h4>
                            Total Users
                        </h4>

                        <p>
                            Registered Accounts
                        </p>

                    </div>


                    <span className="badge positive">
                        +12
                    </span>


                </div>


                {/* Patients */}

                <div className="stat-card premium-glass">


                    <div className="stat-icon admin-patients">

                        <i className="fa-solid fa-user-injured"></i>

                    </div>


                    <div className="stat-info">

                        <Counter
                            as="h2"
                            className="admin-counter"
                            target={112}
                        />

                        <h4>
                            Patients
                        </h4>

                        <p>
                            Registered Patients
                        </p>

                    </div>


                    <span className="badge">
                        Active
                    </span>


                </div>


                {/* Doctors */}

                <div className="stat-card premium-glass">


                    <div className="stat-icon admin-doctors">

                        <i className="fa-solid fa-user-doctor"></i>

                    </div>


                    <div className="stat-info">

                        <Counter
                            as="h2"
                            className="admin-counter"
                            target={28}
                        />

                        <h4>
                            Doctors
                        </h4>

                        <p>
                            Medical Staff
                        </p>

                    </div>


                    <span className="badge positive">
                        +3
                    </span>


                </div>


                {/* Nurses */}

                <div className="stat-card premium-glass">


                    <div className="stat-icon admin-nurses">

                        <i className="fa-solid fa-user-nurse"></i>

                    </div>


                    <div className="stat-info">

                        <Counter
                            as="h2"
                            className="admin-counter"
                            target={16}
                        />

                        <h4>
                            Nurses
                        </h4>

                        <p>
                            Nursing Staff
                        </p>

                    </div>


                    <span className="badge positive">
                        +2
                    </span>


                </div>


            </section>


            {/* =================================================
                 WORKSPACE GRID
            ================================================== */}

            <section className="dashboard-grid admin-dashboard-grid">


                {/* =================================================
                     USER OVERVIEW
                ================================================== */}

                <div className="appointment-card premium-glass">


                    <div className="widget-header">


                        <div>

                            <span>
                                USER OVERVIEW
                            </span>

                            <h2>
                                Platform Users
                            </h2>

                        </div>


                        <div className="doctor-icon">

                            <i className="fa-solid fa-chart-pie"></i>

                        </div>


                    </div>


                    <div className="admin-user-overview">


                        {/* Patients */}

                        <div className="admin-overview-row">


                            <div className="admin-overview-info">

                                <div className="admin-overview-icon patients">

                                    <i className="fa-solid fa-user-injured"></i>

                                </div>


                                <div>

                                    <strong>
                                        Patients
                                    </strong>

                                    <p>
                                        112 registered
                                    </p>

                                </div>

                            </div>


                            <div className="admin-overview-value">

                                <strong>
                                    72%
                                </strong>

                                <div className="admin-progress">

                                    <span
                                        style={{ width: "72%" }}
                                    ></span>

                                </div>

                            </div>


                        </div>


                        {/* Doctors */}

                        <div className="admin-overview-row">


                            <div className="admin-overview-info">

                                <div className="admin-overview-icon doctors">

                                    <i className="fa-solid fa-user-doctor"></i>

                                </div>


                                <div>

                                    <strong>
                                        Doctors
                                    </strong>

                                    <p>
                                        28 registered
                                    </p>

                                </div>

                            </div>


                            <div className="admin-overview-value">

                                <strong>
                                    18%
                                </strong>

                                <div className="admin-progress">

                                    <span
                                        style={{ width: "18%" }}
                                    ></span>

                                </div>

                            </div>


                        </div>


                        {/* Nurses */}

                        <div className="admin-overview-row">


                            <div className="admin-overview-info">

                                <div className="admin-overview-icon nurses">

                                    <i className="fa-solid fa-user-nurse"></i>

                                </div>


                                <div>

                                    <strong>
                                        Nurses
                                    </strong>

                                    <p>
                                        16 registered
                                    </p>

                                </div>

                            </div>


                            <div className="admin-overview-value">

                                <strong>
                                    10%
                                </strong>

                                <div className="admin-progress">

                                    <span
                                        style={{ width: "10%" }}
                                    ></span>

                                </div>

                            </div>


                        </div>


                    </div>


                    <button
                        className="primary-btn"
                        onClick={() => navigate("/admin/users")}
                    >

                        Manage Users

                        <i className="fa-solid fa-arrow-right"></i>

                    </button>


                </div>


                {/* =================================================
                     SYSTEM ACTIVITY
                ================================================== */}

                <div className="ai-card admin-activity-card">


                    <div className="ai-top">


                        <div className="ai-icon">

                            <i className="fa-solid fa-shield-halved"></i>

                        </div>


                        <span>
                            SYSTEM MONITORING
                        </span>


                    </div>


                    <h2>
                        Recent Activity
                    </h2>


                    <p>
                        Monitor the latest activity across
                        the Medico platform.
                    </p>


                    <div className="admin-activity-list">


                        {/* Activity 1 */}

                        <div className="admin-activity-item">


                            <div className="admin-activity-icon user">

                                <i className="fa-solid fa-user-plus"></i>

                            </div>


                            <div>

                                <strong>
                                    New patient registered
                                </strong>

                                <p>
                                    5 minutes ago
                                </p>

                            </div>


                        </div>


                        {/* Activity 2 */}

                        <div className="admin-activity-item">


                            <div className="admin-activity-icon doctor">

                                <i className="fa-solid fa-user-doctor"></i>

                            </div>


                            <div>

                                <strong>
                                    Doctor account created
                                </strong>

                                <p>
                                    24 minutes ago
                                </p>

                            </div>


                        </div>


                        {/* Activity 3 */}

                        <div className="admin-activity-item">


                            <div className="admin-activity-icon security">

                                <i className="fa-solid fa-shield-halved"></i>

                            </div>


                            <div>

                                <strong>
                                    Security settings updated
                                </strong>

                                <p>
                                    1 hour ago
                                </p>

                            </div>


                        </div>


                        {/* Activity 4 */}

                        <div className="admin-activity-item">


                            <div className="admin-activity-icon nurse">

                                <i className="fa-solid fa-user-nurse"></i>

                            </div>


                            <div>

                                <strong>
                                    Nurse account activated
                                </strong>

                                <p>
                                    2 hours ago
                                </p>

                            </div>


                        </div>


                    </div>


                    <button
                        className="admin-text-btn"
                        onClick={() => navigate("/admin/audit-logs")}
                    >

                        View Audit Logs

                        <i className="fa-solid fa-arrow-right"></i>

                    </button>


                </div>


            </section>


            {/* =================================================
                 RECENT USERS
            ================================================== */}

            <section className="health-overview premium-glass admin-users-section">


                <div className="health-header">


                    <div>

                        <span>
                            USER MANAGEMENT
                        </span>

                        <h2>
                            Recent Users
                        </h2>

                    </div>


                    <button
                        className="primary-btn"
                        onClick={() => navigate("/admin/users")}
                    >

                        View All

                        <i className="fa-solid fa-arrow-right"></i>

                    </button>


                </div>


                <div className="admin-user-list">


                    {/* User 1 */}

                    <div className="admin-user-row">


                        <div className="admin-user-info">


                            <div className="admin-user-avatar">
                                AM
                            </div>


                            <div>

                                <h3>
                                    Ahmad Mansour
                                </h3>

                                <p>
                                    PT-1024 · Patient
                                </p>

                            </div>


                        </div>


                        <div className="admin-user-role patient">

                            <i className="fa-solid fa-user"></i>

                            Patient

                        </div>


                        <div className="admin-user-status active">

                            <i className="fa-solid fa-circle"></i>

                            Active

                        </div>


                        <div className="admin-user-time">

                            Today

                        </div>


                    </div>


                    {/* User 2 */}

                    <div className="admin-user-row">


                        <div className="admin-user-info">


                            <div className="admin-user-avatar doctor">
                                LN
                            </div>


                            <div>

                                <h3>
                                    Dr. Lina Nassar
                                </h3>

                                <p>
                                    DOC-204 · Doctor
                                </p>

                            </div>


                        </div>


                        <div className="admin-user-role doctor">

                            <i className="fa-solid fa-user-doctor"></i>

                            Doctor

                        </div>


                        <div className="admin-user-status active">

                            <i className="fa-solid fa-circle"></i>

                            Active

                        </div>


                        <div className="admin-user-time">

                            Today

                        </div>


                    </div>


                    {/* User 3 */}

                    <div className="admin-user-row">


                        <div className="admin-user-info">


                            <div className="admin-user-avatar nurse">
                                SN
                            </div>


                            <div>

                                <h3>
                                    Sarah Nehme
                                </h3>

                                <p>
                                    NUR-118 · Nurse
                                </p>

                            </div>


                        </div>


                        <div className="admin-user-role nurse">

                            <i className="fa-solid fa-user-nurse"></i>

                            Nurse

                        </div>


                        <div className="admin-user-status active">

                            <i className="fa-solid fa-circle"></i>

                            Active

                        </div>


                        <div className="admin-user-time">

                            Yesterday

                        </div>


                    </div>


                </div>


            </section>

        </>
    )

}
