/*====================================
        COUNTER ANIMATION
====================================*/

const counters = document.querySelectorAll(".counter");


counters.forEach(counter=>{


    const target = +counter.dataset.target;

    let count = 0;

    const speed = target / 45;


    const update = ()=>{


        count += speed;


        if(count < target){


            counter.innerText = Math.ceil(count);


            requestAnimationFrame(update);


        }

        else{


            counter.innerText = target;


        }


    };


    update();


});







/*====================================
        SIDEBAR TOGGLE
====================================*/

const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".sidebar-toggle");
const main = document.querySelector(".main-content");
const toggleIcon = toggleBtn.querySelector("i");


toggleBtn.addEventListener("click",()=>{

    sidebar.classList.toggle("collapsed");
    main.classList.toggle("collapsed");


    if(sidebar.classList.contains("collapsed")){

        toggleIcon.classList.remove("fa-chevron-left");
        toggleIcon.classList.add("fa-chevron-right");

    }
    else{

        toggleIcon.classList.remove("fa-chevron-right");
        toggleIcon.classList.add("fa-chevron-left");

    }

});

/*====================================
        DARK / LIGHT MODE
====================================*/


const themeBtn = document.querySelector(".theme-toggle");



if(themeBtn){


    const themeIcon = themeBtn.querySelector("i");



    const savedTheme = localStorage.getItem("theme");



    if(savedTheme === "light"){


        document.body.classList.add("light-mode");


        themeIcon.classList.remove("fa-moon");

        themeIcon.classList.add("fa-sun");


    }





    themeBtn.addEventListener("click",()=>{


        document.body.classList.toggle("light-mode");



        if(document.body.classList.contains("light-mode")){


            localStorage.setItem("theme","light");



            themeIcon.classList.remove("fa-moon");

            themeIcon.classList.add("fa-sun");


        }

        else{


            localStorage.setItem("theme","dark");



            themeIcon.classList.remove("fa-sun");

            themeIcon.classList.add("fa-moon");


        }



    });


}







/*====================================
        CARD ENTRANCE ANIMATION
====================================*/


const cards = document.querySelectorAll(
    ".stat-card, .appointment-card, .ai-card, .health-overview"
);



cards.forEach((card,index)=>{


    card.style.opacity="0";

    card.style.transform="translateY(35px)";



    setTimeout(()=>{


        card.style.transition="all .7s ease";


        card.style.opacity="1";


        card.style.transform="translateY(0)";



    },index * 120);



});







/*====================================
        BUTTON ARROW ANIMATION
====================================*/


const buttons = document.querySelectorAll("button");



buttons.forEach(button=>{


    const icon = button.querySelector("i");



    if(icon){



        button.addEventListener("mouseenter",()=>{


            icon.style.transition=".3s";

            icon.style.transform="translateX(6px)";


        });





        button.addEventListener("mouseleave",()=>{


            icon.style.transform="translateX(0)";


        });



    }


});







/*====================================
        GLASS CARD HOVER EFFECT
====================================*/


const glassCards = document.querySelectorAll(
    ".premium-glass, .ai-card"
);



glassCards.forEach(card=>{


    card.addEventListener("mousemove",(e)=>{


        const rect = card.getBoundingClientRect();


        const x = e.clientX - rect.left;

        const y = e.clientY - rect.top;



        card.style.setProperty(
            "--mouse-x",
            `${x}px`
        );


        card.style.setProperty(
            "--mouse-y",
            `${y}px`
        );


    });



});

// ===============================
// PROFILE DROPDOWN
// ===============================
const profile = document.querySelector(".profile");
const profileMenu = document.querySelector(".profile-menu");
const dashboard = document.querySelector("#dashboard");


if(profile && profileMenu){


    profile.addEventListener("click",(e)=>{

        e.stopPropagation();

        profileMenu.classList.toggle("show");

        dashboard.classList.toggle("blur-active");

    });



    document.addEventListener("click",(e)=>{


        if(
            !profile.contains(e.target) &&
            !profileMenu.contains(e.target)
        ){

            profileMenu.classList.remove("show");

            dashboard.classList.remove("blur-active");

        }


    });


}