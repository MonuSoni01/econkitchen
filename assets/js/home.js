import { rows } from "./firebase.js";


/* ==========================================================
   ECON KITCHEN — HOME.JS
   Premium Home Page
   Firebase + Fallback Data
========================================================== */


/* ==========================================================
   FALLBACK DATA
========================================================== */

const fallback = {

   heroSlides: [
    {
        title: "Designed for Your Home.|Built in Our Factory.",
        subtitle:
            "Factory-finish modular kitchens designed for your space, style and everyday needs.",
        image:
            "/assets/images/hero-banner.png"
    },
    {
        title: "Smart Storage.|Made for Everyday Life.",
        subtitle:
            "Better storage, quality materials and smart kitchen solutions that make everyday work easier.",
        image:
            "/assets/images/hero-banner02.png"
    },
    {
        title: "Your Kitchen.|Your Style.",
        subtitle:
            "Choose your layout, colours, finishes and accessories to create a kitchen that feels truly yours.",
        image:
            "/assets/images/hero-banner03.png"
    }
],

    services: [
        [
            "Modular Kitchens",
            "Functional kitchens designed around your lifestyle.",
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=82"
        ],
        [
            "Wardrobes",
            "Beautiful storage, thoughtfully planned.",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=82"
        ],
        [
            "Full Home Interiors",
            "One cohesive vision across your home.",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=82"
        ],
        [
            "Kitchen Accessories",
            "Smart functionality inside every cabinet.",
            "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=900&q=82"
        ]
    ],


    gallery: [
        [
            "Warm Walnut Kitchen",
            "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1200&q=85"
        ],
        [
            "Modern Wardrobe",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85"
        ],
        [
            "Minimal Kitchen",
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=85"
        ],
        [
            "Contemporary Home",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85"
        ],
        [
            "Smart Storage",
            "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=900&q=85"
        ]
    ],


    why: [
        [
            "01",
            "Tailored Designs",
            "Planned around your dimensions, habits and lifestyle."
        ],
        [
            "02",
            "Premium Materials",
            "Finishes selected for aesthetics, performance and everyday use."
        ],
        [
            "03",
            "Smart Storage",
            "Thoughtful planning that makes every corner work harder."
        ],
        [
            "04",
            "Quality Craftsmanship",
            "Attention to detail from production through installation."
        ],
        [
            "05",
            "End-to-End Support",
            "A guided journey from your first idea to the finished space."
        ]
    ],


    projects: [
        [
            "Warm Minimal Kitchen",
            "Meerut",
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=82"
        ],
        [
            "Contemporary Kitchen",
            "Delhi NCR",
            "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1000&q=82"
        ],
        [
            "Modern Wardrobe",
            "Noida",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=82"
        ]
    ],


    testimonials: [
        [
            "A beautifully planned experience from layout discussion to the final finish.",
            "Customer Story",
            "Meerut"
        ],
        [
            "The storage planning made our kitchen feel much larger and easier to use.",
            "Homeowner",
            "NCR"
        ],
        [
            "The material selection and design process felt organised and premium.",
            "Interior Customer",
            "Uttar Pradesh"
        ]
    ],


    blogs: [
        [
            "How to Choose the Right Kitchen Layout",
            "A practical guide to L-shape, U-shape, parallel and island kitchens."
        ],
        [
            "Acrylic vs Laminate",
            "Compare appearance, maintenance and everyday usability."
        ],
        [
            "7 Storage Ideas for Compact Kitchens",
            "Smart ideas that help smaller kitchens work harder."
        ]
    ],


    faqs: [
        [
            "How much does a modular kitchen cost?",
            "Cost depends on layout, dimensions, material, finish, hardware and accessories. Use our calculator for an indicative estimate."
        ],
        [
            "Which kitchen layout is right for my space?",
            "The right layout depends on room dimensions, doors, windows, workflow and storage requirements."
        ],
        [
            "How long does installation take?",
            "Timelines vary depending on scope and approved design. Your project plan should confirm production and installation milestones."
        ],
        [
            "Can website content be managed from the admin panel?",
            "Yes. Supported sections can be managed through the Firebase-backed admin panel."
        ]
    ]

};


/* ==========================================================
   FIREBASE / FALLBACK HELPER
========================================================== */

async function getData(collection) {

    try {

        const data = await rows(collection);

        if (Array.isArray(data) && data.length > 0) {
            return data;
        }

    } catch (error) {

        console.warn(
            `[ECON] Firebase collection "${collection}" unavailable. Using fallback.`,
            error
        );

    }

    return fallback[collection] || [];
}


/* ==========================================================
   SAFE VALUE HELPER
========================================================== */

function value(item, key, index, fallbackValue = "") {

    if (item && typeof item === "object" && !Array.isArray(item)) {

        if (
            item[key] !== undefined &&
            item[key] !== null
        ) {
            return item[key];
        }

    }

    if (Array.isArray(item)) {
        return item[index] ?? fallbackValue;
    }

    return fallbackValue;
}


/* ==========================================================
   HERO
========================================================== */

const heroElement =
    document.querySelector("#hero");

const heroData =
    await getData("heroSlides");


if (heroElement && heroData.length) {

    heroElement.innerHTML = `

        ${heroData.map((item, index) => {

            let rawTitle =
                value(
                    item,
                    "title",
                    0,
                    "Designed Around|The Way You Live."
                );


            const subtitle =
                value(
                    item,
                    "subtitle",
                    1,
                    "Premium modular kitchens crafted for your space, style and everyday life."
                );


            const image =
                value(
                    item,
                    "image",
                    2,
                    ""
                );


            /*
             * Recommended Firebase title:
             *
             * Designed Around|The Way You Live.
             *
             * | = controlled line break
             */

            let titleParts =
                String(rawTitle).split("|");


            /*
             * Backward compatibility:
             * Old Firebase titles without |
             */

            if (titleParts.length === 1) {

                const normalized =
                    String(rawTitle).toLowerCase();


                if (
                    normalized.includes("designed around") &&
                    normalized.includes("way you live")
                ) {

                    titleParts = [
                        "Designed Around",
                        "The Way You Live."
                    ];

                }

                else if (
                    normalized.includes("storage should") &&
                    normalized.includes("beautiful")
                ) {

                    titleParts = [
                        "Storage Should Be",
                        "Beautiful Too."
                    ];

                }

                else if (
                    normalized.includes("home that") &&
                    (
                        normalized.includes("feels yours") ||
                        normalized.includes("feels like")
                    )
                ) {

                    titleParts = [
                        "A Home That",
                        "Feels Like You."
                    ];

                }

            }


            const firstLine =
                titleParts[0] || rawTitle;


            const secondLine =
                titleParts.slice(1).join(" ") || "";


            return `

                <article
                    class="slide ${index === 0 ? "active" : ""}"
                    data-hero-slide="${index}"
                    aria-hidden="${index === 0 ? "false" : "true"}"
                >

                    <img
                        src="${image}"
                        alt="${String(rawTitle).replaceAll("|", " ")}"
                        ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
                    >


                    <div class="hero-copy">

                        <span class="hero-label">
                            MODULAR KITCHENS
                        </span>


                        <h1>

                            <span class="hero-line">
                                ${firstLine}
                            </span>

                            ${
                                secondLine
                                    ? `
                                        <span class="hero-accent">
                                            ${secondLine}
                                        </span>
                                      `
                                    : ""
                            }

                        </h1>


                        <p>
                            ${subtitle}
                        </p>


                        <div class="hero-actions">

    <a
        class="hero-primary"
        href="/services/modular-kitchen.html"
    >
        <span class="btn-text">
            EXPLORE KITCHENS
        </span>

        <span class="btn-icon">
            <i>↗</i>
        </span>

    </a>


    <a
        class="hero-secondary"
        href="/contact.html"
    >

        <span class="btn-text">
            DESIGN YOUR KITCHEN
        </span>

        <span class="btn-icon">
            <i>↗</i>
        </span>

    </a>

</div>

                    </div>

                </article>

            `;

        }).join("")}


        <div class="hero-navigation">

            <span class="hero-count">
                01
            </span>


            <div class="dots">

                ${heroData.map((_, index) => `

                    <button
                        class="dot ${index === 0 ? "active" : ""}"
                        type="button"
                        data-slide="${index}"
                        aria-label="Go to hero slide ${index + 1}"
                        aria-current="${index === 0 ? "true" : "false"}"
                    ></button>

                `).join("")}

            </div>

        </div>


        <div class="hero-arrows">

            <button
                class="hero-prev"
                type="button"
                aria-label="Previous slide"
            >
                ←
            </button>

            <button
                class="hero-next"
                type="button"
                aria-label="Next slide"
            >
                →
            </button>

        </div>

    `;


    const heroSlides =
        [...heroElement.querySelectorAll(".slide")];


    const heroDots =
        [...heroElement.querySelectorAll(".dot")];


    const heroCounter =
        heroElement.querySelector(".hero-count");


    const previousButton =
        heroElement.querySelector(".hero-prev");


    const nextButton =
        heroElement.querySelector(".hero-next");


    let heroIndex = 0;
    let heroTimer = null;


    function showHero(index) {

        if (!heroSlides.length) return;


        heroIndex =
            (index + heroSlides.length) %
            heroSlides.length;


        heroSlides.forEach(
            (slide, currentIndex) => {

                const active =
                    currentIndex === heroIndex;


                slide.classList.toggle(
                    "active",
                    active
                );


                slide.setAttribute(
                    "aria-hidden",
                    active ? "false" : "true"
                );

            }
        );


        heroDots.forEach(
            (dot, currentIndex) => {

                const active =
                    currentIndex === heroIndex;


                dot.classList.toggle(
                    "active",
                    active
                );


                dot.setAttribute(
                    "aria-current",
                    active ? "true" : "false"
                );

            }
        );


        if (heroCounter) {

            heroCounter.textContent =
                String(heroIndex + 1)
                    .padStart(2, "0");

        }

    }


    function stopHero() {

        if (!heroTimer) return;

        clearInterval(heroTimer);

        heroTimer = null;

    }


    function startHero() {

        stopHero();


        if (heroSlides.length <= 1) {
            return;
        }


        heroTimer =
            setInterval(() => {

                showHero(
                    heroIndex + 1
                );

            }, 6000);

    }


    heroDots.forEach(
        (dot, index) => {

            dot.addEventListener(
                "click",
                () => {

                    showHero(index);
                    startHero();

                }
            );

        }
    );


    previousButton?.addEventListener(
        "click",
        () => {

            showHero(heroIndex - 1);
            startHero();

        }
    );


    nextButton?.addEventListener(
        "click",
        () => {

            showHero(heroIndex + 1);
            startHero();

        }
    );


    /*
     * Pause autoplay while user is interacting
     */

    heroElement.addEventListener(
        "mouseenter",
        stopHero
    );


    heroElement.addEventListener(
        "mouseleave",
        startHero
    );


    heroElement.addEventListener(
        "focusin",
        stopHero
    );


    heroElement.addEventListener(
        "focusout",
        startHero
    );


    /*
     * Keyboard arrows
     */

    heroElement.addEventListener(
        "keydown",
        event => {

            if (event.key === "ArrowLeft") {

                showHero(heroIndex - 1);
                startHero();

            }


            if (event.key === "ArrowRight") {

                showHero(heroIndex + 1);
                startHero();

            }

        }
    );


    /*
     * Mobile swipe support
     */

    let touchStartX = 0;


    heroElement.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0].clientX;

        },
        {
            passive: true
        }
    );


    heroElement.addEventListener(
        "touchend",
        event => {

            const touchEndX =
                event.changedTouches[0].clientX;


            const difference =
                touchStartX - touchEndX;


            if (Math.abs(difference) < 45) {
                return;
            }


            if (difference > 0) {

                showHero(heroIndex + 1);

            } else {

                showHero(heroIndex - 1);

            }


            startHero();

        },
        {
            passive: true
        }
    );


    showHero(0);
    startHero();

}


/* ==========================================================
   SERVICES
========================================================== */

const servicesElement =
    document.querySelector("#servicesGrid");


const services =
    await getData("services");


if (servicesElement) {

    servicesElement.innerHTML =
        services
            .slice(0, 4)
            .map((item, index) => {

                const title =
                    value(
                        item,
                        "title",
                        0,
                        "Interior Service"
                    );


                const description =
                    value(
                        item,
                        "description",
                        1,
                        ""
                    );


                const image =
                    value(
                        item,
                        "image",
                        2,
                        ""
                    );


                const link =
                    value(
                        item,
                        "link",
                        3,
                        "/contact.html"
                    );


                return `

                    <article class="offer-card">

                        <img
                            src="${image}"
                            alt="${title}"
                            loading="lazy"
                        >


                        <div class="offer-card-content">

                            <span class="offer-number">
                                ${String(index + 1).padStart(2, "0")}
                            </span>


                            <h3>
                                ${title}
                            </h3>


                            <p>
                                ${description}
                            </p>


                            <a href="${link}">
                                EXPLORE SERVICE →
                            </a>

                        </div>

                    </article>

                `;

            })
            .join("");

}


/* ==========================================================
   GALLERY
========================================================== */

const galleryElement =
    document.querySelector("#galleryGrid");


const galleryData =
    await getData("gallery");


if (galleryElement) {

    galleryElement.innerHTML =
        galleryData
            .slice(0, 5)
            .map(item => {

                const title =
                    value(
                        item,
                        "title",
                        0,
                        "ECON Interior"
                    );


                const image =
                    value(
                        item,
                        "image",
                        1,
                        ""
                    );


                return `

                    <article class="gitem">

                        <img
                            src="${image}"
                            alt="${title}"
                            loading="lazy"
                        >


                        <div class="gitem-content">

                            <strong>
                                ${title}
                            </strong>


                            <span>
                                →
                            </span>

                        </div>

                    </article>

                `;

            })
            .join("");

}


/* ==========================================================
   WHY ECON
========================================================== */

const whyElement =
    document.querySelector("#whyTrack");


const whyData =
    await getData("why");


if (whyElement) {

    whyElement.innerHTML =
        whyData
            .map(item => {

                const number =
                    value(
                        item,
                        "number",
                        0,
                        "01"
                    );


                const title =
                    value(
                        item,
                        "title",
                        1,
                        ""
                    );


                const description =
                    value(
                        item,
                        "description",
                        2,
                        ""
                    );


                return `

                    <article class="why-card">

                        <span class="why-number">
                            ${number}
                        </span>


                        <h3>
                            ${title}
                        </h3>


                        <p>
                            ${description}
                        </p>

                    </article>

                `;

            })
            .join("");

}


/* ==========================================================
   PROCESS
========================================================== */

const processData = [

    [
        "01 — Discover",
        "We understand your space, requirements, preferences and budget.",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=82"
    ],

    [
        "02 — Design",
        "Your requirements become a functional layout and visual direction.",
        "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1200&q=82"
    ],

    [
        "03 — Materials",
        "Explore finishes, textures, hardware and accessories.",
        "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=82"
    ],

    [
        "04 — Build",
        "Approved designs move into careful production.",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=82"
    ],

    [
        "05 — Install",
        "Your completed kitchen is installed and prepared for handover.",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=82"
    ]

];


const stepsElement =
    document.querySelector("#steps");


const processImage =
    document.querySelector("#processImg");


if (stepsElement && processImage) {

    stepsElement.innerHTML =
        processData
            .map((item, index) => `

                <div
                    class="step ${index === 0 ? "active" : ""}"
                    data-index="${index}"
                >

                    <b>
                        ${item[0]}
                    </b>


                    <div>
                        ${item[1]}
                    </div>

                </div>

            `)
            .join("");


    processImage.src =
        processData[0][2];


    processImage.alt =
        processData[0][0];


    stepsElement
        .querySelectorAll(".step")
        .forEach(step => {

            step.addEventListener(
                "click",
                () => {

                    stepsElement
                        .querySelectorAll(".step")
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    step.classList.add(
                        "active"
                    );


                    const index =
                        Number(
                            step.dataset.index
                        );


                    if (!processData[index]) {
                        return;
                    }


                    processImage.style.opacity =
                        "0.25";


                    setTimeout(
                        () => {

                            processImage.src =
                                processData[index][2];


                            processImage.alt =
                                processData[index][0];


                            processImage.style.opacity =
                                "1";

                        },
                        180
                    );

                }
            );

        });

}


/* ==========================================================
   MATERIALS
========================================================== */

const materials = [

    [
        "Acrylic",
        "A refined high-gloss finish that creates a sleek and contemporary visual language.",
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1300&q=85"
    ],

    [
        "Laminate",
        "A versatile finish available across a broad range of colours, textures and design styles.",
        "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1300&q=85"
    ],

    [
        "Membrane",
        "Smooth routed profiles suited to elegant and seamless cabinet fronts.",
        "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1300&q=85"
    ],

    [
        "Glass",
        "A sophisticated surface option for kitchens that need a lighter, modern expression.",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1300&q=85"
    ]

];


const materialTabsElement =
    document.querySelector("#materialTabs");


const materialImage =
    document.querySelector("#materialImg");


const materialTag =
    document.querySelector("#materialTag");


const materialTitle =
    document.querySelector("#materialTitle");


const materialText =
    document.querySelector("#materialText");


function showMaterial(index) {

    const material =
        materials[index];


    if (!material) {
        return;
    }


    if (materialImage) {

        materialImage.style.opacity =
            "0.25";


        setTimeout(
            () => {

                materialImage.src =
                    material[2];


                materialImage.alt =
                    `${material[0]} kitchen finish`;


                materialImage.style.opacity =
                    "1";

            },
            150
        );

    }


    if (materialTag) {

        materialTag.textContent =
            "FINISH LIBRARY";

    }


    if (materialTitle) {

        materialTitle.textContent =
            material[0];

    }


    if (materialText) {

        materialText.textContent =
            material[1];

    }

}


if (materialTabsElement) {

    materialTabsElement.innerHTML =
        materials
            .map((material, index) => `

                <button
                    class="tab ${index === 0 ? "active" : ""}"
                    type="button"
                    data-index="${index}"
                >
                    ${material[0]}
                </button>

            `)
            .join("");


    /*
     * Set initial material immediately
     */

    if (materialImage) {

        materialImage.src =
            materials[0][2];


        materialImage.alt =
            `${materials[0][0]} kitchen finish`;

    }


    if (materialTag) {

        materialTag.textContent =
            "FINISH LIBRARY";

    }


    if (materialTitle) {

        materialTitle.textContent =
            materials[0][0];

    }


    if (materialText) {

        materialText.textContent =
            materials[0][1];

    }


    materialTabsElement
        .querySelectorAll(".tab")
        .forEach(tab => {

            tab.addEventListener(
                "click",
                () => {

                    materialTabsElement
                        .querySelectorAll(".tab")
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    tab.classList.add(
                        "active"
                    );


                    showMaterial(
                        Number(
                            tab.dataset.index
                        )
                    );

                }
            );

        });

}


/* ==========================================================
   PROJECTS
========================================================== */

const projectsElement =
    document.querySelector("#projects");


const projectsData =
    await getData("projects");


if (projectsElement) {

    projectsElement.innerHTML =
        projectsData
            .map(item => {

                const title =
                    value(
                        item,
                        "title",
                        0,
                        "ECON Project"
                    );


                const location =
                    value(
                        item,
                        "location",
                        1,
                        "Meerut"
                    );


                const image =
                    value(
                        item,
                        "image",
                        2,
                        ""
                    );


                return `

                    <article class="project-card">

                        <img
                            src="${image}"
                            alt="${title}"
                            loading="lazy"
                        >


                        <div class="project-copy">

                            <span class="eyebrow">
                                ${location}
                            </span>


                            <h3>
                                ${title}
                            </h3>


                            <a href="/contact.html">
                                VIEW PROJECT →
                            </a>

                        </div>

                    </article>

                `;

            })
            .join("");

}


/* ==========================================================
   TESTIMONIALS
   IMPORTANT:
   index.html has id="testimonials"
========================================================== */

const testimonialsElement =
    document.querySelector("#testimonials");


const testimonialData =
    await getData("testimonials");


if (testimonialsElement) {

    testimonialsElement.innerHTML =
        testimonialData
            .map(item => {

                const quote =
                    value(
                        item,
                        "quote",
                        0,
                        ""
                    );


                const name =
                    value(
                        item,
                        "name",
                        1,
                        "ECON Customer"
                    );


                const location =
                    value(
                        item,
                        "location",
                        2,
                        ""
                    );


                return `

                    <article class="testimonial">

                        <div class="test-stars">
                            ★★★★★
                        </div>


                        <blockquote>
                            “${quote}”
                        </blockquote>


                        <b>
                            ${name}
                        </b>


                        <p class="muted">
                            ${location}
                        </p>

                    </article>

                `;

            })
            .join("");

}


/* ==========================================================
   BLOG
========================================================== */

const blogElement =
    document.querySelector("#blogGrid");


const blogData =
    await getData("blogs");


if (blogElement) {

    blogElement.innerHTML =
        blogData
            .slice(0, 3)
            .map(item => {

                const title =
                    value(
                        item,
                        "title",
                        0,
                        "Design Journal"
                    );


                const excerpt =
                    value(
                        item,
                        "excerpt",
                        1,
                        ""
                    );


                return `

                    <article class="blog-card">

                        <span class="eyebrow">
                            DESIGN JOURNAL
                        </span>


                        <h3>
                            ${title}
                        </h3>


                        <p>
                            ${excerpt}
                        </p>


                        <a href="/blog.html">
                            READ ARTICLE →
                        </a>

                    </article>

                `;

            })
            .join("");

}


/* ==========================================================
   FAQ
========================================================== */

const faqElement =
    document.querySelector("#faqs");


const faqData =
    await getData("faqs");


if (faqElement) {

    faqElement.innerHTML =
        faqData
            .map((item, index) => {

                const question =
                    value(
                        item,
                        "question",
                        0,
                        ""
                    );


                const answer =
                    value(
                        item,
                        "answer",
                        1,
                        ""
                    );


                return `

                    <article
                        class="faqitem"
                        data-faq="${index}"
                    >

                        <button
                            class="faqQ"
                            type="button"
                            aria-expanded="false"
                        >

                            <span>
                                ${question}
                            </span>

                            <span class="faq-icon">
                                +
                            </span>

                        </button>


                        <div class="faqA">
                            ${answer}
                        </div>

                    </article>

                `;

            })
            .join("");


    faqElement
        .querySelectorAll(".faqQ")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const currentItem =
                        button.closest(
                            ".faqitem"
                        );


                    const alreadyOpen =
                        currentItem.classList.contains(
                            "open"
                        );


                    /*
                     * Close all
                     */

                    faqElement
                        .querySelectorAll(".faqitem")
                        .forEach(item => {

                            item.classList.remove(
                                "open"
                            );


                            const faqButton =
                                item.querySelector(
                                    ".faqQ"
                                );


                            const faqIcon =
                                item.querySelector(
                                    ".faq-icon"
                                );


                            faqButton?.setAttribute(
                                "aria-expanded",
                                "false"
                            );


                            if (faqIcon) {
                                faqIcon.textContent = "+";
                            }

                        });


                    /*
                     * Open clicked item
                     */

                    if (!alreadyOpen) {

                        currentItem.classList.add(
                            "open"
                        );


                        button.setAttribute(
                            "aria-expanded",
                            "true"
                        );


                        const icon =
                            currentItem.querySelector(
                                ".faq-icon"
                            );


                        if (icon) {
                            icon.textContent = "−";
                        }

                    }

                }
            );

        });

}


/* ==========================================================
   GENERIC HORIZONTAL SLIDER
========================================================== */

function scrollSlider(
    slider,
    direction = 1
) {

    if (!slider) {
        return;
    }


    const firstCard =
        slider.firstElementChild;


    let distance = 350;


    if (firstCard) {

        const cardWidth =
            firstCard
                .getBoundingClientRect()
                .width;


        const computedStyle =
            window.getComputedStyle(
                slider
            );


        const gap =
            parseFloat(
                computedStyle.columnGap ||
                computedStyle.gap ||
                18
            );


        distance =
            cardWidth + gap;

    }


    slider.scrollBy({
        left: distance * direction,
        behavior: "smooth"
    });

}


document
    .querySelectorAll("[data-slider]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.slider;


                const direction =
                    Number(
                        button.dataset.dir
                    ) || 1;


                const slider =
                    document.getElementById(
                        targetId
                    );


                scrollSlider(
                    slider,
                    direction
                );

            }
        );

    });


/* ==========================================================
   DRAG TO SCROLL
   WHY / PROJECT / TESTIMONIAL
========================================================== */

const draggableSliders = [
    whyElement,
    projectsElement,
    testimonialsElement
].filter(Boolean);


draggableSliders.forEach(slider => {

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;


    slider.addEventListener(
        "pointerdown",
        event => {

            if (
                event.pointerType === "touch"
            ) {
                return;
            }


            isDown = true;


            startX =
                event.clientX;


            startScrollLeft =
                slider.scrollLeft;


            slider.setPointerCapture?.(
                event.pointerId
            );


            slider.style.cursor =
                "grabbing";

        }
    );


    slider.addEventListener(
        "pointermove",
        event => {

            if (!isDown) {
                return;
            }


            const difference =
                event.clientX - startX;


            slider.scrollLeft =
                startScrollLeft -
                difference;

        }
    );


    const stopDrag = () => {

        isDown = false;

        slider.style.cursor =
            "";

    };


    slider.addEventListener(
        "pointerup",
        stopDrag
    );


    slider.addEventListener(
        "pointercancel",
        stopDrag
    );


    slider.addEventListener(
        "pointerleave",
        stopDrag
    );

});


/* ==========================================================
   IMAGE ERROR FALLBACK
========================================================== */

document.addEventListener(
    "error",
    event => {

        const image =
            event.target;


        if (
            !(image instanceof HTMLImageElement)
        ) {
            return;
        }


        /*
         * Prevent infinite error loop
         */

        if (
            image.dataset.fallbackApplied ===
            "true"
        ) {
            return;
        }


        image.dataset.fallbackApplied =
            "true";


        image.src =
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80";

    },
    true
);


/* ==========================================================
   REDUCED MOTION SUPPORT
========================================================== */

const reduceMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


if (reduceMotion.matches) {

    document
        .querySelectorAll(
            ".slide, .offer-card img, .gitem img"
        )
        .forEach(element => {

            element.style.transition =
                "none";

        });

}


/* ==========================================================
   HOME READY
========================================================== */

console.log(
    "%cECON Kitchen",
    "font-weight:bold;font-size:16px;color:#bd633c"
);

console.log(
    "Premium home page loaded successfully."
);

/* =========================================================
   ECON SERVICES INTERACTIVE SHOWCASE
========================================================= */

function initServicesShowcase() {

    const section =
        document.querySelector(".services-experience");

    if (!section) return;


    const items =
        section.querySelectorAll(".service-index-item");

    const image =
        document.getElementById("serviceActiveImage");

    const number =
        document.getElementById("serviceActiveNumber");

    const label =
        document.getElementById("serviceActiveLabel");

    const title =
        document.getElementById("serviceActiveTitle");

    const description =
        document.getElementById("serviceActiveDescription");

    const link =
        document.getElementById("serviceActiveLink");


    function activateService(item) {

        if (!item) return;


        items.forEach(service => {
            service.classList.remove("active");
        });


        item.classList.add("active");


        const newImage =
            item.dataset.image;

        const newNumber =
            item.dataset.number;

        const newLabel =
            item.dataset.label;

        const newTitle =
            item.dataset.title;

        const newDescription =
            item.dataset.description;

        const newLink =
            item.dataset.link;


        /* IMAGE TRANSITION */

        if (image && newImage) {

            image.style.opacity = "0";


            setTimeout(() => {

                image.src = newImage;

                image.alt =
                    newTitle || "ECON Interior Service";


                image.style.opacity = "1";

            }, 180);

        }


        if (number) {
            number.textContent =
                newNumber || "";
        }


        if (label) {
            label.textContent =
                newLabel || "";
        }


        if (title) {
            title.textContent =
                newTitle || "";
        }


        if (description) {
            description.textContent =
                newDescription || "";
        }


        if (link && newLink) {
            link.href = newLink;
        }

    }


    items.forEach(item => {

        /* DESKTOP HOVER */

        item.addEventListener(
            "mouseenter",
            function () {

                if (window.innerWidth > 768) {
                    activateService(item);
                }

            }
        );


        /* MOBILE TAP */

        item.addEventListener(
            "click",
            function (event) {

                if (window.innerWidth > 768) {
                    return;
                }


                /*
                   First tap = preview service
                   Second tap = navigate
                */

                if (
                    !item.classList.contains("active")
                ) {

                    event.preventDefault();

                    activateService(item);

                }

            }
        );

    });

}


/* RUN */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initServicesShowcase
    );

} else {

    initServicesShowcase();

}

const cards = document.querySelectorAll(".gallery-card");

const mainImage = document.getElementById("mainGalleryImage");

const mainTitle = document.getElementById("mainTitle");

const mainCategory = document.getElementById("mainCategory");



cards.forEach(card=>{


card.addEventListener("click",()=>{


cards.forEach(c=>c.classList.remove("active"));

card.classList.add("active");



mainImage.src =
card.dataset.image;


mainTitle.innerHTML =
card.dataset.title;


mainCategory.innerHTML =
card.dataset.cat;


});

});




// LIGHTBOX


const lightbox =
document.querySelector(".gallery-lightbox");


const lightboxImg =
document.getElementById("lightboxImage");


mainImage.onclick=()=>{


lightbox.style.display="flex";

lightboxImg.src=mainImage.src;


}



document.querySelector(".close-lightbox")
.onclick=()=>{


lightbox.style.display="none";


}




// AUTO SLIDER


let index=0;


setInterval(()=>{


index++;


if(index>=cards.length)

index=0;


cards[index].click();



},5000);





// ARROWS


document.querySelector(".gallery-arrow.next")
.onclick=()=>{


index++;

if(index>=cards.length)

index=0;


cards[index].click();


};



document.querySelector(".gallery-arrow.prev")
.onclick=()=>{


index--;

if(index<0)

index=cards.length-1;


cards[index].click();


};

/* ======================================
   WHY ECON AUTO TICKER
====================================== */


const whyTicker = document.querySelector(".why-ticker");

const whyTrack = document.querySelector(".why-ticker-track");


if(whyTicker && whyTrack){


let speed = 0.6;

let position = 0;

let paused = false;



whyTicker.addEventListener("mouseenter",()=>{

    paused=true;

});


whyTicker.addEventListener("mouseleave",()=>{

    paused=false;

});



function moveTicker(){


    if(!paused){


        position -= speed;


        if(Math.abs(position) >= whyTrack.scrollWidth / 2){

            position = 0;

        }


        whyTrack.style.transform =
        `translateX(${position}px)`;

    }


    requestAnimationFrame(moveTicker);


}



moveTicker();


}
document.addEventListener("DOMContentLoaded",()=>{


const cards=document.querySelectorAll(".econ-calc-card");


cards.forEach(card=>{


card.addEventListener("mouseenter",()=>{

card.querySelector(".calc-main-icon")
.style.transform="scale(1.1) rotate(8deg)";


});



card.addEventListener("mouseleave",()=>{


card.querySelector(".calc-main-icon")
.style.transform="";


});


});


});

/* =====================================================
   ECON CUSTOMER REVIEW AUTO SLIDER
===================================================== */


document.addEventListener("DOMContentLoaded", function(){


    const slider = document.querySelector(".review-slider");
    const track = document.querySelector(".review-track");
    const cards = document.querySelectorAll(".review-card");


    if(!slider || !track || cards.length === 0){
        return;
    }



    let position = 0;

    let speed = 1;


    let isPaused = false;



    /*
       Duplicate cards automatically
       for infinite scrolling
    */

    track.innerHTML += track.innerHTML;



    const cardWidth = 
    cards[0].offsetWidth + 30;




    function moveSlider(){


        if(!isPaused){


            position += speed;



            if(position >= track.scrollWidth / 2){

                position = 0;

            }



            track.style.transform =
            `translateX(-${position}px)`;


        }


        requestAnimationFrame(moveSlider);


    }



    moveSlider();





    /*
       Mouse Hover Pause
    */


    slider.addEventListener(
        "mouseenter",
        function(){

            isPaused = true;

        }
    );



    slider.addEventListener(
        "mouseleave",
        function(){

            isPaused = false;

        }
    );





    /*
       Touch Support Mobile
    */


    slider.addEventListener(
        "touchstart",
        function(){

            isPaused = true;

        }
    );



    slider.addEventListener(
        "touchend",
        function(){

            isPaused = false;

        }
    );



});



        const track = document.querySelector(".gallery-track");

        const next = document.querySelector(".gallery-next");

        const prev = document.querySelector(".gallery-prev");


        let position = 0;


        next.addEventListener("click", () => {

            position -= 34;

            if (position < -70) {

                position = 0;

            }

            track.style.transform =
                `translateX(${position}%)`;

        });



        prev.addEventListener("click", () => {


            position += 34;


            if (position > 0) {

                position = -70;

            }


            track.style.transform =
                `translateX(${position}%)`;


        });



        setInterval(() => {

            next.click();

        }, 4000);

 
   

        