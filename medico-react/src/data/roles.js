/*
    Per-role chrome configuration.

    Drives the shared Sidebar, Topbar and ProfileMenu so each
    role renders exactly the markup its original dashboard
    hand-authored:

      - workspace : 2nd breadcrumb segment ("Doctor Workspace")
      - topbar    : "doctor" -> <header> + .doctor-breadcrumb
                    "page"   -> <nav> + .page-title > .page-breadcrumb
      - nav       : sidebar <li> items (label, icon, route, tooltip)
      - profile   : profile trigger + dropdown identity + items

    Routes mirror the original filenames minus ".html".
*/

export const ROLES = {

    doctor: {

        workspace: "Doctor Workspace",

        topbar: "doctor",

        nav: [
            { label: "Dashboard",       icon: "fa-chart-line",     to: "/doctor/dashboard" },
            { label: "Appointments",    icon: "fa-calendar-check", to: "/doctor/appointments" },
            { label: "Consultation",    icon: "fa-stethoscope",    to: "/doctor/consultation" },
            { label: "Patients",        icon: "fa-users",          to: "/doctor/patients" },
            { label: "ICD-10",          icon: "fa-code",           to: "/doctor/icd10" },
            { label: "Investigation",   icon: "fa-microscope",     to: "/doctor/investigation" },
            { label: "Lab Analysis",    icon: "fa-flask",          to: "/doctor/lab-analysis" },
            { label: "Radiology",       icon: "fa-x-ray",          to: "/doctor/radiology-analysis" },
            { label: "Medication AI",   icon: "fa-pills",          to: "/doctor/medication-assistant" },
            { label: "Patient Profile", icon: "fa-id-card",        to: "/doctor/patient-profile" },
            { label: "Reports",         icon: "fa-file-medical",   to: "/doctor/reports" },
            { label: "SOAP Notes",      icon: "fa-notes-medical",  to: "/doctor/soap" },
        ],

        profile: {
            variant: "doctor",
            avatar: "/images/avatar.png",
            name: "Dr. Sarah Mitchell",
            sub: "Cardiology",
            header: {
                name: "Dr. Sarah Mitchell",
                sub: "Cardiology Specialist",
            },
            menu: [
                { icon: "fa-user-doctor",       label: "My Profile", page: "profile" },
                { icon: "fa-gear",              label: "Settings",   page: "settings" },
                { icon: "fa-right-from-bracket", label: "Logout", logout: true },
            ],
        },

    },


    nurse: {

        workspace: "Nurse Workspace",

        topbar: "page",

        nav: [
            { label: "Dashboard",        icon: "fa-house",        to: "/nurse/dashboard",         tooltip: "Dashboard" },
            { label: "Waiting Room",     icon: "fa-clock",        to: "/nurse/waiting-room",      tooltip: "Waiting Room" },
            { label: "Register Patient", icon: "fa-user-plus",    to: "/nurse/register-patient",  tooltip: "Register Patient" },
            { label: "Vitals",           icon: "fa-heart-pulse",  to: "/nurse/vitals",            tooltip: "Vitals" },
            { label: "Patients",         icon: "fa-users",        to: "/nurse/patients",          tooltip: "Patients" },
        ],

        profile: {
            variant: "simple",
            avatar: "/images/avatar.png",
            name: "Sarah",
            header: {
                name: "Sarah",
                sub: "Nurse Account",
            },
            menu: [
                { icon: "fa-user",              label: "My Profile", page: "profile" },
                { icon: "fa-heart-pulse",       label: "My Activity" },
                { icon: "fa-gear",              label: "Settings",   page: "settings" },
                { icon: "fa-right-from-bracket", label: "Logout", logout: true },
            ],
        },

    },


    admin: {

        workspace: "Admin Workspace",

        topbar: "page",

        nav: [
            { label: "Dashboard",  icon: "fa-house",              to: "/admin/dashboard",  tooltip: "Dashboard" },
            { label: "Users",      icon: "fa-users",              to: "/admin/users",      tooltip: "Users" },
            { label: "Audit Logs", icon: "fa-clock-rotate-left",  to: "/admin/audit-logs", tooltip: "Audit Logs" },
        ],

        profile: {
            variant: "simple",
            avatar: "/images/avatar.png",
            name: "Hadi",
            header: {
                name: "Hadi",
                sub: "Administrator Account",
            },
            menu: [
                { icon: "fa-user",              label: "My Profile", page: "profile" },
                { icon: "fa-shield-halved",     label: "Security" },
                { icon: "fa-gear",              label: "Settings",   page: "settings" },
                { icon: "fa-right-from-bracket", label: "Logout", logout: true },
            ],
        },

    },

}


export function getRole(role) {
    return ROLES[role] || null
}
