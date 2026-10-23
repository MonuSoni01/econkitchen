import {
    wardrobeDesigns
} from "./data/wardrobe-designs.js";


/* =========================================================
   HELPERS
========================================================= */

const $ = selector =>
    document.querySelector(selector);

function escapeHTML(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   GET DESIGN FROM URL
========================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );

const slug =
    params.get("slug");


let design =
    wardrobeDesigns.find(
        item =>
            item.slug === slug
    );


/* FALLBACK */

if (!design) {
    design = wardrobeDesigns[0];
}


/* =========================================================
   DOM
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

const previousLink =
    $("#previousDesign");

const nextLink =
    $("#nextDesign");

const previousTitle =
    $("#previousDesignTitle");

const nextTitle =
    $("#nextDesignTitle");

const similarDesigns =
    $("#similarDesigns");

const favouriteButton =
    $("#favouriteDesign");

const shareButton =
    $("#shareDesign");


/* =========================================================
   PAGE META
========================================================= */

document.title =
    `${design.title} | ECON Kitchen`;


const metaDescription =
    document.querySelector(
        'meta[name="description"]'
    );


if (metaDescription) {

    metaDescription.content =
        design.description ||
        `Explore ${design.title} by ECON Kitchen.`;

}


/* =========================================================
   BASIC DETAILS
========================================================= */

if (breadcrumbTitle) {

    breadcrumbTitle.textContent =
        design.title;

}


if (designCategory) {

    designCategory.textContent =
        design.categoryLabel ||
        "Wardrobe";

}


if (designTitle) {

    designTitle.textContent =
        design.title;

}


if (designDescription) {

    designDescription.textContent =
        design.description || "";

}


/* =========================================================
   GALLERY
========================================================= */

const galleryImages =
    Array.isArray(design.images) &&
    design.images.length
        ? design.images
        : [design.image];


let currentImageIndex = 0;


function updateImageCounter() {

    if (!imageCount) {
        return;
    }

    imageCount.textContent =
        `${currentImageIndex + 1} / ${galleryImages.length}`;

}


function showImage(index) {

    if (!galleryImages.length) {
        return;
    }


    if (index < 0) {

        index =
            galleryImages.length - 1;

    }


    if (
        index >=
        galleryImages.length
    ) {

        index = 0;

    }


    currentImageIndex = index;


    imageLoader
        ?.classList
        .add("active");


    if (!mainImage) {
        return;
    }


    mainImage.style.opacity = "0";


    const preload =
        new Image();


    preload.onload = () => {

        mainImage.src =
            galleryImages[
                currentImageIndex
            ];

        mainImage.alt =
            `${design.title} - Image ${
                currentImageIndex + 1
            }`;


        requestAnimationFrame(
            () => {

                mainImage.style.opacity =
                    "1";

            }
        );


        imageLoader
            ?.classList
            .remove("active");


        updateImageCounter();

        updateLightbox();

    };


    preload.onerror = () => {

        imageLoader
            ?.classList
            .remove("active");

    };


    preload.src =
        galleryImages[
            currentImageIndex
        ];

}


/* PREVIOUS */

$("#galleryPrev")
    ?.addEventListener(
        "click",
        () => {

            showImage(
                currentImageIndex - 1
            );

        }
    );


/* NEXT */

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

function renderSpecifications() {

    if (!specificationTable) {
        return;
    }


    const specifications = [

        {
            label:
                "Wardrobe Type",

            value:
                design.categoryLabel ||
                "Wardrobe"
        },

        {
            label:
                "Size",

            value:
                design.size ||
                "Custom Size"
        },

        {
            label:
                "Material",

            value:
                design.material ||
                "Customisable"
        },

        {
            label:
                "Finish",

            value:
                design.finish ||
                "Customisable"
        }

    ];


    specificationTable.innerHTML =
        specifications
            .map(item => `

                <div class="kd-spec-row">

                    <span class="kd-spec-label">

                        ${escapeHTML(
                            item.label
                        )}

                    </span>


                    <span class="kd-spec-value">

                        ${escapeHTML(
                            item.value
                        )}

                    </span>

                </div>

            `)
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
            design.features
        )
            ? design.features
            : [];


    designFeatures.innerHTML =
        features
            .map(feature => `

                <div class="kd-feature">

                    <i class="fa-solid fa-check"></i>

                    <span>
                        ${escapeHTML(feature)}
                    </span>

                </div>

            `)
            .join("");

}


renderFeatures();


/* =========================================================
   READ MORE
========================================================= */

const readMoreButton =
    $("#kdReadMore");

const readMoreContent =
    $("#readMoreContent");


readMoreButton
    ?.addEventListener(
        "click",
        () => {

            const isOpen =
                readMoreContent
                    ?.classList
                    .toggle(
                        "active"
                    );


            readMoreButton
                .classList
                .toggle(
                    "active",
                    Boolean(isOpen)
                );


            const text =
                readMoreButton
                    .querySelector(
                        "span"
                    );


            if (text) {

                text.textContent =
                    isOpen
                        ? "Read Less"
                        : "Read More";

            }

        }
    );


/* =========================================================
   PREVIOUS + NEXT DESIGN
========================================================= */

const currentDesignIndex =
    wardrobeDesigns.findIndex(
        item =>
            item.slug ===
            design.slug
    );


const previousIndex =
    currentDesignIndex <= 0

        ? wardrobeDesigns.length - 1

        : currentDesignIndex - 1;


const nextIndex =
    currentDesignIndex >=
    wardrobeDesigns.length - 1

        ? 0

        : currentDesignIndex + 1;


const previousDesign =
    wardrobeDesigns[
        previousIndex
    ];


const nextDesign =
    wardrobeDesigns[
        nextIndex
    ];


/* PREVIOUS */

if (
    previousLink &&
    previousDesign
) {

    previousLink.href =
        `/wardrobe-design.html?slug=${
            encodeURIComponent(
                previousDesign.slug
            )
        }`;


    if (previousTitle) {

        previousTitle.textContent =
            previousDesign.title;

    }

}


/* NEXT */

if (
    nextLink &&
    nextDesign
) {

    nextLink.href =
        `/wardrobe-design.html?slug=${
            encodeURIComponent(
                nextDesign.slug
            )
        }`;


    if (nextTitle) {

        nextTitle.textContent =
            nextDesign.title;

    }

}


/* =========================================================
   SIMILAR DESIGNS
========================================================= */

function renderSimilarDesigns() {

    if (!similarDesigns) {
        return;
    }


    /* SAME CATEGORY FIRST */

    let similar =
        wardrobeDesigns.filter(
            item =>

                item.slug !==
                design.slug &&

                item.category ===
                design.category
        );


    /* OTHER DESIGNS */

    const remaining =
        wardrobeDesigns.filter(
            item =>

                item.slug !==
                design.slug &&

                !similar.some(
                    existing =>
                        existing.slug ===
                        item.slug
                )
        );


    similar = [
        ...similar,
        ...remaining
    ];


    /* MAX 10 */

    similar =
        similar.slice(
            0,
            10
        );


    similarDesigns.innerHTML =
        similar
            .map(item => `

                <a
                    href="/wardrobe-design.html?slug=${
                        encodeURIComponent(
                            item.slug
                        )
                    }"
                    class="kd-similar-card"
                >


                    <div class="kd-similar-image">

                        <img
                            src="${escapeHTML(
                                item.image
                            )}"
                            alt="${escapeHTML(
                                item.title
                            )}"
                            loading="lazy"
                        >

                    </div>


                    <div class="kd-similar-content">


                        <small>

                            ${escapeHTML(
                                item.categoryLabel ||
                                "Wardrobe"
                            )}

                        </small>


                        <h3>

                            ${escapeHTML(
                                item.title
                            )}

                        </h3>


                        ${
                            item.size
                                ? `

                                    <span class="kd-similar-size">

                                        Size:
                                        ${escapeHTML(
                                            item.size
                                        )}

                                    </span>

                                `
                                : ""
                        }


                    </div>


                </a>

            `)
            .join("");

}


renderSimilarDesigns();


/* =========================================================
   SIMILAR SLIDER
========================================================= */

function getSliderAmount() {

    const card =
        similarDesigns
            ?.querySelector(".kd-similar-card");

    if (!card || !similarDesigns) {
        return 400;
    }

    const styles =
        window.getComputedStyle(similarDesigns);

    const gap =
        parseFloat(
            styles.columnGap || styles.gap
        ) || 0;

    return (
        card.getBoundingClientRect().width +
        gap
    );

}

$("#similarNext")
    ?.addEventListener(
        "click",
        () => {

            similarDesigns
                ?.scrollBy({

                    left:
                        getSliderAmount(),

                    behavior:
                        "smooth"

                });

        }
    );


$("#similarPrev")
    ?.addEventListener(
        "click",
        () => {

            similarDesigns
                ?.scrollBy({

                    left:
                        -getSliderAmount(),

                    behavior:
                        "smooth"

                });

        }
    );


/* =========================================================
   FAQ DATA
========================================================= */

function getFaqs() {


    /* ---------------------------------------------
       IF API/DATA HAS FAQ
    --------------------------------------------- */

    if (
        Array.isArray(
            design.faqs
        ) &&
        design.faqs.length
    ) {

        return design.faqs;

    }


    /* ---------------------------------------------
       DEFAULT FAQ
    --------------------------------------------- */

    return [

        {
            question:
                `Can ${design.title} be customised?`,

            answer:
                "Yes. Wardrobe dimensions, internal shelves, hanging sections, drawers, finishes and accessories can be customised according to your room and storage requirements."
        },


        {
            question:
                "Can I change the wardrobe material and finish?",

            answer:
                "Yes. Material and finish options can be selected according to the wardrobe design, budget and overall interior style."
        },


        {
            question:
                "Can the internal storage layout be customised?",

            answer:
                "Yes. Shelves, drawers, hanging sections, shoe storage and accessory organisers can be planned according to your everyday storage requirements."
        },


        {
            question:
                "Does ECON provide wardrobe installation?",

            answer:
                "Yes. Wardrobe installation can be coordinated according to the approved design, measurements and site requirements."
        },


        {
            question:
                "How is the final wardrobe price calculated?",

            answer:
                "Wardrobe pricing depends on dimensions, selected material, finish, hardware, internal configuration and accessories."
        }

    ];

}


/* =========================================================
   RENDER FAQ
========================================================= */

function renderFaqs() {

    if (!faqList) {
        return;
    }


    const faqs =
        getFaqs();


    faqList.innerHTML =
        faqs
            .map(faq => `

                <article class="kd-faq-item">


                    <button
                        type="button"
                        class="kd-faq-question"
                        aria-expanded="false"
                    >

                        <span>

                            ${escapeHTML(
                                faq.question
                            )}

                        </span>


                        <i class="fa-solid fa-chevron-down"></i>

                    </button>


                    <div class="kd-faq-answer">

                        <p>

                            ${escapeHTML(
                                faq.answer
                            )}

                        </p>

                    </div>


                </article>

            `)
            .join("");


    const faqButtons =
        faqList.querySelectorAll(
            ".kd-faq-question"
        );


    faqButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {


                    const item =
                        button.closest(
                            ".kd-faq-item"
                        );


                    const wasOpen =
                        item
                            ?.classList
                            .contains(
                                "active"
                            );


                    /* CLOSE ALL */

                    faqList
                        .querySelectorAll(
                            ".kd-faq-item"
                        )
                        .forEach(
                            faqItem => {

                                faqItem
                                    .classList
                                    .remove(
                                        "active"
                                    );


                                faqItem
                                    .querySelector(
                                        ".kd-faq-question"
                                    )
                                    ?.setAttribute(
                                        "aria-expanded",
                                        "false"
                                    );

                            }
                        );


                    /* OPEN CURRENT */

                    if (
                        item &&
                        !wasOpen
                    ) {

                        item
                            .classList
                            .add(
                                "active"
                            );


                        button.setAttribute(
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

const favouriteStorageKey =
    "econWardrobeFavourites";


function getFavourites() {

    try {

        const data =
            localStorage.getItem(
                favouriteStorageKey
            );


        return data
            ? JSON.parse(data)
            : [];

    } catch (error) {

        console.warn(
            "Unable to load favourites",
            error
        );

        return [];

    }

}


function updateFavouriteButton() {

    if (!favouriteButton) {
        return;
    }


    const favourites =
        getFavourites();


    const isFavourite =
        favourites.includes(
            design.id
        );


    favouriteButton
        .classList
        .toggle(
            "active",
            isFavourite
        );


    favouriteButton.setAttribute(
        "aria-pressed",
        String(isFavourite)
    );


    const icon =
        favouriteButton
            .querySelector("i");


    if (icon) {

        icon.className =
            isFavourite
                ? "fa-solid fa-heart"
                : "fa-regular fa-heart";

    }

}


favouriteButton
    ?.addEventListener(
        "click",
        () => {

            let favourites =
                getFavourites();


            if (
                favourites.includes(
                    design.id
                )
            ) {

                favourites =
                    favourites.filter(
                        id =>
                            id !==
                            design.id
                    );

            } else {

                favourites.push(
                    design.id
                );

            }


            localStorage.setItem(
                favouriteStorageKey,
                JSON.stringify(
                    favourites
                )
            );


            updateFavouriteButton();

        }
    );


updateFavouriteButton();


/* =========================================================
   SHARE
========================================================= */

shareButton
    ?.addEventListener(
        "click",
        async () => {


            const shareData = {

                title:
                    design.title,

                text:
                    `Check out ${design.title} by ECON Kitchen.`,

                url:
                    window.location.href

            };


            try {


                /* NATIVE SHARE */

                if (navigator.share) {

                    await navigator.share(
                        shareData
                    );

                    return;

                }


                /* COPY LINK */

                await navigator
                    .clipboard
                    .writeText(
                        window.location.href
                    );


                const oldHTML =
                    shareButton.innerHTML;


                shareButton.innerHTML =
                    `<i class="fa-solid fa-check"></i>`;


                setTimeout(
                    () => {

                        shareButton.innerHTML =
                            oldHTML;

                    },
                    1200
                );


            } catch (error) {

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
        galleryImages[
            currentImageIndex
        ];


    lightboxImage.alt =
        `${design.title} - Image ${
            currentImageIndex + 1
        }`;


    if (lightboxCount) {

        lightboxCount.textContent =
            `${currentImageIndex + 1} / ${galleryImages.length}`;

    }

}


function openLightbox() {

    if (!lightbox) {
        return;
    }


    updateLightbox();


    lightbox
        .classList
        .add("active");


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


function closeLightbox() {

    if (!lightbox) {
        return;
    }


    lightbox
        .classList
        .remove("active");


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* OPEN */

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


/* CLOSE */

$("#closeLightbox")
    ?.addEventListener(
        "click",
        closeLightbox
    );


/* PREVIOUS */

$("#lightboxPrev")
    ?.addEventListener(
        "click",
        () => {

            showImage(
                currentImageIndex - 1
            );

        }
    );


/* NEXT */

$("#lightboxNext")
    ?.addEventListener(
        "click",
        () => {

            showImage(
                currentImageIndex + 1
            );

        }
    );


/* BACKDROP */

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
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {


        if (
            event.key ===
            "Escape"
        ) {

            if (
                lightbox
                    ?.classList
                    .contains(
                        "active"
                    )
            ) {

                closeLightbox();

            }

            return;

        }


        if (
            !lightbox
                ?.classList
                .contains(
                    "active"
                )
        ) {

            return;

        }


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
);


/* =========================================================
   MOBILE SWIPE
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

            } else {

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
   INITIAL
========================================================= */

showImage(0);