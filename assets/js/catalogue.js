/* =========================================================
   ADDITIONAL CATALOGUES
   Edit title, image and url in these six entries.
   url accepts a PDF URL or the Google Drive sharing link.
   Example: https://drive.google.com/file/d/YOUR_FILE_ID/view
   Empty links keep their buttons disabled until configured.
========================================================= */
(() => {
    "use strict";
    const catalogues = [
        { title: "Catalogue 01", image: "/assets/images/catalogues/1.webp", url: "" },
        { title: "Catalogue 02", image: "/assets/images/catalogues/2.webp", url: "" },
        { title: "Catalogue 03", image: "/assets/images/catalogues/3.webp", url: "" },
        { title: "Catalogue 04", image: "/assets/images/catalogues/4.webp", url: "" },
        { title: "Catalogue 05", image: "/assets/images/catalogues/5.webp", url: "" },
        { title: "Catalogue 06", image: "/assets/images/catalogues/6.webp", url: "" }
    ];
    function renderCatalogueCards() {
        const grid = document.getElementById("additionalCatalogueGrid");
        if (!grid) return;
        const fragment = document.createDocumentFragment();
        catalogues.forEach(item => {
            const card = document.createElement("article");
            card.className = "ecat-card";
            const imageWrap = document.createElement("div");
            imageWrap.className = "ecat-image-wrap";
            const image = document.createElement("img");
            image.className = "ecat-image";
            image.alt = item.title + " cover";
            image.width = 800; image.height = 600;
            image.loading = "lazy"; image.decoding = "async";
            image.addEventListener("error", () => {
                image.src = "/assets/images/catalogue-placeholder.svg";
            }, { once: true });
            image.src = item.image || "/assets/images/catalogue-placeholder.svg";
            imageWrap.appendChild(image);
            const details = document.createElement("div");
            details.className = "ecat-details";
            const heading = document.createElement("h3");
            heading.className = "ecat-title";
            heading.textContent = item.title;
            let url = null;
            try {
                if (item.url.trim()) {
                    const parsed = new URL(item.url, window.location.href);
                    if (["https:", "http:"].includes(parsed.protocol)) url = parsed.href;
                }
            } catch (error) { console.warn("Invalid catalogue link:", item.title); }
            const button = document.createElement(url ? "a" : "button");
            button.className = "ecat-button";
            button.textContent = "Open Catalog";
            if (url) {
                button.href = url;
                button.target = "_blank";
                button.rel = "noopener noreferrer";
                button.setAttribute("aria-label", "Open " + item.title + " in a new tab");
                const arrow = document.createElement("span");
                arrow.textContent = "↗";
                arrow.setAttribute("aria-hidden", "true");
                button.appendChild(arrow);
            } else {
                button.type = "button";
                button.disabled = true;
                button.title = "Catalogue coming soon";
                button.setAttribute("aria-label", item.title + " — coming soon");
            }
            details.append(heading, button);
            card.append(imageWrap, details);
            fragment.appendChild(card);
        });
        grid.replaceChildren(fragment);
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderCatalogueCards, { once: true });
    } else renderCatalogueCards();
})();

(() => {
    "use strict";
    /* =====================================================
       CONFIGURATION
    ====================================================== */
    const CONFIG = {
        pdfUrl: "flipbook.pdf",
        pdfWorker:
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
        pageFlip: {
            minWidth: 280,
            minHeight: 396,
            maxWidth: 620,
            maxHeight: 877,
            flippingTime: 850,
            maxShadowOpacity: 0.42
        },
        render: {
            desktopScale: 2.0,
            tabletScale: 1.75,
            mobileScale: 1.45,
            maxPixelRatio: 2
        },
        zoom: {
            min: 1,
            max: 1.8,
            step: 0.1
        }
    };
    /* =====================================================
       DOM
    ====================================================== */
    const section =
        document.getElementById("catalogueSection");
    const viewer =
        document.getElementById("catalogueViewer");
    const loader =
        document.getElementById("catalogueLoader");
    const progress =
        document.getElementById("catalogueProgress");
    const errorBox =
        document.getElementById("catalogueError");
    const stage =
        document.getElementById("catalogueStage");
    const shell =
        document.getElementById("catalogueBookShell");
    const bookElement =
        document.getElementById("catalogueBook");
    const navigation =
        document.getElementById("catalogueNavigation");
    const toolbar =
        document.getElementById("catalogueToolbar");
    const help =
        document.getElementById("catalogueHelp");
    const prevButton =
        document.getElementById("cataloguePrev");
    const nextButton =
        document.getElementById("catalogueNext");
    const pageCounter =
        document.getElementById("cataloguePageCounter");
    const zoomOutButton =
        document.getElementById("catalogueZoomOut");
    const zoomInButton =
        document.getElementById("catalogueZoomIn");
    const zoomResetButton =
        document.getElementById("catalogueZoomReset");
    const zoomValue =
        document.getElementById("catalogueZoomValue");
    const fullscreenButton =
        document.getElementById("catalogueFullscreen");
    /* =====================================================
       STATE
    ====================================================== */
    let pdfDocument = null;
    let pageFlip = null;
    let totalPages = 0;
    let pdfAspectRatio = 0.707;
    let currentZoom = 1;
    let currentMode = null;
    let resizeTimer = null;
    let isReady = false;
    let renderedPages = [];
    /* =====================================================
       HELPERS
    ====================================================== */
    function isMobile() {
        return window.matchMedia(
            "(max-width: 700px)"
        ).matches;
    }
    function isTablet() {
        return window.matchMedia(
            "(max-width: 1024px)"
        ).matches;
    }
    function getDisplayMode() {
        /*
            Mobile:
            Always single page.
            Tablet:
            Use portrait/single when width is limited.
            Desktop:
            Double page.
        */
        if (isMobile()) {
            return "single";
        }
        if (
            window.innerWidth <= 900 &&
            window.innerWidth < window.innerHeight
        ) {
            return "single";
        }
        return "double";
    }
    function getRenderScale() {
        if (isMobile()) {
            return CONFIG.render.mobileScale;
        }
        if (isTablet()) {
            return CONFIG.render.tabletScale;
        }
        return CONFIG.render.desktopScale;
    }
    function getSafePixelRatio() {
        return Math.min(
            window.devicePixelRatio || 1,
            CONFIG.render.maxPixelRatio
        );
    }
    /* =====================================================
       PDF.JS
    ====================================================== */
    function configurePDFJS() {
        if (!window.pdfjsLib) {
            throw new Error(
                "PDF.js failed to load."
            );
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            CONFIG.pdfWorker;
    }
    /* =====================================================
       LOAD PDF
    ====================================================== */
    async function loadPDF() {
        progress.textContent =
            "Loading PDF...";
        const loadingTask =
            window.pdfjsLib.getDocument(
                CONFIG.pdfUrl
            );
        pdfDocument =
            await loadingTask.promise;
        totalPages =
            pdfDocument.numPages;
        /*
            Read actual dimensions from first page.
        */
        const firstPage =
            await pdfDocument.getPage(1);
        const viewport =
            firstPage.getViewport({
                scale: 1
            });
        pdfAspectRatio =
            viewport.width /
            viewport.height;
        return pdfDocument;
    }
    /* =====================================================
       RENDER SINGLE PDF PAGE
    ====================================================== */
    async function renderPDFPage(pageNumber) {
        const pdfPage =
            await pdfDocument.getPage(
                pageNumber
            );
        const baseScale =
            getRenderScale();
        const pixelRatio =
            getSafePixelRatio();
        const viewport =
            pdfPage.getViewport({
                scale:
                    baseScale *
                    pixelRatio
            });
        const canvas =
            document.createElement(
                "canvas"
            );
        const context =
            canvas.getContext(
                "2d",
                {
                    alpha: false
                }
            );
        canvas.width =
            Math.floor(
                viewport.width
            );
        canvas.height =
            Math.floor(
                viewport.height
            );
        /*
            CSS dimensions remain proportional
            while internal canvas stays sharp.
        */
        canvas.style.width =
            "100%";
        canvas.style.height =
            "100%";
        const renderContext = {
            canvasContext:
                context,
            viewport:
                viewport
        };
        await pdfPage.render(
            renderContext
        ).promise;
        /*
            Create PageFlip page element.
        */
        const pageElement =
            document.createElement(
                "div"
            );
        pageElement.className =
            "catalogue-page";
        pageElement.dataset.pageNumber =
            String(pageNumber);
        /*
            First page = front cover.
            Last page = back cover.
        */
        if (
            pageNumber === 1 ||
            pageNumber === totalPages
        ) {
            pageElement.classList.add(
                "catalogue-cover"
            );
            pageElement.dataset.density =
                "hard";
        }
        else {
            pageElement.dataset.density =
                "soft";
        }
        const inner =
            document.createElement(
                "div"
            );
        inner.className =
            "catalogue-page-inner";
        inner.appendChild(
            canvas
        );
        pageElement.appendChild(
            inner
        );
        return pageElement;
    }
    /* =====================================================
       RENDER ALL PAGES
    ====================================================== */
    async function renderAllPages() {
        renderedPages = [];
        bookElement.innerHTML = "";
        for (
            let pageNumber = 1;
            pageNumber <= totalPages;
            pageNumber++
        ) {
            progress.textContent =
                `Rendering pages ${pageNumber} / ${totalPages}`;
            const pageElement =
                await renderPDFPage(
                    pageNumber
                );
            renderedPages.push(
                pageElement
            );
            bookElement.appendChild(
                pageElement
            );
            /*
                Yield occasionally so browser
                remains responsive.
            */
            if (
                pageNumber % 2 === 0
            ) {
                await new Promise(
                    resolve =>
                        requestAnimationFrame(
                            resolve
                        )
                );
            }
        }
    }
    /* =====================================================
       CALCULATE BOOK SIZE
    ====================================================== */
    function calculateBookSize() {
        const mode =
            getDisplayMode();
        const stageRect =
            stage.getBoundingClientRect();
        const availableWidth =
            Math.max(
                280,
                stageRect.width - 20
            );
        const availableHeight =
            Math.max(
                390,
                stageRect.height - 10
            );
        let pageWidth;
        let pageHeight;
        if (mode === "single") {
            /*
                One complete portrait page.
            */
            pageHeight =
                Math.min(
                    availableHeight,
                    availableWidth /
                    pdfAspectRatio
                );
            pageWidth =
                pageHeight *
                pdfAspectRatio;
            if (
                pageWidth >
                availableWidth
            ) {
                pageWidth =
                    availableWidth;
                pageHeight =
                    pageWidth /
                    pdfAspectRatio;
            }
        }
        else {
            /*
                Two-page spread.
            */
            const maxPageWidth =
                availableWidth / 2;
            pageHeight =
                Math.min(
                    availableHeight,
                    maxPageWidth /
                    pdfAspectRatio
                );
            pageWidth =
                pageHeight *
                pdfAspectRatio;
            if (
                pageWidth * 2 >
                availableWidth
            ) {
                pageWidth =
                    availableWidth / 2;
                pageHeight =
                    pageWidth /
                    pdfAspectRatio;
            }
        }
        return {
            width:
                Math.floor(
                    pageWidth
                ),
            height:
                Math.floor(
                    pageHeight
                ),
            mode:
                mode
        };
    }
    /* =====================================================
       INITIALIZE PAGEFLIP
    ====================================================== */
    function initializePageFlip(
        startPage = 0
    ) {
        if (!window.St) {
            throw new Error(
                "StPageFlip library failed to load."
            );
        }
        const dimensions =
            calculateBookSize();
        currentMode =
            dimensions.mode;
        /*
            Destroy previous instance if required.
        */
        if (pageFlip) {
            try {
                pageFlip.destroy();
            }
            catch (error) {
                console.warn(
                    "PageFlip destroy warning:",
                    error
                );
            }
            pageFlip = null;
        }
        /*
            PageFlip destroy may alter/remove DOM,
            so restore page elements when needed.
        */
        if (
            bookElement.children.length !==
            totalPages
        ) {
            bookElement.innerHTML = "";
            renderedPages.forEach(
                page => {
                    bookElement.appendChild(
                        page
                    );
                }
            );
        }
        pageFlip =
            new window.St.PageFlip(
                bookElement,
                {
                    width:
                        dimensions.width,
                    height:
                        dimensions.height,
                    size:
                        "fixed",
                    minWidth:
                        Math.min(
                            CONFIG.pageFlip.minWidth,
                            dimensions.width
                        ),
                    maxWidth:
                        CONFIG.pageFlip.maxWidth,
                    minHeight:
                        Math.min(
                            CONFIG.pageFlip.minHeight,
                            dimensions.height
                        ),
                    maxHeight:
                        CONFIG.pageFlip.maxHeight,
                    showCover:
                        true,
                    /*
                        Critical:
                        Portrait = one page.
                        Landscape = two pages.
                    */
                    usePortrait:
                        dimensions.mode ===
                        "single",
                    autoSize:
                        false,
                    drawShadow:
                        true,
                    maxShadowOpacity:
                        CONFIG.pageFlip.maxShadowOpacity,
                    showPageCorners:
                        true,
                    disableFlipByClick:
                        false,
                    mobileScrollSupport:
                        true,
                    flippingTime:
                        CONFIG.pageFlip.flippingTime,
                    clickEventForward:
                        true,
                    swipeDistance:
                        25,
                    useMouseEvents:
                        true,
                    startPage:
                        Math.max(
                            0,
                            Math.min(
                                startPage,
                                totalPages - 1
                            )
                        )
                }
            );
        pageFlip.loadFromHTML(
            document.querySelectorAll(
                ".catalogue-page"
            )
        );
        bindPageFlipEvents();
        /*
            Guarantee front cover is initial page.
        */
        pageFlip.turnToPage(
            Math.max(
                0,
                Math.min(
                    startPage,
                    totalPages - 1
                )
            )
        );
        updateInterface();
    }
    /* =====================================================
       PAGEFLIP EVENTS
    ====================================================== */
    function bindPageFlipEvents() {
        if (!pageFlip) {
            return;
        }
        pageFlip.on(
            "flip",
            () => {
                updateInterface();
            }
        );
        pageFlip.on(
            "changeOrientation",
            () => {
                updateInterface();
            }
        );
        pageFlip.on(
            "changeState",
            () => {
                updateInterface();
            }
        );
    }
    /* =====================================================
       CURRENT PAGE
    ====================================================== */
    function getCurrentPageIndex() {
        if (!pageFlip) {
            return 0;
        }
        try {
            return pageFlip.getCurrentPageIndex();
        }
        catch (error) {
            return 0;
        }
    }
    /* =====================================================
       PAGE COUNTER
    ====================================================== */
    function getCounterText() {
        const index =
            getCurrentPageIndex();
        const pageNumber =
            index + 1;
        /*
            Mobile / portrait:
            Single page counter.
        */
        if (
            currentMode === "single"
        ) {
            return (
                `${pageNumber} / ${totalPages}`
            );
        }
        /*
            Closed front cover.
        */
        if (index === 0) {
            return (
                `1 / ${totalPages}`
            );
        }
        /*
            Last page / back cover.
        */
        if (
            pageNumber >=
            totalPages
        ) {
            return (
                `${totalPages} / ${totalPages}`
            );
        }
        /*
            StPageFlip spread calculation.
            After cover:
            2–3
            4–5
            6–7
        */
        let leftPage;
        if (
            pageNumber % 2 === 0
        ) {
            leftPage =
                pageNumber;
        }
        else {
            leftPage =
                pageNumber - 1;
        }
        leftPage =
            Math.max(
                2,
                leftPage
            );
        const rightPage =
            Math.min(
                leftPage + 1,
                totalPages
            );
        if (
            leftPage === rightPage
        ) {
            return (
                `${leftPage} / ${totalPages}`
            );
        }
        return (
            `${leftPage}–${rightPage} / ${totalPages}`
        );
    }
    /* =====================================================
       UPDATE UI
    ====================================================== */
    function updateInterface() {
        if (!pageFlip) {
            return;
        }
        const index =
            getCurrentPageIndex();
        pageCounter.textContent =
            getCounterText();
        prevButton.disabled =
            index <= 0;
        nextButton.disabled =
            index >=
            totalPages - 1;
        /*
            Add/remove spine.
        */
        if (
            currentMode === "double" &&
            index > 0 &&
            index < totalPages - 1
        ) {
            section.classList.add(
                "catalogue-open"
            );
        }
        else {
            section.classList.remove(
                "catalogue-open"
            );
        }
    }
    /* =====================================================
       NAVIGATION
    ====================================================== */
    function nextPage() {
        if (!pageFlip) {
            return;
        }
        pageFlip.flipNext();
    }
    function previousPage() {
        if (!pageFlip) {
            return;
        }
        pageFlip.flipPrev();
    }
    /* =====================================================
       ZOOM
    ====================================================== */
    function applyZoom() {
        shell.style.transform =
            `scale(${currentZoom})`;
        zoomValue.textContent =
            `${Math.round(
                currentZoom * 100
            )}%`;
        zoomOutButton.disabled =
            currentZoom <=
            CONFIG.zoom.min;
        zoomInButton.disabled =
            currentZoom >=
            CONFIG.zoom.max;
    }
    function zoomIn() {
        currentZoom =
            Math.min(
                CONFIG.zoom.max,
                Number(
                    (
                        currentZoom +
                        CONFIG.zoom.step
                    ).toFixed(2)
                )
            );
        applyZoom();
    }
    function zoomOut() {
        currentZoom =
            Math.max(
                CONFIG.zoom.min,
                Number(
                    (
                        currentZoom -
                        CONFIG.zoom.step
                    ).toFixed(2)
                )
            );
        applyZoom();
    }
    function resetZoom() {
        currentZoom = 1;
        applyZoom();
    }
    /* =====================================================
       FULLSCREEN
    ====================================================== */
    async function toggleFullscreen() {
        try {
            if (
                !document.fullscreenElement
            ) {
                await section.requestFullscreen();
            }
            else {
                await document.exitFullscreen();
            }
        }
        catch (error) {
            console.error(
                "Fullscreen error:",
                error
            );
        }
    }
    /* =====================================================
       RESIZE
    ====================================================== */
    function handleResize() {
        clearTimeout(
            resizeTimer
        );
        resizeTimer =
            setTimeout(
                () => {
                    if (!isReady) {
                        return;
                    }
                    const newMode =
                        getDisplayMode();
                    /*
                        Only rebuild when layout mode changes.
                        Normal width changes are handled
                        without constantly destroying book.
                    */
                    if (
                        newMode !==
                        currentMode
                    ) {
                        const currentPage =
                            getCurrentPageIndex();
                        resetZoom();
                        initializePageFlip(
                            currentPage
                        );
                    }
                },
                250
            );
    }
    /* =====================================================
       KEYBOARD
    ====================================================== */
    function handleKeyboard(
        event
    ) {
        if (!isReady) {
            return;
        }
        if (
            event.key ===
            "ArrowRight"
        ) {
            event.preventDefault();
            nextPage();
        }
        if (
            event.key ===
            "ArrowLeft"
        ) {
            event.preventDefault();
            previousPage();
        }
        if (
            event.key ===
            "+"
        ) {
            zoomIn();
        }
        if (
            event.key ===
            "-"
        ) {
            zoomOut();
        }
        if (
            event.key ===
            "0"
        ) {
            resetZoom();
        }
    }
    /* =====================================================
       MOUSE WHEEL ZOOM
    ====================================================== */
    function handleWheel(
        event
    ) {
        /*
            Ctrl/Cmd + wheel prevents accidental zooming
            while normal page scrolling remains intact.
        */
        if (
            !event.ctrlKey &&
            !event.metaKey
        ) {
            return;
        }
        event.preventDefault();
        if (
            event.deltaY < 0
        ) {
            zoomIn();
        }
        else {
            zoomOut();
        }
    }
    /* =====================================================
       FULLSCREEN CHANGE
    ====================================================== */
    function handleFullscreenChange() {
        const span =
            fullscreenButton.querySelector(
                "span"
            );
        if (!span) {
            return;
        }
        span.textContent =
            document.fullscreenElement
                ? "Exit Fullscreen"
                : "Fullscreen";
        /*
            Recalculate mode after fullscreen transition
            if required.
        */
        setTimeout(
            () => {
                if (!isReady) {
                    return;
                }
                const newMode =
                    getDisplayMode();
                if (
                    newMode !==
                    currentMode
                ) {
                    initializePageFlip(
                        getCurrentPageIndex()
                    );
                }
            },
            150
        );
    }
    /* =====================================================
       EVENTS
    ====================================================== */
    function bindUIEvents() {
        prevButton.addEventListener(
            "click",
            previousPage
        );
        nextButton.addEventListener(
            "click",
            nextPage
        );
        zoomInButton.addEventListener(
            "click",
            zoomIn
        );
        zoomOutButton.addEventListener(
            "click",
            zoomOut
        );
        zoomResetButton.addEventListener(
            "click",
            resetZoom
        );
        fullscreenButton.addEventListener(
            "click",
            toggleFullscreen
        );
        document.addEventListener(
            "keydown",
            handleKeyboard
        );
        viewer.addEventListener(
            "wheel",
            handleWheel,
            {
                passive: false
            }
        );
        window.addEventListener(
            "resize",
            handleResize
        );
        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );
    }
    /* =====================================================
       READY
    ====================================================== */
    function showCatalogue() {
        loader.hidden = true;
        errorBox.hidden = true;
        stage.hidden = false;
        navigation.hidden = false;
        toolbar.hidden = false;
        help.hidden = false;
        isReady = true;
        applyZoom();
    }
    /* =====================================================
       ERROR
    ====================================================== */
    function showError(
        error
    ) {
        console.error(
            "Catalogue Error:",
            error
        );
        isReady = false;
        loader.hidden = true;
        stage.hidden = true;
        navigation.hidden = true;
        toolbar.hidden = true;
        help.hidden = true;
        errorBox.hidden = false;
    }
    /* =====================================================
       INITIALIZE
    ====================================================== */
    async function initializeCatalogue() {
        try {
            configurePDFJS();
            bindUIEvents();
            await loadPDF();
            progress.textContent =
                `PDF loaded — ${totalPages} pages`;
            await renderAllPages();
            /*
                Stage must become measurable before
                PageFlip is initialized.
            */
            loader.hidden = true;
            stage.hidden = false;
            await new Promise(
                resolve =>
                    requestAnimationFrame(
                        () =>
                            requestAnimationFrame(
                                resolve
                            )
                    )
            );
            initializePageFlip(0);
            showCatalogue();
        }
        catch (error) {
            showError(
                error
            );
        }
    }
    /* =====================================================
       START
    ====================================================== */
    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeCatalogue
        );
    }
    else {
        initializeCatalogue();
    }
})();
