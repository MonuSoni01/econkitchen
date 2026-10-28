window.econHandleData = (() => {
    const imageExtension = "webp";
    const imageBasePath = "/assets/images/kitchen/handle/";
    const groups = [
        {
            key: "gola",
            label: "Gola Handle",
            count: 16
        },
        {
            key: "raised",
            label: "Raised Handle",
            count: 61
        },
        {
            key: "large",
            label: "Large Handle",
            count: 16
        },
        {
            key: "mount",
            label: "Mount Handle",
            count: 16
        },
        {
            key: "inbuilt",
            label: "Inbuilt Handle",
            count: 16
        }
    ];
    return groups.map(group => ({
        ...group,
        items: Array.from(
            { length: group.count },
            (_, index) => {
                const number = index + 1;
                return {
                    id: `handle-${group.key}-${number}`,
                    title:
                        `${group.label} Kitchen ` +
                        String(number).padStart(2, "0"),
                    category: group.label,
                    image:
                        `${imageBasePath}${group.key}/` +
                        `${number}.${imageExtension}`
                };
            }
        )
    }));
})();

(() => {
    function initHandleSection() {
        const section = document.getElementById("handleSection");
        if (!section || section.dataset.initialized === "true") {
            return;
        }
        const groups = window.econHandleData;
        if (!Array.isArray(groups) || !groups.length) {
            return;
        }
        section.dataset.initialized = "true";
        const filters = section.querySelector("#handleFilters");
        const grid = section.querySelector("#handleGrid");
        const title = section.querySelector("#handleTitle");
        const count = section.querySelector("#handleCount");
        const moreButton = section.querySelector("#handleMore");
        const batchSize = 6;
        let activeGroup = groups[0];
        let visibleCount = 0;
        function escapeHTML(value) {
            return String(value).replace(
                /[&<>"']/g,
                character => ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                }[character])
            );
        }
        function createHandleCard(item) {
            const image = escapeHTML(item.image);
            const name = escapeHTML(item.title);
            const category = escapeHTML(item.category);
            const designId = escapeHTML(item.id);
            return `
                <article class="mk-project-card">
                    <div class="mk-project-image-wrap">
                        <a
                            href="${image}"
                            target="_blank"
                            rel="noopener"
                            aria-label="View ${name} image"
                        >
                            <img
                                src="${image}"
                                alt="${name}"
                                class="mk-project-image"
                                loading="lazy"
                                decoding="async"
                            >
                            <span
                                class="mk-project-open"
                                aria-hidden="true"
                            >
                                ↗
                            </span>
                        </a>
                    </div>
                    <div class="mk-project-content">
                        <div class="mk-project-info">
                            <span class="mk-project-category">
                                ${category}
                            </span>
                            <h3 class="mk-project-title">
                                ${name}
                            </h3>
                            <div class="mk-project-details">
                                <span>${designId}</span>
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
                                Calculate Cost
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }
        function showNextCards() {
            const nextItems = activeGroup.items.slice(
                visibleCount,
                visibleCount + batchSize
            );
            grid.insertAdjacentHTML(
                "beforeend",
                nextItems.map(createHandleCard).join("")
            );
            visibleCount += nextItems.length;
            count.textContent =
                `${visibleCount} of ${activeGroup.items.length} Designs`;
            const allVisible =
                visibleCount >= activeGroup.items.length;
            moreButton.hidden = allVisible;
            moreButton.style.display = allVisible ? "none" : "";
        }
        function selectHandleGroup(group) {
            activeGroup = group;
            visibleCount = 0;
            grid.replaceChildren();
            title.textContent = `${group.label} Kitchens`;
            filters.querySelectorAll("button").forEach(button => {
                const isActive =
                    button.dataset.handle === group.key;
                button.classList.toggle("active", isActive);
                button.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });
            showNextCards();
        }
        groups.forEach(group => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "mk-layout-pill";
            button.dataset.handle = group.key;
            button.textContent = group.label;
            button.addEventListener("click", () => {
                selectHandleGroup(group);
            });
            filters.appendChild(button);
        });
        moreButton.addEventListener("click", showNextCards);
        selectHandleGroup(groups[0]);
    }
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initHandleSection,
            { once: true }
        );
    } else {
        initHandleSection();
    }
})();