import {
    kitchenDesigns
} from "./kitchen-designs.js";
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
   FIND DESIGN
========================================================= */
let design =
    kitchenDesigns.find(
        item => item.slug === currentSlug
    );
/*
    Fallback to first design
*/
if (!design) {
    design = kitchenDesigns[0];
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
   IMAGES
========================================================= */
const designImages =
    Array.isArray(design.images) &&
    design.images.length
        ? design.images
        : [design.main_image];
let currentImageIndex = 0;
/* =========================================================
   PAGE META
========================================================= */
document.title =
    `${design.title} | ECON Kitchen`;
/* =========================================================
   POPULATE BASIC CONTENT
========================================================= */
if (breadcrumbTitle) {
    breadcrumbTitle.textContent =
        design.title;
}

if (designTitle) {
    designTitle.textContent =
        design.title;
}
if (designDescription) {
    designDescription.textContent =
        design.description ||
        design.shortDescription ||
        "";
}
/* =========================================================
   SHOW IMAGE
========================================================= */
function showImage(index) {
    if (!designImages.length) return;
    if (index < 0) {
        index =
            designImages.length - 1;
    }
    if (index >= designImages.length) {
        index = 0;
    }
    currentImageIndex = index;
    if (imageLoader) {
        imageLoader.classList.add("active");
    }
    if (mainImage) {
        mainImage.style.opacity = "0";
        const requestedIndex = currentImageIndex;
        const tempImage = new Image();
        tempImage.onload = () => {
            if (requestedIndex !== currentImageIndex) return;
            mainImage.src = designImages[requestedIndex];
            mainImage.alt =
                `${design.title} - Image ${currentImageIndex + 1}`;
            requestAnimationFrame(() => {
                mainImage.style.opacity = "1";
            });
            imageLoader?.classList.remove(
                "active"
            );
        };
        tempImage.onerror = () => {
            imageLoader?.classList.remove(
                "active"
            );
        };
        tempImage.src =
            designImages[currentImageIndex];
    }
    updateImageCounter();
    updateLightbox();
}
/* =========================================================
   IMAGE COUNTER
========================================================= */
function updateImageCounter() {
    if (!imageCount) return;
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
function renderSpecifications() {
  if (!specificationTable) return;

  const specifications = Array.isArray(design.specifications)
    ? design.specifications
    : [];

  function normalize(label) {
    return String(label || "")
      .replace(/:$/, "")
      .trim()
      .toLowerCase();
  }

  function priority(label) {
    const key = normalize(label);

    if (
      ["size", "recommended size", "dimensions"].includes(key)
    ) {
      return 0;
    }

    if (["layout", "shape"].includes(key)) {
      return 1;
    }

    return 2;
  }

  const sorted = [...specifications].sort(
    (a, b) => priority(a.label) - priority(b.label)
  );

  specificationTable.replaceChildren();

  sorted.forEach(spec => {
    const row = document.createElement("div");
    row.className = "kd-spec-row";

    const label = document.createElement("span");
    label.className = "kd-spec-label";

    const rank = priority(spec.label);

    label.textContent =
      rank === 0
        ? "Size"
        : rank === 1
          ? "Layout"
          : spec.label;

    const value = document.createElement("span");
    value.className = "kd-spec-value";
    value.textContent = spec.value ?? "";

    row.append(label, value);
    specificationTable.append(row);
  });
}
renderSpecifications();
/* =========================================================
   FEATURES
========================================================= */
function renderFeatures() {
    if (!designFeatures) return;
    const features =
        Array.isArray(design.features)
            ? design.features
            : [];
    designFeatures.innerHTML =
        features.map(feature => `
            <div class="kd-feature">
                <i class="fa-solid fa-check"></i>
                <span>
                    ${feature}
                </span>
            </div>
        `).join("");
}
renderFeatures();
/* =========================================================
   READ MORE
========================================================= */
const readMoreButton =
    $("#kdReadMore");
const readMoreContent =
    $("#readMoreContent");
readMoreButton?.addEventListener(
    "click",
    () => {
        const opened =
            readMoreContent
                ?.classList
                .toggle("active");
        readMoreButton
            .classList
            .toggle(
                "active",
                Boolean(opened)
            );
        const label =
            readMoreButton
                .querySelector("span");
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
    kitchenDesigns.findIndex(
        item => item.slug === design.slug
    );
const previousIndex =
    currentDesignIndex <= 0
        ? kitchenDesigns.length - 1
        : currentDesignIndex - 1;
const nextIndex =
    currentDesignIndex >=
    kitchenDesigns.length - 1
        ? 0
        : currentDesignIndex + 1;
const previousDesign =
    kitchenDesigns[previousIndex];
const nextDesign =
    kitchenDesigns[nextIndex];
const previousLink =
    $("#previousDesign");
const nextLink =
    $("#nextDesign");
if (
    previousLink &&
    previousDesign
) {
    previousLink.href =
        `/kitchen-design.html?slug=${encodeURIComponent(previousDesign.slug)}`;
    const title =
        $("#previousDesignTitle");
    if (title) {
        title.textContent =
            previousDesign.title;
    }
}
if (
    nextLink &&
    nextDesign
) {
    nextLink.href =
        `/kitchen-design.html?slug=${encodeURIComponent(nextDesign.slug)}`;
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
function renderSimilarDesigns() {
    if (!similarContainer) return;
    /*
        First priority:
        same category
    */
    let similar =
        kitchenDesigns.filter(item =>
            item.slug !== design.slug &&
            String(item.category)
                .toLowerCase() ===
            String(design.category)
                .toLowerCase()
        );
    /*
        Fill remaining designs
        if category doesn't have enough
    */
    if (similar.length < 8) {
        const extra =
            kitchenDesigns.filter(item =>
                item.slug !== design.slug &&
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
    similar =
        similar.slice(0, 10);
    similarContainer.innerHTML =
        similar.map(item => `
            <a
                class="kd-similar-card"
                href="/kitchen-design.html?slug=${encodeURIComponent(item.slug)}"
            >
                <div class="kd-similar-image">
                    <img
                        src="${item.main_image}"
                        alt="${item.title}"
                        loading="lazy"
                    >
                </div>
                <div class="kd-similar-content">
                    <small>
                        ${item.category || "Kitchen"}
                    </small>
                    <h3>
                        ${item.title}
                    </h3>
                    ${
                        item.size
                            ? `
                                <span class="kd-similar-size">
                                    Size: ${item.size}
                                </span>
                              `
                            : ""
                    }
                </div>
            </a>
        `).join("");
}
renderSimilarDesigns();
/* =========================================================
   SIMILAR SLIDER
========================================================= */
function getSimilarScrollAmount() {
    const card =
        similarContainer
            ?.querySelector(".kd-similar-card");
    if (!card || !similarContainer) {
        return 400;
    }
    const styles =
        window.getComputedStyle(similarContainer);
    const gap =
        parseFloat(styles.columnGap || styles.gap) || 0;
    return (
        card.getBoundingClientRect().width +
        gap
    );
}
$("#similarNext")
    ?.addEventListener(
        "click",
        () => {
            similarContainer?.scrollBy({
                left:
                    getSimilarScrollAmount(),
                behavior: "smooth"
            });
        }
    );
$("#similarPrev")
    ?.addEventListener(
        "click",
        () => {
            similarContainer?.scrollBy({
                left:
                    -getSimilarScrollAmount(),
                behavior: "smooth"
            });
        }
    );
/* =========================================================
   FAQ
========================================================= */
function renderFaqs() {
    if (!faqList) return;
    const faqs =
        Array.isArray(design.faqs)
            ? design.faqs
            : [];
    faqList.innerHTML =
        faqs.map(
            (faq, index) => `
                <article class="kd-faq-item">
                    <button
                        class="kd-faq-question"
                        type="button"
                        aria-expanded="false"
                    >
                        <span>
                            ${faq.question}
                        </span>
                        <i
                            class="fa-solid fa-chevron-down"
                        ></i>
                    </button>
                    <div class="kd-faq-answer">
                        <p>
                            ${faq.answer}
                        </p>
                    </div>
                </article>
            `
        ).join("");
    faqList
        .querySelectorAll(
            ".kd-faq-question"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    const item =
                        button.closest(
                            ".kd-faq-item"
                        );
                    const alreadyOpen =
                        item.classList
                            .contains(
                                "active"
                            );
                    /*
                        close others
                    */
                    faqList
                        .querySelectorAll(
                            ".kd-faq-item"
                        )
                        .forEach(other => {
                            other.classList
                                .remove(
                                    "active"
                                );
                            other
                                .querySelector(
                                    ".kd-faq-question"
                                )
                                ?.setAttribute(
                                    "aria-expanded",
                                    "false"
                                );
                        });
                    /*
                        open selected
                    */
                    if (!alreadyOpen) {
                        item.classList.add(
                            "active"
                        );
                        button.setAttribute(
                            "aria-expanded",
                            "true"
                        );
                    }
                }
            );
        });
}
renderFaqs();
/* =========================================================
   SHARE
========================================================= */
$("#shareDesign")?.addEventListener("click", async () => {
    const data = { title: design.title, text: `Check out ${design.title} by ECON Kitchen.`, url: location.href };
    if (navigator.share) {
        try { await navigator.share(data); return; }
        catch (error) { if (error.name === "AbortError") return; }
    }
    try {
        await navigator.clipboard.writeText(data.url);
        const button = $("#shareDesign");
        button.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
        button.setAttribute("aria-label", "Link copied");
        setTimeout(() => {
            button.innerHTML = '<i class="fa-solid fa-share-nodes" aria-hidden="true"></i>';
            button.setAttribute("aria-label", "Share design");
        }, 1500);
    } catch {
        window.prompt("Copy this design link:", data.url);
    }
});
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
    if (!lightboxImage) return;
    lightboxImage.src =
        designImages[
            currentImageIndex
        ];
    if (lightboxCount) {
        lightboxCount.textContent =
            `${currentImageIndex + 1} / ${designImages.length}`;
    }
}
function openLightbox() {
    if (!lightbox) return;
    updateLightbox();
    lightbox.classList.add(
        "active"
    );
    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );
    document.body.style.overflow =
        "hidden";
}
function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove(
        "active"
    );
    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );
    document.body.style.overflow =
        "";
}
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
$("#closeLightbox")
    ?.addEventListener(
        "click",
        closeLightbox
    );
$("#lightboxPrev")
    ?.addEventListener(
        "click",
        () => {
            showImage(
                currentImageIndex - 1
            );
        }
    );
$("#lightboxNext")
    ?.addEventListener(
        "click",
        () => {
            showImage(
                currentImageIndex + 1
            );
        }
    );
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
        if (
            event.key === "Escape" &&
            lightbox?.classList.contains(
                "active"
            )
        ) {
            closeLightbox();
            return;
        }
        if (
            lightbox?.classList.contains(
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
   TOUCH SWIPE ON MAIN IMAGE
========================================================= */
let touchStartX = 0;
let touchEndX = 0;
mainImage
    ?.addEventListener(
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
mainImage
    ?.addEventListener(
        "touchend",
        event => {
            touchEndX =
                event.changedTouches[0]
                    .screenX;
            const difference =
                touchStartX -
                touchEndX;
            /*
                Ignore tiny movement
            */
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
   INITIAL IMAGE
========================================================= */
showImage(0);