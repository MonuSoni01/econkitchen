/* =========================================================
   ECON KITCHEN
   WHO WE ARE PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. SMOOTH INTERNAL SCROLL
    ====================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const reduceMotion =
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       02. REVEAL ON SCROLL
    ====================================================== */

    const revealElements =
        document.querySelectorAll("[data-reveal]");

    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {

        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

    } else {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) return;

                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);

                    });

                },
                {
                    threshold:0.14,
                    rootMargin:"0px 0px -40px 0px"
                }
            );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    }


    /* =====================================================
       03. NUMBER COUNTERS
    ====================================================== */

    const counters =
        document.querySelectorAll(".wwa-counter[data-count]");

    const animateCounter = (element) => {

        if (element.dataset.animated === "true") return;

        element.dataset.animated = "true";

        const target =
            Number(element.dataset.count || 0);

        const suffix =
            element.dataset.suffix || "";

        if (reduceMotion) {
            element.textContent = `${target}${suffix}`;
            return;
        }

        const duration = 1200;
        const startTime = performance.now();

        const update = (now) => {

            const progress =
                Math.min((now - startTime) / duration, 1);

            const eased =
                1 - Math.pow(1 - progress, 3);

            const current =
                Math.round(target * eased);

            element.textContent =
                `${current}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            }

        };

        requestAnimationFrame(update);

    };


    if ("IntersectionObserver" in window && !reduceMotion) {

        const counterObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) return;

                        animateCounter(entry.target);
                        observer.unobserve(entry.target);

                    });

                },
                {
                    threshold:0.5
                }
            );

        counters.forEach((counter) => {
            counterObserver.observe(counter);
        });

    } else {

        counters.forEach(animateCounter);

    }


    /* =====================================================
       04. TIMELINE INTERACTION
    ====================================================== */

    const timelineItems =
        document.querySelectorAll("[data-timeline-item]");

    timelineItems.forEach((item) => {

        const dot =
            item.querySelector(".wwa-timeline-dot");

        if (!dot) return;

        dot.addEventListener("click", () => {

            timelineItems.forEach((timelineItem) => {
                timelineItem.classList.remove("is-active");
            });

            item.classList.add("is-active");

        });

    });


    /* =====================================================
       05. IMAGE FALLBACK
       Keeps the page usable if a future legacy image path
       is added incorrectly.
    ====================================================== */

    const images =
        document.querySelectorAll(
            ".wwa-story-image img, .wwa-vault-image img, .wwa-authority-image img"
        );

    images.forEach((image) => {

        image.addEventListener(
            "error",
            () => {

                if (image.dataset.fallbackApplied === "true") return;

                image.dataset.fallbackApplied = "true";
                image.src = "/assets/images/about.png";

            },
            { once:true }
        );

    });


    /* =====================================================
       06. ACTIVE HASH SUPPORT
       If page opens with #section, move after layout loads.
    ====================================================== */

    if (window.location.hash) {

        window.setTimeout(() => {

            const target =
                document.querySelector(window.location.hash);

            if (!target) return;

            target.scrollIntoView({
                behavior:"auto",
                block:"start"
            });

        }, 120);

    }

});