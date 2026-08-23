/*
    Clinical reports — seed data for /doctor/reports.

    Extracted verbatim from the 6 hand-authored .report-card articles
    in pages/doctor/reports.html plus the filter option lists. The
    library renders from this array exactly like the original static
    markup: the search matches `title` (the original data-title), and
    the type / status filters match `type` / `status`.

    Each report is:
      title      - lower-cased search key (the original data-title)
      name       - the card heading (.report-card-body strong)
      patient    - patient name in the sub-line
      date       - date label in the sub-line
      type       - filter bucket (consultation / lab / radiology / discharge)
      typeLabel  - the .report-card-type text
      tint       - icon colour (teal / blue / purple / orange)
      icon       - Font Awesome glyph
      status     - status bucket (final / pending / draft)
*/

export const doctorReports = [

    {
        title: "consultation summary amelia morgan",
        name: "Consultation Summary",
        patient: "Amelia Morgan",
        date: "Aug 16, 2026",
        type: "consultation",
        typeLabel: "Consultation",
        tint: "teal",
        icon: "fa-stethoscope",
        status: "final",
    },

    {
        title: "lipid panel report james carter",
        name: "Lipid Panel Report",
        patient: "James Carter",
        date: "Aug 15, 2026",
        type: "lab",
        typeLabel: "Lab",
        tint: "blue",
        icon: "fa-vials",
        status: "final",
    },

    {
        title: "chest x-ray report sophia chen",
        name: "Chest X-Ray Report",
        patient: "Sophia Chen",
        date: "Aug 15, 2026",
        type: "radiology",
        typeLabel: "Radiology",
        tint: "purple",
        icon: "fa-x-ray",
        status: "pending",
    },

    {
        title: "discharge summary liam patel",
        name: "Discharge Summary",
        patient: "Liam Patel",
        date: "Aug 14, 2026",
        type: "discharge",
        typeLabel: "Discharge",
        tint: "orange",
        icon: "fa-file-arrow-down",
        status: "draft",
    },

    {
        title: "consultation summary olivia brooks",
        name: "Consultation Summary",
        patient: "Olivia Brooks",
        date: "Aug 13, 2026",
        type: "consultation",
        typeLabel: "Consultation",
        tint: "teal",
        icon: "fa-stethoscope",
        status: "final",
    },

    {
        title: "echocardiogram report noah davis",
        name: "Echocardiogram Report",
        patient: "Noah Davis",
        date: "Aug 12, 2026",
        type: "radiology",
        typeLabel: "Radiology",
        tint: "purple",
        icon: "fa-x-ray",
        status: "pending",
    },

]


/* status badge skin per report status (class = the status value) */

export const reportStatusBadge = {
    final:   { icon: "fa-circle-check", label: "Final" },
    pending: { icon: "fa-clock",        label: "Pending" },
    draft:   { icon: "fa-pen",          label: "Draft" },
}


/* type filter options (id="reportTypeFilter") */

export const reportTypeOptions = [
    { value: "",             label: "All Types",    icon: "fa-layer-group" },
    { value: "consultation", label: "Consultation", icon: "fa-stethoscope" },
    { value: "lab",          label: "Lab",          icon: "fa-vials" },
    { value: "radiology",    label: "Radiology",    icon: "fa-x-ray" },
    { value: "discharge",    label: "Discharge",    icon: "fa-file-arrow-down" },
]


/* status filter options (id="reportStatusFilter") */

export const reportStatusOptions = [
    { value: "",        label: "All Status", icon: "fa-layer-group" },
    { value: "final",   label: "Final",      icon: "fa-circle-check" },
    { value: "pending", label: "Pending",    icon: "fa-clock" },
    { value: "draft",   label: "Draft",      icon: "fa-pen" },
]
