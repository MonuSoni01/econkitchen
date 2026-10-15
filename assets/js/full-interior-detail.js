import {
    fullInteriorDesigns
} from "./data/full-interior-designs.js";


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) =>
    document.querySelector(selector);

const $$ = (selector) =>
    document.querySelectorAll(selector);


/* =========================================================
   GET CURRENT SLUG
========================================================= */

const params =
    new URLSearchParams(window.location.search);

const currentSlug =
    params.get("slug");


/* =========================================================
   FIND CURRENT DESIGN
========================================================= */

let design =
    fullInteriorDesigns.find(
        item => item.slug === currentSlug
    );


/*
    If slug is missing / wrong,
    load first interior design.
*/

if (!design) {
    design = fullInteriorDesigns[0];
}


/* =========================================================
   BASIC REFERENCES
========================================================= */

const mainImage =
    $("#mainDesignImage");

const imageLoader =
    $("#imageLoader");

const imageCount =
    $("#imageCount");

const breadcrumbTitle =
    $("#breadcrumbTitle");

const designCategory =
    $("#designCategory");

const designTitle =
    $("#designTitle");

const designDescription =
    $("#designDescription");

const specificationTable =
    $("#specificationTable");

const designFeatures =
    $("#designFeatures");

const faqList =
    $("#faqList");


/* =========================================================
   SAFETY CHECK
========================================================= */

if (!design) {

    console.error(
        "No Full Interior designs found."
    );

}


/* =========================================================
   DUMMY IMAGE FALLBACK
========================================================= */

const dummyImage =
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85";


/* =========================================================
   DESIGN IMAGES
========================================================= */

const designImages = (() => {

    if (
        Array.isArray(design?.images) &&
        design.images.length
    ) {

        return design.images.filter(Boolean);

    }


    if (design?.image) {

        return [
            design.image
        ];

    }


    if (design?.main_image) {

        return [
            design.main_image
        ];

    }


    return [
        dummyImage
    ];

})();


/*
    Ensure gallery always has
    at least one usable image.
*/

if (!designImages.length) {

    designImages.push(
        dummyImage
    );

}


let currentImageIndex = 0;


/* =========================================================
   PAGE META
========================================================= */

if (design) {

    document.title =
        `${design.title} | ECON Kitchen`;

}


/* =========================================================
   CATEGORY LABEL
========================================================= */

function getCategoryLabel(item) {

    if (item?.categoryLabel) {
        return item.categoryLabel;
    }


    const categories = {

        "living-room":
            "Living Room",

        "bedroom":
            "Bedroom",

        "dining":
            "Dining",

        "full-home":
            "Full Home"

    };


    return (
        categories[item?.category] ||
        item?.category ||
        "Full Interior"
    );

}


/* =========================================================
   POPULATE BASIC CONTENT
========================================================= */

if (breadcrumbTitle) {

    breadcrumbTitle.textContent =
        design?.title ||
        "Interior Design";

}


if (designCategory) {

    designCategory.textContent =
        getCategoryLabel(design);

}


if (designTitle) {

    designTitle.textContent =
        design?.title ||
        "Premium Full Home Interior Design";

}


if (designDescription) {

    designDescription.textContent =
        design?.description ||
        design?.shortDescription ||
        "A thoughtfully planned interior designed around your space, lifestyle and requirements.";

}


/* =========================================================
   SHOW IMAGE
========================================================= */

function showImage(index) {

    if (!designImages.length) {
        return;
    }


    /*
        Infinite previous
    */

    if (index < 0) {

        index =
            designImages.length - 1;

    }


    /*
        Infinite next
    */

    if (
        index >=
        designImages.length
    ) {

        index = 0;

    }


    currentImageIndex =
        index;


    /*
        Loader
    */

    if (imageLoader) {

        imageLoader.classList.add(
            "active"
        );

    }


    if (mainImage) {

        mainImage.style.opacity =
            "0";


        const tempImage =
            new Image();


        tempImage.onload = () => {

            mainImage.src =
                designImages[
                    currentImageIndex
                ];


            mainImage.alt =
                `${design?.title || "Interior Design"} - Image ${currentImageIndex + 1}`;


            requestAnimationFrame(
                () => {

                    mainImage.style.opacity =
                        "1";

                }
            );


            imageLoader
                ?.classList
                .remove(
                    "active"
                );

        };


        tempImage.onerror = () => {

            /*
                If actual image fails,
                show dummy image.
            */

            mainImage.src =
                dummyImage;

            mainImage.style.opacity =
                "1";


            imageLoader
                ?.classList
                .remove(
                    "active"
                );

        };


        tempImage.src =
            designImages[
                currentImageIndex
            ];

    }


    updateImageCounter();

    updateLightbox();

}


/* =========================================================
   IMAGE COUNTER
========================================================= */

function updateImageCounter() {

    if (!imageCount) {
        return;
    }


    imageCount.textContent =
        `${currentImageIndex + 1} / ${designImages.length}`;

}


/* =========================================================
   MAIN IMAGE ARROWS
========================================================= */

$("#galleryPrev")
    ?.addEventListener(
        "click",
        () => {

            showImage(
                currentImageIndex - 1
            );

        }
    );


$("#galleryNext")
    ?.addEventListener(
        "click",
        () => {

            showImage(
                currentImageIndex + 1
            );

        }
    );


/* =========================================================
   SPECIFICATIONS
========================================================= */

function getSpecifications() {

    /*
        If future data already contains
        specifications array, use it.
    */

    if (
        Array.isArray(
            design?.specifications
        ) &&
        design.specifications.length
    ) {

        return design.specifications;

    }


    /*
        Current Full Interior data uses
        size / finish / material.

        Convert those fields automatically
        into specification rows.
    */

    const specifications = [];


    if (design?.size) {

        specifications.push({

            label:
                design.category ===
                "full-home"
                    ? "Home Type"
                    : "Space",

            value:
                design.size

        });

    }


    if (design?.finish) {

        specifications.push({

            label:
                "Finish",

            value:
                design.finish

        });

    }


    if (design?.material) {

        specifications.push({

            label:
                "Material",

            value:
                design.material

        });

    }


    /*
        Category
    */

    specifications.push({

        label:
            "Interior Type",

        value:
            getCategoryLabel(design)

    });


    /*
        Customisation
    */

    specifications.push({

        label:
            "Customisation",

        value:
            "Available"

    });


    return specifications;

}


/* =========================================================
   RENDER SPECIFICATIONS
========================================================= */

function renderSpecifications() {

    if (!specificationTable) {
        return;
    }


    const specifications =
        getSpecifications();


    specificationTable.innerHTML =
        specifications
            .map(
                spec => `

                    <div class="fid-spec-row">

                        <span class="fid-spec-label">
                            ${escapeHTML(spec.label)}
                        </span>

                        <span class="fid-spec-value">
                            ${escapeHTML(spec.value)}
                        </span>

                    </div>

                `
            )
            .join("");

}


renderSpecifications();


/* =========================================================
   FEATURES
========================================================= */

function renderFeatures() {

    if (!designFeatures) {
        return;
    }


    const features =
        Array.isArray(
            design?.features
        )
            ? design.features
            : [];


    if (!features.length) {

        designFeatures.innerHTML = `

            <div class="fid-feature">

                <i class="fa-solid fa-check"></i>

                <span>
                    Custom Interior Planning
                </span>

            </div>


            <div class="fid-feature">

                <i class="fa-solid fa-check"></i>

                <span>
                    Premium Material Options
                </span>

            </div>

        `;

        return;

    }


    designFeatures.innerHTML =
        features
            .map(
                feature => `

                    <div class="fid-feature">

                        <i class="fa-solid fa-check"></i>

                        <span>
                            ${escapeHTML(feature)}
                        </span>

                    </div>

                `
            )
            .join("");

}


renderFeatures();


/* =========================================================
   READ MORE
========================================================= */

const readMoreButton =
    $("#fidReadMore");

const readMoreContent =
    $("#readMoreContent");


readMoreButton
    ?.addEventListener(
        "click",
        () => {

            const opened =
                readMoreContent
                    ?.classList
                    .toggle(
                        "active"
                    );


            readMoreButton
                .classList
                .toggle(
                    "active",
                    Boolean(opened)
                );


            const label =
                readMoreButton
                    .querySelector(
                        "span"
                    );


            if (label) {

                label.textContent =
                    opened
                        ? "Read Less"
                        : "Read More";

            }

        }
    );


/* =========================================================
   PREVIOUS / NEXT DESIGN
========================================================= */

const currentDesignIndex =
    fullInteriorDesigns.findIndex(
        item =>
            item.slug ===
            design?.slug
    );


const previousIndex =
    currentDesignIndex <= 0
        ? fullInteriorDesigns.length - 1
        : currentDesignIndex - 1;


const nextIndex =
    currentDesignIndex >=
    fullInteriorDesigns.length - 1
        ? 0
        : currentDesignIndex + 1;


const previousDesign =
    fullInteriorDesigns[
        previousIndex
    ];


const nextDesign =
    fullInteriorDesigns[
        nextIndex
    ];


const previousLink =
    $("#previousDesign");

const nextLink =
    $("#nextDesign");


/* =========================================================
   PREVIOUS DESIGN
========================================================= */

if (
    previousLink &&
    previousDesign
) {

    previousLink.href =
        `/full-interior-design.html?slug=${encodeURIComponent(previousDesign.slug)}`;


    const title =
        $("#previousDesignTitle");


    if (title) {

        title.textContent =
            previousDesign.title;

    }

}


/* =========================================================
   NEXT DESIGN
========================================================= */

if (
    nextLink &&
    nextDesign
) {

    nextLink.href =
        `/full-interior-design.html?slug=${encodeURIComponent(nextDesign.slug)}`;


    const title =
        $("#nextDesignTitle");


    if (title) {

        title.textContent =
            nextDesign.title;

    }

}


/* =========================================================
   SIMILAR DESIGNS
========================================================= */

const similarContainer =
    $("#similarDesigns");


function getDesignImage(item) {

    if (item?.image) {
        return item.image;
    }


    if (item?.main_image) {
        return item.main_image;
    }


    if (
        Array.isArray(item?.images) &&
        item.images.length
    ) {

        return item.images[0];

    }


    return dummyImage;

}


function renderSimilarDesigns() {

    if (!similarContainer) {
        return;
    }


    /*
        FIRST PRIORITY:
        Same category
    */

    let similar =
        fullInteriorDesigns.filter(
            item =>

                item.slug !==
                    design?.slug &&

                String(
                    item.category
                ).toLowerCase() ===

                String(
                    design?.category
                ).toLowerCase()

        );


    /*
        If same category doesn't
        have enough designs,
        fill from other categories.
    */

    if (similar.length < 8) {

        const extra =
            fullInteriorDesigns.filter(
                item =>

                    item.slug !==
                        design?.slug &&

                    !similar.some(
                        related =>
                            related.slug ===
                            item.slug
                    )

            );


        similar = [
            ...similar,
            ...extra
        ];

    }


    /*
        Maximum 10 cards
    */

    similar =
        similar.slice(
            0,
            10
        );


    similarContainer.innerHTML =
        similar
            .map(
                item => `

                    <a
                        class="fid-similar-card"
                        href="/full-interior-design.html?slug=${encodeURIComponent(item.slug)}"
                    >

                        <div class="fid-similar-image">

                            <img
                                src="${escapeAttribute(getDesignImage(item))}"
                                alt="${escapeAttribute(item.title)}"
                                loading="lazy"
                                onerror="this.onerror=null;this.src='${dummyImage}';"
                            >

                        </div>


                        <div class="fid-similar-content">

                            <small>
                                ${escapeHTML(getCategoryLabel(item))}
                            </small>

                            <h3>
                                ${escapeHTML(item.title)}
                            </h3>

                            ${
                                item.size
                                    ? `

                                        <span class="fid-similar-size">
                                            ${item.category === "full-home" ? "Home Type" : "Size"}:
                                            ${escapeHTML(item.size)}
                                        </span>

                                      `
                                    : ""
                            }

                        </div>

                    </a>

                `
            )
            .join("");

}


renderSimilarDesigns();


/* =========================================================
   SIMILAR SLIDER
========================================================= */

function getSimilarScrollAmount() {

    const card =
        similarContainer
            ?.querySelector(
                ".fid-similar-card"
            );


    if (!card) {

        return 400;

    }


    return (
        card
            .getBoundingClientRect()
            .width +
        20
    );

}


$("#similarNext")
    ?.addEventListener(
        "click",
        () => {

            similarContainer
                ?.scrollBy({

                    left:
                        getSimilarScrollAmount(),

                    behavior:
                        "smooth"

                });

        }
    );


$("#similarPrev")
    ?.addEventListener(
        "click",
        () => {

            similarContainer
                ?.scrollBy({

                    left:
                        -getSimilarScrollAmount(),

                    behavior:
                        "smooth"

                });

        }
    );


/* =========================================================
   DEFAULT FULL INTERIOR FAQS
========================================================= */

function getDefaultFaqs() {

    return [

        {
            question:
                "Can this interior design be customised for my home?",

            answer:
                "Yes. ECON interior designs can be customised according to your room size, layout, storage requirements, preferred finishes and overall home style."
        },

        {
            question:
                "Can I change the materials and finishes shown in this design?",

            answer:
                "Yes. Material, colour, finish and design selections can be changed based on your requirements, budget and the options available for your project."
        },

        {
            question:
                "Does ECON provide complete home interior solutions?",

            answer:
                "Yes. Depending on your project requirements, ECON can plan multiple spaces including living areas, bedrooms, dining spaces, storage and other interior elements."
        },

        {
            question:
                "How can I get an estimated cost for this interior?",

            answer:
                "You can use the interior cost calculator for an initial estimate or request a consultation for a more detailed quotation based on your actual space and requirements."
        },

        {
            question:
                "Can I choose only selected rooms instead of a full home interior?",

            answer:
                "Yes. You can discuss selected-room interior requirements as well as complete home interior planning during the consultation."
        }

    ];

}


/* =========================================================
   FAQ
========================================================= */

function renderFaqs() {

    if (!faqList) {
        return;
    }


    const faqs =
        (
            Array.isArray(
                design?.faqs
            ) &&
            design.faqs.length
        )
            ? design.faqs
            : getDefaultFaqs();


    faqList.innerHTML =
        faqs
            .map(
                faq => `

                    <article class="fid-faq-item">

                        <button
                            class="fid-faq-question"
                            type="button"
                            aria-expanded="false"
                        >

                            <span>
                                ${escapeHTML(faq.question)}
                            </span>

                            <i class="fa-solid fa-chevron-down"></i>

                        </button>


                        <div class="fid-faq-answer">

                            <p>
                                ${escapeHTML(faq.answer)}
                            </p>

                        </div>

                    </article>

                `
            )
            .join("");


    faqList
        .querySelectorAll(
            ".fid-faq-question"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const item =
                            button.closest(
                                ".fid-faq-item"
                            );


                        if (!item) {
                            return;
                        }


                        const alreadyOpen =
                            item
                                .classList
                                .contains(
                                    "active"
                                );


                        /*
                            CLOSE ALL
                        */

                        faqList
                            .querySelectorAll(
                                ".fid-faq-item"
                            )
                            .forEach(
                                other => {

                                    other
                                        .classList
                                        .remove(
                                            "active"
                                        );


                                    other
                                        .querySelector(
                                            ".fid-faq-question"
                                        )
                                        ?.setAttribute(
                                            "aria-expanded",
                                            "false"
                                        );

                                }
                            );


                        /*
                            OPEN SELECTED
                        */

                        if (!alreadyOpen) {

                            item
                                .classList
                                .add(
                                    "active"
                                );


                            button
                                .setAttribute(
                                    "aria-expanded",
                                    "true"
                                );

                        }

                    }
                );

            }
        );

}


renderFaqs();


/* =========================================================
   FAVOURITES
========================================================= */

const favouriteButton =
    $("#favouriteDesign");

const favouriteStorageKey =
    "econFullInteriorFavourites";


function getFavourites() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    favouriteStorageKey
                ) ||
                "[]"
            );


        return Array.isArray(saved)
            ? saved
            : [];

    }
    catch (error) {

        return [];

    }

}


function saveFavourites(items) {

    try {

        localStorage.setItem(
            favouriteStorageKey,
            JSON.stringify(items)
        );

    }
    catch (error) {

        console.warn(
            "Unable to save favourites.",
            error
        );

    }

}


/* =========================================================
   SET INITIAL FAVOURITE STATE
========================================================= */

function updateFavouriteButton() {

    if (
        !favouriteButton ||
        !design
    ) {
        return;
    }


    const favourites =
        getFavourites();


    const active =
        favourites.includes(
            design.slug
        );


    favouriteButton
        .classList
        .toggle(
            "active",
            active
        );


    const icon =
        favouriteButton
            .querySelector(
                "i"
            );


    if (icon) {

        icon.className =
            active
                ? "fa-solid fa-heart"
                : "fa-regular fa-heart";

    }

}


updateFavouriteButton();


/* =========================================================
   TOGGLE FAVOURITE
========================================================= */

favouriteButton
    ?.addEventListener(
        "click",
        () => {

            if (!design) {
                return;
            }


            let favourites =
                getFavourites();


            const exists =
                favourites.includes(
                    design.slug
                );


            if (exists) {

                favourites =
                    favourites.filter(
                        slug =>
                            slug !==
                            design.slug
                    );

            }
            else {

                favourites.push(
                    design.slug
                );

            }


            saveFavourites(
                favourites
            );


            updateFavouriteButton();

        }
    );


/* =========================================================
   SHARE
========================================================= */

$("#shareDesign")
    ?.addEventListener(
        "click",
        async () => {

            const shareData = {

                title:
                    design?.title ||
                    "ECON Interior Design",

                text:
                    `Check out ${design?.title || "this interior design"} by ECON Kitchen.`,

                url:
                    window.location.href

            };


            try {

                /*
                    Native mobile share
                */

                if (navigator.share) {

                    await navigator.share(
                        shareData
                    );

                    return;

                }


                /*
                    Desktop:
                    copy URL
                */

                await navigator.clipboard
                    .writeText(
                        window.location.href
                    );


                const button =
                    $("#shareDesign");


                if (!button) {
                    return;
                }


                const oldHTML =
                    button.innerHTML;


                button.innerHTML =
                    `<i class="fa-solid fa-check"></i>`;


                setTimeout(
                    () => {

                        button.innerHTML =
                            oldHTML;

                    },
                    1200
                );

            }
            catch (error) {

                console.log(
                    "Share cancelled",
                    error
                );

            }

        }
    );


/* =========================================================
   LIGHTBOX
========================================================= */

const lightbox =
    $("#imageLightbox");

const lightboxImage =
    $("#lightboxImage");

const lightboxCount =
    $("#lightboxCount");


function updateLightbox() {

    if (!lightboxImage) {
        return;
    }


    lightboxImage.src =
        designImages[
            currentImageIndex
        ] ||
        dummyImage;


    lightboxImage.alt =
        `${design?.title || "Interior Design"} - Fullscreen Image ${currentImageIndex + 1}`;


    lightboxImage.onerror =
        function () {

            this.onerror = null;

            this.src =
                dummyImage;

        };


    if (lightboxCount) {

        lightboxCount.textContent =
            `${currentImageIndex + 1} / ${designImages.length}`;

    }

}


/* =========================================================
   OPEN LIGHTBOX
========================================================= */

function openLightbox() {

    if (!lightbox) {
        return;
    }


    updateLightbox();


    lightbox
        .classList
        .add(
            "active"
        );


    lightbox
        .setAttribute(
            "aria-hidden",
            "false"
        );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE LIGHTBOX
========================================================= */

function closeLightbox() {

    if (!lightbox) {
        return;
    }


    lightbox
        .classList
        .remove(
            "active"
        );


    lightbox
        .setAttribute(
            "aria-hidden",
            "true"
        );


    document.body.style.overflow =
        "";

}


/* =========================================================
   OPEN LIGHTBOX EVENTS
========================================================= */

$("#expandImage")
    ?.addEventListener(
        "click",
        openLightbox
    );


mainImage
    ?.addEventListener(
        "click",
        openLightbox
    );


/* =========================================================
   CLOSE LIGHTBOX EVENT
========================================================= */

$("#closeLightbox")
    ?.addEventListener(
        "click",
        closeLightbox
    );


/* =========================================================
   LIGHTBOX PREVIOUS
========================================================= */

$("#lightboxPrev")
    ?.addEventListener(
        "click",
        () => {

            showImage(
                currentImageIndex - 1
            );

        }
    );


/* =========================================================
   LIGHTBOX NEXT
========================================================= */

$("#lightboxNext")
    ?.addEventListener(
        "click",
        () => {

            showImage(
                currentImageIndex + 1
            );

        }
    );


/* =========================================================
   CLICK OUTSIDE LIGHTBOX
========================================================= */

lightbox
    ?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
            ESC
        */

        if (
            event.key ===
                "Escape" &&

            lightbox
                ?.classList
                .contains(
                    "active"
                )
        ) {

            closeLightbox();

            return;

        }


        /*
            Only arrow control
            when lightbox open.
        */

        if (
            lightbox
                ?.classList
                .contains(
                    "active"
                )
        ) {

            if (
                event.key ===
                "ArrowLeft"
            ) {

                showImage(
                    currentImageIndex - 1
                );

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                showImage(
                    currentImageIndex + 1
                );

            }

        }

    }
);


/* =========================================================
   TOUCH SWIPE
========================================================= */

let touchStartX = 0;

let touchEndX = 0;


mainImage
    ?.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event
                    .changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );


mainImage
    ?.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event
                    .changedTouches[0]
                    .screenX;


            const difference =
                touchStartX -
                touchEndX;


            /*
                Ignore small movements.
            */

            if (
                Math.abs(
                    difference
                ) < 45
            ) {

                return;

            }


            /*
                Swipe left = next
            */

            if (
                difference > 0
            ) {

                showImage(
                    currentImageIndex + 1
                );

            }


            /*
                Swipe right = previous
            */

            else {

                showImage(
                    currentImageIndex - 1
                );

            }

        },
        {
            passive: true
        }
    );


/* =========================================================
   LIGHTBOX TOUCH SWIPE
========================================================= */

let lightboxTouchStartX = 0;

let lightboxTouchEndX = 0;


lightbox
    ?.addEventListener(
        "touchstart",
        event => {

            lightboxTouchStartX =
                event
                    .changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );


lightbox
    ?.addEventListener(
        "touchend",
        event => {

            lightboxTouchEndX =
                event
                    .changedTouches[0]
                    .screenX;


            const difference =
                lightboxTouchStartX -
                lightboxTouchEndX;


            if (
                Math.abs(
                    difference
                ) < 45
            ) {

                return;

            }


            if (
                difference > 0
            ) {

                showImage(
                    currentImageIndex + 1
                );

            }
            else {

                showImage(
                    currentImageIndex - 1
                );

            }

        },
        {
            passive: true
        }
    );


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(value) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   INITIAL IMAGE
========================================================= */

showImage(0);