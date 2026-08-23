/*
    Nurse mock data.

    Ports the hardcoded patient data spread across the nurse
    pages + assets/js/nurse.js:

      - nursePatients        : the 5 registered patients (patients
                               page rows + lookups)
      - vitalsPatients       : id -> patient map (nurse.js
                               `vitalsPatients`; drives the vitals
                               selector + the patients-page view toast)
      - vitalsPatientOptions : options for the vitals CustomFilter
                               (leading "Select a patient..." then one
                               per patient, "Name — #PT-xxxx")
      - waitingQueue         : the 5 live-queue rows on the waiting room

    The dashboard's "Today's Patients" / mini-patients use a
    different, purely-static mock set (MC-xxxx) and stay inline in
    Dashboard.jsx, exactly as authored.

    Note: on the waiting room the row for Rami Haddad shows the
    avatar "RM", while on the patients page + vitals the same
    patient shows "RH" — an original inconsistency preserved
    per-page (waitingQueue uses "RM", nursePatients uses "RH").
*/


export const nursePatients = [

    {
        id: "PT-1024",
        name: "Ahmad Mansour",
        initials: "AM",
        age: "34 years",
        gender: "male",
        genderLabel: "Male",
    },

    {
        id: "PT-1087",
        name: "Lina Nassar",
        initials: "LN",
        age: "27 years",
        gender: "female",
        genderLabel: "Female",
    },

    {
        id: "PT-1092",
        name: "Joseph Khoury",
        initials: "JK",
        age: "41 years",
        gender: "male",
        genderLabel: "Male",
    },

    {
        id: "PT-1101",
        name: "Rami Haddad",
        initials: "RH",
        age: "52 years",
        gender: "male",
        genderLabel: "Male",
    },

    {
        id: "PT-1110",
        name: "Sara Nehme",
        initials: "SN",
        age: "29 years",
        gender: "female",
        genderLabel: "Female",
    },

]


/* id -> { name, initials, id, age } (ports nurse.js vitalsPatients) */

export const vitalsPatients =
    nursePatients.reduce(
        (map, patient) => {

            map[patient.id] = {
                name: patient.name,
                initials: patient.initials,
                id: patient.id,
                age: patient.age,
            }

            return map

        },
        {}
    )


/* vitals selector options (leading placeholder + one per patient) */

export const vitalsPatientOptions = [

    {
        value: "",
        label: "Select a patient...",
    },

    ...nursePatients.map(patient => ({
        value: patient.id,
        label: `${patient.name} — #${patient.id}`,
    })),

]


/* live queue rows (ports the 5 .queue-patient nodes) */

export const waitingQueue = [

    {
        number: "01",
        id: "PT-1024",
        initials: "AM",
        name: "Ahmad Mansour",
        meta: "#PT-1024 · 34 years",
        doctor: "Dr. Sarah Mitchell",
        time: "18 min",
        status: "priority",
    },

    {
        number: "02",
        id: "PT-1087",
        initials: "LN",
        name: "Lina Nassar",
        meta: "#PT-1087 · 27 years",
        doctor: "Dr. Michael Reed",
        time: "11 min",
        status: "waiting",
    },

    {
        number: "03",
        id: "PT-1092",
        initials: "JK",
        name: "Joseph Khoury",
        meta: "#PT-1092 · 41 years",
        doctor: "Dr. Sarah Mitchell",
        time: "8 min",
        status: "waiting",
    },

    {
        number: "04",
        id: "PT-1101",
        initials: "RM",
        name: "Rami Haddad",
        meta: "#PT-1101 · 52 years",
        doctor: "Dr. Michael Reed",
        time: "5 min",
        status: "called",
    },

    {
        number: "05",
        id: "PT-1110",
        initials: "SN",
        name: "Sara Nehme",
        meta: "#PT-1110 · 29 years",
        doctor: "Dr. Sarah Mitchell",
        time: "3 min",
        status: "waiting",
    },

]
