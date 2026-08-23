/* =========================================================
   ADMIN.JS
   ADMIN DASHBOARD + USERS + MODALS + AUDIT LOGS
========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

let selectedAdminUserRow = null;
let selectedAdminUserId = null;
let pendingAdminStatusChange = null;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initAdminNavigation();

    initAdminUserFilters();

    initAdminUserActions();

    initAdminRefresh();

    initAdminUserModals();

    initAdminLogFilters();

    initAdminLogRefresh();

    initAdminCurrentDate();

    filterAdminUsers();

});


/* =========================================================
   ADMIN NAVIGATION
========================================================= */

function initAdminNavigation() {

    const adminActions =
        document.querySelectorAll("[data-admin-action]");


    adminActions.forEach(action => {

        action.addEventListener("click", () => {

            const target =
                action.dataset.adminAction;


            if (!target) {
                return;
            }


            adminActions.forEach(item => {
                item.classList.remove("active");
            });


            action.classList.add("active");


            navigateAdmin(target);

        });

    });

}


function navigateAdmin(target) {

    const pages = {

        dashboard: "dashboard.html",

        users: "users.html",

        "audit-logs": "audit-logs.html"

    };


    if (!pages[target]) {
        return;
    }


    window.location.href =
        pages[target];

}


/* =========================================================
   CURRENT DATE
========================================================= */

function initAdminCurrentDate() {

    const dateElement =
        document.getElementById("adminCurrentDate");


    if (!dateElement) {
        return;
    }


    const today =
        new Date();


    const formattedDate =
        today.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });


    dateElement.textContent =
        formattedDate;

}


/* =========================================================
   ADMIN DROPDOWNS
========================================================= */
function initAdminDropdown(
    container,
    triggerId,
    callback = null
) {

    if (!container) {
        return;
    }

    const trigger =
        document.getElementById(triggerId);

    const menu =
        container.querySelector(".filter-menu");

    const options =
        container.querySelectorAll(
            ".filter-option"
        );

    if (!trigger || !menu) {
        return;
    }

    trigger.addEventListener("click", event => {

        event.preventDefault();
        event.stopPropagation();

        closeAdminDropdowns(container);

        container.classList.toggle("open");

    });

    options.forEach(option => {

        option.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            options.forEach(item => {
                item.classList.remove("active");
            });

            option.classList.add("active");

            const value =
                option.dataset.value || "";

            const text =
                option.textContent.trim();

            const triggerText =
                trigger.querySelector("span");

            if (triggerText) {
                triggerText.textContent =
                    text;
            }

            container.dataset.value =
                value;

            /* IMPORTANT */

            if (container.id === "userRoleDropdown") {

                const roleInput =
                    document.getElementById(
                        "userRole"
                    );

                if (roleInput) {
                    roleInput.value =
                        value;
                }

            }

            if (container.id === "userStatusDropdown") {

                const statusInput =
                    document.getElementById(
                        "userStatus"
                    );

                if (statusInput) {
                    statusInput.value =
                        value;
                }

            }

            /* CLOSE */

            container.classList.remove("open");

            if (typeof callback === "function") {
                callback(value);
            }

        });

    });
}

function closeAdminDropdowns(exception = null) {

    document
        .querySelectorAll(".admin-filter")
        .forEach(dropdown => {

            if (dropdown !== exception) {

                dropdown.classList.remove("open");

            }

        });

}


document.addEventListener("click", () => {

    closeAdminDropdowns();

});


/* =========================================================
   USER FILTERS
========================================================= */

function initAdminUserFilters() {

    const searchInput =
        document.getElementById("userSearch");


    const roleFilter =
        document.getElementById("roleFilter");


    const statusFilter =
        document.getElementById("statusFilter");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterAdminUsers
        );

    }


    initAdminDropdown(
        roleFilter,
        "roleFilterTrigger",
        filterAdminUsers
    );


    initAdminDropdown(
        statusFilter,
        "statusFilterTrigger",
        filterAdminUsers
    );

}


/* =========================================================
   FILTER USERS
========================================================= */

function filterAdminUsers() {

    const searchInput =
        document.getElementById("userSearch");


    const roleFilter =
        document.getElementById("roleFilter");


    const statusFilter =
        document.getElementById("statusFilter");


    const rows =
        document.querySelectorAll(
            ".admin-management-row"
        );


    const emptyState =
        document.getElementById("emptyUsers");


    const countElement =
        document.getElementById("userCount");


    const searchValue =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedRole =
        roleFilter
            ? roleFilter.dataset.value || ""
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.dataset.value || ""
            : "";


    let visibleUsers = 0;


    rows.forEach(row => {

        const name =
            row.dataset.name
                ? row.dataset.name.toLowerCase()
                : "";


        const role =
            row.dataset.role || "";


        const status =
            row.dataset.status || "";


        const matchesSearch =
            name.includes(searchValue);


        const matchesRole =
            !selectedRole ||
            role === selectedRole;


        const matchesStatus =
            !selectedStatus ||
            status === selectedStatus;


        const shouldShow =
            matchesSearch &&
            matchesRole &&
            matchesStatus;


        if (shouldShow) {

            row.classList.remove("hidden");

            visibleUsers++;

        }
        else {

            row.classList.add("hidden");

        }

    });


    if (emptyState) {

        emptyState.classList.toggle(
            "visible",
            visibleUsers === 0
        );

    }


    if (countElement) {

        countElement.textContent =
            `${visibleUsers} ${
                visibleUsers === 1
                    ? "User"
                    : "Users"
            }`;

    }

}


/* =========================================================
   USER ACTION BUTTONS
========================================================= */

function initAdminUserActions() {

    const actionButtons =
        document.querySelectorAll(
            "[data-user-action]"
        );


    actionButtons.forEach(button => {

        button.addEventListener(
            "click",
            handleAdminUserAction
        );

    });

}


function handleAdminUserAction(event) {

    event.preventDefault();

    event.stopPropagation();


    const button =
        event.currentTarget;


    const action =
        button.dataset.userAction;


    const row =
        button.closest(
            ".admin-management-row"
        );


    if (!row) {
        return;
    }


    selectedAdminUserRow =
        row;


    switch (action) {

        case "view":

            openAdminViewUser(row);

            break;


        case "edit":

            openAdminUserForm(
                "edit",
                row
            );

            break;


        case "activate":

            openAdminStatusConfirm(
                row,
                "active"
            );

            break;


        case "deactivate":

            openAdminStatusConfirm(
                row,
                "inactive"
            );

            break;

    }

}


/* =========================================================
   STATUS CHANGE CONFIRMATION

   activate / deactivate now route through the confirmation
   modal already present in users.html (#deleteUserModal),
   which was fully built but never wired. We populate its
   dynamic text for the pending action and open it; the
   status change is applied only when the user confirms
   (see the confirm handler in initAdminUserModals).
========================================================= */

function openAdminStatusConfirm(
    row,
    newStatus
) {

    const modal =
        document.getElementById(
            "deleteUserModal"
        );


    if (!modal || !row) {
        return;
    }


    pendingAdminStatusChange = {
        row: row,
        status: newStatus
    };


    const name =
        row.dataset.name ||
        row.querySelector(
            ".admin-management-user h3"
        )?.textContent.trim() ||
        "this user";


    const deactivating =
        newStatus !== "active";


    setAdminText(
        "deleteUserName",
        name
    );


    setAdminText(
        "deleteUserModalTitle",
        deactivating
            ? "Deactivate User?"
            : "Activate User?"
    );


    setAdminText(
        "statusActionText",
        deactivating
            ? "deactivate"
            : "activate"
    );


    setAdminText(
        "statusModalDescription",
        deactivating
            ? "The user will no longer be able to access their account."
            : "The user will regain full access to their account."
    );


    setAdminText(
        "confirmStatusText",
        deactivating
            ? "Deactivate User"
            : "Activate User"
    );


    const iconClass =
        deactivating
            ? "fa-solid fa-user-slash"
            : "fa-solid fa-user-check";


    const statusIcon =
        document.getElementById(
            "statusModalIcon"
        );


    if (statusIcon) {
        statusIcon.className = iconClass;
    }


    const confirmIcon =
        document.getElementById(
            "confirmStatusIcon"
        );


    if (confirmIcon) {
        confirmIcon.className = iconClass;
    }


    const confirmButton =
        document.getElementById(
            "confirmDeleteUser"
        );


    if (confirmButton) {

        confirmButton.className =
            deactivating
                ? "danger-btn"
                : "success-btn";

    }


    openAdminModal(modal);

}


/* =========================================================
   SET TEXT HELPER
========================================================= */

function setAdminText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;

    }

}


/* =========================================================
   VIEW USER MODAL
========================================================= */

function openAdminViewUser(row) {

    const modal =
        document.getElementById(
            "viewUserModal"
        );


    if (!modal || !row) {
        return;
    }


    selectedAdminUserRow =
        row;


    selectedAdminUserId =
        row.querySelector(
            ".admin-management-user p"
        )?.textContent.trim() || "";


    const name =
        row.dataset.name ||
        row.querySelector(
            ".admin-management-user h3"
        )?.textContent.trim() ||
        "User";


    const role =
        row.dataset.role ||
        "user";


    const status =
        row.dataset.status ||
        "active";


    const roleLabel =
        capitalize(role);


    const statusLabel =
        capitalize(status);


    const id =
        row.querySelector(
            ".admin-management-user p"
        )?.textContent.trim() ||
        "N/A";


    const initials =
        row.querySelector(
            ".admin-management-avatar"
        )?.textContent.trim() ||
        getInitials(name);


    const email =
        row.dataset.email ||
        generateDemoEmail(name);


    const phone =
        row.dataset.phone ||
        "+961 70 000 000";


    const joined =
        row.dataset.joined ||
        "Aug 08, 2026";


    const activity =
        row.dataset.activity ||
        "Today · 10:42 AM";


    const avatar =
        document.getElementById(
            "viewUserAvatar"
        );


    const nameElement =
        document.getElementById(
            "viewUserName"
        );


    const roleElement =
        document.getElementById(
            "viewUserRole"
        );


    const idElement =
        document.getElementById(
            "viewUserId"
        );


    const statusElement =
        document.getElementById(
            "viewUserStatus"
        );


    const emailElement =
        document.getElementById(
            "viewUserEmail"
        );


    const phoneElement =
        document.getElementById(
            "viewUserPhone"
        );


    const joinedElement =
        document.getElementById(
            "viewUserJoined"
        );


    const activityElement =
        document.getElementById(
            "viewUserActivity"
        );


    if (avatar) {
        avatar.textContent = initials;
    }


    if (nameElement) {
        nameElement.textContent = name;
    }


    if (roleElement) {
        roleElement.textContent =
            roleLabel;
    }


    if (idElement) {
        idElement.textContent = id;
    }


    if (statusElement) {

        statusElement.textContent =
            statusLabel;

        statusElement.className =
            `user-detail-status ${status}`;

    }


    if (emailElement) {
        emailElement.textContent =
            email;
    }


    if (phoneElement) {
        phoneElement.textContent =
            phone;
    }


    if (joinedElement) {
        joinedElement.textContent =
            joined;
    }


    if (activityElement) {
        activityElement.textContent =
            activity;
    }


    openAdminModal(modal);

}


/* =========================================================
   OPEN ADD / EDIT USER MODAL
========================================================= */

function openAdminUserForm(mode = "add", row = null) {

    const modal =
        document.getElementById("userFormModal");

    if (!modal) {
        return;
    }

    const title =
        document.getElementById("userFormModalTitle");

    const saveButton =
        document.getElementById("saveUserButton");

    const saveText =
        saveButton?.querySelector("span");

    const saveIcon =
        saveButton?.querySelector("i");

    const passwordFields =
        document.getElementById("passwordFields");

    const editingUserId =
        document.getElementById("editingUserId");

    if (mode === "edit" && row) {

        selectedAdminUserRow = row;

        const name =
            row.dataset.name ||
            row.querySelector(
                ".admin-management-user h3"
            )?.textContent.trim() ||
            "";

        const email =
            row.dataset.email ||
            generateDemoEmail(name);

        const phone =
            row.dataset.phone ||
            "+961 70 000 000";

        const role =
            row.dataset.role ||
            "patient";

        const status =
            row.dataset.status ||
            "active";

        const id =
            row.querySelector(
                ".admin-management-user p"
            )?.textContent.trim() ||
            "";

        if (editingUserId) {
            editingUserId.value = id;
        }

        document.getElementById(
            "userFullName"
        ).value = name;

        document.getElementById(
            "userEmail"
        ).value = email;

        document.getElementById(
            "userPhone"
        ).value = phone;

        setAdminDropdownValue(
            "userRoleDropdown",
            "userRole",
            role,
            capitalize(role)
        );

        setAdminDropdownValue(
            "userStatusDropdown",
            "userStatus",
            status,
            capitalize(status)
        );

        if (title) {
            title.textContent = "Edit User";
        }

        if (saveText) {
            saveText.textContent = "Save Changes";
        }

        if (saveIcon) {
            saveIcon.className =
                "fa-solid fa-floppy-disk";
        }

        if (passwordFields) {
            passwordFields.style.display = "none";
        }

    } else {

        resetAdminUserForm();

        selectedAdminUserRow = null;

        if (title) {
            title.textContent = "Add New User";
        }

        if (saveText) {
            saveText.textContent = "Create User";
        }

        if (saveIcon) {
            saveIcon.className =
                "fa-solid fa-user-plus";
        }

        if (passwordFields) {
            passwordFields.style.display = "grid";
        }

    }

    openAdminModal(modal);
}


/* =========================================================
   ADD USER BUTTON
========================================================= */

function initAdminUserModals() {

    const addUserButton =
        document.querySelector(
            '[data-admin-modal="add-user"]'
        );


    const formModal =
        document.getElementById(
            "userFormModal"
        );


    const viewModal =
        document.getElementById(
            "viewUserModal"
        );


    const deleteModal =
        document.getElementById(
            "deleteUserModal"
        );


    if (addUserButton) {

        addUserButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                openAdminUserForm("add");

            }
        );

    }


    /* =====================================================
       CLOSE FORM MODAL
    ===================================================== */

    document
        .getElementById(
            "closeUserFormModal"
        )
        ?.addEventListener(
            "click",
            () => {

                closeAdminModal(
                    formModal
                );

            }
        );


    document
        .getElementById(
            "cancelUserForm"
        )
        ?.addEventListener(
            "click",
            () => {

                closeAdminModal(
                    formModal
                );

            }
        );


    /* =====================================================
       CLOSE VIEW MODAL
    ===================================================== */

    document
        .getElementById(
            "closeViewUserModal"
        )
        ?.addEventListener(
            "click",
            () => {

                closeAdminModal(
                    viewModal
                );

            }
        );


    document
        .getElementById(
            "closeViewUserButton"
        )
        ?.addEventListener(
            "click",
            () => {

                closeAdminModal(
                    viewModal
                );

            }
        );


    /* =====================================================
       VIEW → EDIT
    ===================================================== */

    document
        .getElementById(
            "viewEditUserButton"
        )
        ?.addEventListener(
            "click",
            () => {

                if (!selectedAdminUserRow) {
                    return;
                }


                closeAdminModal(
                    viewModal
                );


                openAdminUserForm(
                    "edit",
                    selectedAdminUserRow
                );

            }
        );


    /* =====================================================
       STATUS CONFIRM MODAL

       Wire the confirmation modal that activate / deactivate
       now open. Cancel simply closes; confirm applies the
       stored status change, closes the modal and shows a
       toast.
    ===================================================== */

    document
        .getElementById(
            "cancelDeleteUser"
        )
        ?.addEventListener(
            "click",
            () => {

                pendingAdminStatusChange = null;

                closeAdminModal(
                    deleteModal
                );

            }
        );


    document
        .getElementById(
            "confirmDeleteUser"
        )
        ?.addEventListener(
            "click",
            () => {

                if (!pendingAdminStatusChange) {
                    return;
                }


                const row =
                    pendingAdminStatusChange.row;


                const status =
                    pendingAdminStatusChange.status;


                updateAdminUserStatus(
                    row,
                    status
                );


                closeAdminModal(
                    deleteModal
                );


                const name =
                    row.dataset.name ||
                    row.querySelector(
                        ".admin-management-user h3"
                    )?.textContent.trim() ||
                    "User";


                showAdminMessage(
                    status === "active"
                        ? `${name} has been activated.`
                        : `${name} has been deactivated.`,
                    status === "active"
                        ? "success"
                        : "warning"
                );


                pendingAdminStatusChange = null;

            }
        );


    /* =====================================================
       OUTSIDE CLICK
    ===================================================== */

    [
        formModal,
        viewModal,
        deleteModal
    ]
    .forEach(modal => {

        if (!modal) {
            return;
        }


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeAdminModal(
                        modal
                    );

                }

            }
        );

    });


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            document
                .querySelectorAll(
                    ".admin-modal-overlay.active"
                )
                .forEach(modal => {

                    closeAdminModal(
                        modal
                    );

                });

        }
    );


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    initAdminUserForm();


    /* =====================================================
       MODAL DROPDOWNS
    ===================================================== */

    initAdminDropdown(
        document.getElementById(
            "userRoleDropdown"
        ),
        "userRoleTrigger"
    );


    initAdminDropdown(
        document.getElementById(
            "userStatusDropdown"
        ),
        "userStatusTrigger"
    );

}


/* =========================================================
   OPEN GENERIC MODAL
========================================================= */

function openAdminModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.add("active");


    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   CLOSE GENERIC MODAL
========================================================= */

function closeAdminModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.remove("active");


    const activeModals =
        document.querySelectorAll(
            ".admin-modal-overlay.active"
        );


    if (activeModals.length === 0) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}


/* =========================================================
   USER FORM
========================================================= */
function initAdminUserForm() {

    const form =
        document.getElementById("userForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", event => {

        event.preventDefault();

        const editingUserId =
            document.getElementById(
                "editingUserId"
            )?.value;

        const mode =
            editingUserId
                ? "edit"
                : "add";

        if (!validateAdminUserForm(mode)) {
            return;
        }

        if (mode === "edit") {

            updateAdminUserRow();

            showAdminMessage(
                "User updated successfully.",
                "success"
            );

        } else {

            createAdminUserRow();

            showAdminMessage(
                "User created successfully.",
                "success"
            );

        }

        /* Close modal */

        closeAdminModal(
            document.getElementById(
                "userFormModal"
            )
        );

        /* Reset form */

        resetAdminUserForm();

    });
}


/* =========================================================
   VALIDATE USER FORM
========================================================= */

function validateAdminUserForm(mode) {

    let valid = true;


    const name =
        document.getElementById(
            "userFullName"
        );


    const email =
        document.getElementById(
            "userEmail"
        );


    const phone =
        document.getElementById(
            "userPhone"
        );


    const role =
        document.getElementById(
            "userRole"
        );


    const password =
        document.getElementById(
            "userPassword"
        );


    const confirmPassword =
        document.getElementById(
            "userConfirmPassword"
        );


    clearAdminUserErrors();


    if (!name.value.trim()) {

        showAdminFieldError(
            "userFullNameError",
            "Full name is required."
        );

        valid = false;

    }


    if (!email.value.trim()) {

        showAdminFieldError(
            "userEmailError",
            "Email address is required."
        );

        valid = false;

    }
    else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(
                email.value.trim()
            )
    ) {

        showAdminFieldError(
            "userEmailError",
            "Enter a valid email address."
        );

        valid = false;

    }


    if (!phone.value.trim()) {

        showAdminFieldError(
            "userPhoneError",
            "Phone number is required."
        );

        valid = false;

    }


    if (!role.value) {

        showAdminFieldError(
            "userRoleError",
            "Please select a role."
        );

        valid = false;

    }


    if (mode === "add") {

        if (
            password.value.length < 8
        ) {

            showAdminFieldError(
                "userPasswordError",
                "Password must contain at least 8 characters."
            );

            valid = false;

        }


        if (
            password.value !==
            confirmPassword.value
        ) {

            showAdminFieldError(
                "userConfirmPasswordError",
                "Passwords do not match."
            );

            valid = false;

        }

    }


    return valid;

}


/* =========================================================
   CREATE USER ROW
========================================================= */

function createAdminUserRow() {

    const name =
        document.getElementById(
            "userFullName"
        ).value.trim();


    const email =
        document.getElementById(
            "userEmail"
        ).value.trim();


    const phone =
        document.getElementById(
            "userPhone"
        ).value.trim();


    const role =
        document.getElementById(
            "userRole"
        ).value;


    const status =
        document.getElementById(
            "userStatus"
        ).value ||
        "active";


    const initials =
        getInitials(name);


    const id =
        generateUserId(role);


    const list =
        document.getElementById(
            "usersList"
        );


    if (!list) {
        return;
    }


    const roleIcon =
        getRoleIcon(role);


    const row =
        document.createElement("div");


    row.className =
        "admin-management-row";


    row.dataset.role =
        role;


    row.dataset.status =
        status;


    row.dataset.name =
        name;


    row.dataset.email =
        email;


    row.dataset.phone =
        phone;


    row.dataset.joined =
        formatToday();


    row.dataset.activity =
        "Just now";


    row.innerHTML = `

        <div class="admin-management-user">

            <div class="admin-management-avatar ${role}">
                ${initials}
            </div>

            <div>

                <h3>
                    ${escapeHtml(name)}
                </h3>

                <p>
                    ${id}
                </p>

            </div>

        </div>


        <div class="admin-role-badge ${role}">

            <i class="fa-solid ${roleIcon}"></i>

            ${capitalize(role)}

        </div>


        <div class="admin-status-badge ${status}">

            <i class="fa-solid fa-circle"></i>

            ${capitalize(status)}

        </div>


        <div class="admin-management-actions">

            <button
                type="button"
                class="admin-icon-btn"
                title="View user"
                data-user-action="view"
            >

                <i class="fa-solid fa-eye"></i>

            </button>


            <button
                type="button"
                class="admin-icon-btn"
                title="Edit user"
                data-user-action="edit"
            >

                <i class="fa-solid fa-pen"></i>

            </button>


            ${
                status === "active"
                ?

                `
                <button
                    type="button"
                    class="admin-icon-btn danger"
                    title="Deactivate user"
                    data-user-action="deactivate"
                >

                    <i class="fa-solid fa-user-slash"></i>

                </button>
                `

                :

                `
                <button
                    type="button"
                    class="admin-icon-btn success"
                    title="Activate user"
                    data-user-action="activate"
                >

                    <i class="fa-solid fa-user-check"></i>

                </button>
                `
            }

        </div>

    `;


    list.insertBefore(
        row,
        list.firstChild
    );


    const buttons =
        row.querySelectorAll(
            "[data-user-action]"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            handleAdminUserAction
        );

    });


    filterAdminUsers();

}


/* =========================================================
   UPDATE EXISTING USER ROW
========================================================= */

function updateAdminUserRow() {

    const row =
        selectedAdminUserRow;


    if (!row) {
        return;
    }


    const name =
        document.getElementById(
            "userFullName"
        ).value.trim();


    const email =
        document.getElementById(
            "userEmail"
        ).value.trim();


    const phone =
        document.getElementById(
            "userPhone"
        ).value.trim();


    const role =
        document.getElementById(
            "userRole"
        ).value;


    const status =
        document.getElementById(
            "userStatus"
        ).value ||
        "active";


    const id =
        row.querySelector(
            ".admin-management-user p"
        )?.textContent.trim() ||
        generateUserId(role);


    row.dataset.name =
        name;


    row.dataset.email =
        email;


    row.dataset.phone =
        phone;


    row.dataset.role =
        role;


    row.dataset.status =
        status;


    const avatar =
        row.querySelector(
            ".admin-management-avatar"
        );


    const nameElement =
        row.querySelector(
            ".admin-management-user h3"
        );


    const roleBadge =
        row.querySelector(
            ".admin-role-badge"
        );


    const statusBadge =
        row.querySelector(
            ".admin-status-badge"
        );


    const actionButton =
        row.querySelector(
            "[data-user-action='activate'], [data-user-action='deactivate']"
        );


    if (avatar) {

        avatar.className =
            `admin-management-avatar ${role}`;

        avatar.textContent =
            getInitials(name);

    }


    if (nameElement) {

        nameElement.textContent =
            name;

    }


    if (roleBadge) {

        roleBadge.className =
            `admin-role-badge ${role}`;

        roleBadge.innerHTML = `

            <i class="fa-solid ${getRoleIcon(role)}"></i>

            ${capitalize(role)}

        `;

    }


    if (statusBadge) {

        statusBadge.className =
            `admin-status-badge ${status}`;

        statusBadge.innerHTML = `

            <i class="fa-solid fa-circle"></i>

            ${capitalize(status)}

        `;

    }


    if (actionButton) {

        updateStatusButton(
            actionButton,
            status
        );

    }


    filterAdminUsers();

}


/* =========================================================
   UPDATE USER STATUS
   NO NOTIFICATION HERE
========================================================= */

function updateAdminUserStatus(
    row,
    newStatus
) {

    if (!row) {
        return;
    }


    row.dataset.status =
        newStatus;


    const statusBadge =
        row.querySelector(
            ".admin-status-badge"
        );


    const actionButton =
        row.querySelector(
            "[data-user-action='activate'], [data-user-action='deactivate']"
        );


    if (statusBadge) {

        statusBadge.className =
            `admin-status-badge ${newStatus}`;


        statusBadge.innerHTML = `

            <i class="fa-solid fa-circle"></i>

            ${capitalize(newStatus)}

        `;

    }


    if (actionButton) {

        updateStatusButton(
            actionButton,
            newStatus
        );

    }


    filterAdminUsers();

}


/* =========================================================
   UPDATE STATUS ACTION BUTTON
========================================================= */

function updateStatusButton(
    button,
    status
) {

    if (!button) {
        return;
    }


    if (status === "active") {

        button.dataset.userAction =
            "deactivate";


        button.title =
            "Deactivate user";


        button.classList.remove(
            "success"
        );


        button.classList.add(
            "danger"
        );


        button.innerHTML = `

            <i class="fa-solid fa-user-slash"></i>

        `;

    }
    else {

        button.dataset.userAction =
            "activate";


        button.title =
            "Activate user";


        button.classList.remove(
            "danger"
        );


        button.classList.add(
            "success"
        );


        button.innerHTML = `

            <i class="fa-solid fa-user-check"></i>

        `;

    }

}


/* =========================================================
   RESET USER FORM
========================================================= */

function resetAdminUserForm() {

    const form =
        document.getElementById(
            "userForm"
        );


    if (form) {
        form.reset();
    }


    const editingUserId =
        document.getElementById(
            "editingUserId"
        );


    if (editingUserId) {
        editingUserId.value = "";
    }


    setAdminDropdownValue(
        "userRoleDropdown",
        "userRole",
        "",
        "Select role..."
    );


    setAdminDropdownValue(
        "userStatusDropdown",
        "userStatus",
        "active",
        "Active"
    );


    clearAdminUserErrors();


    const passwordFields =
        document.getElementById(
            "passwordFields"
        );


    if (passwordFields) {

        passwordFields.style.display =
            "grid";

    }

}


/* =========================================================
   SET DROPDOWN VALUE
========================================================= */

function setAdminDropdownValue(
    dropdownId,
    hiddenInputId,
    value,
    label
) {

    const dropdown =
        document.getElementById(
            dropdownId
        );


    const hidden =
        document.getElementById(
            hiddenInputId
        );


    if (!dropdown || !hidden) {
        return;
    }


    hidden.value =
        value;


    dropdown.dataset.value =
        value;


    const trigger =
        dropdown.querySelector(
            ".filter-trigger span"
        );


    if (trigger) {

        trigger.textContent =
            label;

    }


    dropdown
        .querySelectorAll(
            ".filter-option"
        )
        .forEach(option => {

            option.classList.toggle(
                "active",
                option.dataset.value === value
            );

        });

}


/* =========================================================
   FIELD ERRORS
========================================================= */

function showAdminFieldError(
    id,
    message
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            message;

    }

}


function clearAdminUserErrors() {

    document
        .querySelectorAll(
            ".admin-field-error"
        )
        .forEach(error => {

            error.textContent = "";

        });

}


/* =========================================================
   REFRESH USERS
========================================================= */

function initAdminRefresh() {

    const refreshButton =
        document.getElementById(
            "refreshUsers"
        );


    if (!refreshButton) {
        return;
    }


    refreshButton.addEventListener(
        "click",
        () => {

            refreshButton.classList.add(
                "loading"
            );


            setTimeout(() => {

                refreshButton.classList.remove(
                    "loading"
                );


                filterAdminUsers();


                showAdminMessage(
                    "User list refreshed.",
                    "success"
                );

            }, 700);

        }
    );

}


/* =========================================================
   ADMIN NOTIFICATION
   ONLY USED FOR REAL NOTIFICATION ACTIONS
========================================================= */

function showAdminMessage(
    message,
    type = "success"
) {

    let container =
        document.querySelector(
            ".admin-message-container"
        );


    if (!container) {

        container =
            document.createElement("div");

        container.className =
            "admin-message-container";

        document.body.appendChild(
            container
        );

    }


    const notification =
        document.createElement("div");


    notification.className =
        `admin-message ${type}`;


    let icon =
        "fa-circle-check";


    if (type === "error") {

        icon =
            "fa-circle-exclamation";

    }
    else if (type === "warning") {

        icon =
            "fa-triangle-exclamation";

    }
    else if (type === "info") {

        icon =
            "fa-circle-info";

    }


    notification.innerHTML = `

        <i class="fa-solid ${icon}"></i>

        <span>
            ${escapeHtml(message)}
        </span>

        <button
            type="button"
            class="admin-message-close"
        >

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    container.appendChild(
        notification
    );


    const closeButton =
        notification.querySelector(
            ".admin-message-close"
        );


    closeButton.addEventListener(
        "click",
        () => {

            removeAdminMessage(
                notification
            );

        }
    );


    setTimeout(() => {

        if (
            notification.isConnected
        ) {

            removeAdminMessage(
                notification
            );

        }

    }, 3500);

}


function removeAdminMessage(
    notification
) {

    if (!notification) {
        return;
    }


    notification.classList.add(
        "hide"
    );


    setTimeout(() => {

        if (
            notification.isConnected
        ) {

            notification.remove();

        }

    }, 250);

}


/* =========================================================
   ADMIN MESSAGE STYLES
========================================================= */

if (
    !document.getElementById(
        "adminMessageStyles"
    )
) {

    const adminMessageStyles =
        document.createElement("style");


    adminMessageStyles.id =
        "adminMessageStyles";


    adminMessageStyles.textContent = `

        .admin-message-container{
            position:fixed;
            top:25px;
            right:25px;
            z-index:99999;
            display:flex;
            flex-direction:column;
            gap:10px;
            pointer-events:none;
        }

        .admin-message{
            display:flex;
            align-items:center;
            gap:10px;
            min-width:280px;
            max-width:380px;
            padding:13px 15px;
            border:1px solid var(--glass-border);
            border-radius:13px;
            background:rgba(15,23,26,.88);
            backdrop-filter:blur(18px);
            -webkit-backdrop-filter:blur(18px);
            box-shadow:var(--shadow);
            color:var(--text);
            font-size:12px;
            pointer-events:auto;
            animation:adminMessageIn .3s ease forwards;
        }

        .admin-message > i{
            color:var(--primary);
            font-size:15px;
        }

        .admin-message.error > i{
            color:#ef4444;
        }

        .admin-message.warning > i{
            color:#f59e0b;
        }

        .admin-message span{
            flex:1;
        }

        .admin-message-close{
            display:flex;
            align-items:center;
            justify-content:center;
            width:24px;
            height:24px;
            border:none;
            background:transparent;
            color:var(--muted);
            cursor:pointer;
        }

        .admin-message-close:hover{
            color:var(--text);
        }

        .admin-message.hide{
            animation:adminMessageOut .25s ease forwards;
        }

        @keyframes adminMessageIn{

            from{
                opacity:0;
                transform:translateX(20px);
            }

            to{
                opacity:1;
                transform:translateX(0);
            }

        }

        @keyframes adminMessageOut{

            from{
                opacity:1;
                transform:translateX(0);
            }

            to{
                opacity:0;
                transform:translateX(20px);
            }

        }

        @media(max-width:600px){

            .admin-message-container{
                top:15px;
                right:15px;
                left:15px;
            }

            .admin-message{
                min-width:0;
                width:100%;
            }

        }

    `;


    document.head.appendChild(
        adminMessageStyles
    );

}


/* =========================================================
   AUDIT LOG FILTERS
========================================================= */

function initAdminLogFilters() {

    const searchInput =
        document.getElementById(
            "logSearch"
        );


    const actionFilter =
        document.getElementById(
            "logActionFilter"
        );


    const dateFilter =
        document.getElementById(
            "logDateFilter"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterAdminLogs
        );

    }


    initAdminDropdown(
        actionFilter,
        "logActionFilterTrigger",
        filterAdminLogs
    );


    initAdminDropdown(
        dateFilter,
        "logDateFilterTrigger",
        filterAdminLogs
    );

}


/* =========================================================
   FILTER AUDIT LOGS
========================================================= */

function filterAdminLogs() {

    const searchInput =
        document.getElementById(
            "logSearch"
        );


    const actionFilter =
        document.getElementById(
            "logActionFilter"
        );


    const dateFilter =
        document.getElementById(
            "logDateFilter"
        );


    const rows =
        document.querySelectorAll(
            ".admin-log-row"
        );


    const emptyState =
        document.getElementById(
            "emptyLogs"
        );


    const countElement =
        document.getElementById(
            "logCount"
        );


    const searchValue =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedAction =
        actionFilter
            ? actionFilter.dataset.value || ""
            : "";


    const selectedDate =
        dateFilter
            ? dateFilter.dataset.value || ""
            : "";


    let visibleLogs = 0;


    rows.forEach(row => {

        const searchText =
            row.dataset.search
                ? row.dataset.search.toLowerCase()
                : "";


        const action =
            row.dataset.action || "";


        const date =
            row.dataset.date || "";


        const matchesSearch =
            searchText.includes(
                searchValue
            );


        const matchesAction =
            !selectedAction ||
            action === selectedAction;


        const matchesDate =
            !selectedDate ||
            date === selectedDate;


        const shouldShow =
            matchesSearch &&
            matchesAction &&
            matchesDate;


        if (shouldShow) {

            row.classList.remove(
                "hidden"
            );

            visibleLogs++;

        }
        else {

            row.classList.add(
                "hidden"
            );

        }

    });


    if (emptyState) {

        emptyState.classList.toggle(
            "visible",
            visibleLogs === 0
        );

    }


    if (countElement) {

        countElement.textContent =
            `${visibleLogs} ${
                visibleLogs === 1
                    ? "Event"
                    : "Events"
            }`;

    }

}


/* =========================================================
   REFRESH AUDIT LOGS
========================================================= */

function initAdminLogRefresh() {

    const refreshButton =
        document.getElementById(
            "refreshLogs"
        );


    if (!refreshButton) {
        return;
    }


    refreshButton.addEventListener(
        "click",
        () => {

            refreshButton.classList.add(
                "loading"
            );


            setTimeout(() => {

                refreshButton.classList.remove(
                    "loading"
                );


                filterAdminLogs();


                showAdminMessage(
                    "Audit logs refreshed.",
                    "success"
                );

            }, 700);

        }
    );

}


/* =========================================================
   HELPERS
========================================================= */

function capitalize(value) {

    if (!value) {
        return "";
    }


    return value.charAt(0).toUpperCase()
        + value.slice(1);

}


function getInitials(name) {

    if (!name) {
        return "U";
    }


    const parts =
        name.trim()
            .split(/\s+/);


    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

}


function generateDemoEmail(name) {

    if (!name) {
        return "user@example.com";
    }


    return (
        name
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                "."
            )
            .replace(
                /^\.+|\.+$/g,
                ""
            )
        + "@example.com"
    );

}


function generateUserId(role) {

    const prefix = {

        patient: "PT",

        doctor: "DOC",

        nurse: "NUR",

        admin: "ADM"

    };


    const number =
        Math.floor(
            1000 +
            Math.random() * 8999
        );


    return `${
        prefix[role] || "USR"
    }-${number}`;

}


function getRoleIcon(role) {

    const icons = {

        patient: "fa-user",

        doctor: "fa-user-doctor",

        nurse: "fa-user-nurse",

        admin: "fa-shield-halved"

    };


    return icons[role] ||
        "fa-user";

}


function formatToday() {

    return new Date()
        .toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric"
            }
        );

}


function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}