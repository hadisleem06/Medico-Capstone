// =================================
// Medico Register Validation
// =================================


const registerForm = document.getElementById("registerForm");


const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");

const phoneInput = document.getElementById("phone");

const passwordInput = document.getElementById("password");

const confirmPasswordInput = document.getElementById("confirmPassword");





registerForm.addEventListener("submit", function(e){


    e.preventDefault();



    removeErrors();



    let valid = true;



    const name = nameInput.value.trim();

    const email = emailInput.value.trim();

    const phone = phoneInput.value.trim();

    const password = passwordInput.value.trim();

    const confirmPassword = confirmPasswordInput.value.trim();



    const role =
    document.querySelector('input[name="role"]:checked');





    // NAME


    if(name === ""){


        showError(
            nameInput,
            "Full name is required"
        );


        valid=false;

    }

    else if(name.length < 3){


        showError(
            nameInput,
            "Name must contain at least 3 characters"
        );


        valid=false;

    }




    // EMAIL


    if(email === ""){


        showError(
            emailInput,
            "Email is required"
        );


        valid=false;


    }

    else if(!validateEmail(email)){


        showError(
            emailInput,
            "Please enter a valid email address"
        );


        valid=false;

    }






    // PHONE


    if(phone === ""){


        showError(
            phoneInput,
            "Phone number is required"
        );


        valid=false;


    }

    else if(!validatePhone(phone)){


        showError(
            phoneInput,
            "Please enter a valid phone number"
        );


        valid=false;


    }







    // PASSWORD


    if(password === ""){


        showError(
            passwordInput,
            "Password is required"
        );


        valid=false;


    }

    else if(password.length < 6){


        showError(
            passwordInput,
            "Password must be at least 6 characters"
        );


        valid=false;


    }






    // CONFIRM PASSWORD


    if(confirmPassword === ""){


        showError(
            confirmPasswordInput,
            "Please confirm your password"
        );


        valid=false;


    }

    else if(password !== confirmPassword){


        showError(
            confirmPasswordInput,
            "Passwords do not match"
        );


        valid=false;


    }






    // ROLE


    if(!role){


        showRoleError();


        valid=false;


    }





    if(valid){


        alert("Account created successfully");


        // Later:
        // send data to Laravel backend


    }



});






// ===============================
// Email Checker
// ===============================


function validateEmail(email){


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


}





// ===============================
// Phone Checker
// ===============================


function validatePhone(phone){


    return /^[0-9+\-\s]{8,15}$/.test(phone);


}





// ===============================
// Show Error
// ===============================


function showError(input,message){


    const field =
    input.closest(".field");



    input.classList.add("error");



    const error =
    document.createElement("div");



    error.className="error-message";


    error.innerText=message;



    field.appendChild(error);


}






// ===============================
// Role Error
// ===============================


function showRoleError(){


    const roleBox =
    document.querySelector(".role-selection");



    const error =
    document.createElement("div");



    error.className="error-message";


    error.innerText="Please select your account type";



    roleBox.appendChild(error);


}






// ===============================
// Remove Errors
// ===============================


function removeErrors(){



    document
    .querySelectorAll(".error-message")
    .forEach(error=>error.remove());



    document
    .querySelectorAll(".error")
    .forEach(input=>input.classList.remove("error"));



}