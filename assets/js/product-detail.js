/* =========================================================
   ECON KITCHEN
   E-COMMERCE PRODUCT DETAIL PAGE
   COMPLETE JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PRODUCT DATA
       YAHAN APNE ACTUAL PRODUCT KI DETAILS CHANGE KARNA
    ===================================================== */

    const product = {

        title: "Premium Modular Kitchen Cabinet",

        subtitle:
            "Custom-designed kitchen solution with premium finish and intelligent storage.",

        price: 128600,

        mrp: 159420,

        rating: 4.8,

        ratingCount: 128,

        reviewCount: 42,

        /* =================================================
            
        ================================================= */

        images: [
    "https://rukminim2.flixcart.com/image/2000/2660/kqqykcw0/kitchen-cabinet/i/i/n/plywood-cute-d-fm-8ftw-wu-5ftw-cutekitchen-frosty-white-original-imag4zsjwyduvg3h.jpeg?q=60",
    "https://rukminim2.flixcart.com/image/1000/1340/kqmo8sw0/kitchen-cabinet/n/b/g/plywood-cute-d-fm-8ftw-wu-5ftw-cutekitchen-frosty-white-original-imag4hjgm5qx9hpj.jpeg?q=60",
    "https://rukminim2.flixcart.com/image/2000/2660/kqmo8sw0/kitchen-cabinet/e/k/s/plywood-cute-d-fm-8ftw-wu-5ftw-cutekitchen-frosty-white-original-imag4hjgh6nhmuje.jpeg?q=60",
    "https://rukminim2.flixcart.com/image/1000/1340/kqqykcw0/kitchen-cabinet/i/i/n/plywood-cute-d-fm-8ftw-wu-5ftw-cutekitchen-frosty-white-original-imag4zsjwyduvg3h.jpeg?q=60"
]

    };


    /* =====================================================
       SIMILAR PRODUCTS DATA
    ===================================================== */

    const similarProducts = [

        {
            title: "Modern L-Shape Kitchen",
            category: "MODULAR KITCHEN",
            price: 145000,
            mrp: 172000,
            image:
                "/assets/images/products/similar-1.jpg",
            url: "#"
        },

        {
            title: "Warm Walnut Kitchen",
            category: "PREMIUM KITCHEN",
            price: 158000,
            mrp: 189000,
            image:
                "/assets/images/products/similar-2.jpg",
            url: "#"
        },

        {
            title: "Minimal White Kitchen",
            category: "MODULAR KITCHEN",
            price: 132000,
            mrp: 156000,
            image:
                "/assets/images/products/similar-3.jpg",
            url: "#"
        },

        {
            title: "Urban Grey Kitchen",
            category: "CONTEMPORARY",
            price: 149000,
            mrp: 178000,
            image:
                "/assets/images/products/similar-4.jpg",
            url: "#"
        },

        {
            title: "Luxury Island Kitchen",
            category: "PREMIUM KITCHEN",
            price: 195000,
            mrp: 228000,
            image:
                "/assets/images/products/similar-5.jpg",
            url: "#"
        }

    ];


    /* =====================================================
       HELPERS
    ===================================================== */

    const $ = selector =>
        document.querySelector(selector);

    const $$ = selector =>
        document.querySelectorAll(selector);


    function money(value) {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(value);

    }


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const mainImage =
        $("#mainProductImage");

    const thumbs =
        $("#productThumbs");

    const title =
        $("#productTitle");

    const subtitle =
        $("#productSubtitle");

    const breadcrumb =
        $("#breadcrumbName");

    const salePrice =
        $("#salePrice");

    const mrpPrice =
        $("#mrpPrice");

    const discountText =
        $("#discountText");

    const discountBadge =
        $("#discountBadge");


    /* =====================================================
       CURRENT IMAGE
    ===================================================== */

    let currentImage = 0;


    /* =====================================================
       RENDER PRODUCT
    ===================================================== */

    function renderProduct() {

        if (title) {
            title.textContent =
                product.title;
        }

        if (subtitle) {
            subtitle.textContent =
                product.subtitle;
        }

        if (breadcrumb) {
            breadcrumb.textContent =
                product.title;
        }

        if (salePrice) {
            salePrice.textContent =
                money(product.price);
        }

        if (mrpPrice) {
            mrpPrice.textContent =
                money(product.mrp);
        }


        /* =================================================
           DISCOUNT CALCULATION
        ================================================= */

        const discount =
            Math.round(
                (
                    1 -
                    product.price /
                    product.mrp
                ) * 100
            );


        if (discountText) {

            discountText.textContent =
                `${discount}% off`;

        }


        if (discountBadge) {

            discountBadge.textContent =
                `${discount}% OFF`;

        }


        /* =================================================
           THUMBNAILS
        ================================================= */

        if (thumbs) {

            thumbs.innerHTML =
                product.images
                    .map(
                        (image, index) => {

                            return `

                                <button
                                    class="
                                        ep-thumb
                                        ${
                                            index === 0
                                                ? "active"
                                                : ""
                                        }
                                    "
                                    type="button"
                                    data-index="${index}"
                                >

                                    <img
                                        src="${image}"
                                        alt="
                                            ${product.title}
                                            View ${index + 1}
                                        "
                                        loading="lazy"
                                    >

                                </button>

                            `;

                        }
                    )
                    .join("");

        }


        /* =================================================
           THUMBNAIL CLICK
        ================================================= */

        $$(".ep-thumb")
            .forEach(
                thumb => {

                    thumb.addEventListener(
                        "click",
                        () => {

                            const index =
                                Number(
                                    thumb.dataset.index
                                );

                            showImage(index);

                        }
                    );

                }
            );


        /* =================================================
           FIRST IMAGE
        ================================================= */

        showImage(0);

    }


    /* =====================================================
       SHOW IMAGE
    ===================================================== */

    function showImage(index) {

        if (
            !product.images ||
            !product.images.length
        ) {
            return;
        }


        /* LOOP BACKWARD */

        if (index < 0) {

            index =
                product.images.length - 1;

        }


        /* LOOP FORWARD */

        if (
            index >=
            product.images.length
        ) {

            index = 0;

        }


        currentImage = index;


        const image =
            product.images[index];


        /* =================================================
           MAIN IMAGE
        ================================================= */

        if (mainImage) {

            mainImage.style.opacity = "0";

            setTimeout(
                () => {

                    mainImage.src = image;

                    mainImage.alt =
                        `${product.title} - View ${
                            index + 1
                        }`;

                    mainImage.style.opacity =
                        "1";

                },
                120
            );

        }


        /* =================================================
           ACTIVE THUMBNAIL
        ================================================= */

        $$(".ep-thumb")
            .forEach(
                (thumb, thumbIndex) => {

                    thumb.classList.toggle(
                        "active",
                        thumbIndex === index
                    );

                }
            );


        /* =================================================
           LIGHTBOX IMAGE
        ================================================= */

        const lightboxImage =
            $("#lightboxImage");

        if (lightboxImage) {

            lightboxImage.src =
                image;

        }

    }


    /* =====================================================
       PRODUCT IMAGE PREVIOUS
    ===================================================== */

    $("#imagePrev")
        ?.addEventListener(
            "click",
            () => {

                showImage(
                    currentImage - 1
                );

            }
        );


    /* =====================================================
       PRODUCT IMAGE NEXT
    ===================================================== */

    $("#imageNext")
        ?.addEventListener(
            "click",
            () => {

                showImage(
                    currentImage + 1
                );

            }
        );


    /* =====================================================
       IMAGE ERROR FALLBACK
    ===================================================== */

    mainImage
        ?.addEventListener(
            "error",
            () => {

                mainImage.src =
                    "https://placehold.co/900x900/f1efe9/171717?text=ECON+Kitchen";

            }
        );


    /* =====================================================
       FAVOURITE
    ===================================================== */

    const favouriteButton =
        $("#favoriteBtn");


    favouriteButton
        ?.addEventListener(
            "click",
            function () {

                this.classList.toggle(
                    "active"
                );


                const icon =
                    this.querySelector("i");


                if (
                    this.classList.contains(
                        "active"
                    )
                ) {

                    icon.className =
                        "fa-solid fa-heart";

                } else {

                    icon.className =
                        "fa-regular fa-heart";

                }

            }
        );


    /* =====================================================
       MOBILE FAVOURITE
    ===================================================== */

    $("#mobileSave")
        ?.addEventListener(
            "click",
            () => {

                favouriteButton
                    ?.click();

            }
        );


    /* =====================================================
       SAVE DESIGN
    ===================================================== */

    $("#addToPlanBtn")
        ?.addEventListener(
            "click",
            function () {

                this.classList.toggle(
                    "active"
                );


                const saved =
                    this.classList.contains(
                        "active"
                    );


                if (saved) {

                    this.innerHTML = `

                        <i
                            class="
                                fa-solid
                                fa-check
                            "
                        ></i>

                        Saved

                    `;

                } else {

                    this.innerHTML = `

                        <i
                            class="
                                fa-regular
                                fa-bookmark
                            "
                        ></i>

                        Save Design

                    `;

                }

            }
        );


    /* =====================================================
       FINISH / COLOR SELECTION
    ===================================================== */

    $$(".ep-swatch")
        .forEach(
            swatch => {

                swatch.addEventListener(
                    "click",
                    () => {

                        $$(".ep-swatch")
                            .forEach(
                                item => {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        swatch.classList.add(
                            "active"
                        );


                        const finish =
                            swatch.dataset.finish;


                        const selected =
                            $("#selectedFinish");


                        if (selected) {

                            selected.textContent =
                                finish;

                        }

                    }
                );

            }
        );


    /* =====================================================
       PINCODE CHECK
    ===================================================== */

    const pincodeInput =
        $("#pincodeInput");

    const pincodeResult =
        $("#pincodeResult");


    $("#checkPincode")
        ?.addEventListener(
            "click",
            checkPincode
        );


    pincodeInput
        ?.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    checkPincode();

                }

            }
        );


    function checkPincode() {

        if (
            !pincodeInput ||
            !pincodeResult
        ) {
            return;
        }


        const pincode =
            pincodeInput
                .value
                .trim();


        pincodeResult
            .classList
            .remove(
                "success",
                "error"
            );


        if (
            !/^\d{6}$/.test(
                pincode
            )
        ) {

            pincodeResult.textContent =
                "Please enter a valid 6-digit pincode.";

            pincodeResult
                .classList
                .add(
                    "error"
                );

            return;

        }


        pincodeResult.textContent =
            "Great! Design consultation and delivery availability can be checked for this location.";


        pincodeResult
            .classList
            .add(
                "success"
            );

    }


    /* =====================================================
       SHARE PRODUCT
    ===================================================== */

    $("#shareBtn")
        ?.addEventListener(
            "click",
            async function () {

                const shareData = {

                    title:
                        product.title,

                    text:
                        `Explore ${product.title} by ECON Kitchen.`,

                    url:
                        window.location.href

                };


                try {

                    if (
                        navigator.share
                    ) {

                        await navigator.share(
                            shareData
                        );

                        return;

                    }


                    await navigator
                        .clipboard
                        .writeText(
                            window.location.href
                        );


                    const icon =
                        this.querySelector("i");


                    const oldClass =
                        icon.className;


                    icon.className =
                        "fa-solid fa-check";


                    setTimeout(
                        () => {

                            icon.className =
                                oldClass;

                        },
                        1200
                    );

                } catch (error) {

                    console.log(
                        "Share cancelled"
                    );

                }

            }
        );


    /* =====================================================
       FAQ ACCORDION
    ===================================================== */

    $$(".ep-faq article button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const item =
                            button.closest(
                                "article"
                            );


                        const open =
                            item.classList
                                .contains(
                                    "active"
                                );


                        $$(".ep-faq article")
                            .forEach(
                                faq => {

                                    faq.classList
                                        .remove(
                                            "active"
                                        );

                                }
                            );


                        if (!open) {

                            item.classList.add(
                                "active"
                            );

                        }

                    }
                );

            }
        );


    /* =====================================================
       SIMILAR PRODUCTS
    ===================================================== */

    function renderSimilarProducts() {

        const container =
            $("#similarProducts");


        if (!container) {
            return;
        }


        container.innerHTML =
            similarProducts
                .map(
                    product => {

                        return `

                            <a
                                href="${product.url}"
                                class="ep-product-card"
                            >

                                <img
                                    src="${product.image}"
                                    alt="${product.title}"
                                    loading="lazy"
                                    onerror="
                                        this.src=
                                        'https://placehold.co/600x600/f1efe9/171717?text=ECON'
                                    "
                                >

                                <div
                                    class="
                                        ep-product-card-body
                                    "
                                >

                                    <small>

                                        ${
                                            product.category
                                        }

                                    </small>


                                    <h3>

                                        ${
                                            product.title
                                        }

                                    </h3>


                                    <strong>

                                        ${
                                            money(
                                                product.price
                                            )
                                        }

                                    </strong>


                                    <del>

                                        ${
                                            money(
                                                product.mrp
                                            )
                                        }

                                    </del>

                                </div>

                            </a>

                        `;

                    }
                )
                .join("");

    }


    renderSimilarProducts();


    /* =====================================================
       SIMILAR PRODUCT SLIDER
    ===================================================== */

    function getSliderAmount() {

        const slider =
            $("#similarProducts");


        const card =
            slider
                ?.querySelector(
                    ".ep-product-card"
                );


        if (
            !slider ||
            !card
        ) {

            return 320;

        }


        const styles =
            window.getComputedStyle(
                slider
            );


        const gap =
            parseFloat(
                styles.columnGap ||
                styles.gap
            ) || 0;


        return (
            card
                .getBoundingClientRect()
                .width +
            gap
        );

    }


    $("#similarNext")
        ?.addEventListener(
            "click",
            () => {

                $("#similarProducts")
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

                $("#similarProducts")
                    ?.scrollBy({

                        left:
                            -getSliderAmount(),

                        behavior:
                            "smooth"

                    });

            }
        );


    /* =====================================================
       LIGHTBOX
    ===================================================== */

    const lightbox =
        $("#productLightbox");


    const lightboxImage =
        $("#lightboxImage");


    function openLightbox() {

        if (
            !lightbox ||
            !lightboxImage
        ) {
            return;
        }


        lightboxImage.src =
            product.images[
                currentImage
            ];


        lightbox.classList.add(
            "active"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style
            .overflow =
            "hidden";

    }


    function closeLightbox() {

        if (!lightbox) {
            return;
        }


        lightbox.classList.remove(
            "active"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style
            .overflow =
            "";

    }


    $("#zoomBtn")
        ?.addEventListener(
            "click",
            openLightbox
        );


    mainImage
        ?.addEventListener(
            "click",
            openLightbox
        );


    $("#lightboxClose")
        ?.addEventListener(
            "click",
            closeLightbox
        );


    $("#lightboxPrev")
        ?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                showImage(
                    currentImage - 1
                );

            }
        );


    $("#lightboxNext")
        ?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                showImage(
                    currentImage + 1
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


    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

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
                "Escape"
            ) {

                closeLightbox();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                showImage(
                    currentImage - 1
                );

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                showImage(
                    currentImage + 1
                );

            }

        }
    );


    /* =====================================================
       MOBILE SWIPE
    ===================================================== */

    let touchStartX = 0;


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

                const touchEndX =
                    event.changedTouches[0]
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
                        currentImage + 1
                    );

                } else {

                    showImage(
                        currentImage - 1
                    );

                }

            },
            {
                passive: true
            }
        );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    renderProduct();

});