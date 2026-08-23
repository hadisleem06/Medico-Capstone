/*
    Audit log seed + filter options.

    The 7 rows below come verbatim from pages/admin/audit-logs.html
    (icon category / title / subtitle / status pill / time). The two
    option arrays feed the action + date FilterDropdowns in the Audit
    Logs toolbar; neither carries an icon, so the dropdowns render as
    plain labels (matching the original admin selects).

      icon      : .admin-log-icon category class (login/user/record/security)
      iconName  : the Font Awesome glyph shown inside it
      statusClass / statusLabel : the .admin-log-status pill
      action / date : the values the two filters match on
      search    : the original data-search haystack (matched lowercased)
*/

export const auditLogs = [

    {
        icon: "login",
        iconName: "fa-right-to-bracket",
        title: "Sarah Nehme logged into the system",
        sub: "Nurse · NUR-118",
        statusClass: "success",
        statusLabel: "Successful",
        time: "Today · 10:42 AM",
        action: "login",
        date: "today",
        search: "Sarah Nehme logged into the system",
    },

    {
        icon: "user",
        iconName: "fa-user-plus",
        title: "New patient Ahmad Mansour registered",
        sub: "Patient · PT-1024",
        statusClass: "success",
        statusLabel: "Completed",
        time: "Today · 10:25 AM",
        action: "user",
        date: "today",
        search: "New patient Ahmad Mansour registered",
    },

    {
        icon: "record",
        iconName: "fa-heart-pulse",
        title: "Vitals recorded for Lina Nassar",
        sub: "Nurse · Sarah Nehme",
        statusClass: "success",
        statusLabel: "Completed",
        time: "Today · 09:58 AM",
        action: "record",
        date: "today",
        search: "Vitals recorded for Lina Nassar",
    },

    {
        icon: "user",
        iconName: "fa-user-doctor",
        title: "Doctor account approval pending",
        sub: "Dr. Joseph Haddad · DOC-219",
        statusClass: "warning",
        statusLabel: "Pending",
        time: "Today · 09:41 AM",
        action: "user",
        date: "today",
        search: "Doctor account approval pending",
    },

    {
        icon: "security",
        iconName: "fa-shield-halved",
        title: "Failed login attempt detected",
        sub: "Security monitoring",
        statusClass: "danger",
        statusLabel: "Warning",
        time: "Yesterday · 08:13 PM",
        action: "security",
        date: "yesterday",
        search: "Failed login attempt detected",
    },

    {
        icon: "record",
        iconName: "fa-file-medical",
        title: "Medical report uploaded",
        sub: "Patient · Joseph Khoury",
        statusClass: "success",
        statusLabel: "Completed",
        time: "Yesterday · 04:36 PM",
        action: "record",
        date: "yesterday",
        search: "Medical report uploaded",
    },

    {
        icon: "login",
        iconName: "fa-right-to-bracket",
        title: "Dr. Lina Nassar logged into the system",
        sub: "Doctor · DOC-204",
        statusClass: "success",
        statusLabel: "Successful",
        time: "Aug 10 · 02:14 PM",
        action: "login",
        date: "week",
        search: "Dr. Lina Nassar logged into the system",
    },

]


export const logActionOptions = [

    {
        value: "",
        label: "All Actions",
    },

    {
        value: "login",
        label: "Login",
    },

    {
        value: "user",
        label: "User Management",
    },

    {
        value: "record",
        label: "Medical Records",
    },

    {
        value: "security",
        label: "Security",
    },

]


export const logDateOptions = [

    {
        value: "",
        label: "All Dates",
    },

    {
        value: "today",
        label: "Today",
    },

    {
        value: "yesterday",
        label: "Yesterday",
    },

    {
        value: "week",
        label: "This Week",
    },

]
