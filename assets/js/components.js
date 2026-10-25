/* =========================================================
   ECON KITCHEN
   COMPONENT SYSTEM
   File: /assets/js/components.js

   Works with:
   /components/header.html
   /assets/css/header.css

   FEATURES
   ---------------------------------------------------------
   01. Dynamic Header Loading
   02. Dynamic Footer Loading
   03. Mobile Drawer
   04. Mobile Overlay
   05. Mobile Accordion
   06. Services / Categories / Calculators
   07. Body Scroll Lock
   08. ESC Close
   09. Resize Reset
   10. Active Navigation
   11. Desktop Dropdown Accessibility
   12. Search
   13. Footer Year
   14. Toast
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const ECON_CONFIG = {

    mobileBreakpoint: 1120,

    headerPath:
        "/components/header.html",

    footerPath:
        "/components/footer.html",

    searchPage:
        "/search.html"

};


/* =========================================================
   LOAD COMPONENT
========================================================= */

async function loadComponent(selector, path) {

    const target =
        document.querySelector(selector);


    if (!target) {

        return false;

    }


    try {

        const response =
            await fetch(path);


        if (!response.ok) {

            throw new Error(
                `Unable to load ${path}. Status: ${response.status}`
            );

        }


        const html =
            await response.text();


        target.innerHTML =
            html;


        return true;

    }

    catch (error) {

        console.error(
            "ECON Kitchen Component Error:",
            error
        );


        return false;

    }

}


/* =========================================================
   BODY SCROLL
========================================================= */

function lockBodyScroll() {

    document.body.classList.add(
        "menu-open"
    );


    document.body.style.overflow =
        "hidden";

}


function unlockBodyScroll() {

    document.body.classList.remove(
        "menu-open"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   INITIALIZE HEADER
========================================================= */

function initHeader() {

    const siteHeader =
        document.getElementById(
            "siteHeader"
        );


    if (!siteHeader) {

        console.warn(
            "ECON Kitchen: #siteHeader not found."
        );

        return;

    }


    /* =====================================================
       IMPORTANT

       mobileNav and mobileOverlay are OUTSIDE <header>
       in the new header.html.

       Therefore use document.getElementById(),
       NOT siteHeader.querySelector().
    ====================================================== */


    const menuButton =
        document.getElementById(
            "mobileMenuBtn"
        );


    const mobileNav =
        document.getElementById(
            "mobileNav"
        );


    const mobileOverlay =
        document.getElementById(
            "mobileOverlay"
        );


    const mobileClose =
        document.getElementById(
            "mobileCloseBtn"
        );


    const mobileDropdowns =
        document.querySelectorAll(
            ".mobile-dropdown"
        );


    const mobileTriggers =
        document.querySelectorAll(
            ".mobile-dropdown-trigger"
        );


    const desktopNavItems =
        siteHeader.querySelectorAll(
            ".desktop-nav .navitem"
        );


    const desktopTriggers =
        siteHeader.querySelectorAll(
            ".desktop-nav .nav-trigger"
        );


    /* =====================================================
       MOBILE MENU OPEN
    ====================================================== */

    function openMobileMenu() {

        if (!mobileNav) {

            return;

        }


        mobileNav.classList.add(
            "active"
        );


        mobileOverlay?.classList.add(
            "active"
        );


        menuButton?.classList.add(
            "active"
        );


        menuButton?.setAttribute(
            "aria-expanded",
            "true"
        );


        mobileNav.setAttribute(
            "aria-hidden",
            "false"
        );


        lockBodyScroll();

    }


    /* =====================================================
       CLOSE ALL MOBILE ACCORDIONS
    ====================================================== */

    function closeMobileAccordions(
        except = null
    ) {

        mobileDropdowns.forEach(
            dropdown => {

                if (
                    dropdown === except
                ) {

                    return;

                }


                dropdown.classList.remove(
                    "open"
                );


                const trigger =
                    dropdown.querySelector(
                        ".mobile-dropdown-trigger"
                    );


                const icon =
                    trigger?.querySelector(
                        "i"
                    );


                trigger?.setAttribute(
                    "aria-expanded",
                    "false"
                );


                if (icon) {

                    icon.textContent =
                        "+";

                }

            }
        );

    }


    /* =====================================================
       MOBILE MENU CLOSE
    ====================================================== */

    function closeMobileMenu() {

        mobileNav?.classList.remove(
            "active"
        );


        mobileOverlay?.classList.remove(
            "active"
        );


        menuButton?.classList.remove(
            "active"
        );


        menuButton?.setAttribute(
            "aria-expanded",
            "false"
        );


        mobileNav?.setAttribute(
            "aria-hidden",
            "true"
        );


        closeMobileAccordions();


        unlockBodyScroll();

    }


    /* =====================================================
       MOBILE HAMBURGER
    ====================================================== */

    menuButton?.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            const isOpen =
                mobileNav?.classList.contains(
                    "active"
                );


            if (isOpen) {

                closeMobileMenu();

            }

            else {

                openMobileMenu();

            }

        }
    );


    /* =====================================================
       MOBILE CLOSE BUTTON
    ====================================================== */

    mobileClose?.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            closeMobileMenu();

        }
    );


    /* =====================================================
       OVERLAY CLICK
    ====================================================== */

    mobileOverlay?.addEventListener(
        "click",
        function () {

            closeMobileMenu();

        }
    );


    /* =====================================================
       MOBILE ACCORDIONS

       Services
       Categories
       Price Calculators
    ====================================================== */

    mobileTriggers.forEach(
        trigger => {

            trigger.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const dropdown =
                        trigger.closest(
                            ".mobile-dropdown"
                        );


                    if (!dropdown) {

                        return;

                    }


                    const currentlyOpen =
                        dropdown.classList.contains(
                            "open"
                        );


                    /*
                       Close every other dropdown.
                    */

                    closeMobileAccordions(
                        dropdown
                    );


                    /*
                       Toggle selected dropdown.
                    */

                    dropdown.classList.toggle(
                        "open",
                        !currentlyOpen
                    );


                    const isOpen =
                        dropdown.classList.contains(
                            "open"
                        );


                    trigger.setAttribute(
                        "aria-expanded",
                        isOpen
                            ? "true"
                            : "false"
                    );


                    const icon =
                        trigger.querySelector(
                            "i"
                        );


                    if (icon) {

                        icon.textContent =
                            isOpen
                                ? "−"
                                : "+";

                    }

                }
            );

        }
    );


    /* =====================================================
       MOBILE NAV LINKS

       Clicking an actual page closes drawer.
    ====================================================== */

    mobileNav
        ?.querySelectorAll(
            'a[href]'
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    function () {

                        closeMobileMenu();

                    }
                );

            }
        );


    /* =====================================================
       DESKTOP DROPDOWN ARIA

       CSS handles actual hover animation.

       JS handles aria-expanded.
    ====================================================== */

    desktopNavItems.forEach(
        navItem => {

            const trigger =
                navItem.querySelector(
                    ":scope > .nav-trigger"
                );


            if (!trigger) {

                return;

            }


            navItem.addEventListener(
                "mouseenter",
                function () {

                    if (
                        window.innerWidth >
                        ECON_CONFIG.mobileBreakpoint
                    ) {

                        trigger.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                    }

                }
            );


            navItem.addEventListener(
                "mouseleave",
                function () {

                    if (
                        window.innerWidth >
                        ECON_CONFIG.mobileBreakpoint
                    ) {

                        trigger.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       DESKTOP CLICK SUPPORT

       Helpful for touchscreen laptops.
    ====================================================== */

    desktopTriggers.forEach(
        trigger => {

            trigger.addEventListener(
                "click",
                function (event) {

                    /*
                       On desktop CSS hover remains primary.
                       Click simply toggles helper class.
                    */

                    if (
                        window.innerWidth <=
                        ECON_CONFIG.mobileBreakpoint
                    ) {

                        return;

                    }


                    event.preventDefault();

                    event.stopPropagation();


                    const parent =
                        trigger.closest(
                            ".navitem"
                        );


                    if (!parent) {

                        return;

                    }


                    const wasOpen =
                        parent.classList.contains(
                            "desktop-open"
                        );


                    desktopNavItems.forEach(
                        item => {

                            if (
                                item !== parent
                            ) {

                                item.classList.remove(
                                    "desktop-open"
                                );


                                item
                                    .querySelector(
                                        ":scope > .nav-trigger"
                                    )
                                    ?.setAttribute(
                                        "aria-expanded",
                                        "false"
                                    );

                            }

                        }
                    );


                    parent.classList.toggle(
                        "desktop-open",
                        !wasOpen
                    );


                    trigger.setAttribute(
                        "aria-expanded",
                        !wasOpen
                            ? "true"
                            : "false"
                    );

                }
            );

        }
    );


    /* =====================================================
       DESKTOP CLICK-OPEN CSS SUPPORT

       Inject helper style once.

       This ensures touch/click desktop dropdowns
       behave exactly like hover.
    ====================================================== */

    if (
        !document.getElementById(
            "econHeaderRuntimeStyle"
        )
    ) {

        const style =
            document.createElement(
                "style"
            );


        style.id =
            "econHeaderRuntimeStyle";


        style.textContent = `

            @media (min-width: 1121px) {

                .navitem.desktop-open > .mega-menu,
                .navitem.desktop-open > .small-dropdown {

                    opacity: 1 !important;

                    visibility: visible !important;

                    pointer-events: auto !important;

                    transform:
                        translate(-50%, 0)
                        !important;

                }

                .navitem.desktop-open
                > .nav-trigger
                .nav-chevron {

                    color:
                        var(--header-copper);

                    transform:
                        translateY(-1px)
                        rotate(180deg);

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    /* =====================================================
       CLICK OUTSIDE DESKTOP DROPDOWNS
    ====================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                window.innerWidth <=
                ECON_CONFIG.mobileBreakpoint
            ) {

                return;

            }


            if (
                event.target.closest(
                    ".desktop-nav .navitem"
                )
            ) {

                return;

            }


            desktopNavItems.forEach(
                navItem => {

                    navItem.classList.remove(
                        "desktop-open"
                    );


                    navItem
                        .querySelector(
                            ":scope > .nav-trigger"
                        )
                        ?.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                }
            );

        }
    );


    /* =====================================================
       ESC KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {

                return;

            }


            /*
               Close mobile drawer.
            */

            closeMobileMenu();


            /*
               Close desktop dropdowns.
            */

            desktopNavItems.forEach(
                navItem => {

                    navItem.classList.remove(
                        "desktop-open"
                    );


                    navItem
                        .querySelector(
                            ":scope > .nav-trigger"
                        )
                        ?.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                }
            );

        }
    );


    /* =====================================================
       RESIZE RESET
    ====================================================== */

    let lastWindowWidth =
        window.innerWidth;


    window.addEventListener(
        "resize",
        function () {

            const currentWidth =
                window.innerWidth;


            /*
               Mobile browsers change viewport dimensions
               slightly while scrolling.

               Avoid resetting menu for tiny changes.
            */

            if (
                Math.abs(
                    currentWidth -
                    lastWindowWidth
                ) < 15
            ) {

                return;

            }


            lastWindowWidth =
                currentWidth;


            /*
               Moving from mobile -> desktop.
            */

            if (
                currentWidth >
                ECON_CONFIG.mobileBreakpoint
            ) {

                closeMobileMenu();

            }


            /*
               Reset desktop helper classes.
            */

            desktopNavItems.forEach(
                navItem => {

                    navItem.classList.remove(
                        "desktop-open"
                    );


                    navItem
                        .querySelector(
                            ":scope > .nav-trigger"
                        )
                        ?.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                }
            );

        }
    );


    /* =====================================================
       INITIAL MOBILE ARIA
    ====================================================== */

    mobileNav?.setAttribute(
        "aria-hidden",
        "true"
    );


    /* =====================================================
       ACTIVE PAGE
    ====================================================== */

    setActivePage();


    /* =====================================================
       SEARCH
    ====================================================== */

    initSearch();

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function setActivePage() {

    const header =
        document.getElementById(
            "siteHeader"
        );


    if (!header) {

        return;

    }


    let path =
        window.location.pathname;


    /* Normalize */

    if (
        path === "/" ||
        path === ""
    ) {

        path =
            "/index.html";

    }


    if (
        path.length > 1 &&
        path.endsWith("/")
    ) {

        path =
            path.slice(
                0,
                -1
            );

    }


    /* =====================================================
       RESET
    ====================================================== */

    header
        .querySelectorAll(
            ".active"
        )
        .forEach(
            element => {

                element.classList.remove(
                    "active"
                );

            }
        );


    /* =====================================================
       HOME
    ====================================================== */

    if (
        path === "/index.html"
    ) {

        header
            .querySelector(
                '.desktop-nav > a[href="/index.html"]'
            )
            ?.classList.add(
                "active"
            );


        return;

    }


    /* =====================================================
       ABOUT
    ====================================================== */

    if (
        path === "/about.html"
    ) {

        header
            .querySelector(
                '.desktop-nav > a[href="/about.html"]'
            )
            ?.classList.add(
                "active"
            );


        return;

    }


    /* =====================================================
       BLOG
    ====================================================== */

    if (
        path === "/blog.html" ||
        path.startsWith(
            "/blog/"
        )
    ) {

        header
            .querySelector(
                '.desktop-nav > a[href="/blog.html"]'
            )
            ?.classList.add(
                "active"
            );


        return;

    }


    /* =====================================================
       CONTACT
    ====================================================== */

    if (
        path === "/contact.html"
    ) {

        header
            .querySelector(
                '.desktop-nav > a[href="/contact.html"]'
            )
            ?.classList.add(
                "active"
            );


        return;

    }


    /* =====================================================
       SERVICES
    ====================================================== */

    if (
        path.startsWith(
            "/services/"
        )
    ) {

        const serviceTrigger =
            header.querySelector(
                ".mega-navitem > .nav-trigger"
            );


        serviceTrigger?.classList.add(
            "active"
        );


        return;

    }


    /* =====================================================
       CATEGORIES
    ====================================================== */

    if (
        path.startsWith(
            "/categories/"
        )
    ) {

        const navItems =
            header.querySelectorAll(
                ".desktop-nav > .navitem"
            );


        /*
           New HTML order:
           0 = Services
           1 = Categories
           2 = Calculators
        */

        navItems[1]
            ?.querySelector(
                ":scope > .nav-trigger"
            )
            ?.classList.add(
                "active"
            );


        return;

    }


    /* =====================================================
       CALCULATORS
    ====================================================== */

    if (
        path.startsWith(
            "/calculators/"
        )
    ) {

        const navItems =
            header.querySelectorAll(
                ".desktop-nav > .navitem"
            );


        navItems[2]
            ?.querySelector(
                ":scope > .nav-trigger"
            )
            ?.classList.add(
                "active"
            );

    }

}


/* =========================================================
   SEARCH
========================================================= */

function initSearch() {

    const searchInput =
        document.getElementById(
            "headerSearch"
        );


    const searchButton =
        document.getElementById(
            "headerSearchBtn"
        );


    /* =====================================================
       ENTER KEY
    ====================================================== */

    searchInput?.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Enter"
            ) {

                return;

            }


            event.preventDefault();


            runSearch(
                searchInput.value
            );

        }
    );


    /* =====================================================
       SEARCH BUTTON
    ====================================================== */

    searchButton?.addEventListener(
        "click",
        function () {

            /*
               Search input is available
               in desktop topbar.
            */

            if (
                searchInput &&
                window.innerWidth >
                ECON_CONFIG.mobileBreakpoint
            ) {

                searchInput.focus();


                /*
                   Scroll header into view if necessary.
                */

                document
                    .getElementById(
                        "siteHeader"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });


                return;

            }


            /*
               Fallback.
            */

            window.location.href =
                ECON_CONFIG.searchPage;

        }
    );

}


/* =========================================================
   RUN SEARCH
========================================================= */

function runSearch(value) {

    const query =
        String(
            value || ""
        )
            .trim();


    if (!query) {

        window.toast?.(
            "Please enter something to search."
        );


        return;

    }


    window.location.href =
        `${ECON_CONFIG.searchPage}?q=${encodeURIComponent(query)}`;

}


/* =========================================================
   FOOTER
========================================================= */

function initFooter() {

    const year =
        document.getElementById(
            "year"
        );


    if (year) {

        year.textContent =
            new Date()
                .getFullYear();

    }

}


/* =========================================================
   TOAST SYSTEM
========================================================= */

window.toast =
    function (message) {

        const toast =
            document.getElementById(
                "toast"
            );


        /*
           If toast HTML doesn't exist,
           don't throw an error.
        */

        if (!toast) {

            console.log(
                "ECON:",
                message
            );


            return;

        }


        toast.textContent =
            String(message);


        toast.classList.add(
            "show"
        );


        if (
            window.__econToastTimer
        ) {

            clearTimeout(
                window.__econToastTimer
            );

        }


        window.__econToastTimer =
            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                2600
            );

    };


/* =========================================================
   START COMPONENTS
========================================================= */

async function startComponents() {

    /* =====================================================
       HEADER
    ====================================================== */

    const headerSlot =
        document.querySelector(
            "#header-slot"
        );


    if (headerSlot) {

        const loaded =
            await loadComponent(
                "#header-slot",
                ECON_CONFIG.headerPath
            );


        /*
           CRITICAL:

           Header JS MUST initialize only AFTER
           header.html has been inserted.
        */

        if (loaded) {
           initHeader();

    initBackToTop();
        }

    }


    /* =====================================================
       FOOTER
    ====================================================== */

    const footerSlot =
        document.querySelector(
            "#footer-slot"
        );


    if (footerSlot) {

        const loaded =
            await loadComponent(
                "#footer-slot",
                ECON_CONFIG.footerPath
            );


        if (loaded) {

            initFooter();

        }

    }

}


/* =========================================================
   DOM READY
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startComponents,
        {
            once: true
        }
    );

}

else {

    startComponents();

}


/* =========================================================
   END
========================================================= */

/* =========================================================
   BACK TO TOP
========================================================= */

/* =========================================================
   BACK TO TOP - FINAL
========================================================= */

function initBackToTop() {

    const backToTop =
        document.getElementById("backToTop");

    if (!backToTop) {

        console.warn(
            "ECON: Back to top button not found."
        );

        return;
    }


    console.log(
        "ECON: Back to top initialized."
    );


    const updateBackToTop = () => {

        const scrollPosition =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;


        if (scrollPosition > 300) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    };


    window.addEventListener(
        "scroll",
        updateBackToTop,
        {
            passive: true
        }
    );


    document.addEventListener(
        "scroll",
        updateBackToTop,
        {
            passive: true
        }
    );


    backToTop.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth"
            });

        }
    );


    updateBackToTop();

}