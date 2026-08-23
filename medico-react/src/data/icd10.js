/*
    ICD-10 code seed data.

    Extracted verbatim from the mock dataset hand-authored in
    assets/js/icd10.js (the `codes` array). The search results
    are rendered from this array, identical to the original,
    which read it synchronously for the initial render (no
    loading state). Each entry is { code, label } — the source
    dataset had no categories or other fields.
*/

export const icd10Codes = [

    { code: "I10",     label: "Essential (primary) hypertension" },
    { code: "I25.10",  label: "Atherosclerotic heart disease" },
    { code: "I48.91",  label: "Atrial fibrillation, unspecified" },
    { code: "I50.9",   label: "Heart failure, unspecified" },
    { code: "E11.9",   label: "Type 2 diabetes without complications" },
    { code: "E78.5",   label: "Hyperlipidemia, unspecified" },
    { code: "R07.9",   label: "Chest pain, unspecified" },
    { code: "R00.2",   label: "Palpitations" },
    { code: "J45.909", label: "Unspecified asthma, uncomplicated" },
    { code: "N18.3",   label: "Chronic kidney disease, stage 3" },

]
