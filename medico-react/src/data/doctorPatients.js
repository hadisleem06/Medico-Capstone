/*
    Doctor patient directory — seed data for /doctor/patients.

    Mirrors the hardcoded .patient-card list the original
    pages/doctor/patients.html hand-authored. Read synchronously
    for the initial render; a backend list() would replace this.

    Fields:
      name, initials, avatarClass   - card header + avatar tint
      risk, riskLabel               - risk pill (class + text)
      status                        - filter bucket (active / followup / discharged)
      meta                          - "age · sex" sub-line
      condition, conditionIcon      - primary condition + icon
      lastVisit                     - last-visit date label
      mrn                           - medical record number
*/

export const doctorPatients = [

    {
        name: "Amelia Morgan",
        initials: "AM",
        avatarClass: "avatar-teal",
        risk: "stable",
        riskLabel: "Stable",
        status: "active",
        meta: "34 yrs · Female",
        condition: "Hypertension",
        conditionIcon: "fa-heart-pulse",
        lastVisit: "Aug 12",
        mrn: "#10241",
    },

    {
        name: "James Miller",
        initials: "JM",
        avatarClass: "avatar-purple",
        risk: "moderate",
        riskLabel: "Moderate",
        status: "active",
        meta: "52 yrs · Male",
        condition: "Chest pain",
        conditionIcon: "fa-heart-circle-bolt",
        lastVisit: "Aug 14",
        mrn: "#10255",
    },

    {
        name: "Robert Brooks",
        initials: "RB",
        avatarClass: "avatar-pink",
        risk: "high",
        riskLabel: "High",
        status: "active",
        meta: "61 yrs · Male",
        condition: "Cardiac monitoring",
        conditionIcon: "fa-wave-square",
        lastVisit: "Aug 16",
        mrn: "#10188",
    },

    {
        name: "Olivia Lewis",
        initials: "OL",
        avatarClass: "avatar-blue",
        risk: "stable",
        riskLabel: "Stable",
        status: "followup",
        meta: "41 yrs · Female",
        condition: "Arrhythmia",
        conditionIcon: "fa-heart-pulse",
        lastVisit: "Aug 09",
        mrn: "#10203",
    },

    {
        name: "Daniel Carter",
        initials: "DC",
        avatarClass: "avatar-orange",
        risk: "moderate",
        riskLabel: "Moderate",
        status: "followup",
        meta: "57 yrs · Male",
        condition: "Blood pressure",
        conditionIcon: "fa-droplet",
        lastVisit: "Aug 05",
        mrn: "#10161",
    },

    {
        name: "Emma Wilson",
        initials: "EW",
        avatarClass: "avatar-teal",
        risk: "stable",
        riskLabel: "Stable",
        status: "active",
        meta: "34 yrs · Female",
        condition: "Cardiology follow-up",
        conditionIcon: "fa-heart-pulse",
        lastVisit: "Aug 15",
        mrn: "#10298",
    },

    {
        name: "Sophia Turner",
        initials: "ST",
        avatarClass: "avatar-purple",
        risk: "high",
        riskLabel: "High",
        status: "active",
        meta: "68 yrs · Female",
        condition: "Heart failure",
        conditionIcon: "fa-heart-circle-exclamation",
        lastVisit: "Aug 17",
        mrn: "#10102",
    },

    {
        name: "Noah Bennett",
        initials: "NB",
        avatarClass: "avatar-blue",
        risk: "stable",
        riskLabel: "Stable",
        status: "discharged",
        meta: "45 yrs · Male",
        condition: "Post-op review",
        conditionIcon: "fa-stethoscope",
        lastVisit: "Jul 28",
        mrn: "#10077",
    },

]


/* risk filter options (id="patientRiskFilter") */

export const patientRiskOptions = [
    { value: "",         label: "All Risk", icon: "fa-layer-group" },
    { value: "high",     label: "High",     icon: "fa-triangle-exclamation" },
    { value: "moderate", label: "Moderate", icon: "fa-circle-half-stroke" },
    { value: "stable",   label: "Stable",   icon: "fa-circle-check" },
]


/* status filter options (id="patientStatusFilter") */

export const patientStatusOptions = [
    { value: "",           label: "All Status", icon: "fa-layer-group" },
    { value: "active",     label: "Active",     icon: "fa-circle-check" },
    { value: "followup",   label: "Follow-up",  icon: "fa-clock-rotate-left" },
    { value: "discharged", label: "Discharged", icon: "fa-door-open" },
]
