/* =========================================================
   ECON — WARDROBE COLLECTION
========================================================= */

import { wardrobeDesigns }
    from "/assets/js/data/wardrobe-designs.js";
 /* =========================================================
   ECON WARDROBE COLLECTION
   Initial Gallery + Type Browser + Package Browser
========================================================= */


/* =========================================================
   01. DOM ELEMENTS
========================================================= */

const wardrobeInitialGrid =
    document.getElementById("wardrobeInitialGrid");

const wardrobeViewMoreBtn =
    document.getElementById("wardrobeViewMoreBtn");


const wardrobeTypeGrid =
    document.getElementById("wardrobeTypeGrid");

const wardrobeTypePills =
    document.querySelectorAll(".wd-type-pill");

const wardrobeTypeResultTitle =
    document.getElementById("wardrobeTypeResultTitle");

const wardrobeTypeResultCount =
    document.getElementById("wardrobeTypeResultCount");

const wardrobeTypeLoadMore =
    document.getElementById("wardrobeTypeLoadMore");


const wardrobePackageGrid =
    document.getElementById("wardrobePackageGrid");

const wardrobePackageCards =
    document.querySelectorAll(".wd-package-card");

const wardrobePackageResultTitle =
    document.getElementById("wardrobePackageResultTitle");

const wardrobePackageResultCount =
    document.getElementById("wardrobePackageResultCount");

const wardrobePackageLoadMore =
    document.getElementById("wardrobePackageLoadMore");


/* =========================================================
   02. DISPLAY LIMITS
========================================================= */

const INITIAL_FIRST_LIMIT = 9;
const INITIAL_LOAD_MORE = 6;

const TYPE_FIRST_LIMIT = 6;
const TYPE_LOAD_MORE = 6;

const PACKAGE_FIRST_LIMIT = 6;
const PACKAGE_LOAD_MORE = 6;


/* =========================================================
   03. STATE
========================================================= */

const wardrobeCollectionState = {

    initialLimit:
        INITIAL_FIRST_LIMIT,

    selectedType:
        "all",

    typeLimit:
        TYPE_FIRST_LIMIT,

    selectedPackage:
        "essentials",

    packageLimit:
        PACKAGE_FIRST_LIMIT

};


/* =========================================================
   04. LABELS
========================================================= */

const wardrobeTypeLabels = {

    all: {
        title: "Explore All",
        accent: "Wardrobes."
    },

    sliding: {
        title: "Sliding Door",
        accent: "Wardrobes."
    },

    mirror: {
        title: "Mirror",
        accent: "Wardrobes."
    },

    "walk-in": {
        title: "Walk-In",
        accent: "Wardrobes."
    }

};


const wardrobePackageLabels = {

    essentials: {
        title: "Essentials",
        accent: "Wardrobes."
    },

    premium: {
        title: "Premium",
        accent: "Wardrobes."
    },

    luxe: {
        title: "Luxe",
        accent: "Wardrobes."
    }

};


/* =========================================================
   05. FAVOURITES
========================================================= */

const WARDROBE_FAVOURITES_KEY =
    "econWardrobeFavourites";


function getWardrobeFavourites() {

    try {

        const stored =
            localStorage.getItem(
                WARDROBE_FAVOURITES_KEY
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed.map(String)
            : [];

    }

    catch (error) {

        console.warn(
            "Unable to read wardrobe favourites:",
            error
        );

        return [];

    }

}


function saveWardrobeFavourites(items) {

    try {

        localStorage.setItem(
            WARDROBE_FAVOURITES_KEY,
            JSON.stringify(items)
        );

    }

    catch (error) {

        console.warn(
            "Unable to save wardrobe favourites:",
            error
        );

    }

}


function isWardrobeFavourite(id) {

    return getWardrobeFavourites()
        .includes(String(id));

}


function toggleWardrobeFavourite(id) {

    const wardrobeId =
        String(id);

    const favourites =
        getWardrobeFavourites();

    const index =
        favourites.indexOf(wardrobeId);


    if (index >= 0) {

        favourites.splice(index, 1);

    }

    else {

        favourites.push(wardrobeId);

    }


    saveWardrobeFavourites(favourites);


    return favourites.includes(
        wardrobeId
    );

}


/* =========================================================
   06. ESCAPE HTML
========================================================= */

function escapeWardrobeHTML(value = "") {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   07. GET IMAGE
========================================================= */

function getWardrobeImage(item) {

    if (item.image) {

        return item.image;

    }


    if (
        Array.isArray(item.images) &&
        item.images.length > 0
    ) {

        return item.images[0];

    }


    return "/assets/images/wardrobes/wardrobe-dummy.jpg";

}


/* =========================================================
   08. GET TYPE LABEL
========================================================= */

function getWardrobeTypeLabel(item) {

    if (item.categoryLabel) {

        return item.categoryLabel;

    }


    const labels = {

        sliding:
            "Sliding Door Wardrobe",

        mirror:
            "Mirror Wardrobe",

        "walk-in":
            "Walk-In Wardrobe"

    };


    return (
        labels[item.category] ||
        "Wardrobe"
    );

}


/* =========================================================
   09. GET PACKAGE LABEL
========================================================= */

function getWardrobePackageLabel(item) {

    if (item.packageLabel) {

        return item.packageLabel;

    }


    const labels = {

        essentials:
            "Essentials",

        premium:
            "Premium",

        luxe:
            "Luxe"

    };


    return (
        labels[item.package] ||
        ""
    );

}


/* =========================================================
   10. CREATE WARDROBE CARD
========================================================= */

function createWardrobeCard(item) {

    const detailUrl =
        `/wardrobe-design.html?slug=${encodeURIComponent(
            item.slug
        )}`;


    const image =
        getWardrobeImage(item);


    const typeLabel =
        getWardrobeTypeLabel(item);


    const packageLabel =
        getWardrobePackageLabel(item);


    const favourite =
        isWardrobeFavourite(item.id);


    return `

        <article
            class="wd-project-card"
            data-url="${detailUrl}"
            data-id="${escapeWardrobeHTML(item.id)}"
            tabindex="0"
            role="link"
            aria-label="View ${escapeWardrobeHTML(item.title)}"
        >


            <!-- IMAGE -->

            <div class="wd-project-image-wrap">


                <img
                    src="${escapeWardrobeHTML(image)}"
                    alt="${escapeWardrobeHTML(item.title)}"
                    class="wd-project-image"
                    loading="lazy"
                    decoding="async"
                >


                ${
                    packageLabel
                    ? `
                        <span class="wd-project-badge">
                            ${escapeWardrobeHTML(packageLabel)}
                        </span>
                    `
                    : ""
                }


                <!-- FAVOURITE -->

                <button
                    type="button"
                    class="wd-project-favourite ${
                        favourite
                            ? "active"
                            : ""
                    }"
                    data-favourite="${escapeWardrobeHTML(item.id)}"
                    aria-label="${
                        favourite
                            ? "Remove from favourites"
                            : "Add to favourites"
                    }"
                    aria-pressed="${favourite}"
                >

                    <i class="${
                        favourite
                            ? "fa-solid"
                            : "fa-regular"
                    } fa-heart"></i>

                </button>


                <!-- OPEN -->

                <span
                    class="wd-project-open"
                    aria-hidden="true"
                >
                    ↗
                </span>


            </div>



            <!-- CONTENT -->

            <div class="wd-project-content">


                <span class="wd-project-category">

                    ${escapeWardrobeHTML(typeLabel)}

                </span>


                <h3 class="wd-project-title">

                    ${escapeWardrobeHTML(item.title)}

                </h3>


                <div class="wd-project-size">

                    Size:
                    ${escapeWardrobeHTML(
                        item.size || "Custom Size"
                    )}

                </div>


                <!-- ACTIONS -->

                <div class="wd-project-actions">


                    <a
                        href="#consultation"
                        class="wd-project-consultation"
                        data-card-action
                    >

                        Book Free Consultation

                    </a>


                    <a
                        href="/calculators/wardrobe.html"
                        class="wd-project-quote"
                        data-card-action
                    >

                        Get Quote

                    </a>


                </div>


            </div>


        </article>

    `;

}


/* =========================================================
   11. BIND CARD EVENTS
========================================================= */

function bindWardrobeCards(container) {

    if (!container) {
        return;
    }


    /* CARD NAVIGATION */

    const cards =
        container.querySelectorAll(
            ".wd-project-card"
        );


    cards.forEach(card => {


        card.addEventListener(
            "click",
            event => {


                /* Favourite button */

                if (
                    event.target.closest(
                        ".wd-project-favourite"
                    )
                ) {

                    return;

                }


                /* CTA buttons */

                if (
                    event.target.closest(
                        "[data-card-action]"
                    )
                ) {

                    return;

                }


                const url =
                    card.dataset.url;


                if (url) {

                    window.location.href =
                        url;

                }

            }
        );



        /* KEYBOARD */

        card.addEventListener(
            "keydown",
            event => {


                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {

                    return;

                }


                if (
                    event.target.closest(
                        "button, a"
                    )
                ) {

                    return;

                }


                event.preventDefault();


                const url =
                    card.dataset.url;


                if (url) {

                    window.location.href =
                        url;

                }

            }
        );

    });



    /* FAVOURITE */

    const favouriteButtons =
        container.querySelectorAll(
            ".wd-project-favourite"
        );


    favouriteButtons.forEach(button => {


        button.addEventListener(
            "click",
            event => {


                event.preventDefault();

                event.stopPropagation();


                const id =
                    button.dataset.favourite;


                const active =
                    toggleWardrobeFavourite(id);


                button.classList.toggle(
                    "active",
                    active
                );


                button.setAttribute(
                    "aria-pressed",
                    String(active)
                );


                button.setAttribute(
                    "aria-label",
                    active
                        ? "Remove from favourites"
                        : "Add to favourites"
                );


                const icon =
                    button.querySelector("i");


                if (icon) {

                    icon.classList.toggle(
                        "fa-solid",
                        active
                    );


                    icon.classList.toggle(
                        "fa-regular",
                        !active
                    );

                }

            }
        );

    });

}


/* =========================================================
   12. BUTTON VISIBILITY
========================================================= */

function updateLoadMoreButton(
    button,
    visibleCount,
    totalCount
) {

    if (!button) {
        return;
    }


    if (
        totalCount === 0 ||
        visibleCount >= totalCount
    ) {

        button.hidden = true;

    }

    else {

        button.hidden = false;

    }

}
/* =========================================================
   SMOOTH SCROLL TO WARDROBE RESULTS
========================================================= */

function scrollToWardrobeResult(elementId) {

    setTimeout(() => {

        const element =
            document.getElementById(elementId);

        if (!element) return;

        const offset =
            window.innerWidth <= 768
                ? 90
                : 110;

        const top =
            element.getBoundingClientRect().top +
            window.scrollY -
            offset;

        window.scrollTo({
            top: top,
            behavior: "smooth"
        });

    }, 100);

}

/* =========================================================
   13. INITIAL GALLERY
========================================================= */

function renderInitialWardrobes() {

    if (!wardrobeInitialGrid) {
        return;
    }


    const visibleItems =
        wardrobeDesigns.slice(
            0,
            wardrobeCollectionState.initialLimit
        );


    wardrobeInitialGrid.innerHTML =
        visibleItems
            .map(createWardrobeCard)
            .join("");


    bindWardrobeCards(
        wardrobeInitialGrid
    );


    updateLoadMoreButton(

        wardrobeViewMoreBtn,

        visibleItems.length,

        wardrobeDesigns.length

    );

}


/* =========================================================
   14. INITIAL VIEW MORE
========================================================= */

if (wardrobeViewMoreBtn) {

    wardrobeViewMoreBtn.addEventListener(
        "click",
        () => {


            wardrobeCollectionState.initialLimit +=
                INITIAL_LOAD_MORE;


            renderInitialWardrobes();

        }
    );

}


/* =========================================================
   15. FILTER BY TYPE
========================================================= */

function getWardrobesByType() {

    if (
        wardrobeCollectionState.selectedType ===
        "all"
    ) {

        return wardrobeDesigns;

    }


    return wardrobeDesigns.filter(
        item =>
            item.category ===
            wardrobeCollectionState.selectedType
    );

}


/* =========================================================
   16. UPDATE TYPE HEADING
========================================================= */

function updateTypeResultHeading(total) {

    const selectedType =
        wardrobeCollectionState.selectedType;


    const label =
        wardrobeTypeLabels[selectedType] ||
        wardrobeTypeLabels.all;


    if (wardrobeTypeResultTitle) {

        wardrobeTypeResultTitle.innerHTML = `

            ${label.title}

            <em>
                ${label.accent}
            </em>

        `;

    }


    if (wardrobeTypeResultCount) {

        wardrobeTypeResultCount.textContent =
            String(total);

    }

}


/* =========================================================
   17. RENDER TYPE RESULTS
========================================================= */

function renderTypeWardrobes() {

    if (!wardrobeTypeGrid) {
        return;
    }


    const filtered =
        getWardrobesByType();


    const visibleItems =
        filtered.slice(
            0,
            wardrobeCollectionState.typeLimit
        );


    wardrobeTypeGrid.innerHTML =
        visibleItems
            .map(createWardrobeCard)
            .join("");


    bindWardrobeCards(
        wardrobeTypeGrid
    );


    updateTypeResultHeading(
        filtered.length
    );


    updateLoadMoreButton(

        wardrobeTypeLoadMore,

        visibleItems.length,

        filtered.length

    );

}


/* =========================================================
   18. TYPE PILLS
========================================================= */

wardrobeTypePills.forEach(button => {


    button.addEventListener(
        "click",
        () => {


            const selectedType =
                button.dataset.type || "all";


            wardrobeCollectionState.selectedType =
                selectedType;


            /* Reset visible cards */

            wardrobeCollectionState.typeLimit =
                TYPE_FIRST_LIMIT;


            /* Active pill */

            wardrobeTypePills.forEach(item => {

                const active =
                    item === button;


                item.classList.toggle(
                    "active",
                    active
                );


                item.setAttribute(
                    "aria-pressed",
                    String(active)
                );

            });


            renderTypeWardrobes();
            scrollToWardrobeResult(
    "wardrobeTypeResultTitle"
);

        }
    );

});


/* =========================================================
   19. TYPE LOAD MORE
========================================================= */

if (wardrobeTypeLoadMore) {

    wardrobeTypeLoadMore.addEventListener(
        "click",
        () => {


            wardrobeCollectionState.typeLimit +=
                TYPE_LOAD_MORE;


            renderTypeWardrobes(); 

        }
    );

}


/* =========================================================
   20. FILTER BY PACKAGE
========================================================= */

function getWardrobesByPackage() {

    return wardrobeDesigns.filter(
        item =>
            item.package ===
            wardrobeCollectionState.selectedPackage
    );

}


/* =========================================================
   21. UPDATE PACKAGE HEADING
========================================================= */

function updatePackageResultHeading(total) {

    const selectedPackage =
        wardrobeCollectionState.selectedPackage;


    const label =
        wardrobePackageLabels[
            selectedPackage
        ] ||
        wardrobePackageLabels.essentials;


    if (wardrobePackageResultTitle) {

        wardrobePackageResultTitle.innerHTML = `

            ${label.title}

            <em>
                ${label.accent}
            </em>

        `;

    }


    if (wardrobePackageResultCount) {

        wardrobePackageResultCount.textContent =
            String(total);

    }

}


/* =========================================================
   22. RENDER PACKAGE RESULTS
========================================================= */

function renderPackageWardrobes() {

    if (!wardrobePackageGrid) {
        return;
    }


    const filtered =
        getWardrobesByPackage();


    const visibleItems =
        filtered.slice(
            0,
            wardrobeCollectionState.packageLimit
        );


    wardrobePackageGrid.innerHTML =
        visibleItems
            .map(createWardrobeCard)
            .join("");


    bindWardrobeCards(
        wardrobePackageGrid
    );


    updatePackageResultHeading(
        filtered.length
    );


    updateLoadMoreButton(

        wardrobePackageLoadMore,

        visibleItems.length,

        filtered.length

    );

}


/* =========================================================
   23. PACKAGE SELECTION
========================================================= */

wardrobePackageCards.forEach(button => {


    button.addEventListener(
        "click",
        event => {


            /*
                Safety:
                if package card gets links/buttons
                later, don't trigger selection
                from those controls.
            */

            if (
                event.target.closest("a")
            ) {

                return;

            }


            const selectedPackage =
                button.dataset.package;


            if (!selectedPackage) {

                return;

            }


            wardrobeCollectionState.selectedPackage =
                selectedPackage;


            /* Reset result limit */

            wardrobeCollectionState.packageLimit =
                PACKAGE_FIRST_LIMIT;


            /* Active card */

            wardrobePackageCards.forEach(item => {


                const active =
                    item === button;


                item.classList.toggle(
                    "active",
                    active
                );


                item.setAttribute(
                    "aria-pressed",
                    String(active)
                );

            });


            renderPackageWardrobes();
            
scrollToWardrobeResult(
    "wardrobePackageResultTitle"
);


        }
    );

});


/* =========================================================
   24. PACKAGE LOAD MORE
========================================================= */

if (wardrobePackageLoadMore) {

    wardrobePackageLoadMore.addEventListener(
        "click",
        () => {


            wardrobeCollectionState.packageLimit +=
                PACKAGE_LOAD_MORE;


          renderPackageWardrobes();

        }
    );

}


/* =========================================================
   25. INITIAL LOAD
========================================================= */

renderInitialWardrobes();

renderTypeWardrobes();

renderPackageWardrobes();

/* =========================================================
   WARDROBE ESTIMATOR PROMO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const section =
        document.querySelector(".wc-estimator-section");

    if (!section) return;


    /* =============================================
       PROCESS STEP HOVER / FOCUS
    ============================================= */

    const steps =
        section.querySelectorAll(".wc-process-step");


    steps.forEach((step, index) => {

        step.dataset.step =
            String(index + 1).padStart(2, "0");


        step.addEventListener("mouseenter", () => {

            steps.forEach(item =>
                item.classList.remove("active")
            );

            step.classList.add("active");

        });


        step.addEventListener("mouseleave", () => {

            step.classList.remove("active");

        });

    });


    /* =============================================
       BUTTON MICRO INTERACTION
    ============================================= */

    const buttons =
        section.querySelectorAll(
            ".wc-main-button, .wc-start-button"
        );


    buttons.forEach(button => {

        button.addEventListener("mouseenter", () => {

            const icon =
                button.querySelector("i");

            if (icon) {
                icon.style.transform =
                    "translateX(2px)";
            }

        });


        button.addEventListener("mouseleave", () => {

            const icon =
                button.querySelector("i");

            if (icon) {
                icon.style.transform =
                    "";
            }

        });

    });

});