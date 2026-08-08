// =========================================================
// MEDICO - GLOBAL JS
// Shared functionality for all user roles
// =========================================================


// =========================================================
// DOM READY
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    initSidebar();
    initTheme();
    initProfileMenu();
    initButtonAnimations();
    initGlassCards();
    initCardAnimations();

});


// =========================================================
// SIDEBAR
// =========================================================

function initSidebar(){

    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.querySelector(".sidebar-toggle");
    const main = document.querySelector(".main-content");

    if(!sidebar || !toggleBtn || !main){
        return;
    }


    const toggleIcon = toggleBtn.querySelector("i");


    toggleBtn.addEventListener("click", () => {

        sidebar.classList.toggle("collapsed");
        main.classList.toggle("collapsed");


        if(toggleIcon){

            if(sidebar.classList.contains("collapsed")){

                toggleIcon.classList.remove(
                    "fa-chevron-left"
                );

                toggleIcon.classList.add(
                    "fa-chevron-right"
                );

            }
            else{

                toggleIcon.classList.remove(
                    "fa-chevron-right"
                );

                toggleIcon.classList.add(
                    "fa-chevron-left"
                );

            }

        }

    });

}


// =========================================================
// MOBILE SIDEBAR
// =========================================================

function openMobileSidebar(){

    const sidebar =
        document.querySelector(".sidebar");

    if(!sidebar){
        return;
    }

    sidebar.classList.add("mobile-open");

}


function closeMobileSidebar(){

    const sidebar =
        document.querySelector(".sidebar");

    if(!sidebar){
        return;
    }

    sidebar.classList.remove("mobile-open");

}


function toggleMobileSidebar(){

    const sidebar =
        document.querySelector(".sidebar");

    if(!sidebar){
        return;
    }

    sidebar.classList.toggle("mobile-open");

}


// =========================================================
// DARK / LIGHT MODE
// =========================================================

function initTheme(){

    const themeBtn =
        document.querySelector(".theme-toggle");

    if(!themeBtn){
        return;
    }


    const themeIcon =
        themeBtn.querySelector("i");


    const savedTheme =
        localStorage.getItem("theme");


    // -----------------------------------------
    // RESTORE SAVED THEME
    // -----------------------------------------

    if(savedTheme === "light"){

        document.body.classList.add(
            "light-mode"
        );

        updateThemeIcon(
            themeIcon,
            "light"
        );

    }
    else{

        updateThemeIcon(
            themeIcon,
            "dark"
        );

    }


    // -----------------------------------------
    // TOGGLE THEME
    // -----------------------------------------

    themeBtn.addEventListener("click", () => {

        const isLight =
            document.body.classList.toggle(
                "light-mode"
            );


        if(isLight){

            localStorage.setItem(
                "theme",
                "light"
            );

            updateThemeIcon(
                themeIcon,
                "light"
            );

        }
        else{

            localStorage.setItem(
                "theme",
                "dark"
            );

            updateThemeIcon(
                themeIcon,
                "dark"
            );

        }

    });

}


// =========================================================
// THEME ICON
// =========================================================

function updateThemeIcon(icon, theme){

    if(!icon){
        return;
    }


    if(theme === "light"){

        icon.classList.remove(
            "fa-moon"
        );

        icon.classList.add(
            "fa-sun"
        );

    }
    else{

        icon.classList.remove(
            "fa-sun"
        );

        icon.classList.add(
            "fa-moon"
        );

    }

}


// =========================================================
// PROFILE DROPDOWN
// =========================================================

function initProfileMenu(){

    const profile =
        document.querySelector(".profile");

    const profileMenu =
        document.querySelector(".profile-menu");

    const dashboard =
        document.querySelector(".dashboard");


    if(!profile || !profileMenu){
        return;
    }


    // -----------------------------------------
    // OPEN / CLOSE
    // -----------------------------------------

    profile.addEventListener("click", (event) => {

        event.stopPropagation();

        profileMenu.classList.toggle("show");


        if(dashboard){

            dashboard.classList.toggle(
                "blur-active"
            );

        }

    });


    // -----------------------------------------
    // CLOSE WHEN CLICKING OUTSIDE
    // -----------------------------------------

    document.addEventListener("click", (event) => {

        if(
            !profile.contains(event.target) &&
            !profileMenu.contains(event.target)
        ){

            profileMenu.classList.remove(
                "show"
            );


            if(dashboard){

                dashboard.classList.remove(
                    "blur-active"
                );

            }

        }

    });

}


// =========================================================
// COUNTER ANIMATION
// =========================================================

function initCounters(){

    const counters =
        document.querySelectorAll(".counter");


    counters.forEach(counter => {

        const target =
            Number(counter.dataset.target);


        if(isNaN(target)){
            return;
        }


        let count = 0;

        const speed =
            target / 45;


        const update = () => {

            count += speed;


            if(count < target){

                counter.innerText =
                    Math.ceil(count);

                requestAnimationFrame(
                    update
                );

            }
            else{

                counter.innerText =
                    target;

            }

        };


        update();

    });

}


// =========================================================
// CARD ENTRANCE ANIMATION
// =========================================================

function initCardAnimations(){

    const cards =
        document.querySelectorAll(
            ".animate-card"
        );


    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(35px)";


        setTimeout(() => {

            card.style.transition =
                "opacity .7s ease, transform .7s ease";

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0)";

        }, index * 120);

    });


    // Support the old Patient classes
    // while we migrate the pages.

    const legacyCards =
        document.querySelectorAll(
            ".stat-card, " +
            ".appointment-card, " +
            ".ai-card, " +
            ".health-overview"
        );


    legacyCards.forEach((card, index) => {

        if(card.classList.contains("animate-card")){
            return;
        }


        card.style.opacity = "0";

        card.style.transform =
            "translateY(35px)";


        setTimeout(() => {

            card.style.transition =
                "opacity .7s ease, transform .7s ease";

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0)";

        }, index * 120);

    });

}


// =========================================================
// BUTTON ARROW ANIMATION
// =========================================================

function initButtonAnimations(){

    const buttons =
        document.querySelectorAll(
            ".primary-btn, " +
            ".nurse-action, " +
            ".nurse-view-link"
        );


    buttons.forEach(button => {

        const icon =
            button.querySelector("i");


        if(!icon){
            return;
        }


        button.addEventListener(
            "mouseenter",
            () => {

                icon.style.transition =
                    "transform .3s";

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

}


// =========================================================
// GLASS CARD MOUSE EFFECT
// =========================================================

function initGlassCards(){

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
                    event.clientX - rect.left;


                const y =
                    event.clientY - rect.top;


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

}


// =========================================================
// CLOSE MOBILE SIDEBAR WHEN LINK IS CLICKED
// =========================================================

document.addEventListener(
    "click",
    event => {

        const sidebar =
            document.querySelector(".sidebar");


        if(!sidebar){
            return;
        }


        const sidebarItem =
            event.target.closest(
                ".sidebar li"
            );


        if(
            sidebarItem &&
            window.innerWidth <= 900
        ){

            closeMobileSidebar();

        }

    }
);