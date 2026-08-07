// ===============================
// Medico Login Validation
// ===============================


const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");



loginForm.addEventListener("submit", function(e){


    e.preventDefault();


    removeErrors();


    let email = emailInput.value.trim();

    let password = passwordInput.value.trim();



    let valid = true;



    // EMAIL CHECK

    if(email === ""){


        showError(emailInput, "Email is required");

        valid = false;


    }

    else if(!isValidEmail(email)){


        showError(
            emailInput,
            "Please enter a valid email address"
        );


        valid = false;


    }




    // PASSWORD CHECK

    if(password === ""){


        showError(
            passwordInput,
            "Password is required"
        );


        valid = false;


    }


    else if(password.length < 6){


        showError(
            passwordInput,
            "Password must be at least 6 characters"
        );


        valid = false;


    }




    if(valid){


        alert("Login successful");


    }



});




// EMAIL REGEX

function isValidEmail(email){


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


}




// SHOW ERROR

function showError(input,message){


    const box = input.closest(".field");


    input.classList.add("error");


    const error = document.createElement("div");


    error.className="error-message";


    error.innerText = message;


    box.appendChild(error);



}




// REMOVE ERROR

function removeErrors(){


    document
    .querySelectorAll(".error-message")
    .forEach(e=>e.remove());



    document
    .querySelectorAll(".error")
    .forEach(e=>e.classList.remove("error"));

}