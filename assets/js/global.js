/* =========================================================
   MEDICO
   GLOBAL JAVASCRIPT
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const sidebar =
    document.querySelector(".sidebar");

const sidebarToggle =
    document.querySelector(".sidebar-toggle");

const mainContent =
    document.querySelector(".main-content");

const themeToggle =
    document.querySelector(".theme-toggle");

const dashboard =
    document.querySelector("#dashboard");



/* =========================================================
   SIDEBAR COLLAPSE
========================================================= */

if(sidebar && sidebarToggle && mainContent){

    const toggleIcon =
        sidebarToggle.querySelector("i");


    sidebarToggle.addEventListener("click", () => {

        sidebar.classList.toggle("collapsed");

        mainContent.classList.toggle("collapsed");


        const collapsed =
            sidebar.classList.contains("collapsed");


        if(toggleIcon){

            toggleIcon.classList.toggle(
                "fa-chevron-left",
                !collapsed
            );

            toggleIcon.classList.toggle(
                "fa-chevron-right",
                collapsed
            );

        }

    });

}



/* =========================================================
   DARK / LIGHT MODE
========================================================= */

if(themeToggle){

    const themeIcon =
        themeToggle.querySelector("i");


    /*
        Load saved theme
    */

    const savedTheme =
        localStorage.getItem("theme");


    if(savedTheme === "light"){

        document.body.classList.add(
            "light-mode"
        );


        if(themeIcon){

            themeIcon.classList.remove(
                "fa-moon"
            );

            themeIcon.classList.add(
                "fa-sun"
            );

        }

    }



    /*
        Toggle theme
    */

    themeToggle.addEventListener(
        "click",
        () => {

            const lightMode =
                document.body.classList.toggle(
                    "light-mode"
                );


            if(lightMode){

                localStorage.setItem(
                    "theme",
                    "light"
                );


                if(themeIcon){

                    themeIcon.classList.remove(
                        "fa-moon"
                    );

                    themeIcon.classList.add(
                        "fa-sun"
                    );

                }

            }

            else{

                localStorage.setItem(
                    "theme",
                    "dark"
                );


                if(themeIcon){

                    themeIcon.classList.remove(
                        "fa-sun"
                    );

                    themeIcon.classList.add(
                        "fa-moon"
                    );

                }

            }

        }
    );

}



/* =========================================================
   PROFILE DROPDOWN
========================================================= */

const profile =
    document.querySelector(".profile");

const profileMenu =
    document.querySelector(".profile-menu");


if(profile && profileMenu){

    profile.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            profileMenu.classList.toggle(
                "show"
            );

        }
    );



    /*
        Prevent clicking inside menu
        from closing it
    */

    profileMenu.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

        }
    );



    /*
        Close when clicking outside
    */

    document.addEventListener(
        "click",
        () => {

            profileMenu.classList.remove(
                "show"
            );

        }
    );

}



/* =========================================================
   COUNTER ANIMATION
========================================================= */

const counters =
    document.querySelectorAll(
        ".counter, .nurse-counter, .admin-counter"
    );


counters.forEach(counter => {

    const target =
        Number(counter.dataset.target);


    if(
        Number.isNaN(target) ||
        target < 0
    ){

        return;

    }


    let count = 0;


    const duration = 900;

    const startTime =
        performance.now();


    const updateCounter = (
        currentTime
    ) => {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /*
            Smooth easing
        */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        count =
            Math.floor(
                eased * target
            );


        counter.textContent =
            count;


        if(progress < 1){

            requestAnimationFrame(
                updateCounter
            );

        }

        else{

            counter.textContent =
                target;

        }

    };


    requestAnimationFrame(
        updateCounter
    );

});



/* =========================================================
   CARD ENTRANCE ANIMATION
========================================================= */

const animatedCards =
    document.querySelectorAll(
        ".stat-card, " +
        ".appointment-card, " +
        ".ai-card, " +
        ".health-overview"
    );


animatedCards.forEach(
    (card, index) => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(30px)";


        setTimeout(() => {

            card.style.transition =
                "opacity .7s ease, " +
                "transform .7s ease";


            card.style.opacity = "1";

            card.style.transform =
                "translateY(0)";


        }, index * 100);

    }
);



/* =========================================================
   BUTTON ARROW ANIMATION
========================================================= */

const buttons =
    document.querySelectorAll(
        "button"
    );


buttons.forEach(button => {

    const icon =
        button.querySelector(
            "i.fa-arrow-right"
        );


    if(!icon){

        return;

    }


    button.addEventListener(
        "mouseenter",
        () => {

            icon.style.transition =
                ".3s ease";

            icon.style.transform =
                "translateX(6px)";

        }
    );


    button.addEventListener(
        "mouseleave",
        () => {

            icon.style.transform =
                "translateX(0)";

        }
    );

});



/* =========================================================
   GLASS CARD MOUSE TRACKING
========================================================= */

const glassCards =
    document.querySelectorAll(
        ".premium-glass, .ai-card"
    );


glassCards.forEach(card => {

    card.addEventListener(
        "mousemove",
        event => {

            const rect =
                card.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            card.style.setProperty(
                "--mouse-x",
                `${x}px`
            );


            card.style.setProperty(
                "--mouse-y",
                `${y}px`
            );

        }
    );

});