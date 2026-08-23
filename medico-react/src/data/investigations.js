/*
    Investigation test catalog — seed data for /doctor/investigation.

    Extracted verbatim from the `catalog` array hand-authored in
    assets/js/investigation.js. The catalog panel filters these by
    name or category and groups the matches by `category` (in
    first-appearance order), rendered synchronously for the initial
    view — identical to the original.

    Each entry is { name, category, turnaround }.
*/

export const investigationCatalog = [

    { name: "Complete Blood Count",  category: "Hematology", turnaround: "2 hrs" },
    { name: "ESR",                   category: "Hematology", turnaround: "4 hrs" },
    { name: "Coagulation Profile",   category: "Hematology", turnaround: "3 hrs" },

    { name: "Basic Metabolic Panel", category: "Chemistry",  turnaround: "3 hrs" },
    { name: "Lipid Panel",           category: "Chemistry",  turnaround: "6 hrs" },
    { name: "HbA1c",                 category: "Chemistry",  turnaround: "24 hrs" },
    { name: "Liver Function Test",   category: "Chemistry",  turnaround: "6 hrs" },

    { name: "Troponin I",            category: "Cardiac",    turnaround: "1 hr" },
    { name: "BNP",                   category: "Cardiac",    turnaround: "2 hrs" },

    { name: "Chest X-Ray",           category: "Imaging",    turnaround: "1 hr" },
    { name: "ECG",                   category: "Imaging",    turnaround: "30 min" },

]
