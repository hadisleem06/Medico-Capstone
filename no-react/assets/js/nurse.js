/* =========================================================
   MEDICO
   NURSE JAVASCRIPT
========================================================= */


/* =========================================================
   NURSE NAVIGATION
========================================================= */

const nurseActions = document.querySelectorAll(
    "[data-nurse-action]"
);


nurseActions.forEach(action => {

    action.addEventListener(
        "click",
        () => {

            const destination =
                action.dataset.nurseAction;

            handleNurseAction(destination);

        }
    );

});


function handleNurseAction(action){

    switch(action){

        case "dashboard":

            window.location.href =
                "dashboard.html";

            break;


        case "waiting-room":

            window.location.href =
                "waiting-room.html";

            break;


        case "register-patient":

            window.location.href =
                "register-patient.html";

            break;


        case "vitals":

            window.location.href =
                "vitals.html";

            break;


        case "patients":

            window.location.href =
                "patients.html";

            break;


        default:

            console.warn(
                "Unknown nurse action:",
                action
            );

    }

}


/* =========================================================
   NURSE MESSAGE
========================================================= */

function showNurseMessage(
    message,
    type = "success"
){

    let container =
        document.querySelector(
            ".nurse-message-container"
        );


    if(!container){

        container =
            document.createElement("div");

        container.className =
            "nurse-message-container";

        document.body.appendChild(
            container
        );

    }


    const notification =
        document.createElement("div");


    notification.className =
        `nurse-message ${type}`;


    const icon =
        type === "success"
            ? "fa-circle-check"
            : "fa-circle-exclamation";


    notification.innerHTML = `

        <i class="fa-solid ${icon}"></i>

        <span>
            ${message}
        </span>

    `;


    container.appendChild(
        notification
    );


    requestAnimationFrame(() => {

        notification.classList.add(
            "show"
        );

    });


    setTimeout(() => {

        notification.classList.remove(
            "show"
        );


        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 3000);

}


/* =========================================================
   WAITING ROOM ELEMENTS
========================================================= */

const patientSearch =
    document.querySelector(
        "#patientSearch"
    );


const statusFilter =
    document.querySelector(
        "#statusFilter"
    );


const queuePatients =
    document.querySelectorAll(
        ".queue-patient"
    );


let selectedStatus =
    "all";


/* =========================================================
   WAITING ROOM STATUS FILTER
========================================================= */

if(statusFilter){

    const filterTrigger =
        statusFilter.querySelector(
            ".filter-trigger"
        );


    const filterOptions =
        statusFilter.querySelectorAll(
            ".filter-option"
        );


    if(filterTrigger){

        filterTrigger.addEventListener(
            "click",
            function(event){

                event.stopPropagation();

                statusFilter.classList.toggle(
                    "open"
                );

            }
        );

    }


    filterOptions.forEach(option => {

        option.addEventListener(
            "click",
            function(event){

                event.stopPropagation();


                selectedStatus =
                    this.dataset.value;


                if(filterTrigger){

                    const text =
                        filterTrigger.querySelector(
                            "span"
                        );


                    if(text){

                        text.textContent =
                            this.textContent.trim();

                    }

                }


                filterOptions.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );


                statusFilter.classList.remove(
                    "open"
                );


                filterQueue();

            }
        );

    });


    document.addEventListener(
        "click",
        function(event){

            if(
                !statusFilter.contains(
                    event.target
                )
            ){

                statusFilter.classList.remove(
                    "open"
                );

            }

        }
    );

}


/* =========================================================
   FILTER WAITING ROOM QUEUE
========================================================= */

function filterQueue(){

    const search =
        patientSearch
            ? patientSearch.value
                .toLowerCase()
                .trim()
            : "";


    queuePatients.forEach(patient => {

        const name =
            patient
                .querySelector(
                    ".patient-details h3"
                )
                ?.textContent
                .toLowerCase()
                .trim()
            || "";


        const patientStatus =
            patient.dataset.status;


        const matchesSearch =
            name.includes(search);


        const matchesStatus =
            selectedStatus === "all"
            ||
            patientStatus === selectedStatus;


        if(
            matchesSearch &&
            matchesStatus
        ){

            patient.style.display =
                "";

        }
        else{

            patient.style.display =
                "none";

        }

    });

}


/* =========================================================
   WAITING ROOM SEARCH
========================================================= */

if(patientSearch){

    patientSearch.addEventListener(
        "input",
        filterQueue
    );

}


/* =========================================================
   REFRESH WAITING ROOM
========================================================= */

const refreshQueueBtn =
    document.querySelector(
        "#refreshQueue"
    );


if(refreshQueueBtn){

    refreshQueueBtn.addEventListener(
        "click",
        function(){

            this.classList.add(
                "refreshing"
            );


            filterQueue();


            setTimeout(() => {

                this.classList.remove(
                    "refreshing"
                );


                showNurseMessage(
                    "Queue refreshed successfully.",
                    "success"
                );

            }, 600);

        }
    );

}


/* =========================================================
   CALL PATIENT
========================================================= */

const callButtons =
    document.querySelectorAll(
        ".queue-action.call"
    );


callButtons.forEach(button => {

    button.addEventListener(
        "click",
        function(){

            const patient =
                this.closest(
                    ".queue-patient"
                );


            if(!patient){

                return;

            }


            const patientName =
                patient.querySelector(
                    ".patient-details h3"
                )?.textContent.trim()
                || "Patient";


            patient.dataset.status =
                "called";


            const statusBadge =
                patient.querySelector(
                    ".patient-status"
                );


            if(statusBadge){

                statusBadge.textContent =
                    "Called";


                statusBadge.classList.remove(
                    "waiting-badge",
                    "priority-badge"
                );


                statusBadge.classList.add(
                    "called-badge"
                );

            }


            this.disabled =
                true;


            this.classList.add(
                "disabled"
            );


            this.innerHTML = `
                <i class="fa-solid fa-check"></i>
            `;


            patient.classList.add(
                "patient-called"
            );


            showNurseMessage(
                `${patientName} has been called.`,
                "success"
            );


            filterQueue();

        }
    );

});


/* =========================================================
   TAKE VITALS FROM WAITING ROOM
========================================================= */

const vitalsButtons =
    document.querySelectorAll(
        ".queue-action.vitals"
    );


vitalsButtons.forEach(button => {

    button.addEventListener(
        "click",
        function(){

            const patient =
                this.closest(
                    ".queue-patient"
                );


            if(!patient){

                return;

            }


            const patientId =
                patient.querySelector(
                    ".patient-details p"
                )?.textContent
                .match(/#PT-\d+/)?.[0];


            if(patientId){

                sessionStorage.setItem(
                    "selectedPatient",
                    patientId.replace(
                        "#",
                        ""
                    )
                );

            }


            window.location.href =
                "vitals.html";

        }
    );

});


filterQueue();


/* =========================================================
   REGISTER PATIENT
========================================================= */

const registerPatientForm =
    document.querySelector(
        "#registerPatientForm"
    );


if(registerPatientForm){

    registerPatientForm.addEventListener(
        "submit",
        function(event){

            event.preventDefault();


            const firstName =
                document.querySelector(
                    "#firstName"
                );


            const lastName =
                document.querySelector(
                    "#lastName"
                );


            const dateOfBirth =
                document.querySelector(
                    "#dateOfBirth"
                );


            const gender =
                document.querySelector(
                    "#gender"
                );


            const phone =
                document.querySelector(
                    "#phone"
                );


            const email =
                document.querySelector(
                    "#email"
                );


            let isValid =
                true;


            document
                .querySelectorAll(
                    ".form-group"
                )
                .forEach(group => {

                    group.classList.remove(
                        "has-error"
                    );


                    const error =
                        group.querySelector(
                            ".field-error"
                        );


                    if(error){

                        error.textContent =
                            "";

                    }

                });


            function setError(
                field,
                message
            ){

                const group =
                    field.closest(
                        ".form-group"
                    );


                if(!group){

                    return;

                }


                group.classList.add(
                    "has-error"
                );


                const error =
                    group.querySelector(
                        ".field-error"
                    );


                if(error){

                    error.textContent =
                        message;

                }


                isValid =
                    false;

            }


            if(!firstName.value.trim()){

                setError(
                    firstName,
                    "First name is required."
                );

            }
            else if(
                !/^[A-Za-zÀ-ÿ\s'-]+$/
                    .test(
                        firstName.value.trim()
                    )
            ){

                setError(
                    firstName,
                    "Please enter a valid first name."
                );

            }


            if(!lastName.value.trim()){

                setError(
                    lastName,
                    "Last name is required."
                );

            }
            else if(
                !/^[A-Za-zÀ-ÿ\s'-]+$/
                    .test(
                        lastName.value.trim()
                    )
            ){

                setError(
                    lastName,
                    "Please enter a valid last name."
                );

            }


            if(!dateOfBirth.value){

                setError(
                    dateOfBirth,
                    "Date of birth is required."
                );

            }
            else{

                const selectedDate =
                    new Date(
                        dateOfBirth.value
                    );


                const today =
                    new Date();


                today.setHours(
                    0,
                    0,
                    0,
                    0
                );


                if(
                    selectedDate >
                    today
                ){

                    setError(
                        dateOfBirth,
                        "Date of birth cannot be in the future."
                    );

                }

            }


            if(!gender.value){

                setError(
                    gender,
                    "Please select a gender."
                );

            }


            const phoneValue =
                phone.value.trim();


            if(!phoneValue){

                setError(
                    phone,
                    "Phone number is required."
                );

            }
            else if(
                !/^\+?[0-9\s()-]{8,20}$/
                    .test(
                        phoneValue
                    )
            ){

                setError(
                    phone,
                    "Please enter a valid phone number."
                );

            }


            const emailValue =
                email.value.trim();


            if(
                emailValue &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(
                        emailValue
                    )
            ){

                setError(
                    email,
                    "Please enter a valid email address."
                );

            }


            if(!isValid){

                const firstError =
                    registerPatientForm
                        .querySelector(
                            ".has-error input, .has-error select"
                        );


                if(firstError){

                    firstError.focus();

                }


                showNurseMessage(
                    "Please correct the highlighted fields.",
                    "error"
                );


                return;

            }


            const patientId =
                "PT-" +
                Math.floor(
                    1000 +
                    Math.random() * 9000
                );


            showNurseMessage(
                `${firstName.value.trim()} ${lastName.value.trim()} registered successfully. Patient ID: #${patientId}`,
                "success"
            );


            registerPatientForm.reset();


            document
                .querySelectorAll(
                    ".form-group"
                )
                .forEach(group => {

                    group.classList.remove(
                        "has-error"
                    );


                    const error =
                        group.querySelector(
                            ".field-error"
                        );


                    if(error){

                        error.textContent =
                            "";

                    }

                });

        }
    );

}


/* =========================================================
   REGISTER FORM LIVE VALIDATION
========================================================= */

if(registerPatientForm){

    const formInputs =
        registerPatientForm.querySelectorAll(
            "input, select, textarea"
        );


    formInputs.forEach(input => {

        function clearFieldError(){

            const group =
                this.closest(
                    ".form-group"
                );


            if(!group){

                return;

            }


            group.classList.remove(
                "has-error"
            );


            const error =
                group.querySelector(
                    ".field-error"
                );


            if(error){

                error.textContent =
                    "";

            }

        }


        input.addEventListener(
            "input",
            clearFieldError
        );


        input.addEventListener(
            "change",
            clearFieldError
        );

    });

}


/* =========================================================
   VITALS PAGE
========================================================= */

const vitalsPatient =
    document.querySelector(
        "#vitalsPatient"
    );


const vitalsPatientDropdown =
    document.querySelector(
        "#vitalsPatientDropdown"
    );


const vitalsPatientTrigger =
    document.querySelector(
        "#vitalsPatientTrigger"
    );


const selectedPatient =
    document.querySelector(
        "#selectedPatient"
    );


const vitalsForm =
    document.querySelector(
        "#vitalsForm"
    );


const heightInput =
    document.querySelector(
        "#height"
    );


const weightInput =
    document.querySelector(
        "#weight"
    );


const bmiValue =
    document.querySelector(
        "#bmiValue"
    );


const bmiStatus =
    document.querySelector(
        "#bmiStatus"
    );


const clearVitalsBtn =
    document.querySelector(
        "#clearVitals"
    );


/* =========================================================
   VITALS PATIENT DATA
========================================================= */

const vitalsPatients = {

    "PT-1024": {

        name:
            "Ahmad Mansour",

        initials:
            "AM",

        id:
            "PT-1024",

        age:
            "34 years"

    },


    "PT-1087": {

        name:
            "Lina Nassar",

        initials:
            "LN",

        id:
            "PT-1087",

        age:
            "27 years"

    },


    "PT-1092": {

        name:
            "Joseph Khoury",

        initials:
            "JK",

        id:
            "PT-1092",

        age:
            "41 years"

    },


    "PT-1101": {

        name:
            "Rami Haddad",

        initials:
            "RH",

        id:
            "PT-1101",

        age:
            "52 years"

    },


    "PT-1110": {

        name:
            "Sara Nehme",

        initials:
            "SN",

        id:
            "PT-1110",

        age:
            "29 years"

    }

};


/* =========================================================
   RESET SELECTED PATIENT
========================================================= */

function resetSelectedPatient(){

    if(!selectedPatient){

        return;

    }


    selectedPatient.classList.remove(
        "active"
    );


    selectedPatient.innerHTML = `

        <div class="patient-avatar">
            --
        </div>

        <div class="patient-details">

            <h3>
                No patient selected
            </h3>

            <p>
                Select a patient to begin recording vitals.
            </p>

        </div>

        <div class="patient-meta">

            <span>
                Patient ID
            </span>

            <strong>
                --
            </strong>

        </div>

    `;

}


/* =========================================================
   DISPLAY SELECTED PATIENT
========================================================= */

function displaySelectedPatient(
    patient
){

    if(!selectedPatient){

        return;

    }


    selectedPatient.classList.add(
        "active"
    );


    selectedPatient.innerHTML = `

        <div class="patient-avatar">
            ${patient.initials}
        </div>

        <div class="patient-details">

            <h3>
                ${patient.name}
            </h3>

            <p>
                ${patient.age} · Ready for vitals
            </p>

        </div>

        <div class="patient-meta">

            <span>
                Patient ID
            </span>

            <strong>
                ${patient.id}
            </strong>

        </div>

    `;

}


/* =========================================================
   VITALS CUSTOM PATIENT DROPDOWN
========================================================= */

if(
    vitalsPatientDropdown &&
    vitalsPatientTrigger &&
    vitalsPatient
){

    const filterOptions =
        vitalsPatientDropdown.querySelectorAll(
            ".filter-option"
        );


    vitalsPatientTrigger.addEventListener(
        "click",
        function(event){

            event.stopPropagation();


            vitalsPatientDropdown.classList.toggle(
                "open"
            );

        }
    );


    filterOptions.forEach(option => {

        option.addEventListener(
            "click",
            function(event){

                event.stopPropagation();


                const value =
                    this.dataset.value || "";


                vitalsPatient.value =
                    value;


                const triggerText =
                    vitalsPatientTrigger.querySelector(
                        "span"
                    );


                if(triggerText){

                    triggerText.textContent =
                        this.textContent.trim();

                }


                filterOptions.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );


                vitalsPatientDropdown.classList.remove(
                    "open"
                );


                const patient =
                    vitalsPatients[value];


                if(patient){

                    displaySelectedPatient(
                        patient
                    );

                }
                else{

                    resetSelectedPatient();

                }


                const status =
                    document.querySelector(
                        ".vitals-status"
                    );


                if(status){

                    status.innerHTML = `

                        <span class="live-dot"></span>

                        Ready to Record

                    `;

                }

            }
        );

    });


    document.addEventListener(
        "click",
        function(event){

            if(
                !vitalsPatientDropdown.contains(
                    event.target
                )
            ){

                vitalsPatientDropdown.classList.remove(
                    "open"
                );

            }

        }
    );


    const storedPatient =
        sessionStorage.getItem(
            "selectedPatient"
        );


    if(
        storedPatient &&
        vitalsPatients[storedPatient]
    ){

        vitalsPatient.value =
            storedPatient;


        const storedOption =
            vitalsPatientDropdown.querySelector(
                `.filter-option[data-value="${storedPatient}"]`
            );


        if(storedOption){

            const triggerText =
                vitalsPatientTrigger.querySelector(
                    "span"
                );


            if(triggerText){

                triggerText.textContent =
                    storedOption.textContent.trim();

            }


            filterOptions.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            storedOption.classList.add(
                "active"
            );

        }


        displaySelectedPatient(
            vitalsPatients[
                storedPatient
            ]
        );


        sessionStorage.removeItem(
            "selectedPatient"
        );

    }

}


/* =========================================================
   BMI CALCULATOR
========================================================= */

function calculateBMI(){

    if(
        !heightInput ||
        !weightInput
    ){

        return;

    }


    const height =
        parseFloat(
            heightInput.value
        );


    const weight =
        parseFloat(
            weightInput.value
        );


    if(
        !height ||
        !weight ||
        height <= 0 ||
        weight <= 0
    ){

        if(bmiValue){

            bmiValue.textContent =
                "--";

        }


        if(bmiStatus){

            bmiStatus.textContent =
                "Waiting for height and weight";

        }


        return;

    }


    const heightMeters =
        height / 100;


    const bmi =
        weight /
        (
            heightMeters *
            heightMeters
        );


    if(bmiValue){

        bmiValue.textContent =
            bmi.toFixed(1);

    }


    if(!bmiStatus){

        return;

    }


    if(bmi < 18.5){

        bmiStatus.textContent =
            "Underweight";

    }

    else if(bmi < 25){

        bmiStatus.textContent =
            "Normal weight";

    }

    else if(bmi < 30){

        bmiStatus.textContent =
            "Overweight";

    }

    else{

        bmiStatus.textContent =
            "Obesity";

    }

}


if(heightInput){

    heightInput.addEventListener(
        "input",
        calculateBMI
    );

}


if(weightInput){

    weightInput.addEventListener(
        "input",
        calculateBMI
    );

}


/* =========================================================
   SAVE VITALS
========================================================= */

if(vitalsForm){

    vitalsForm.addEventListener(
        "submit",
        function(event){

            event.preventDefault();


            if(
                !vitalsPatient ||
                !vitalsPatient.value
            ){

                showNurseMessage(
                    "Please select a patient first.",
                    "error"
                );


                return;

            }


            const systolic =
                document.querySelector(
                    "#systolic"
                )?.value;


            const diastolic =
                document.querySelector(
                    "#diastolic"
                )?.value;


            const heartRate =
                document.querySelector(
                    "#heartRate"
                )?.value;


            const temperature =
                document.querySelector(
                    "#temperature"
                )?.value;


            const oxygen =
                document.querySelector(
                    "#oxygen"
                )?.value;


            const respiratoryRate =
                document.querySelector(
                    "#respiratoryRate"
                )?.value;


            const weight =
                document.querySelector(
                    "#weight"
                )?.value;


            const height =
                document.querySelector(
                    "#height"
                )?.value;


            if(
                !systolic ||
                !diastolic ||
                !heartRate ||
                !temperature ||
                !oxygen ||
                !respiratoryRate ||
                !weight ||
                !height
            ){

                showNurseMessage(
                    "Please complete all vital measurements.",
                    "error"
                );


                return;

            }


            const patient =
                vitalsPatients[
                    vitalsPatient.value
                ];


            if(!patient){

                showNurseMessage(
                    "Selected patient could not be found.",
                    "error"
                );


                return;

            }


            const vitalsData = {

                patientId:
                    patient.id,

                patientName:
                    patient.name,

                bloodPressure:
                    `${systolic}/${diastolic}`,

                heartRate:
                    heartRate,

                temperature:
                    temperature,

                oxygen:
                    oxygen,

                respiratoryRate:
                    respiratoryRate,

                weight:
                    weight,

                height:
                    height,

                bmi:
                    bmiValue?.textContent
                    || "--",

                notes:
                    document.querySelector(
                        "#vitalsNotes"
                    )?.value
                    || "",

                savedAt:
                    new Date().toISOString()

            };


            console.log(
                "Vitals saved:",
                vitalsData
            );


            showNurseMessage(
                `Vitals saved successfully for ${patient.name}.`,
                "success"
            );


            const status =
                document.querySelector(
                    ".vitals-status"
                );


            if(status){

                status.innerHTML = `

                    <span class="live-dot"></span>

                    Vitals Saved

                `;

            }

        }
    );

}


/* =========================================================
   CLEAR VITALS
========================================================= */

if(clearVitalsBtn){

    clearVitalsBtn.addEventListener(
        "click",
        function(){

            setTimeout(() => {

                if(vitalsPatient){

                    vitalsPatient.value =
                        "";

                }


                if(vitalsPatientTrigger){

                    const triggerText =
                        vitalsPatientTrigger.querySelector(
                            "span"
                        );


                    if(triggerText){

                        triggerText.textContent =
                            "Select a patient...";

                    }

                }


                if(vitalsPatientDropdown){

                    vitalsPatientDropdown
                        .querySelectorAll(
                            ".filter-option"
                        )
                        .forEach(option => {

                            option.classList.remove(
                                "active"
                            );

                        });


                    const defaultOption =
                        vitalsPatientDropdown.querySelector(
                            '.filter-option[data-value=""]'
                        );


                    if(defaultOption){

                        defaultOption.classList.add(
                            "active"
                        );

                    }

                }


                resetSelectedPatient();


                calculateBMI();


                const status =
                    document.querySelector(
                        ".vitals-status"
                    );


                if(status){

                    status.innerHTML = `

                        <span class="live-dot"></span>

                        Ready to Record

                    `;

                }


                showNurseMessage(
                    "Vitals form cleared.",
                    "success"
                );

            }, 0);

        }
    );

}


/* =========================================================
   PATIENTS PAGE
========================================================= */

const patientsSearch =
    document.querySelector(
        "#patientsSearch"
    );


const patientsFilter =
    document.querySelector(
        "#patientsFilter"
    );


const patientsFilterTrigger =
    document.querySelector(
        "#patientsFilterTrigger"
    );


const patientsList =
    document.querySelector(
        "#patientsList"
    );


const patientsEmpty =
    document.querySelector(
        "#patientsEmpty"
    );


const refreshPatientsBtn =
    document.querySelector(
        "#refreshPatients"
    );


let selectedPatientGender =
    "all";


/* =========================================================
   PATIENTS FILTER DROPDOWN
========================================================= */

if(
    patientsFilter &&
    patientsFilterTrigger
){

    const filterOptions =
        patientsFilter.querySelectorAll(
            ".filter-option"
        );


    patientsFilterTrigger.addEventListener(
        "click",
        function(event){

            event.stopPropagation();


            patientsFilter.classList.toggle(
                "open"
            );

        }
    );


    filterOptions.forEach(option => {

        option.addEventListener(
            "click",
            function(event){

                event.stopPropagation();


                selectedPatientGender =
                    this.dataset.value;


                const triggerText =
                    patientsFilterTrigger.querySelector(
                        "span"
                    );


                if(triggerText){

                    triggerText.textContent =
                        this.textContent.trim();

                }


                filterOptions.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );


                patientsFilter.classList.remove(
                    "open"
                );


                filterPatients();

            }
        );

    });


    document.addEventListener(
        "click",
        function(event){

            if(
                !patientsFilter.contains(
                    event.target
                )
            ){

                patientsFilter.classList.remove(
                    "open"
                );

            }

        }
    );

}


/* =========================================================
   FILTER PATIENTS
========================================================= */

function filterPatients(){

    if(!patientsList){

        return;

    }


    const search =
        patientsSearch
            ? patientsSearch.value
                .toLowerCase()
                .trim()
            : "";


    const patientRows =
        patientsList.querySelectorAll(
            ".patient-row"
        );


    let visibleCount =
        0;


    patientRows.forEach(row => {

        const name =
            row.querySelector(
                ".patient-row-info h3"
            )?.textContent
            .toLowerCase()
            .trim()
            || "";


        const patientId =
            row.dataset.patientId
            ?.toLowerCase()
            || "";


        const gender =
            row.dataset.gender
            ?.toLowerCase()
            || "";


        const matchesSearch =
            name.includes(search)
            ||
            patientId.includes(search);


        const matchesGender =
            selectedPatientGender === "all"
            ||
            gender === selectedPatientGender;


        if(
            matchesSearch &&
            matchesGender
        ){

            row.style.display =
                "";


            visibleCount++;

        }
        else{

            row.style.display =
                "none";

        }

    });


    if(patientsEmpty){

        patientsEmpty.style.display =
            visibleCount === 0
                ? "block"
                : "none";

    }


    updatePatientsCount(
        visibleCount
    );

}


/* =========================================================
   PATIENTS COUNT
========================================================= */

function updatePatientsCount(
    count
){

    const countElement =
        document.querySelector(
            ".patients-count span"
        );


    if(!countElement){

        return;

    }


    countElement.textContent =
        `${count} ${count === 1 ? "Patient" : "Patients"}`;

}


/* =========================================================
   PATIENT SEARCH
========================================================= */

if(patientsSearch){

    patientsSearch.addEventListener(
        "input",
        filterPatients
    );

}


/* =========================================================
   REFRESH PATIENTS
========================================================= */

if(refreshPatientsBtn){

    refreshPatientsBtn.addEventListener(
        "click",
        function(){

            this.classList.add(
                "refreshing"
            );


            filterPatients();


            setTimeout(() => {

                this.classList.remove(
                    "refreshing"
                );


                showNurseMessage(
                    "Patients list refreshed successfully.",
                    "success"
                );

            }, 600);

        }
    );

}


/* =========================================================
   VIEW PATIENT
========================================================= */

const viewPatientButtons =
    document.querySelectorAll(
        ".view-patient"
    );


viewPatientButtons.forEach(button => {

    button.addEventListener(
        "click",
        function(){

            const patientId =
                this.dataset.patient;


            if(!patientId){

                return;

            }


            const patient =
                vitalsPatients[
                    patientId
                ];


            if(patient){

                showNurseMessage(
                    `${patient.name} — #${patient.id}`,
                    "success"
                );

            }
            else{

                showNurseMessage(
                    "Patient information could not be found.",
                    "error"
                );

            }

        }
    );

});


/* =========================================================
   TAKE VITALS FROM PATIENTS PAGE
========================================================= */

const patientVitalsButtons =
    document.querySelectorAll(
        ".take-vitals"
    );


patientVitalsButtons.forEach(button => {

    button.addEventListener(
        "click",
        function(){

            const patientId =
                this.dataset.patient;


            if(!patientId){

                return;

            }


            if(
                vitalsPatients[
                    patientId
                ]
            ){

                sessionStorage.setItem(
                    "selectedPatient",
                    patientId
                );


                window.location.href =
                    "vitals.html";

            }

        }
    );

});


/* =========================================================
   INITIAL PATIENT FILTER
========================================================= */

filterPatients();