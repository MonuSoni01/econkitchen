/* =========================================================

   ECON KITCHEN

   MODULAR KITCHEN PAGE

   FIXED EDITORIAL DISCOVERY FLOW

========================================================= */





/* =========================================================

   IMPORTS

========================================================= */



import { kitchenDesigns } from "./kitchen-designs.js";

// Load lead storage only when a consultation is submitted.
// An unavailable Firebase service must not block navigation or cards.
async function getLeadStorage() {
    const [config, firestore] = await Promise.all([
        import("./firebase.js"),
        import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")
    ]);
    return { db: config.db, ...firestore };
}

/* =========================================================

   DOM READY

========================================================= */



document.addEventListener(

    "DOMContentLoaded",

    () => {





        /* =====================================================

           CONFIG

        ====================================================== */



        const LIMITS = {



            initial: 18,



            layout: 18,



            middleOne: 10,



            category: 18,



            middleTwo: 10,



            series: 18,



            middleThree: 10



        };


        /* Manual View More loading. */
        const LOAD_MORE_BATCH = 6;

        const visibleCounts = {
            initial: LIMITS.initial,
            layout: LIMITS.layout,
            category: LIMITS.category,
            series: LIMITS.series
        };

        const viewMoreButtons = {};





        /*

            Different offsets use kar rahe hain

            taaki normal batches me same cards repeat kam ho.

        */



        const OFFSETS = {



            initial: 0,



            layout: 5,



            middleOne: 12,



            category: 17,



            middleTwo: 22,



            series: 27,



            middleThree: 33



        };







        /* =====================================================

           STATE

        ====================================================== */



        const discoveryState = {



            layout: "all",



            category: "all",



            series: "all"



        };







        /* =====================================================

           GRIDS

        ====================================================== */



        const initialKitchenGrid =

            document.getElementById(

                "initialKitchenGrid"

            );





        const layoutKitchenGrid =

            document.getElementById(

                "layoutKitchenGrid"

            );





        const middleKitchenGridOne =

            document.getElementById(

                "middleKitchenGridOne"

            );





        const categoryKitchenGrid =

            document.getElementById(

                "categoryKitchenGrid"

            );





        const middleKitchenGridTwo =

            document.getElementById(

                "middleKitchenGridTwo"

            );





        const seriesKitchenGrid =

            document.getElementById(

                "seriesKitchenGrid"

            );





        const middleKitchenGridThree =

            document.getElementById(

                "middleKitchenGridThree"

            );







        /* =====================================================

           FILTER BUTTONS

        ====================================================== */



        const layoutButtons =

            document.querySelectorAll(

                "#layoutFilters [data-layout]"

            );





        const categoryButtons =

            document.querySelectorAll(

                "#categoryFilters [data-category]"

            );





        const seriesButtons =

            document.querySelectorAll(

                "#seriesFilters [data-series]"

            );







        /* =====================================================

           RESULT HEADINGS

        ====================================================== */



        const layoutResultTitle =

            document.getElementById(

                "layoutResultTitle"

            );





        const layoutResultCount =

            document.getElementById(

                "layoutResultCount"

            );





        const categoryResultTitle =

            document.getElementById(

                "categoryResultTitle"

            );





        const categoryResultCount =

            document.getElementById(

                "categoryResultCount"

            );





        const seriesResultTitle =

            document.getElementById(

                "seriesResultTitle"

            );





        const seriesResultCount =

            document.getElementById(

                "seriesResultCount"

            );







        /* =====================================================

           STICKY NAV

        ====================================================== */



        const stickyActions =

            document.querySelectorAll(

                ".mk-sticky-action[data-scroll-section]"

            );





        const resetButton =

            document.getElementById(

                "resetKitchenFilters"

            );





        const discoverySections =

            document.querySelectorAll(

                "[data-discovery-section]"

            );







        /* =====================================================

           HELPERS

        ====================================================== */



        function normalizeValue(

            value

        ) {



            return String(

                value || ""

            )

                .trim()

                .toLowerCase();



        }







        function formatText(

            value

        ) {



            const text =

                String(

                    value || ""

                )

                    .trim();





            if (!text) {



                return "";



            }





            return text



                .split(

                    /[\s-]+/

                )



                .filter(Boolean)



                .map(

                    word =>



                        word

                            .charAt(0)

                            .toUpperCase()



                        +



                        word.slice(1)

                )



                .join(" ");



        }







        function escapeHTML(

            value

        ) {



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



        function scrollToResult(elementId) {



            setTimeout(() => {



                const element =

                    document.getElementById(elementId);



                if (!element) return;



                const top =

                    element.getBoundingClientRect().top +

                    window.scrollY -

                    100;



                window.scrollTo({

                    top: top,

                    behavior: "smooth"

                });



            }, 100);



        }





        /* =====================================================

           GET FIXED BATCH

        ====================================================== */



        function getBatch(

            items,

            start,

            limit

        ) {



            if (

                !Array.isArray(items) ||

                items.length === 0

            ) {



                return [];



            }





            /*

                Simple slice.

                Agar end cross kare to wrap around.

            */



            const result = [];





            let index =

                start %

                items.length;





            while (

                result.length < limit &&

                result.length < items.length

            ) {



                result.push(

                    items[index]

                );





                index =

                    (

                        index + 1

                    ) %

                    items.length;



            }





            return result;



        }


        /* =====================================================
           GET PROGRESSIVE ITEMS WITHOUT DUPLICATION
        ====================================================== */

        function getProgressiveItems(items, start, visibleCount) {

            if (!Array.isArray(items) || items.length === 0) {
                return [];
            }

            const safeStart = start % items.length;

            const orderedItems = [
                ...items.slice(safeStart),
                ...items.slice(0, safeStart)
            ];

            return orderedItems.slice(
                0,
                Math.min(visibleCount, orderedItems.length)
            );

        }







        /* =====================================================

           EMPTY STATE

        ====================================================== */



        function createEmptyState(

            message

        ) {



            return `



                <div class="mk-collection-empty">



                    <span>

                        NO DESIGNS FOUND

                    </span>



                    <h3>

                        ${escapeHTML(message)}

                    </h3>



                    <p>

                        Try another option to explore more designs.

                    </p>



                </div>



            `;



        }







        /* =====================================================

           CARD HTML

        ====================================================== */



        function createKitchenCard(

            item

        ) {



            const detailURL =



                `/kitchen-design.html?slug=${encodeURIComponent(

                    item.slug

                )}`;





            const image =



                item.main_image ||

                "/assets/images/kitchen/1.png";





            return `



                <article

                    class="mk-project-card"

                    data-url="${detailURL}"

                    tabindex="0"

                    role="link"

                    aria-label="View ${escapeHTML(item.title)}"

                >





                    <div class="mk-project-image-wrap">





                        <img

                            src="${escapeHTML(image)}"

                            alt="${escapeHTML(item.title)}"

                            class="mk-project-image"

                            loading="lazy"

                            decoding="async"

                        >





                        ${item.badge



                    ? `



                                <span class="mk-project-badge">



                                    ${escapeHTML(item.badge)}



                                </span>



                            `



                    : ""

                }





                        <span

                            class="mk-project-open"

                            aria-hidden="true"

                        >



                            ↗



                        </span>





                    </div>







                    <div class="mk-project-content">





                        <div class="mk-project-info">





                            <span class="mk-project-category">



                                ${escapeHTML(

                    formatText(

                        item.category

                    )

                )

                }



                            </span>





                            <h3 class="mk-project-title">



                                ${escapeHTML(item.title)}



                            </h3>





                            <div class="mk-project-details">





                                <span>



                                    <i class="fa-solid fa-vector-square"></i>



                                    ${escapeHTML(item.layout)}



                                </span>





                                <span class="mk-detail-divider"></span>





                                <span>



                                    <i class="fa-solid fa-ruler-combined"></i>



                                    ${escapeHTML(item.size)}



                                </span>





                            </div>





                        </div>







                        <div class="mk-project-actions">





                            <a

                                href="/contact.html"

                                class="mk-project-consultation"

                            >



                                Book Consultation



                            </a>





                            <a

                                href="/calculators/kitchen-estimator.html"

                                class="mk-project-quote"

                            >



                                Get Quote



                            </a>





                        </div>





                    </div>





                </article>



            `;



        }







        /* =====================================================

           BIND CARD EVENTS

        ====================================================== */



        function bindKitchenCards(

            container

        ) {



            if (!container) {



                return;



            }





            container



                .querySelectorAll(

                    ".mk-project-card"

                )



                .forEach(

                    card => {





                        if (

                            card.dataset.bound ===

                            "true"

                        ) {



                            return;



                        }





                        card.dataset.bound =

                            "true";





                        function openKitchen() {



                            const url =

                                card.dataset.url;





                            if (url) {



                                window.location.href =

                                    url;



                            }



                        }







                        card.addEventListener(

                            "click",

                            event => {





                                if (

                                    event.target.closest(

                                        "a, button"

                                    )

                                ) {



                                    return;



                                }





                                openKitchen();



                            }

                        );







                        card.addEventListener(

                            "keydown",

                            event => {





                                if (

                                    event.key !==

                                    "Enter"

                                ) {



                                    return;



                                }





                                if (

                                    event.target.closest(

                                        "a, button"

                                    )

                                ) {



                                    return;



                                }





                                openKitchen();



                            }

                        );





                    }

                );



        }







        /* =====================================================

           GRID RENDER

        ====================================================== */



        function renderGrid(

            container,

            items,

            emptyMessage

        ) {



            if (!container) {



                return;



            }





            if (

                !items.length

            ) {



                container.innerHTML =

                    createEmptyState(

                        emptyMessage

                    );





                return;



            }





            container.innerHTML =



                items



                    .map(

                        createKitchenCard

                    )



                    .join("");





            bindKitchenCards(

                container

            );



        }







        /* =====================================================

           INITIAL 5 CARDS

        ====================================================== */



        function renderInitialGrid() {



            const items =



                getProgressiveItems(



                    kitchenDesigns,



                    OFFSETS.initial,



                    visibleCounts.initial



                );





            renderGrid(



                initialKitchenGrid,



                items,



                "No kitchen designs available."



            );

            updateViewMoreButton(
                "initial",
                kitchenDesigns.length
            );



        }







        /* =====================================================

           NORMAL BATCH 01

        ====================================================== */



        function renderMiddleGridOne() {



            const items =



                getBatch(



                    kitchenDesigns,



                    OFFSETS.middleOne,



                    LIMITS.middleOne



                );





            renderGrid(



                middleKitchenGridOne,



                items,



                "No kitchen designs available."



            );



        }







        /* =====================================================

           NORMAL BATCH 02

        ====================================================== */



        function renderMiddleGridTwo() {



            const items =



                getBatch(



                    kitchenDesigns,



                    OFFSETS.middleTwo,



                    LIMITS.middleTwo



                );





            renderGrid(



                middleKitchenGridTwo,



                items,



                "No kitchen designs available."



            );



        }







        /* =====================================================

           NORMAL BATCH 03

        ====================================================== */



        function renderMiddleGridThree() {



            const items =



                getBatch(



                    kitchenDesigns,



                    OFFSETS.middleThree,



                    LIMITS.middleThree



                );





            renderGrid(



                middleKitchenGridThree,



                items,



                "No kitchen designs available."



            );



        }







        /* =====================================================

           LAYOUT FILTER DATA

        ====================================================== */



        function getLayoutFilteredData() {



            if (

                discoveryState.layout ===

                "all"

            ) {



                return kitchenDesigns;



            }





            return kitchenDesigns.filter(

                item =>



                    normalizeValue(

                        item.layout

                    )



                    ===



                    normalizeValue(

                        discoveryState.layout

                    )

            );



        }







        /* =====================================================

           RENDER LAYOUT GRID

        ====================================================== */



        function renderLayoutGrid() {



            const filtered =

                getLayoutFilteredData();





            const items =



                getProgressiveItems(



                    filtered,



                    discoveryState.layout === "all"

                        ? OFFSETS.layout

                        : 0,



                    visibleCounts.layout



                );





            renderGrid(



                layoutKitchenGrid,



                items,



                "No kitchens found for this layout."



            );

            updateViewMoreButton(
                "layout",
                filtered.length
            );







            if (

                layoutResultTitle

            ) {



                layoutResultTitle.textContent =



                    discoveryState.layout ===

                        "all"



                        ? "Kitchens For Every Layout"



                        : `${discoveryState.layout} Kitchens`;



            }







            if (

                layoutResultCount

            ) {



                layoutResultCount.textContent =



                    `${items.length} of ${filtered.length} Designs`;



            }



        }







        /* =====================================================

           CATEGORY FILTER DATA

        ====================================================== */



        function getCategoryFilteredData() {



            if (

                discoveryState.category ===

                "all"

            ) {



                return kitchenDesigns;



            }





            return kitchenDesigns.filter(

                item =>



                    normalizeValue(

                        item.category

                    )



                    ===



                    normalizeValue(

                        discoveryState.category

                    )

            );



        }







        /* =====================================================

           RENDER CATEGORY GRID

        ====================================================== */



        function renderCategoryGrid() {



            const filtered =

                getCategoryFilteredData();





            const items =



                getProgressiveItems(



                    filtered,



                    discoveryState.category === "all"

                        ? OFFSETS.category

                        : 0,



                    visibleCounts.category



                );





            renderGrid(



                categoryKitchenGrid,



                items,



                "No kitchens found for this style."



            );

            updateViewMoreButton(
                "category",
                filtered.length
            );







            if (

                categoryResultTitle

            ) {



                categoryResultTitle.textContent =



                    discoveryState.category ===

                        "all"



                        ? "Kitchens For Every Style"



                        : `${formatText(

                            discoveryState.category

                        )} Kitchens`;



            }







            if (

                categoryResultCount

            ) {



                categoryResultCount.textContent =



                    `${items.length} of ${filtered.length} Designs`;



            }



        }







        /* =====================================================

           SERIES FILTER DATA

        ====================================================== */



        function getSeriesFilteredData() {



            if (

                discoveryState.series ===

                "all"

            ) {



                return kitchenDesigns;



            }





            return kitchenDesigns.filter(

                item =>



                    normalizeValue(

                        item.series

                    )



                    ===



                    normalizeValue(

                        discoveryState.series

                    )

            );



        }







        /* =====================================================

           RENDER SERIES GRID

        ====================================================== */



        function renderSeriesGrid() {



            const filtered =

                getSeriesFilteredData();





            const items =



                getProgressiveItems(



                    filtered,



                    discoveryState.series === "all"

                        ? OFFSETS.series

                        : 0,



                    visibleCounts.series



                );





            renderGrid(



                seriesKitchenGrid,



                items,



                "No kitchens found in this collection."



            );

            updateViewMoreButton(
                "series",
                filtered.length
            );







            if (

                seriesResultTitle

            ) {



                seriesResultTitle.textContent =



                    discoveryState.series ===

                        "all"



                        ? "Explore Our Kitchen Collections"



                        : `${formatText(

                            discoveryState.series

                        )} Collection`;



            }







            if (

                seriesResultCount

            ) {



                seriesResultCount.textContent =



                    `${items.length} of ${filtered.length} Designs`;



            }



        }







        /* =====================================================

           ACTIVE BUTTON HELPER

        ====================================================== */



        function setActiveButton(

            buttons,

            selectedButton

        ) {



            buttons.forEach(

                button => {





                    const active =



                        button ===

                        selectedButton;





                    button.classList.toggle(

                        "active",

                        active

                    );





                    button.setAttribute(



                        "aria-pressed",



                        active

                            ? "true"

                            : "false"



                    );





                }

            );



        }







        /* =====================================================

           LAYOUT BUTTON EVENTS

        ====================================================== */



        layoutButtons.forEach(

            button => {





                button.addEventListener(

                    "click",

                    () => {





                        discoveryState.layout =



                            button.dataset.layout ||

                            "all";





                        setActiveButton(



                            layoutButtons,



                            button



                        );

                        visibleCounts.layout = LIMITS.layout;





                        renderLayoutGrid();



                        scrollToResult("layoutResultTitle");





                        setStickyActive(

                            "layout"

                        );





                    }

                );





            }

        );







        /* =====================================================

           CATEGORY BUTTON EVENTS

        ====================================================== */



        categoryButtons.forEach(

            button => {





                button.addEventListener(

                    "click",

                    () => {





                        discoveryState.category =



                            button.dataset.category ||

                            "all";





                        setActiveButton(



                            categoryButtons,



                            button



                        );

                        visibleCounts.category = LIMITS.category;





                        renderCategoryGrid();



                        scrollToResult("categoryResultTitle");



                        setStickyActive(

                            "category"

                        );





                    }

                );





            }

        );







        /* =====================================================

           SERIES BUTTON EVENTS

        ====================================================== */



        seriesButtons.forEach(

            button => {





                button.addEventListener(

                    "click",

                    () => {





                        discoveryState.series =



                            button.dataset.series ||

                            "all";





                        setActiveButton(



                            seriesButtons,



                            button



                        );

                        visibleCounts.series = LIMITS.series;





                        renderSeriesGrid();



                        scrollToResult("seriesResultTitle");

                        setStickyActive(

                            "series"

                        );





                    }

                );





            }

        );







        /* =====================================================

           STICKY ACTIVE

        ====================================================== */



        function setStickyActive(

            type

        ) {



            stickyActions.forEach(

                button => {





                    button.classList.toggle(



                        "active",



                        button.dataset.stickyType ===

                        type



                    );





                }

            );



        }







        /* =====================================================

           STICKY CLICK

        ====================================================== */



        stickyActions.forEach(

            button => {





                button.addEventListener(

                    "click",

                    () => {





                        const sectionID =



                            button.dataset.scrollSection;





                        const type =



                            button.dataset.stickyType;





                        if (

                            type

                        ) {



                            setStickyActive(

                                type

                            );



                        }





                        if (

                            !sectionID

                        ) {



                            return;



                        }





                        const target =



                            document.getElementById(

                                sectionID

                            );





                        if (!target) {



                            return;



                        }





                        target.scrollIntoView({



                            behavior:

                                "smooth",



                            block:

                                "center"



                        });





                    }

                );





            }

        );







        /* =====================================================

           STICKY ACTIVE ON SCROLL

        ====================================================== */



        if (

            discoverySections.length

        ) {



            const sectionObserver =



                new IntersectionObserver(



                    entries => {





                        const visible =



                            entries



                                .filter(

                                    item =>

                                        item.isIntersecting

                                )



                                .sort(

                                    (

                                        a,

                                        b

                                    ) =>



                                        b.intersectionRatio -

                                        a.intersectionRatio

                                );





                        if (

                            !visible.length

                        ) {



                            return;



                        }





                        const type =



                            visible[0]

                                .target

                                .dataset

                                .discoverySection;





                        if (

                            type

                        ) {



                            setStickyActive(

                                type

                            );



                        }





                    },



                    {



                        root:

                            null,



                        rootMargin:

                            "-20% 0px -55% 0px",



                        threshold:

                            [

                                0,

                                .15,

                                .30,

                                .50

                            ]



                    }



                );





            discoverySections.forEach(

                section => {



                    sectionObserver.observe(

                        section

                    );



                }

            );



        }







        /* =====================================================

           RESET FILTERS

        ====================================================== */



        function resetAllFilters() {



            discoveryState.layout =

                "all";





            discoveryState.category =

                "all";





            discoveryState.series =

                "all";


            visibleCounts.initial = LIMITS.initial;
            visibleCounts.layout = LIMITS.layout;
            visibleCounts.category = LIMITS.category;
            visibleCounts.series = LIMITS.series;







            /* LAYOUT */



            layoutButtons.forEach(

                button => {





                    const active =



                        button.dataset.layout ===

                        "all";





                    button.classList.toggle(

                        "active",

                        active

                    );





                    button.setAttribute(



                        "aria-pressed",



                        active

                            ? "true"

                            : "false"



                    );





                }

            );







            /* CATEGORY */



            categoryButtons.forEach(

                button => {





                    const active =



                        button.dataset.category ===

                        "all";





                    button.classList.toggle(

                        "active",

                        active

                    );





                    button.setAttribute(



                        "aria-pressed",



                        active

                            ? "true"

                            : "false"



                    );





                }

            );







            /* SERIES */



            seriesButtons.forEach(

                button => {





                    const active =



                        button.dataset.series ===

                        "all";





                    button.classList.toggle(

                        "active",

                        active

                    );





                    button.setAttribute(



                        "aria-pressed",



                        active

                            ? "true"

                            : "false"



                    );





                }

            );







            renderInitialGrid();

            renderLayoutGrid();



            renderCategoryGrid();



            renderSeriesGrid();





            setStickyActive(

                "layout"

            );





            document

                .getElementById(

                    "collection"

                )

                ?.scrollIntoView({



                    behavior:

                        "smooth",



                    block:

                        "start"



                });



        }







        resetButton

            ?.addEventListener(

                "click",

                resetAllFilters

            );







        /* =====================================================
           VIEW MORE BUTTONS
        ====================================================== */

        function updateViewMoreButton(type, totalItems) {
            const button = viewMoreButtons[type];

            if (!button) return;

            const remaining = Math.max(
                totalItems - visibleCounts[type],
                0
            );

            button.hidden = remaining === 0;

            const count = Math.min(
                LOAD_MORE_BATCH,
                remaining
            );

            button.innerHTML = count > 0
                ? `<span>View More</span><small>Show ${count} more designs</small><i class="fa-solid fa-chevron-down"></i>`
                : "";
        }


        function setupViewMoreButton(
            container,
            type,
            getFilteredData,
            renderFunction
        ) {
            if (!container) return;

            const wrapper = document.createElement("div");
            wrapper.className = "mk-view-more-wrap";
            wrapper.style.cssText = "display:flex;justify-content:center;padding:28px 0 12px;";

            const button = document.createElement("button");
            button.type = "button";
            button.className = "mk-view-more-btn";
            button.style.cssText = "display:inline-flex;align-items:center;gap:10px;border:1px solid #d6b64c;background:#111;color:#fff;border-radius:999px;padding:13px 22px;font:600 14px Poppins,sans-serif;cursor:pointer;box-shadow:0 10px 26px rgba(0,0,0,.12);";

            wrapper.appendChild(button);
            container.insertAdjacentElement("afterend", wrapper);
            viewMoreButtons[type] = button;

            button.addEventListener("click", () => {
                const totalItems = getFilteredData().length;

                visibleCounts[type] = Math.min(
                    visibleCounts[type] + LOAD_MORE_BATCH,
                    totalItems
                );

                renderFunction();
            });
        }


        setupViewMoreButton(
            initialKitchenGrid,
            "initial",
            () => kitchenDesigns,
            renderInitialGrid
        );

        setupViewMoreButton(
            layoutKitchenGrid,
            "layout",
            getLayoutFilteredData,
            renderLayoutGrid
        );

        setupViewMoreButton(
            categoryKitchenGrid,
            "category",
            getCategoryFilteredData,
            renderCategoryGrid
        );

        setupViewMoreButton(
            seriesKitchenGrid,
            "series",
            getSeriesFilteredData,
            renderSeriesGrid
        );


        /* =====================================================

           FIRST RENDER

        ====================================================== */



        renderInitialGrid();



        renderLayoutGrid();



        renderMiddleGridOne();



        renderCategoryGrid();



        renderMiddleGridTwo();



        renderSeriesGrid();



        renderMiddleGridThree();

        /* Collection deep links and draggable discovery menu. */
        function applyCollectionLink() {
            const url = new URL(window.location.href);
            const hash = url.hash.slice(1).toLowerCase();
            const requested = (url.searchParams.get("series") ||
                (["essential", "premium", "signature", "all"].includes(hash) ? hash : "")).toLowerCase();
            const button = [...seriesButtons].find(item => item.dataset.series === requested);
            if (!button) return;
            discoveryState.series = requested;
            visibleCounts.series = LIMITS.series;
            setActiveButton(seriesButtons, button);
            renderSeriesGrid();
            setStickyActive("series");
            const scroll = () => requestAnimationFrame(() => {
                const target = document.getElementById("seriesKitchenGrid")?.firstElementChild || document.getElementById("seriesResultTitle");
                if (target) window.scrollTo({
                    top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - 100),
                    behavior: "auto"
                });
            });
            if (document.readyState === "complete") scroll();
            else window.addEventListener("load", scroll, { once: true });
        }
        seriesButtons.forEach(button => button.addEventListener("click", () => {
            const url = new URL(window.location.href);
            url.searchParams.set("series", button.dataset.series || "all");
            url.hash = "seriesBrowser";
            history.replaceState(null, "", url);
        }));
        resetButton?.addEventListener("click", () => {
            const url = new URL(window.location.href);
            url.searchParams.delete("series");
            if (["essential", "premium", "signature", "all", "seriesBrowser"].includes(url.hash.slice(1))) url.hash = "";
            history.replaceState(null, "", url);
        });
        window.addEventListener("hashchange", applyCollectionLink);
        window.addEventListener("popstate", applyCollectionLink);
        applyCollectionLink();

        function initializeDiscoveryOrb() {
            const nav = document.getElementById("mkStickyDiscovery");
            const inner = nav?.querySelector(".mk-sticky-discovery-inner");
            if (!nav || !inner) return;
            // Finish has its own page; Handles is part of this page.
            const extraActions = [
                { label: "Finish", icon: "fa-palette", href: "/services/finishes.html" },
                { label: "Handles", icon: "fa-grip-lines", section: "handleSection" }
            ];
            extraActions.forEach(item => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "mk-sticky-action";
                button.innerHTML = `<span class="mk-sticky-icon"><i class="fa-solid ${item.icon}" aria-hidden="true"></i></span><span class="mk-sticky-text"><strong>${item.label}</strong></span>`;
                button.addEventListener("click", () => {
                    if (item.href) { window.location.assign(item.href); return; }
                    const target = document.getElementById(item.section);
                    if (target) window.scrollTo({
                        top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - 100),
                        behavior: "smooth"
                    });
                });
                inner.appendChild(button);
            });
            const actions = [...inner.querySelectorAll(".mk-sticky-action")];
            nav.classList.add("mk-discovery-orb");
            nav.setAttribute("aria-label", "Kitchen discovery controls");
            inner.id = "mkOrbActions";
            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "mk-orb-toggle";
            toggle.innerHTML = '<span aria-hidden="true">☰</span>';
            toggle.setAttribute("aria-label", "Open kitchen menu; drag to move");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-controls", inner.id);
            toggle.title = "Kitchen menu — drag to move";
            nav.appendChild(toggle);
            const css = document.createElement("style");
            css.textContent = `
              #mkStickyDiscovery.mk-discovery-orb{position:fixed!important;inset:auto!important;width:60px!important;height:60px!important;padding:0!important;margin:0!important;transform:none!important;background:transparent!important;border:0!important;box-shadow:none!important;overflow:visible!important;z-index:1000!important;visibility:visible!important;opacity:1!important;display:block!important;pointer-events:auto!important}
              #mkStickyDiscovery.mk-discovery-orb .mk-sticky-discovery-inner{position:absolute!important;inset:0!important;display:block!important;width:60px!important;height:60px!important;padding:0!important;margin:0!important;background:none!important;border:0!important;box-shadow:none!important;overflow:visible!important;transform:none!important}
              #mkStickyDiscovery.mk-discovery-orb .mk-orb-toggle{position:absolute;inset:0;display:grid;place-items:center;width:60px;height:60px;padding:0;border:1px solid #c9a227;border-radius:50%;background:#151515;color:#d4af37;font-size:23px;box-shadow:0 5px 22px #0003;cursor:grab;touch-action:none;user-select:none}
              #mkStickyDiscovery.mk-discovery-orb .mk-orb-toggle:active{cursor:grabbing}
              #mkStickyDiscovery.mk-discovery-orb .mk-sticky-action{position:absolute!important;inset:-4px auto auto -4px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;width:68px!important;min-width:0!important;height:68px!important;min-height:0!important;padding:0!important;margin:0!important;gap:3px!important;border:1px solid #d8c48b!important;border-radius:50%!important;background:#fff!important;color:#282828!important;box-shadow:0 4px 15px #0002!important;opacity:0;visibility:hidden;pointer-events:none;transform:translate(0,0)!important;transition:transform .22s ease,opacity .18s ease,visibility .18s ease!important}
              #mkStickyDiscovery.mk-discovery-orb.is-open .mk-sticky-action{opacity:1;visibility:visible;pointer-events:auto;transform:translate(var(--orb-x),var(--orb-y))!important}
              #mkStickyDiscovery.mk-discovery-orb .mk-sticky-action.active{background:#fbf3df!important;color:#896815!important}
              #mkStickyDiscovery.mk-discovery-orb .mk-sticky-icon{display:grid!important;place-items:center!important;width:auto!important;height:auto!important;margin:0!important;background:none!important;color:inherit!important;font-size:20px!important}
              #mkStickyDiscovery.mk-discovery-orb .mk-sticky-text{display:block!important;font:500 11px/1.2 "Poppins",sans-serif!important;color:inherit!important;text-align:center!important}.mk-discovery-orb .mk-sticky-text small{display:none!important}.mk-discovery-orb .mk-sticky-text strong{font:inherit!important}
              #mkStickyDiscovery.mk-discovery-orb button:focus-visible{outline:3px solid #c9a227;outline-offset:3px}
              @media(prefers-reduced-motion:reduce){#mkStickyDiscovery.mk-discovery-orb .mk-sticky-action{transition:none!important}}
            `;
            document.head.appendChild(css);
            let position = { x: window.innerWidth - 78, y: window.innerHeight - 148 };
            let dragging = null;
            let suppressClick = false;
            const clamp = (value, max) => Math.max(12, Math.min(value, Math.max(12, max - 72)));
            try {
                const saved = JSON.parse(localStorage.getItem("econKitchenOrbPosition"));
                if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y))
                    position = { x: saved.x * window.innerWidth, y: saved.y * window.innerHeight };
            } catch (_) {}
            function place() {
                position.x = clamp(position.x, window.innerWidth);
                position.y = clamp(position.y, window.innerHeight);
                nav.style.setProperty("left", position.x + "px", "important");
                nav.style.setProperty("top", position.y + "px", "important");
                const sx = position.x > window.innerWidth / 2 ? -1 : 1;
                const sy = position.y > window.innerHeight / 2 ? -1 : 1;
                // Two concentric fans; all six actions remain separate.
                const points = [[92,0],[65,65],[0,92],[184,0],[130,130],[0,184]];
                actions.forEach((button, index) => {
                    const point = points[index % points.length];
                    const x = point[0] * sx;
                    const y = point[1] * sy;
                    button.style.setProperty("--orb-x", x + "px");
                    button.style.setProperty("--orb-y", y + "px");
                });
            }
            function savePosition() {
                try { localStorage.setItem("econKitchenOrbPosition", JSON.stringify({
                    x: position.x / window.innerWidth, y: position.y / window.innerHeight
                })); } catch (_) {}
            }
            function open(value) {
                if (value) {
                    // Reserve the complete fan area instead of clamping individual
                    // buttons onto one another near the viewport edges.
                    const reserve = 224;
                    const right = position.x > window.innerWidth / 2;
                    const bottom = position.y > window.innerHeight / 2;
                    position.x = right ? Math.max(reserve, position.x) : Math.min(position.x, window.innerWidth - reserve - 60);
                    position.y = bottom ? Math.max(reserve, position.y) : Math.min(position.y, window.innerHeight - reserve - 60);
                }
                nav.classList.toggle("is-open", value);
                toggle.setAttribute("aria-expanded", String(value));
                toggle.firstElementChild.textContent = value ? "×" : "☰";
                toggle.setAttribute("aria-label", value ? "Close kitchen menu" : "Open kitchen menu; drag to move");
                actions.forEach(button => button.tabIndex = value ? 0 : -1);
                place();
            }
            actions.forEach(button => {
                const label = button.querySelector("strong")?.textContent.trim() || "Kitchen action";
                button.setAttribute("aria-label", label);
                button.title = label;
                button.addEventListener("click", () => { open(false); toggle.focus({ preventScroll:true }); });
            });
            toggle.addEventListener("click", () => {
                if (suppressClick) { suppressClick = false; return; }
                open(!nav.classList.contains("is-open"));
            });
            toggle.addEventListener("pointerdown", event => {
                if (!event.isPrimary || event.button !== 0) return;
                suppressClick = false;
                dragging = { id:event.pointerId, startX:event.clientX, startY:event.clientY, x:position.x, y:position.y, moved:false };
                toggle.setPointerCapture(event.pointerId);
            });
            toggle.addEventListener("pointermove", event => {
                if (!dragging || dragging.id !== event.pointerId) return;
                const dx = event.clientX - dragging.startX, dy = event.clientY - dragging.startY;
                if (!dragging.moved && Math.hypot(dx,dy) <= 6) return;
                dragging.moved = true;
                open(false);
                position = { x:dragging.x + dx, y:dragging.y + dy };
                place();
            });
            function finishDrag(event) {
                if (!dragging || dragging.id !== event.pointerId) return;
                suppressClick = dragging.moved;
                dragging = null;
                if (toggle.hasPointerCapture(event.pointerId)) toggle.releasePointerCapture(event.pointerId);
                savePosition();
            }
            toggle.addEventListener("pointerup", finishDrag);
            toggle.addEventListener("pointercancel", finishDrag);
            document.addEventListener("click", event => { if (!nav.contains(event.target)) open(false); });
            document.addEventListener("keydown", event => {
                if (event.key === "Escape" && nav.classList.contains("is-open")) {
                    open(false); toggle.focus({ preventScroll:true });
                }
            });
            toggle.addEventListener("keydown", event => {
                if (!event.shiftKey || !["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)) return;
                event.preventDefault();
                position.x += event.key === "ArrowRight" ? 20 : event.key === "ArrowLeft" ? -20 : 0;
                position.y += event.key === "ArrowDown" ? 20 : event.key === "ArrowUp" ? -20 : 0;
                place(); savePosition();
            });
            window.addEventListener("resize", () => { place(); savePosition(); });
            open(false);
        }
        initializeDiscoveryOrb();








        console.log(

            "ECON Kitchen Designs Loaded:",

            kitchenDesigns.length

        );







        /* =====================================================

           CONSULTATION FORM

        ====================================================== */



        const consultationForm =

            document.getElementById(

                "mkConsultationForm"

            );





        const submitButton =

            document.getElementById(

                "mkSubmitBtn"

            );





        const thankYouPopup =

            document.getElementById(

                "mkThankYouPopup"

            );





        const popupClose =

            document.getElementById(

                "mkPopupClose"

            );





        const popupDone =

            document.getElementById(

                "mkPopupDone"

            );





        const serviceOptions =

            document.querySelectorAll(

                ".mk-service-option"

            );







        /* =====================================================

           SERVICE OPTIONS

        ====================================================== */



        serviceOptions.forEach(

            option => {





                const radio =



                    option.querySelector(

                        "input[type='radio']"

                    );





                if (!radio) {



                    return;



                }





                radio.addEventListener(

                    "change",

                    () => {





                        serviceOptions.forEach(

                            item => {



                                item.classList.remove(

                                    "active"

                                );



                            }

                        );





                        if (

                            radio.checked

                        ) {



                            option.classList.add(

                                "active"

                            );



                        }





                    }

                );





            }

        );







        /* =====================================================

           PHONE

        ====================================================== */



        const phoneInput =

            document.getElementById(

                "mkPhone"

            );





        phoneInput

            ?.addEventListener(

                "input",

                function () {





                    this.value =



                        this.value



                            .replace(

                                /\D/g,

                                ""

                            )



                            .slice(

                                0,

                                10

                            );





                }

            );







        /* =====================================================

           FIELD ERRORS

        ====================================================== */



        function setFieldError(

            field,

            message

        ) {



            if (!field) {



                return;



            }





            const wrapper =



                field.closest(

                    ".mk-field"

                );





            if (!wrapper) {



                return;



            }





            wrapper.classList.add(

                "mk-invalid"

            );





            const error =



                wrapper.querySelector(

                    ".mk-error"

                );





            if (

                error

            ) {



                error.textContent =

                    message;



            }



        }







        function clearFieldError(

            field

        ) {



            if (!field) {



                return;



            }





            const wrapper =



                field.closest(

                    ".mk-field"

                );





            if (!wrapper) {



                return;



            }





            wrapper.classList.remove(

                "mk-invalid"

            );





            const error =



                wrapper.querySelector(

                    ".mk-error"

                );





            if (

                error

            ) {



                error.textContent =

                    "";



            }



        }







        /* =====================================================

           VALIDATION

        ====================================================== */



        function validateConsultationForm() {



            let valid =

                true;





            const name =

                document.getElementById(

                    "mkName"

                );





            const phone =

                document.getElementById(

                    "mkPhone"

                );





            const email =

                document.getElementById(

                    "mkEmail"

                );





            const city =

                document.getElementById(

                    "mkCity"

                );







            clearFieldError(

                name

            );





            if (

                !name ||

                name.value

                    .trim()

                    .length < 2

            ) {



                setFieldError(



                    name,



                    "Please enter your name."



                );





                valid =

                    false;



            }







            clearFieldError(

                phone

            );





            if (

                !phone ||

                !/^[6-9]\d{9}$/.test(

                    phone.value.trim()

                )

            ) {



                setFieldError(



                    phone,



                    "Enter a valid 10-digit mobile number."



                );





                valid =

                    false;



            }







            clearFieldError(

                email

            );





           const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;





            if (

                !email ||

                !emailPattern.test(

                    email.value.trim()

                )

            ) {



                setFieldError(



                    email,



                    "Please enter a valid email address."



                );





                valid =

                    false;



            }







            clearFieldError(

                city

            );





            if (

                !city ||

                !city.value

            ) {



                setFieldError(



                    city,



                    "Please select your city."



                );





                valid =

                    false;



            }







            return valid;



        }







        /* =====================================================

           CLEAR ERRORS ON INPUT

        ====================================================== */



        consultationForm



            ?.querySelectorAll(

                "input, select, textarea"

            )



            .forEach(

                field => {





                    field.addEventListener(

                        "input",

                        () => {



                            clearFieldError(

                                field

                            );



                        }

                    );





                    field.addEventListener(

                        "change",

                        () => {



                            clearFieldError(

                                field

                            );



                        }

                    );





                }

            );







        /* =====================================================

           THANK YOU POPUP

        ====================================================== */



        function openThankYouPopup() {



            if (

                !thankYouPopup

            ) {



                return;



            }





            thankYouPopup.classList.add(

                "active"

            );





            thankYouPopup.setAttribute(



                "aria-hidden",



                "false"



            );





            document.body.style.overflow =

                "hidden";



        }







        function closeThankYouPopup() {



            if (

                !thankYouPopup

            ) {



                return;



            }





            thankYouPopup.classList.remove(

                "active"

            );





            thankYouPopup.setAttribute(



                "aria-hidden",



                "true"



            );





            document.body.style.overflow =

                "";



        }







        popupClose

            ?.addEventListener(

                "click",

                closeThankYouPopup

            );





        popupDone

            ?.addEventListener(

                "click",

                closeThankYouPopup

            );







        thankYouPopup

            ?.addEventListener(

                "click",

                event => {





                    if (

                        event.target ===

                        thankYouPopup

                    ) {



                        closeThankYouPopup();



                    }





                }

            );







        /* =====================================================

           FIREBASE SUBMIT

        ====================================================== */



        consultationForm

            ?.addEventListener(

                "submit",

                async event => {





                    event.preventDefault();





                    if (

                        !validateConsultationForm()

                    ) {



                        return;



                    }





                    if (

                        submitButton

                    ) {



                        submitButton.classList.add(

                            "loading"

                        );





                        submitButton.disabled =

                            true;



                    }







                    try {
                        const { db, collection, addDoc, serverTimestamp } = await getLeadStorage();





                        const formData =



                            new FormData(

                                consultationForm

                            );





                        const selectedService =



                            consultationForm

                                .querySelector(

                                    "input[name='service']:checked"

                                );







                        const leadData = {





                            name:



                                String(

                                    formData.get(

                                        "name"

                                    ) || ""

                                )

                                    .trim(),





                            phone:



                                String(

                                    formData.get(

                                        "phone"

                                    ) || ""

                                )

                                    .trim(),





                            email:



                                String(

                                    formData.get(

                                        "email"

                                    ) || ""

                                )

                                    .trim(),





                            city:



                                String(

                                    formData.get(

                                        "city"

                                    ) || ""

                                )

                                    .trim(),





                            service:



                                selectedService

                                    ?.value ||



                                "Modular Kitchen",





                            message:



                                String(

                                    formData.get(

                                        "message"

                                    ) || ""

                                )

                                    .trim(),





                            source:



                                "Modular Kitchen Consultation",





                            page:



                                window.location.pathname,





                            status:



                                "new",





                            createdAt:



                                serverTimestamp()





                        };







                        await addDoc(



                            collection(

                                db,

                                "websiteLeads"

                            ),



                            leadData



                        );







                        consultationForm.reset();







                        serviceOptions.forEach(

                            option => {



                                option.classList.remove(

                                    "active"

                                );



                            }

                        );







                        const firstService =

                            serviceOptions[0];





                        if (

                            firstService

                        ) {



                            firstService.classList.add(

                                "active"

                            );





                            const radio =



                                firstService.querySelector(

                                    "input[type='radio']"

                                );





                            if (

                                radio

                            ) {



                                radio.checked =

                                    true;



                            }



                        }







                        openThankYouPopup();





                    }

                    catch (

                    error

                    ) {





                        console.error(



                            "ECON Consultation Form Error:",



                            error



                        );





                        alert(



                            "Something went wrong. Please try again or contact us directly."



                        );





                    }

                    finally {





                        if (

                            submitButton

                        ) {



                            submitButton.classList.remove(

                                "loading"

                            );





                            submitButton.disabled =

                                false;



                        }





                    }





                }

            );







        /* =====================================================

           FAQ

        ====================================================== */



        const faqItems =

            document.querySelectorAll(

                ".econ-faq-item"

            );





        faqItems.forEach(

            item => {





                const question =



                    item.querySelector(

                        ".econ-faq-question"

                    );





                if (!question) {



                    return;



                }





                question.setAttribute(



                    "aria-expanded",



                    item.classList.contains(

                        "active"

                    )



                        ? "true"



                        : "false"



                );





                question.addEventListener(

                    "click",

                    () => {





                        const isActive =



                            item.classList.contains(

                                "active"

                            );





                        faqItems.forEach(

                            other => {





                                if (

                                    other ===

                                    item

                                ) {



                                    return;



                                }





                                other.classList.remove(

                                    "active"

                                );





                                other

                                    .querySelector(

                                        ".econ-faq-question"

                                    )

                                    ?.setAttribute(



                                        "aria-expanded",



                                        "false"



                                    );





                            }

                        );





                        if (

                            isActive

                        ) {



                            item.classList.remove(

                                "active"

                            );





                            question.setAttribute(



                                "aria-expanded",



                                "false"



                            );



                        }

                        else {



                            item.classList.add(

                                "active"

                            );





                            question.setAttribute(



                                "aria-expanded",



                                "true"



                            );



                        }





                    }

                );





            }

        );







        /* =====================================================

           SMOOTH INTERNAL LINKS

        ====================================================== */



        document



            .querySelectorAll(

                'a[href^="#"]'

            )



            .forEach(

                link => {





                    link.addEventListener(

                        "click",

                        event => {





                            const href =



                                link.getAttribute(

                                    "href"

                                );





                            if (

                                !href ||

                                href === "#"

                            ) {



                                return;



                            }





                            const target =



                                document.querySelector(

                                    href

                                );





                            if (

                                !target

                            ) {



                                return;



                            }





                            event.preventDefault();





                            target.scrollIntoView({



                                behavior:

                                    "smooth",



                                block:

                                    "center"



                            });





                        }

                    );





                }

            );







        /* =====================================================

           ESCAPE KEY

        ====================================================== */



        document.addEventListener(

            "keydown",

            event => {





                if (

                    event.key !==

                    "Escape"

                ) {



                    return;



                }





                closeThankYouPopup();





            }

        );





    }

);
