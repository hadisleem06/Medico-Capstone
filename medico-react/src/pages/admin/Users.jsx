import { useRef, useState } from "react"

import Topbar from "../../components/layout/Topbar"

import FilterDropdown from "../../components/ui/FilterDropdown"

import Modal from "../../components/ui/Modal"

import { useToast } from "../../context/ToastContext"

import { adminService } from "../../api/adminService"

import { adminSeedUsers } from "../../data/users"


/*
    Admin Users — faithful port of pages/admin/users.html + the user
    half of assets/js/admin.js (the biggest admin file: CRUD over the
    user list plus three modals).

    Behaviour (ports admin.js):
      - The list seeds from adminSeedUsers (the 6 accounts the original
        table listed). #userSearch + the role / status FilterDropdowns
        filter it: a row shows when its NAME (lowercased) contains the
        search term AND (role filter is "" OR the row's role matches)
        AND (status filter is "" OR the row's status matches) — exactly
        filterAdminUsers(). #userCount shows "<n> User(s)"; the
        .admin-empty-state gains .visible when nothing matches (kept
        always-rendered, class toggled, mirroring the original DOM).
      - #refreshUsers spins for 700ms via adminService.refreshUsers()
        then toasts "User list refreshed." (the original toggled
        `.loading` on the button while spinning).
      - The hero "Add User" button opens the form modal in add mode;
        each row's actions open view / edit / status-confirm.
      - Add: prepend a new row (generated userId, initials, today's
        date, "Just now") + toast "User created successfully.".
        Edit: keep userId / joined / activity, recompute initials +
        toast "User updated successfully.". Both close on success.
      - Activate / deactivate route through the confirmation modal;
        on confirm the status flips and a toast fires —
        "<name> has been activated." (success) /
        "<name> has been deactivated." (warning).

    The four stat cards are static plain <h2> numbers (no count-up),
    matching users.html.

    The add / edit action fires its toast synchronously, so — per the
    project's backend-seam rule — it stays in-component; only the async
    refresh goes through adminService.
*/


/* =========================================================
   HELPERS (port admin.js)
========================================================= */

function capitalize(value) {

    if (!value) {
        return ""
    }

    return value.charAt(0).toUpperCase() + value.slice(1)

}


function getInitials(name) {

    if (!name) {
        return "U"
    }

    const parts =
        name.trim().split(/\s+/)

    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase()

    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase()

}


function getRoleIcon(role) {

    const icons = {
        patient: "fa-user",
        doctor: "fa-user-doctor",
        nurse: "fa-user-nurse",
        admin: "fa-shield-halved",
    }

    return icons[role] || "fa-user"

}


function generateUserId(role) {

    const prefix = {
        patient: "PT",
        doctor: "DOC",
        nurse: "NUR",
        admin: "ADM",
    }

    const number =
        Math.floor(1000 + Math.random() * 8999)

    return (prefix[role] || "USR") + "-" + number

}


function formatToday() {

    return new Date().toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }
    )

}


/* avatar carries a role class only for doctor / nurse — the only two
   the CSS styles; patient / admin stay bare, matching the seed rows */

function avatarClass(role) {

    return (
        "admin-management-avatar" +
        (role === "doctor" || role === "nurse" ? " " + role : "")
    )

}


/* =========================================================
   FILTER OPTIONS
========================================================= */

const roleFilterOptions = [
    { value: "", label: "All Roles" },
    { value: "patient", label: "Patients" },
    { value: "doctor", label: "Doctors" },
    { value: "nurse", label: "Nurses" },
    { value: "admin", label: "Administrators" },
]


const statusFilterOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
]


/* the modal role dropdown carries icons (the original menu did) */

const roleModalOptions = [
    { value: "", label: "Select role..." },
    { value: "patient", label: "Patient", icon: "fa-user" },
    { value: "doctor", label: "Doctor", icon: "fa-user-doctor" },
    { value: "nurse", label: "Nurse", icon: "fa-user-nurse" },
    { value: "admin", label: "Admin", icon: "fa-shield-halved" },
]


/* the modal status dropdown lists only Active / Inactive — a pending
   account being edited shows "Pending" via the dropdown's fallback */

const statusModalOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
]


export default function Users() {

    const { showAdminMessage } = useToast()


    /* ---- user list (seeded from the 6 table accounts) ---- */

    const [userList, setUserList] = useState(
        () => adminSeedUsers.map(user => ({ ...user }))
    )


    /* ---- search + filter + refresh state ---- */

    const [search, setSearch] = useState("")

    const [roleValue, setRoleValue] = useState("")

    const [statusValue, setStatusValue] = useState("")

    const [refreshing, setRefreshing] = useState(false)


    /* ---- form modal state ---- */

    const [formOpen, setFormOpen] = useState(false)

    const [formMode, setFormMode] = useState("add")

    const [editingId, setEditingId] = useState(null)

    const [fullName, setFullName] = useState("")

    const [emailValue, setEmailValue] = useState("")

    const [phone, setPhone] = useState("")

    const [formRole, setFormRole] = useState("")

    const [formStatus, setFormStatus] = useState("active")

    const [password, setPassword] = useState("")

    const [confirmPassword, setConfirmPassword] = useState("")

    const [errors, setErrors] = useState({})


    /* ---- view modal state ---- */

    const [viewOpen, setViewOpen] = useState(false)

    const [viewUser, setViewUser] = useState(null)


    /* ---- status-confirm modal state ---- */

    const [confirmOpen, setConfirmOpen] = useState(false)

    const [pendingChange, setPendingChange] = useState(null)


    /* ---- id source for freshly created rows ---- */

    const nextId = useRef(0)


    /* ---- filter (ports filterAdminUsers — NAME only) ---- */

    const term = search.trim().toLowerCase()

    const visible = userList.filter(user => {

        const matchesSearch =
            user.name.toLowerCase().includes(term)

        const matchesRole =
            !roleValue ||
            user.role === roleValue

        const matchesStatus =
            !statusValue ||
            user.status === statusValue

        return matchesSearch && matchesRole && matchesStatus

    })


    const count = visible.length


    /* =====================================================
       REFRESH (700ms via adminService)
    ===================================================== */

    function handleRefresh() {

        setRefreshing(true)

        adminService
            .refreshUsers()
            .then(() => {

                setRefreshing(false)

                showAdminMessage(
                    "User list refreshed.",
                    "success"
                )

            })

    }


    /* =====================================================
       OPEN MODALS
    ===================================================== */

    function openAdd() {

        setFormMode("add")

        setEditingId(null)

        setFullName("")

        setEmailValue("")

        setPhone("")

        setFormRole("")

        setFormStatus("active")

        setPassword("")

        setConfirmPassword("")

        setErrors({})

        setFormOpen(true)

    }


    function openEdit(user) {

        setFormMode("edit")

        setEditingId(user.id)

        setFullName(user.name)

        setEmailValue(user.email)

        setPhone(user.phone || "")

        setFormRole(user.role)

        setFormStatus(user.status)

        setPassword("")

        setConfirmPassword("")

        setErrors({})

        setFormOpen(true)

    }


    function openView(user) {

        setViewUser(user)

        setViewOpen(true)

    }


    function openStatusConfirm(user, newStatus) {

        setPendingChange({ user, status: newStatus })

        setConfirmOpen(true)

    }


    function handleViewEdit() {

        if (!viewUser) {
            return
        }

        setViewOpen(false)

        openEdit(viewUser)

    }


    /* =====================================================
       SUBMIT (ports validateAdminUserForm + create / update)
    ===================================================== */

    function handleSubmit(event) {

        event.preventDefault()


        const nextErrors = {}


        if (!fullName.trim()) {

            nextErrors.fullName =
                "Full name is required."

        }


        if (!emailValue.trim()) {

            nextErrors.email =
                "Email address is required."

        }
        else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(emailValue.trim())
        ) {

            nextErrors.email =
                "Enter a valid email address."

        }


        if (!phone.trim()) {

            nextErrors.phone =
                "Phone number is required."

        }


        if (!formRole) {

            nextErrors.role =
                "Please select a role."

        }


        if (formMode === "add") {

            if (password.length < 8) {

                nextErrors.password =
                    "Password must contain at least 8 characters."

            }


            if (password !== confirmPassword) {

                nextErrors.confirmPassword =
                    "Passwords do not match."

            }

        }


        setErrors(nextErrors)


        if (Object.keys(nextErrors).length > 0) {
            return
        }


        const name = fullName.trim()

        const role = formRole

        const status = formStatus || "active"


        if (formMode === "edit") {

            setUserList(list =>
                list.map(user =>
                    user.id === editingId
                        ? {
                            ...user,
                            name: name,
                            initials: getInitials(name),
                            email: emailValue.trim(),
                            phone: phone.trim(),
                            role: role,
                            status: status,
                        }
                        : user
                )
            )

            showAdminMessage(
                "User updated successfully.",
                "success"
            )

        }
        else {

            const id =
                "u-new-" + nextId.current

            nextId.current += 1


            const newUser = {
                id: id,
                userId: generateUserId(role),
                name: name,
                initials: getInitials(name),
                email: emailValue.trim(),
                phone: phone.trim(),
                role: role,
                status: status,
                joined: formatToday(),
                activity: "Just now",
            }


            setUserList(list => [newUser, ...list])

            showAdminMessage(
                "User created successfully.",
                "success"
            )

        }


        setFormOpen(false)

    }


    /* =====================================================
       CONFIRM STATUS CHANGE
    ===================================================== */

    function handleConfirmStatus() {

        if (!pendingChange) {
            return
        }


        const user = pendingChange.user

        const status = pendingChange.status


        setUserList(list =>
            list.map(current =>
                current.id === user.id
                    ? { ...current, status: status }
                    : current
            )
        )


        setConfirmOpen(false)


        showAdminMessage(
            status === "active"
                ? `${user.name} has been activated.`
                : `${user.name} has been deactivated.`,
            status === "active"
                ? "success"
                : "warning"
        )

    }


    /* =====================================================
       DERIVED: status-confirm modal copy
    ===================================================== */

    const pendingUser =
        pendingChange ? pendingChange.user : null

    const pendingStatus =
        pendingChange ? pendingChange.status : "inactive"

    const deactivating =
        pendingStatus !== "active"

    const statusIconClass =
        deactivating
            ? "fa-solid fa-user-slash"
            : "fa-solid fa-user-check"


    return (
        <>

            <Topbar title="Users" />


            {/* =================================================
                 PAGE HERO
            ================================================== */}

            <section className="page-hero">


                <div className="page-hero-content">

                    <span className="page-eyebrow">
                        <i className="fa-solid fa-users-gear"></i>
                        USER MANAGEMENT
                    </span>

                    <h1>
                        Manage every{" "}
                        <span>account.</span>
                    </h1>

                    <p>
                        View, search and manage all registered
                        Medico users across the platform.
                    </p>


                    <button
                        type="button"
                        className="primary-btn"
                        onClick={openAdd}
                    >

                        <i className="fa-solid fa-user-plus"></i>

                        Add User

                    </button>

                </div>


                <div className="page-hero-visual">
                    <i className="fa-solid fa-users-gear page-hero-glyph"></i>
                </div>


            </section>


            {/* =================================================
                 USER STATISTICS
            ================================================== */}

            <section className="stats-grid admin-user-stats">


                {/* Total */}

                <div className="stat-card premium-glass">

                    <div className="stat-icon admin-users">

                        <i className="fa-solid fa-users"></i>

                    </div>


                    <div className="stat-info">

                        <h2>
                            156
                        </h2>

                        <h4>
                            Total Users
                        </h4>

                        <p>
                            All registered accounts
                        </p>

                    </div>

                </div>


                {/* Patients */}

                <div className="stat-card premium-glass">

                    <div className="stat-icon admin-patients">

                        <i className="fa-solid fa-user-injured"></i>

                    </div>


                    <div className="stat-info">

                        <h2>
                            112
                        </h2>

                        <h4>
                            Patients
                        </h4>

                        <p>
                            Registered patients
                        </p>

                    </div>

                </div>


                {/* Doctors */}

                <div className="stat-card premium-glass">

                    <div className="stat-icon admin-doctors">

                        <i className="fa-solid fa-user-doctor"></i>

                    </div>


                    <div className="stat-info">

                        <h2>
                            28
                        </h2>

                        <h4>
                            Doctors
                        </h4>

                        <p>
                            Medical staff
                        </p>

                    </div>

                </div>


                {/* Nurses */}

                <div className="stat-card premium-glass">

                    <div className="stat-icon admin-nurses">

                        <i className="fa-solid fa-user-nurse"></i>

                    </div>


                    <div className="stat-info">

                        <h2>
                            16
                        </h2>

                        <h4>
                            Nurses
                        </h4>

                        <p>
                            Nursing staff
                        </p>

                    </div>

                </div>


            </section>


            {/* =================================================
                 USERS CARD
            ================================================== */}

            <section className="health-overview premium-glass admin-users-card">


                {/* Header */}

                <div className="health-header">


                    <div>

                        <span>
                            REGISTERED USERS
                        </span>

                        <h2>
                            User List
                        </h2>

                    </div>


                    <span
                        className="admin-user-count"
                        id="userCount"
                    >
                        {count} {count === 1 ? "User" : "Users"}
                    </span>


                </div>


                {/* =================================================
                     TOOLBAR
                ================================================== */}

                <div className="admin-users-toolbar">


                    {/* Search */}

                    <div className="search-box">

                        <i className="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="text"
                            id="userSearch"
                            placeholder="Search users..."
                            autoComplete="off"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                        />

                    </div>


                    {/* Role Filter */}

                    <FilterDropdown
                        id="roleFilter"
                        options={roleFilterOptions}
                        value={roleValue}
                        onChange={setRoleValue}
                    />


                    {/* Status Filter */}

                    <FilterDropdown
                        id="statusFilter"
                        options={statusFilterOptions}
                        value={statusValue}
                        onChange={setStatusValue}
                    />


                    {/* Refresh */}

                    <button
                        type="button"
                        className={"refresh-btn" + (refreshing ? " loading" : "")}
                        id="refreshUsers"
                        aria-label="Refresh users"
                        onClick={handleRefresh}
                    >

                        <i className="fa-solid fa-rotate"></i>

                    </button>


                </div>


                {/* =================================================
                     USER LIST
                ================================================== */}

                <div
                    className="admin-users-list"
                    id="usersList"
                >

                    {visible.map(user => (

                        <div
                            key={user.id}
                            className="admin-management-row"
                            data-user-id={user.userId}
                            data-role={user.role}
                            data-status={user.status}
                            data-name={user.name}
                            data-email={user.email}
                            data-phone={user.phone}
                            data-joined={user.joined}
                            data-activity={user.activity}
                        >


                            <div className="admin-management-user">


                                <div className={avatarClass(user.role)}>
                                    {user.initials}
                                </div>


                                <div>

                                    <h3>
                                        {user.name}
                                    </h3>

                                    <p>
                                        {user.userId}
                                    </p>

                                </div>


                            </div>


                            <div className={"admin-role-badge " + user.role}>

                                <i className={"fa-solid " + getRoleIcon(user.role)}></i>

                                {capitalize(user.role)}

                            </div>


                            <div className={"admin-status-badge " + user.status}>

                                <i className="fa-solid fa-circle"></i>

                                {capitalize(user.status)}

                            </div>


                            <div className="admin-management-actions">


                                <button
                                    type="button"
                                    className="admin-icon-btn"
                                    title="View user"
                                    aria-label={"View " + user.name}
                                    onClick={() => openView(user)}
                                >

                                    <i className="fa-solid fa-eye"></i>

                                </button>


                                <button
                                    type="button"
                                    className="admin-icon-btn"
                                    title="Edit user"
                                    aria-label={"Edit " + user.name}
                                    onClick={() => openEdit(user)}
                                >

                                    <i className="fa-solid fa-pen"></i>

                                </button>


                                {user.status === "active" ? (

                                    <button
                                        type="button"
                                        className="admin-icon-btn danger"
                                        title="Deactivate user"
                                        aria-label={"Deactivate " + user.name}
                                        onClick={() => openStatusConfirm(user, "inactive")}
                                    >

                                        <i className="fa-solid fa-user-slash"></i>

                                    </button>

                                ) : (

                                    <button
                                        type="button"
                                        className="admin-icon-btn success"
                                        title="Activate user"
                                        aria-label={"Activate " + user.name}
                                        onClick={() => openStatusConfirm(user, "active")}
                                    >

                                        <i className="fa-solid fa-user-check"></i>

                                    </button>

                                )}


                            </div>


                        </div>

                    ))}


                    {/* Empty State */}

                    <div
                        className={"admin-empty-state" + (count === 0 ? " visible" : "")}
                        id="emptyUsers"
                    >

                        <i className="fa-solid fa-users-slash"></i>

                        <h3>
                            No users found
                        </h3>

                        <p>
                            Try changing your search or filters.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                 ADD / EDIT USER MODAL
            ================================================== */}

            <Modal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                variant="admin"
            >

                <div
                    className="admin-modal user-form-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="userFormModalTitle"
                >


                    {/* Modal Header */}

                    <div className="admin-modal-header">


                        <div>

                            <span>
                                USER MANAGEMENT
                            </span>

                            <h2 id="userFormModalTitle">
                                {formMode === "edit" ? "Edit User" : "Add New User"}
                            </h2>

                        </div>


                        <button
                            type="button"
                            className="admin-modal-close"
                            aria-label="Close modal"
                            onClick={() => setFormOpen(false)}
                        >

                            <i className="fa-solid fa-xmark"></i>

                        </button>


                    </div>


                    {/* Modal Body */}

                    <form
                        className="admin-modal-form"
                        onSubmit={handleSubmit}
                    >


                        {/* Full Name */}

                        <div className="admin-form-group">

                            <label htmlFor="userFullName">
                                Full Name
                            </label>


                            <div className="admin-input-wrapper">

                                <i className="fa-solid fa-user"></i>

                                <input
                                    type="text"
                                    id="userFullName"
                                    placeholder="Enter full name"
                                    autoComplete="off"
                                    value={fullName}
                                    onChange={event => setFullName(event.target.value)}
                                />

                            </div>


                            <small className="admin-field-error">
                                {errors.fullName}
                            </small>

                        </div>


                        {/* Email */}

                        <div className="admin-form-group">

                            <label htmlFor="userEmail">
                                Email Address
                            </label>


                            <div className="admin-input-wrapper">

                                <i className="fa-solid fa-envelope"></i>

                                <input
                                    type="email"
                                    id="userEmail"
                                    placeholder="Enter email address"
                                    autoComplete="off"
                                    value={emailValue}
                                    onChange={event => setEmailValue(event.target.value)}
                                />

                            </div>


                            <small className="admin-field-error">
                                {errors.email}
                            </small>

                        </div>


                        {/* Phone */}

                        <div className="admin-form-group">

                            <label htmlFor="userPhone">
                                Phone Number
                            </label>


                            <div className="admin-input-wrapper">

                                <i className="fa-solid fa-phone"></i>

                                <input
                                    type="tel"
                                    id="userPhone"
                                    placeholder="Enter phone number"
                                    autoComplete="off"
                                    value={phone}
                                    onChange={event => setPhone(event.target.value)}
                                />

                            </div>


                            <small className="admin-field-error">
                                {errors.phone}
                            </small>

                        </div>


                        {/* Role */}

                        <div className="admin-form-group">

                            <label>
                                Role
                            </label>


                            <FilterDropdown
                                id="userRoleDropdown"
                                className="admin-modal-dropdown"
                                options={roleModalOptions}
                                value={formRole}
                                onChange={setFormRole}
                            />


                            <small className="admin-field-error">
                                {errors.role}
                            </small>


                        </div>


                        {/* Status */}

                        <div className="admin-form-group">

                            <label>
                                Account Status
                            </label>


                            <FilterDropdown
                                id="userStatusDropdown"
                                className="admin-modal-dropdown"
                                options={statusModalOptions}
                                value={formStatus}
                                onChange={setFormStatus}
                                fallbackLabel={capitalize(formStatus)}
                            />


                        </div>


                        {/* Password (add mode only) */}

                        {formMode === "add" && (

                            <div
                                className="admin-form-row"
                                id="passwordFields"
                            >


                                <div className="admin-form-group">

                                    <label htmlFor="userPassword">
                                        Password
                                    </label>


                                    <div className="admin-input-wrapper">

                                        <i className="fa-solid fa-lock"></i>

                                        <input
                                            type="password"
                                            id="userPassword"
                                            placeholder="Create password"
                                            autoComplete="new-password"
                                            value={password}
                                            onChange={event => setPassword(event.target.value)}
                                        />

                                    </div>


                                    <small className="admin-field-error">
                                        {errors.password}
                                    </small>

                                </div>


                                <div className="admin-form-group">

                                    <label htmlFor="userConfirmPassword">
                                        Confirm Password
                                    </label>


                                    <div className="admin-input-wrapper">

                                        <i className="fa-solid fa-lock"></i>

                                        <input
                                            type="password"
                                            id="userConfirmPassword"
                                            placeholder="Confirm password"
                                            autoComplete="new-password"
                                            value={confirmPassword}
                                            onChange={event => setConfirmPassword(event.target.value)}
                                        />

                                    </div>


                                    <small className="admin-field-error">
                                        {errors.confirmPassword}
                                    </small>

                                </div>


                            </div>

                        )}


                        {/* Modal Footer */}

                        <div className="admin-modal-footer">


                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() => setFormOpen(false)}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="primary-btn"
                            >

                                <i
                                    className={
                                        formMode === "edit"
                                            ? "fa-solid fa-floppy-disk"
                                            : "fa-solid fa-user-plus"
                                    }
                                ></i>

                                <span>
                                    {formMode === "edit" ? "Save Changes" : "Create User"}
                                </span>

                            </button>


                        </div>


                    </form>


                </div>

            </Modal>


            {/* =================================================
                 VIEW USER MODAL
            ================================================== */}

            <Modal
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                variant="admin"
            >

                <div
                    className="admin-modal user-view-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="viewUserModalTitle"
                >


                    <div className="admin-modal-header">


                        <div>

                            <span>
                                USER DETAILS
                            </span>

                            <h2 id="viewUserModalTitle">
                                User Information
                            </h2>

                        </div>


                        <button
                            type="button"
                            className="admin-modal-close"
                            aria-label="Close modal"
                            onClick={() => setViewOpen(false)}
                        >

                            <i className="fa-solid fa-xmark"></i>

                        </button>


                    </div>


                    <div className="user-profile-preview">


                        <div className="user-modal-avatar">
                            {viewUser ? viewUser.initials : ""}
                        </div>


                        <div>

                            <h3>
                                {viewUser ? viewUser.name : ""}
                            </h3>

                            <p>
                                {viewUser ? capitalize(viewUser.role) : ""}
                            </p>

                        </div>


                    </div>


                    <div className="user-details-grid">


                        <div className="user-detail-item">

                            <span>
                                User ID
                            </span>

                            <strong>
                                {viewUser ? viewUser.userId : ""}
                            </strong>

                        </div>


                        <div className="user-detail-item">

                            <span>
                                Status
                            </span>

                            <strong
                                className={
                                    "user-detail-status " +
                                    (viewUser ? viewUser.status : "")
                                }
                            >
                                {viewUser ? capitalize(viewUser.status) : ""}
                            </strong>

                        </div>


                        <div className="user-detail-item">

                            <span>
                                Email
                            </span>

                            <strong>
                                {viewUser ? viewUser.email : ""}
                            </strong>

                        </div>


                        <div className="user-detail-item">

                            <span>
                                Phone
                            </span>

                            <strong>
                                {viewUser ? viewUser.phone : ""}
                            </strong>

                        </div>


                        <div className="user-detail-item">

                            <span>
                                Joined
                            </span>

                            <strong>
                                {viewUser ? viewUser.joined : ""}
                            </strong>

                        </div>


                        <div className="user-detail-item">

                            <span>
                                Last Activity
                            </span>

                            <strong>
                                {viewUser ? viewUser.activity : ""}
                            </strong>

                        </div>


                    </div>


                    <div className="admin-modal-footer">


                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => setViewOpen(false)}
                        >
                            Close
                        </button>


                        <button
                            type="button"
                            className="primary-btn"
                            onClick={handleViewEdit}
                        >

                            <i className="fa-solid fa-pen"></i>

                            Edit User

                        </button>


                    </div>


                </div>

            </Modal>


            {/* =================================================
                 STATUS CONFIRMATION MODAL
            ================================================== */}

            <Modal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                variant="admin"
            >

                <div
                    className="admin-modal delete-user-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="deleteUserModalTitle"
                >


                    <div className="delete-modal-icon">

                        <i className={statusIconClass}></i>

                    </div>


                    <h2 id="deleteUserModalTitle">
                        {deactivating ? "Deactivate User?" : "Activate User?"}
                    </h2>


                    <p>

                        Are you sure you want to
                        {" "}
                        <strong>
                            {deactivating ? "deactivate" : "activate"}
                        </strong>
                        {" "}
                        <strong>
                            {pendingUser ? pendingUser.name : "this user"}
                        </strong>?

                    </p>


                    <span>
                        {deactivating
                            ? "The user will no longer be able to access their account."
                            : "The user will regain full access to their account."}
                    </span>


                    <div className="admin-modal-footer">


                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => setConfirmOpen(false)}
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            className={deactivating ? "danger-btn" : "success-btn"}
                            onClick={handleConfirmStatus}
                        >

                            <i className={statusIconClass}></i>

                            <span>
                                {deactivating ? "Deactivate User" : "Activate User"}
                            </span>

                        </button>


                    </div>


                </div>

            </Modal>

        </>
    )

}
