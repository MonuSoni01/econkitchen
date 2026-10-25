/* =========================================================
   ECON PLY PAGE JS
   Lightweight only: scroll reveal + safe fallback.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add("is-visible"));
    }

    /* Smooth section jump without affecting existing header component */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const id = link.getAttribute("href");

            if (!id || id === "#") return;

            const target = document.querySelector(id);

            if (target) {
                event.preventDefault();

                const header =
                    document.querySelector("header") ||
                    document.querySelector(".site-header") ||
                    document.querySelector(".main-header");

                const headerOffset = header ? header.offsetHeight + 12 : 12;

                const top =
                    target.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerOffset;

                window.scrollTo({
                    top,
                    behavior: "smooth"
                });
            }
        });
    });
});
