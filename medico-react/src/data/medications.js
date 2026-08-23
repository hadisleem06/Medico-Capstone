/*
    Medication formulary — seed data for /doctor/medication-assistant.

    Extracted verbatim from the `formulary` array hand-authored in
    assets/js/medication.js. The drug-search panel filters these by
    name or class and renders them synchronously, identical to the
    original.

    Each entry is { name, drugClass, dose }.
*/

export const medicationFormulary = [

    { name: "Atorvastatin", drugClass: "Statin",          dose: "20 mg once daily" },
    { name: "Lisinopril",   drugClass: "ACE inhibitor",   dose: "10 mg once daily" },
    { name: "Metformin",    drugClass: "Biguanide",       dose: "500 mg twice daily" },
    { name: "Amlodipine",   drugClass: "Calcium blocker", dose: "5 mg once daily" },
    { name: "Aspirin",      drugClass: "Antiplatelet",    dose: "81 mg once daily" },
    { name: "Metoprolol",   drugClass: "Beta blocker",    dose: "50 mg twice daily" },
    { name: "Warfarin",     drugClass: "Anticoagulant",   dose: "5 mg once daily" },
    { name: "Omeprazole",   drugClass: "PPI",             dose: "20 mg once daily" },

]
