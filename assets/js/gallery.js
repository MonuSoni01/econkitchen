/* =========================================================
   ECON KITCHEN — GALLERY
   File: /assets/js/gallery.js
========================================================= */

import { galleryData } from "./data/gallery-data.js";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const galleryGrid = document.getElementById("galleryGrid");
const galleryFilters = document.getElementById("galleryFilters");
const galleryEmpty = document.getElementById("galleryEmpty");

/* Lightbox */
const lightbox = document.getElementById("galleryLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxWhatsapp =
    document.getElementById("lightboxWhatsapp");

const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");


/* =========================================================
   STATE
========================================================= */

let currentFilter = "all";

let visibleItems = [...galleryData];

let currentImageIndex = 0;


/* =========================================================
   CHECK
========================================================= */

if (!galleryGrid) {
    console.error("Gallery Grid not found: #galleryGrid");
}

if (!Array.isArray(galleryData)) {
    console.error("galleryData is not an array.");
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value = "") {

    return String(value)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   IMAGE FALLBACK
========================================================= */

function getImage(item) {

    if (item.image) {
        return item.image;
    }

    if (
        Array.isArray(item.images) &&
        item.images.length
    ) {
        return item.images[0];
    }

    return "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=80";
}


/* =========================================================
   GET CATEGORY LABEL
========================================================= */

function getCategoryLabel(item) {

    if (item.categoryLabel) {
        return item.categoryLabel;
    }

    if (!item.category) {
        return "Project";
    }

    return item.category
        .replaceAll("-", " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
}


/* =========================================================
   GET UNIQUE CATEGORIES
========================================================= */

function getCategories() {

    const categories = new Map();

    galleryData.forEach(item => {

        if (!item.category) {
            return;
        }

        const category =
            String(item.category)
                .trim()
                .toLowerCase();

        if (!categories.has(category)) {

            categories.set(
                category,
                getCategoryLabel(item)
            );

        }

    });

    return Array.from(
        categories,
        ([value, label]) => ({
            value,
            label
        })
    );
}


/* =========================================================
   CREATE FILTER BUTTONS
========================================================= */

function renderFilters() {

    if (!galleryFilters) {
        return;
    }

    galleryFilters.innerHTML = "";

    const filters = [

        {
            value: "all",
            label: "All Projects"
        },

        ...getCategories()

    ];


    filters.forEach(filter => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "gallery-filter";

        button.dataset.filter =
            filter.value;

        button.textContent =
            filter.label;


        if (filter.value === currentFilter) {

            button.classList.add("active");

        }


        button.setAttribute(
            "aria-pressed",
            filter.value === currentFilter
                ? "true"
                : "false"
        );


        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    filter.value;

                updateActiveFilter();

                filterGallery();

            }
        );


        galleryFilters.appendChild(
            button
        );

    });

}


/* =========================================================
   UPDATE ACTIVE FILTER
========================================================= */

function updateActiveFilter() {

    document
        .querySelectorAll(".gallery-filter")
        .forEach(button => {

            const isActive =
                button.dataset.filter ===
                currentFilter;

            button.classList.toggle(
                "active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });

}


/* =========================================================
   FILTER GALLERY
========================================================= */

function filterGallery() {

    if (currentFilter === "all") {

        visibleItems =
            [...galleryData];

    } else {

        visibleItems =
            galleryData.filter(item => {

                return (
                    String(item.category)
                        .trim()
                        .toLowerCase()
                    === currentFilter
                );

            });

    }

    renderGallery();

}


/* =========================================================
   CREATE GALLERY CARD
========================================================= */

 function createGalleryCard(item, index) {

    const card = document.createElement("article");

    card.className = "gallery-card";
    card.tabIndex = 0;

    card.setAttribute("role", "button");

    card.setAttribute(
        "aria-label",
        `View ${item.title || "project"}`
    );

    const image = getImage(item);

    const categoryLabel =
        getCategoryLabel(item);


    card.innerHTML = `

        <div class="gallery-card-image">

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(item.title || "ECON Kitchen Project")}"
                loading="lazy"
            >

            <div class="gallery-card-overlay">

                <button
                    type="button"
                    class="gallery-view-btn"
                    aria-label="View project"
                >
                    <i class="fa-solid fa-expand"></i>
                </button>

            </div>

        </div>


        <div class="gallery-card-content">

            <div class="gallery-card-top">

                <span class="gallery-card-category">
                    ${escapeHTML(categoryLabel)}
                </span>

                ${
                    item.location
                    ? `
                        <span class="gallery-card-location">
                            <i class="fa-solid fa-location-dot"></i>
                            ${escapeHTML(item.location)}
                        </span>
                    `
                    : ""
                }

            </div>


            <h3>
                ${escapeHTML(
                    item.title ||
                    "ECON Interior Project"
                )}
            </h3>


            ${
                item.description
                ? `
                    <p>
                        ${escapeHTML(item.description)}
                    </p>
                `
                : ""
            }


            <div class="gallery-card-footer">

                <span>VIEW PROJECT</span>

                <i class="fa-solid fa-arrow-right"></i>

            </div>

        </div>

    `;


    const img = card.querySelector("img");

    img?.addEventListener("error", function () {

        this.onerror = null;

        this.src =
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=80";

    });


    card.addEventListener("click", () => {
        openLightbox(index);
    });


    card.addEventListener("keydown", event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            openLightbox(index);

        }

    });


    return card;
}

/* =========================================================
   RENDER GALLERY
========================================================= */

function renderGallery() {

    if (!galleryGrid) {
        return;
    }


    galleryGrid.innerHTML = "";


    /* EMPTY */

    if (!visibleItems.length) {

        if (galleryEmpty) {
            galleryEmpty.hidden = false;
        }

        return;
    }


    if (galleryEmpty) {
        galleryEmpty.hidden = true;
    }


    const fragment =
        document.createDocumentFragment();


    visibleItems.forEach(
        (item, index) => {

            fragment.appendChild(

                createGalleryCard(
                    item,
                    index
                )

            );

        }
    );


    galleryGrid.appendChild(
        fragment
    );

}


/* =========================================================
   OPEN LIGHTBOX
========================================================= */

function openLightbox(index) {

    if (
        !lightbox ||
        !visibleItems.length
    ) {
        return;
    }


    currentImageIndex = index;


    updateLightbox();


    lightbox.classList.add(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "gallery-no-scroll"
    );

}


/* =========================================================
   UPDATE LIGHTBOX
========================================================= */

function updateLightbox() {

    const item =
        visibleItems[
            currentImageIndex
        ];


    if (!item) {
        return;
    }


    const image =
        getImage(item);


    if (lightboxImage) {

        lightboxImage.src =
            image;

        lightboxImage.alt =
            item.title ||
            "ECON Kitchen Project";

    }


    if (lightboxTitle) {

        lightboxTitle.textContent =
            item.title ||
            "ECON Project";

    }


    if (lightboxCategory) {

        lightboxCategory.textContent =
            getCategoryLabel(item);

    }


    if (lightboxCounter) {

        lightboxCounter.textContent =
            `${currentImageIndex + 1} / ${visibleItems.length}`;

    }

    /* =========================================================
   WHATSAPP ENQUIRY
========================================================= */

if (lightboxWhatsapp) {

    const projectTitle =
        item.title || "this design";

    const category =
        getCategoryLabel(item);

    const message =
    `Hi ECON Kitchen, I’m interested in the "${projectTitle}" design. ` +
    `I’d like a similar ${category} for my space. Please share more details.`;

    const whatsappNumber = "917060966889";

    lightboxWhatsapp.href =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

}


/* =========================================================
   CLOSE LIGHTBOX
========================================================= */

function closeLightbox() {

    if (!lightbox) {
        return;
    }


    lightbox.classList.remove(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "gallery-no-scroll"
    );

}


/* =========================================================
   NEXT IMAGE
========================================================= */

function nextImage() {

    if (!visibleItems.length) {
        return;
    }


    currentImageIndex =
        (
            currentImageIndex + 1
        )
        %
        visibleItems.length;


    updateLightbox();

}


/* =========================================================
   PREVIOUS IMAGE
========================================================= */

function previousImage() {

    if (!visibleItems.length) {
        return;
    }


    currentImageIndex =
        (
            currentImageIndex
            - 1
            + visibleItems.length
        )
        %
        visibleItems.length;


    updateLightbox();

}


/* =========================================================
   LIGHTBOX BUTTON EVENTS
========================================================= */

lightboxClose?.addEventListener(
    "click",
    closeLightbox
);


lightboxNext?.addEventListener(
    "click",
    nextImage
);


lightboxPrev?.addEventListener(
    "click",
    previousImage
);


/* =========================================================
   BACKDROP CLICK
========================================================= */

document
    .querySelectorAll(
        "[data-lightbox-close]"
    )
    .forEach(element => {

        element.addEventListener(
            "click",
            closeLightbox
        );

    });


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !lightbox ||
            !lightbox.classList.contains(
                "open"
            )
        ) {
            return;
        }


        /* ESC */

        if (event.key === "Escape") {

            closeLightbox();

        }


        /* NEXT */

        if (event.key === "ArrowRight") {

            nextImage();

        }


        /* PREVIOUS */

        if (event.key === "ArrowLeft") {

            previousImage();

        }

    }
);


/* =========================================================
   TOUCH / SWIPE SUPPORT
========================================================= */

let touchStartX = 0;
let touchEndX = 0;


lightbox?.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.changedTouches[0]
                .screenX;

    },
    {
        passive: true
    }
);


lightbox?.addEventListener(
    "touchend",
    event => {

        touchEndX =
            event.changedTouches[0]
                .screenX;


        handleSwipe();

    },
    {
        passive: true
    }
);


function handleSwipe() {

    const distance =
        touchStartX -
        touchEndX;


    /* SWIPE LEFT */

    if (distance > 50) {

        nextImage();

    }


    /* SWIPE RIGHT */

    if (distance < -50) {

        previousImage();

    }

}


/* =========================================================
   INITIALISE GALLERY
========================================================= */

function initGallery() {

    renderFilters();

    filterGallery();

}


/* =========================================================
   START
========================================================= */

initGallery();


console.log(
    `ECON Gallery loaded: ${galleryData.length} projects`
);