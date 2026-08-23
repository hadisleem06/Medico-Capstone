/*
    Doctor appointments seed data.

    Extracted verbatim from the markup of pages/doctor/appointments.html
    (the 4 hand-authored .doctor-appointment-card articles) plus the
    select option lists from the New Appointment modal. Rendering the
    page from this array is identical to the original static markup.

    Read synchronously for the initial render (no loading state), matching
    the original; writes/submits go through the service seam instead.
*/

export const doctorAppointments = [

    {
        id: 1,
        time: "14:30",
        duration: "30 min",
        patient: "Emma Wilson",
        initials: "EW",
        avatar: "avatar-teal",
        age: 34,
        gender: "Female",
        condition: "Cardiology follow-up",
        status: "upcoming",
        date: "today",
    },

    {
        id: 2,
        time: "15:00",
        duration: "30 min",
        patient: "Daniel Carter",
        initials: "DC",
        avatar: "avatar-purple",
        age: 52,
        gender: "Male",
        condition: "Blood pressure review",
        status: "waiting",
        date: "today",
    },

    {
        id: 3,
        time: "13:30",
        duration: "45 min",
        patient: "Olivia Bennett",
        initials: "OB",
        avatar: "avatar-blue",
        age: 41,
        gender: "Female",
        condition: "Routine cardiac review",
        status: "completed",
        date: "today",
    },

    {
        id: 4,
        time: "16:00",
        duration: "30 min",
        patient: "James Anderson",
        initials: "JA",
        avatar: "avatar-orange",
        age: 47,
        gender: "Male",
        condition: "Chest pain assessment",
        status: "upcoming",
        date: "today",
    },

]


/* status badge skin per appointment status */

export const appointmentStatusBadge = {
    upcoming:  { cls: "upcoming-status",  icon: "fa-clock",          label: "Upcoming" },
    waiting:   { cls: "waiting-status",   icon: "fa-hourglass-half", label: "Waiting" },
    completed: { cls: "completed-status", icon: "fa-check",          label: "Completed" },
}


/* timeline dot modifier per status */

export const appointmentDotClass = {
    upcoming:  "",
    waiting:   " waiting-dot",
    completed: " completed-dot",
}


/* status filter options (id="appointmentStatusFilter") */

export const appointmentStatusOptions = [
    { value: "",          label: "All Status", icon: "fa-layer-group" },
    { value: "upcoming",  label: "Upcoming",   icon: "fa-clock" },
    { value: "completed", label: "Completed",  icon: "fa-circle-check" },
    { value: "cancelled", label: "Cancelled",  icon: "fa-circle-xmark" },
]


/* date filter options (id="appointmentDateFilter") */

export const appointmentDateOptions = [
    { value: "",         label: "All Dates", icon: "fa-calendar" },
    { value: "today",    label: "Today",     icon: "fa-calendar-day" },
    { value: "tomorrow", label: "Tomorrow",  icon: "fa-calendar-plus" },
    { value: "week",     label: "This Week", icon: "fa-calendar-week" },
]


/* New Appointment modal — patient <select> options */

export const appointmentPatientOptions = [
    "Emma Wilson",
    "Daniel Carter",
    "Olivia Bennett",
    "James Anderson",
]


/* New Appointment modal — type <select> options */

export const appointmentTypeOptions = [
    "General Consultation",
    "Follow-up",
    "Cardiology Review",
    "Routine Check-up",
    "Emergency Consultation",
]


/* New Appointment modal — duration <select> options */

export const appointmentDurationOptions = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "60 minutes" },
]
