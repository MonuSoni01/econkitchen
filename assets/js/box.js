/* =========================================================
   ECON BOX LANDING PAGE JS
   No external dependency
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------------
       1. Catalogue filter
    --------------------------------------------------------- */
    const filters = document.querySelectorAll(".box-filter");
    const productCards = document.querySelectorAll(".box-product-card");

    filters.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            filters.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            productCards.forEach(card => {
                const categories = (card.dataset.category || "").split(" ");
                const shouldShow = filter === "all" || categories.includes(filter);

                card.classList.toggle("is-hidden", !shouldShow);
            });
        });
    });


    /* ---------------------------------------------------------
       2. Product interest -> move to dealer form
    --------------------------------------------------------- */
    document.querySelectorAll(".box-product-action").forEach(button => {
        button.addEventListener("click", () => {
            const interest = button.dataset.interest || "ECON BOX Cabinet";
            const message = document.querySelector(
                '#econBoxDealerForm textarea[name="message"]'
            );

            if (message) {
                message.value =
                    `I am interested in ${interest}. Please share B2B manufacturing details.`;
            }

            document.querySelector("#dealer-form")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });


    /* ---------------------------------------------------------
       3. FAQ accordion
    --------------------------------------------------------- */
    const faqItems = document.querySelectorAll(".box-faq-item");

    faqItems.forEach(item => {
        const button = item.querySelector("button");
        const icon = item.querySelector("button i");

        button?.addEventListener("click", () => {
            const isOpen = item.classList.contains("active");

            faqItems.forEach(other => {
                other.classList.remove("active");
                const otherIcon = other.querySelector("button i");
                if (otherIcon) otherIcon.textContent = "+";
            });

            if (!isOpen) {
                item.classList.add("active");
                if (icon) icon.textContent = "−";
            }
        });
    });


    /* ---------------------------------------------------------
       4. Scroll reveal
    --------------------------------------------------------- */
    const revealTargets = document.querySelectorAll(
        [
            ".box-value-card",
            ".box-product-card",
            ".box-config-card",
            ".box-process-step",
            ".box-partner-grid article",
            ".box-dealer-form",
            ".box-portal-ui"
        ].join(",")
    );

    revealTargets.forEach(el => el.classList.add("box-reveal"));

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        revealTargets.forEach(el => observer.observe(el));
    } else {
        revealTargets.forEach(el => el.classList.add("is-visible"));
    }


    /* ---------------------------------------------------------
       5. Demo form handler
       Replace this block later with your CRM/API/WhatsApp submit.
    --------------------------------------------------------- */
    const form = document.getElementById("econBoxDealerForm");

    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            showBoxToast(
                "Partner enquiry captured in the demo UI. Connect this form to your CRM/API before going live."
            );
        });
    }


    /* ---------------------------------------------------------
       Toast
    --------------------------------------------------------- */
    function showBoxToast(message) {
        let toast = document.querySelector(".box-toast");

        if (!toast) {
            toast = document.createElement("div");
            toast.className = "box-toast";
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("show");

        window.clearTimeout(window.__econBoxToastTimer);

        window.__econBoxToastTimer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 4200);
    }

});
